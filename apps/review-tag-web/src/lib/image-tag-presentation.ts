import type { ImageTagCatalogDimension } from './paper-types.ts';

export function imageTagValues(
  dimension: ImageTagCatalogDimension,
  attributes: Readonly<Record<string, string>>,
): string[] {
  const current = attributes[dimension.attribute];
  if (current === undefined) return [];
  return dimension.cardinality === 'zero-or-more'
    ? current.split(' ')
    : [current];
}

export function changeImageTagValue(
  dimension: ImageTagCatalogDimension,
  attributes: Readonly<Record<string, string>>,
  value: string,
  operation: 'toggle' | 'remove',
): string | null {
  if (dimension.cardinality === 'zero-or-one') {
    return operation === 'remove' ? null : value;
  }
  const selected = imageTagValues(dimension, attributes);
  const next =
    operation === 'remove' || selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
  return next.length ? next.join(' ') : null;
}

type Guidance = {
  label: string;
  approvalLabel: string | null;
  lastUpdated: string | null;
  message: string | null;
};

export function imageTagGuidance(
  dimension: ImageTagCatalogDimension,
  attributes: Readonly<Record<string, string>>,
): Guidance {
  const current = attributes[dimension.attribute];
  if (current === undefined) {
    return {
      label: 'Unclassified',
      approvalLabel: null,
      lastUpdated: null,
      message: null,
    };
  }
  const selected = imageTagValues(dimension, attributes);
  const options = selected.flatMap(item =>
    dimension.values.filter(option => option.value === item),
  );
  const value = options[0];
  if (
    !value ||
    options.length !== selected.length ||
    new Set(selected).size !== selected.length
  ) {
    return {
      label: 'Unsupported value',
      approvalLabel: null,
      lastUpdated: null,
      message: `Choose a supported value or remove ${dimension.label.toLowerCase()} explicitly.`,
    };
  }
  if (selected.length > 1) {
    return {
      label: options
        .map(option => `${option.label}: ${option.guide.status}`)
        .join('; '),
      approvalLabel: options.some(
        option => option.status === 'pending-approval',
      )
        ? 'Vocabulary: pending approval'
        : 'Vocabulary: approved',
      lastUpdated: options.reduce(
        (latest, option) =>
          option.lastUpdated > latest ? option.lastUpdated : latest,
        value.lastUpdated,
      ),
      message: options
        .map(option => {
          const detail = imageTagGuidance(dimension, {
            [dimension.attribute]: option.value,
          });
          return `${option.label}: ${detail.approvalLabel}. ${detail.message}`;
        })
        .join(' '),
    };
  }
  const guide = {
    available: {
      label: 'Guide available',
      message:
        'Guidance is available; drawing-tool support still needs checking.',
    },
    placeholder: {
      label: 'Guide placeholder',
      message: 'Complete and approve this guidance before drawing.',
    },
    missing: {
      label: 'Guide missing',
      message: 'Establish and approve guidance before drawing.',
    },
  }[value.guide.status];
  return {
    label: guide.label,
    approvalLabel:
      value.status === 'approved'
        ? 'Vocabulary: approved'
        : 'Vocabulary: pending approval',
    lastUpdated: value.lastUpdated,
    message:
      (value.status === 'pending-approval'
        ? 'Registered for review; approve this vocabulary before drawing. '
        : '') + guide.message,
  };
}
