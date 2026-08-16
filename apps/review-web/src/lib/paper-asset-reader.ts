import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

export const PAPER_IMAGE_EXTENSIONS = ['svg', 'png', 'jpg', 'jpeg'] as const;

const ALLOWED_CONTENT_TYPES = new Map([
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
]);

const SAFE_PATH_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const EXPECTED_PACKAGE_NAME = '@rtq/maths-assets';

type PaperAssetReaderOptions = {
  assetsRoot?: string;
  reviewRepositoryRoot?: string;
};

type ValidatedAssetRoots = {
  assetsRoot: string;
  papersRoot: string;
};

export class PaperAssetRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PaperAssetRequestError';
    this.status = status;
  }
}

export function resolveConfiguredMathsAssetsRoot(
  reviewRepositoryRoot = process.cwd(),
) {
  const configuredRoot = process.env.RTQ_MATHS_ASSETS_ROOT?.trim();

  return path.resolve(
    /* turbopackIgnore: true */
    configuredRoot ||
      path.join(
        reviewRepositoryRoot,
        '../../../rtq-content/packages/assets/assets',
      ),
  );
}

export function resolveCanonicalPaperImageExtension(
  paperStem: string,
  sourceRelativeStem: string,
  assetsRoot = resolveConfiguredMathsAssetsRoot(),
) {
  const paperRoot = path.join(assetsRoot, 'papers', paperStem);
  const matchingExtensions = PAPER_IMAGE_EXTENSIONS.filter(extension =>
    existsSync(path.join(paperRoot, `${sourceRelativeStem}.${extension}`)),
  );

  if (matchingExtensions.length > 1) {
    throw new Error(
      `Ambiguous PaperImage asset for extension-free key ${paperStem}/${sourceRelativeStem}: ${matchingExtensions
        .map(extension => `${sourceRelativeStem}.${extension}`)
        .join(', ')}. Keep exactly one of .svg, .png, .jpg, or .jpeg.`,
    );
  }

  return matchingExtensions[0];
}

function isWithinRoot(root: string, candidate: string) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function normalizeRequestedPath(relativePath: string) {
  if (
    !relativePath ||
    relativePath.startsWith('/') ||
    relativePath.includes('\\') ||
    relativePath.includes('\0')
  ) {
    throw new PaperAssetRequestError('Invalid paper asset path.', 400);
  }

  const rawSegments = relativePath.split('/');
  const segments = rawSegments.map(segment => {
    let decoded: string;

    try {
      decoded = decodeURIComponent(segment);
    } catch {
      throw new PaperAssetRequestError(
        'Invalid encoded paper asset path.',
        400,
      );
    }

    if (
      decoded === '' ||
      decoded === '.' ||
      decoded === '..' ||
      decoded.includes('/') ||
      decoded.includes('\\') ||
      !SAFE_PATH_SEGMENT.test(decoded)
    ) {
      throw new PaperAssetRequestError(
        'Invalid paper asset path segment.',
        400,
      );
    }

    return decoded;
  });

  if (segments[0] !== 'papers') {
    throw new PaperAssetRequestError(
      'Paper assets must use the papers namespace.',
      404,
    );
  }

  return segments;
}

