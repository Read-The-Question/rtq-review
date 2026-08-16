import path from 'node:path';

import { resolveConfiguredMathsAssetsRoot } from '@/lib/paper-asset-reader';

const repoRoot = process.cwd();

function resolveRoot(value: string | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  return path.isAbsolute(value) ? value : path.join(repoRoot, value);
}

export const rtqPaths = {
  repoRoot,
  contentRoot: resolveRoot(
    process.env.RTQ_REVIEW_CONTENT_DIR,
    path.join(/* turbopackIgnore: true */ process.cwd(), 'md'),
  ),
  mathsAssetsRoot: resolveConfiguredMathsAssetsRoot(repoRoot),
};

export const sectionLabelMap: Record<string, string> = {
  aipapers: 'AI - Answers - Papers',
  focuspapers: 'Answers - Focus Papers',
  focusragpapers: 'Answers - Focus RAG Papers',
  focusragtomlpapers: 'Answers - Focus RAG TOML Papers',
  focusragtopicpapers: 'Answers - Focus RAG Topic Papers',
  focusragtopictomlpapers: 'Answers - Focus RAG Topic TOML Papers',
  focustopicpapers: 'Answers - Focus Topic Papers',
  focustomlpapers: 'Answers - Focus TOML Papers',
  owners: 'Owners',
  papers: 'Answers - Papers',
  questionsonlypapers: 'Questions - Papers',
  questionsonlyragpapers: 'Questions - RAG Papers',
  questionsonlyragtomlpapers: 'Questions - RAG TOML Papers',
  questionsonlyragtopictomlpapers: 'Questions - RAG Topic TOML Papers',
  questionsonlytopicpapers: 'Questions - Topic Papers',
  ragFocusToml: 'Answers - Focus RAG TOML Papers',
  ragfocustomlpapers: 'Answers - Focus RAG TOML Papers',
  ragpapers: 'Answers - Review RAG Papers',
  ragtomlpapers: 'Answers - RAG TOML Papers',
  ragtopicpapers: 'Answers - RAG Topic Papers',
  ragtopictomlpapers: 'Answers - RAG Topic TOML Papers',
  reviewers: 'Reviewers',
  topicpapers: 'Answers - Topic Papers',
  topics: 'Answers - Topics',
};

const sectionOrder = [
  'papers',
  'topicpapers',
  'focuspapers',
  'focustopicpapers',
  'focustomlpapers',
  'focusragpapers',
  'focusragtomlpapers',
  'focusragtopicpapers',
  'focusragtopictomlpapers',
  'ragfocustomlpapers',
  'ragFocusToml',
  'ragtomlpapers',
  'ragtopicpapers',
  'ragtopictomlpapers',
  'ragpapers',
  'aipapers',
  'questionsonlypapers',
  'questionsonlytopicpapers',
  'questionsonlyragtomlpapers',
  'questionsonlyragtopictomlpapers',
  'questionsonlyragpapers',
  'topics',
  'owners',
  'reviewers',
];

const acronymMap: Record<string, string> = {
  ai: 'AI',
  md: 'MD',
  rag: 'RAG',
  toml: 'TOML',
};

function humanizeToken(token: string) {
  const lower = token.toLowerCase();
  const acronym = acronymMap[lower];

  if (acronym) {
    return acronym;
  }

  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function humanizeSectionKey(sectionKey: string) {
  const normalized = sectionKey
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();

  if (!normalized) {
    return sectionKey;
  }

  return normalized.split(/\s+/).map(humanizeToken).join(' ');
}

export function getSectionLabel(sectionKey: string) {
  return sectionLabelMap[sectionKey] ?? humanizeSectionKey(sectionKey);
}

export function getSectionOrder(sectionKey: string) {
  const index = sectionOrder.indexOf(sectionKey);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}
