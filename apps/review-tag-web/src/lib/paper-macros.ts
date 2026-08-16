import fs from 'node:fs/promises';

import { parse } from '@iarna/toml';

import { MACROS_TOML_PATH } from '@/lib/paper-paths';

let macrosPromise: Promise<Map<string, string>> | null = null;

function stringifyMacroValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  return String(value);
}

async function loadMacros() {
  const raw = await fs.readFile(MACROS_TOML_PATH, 'utf8');
  const parsed = parse(raw) as Record<string, unknown>;
  const macros = new Map<string, string>();

  for (const [key, value] of Object.entries(parsed)) {
    macros.set(key, stringifyMacroValue(value));
  }

  return macros;
}

export async function getPaperMacros() {
  macrosPromise ??= loadMacros();
  return macrosPromise;
}

export async function applyPaperMacros(text: string) {
  if (!text.trim()) {
    return '';
  }

  const macros = await getPaperMacros();
  let output = text;

  for (const [key, value] of macros.entries()) {
    output = output.split(key).join(value);
  }

  return output;
}
