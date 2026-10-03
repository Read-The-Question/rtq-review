import type {
  ImageTagCatalog,
  ImageTagCatalogDimension,
  ImageTagCatalogValue,
} from './paper-types.ts';

export function imageTagValueIsApplicable(
  catalog: ImageTagCatalog,
  value: ImageTagCatalogValue,
  attributes: Readonly<Record<string, string>>,
) {
  return Object.entries(value.requires).every(([key, requiredValue]) => {
    const dependency = catalog.dimensions.find(
      dimension => dimension.key === key,
    );
    return (
      dependency !== undefined &&
      attributes[dependency.attribute] === requiredValue
    );
  });
}

export function compatibleImageTagValues(
  catalog: ImageTagCatalog,
  dimension: ImageTagCatalogDimension,
  attributes: Readonly<Record<string, string>>,
) {
  return dimension.values.filter(value =>
    imageTagValueIsApplicable(catalog, value, attributes),
  );
}

export function imageTagGuidance(
  catalog: ImageTagCatalog,
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
  const applicable = imageTagValueIsApplicable(catalog, value, attributes);
  const requirements = Object.entries(value.requires)
    .map(([key, requiredValue]) => {
      const dependency = catalog.dimensions.find(
        candidate => candidate.key === key,
      );
      return `${dependency?.label ?? key}: ${dependency?.values.find(option => option.value === requiredValue)?.label ?? requiredValue}`;
    })
    .join(', ');
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
    label: applicable ? guide.label : `Incompatible selection - ${guide.label}`,
    approvalLabel:
      value.status === 'approved'
        ? 'Vocabulary: approved'
        : 'Vocabulary: pending approval',
    lastUpdated: value.lastUpdated,
    message:
      (value.status === 'pending-approval'
        ? 'Registered for review; approve this vocabulary before drawing. '
        : '') +
      (applicable
        ? guide.message
        : `Requires ${requirements}. Remove or change incompatible tags explicitly. ${guide.message}`),
  };
}
