import fs from 'node:fs/promises';
import path from 'node:path';

import {
  type ResolveRtqContentOptions,
  resolveRtqContentPaths,
} from '@rtq/review-repository-paths';

import type { PaperPdf } from '@/lib/paper-pdf';
import type { FolderKey } from '@/lib/paper-types';

const SAFE_PAPER_STEM = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

type PaperPdfReaderOptions = ResolveRtqContentOptions & {
  pdfRoot?: string;
};

export class PaperPdfRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PaperPdfRequestError';
    this.status = status;
  }
}

function isWithin(root: string, candidate: string) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function paperStem(fileName: string) {
  if (!fileName.toLowerCase().endsWith('.toml')) {
    return undefined;
  }
  const stem = fileName.slice(0, -'.toml'.length);
  return SAFE_PAPER_STEM.test(stem) ? stem : undefined;
}

function configuredPdfRoot(options: PaperPdfReaderOptions) {
  return (
    options.pdfRoot ??
    path.join(
      resolveRtqContentPaths(options).papersPackageRoot,
      'original-papers',
      'pdf-rtq',
    )
  );
}

export async function resolveCanonicalPaperPdf(
  stem: string,
  options: PaperPdfReaderOptions = {},
) {
  if (!SAFE_PAPER_STEM.test(stem)) {
    throw new PaperPdfRequestError('Invalid paper PDF name.', 400);
  }

  let pdfRoot: string;
  try {
    pdfRoot = await fs.realpath(configuredPdfRoot(options));
  } catch {
    throw new PaperPdfRequestError('Paper PDF was not found.', 404);
  }
  const requested = path.resolve(pdfRoot, `${stem}.pdf`);
  if (!isWithin(pdfRoot, requested)) {
    throw new PaperPdfRequestError('Paper PDF path escapes its root.', 403);
  }

  let canonical: string;
  try {
    canonical = await fs.realpath(requested);
  } catch {
    throw new PaperPdfRequestError('Paper PDF was not found.', 404);
  }
  if (!isWithin(pdfRoot, canonical)) {
    throw new PaperPdfRequestError('Paper PDF symlink escapes its root.', 403);
  }
  if (!(await fs.stat(canonical)).isFile()) {
    throw new PaperPdfRequestError('Paper PDF was not found.', 404);
  }
  return canonical;
}

export async function resolvePaperPdf(
  folderKey: FolderKey,
  fileName: string,
  options: PaperPdfReaderOptions = {},
): Promise<PaperPdf | undefined> {
  if (folderKey !== 'toml' && folderKey !== 'focusPaperToml') {
    return undefined;
  }
  const stem = paperStem(fileName);
  if (!stem) {
    return { fileName: `${fileName}.pdf`, state: 'unavailable' };
  }

  return resolvePaperPdfByStem(stem, options);
}

export async function resolvePaperPdfByStem(
  stem: string,
  options: PaperPdfReaderOptions = {},
): Promise<PaperPdf> {
  const pdfFileName = `${stem}.pdf`;
  if (!SAFE_PAPER_STEM.test(stem)) {
    return { fileName: pdfFileName, state: 'unavailable' };
  }

  try {
    await resolveCanonicalPaperPdf(stem, options);
    return {
      fileName: pdfFileName,
      state: 'available',
      url: `/api/papers/pdf/${encodeURIComponent(stem)}`,
    };
  } catch (error) {
    if (error instanceof PaperPdfRequestError && error.status === 404) {
      return { fileName: pdfFileName, state: 'unavailable' };
    }
    throw error;
  }
}

type ByteRange = Readonly<{ end: number; start: number }>;

function parseByteRange(value: string, size: number): ByteRange {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (!match[1] && !match[2])) {
    throw new PaperPdfRequestError('Invalid PDF byte range.', 416);
  }
  if (!match[1]) {
    const suffixLength = Number.parseInt(match[2], 10);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
      throw new PaperPdfRequestError('Invalid PDF byte range.', 416);
    }
    return { end: size - 1, start: Math.max(size - suffixLength, 0) };
  }
  const start = Number.parseInt(match[1], 10);
  const requestedEnd = match[2] ? Number.parseInt(match[2], 10) : size - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(requestedEnd) ||
    start < 0 ||
    start >= size ||
    requestedEnd < start
  ) {
    throw new PaperPdfRequestError('Invalid PDF byte range.', 416);
  }
  return { end: Math.min(requestedEnd, size - 1), start };
}

function responseHeaders(fileName: string, size: number, modifiedAt: Date) {
  return new Headers({
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
    'Content-Disposition': `inline; filename="${fileName}"`,
    'Content-Length': String(size),
    'Content-Type': 'application/pdf',
    'Last-Modified': modifiedAt.toUTCString(),
    'X-Content-Type-Options': 'nosniff',
  });
}

async function readPdfContent(absolutePath: string, range?: ByteRange) {
  if (!range) {
    return new Uint8Array(await fs.readFile(absolutePath));
  }
  const length = range.end - range.start + 1;
  const content = new Uint8Array(length);
  const handle = await fs.open(absolutePath, 'r');
  try {
    const { bytesRead } = await handle.read(content, 0, length, range.start);
    if (bytesRead !== length) {
      throw new Error('Paper PDF changed while its byte range was being read.');
    }
    return content;
  } finally {
    await handle.close();
  }
}

export async function createPaperPdfResponse(
  request: Request,
  stem: string,
  options: PaperPdfReaderOptions = {},
) {
  try {
    const absolutePath = await resolveCanonicalPaperPdf(stem, options);
    const stat = await fs.stat(absolutePath);
    const headers = responseHeaders(`${stem}.pdf`, stat.size, stat.mtime);
    const requestedRange = request.headers.get('range');
    const range = requestedRange
      ? parseByteRange(requestedRange, stat.size)
      : undefined;
    if (range) {
      headers.set(
        'Content-Range',
        `bytes ${range.start}-${range.end}/${stat.size}`,
      );
      headers.set('Content-Length', String(range.end - range.start + 1));
    }
    if (request.method === 'HEAD') {
      return new Response(null, { headers, status: range ? 206 : 200 });
    }
    return new Response(await readPdfContent(absolutePath, range), {
      headers,
      status: range ? 206 : 200,
    });
  } catch (error) {
    if (error instanceof PaperPdfRequestError) {
      const headers = new Headers({
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      });
      if (error.status === 416) {
        try {
          const absolutePath = await resolveCanonicalPaperPdf(stem, options);
          const stat = await fs.stat(absolutePath);
          headers.set('Content-Range', `bytes */${stat.size}`);
        } catch {
          // Preserve the original range response if the file changes.
        }
      }
      return new Response(error.message, { headers, status: error.status });
    }
    throw error;
  }
}
