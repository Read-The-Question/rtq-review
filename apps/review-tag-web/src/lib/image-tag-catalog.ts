import fs from 'node:fs/promises';

import { IMAGE_DIMENSIONAL_TAG_CATALOG_PATH } from './paper-paths.ts';
import type {
  ImageTagCatalog,
  ImageTagCatalogDimension,
  ImageTagCatalogValue,
  PaperImageScope,
} from './paper-types.ts';

type JsonRecord = Record<string, unknown>;

const IDENTIFIER_PATTERN = /^[a-z][a-z0-9-]*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SUPPORTED_SCOPES = new Set<PaperImageScope>([
  'question',
  'working',
  'answer',
]);

export class ImageTagCatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageTagCatalogError';
  }
}

function fail(message: string): never {
  throw new ImageTagCatalogError(message);
}

function record(value: unknown, context: string): JsonRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${context} must be an object.`);
  }
  return value as JsonRecord;
}

function exactKeys(
  value: JsonRecord,
  keys: readonly string[],
  context: string,
) {
  const expected = new Set(keys);
  for (const key of Object.keys(value)) {
    if (!expected.has(key)) {
      fail(`${context} contains unsupported field ${JSON.stringify(key)}.`);
    }
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) {
      fail(`${context} is missing ${JSON.stringify(key)}.`);
    }
  }
}

function text(value: unknown, context: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${context} must be a non-empty string.`);
  }
  return value;
}

function identifier(value: unknown, context: string) {
  const parsed = text(value, context);
  if (!IDENTIFIER_PATTERN.test(parsed)) {
    fail(`${context} must be a stable lowercase identifier.`);
  }
  return parsed;
}

function array(value: unknown, context: string) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(`${context} must be a non-empty array.`);
  }
  return value;
}

function unique(value: string, seen: Set<string>, context: string) {
  if (seen.has(value)) {
    fail(`${context} duplicates ${JSON.stringify(value)}.`);
  }
  seen.add(value);
}

function date(value: unknown, context: string) {
  const parsed = text(value, context);
  const timestamp = Date.parse(parsed);
  if (
    !DATE_PATTERN.test(parsed) ||
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== parsed
  ) {
    fail(`${context} must be a valid YYYY-MM-DD date.`);
  }
  return parsed;
}

function parseValue(
  input: unknown,
  dimensionKey: string,
  valueKeys: Set<string>,
  index: number,
): ImageTagCatalogValue {
  const context = `dimensions.${dimensionKey}.values[${index}]`;
  const value = record(input, context);
  exactKeys(
    value,
    [
      'value',
      'label',
      'description',
      'status',
      'lastUpdated',
      'requires',
      'guide',
    ],
    context,
  );
  const valueKey = identifier(value.value, `${context}.value`);
  unique(valueKey, valueKeys, `${context}.value`);
  const guide = record(value.guide, `${context}.guide`);
  exactKeys(guide, ['status', 'path'], `${context}.guide`);
  if (guide.status === 'missing') {
    if (guide.path !== null) {
      fail(`${context}.guide.path must be null when its guide is missing.`);
    }
  } else if (guide.status === 'available' || guide.status === 'placeholder') {
    text(guide.path, `${context}.guide.path`);
  } else {
    fail(`${context}.guide.status is unsupported.`);
  }
  if (value.status !== 'supported') {
    fail(`${context}.status must be "supported".`);
  }
  const requiresRecord = record(value.requires, `${context}.requires`);
  const requires: Record<string, string> = {};
  for (const [key, requiredValue] of Object.entries(requiresRecord)) {
    const parsedKey = identifier(key, `${context}.requires key`);
    requires[parsedKey] = identifier(
      requiredValue,
      `${context}.requires.${parsedKey}`,
    );
  }
  return {
    description: text(value.description, `${context}.description`),
    guide: {
      path: guide.path as string | null,
      status: guide.status,
    },
    label: text(value.label, `${context}.label`),
    lastUpdated: date(value.lastUpdated, `${context}.lastUpdated`),
    requires,
    status: 'supported',
    value: valueKey,
  };
}

function parseDimension(
  input: unknown,
  dimensionKeys: Set<string>,
  attributes: Set<string>,
  index: number,
): ImageTagCatalogDimension {
  const context = `dimensions[${index}]`;
  const dimension = record(input, context);
  exactKeys(
    dimension,
    [
      'key',
      'attribute',
      'label',
      'cardinality',
      'inheritance',
      'omission',
      'values',
    ],
    context,
  );
  const key = identifier(dimension.key, `${context}.key`);
  const attribute = identifier(dimension.attribute, `${context}.attribute`);
  unique(key, dimensionKeys, `${context}.key`);
  unique(attribute, attributes, `${context}.attribute`);
  if (dimension.cardinality !== 'zero-or-one') {
    fail(`${context}.cardinality is unsupported.`);
  }
  if (dimension.inheritance !== 'none') {
    fail(`${context}.inheritance is unsupported.`);
  }
  if (dimension.omission !== 'unclassified') {
    fail(`${context}.omission is unsupported.`);
  }
  const valueKeys = new Set<string>();
  const values = array(dimension.values, `${context}.values`).map(
    (value, valueIndex) => parseValue(value, key, valueKeys, valueIndex),
  );
  return {
    attribute,
    cardinality: 'zero-or-one',
    inheritance: 'none',
    key,
    label: text(dimension.label, `${context}.label`),
    omission: 'unclassified',
    values,
  };
}