async function validateAssetsRoot(
  options: PaperAssetReaderOptions,
): Promise<ValidatedAssetRoots> {
  const configuredRoot = path.resolve(
    /* turbopackIgnore: true */
    options.assetsRoot ??
      resolveConfiguredMathsAssetsRoot(options.reviewRepositoryRoot),
  );
  const repositoryRoot = path.dirname(configuredRoot);
  const packagePath = path.join(
    /* turbopackIgnore: true */ repositoryRoot,
    'package.json',
  );

  let packageJson: unknown;

  try {
    packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  } catch (error) {
    throw new PaperAssetRequestError(
      `Canonical maths-assets package could not be read at ${packagePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
      500,
    );
  }

  if (
    !packageJson ||
    typeof packageJson !== 'object' ||
    Array.isArray(packageJson) ||
    !('name' in packageJson) ||
    packageJson.name !== EXPECTED_PACKAGE_NAME
  ) {
    throw new PaperAssetRequestError(
      `Expected ${EXPECTED_PACKAGE_NAME} at ${repositoryRoot}.`,
      500,
    );
  }

  try {
    const assetsRoot = await fs.realpath(configuredRoot);
    const papersRoot = await fs.realpath(
      path.join(/* turbopackIgnore: true */ assetsRoot, 'papers'),
    );

    if (!isWithinRoot(assetsRoot, papersRoot)) {
      throw new PaperAssetRequestError(
        'Canonical papers directory escapes the configured assets root.',
        403,
      );
    }

    return { assetsRoot, papersRoot };
  } catch (error) {
    if (error instanceof PaperAssetRequestError) {
      throw error;
    }

    throw new PaperAssetRequestError(
      `Canonical paper assets are unavailable under ${configuredRoot}: ${
        error instanceof Error ? error.message : String(error)
      }`,
      500,
    );
  }
}

function routeYearsForCanonicalYear(year: string) {
  if (year === '9999') {
    return ['9999', 'sample'];
  }

  if (year === 'undated') {
    return ['undated', 'sample'];
  }

  return [year];
}

function canonicalStemMatchesRoute(
  stem: string,
  schoolSlug: string,
  yearOrSample: string,
  paperSlug: string,
) {
  const parts = stem.split('--');

  if (parts.length < 4) {
    return false;
  }

  const canonicalYear = parts.at(-2);
  const canonicalPaperSlug = parts.at(-1);

  return (
    parts[0] === schoolSlug &&
    canonicalYear !== undefined &&
    routeYearsForCanonicalYear(canonicalYear).includes(yearOrSample) &&
    canonicalPaperSlug === paperSlug
  );
}

function validatePaperImageSubpath(segments: string[]) {
  const [scope, provenance, ...remaining] = segments;

  if (scope === 'questions' && provenance && remaining.length === 0) {
    return;
  }

  if (
    (scope === 'workings' || scope === 'answers') &&
    provenance === 'manual' &&
    remaining.length === 1
  ) {
    return;
  }

  throw new PaperAssetRequestError(
    'Only question, manual-working, and manual-answer PaperImage files may be served.',
    404,
  );
}

async function resolveReadableFile(
  root: string,
  candidate: string,
  missingStatus: number,
) {
  const resolvedCandidate = path.resolve(/* turbopackIgnore: true */ candidate);

  if (!isWithinRoot(root, resolvedCandidate)) {
    throw new PaperAssetRequestError(
      'Resolved paper asset path escapes the canonical asset root.',
      403,
    );
  }

  let realCandidate: string;

  try {
    realCandidate = await fs.realpath(resolvedCandidate);
  } catch {
    throw new PaperAssetRequestError(
      'Paper asset was not found.',
      missingStatus,
    );
  }

  if (!isWithinRoot(root, realCandidate)) {
    throw new PaperAssetRequestError(
      'Resolved paper asset symlink escapes the canonical asset root.',
      403,
    );
  }

  const stat = await fs.stat(realCandidate);

  if (!stat.isFile()) {
    throw new PaperAssetRequestError(
      'Paper asset was not found.',
      missingStatus,
    );
  }

  return realCandidate;
}

async function resolveMissingImage(roots: ValidatedAssetRoots) {
  return resolveReadableFile(
    roots.assetsRoot,
    path.join(
      /* turbopackIgnore: true */ roots.papersRoot,
      'missing',
      'missing_image.svg',
    ),
    500,
  );
}

export async function resolveCanonicalPaperAsset(
  relativePath: string,
  options: PaperAssetReaderOptions = {},
) {
  const segments = normalizeRequestedPath(relativePath);
  const extension = path.extname(segments.at(-1) ?? '').toLowerCase();

  if (!ALLOWED_CONTENT_TYPES.has(extension)) {
    throw new PaperAssetRequestError(
      'Unsupported paper asset format; expected SVG, PNG, JPG, or JPEG.',
      415,
    );
  }

  const roots = await validateAssetsRoot(options);

  if (
    segments.length === 3 &&
    segments[1] === 'missing' &&
    segments[2] === 'missing_image.svg'
  ) {
    return resolveMissingImage(roots);
  }

  if (segments.length < 6) {
    throw new PaperAssetRequestError('Incomplete paper asset route.', 404);
  }

  const [, schoolSlug, yearOrSample, paperSlug, ...paperImageSegments] =
    segments;
  validatePaperImageSubpath(paperImageSegments);

  const entries = await fs.readdir(roots.papersRoot, { withFileTypes: true });
  const matchingStems = entries
    .filter(entry => entry.isDirectory() && entry.name !== 'missing')
    .map(entry => entry.name)
    .filter(stem =>
      canonicalStemMatchesRoute(stem, schoolSlug, yearOrSample, paperSlug),
    );

  if (matchingStems.length === 0) {
    throw new PaperAssetRequestError(
      `No canonical paper assets match ${schoolSlug}/${yearOrSample}/${paperSlug}.`,
      404,
    );
  }

  if (matchingStems.length > 1) {
    throw new PaperAssetRequestError(
      `Ambiguous canonical paper asset route ${schoolSlug}/${yearOrSample}/${paperSlug}: ${matchingStems.join(', ')}.`,
      409,
    );
  }

  try {
    return await resolveReadableFile(
      roots.assetsRoot,
      path.join(
        /* turbopackIgnore: true */ roots.papersRoot,
        matchingStems[0],
        ...paperImageSegments,
      ),
      404,
    );
  } catch (error) {
    if (error instanceof PaperAssetRequestError && error.status === 404) {
      return resolveMissingImage(roots);
    }

    throw error;
  }
}

export async function createPaperAssetResponse(
  relativePath: string,
  options: PaperAssetReaderOptions = {},
) {
  try {
    const absolutePath = await resolveCanonicalPaperAsset(
      relativePath,
      options,
    );
    const extension = path.extname(absolutePath).toLowerCase();
    const contentType = ALLOWED_CONTENT_TYPES.get(extension);

    if (!contentType) {
      throw new PaperAssetRequestError(
        'Resolved paper asset format is not public.',
        415,
      );
    }

    const file = await fs.readFile(absolutePath);

    return new Response(new Uint8Array(file), {
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
