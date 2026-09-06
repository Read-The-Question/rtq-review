import fs from 'node:fs/promises';
import path from 'node:path';

import { resolveRtqContentPaths } from '@rtq/review-repository-paths';

const CONTENT_TYPES = new Map([
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
]);
const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export class PaperAssetRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PaperAssetRequestError';
    this.status = status;
  }
}

function isWithin(root: string, candidate: string): boolean {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function requestedSegments(relativePath: string): string[] {
  if (
    !relativePath ||
    relativePath.startsWith('/') ||
    relativePath.includes('\\') ||
    relativePath.includes('\0')
  ) {
    throw new PaperAssetRequestError('Invalid paper asset path.', 400);
  }

  return relativePath.split('/').map((segment) => {
    let decoded: string;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      throw new PaperAssetRequestError('Invalid encoded asset path.', 400);
    }

    if (
      !decoded ||
      decoded === '.' ||
      decoded === '..' ||
      decoded.includes('/') ||
      decoded.includes('\\') ||
      !SAFE_SEGMENT.test(decoded)
    ) {
      throw new PaperAssetRequestError('Invalid asset path segment.', 400);
    }
    return decoded;
  });
}

function allowedSubpath(segments: readonly string[]): boolean {
  const [scope, provenance, kind, file, ...rest] = segments;
  if (rest.length > 0) return false;
  if (scope === 'questions' && provenance && !kind) return true;
  if (
    (scope === 'workings' || scope === 'answers') &&
    provenance === 'manual' &&
    kind &&
    !file
  ) {
    return true;
  }
  return (
    (scope === 'workings' || scope === 'answers') &&
    provenance === 'generated' &&
    kind === 'long-division' &&
    Boolean(file)
  );
}

async function readableFile(root: string, candidate: string): Promise<string> {
  const resolved = path.resolve(/* turbopackIgnore: true */ candidate);
  if (!isWithin(root, resolved)) {
    throw new PaperAssetRequestError('Asset path escapes its root.', 403);
  }

  let canonical: string;
  try {
    canonical = await fs.realpath(resolved);
  } catch {
    throw new PaperAssetRequestError('Paper asset was not found.', 404);
  }
  if (!isWithin(root, canonical)) {
    throw new PaperAssetRequestError('Asset symlink escapes its root.', 403);
  }
  if (!(await fs.stat(canonical)).isFile()) {
    throw new PaperAssetRequestError('Paper asset was not found.', 404);
  }
  return canonical;
}

export async function resolveCanonicalPaperAsset(
  relativePath: string,
): Promise<string> {
  const segments = requestedSegments(relativePath);
  if (segments[0] !== 'papers') {
    throw new PaperAssetRequestError(
      'Only canonical paper assets may be served.',
      404,
    );
  }

  const extension = path.extname(segments.at(-1) ?? '').toLowerCase();
  if (!CONTENT_TYPES.has(extension)) {
    throw new PaperAssetRequestError('Unsupported paper asset format.', 415);
  }

  const configuredRoot = path.resolve(
    /* turbopackIgnore: true */ resolveRtqContentPaths().assetsRoot,
  );
  const assetsRoot = await fs.realpath(configuredRoot);
  const papersRoot = await fs.realpath(
    path.join(/* turbopackIgnore: true */ assetsRoot, 'papers'),
  );
  if (!isWithin(assetsRoot, papersRoot)) {
    throw new PaperAssetRequestError('Invalid canonical asset root.', 500);
  }

  if (
    segments.length === 3 &&
    segments[1] === 'missing' &&
    segments[2] === 'missing_image.svg'
  ) {
    return readableFile(
      assetsRoot,
      path.join(
        /* turbopackIgnore: true */ papersRoot,
        'missing',
        'missing_image.svg',
      ),
    );
  }

  const [, paperStem, ...subpath] = segments;
  if (!paperStem || !allowedSubpath(subpath)) {
    throw new PaperAssetRequestError(
      'Only question, manual solution, and generated long-division assets are public.',
      404,
    );
  }

  const paperRoot = await fs
    .realpath(path.join(/* turbopackIgnore: true */ papersRoot, paperStem))
    .catch(() => {
      throw new PaperAssetRequestError('Unknown canonical paper.', 404);
    });
  if (!isWithin(papersRoot, paperRoot)) {
    throw new PaperAssetRequestError('Invalid canonical paper root.', 403);
  }

  try {
    return await readableFile(
      paperRoot,
      path.join(/* turbopackIgnore: true */ paperRoot, ...subpath),
    );
  } catch (error) {
    if (error instanceof PaperAssetRequestError && error.status === 404) {
      return readableFile(
        assetsRoot,
        path.join(
          /* turbopackIgnore: true */ papersRoot,
          'missing',
          'missing_image.svg',
        ),
      );
    }
    throw error;
  }
}

export async function createPaperAssetResponse(
  relativePath: string,
): Promise<Response> {
  try {
    const absolutePath = await resolveCanonicalPaperAsset(relativePath);
    const contentType = CONTENT_TYPES.get(
      path.extname(absolutePath).toLowerCase(),
    );
    if (!contentType) {
      throw new PaperAssetRequestError('Unsupported paper asset format.', 415);
    }
    const content = await fs.readFile(absolutePath);
    return new Response(new Uint8Array(content), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof PaperAssetRequestError) {
      return new Response(error.message, {
        status: error.status,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    throw error;
  }
}
