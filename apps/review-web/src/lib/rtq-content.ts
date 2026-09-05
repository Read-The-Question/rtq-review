import fs from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { renderMarkdownToHtml } from '@/lib/markdown-renderer';
import { getSectionLabel, getSectionOrder, rtqPaths } from '@/lib/rtq-config';
import { rtqKatexMacros } from '@/lib/rtq-katex';

const MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown']);
const IGNORED_FILE_NAMES = new Set([
  'PLACEHOLDER.txt',
  '.DS_Store',
  '.gitkeep',
]);

type RawFrontmatter = {
  date?: string;
  questions_count?: string | number;
  slug?: string;
  title?: string;
};

export type ContentDocument = {
  date?: string;
  fileName: string;
  filePath: string;
  html: string;
  questionCount?: number;
  rawQuestionCount?: string;
  relativePath: string;
  sectionKey: string;
  slug: string;
  slugPath: string;
  sourceLabel: string;
  title: string;
};

export type ContentSection = {
  documents: ContentDocument[];
  key: string;
  label: string;
};

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function normalizeSlashes(value: string) {
  return value.split(path.sep).join('/');
}

function normalizeSlug(value: string) {
  return value.replace(/^\/+|\/+$/g, '');
}

function parseQuestionCount(value: RawFrontmatter['questions_count']) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return {
      questionCount: value,
      rawQuestionCount: String(value),
    };
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const parsed = Number.parseInt(trimmed, 10);
    return {
      questionCount: Number.isFinite(parsed) ? parsed : undefined,
      rawQuestionCount: trimmed || undefined,
    };
  }

  return {
    questionCount: undefined,
    rawQuestionCount: undefined,
  };
}

function titleFromPath(relativePath: string) {
  const stem = path.basename(relativePath, path.extname(relativePath));
  return stem.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildSlugFromRelativePath(relativePath: string) {
  const withoutExtension = relativePath.slice(
    0,
    -path.extname(relativePath).length,
  );
  return normalizeSlug(normalizeSlashes(withoutExtension));
}

function compareDocuments(a: ContentDocument, b: ContentDocument) {
  const titleCompare = a.title.localeCompare(b.title, undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  if (titleCompare !== 0) {
    return titleCompare;
  }

  return a.slug.localeCompare(b.slug, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

async function collectMarkdownFiles(
  rootDir: string,
  currentDir = rootDir,
): Promise<string[]> {
  if (!(await pathExists(currentDir))) {
    return [];
  }

  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(rootDir, fullPath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (IGNORED_FILE_NAMES.has(entry.name)) {
      continue;
    }

    if (!MARKDOWN_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

async function parseDocument(filePath: string): Promise<ContentDocument> {
  const source = await fs.readFile(filePath, 'utf8');
  const parsed = matter(source);
  const frontmatter = parsed.data as RawFrontmatter;
  const relativePath = normalizeSlashes(
    path.relative(rtqPaths.contentRoot, filePath),
  );
  const [sectionKey = '__root__'] = relativePath.split('/');
  const slug = normalizeSlug(
    frontmatter.slug ?? buildSlugFromRelativePath(relativePath),
  );
  const { questionCount, rawQuestionCount } = parseQuestionCount(
    frontmatter.questions_count,
  );

  return {
    date: frontmatter.date,
    fileName: path.basename(filePath),
    filePath,
    html: await renderMarkdownToHtml(parsed.content, rtqKatexMacros),
    questionCount,
    rawQuestionCount,
    relativePath,
    sectionKey,
    slug,
    slugPath: `/${slug}`,
    sourceLabel: getSectionLabel(sectionKey),
    title: frontmatter.title?.trim() || titleFromPath(relativePath),
  };
}

export async function listContentDocuments() {
  if (!(await pathExists(rtqPaths.contentRoot))) {
    return [];
  }

  const files = await collectMarkdownFiles(rtqPaths.contentRoot);
  const documents = await Promise.all(
    files.map(filePath => parseDocument(filePath)),
  );
  return documents.sort(compareDocuments);
}

export async function listContentSections(): Promise<ContentSection[]> {
  const documents = await listContentDocuments();
  const grouped = new Map<string, ContentDocument[]>();

  for (const document of documents) {
    const current = grouped.get(document.sectionKey) ?? [];
    current.push(document);
    grouped.set(document.sectionKey, current);
  }

  return [...grouped.entries()]
    .map(([key, sectionDocuments]) => ({
      documents: sectionDocuments.sort(compareDocuments),
      key,
      label: getSectionLabel(key),
    }))
    .sort((a, b) => {
      const orderDifference = getSectionOrder(a.key) - getSectionOrder(b.key);

      if (orderDifference !== 0) {
        return orderDifference;
      }

      return a.label.localeCompare(b.label, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
}

export async function getContentDocumentBySlugSegments(slugSegments: string[]) {
  const normalizedSlug = normalizeSlug(slugSegments.join('/'));
  const documents = await listContentDocuments();

  return documents.find(document => document.slug === normalizedSlug) ?? null;
}
