import type { ImageTagCatalogDimension } from './paper-types.ts';

export function imageTagGuidance(
  dimension: ImageTagCatalogDimension,
  attributes: Readonly<Record<string, string>>,
) {
  const current = attributes[dimension.attribute];
  if (current === undefined) {
    return {
      label: 'Unclassified',
      approvalLabel: null,
      lastUpdated: null,
      message: null,
    };
  }
  const value = dimension.values.find(option => option.value === current);
  if (!value) {
    return {
      label: 'Unsupported value',
      approvalLabel: null,
      lastUpdated: null,
      message: `Choose a supported value or remove ${dimension.label.toLowerCase()} explicitly.`,
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
