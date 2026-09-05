export type RawFormula = {
  formula: string;
};

export type RawTip = {
  tip: string;
};

export type ParsedRawWorking = {
  formulas: RawFormula[];
  tips: RawTip[];
  working: string;
};

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function rawChildRecords<Key extends 'formula' | 'tip'>(
  value: unknown,
  key: Key,
): Array<Record<Key, string>> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap(item => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const text = (item as Record<string, unknown>)[key];
    return typeof text === 'string'
      ? ([{ [key]: text }] as Array<Record<Key, string>>)
      : [];
  });
}

export function rawWorkingFromEntry(entry: unknown): ParsedRawWorking {
  if (!entry || typeof entry !== 'object') {
    return {
      formulas: [],
      tips: [],
      working: '',
    };
  }

  const record = entry as Record<string, unknown>;

  return {
    formulas: rawChildRecords(record.formulas, 'formula'),
    tips: rawChildRecords(record.tips, 'tip'),
    working: asString(record.working),
  };
}

export function visibleWorkingCollectionValues<Key extends 'formula' | 'tip'>(
  items: Array<Record<Key, string>>,
  key: Key,
) {
  return items
    .map(item => item[key])
    .filter(value => value.trim() !== '%empty%');
}

export async function hydrateWorkingCollection<Key extends 'formula' | 'tip'>(
  items: Array<Record<Key, string>>,
  key: Key,
  hydrate: (value: string) => Promise<string>,
) {
  return Promise.all(
    visibleWorkingCollectionValues(items, key).map(value => hydrate(value)),
  );
}