export function validateImageTagCatalog(input: unknown): ImageTagCatalog {
  const catalog = record(input, 'catalog');
  exactKeys(
    catalog,
    ['version', 'component', 'assignment', 'dimensions'],
    'catalog',
  );
  if (catalog.version !== 2) {
    fail(
      `Unsupported image dimensional-tag catalog version: ${String(catalog.version)}.`,
    );
  }
  if (catalog.component !== 'PaperImage') {
    fail('The image dimensional-tag catalog must target PaperImage.');
  }
  const assignment = record(catalog.assignment, 'catalog.assignment');
  exactKeys(assignment, ['syntax', 'scopes'], 'catalog.assignment');
  if (assignment.syntax !== 'static-double-quoted-prop') {
    fail('The image dimensional-tag assignment syntax is unsupported.');
  }
  const scopes = array(assignment.scopes, 'catalog.assignment.scopes');
  const parsedScopes = new Set<PaperImageScope>();
  for (const [index, scope] of scopes.entries()) {
    if (
      typeof scope !== 'string' ||
      !SUPPORTED_SCOPES.has(scope as PaperImageScope)
    ) {
      fail(`catalog.assignment.scopes[${index}] is unsupported.`);
    }
    unique(
      scope,
      parsedScopes as Set<string>,
      `catalog.assignment.scopes[${index}]`,
    );
  }
  if (
    parsedScopes.size !== SUPPORTED_SCOPES.size ||
    [...SUPPORTED_SCOPES].some(scope => !parsedScopes.has(scope))
  ) {
    fail(
      'The image dimensional-tag catalog must support question, working, and answer scopes.',
    );
  }
  const dimensionKeys = new Set<string>();
  const attributes = new Set<string>();
  const dimensions = array(catalog.dimensions, 'catalog.dimensions').map(
    (dimension, index) =>
      parseDimension(dimension, dimensionKeys, attributes, index),
  );
  const earlierDimensions = new Map<string, ImageTagCatalogDimension>();
  for (const dimension of dimensions) {
    for (const value of dimension.values) {
      for (const [key, requiredValue] of Object.entries(value.requires)) {
        const dependency = earlierDimensions.get(key);
        if (
          !dependency?.values.some(
            candidate => candidate.value === requiredValue,
          )
        ) {
          fail(
            `${dimension.key}=${value.value} requires ${key}=${requiredValue}, which must be a supported value of an earlier dimension.`,
          );
        }
      }
    }
    earlierDimensions.set(dimension.key, dimension);
  }
  return {
    assignment: {
      scopes: [...parsedScopes],
      syntax: 'static-double-quoted-prop',
    },
    component: 'PaperImage',
    dimensions,
    version: 2,
  };
}

export function validateImageTagAssignments(
  catalog: ImageTagCatalog,
  attributes: Readonly<Record<string, string>>,
  context = 'PaperImage',
) {
  for (const dimension of catalog.dimensions) {
    const assigned = attributes[dimension.attribute];
    if (assigned === undefined) continue;
    const value = dimension.values.find(
      candidate => candidate.value === assigned,
    );
    if (!value) {
      fail(
        `${context} has unsupported ${dimension.attribute}=${JSON.stringify(assigned)}; expected one of ${dimension.values.map(candidate => candidate.value).join(', ')}.`,
      );
    }
    for (const [key, requiredValue] of Object.entries(value.requires)) {
      const dependency = catalog.dimensions.find(
        candidate => candidate.key === key,
      );
      if (!dependency || attributes[dependency.attribute] !== requiredValue) {
        fail(
          `${context} ${dimension.attribute}=${JSON.stringify(assigned)} requires ${key}=${JSON.stringify(requiredValue)}.`,
        );
      }
    }
  }
}

export async function getImageTagCatalog(
  catalogPath = IMAGE_DIMENSIONAL_TAG_CATALOG_PATH,
) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await fs.readFile(catalogPath, 'utf8')) as unknown;
  } catch (error) {
    throw new ImageTagCatalogError(
      `Could not read the image dimensional-tag catalog: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  return validateImageTagCatalog(parsed);
}
