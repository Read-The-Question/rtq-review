import {
  DIMENSIONAL_TAG_AXES,
  type DimensionalTagAxis,
  type EffectiveDimensionalTag,
  type ReviewPaper,
  type ReviewPaperNode,
} from './model.ts';

type TagLineage = Readonly<{
  sourceNodeId: string;
  value: string;
}>;

type InheritableTags = Readonly<
  Record<DimensionalTagAxis, readonly TagLineage[]>
>;

const implicitDefaults: Readonly<Partial<Record<DimensionalTagAxis, string>>> =
  {
    family: 'family.unknown',
    frame: 'frame.raw',
    math: 'math.unknown',
    reasoning: 'reasoning.direct',
  };

function emptyInheritableTags(): InheritableTags {
  return {
    family: [],
    frame: [],
    marker: [],
    math: [],
    reasoning: [],
  };
}

export function dimensionalTagAxis(
  value: string,
): DimensionalTagAxis | undefined {
  return DIMENSIONAL_TAG_AXES.find((axis) => value.startsWith(`${axis}.`));
}

function compareTags(left: string, right: string): number {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function explicitTagsByAxis(
  node: ReviewPaperNode,
): Readonly<Record<DimensionalTagAxis, readonly string[]>> {
  const grouped: Record<DimensionalTagAxis, string[]> = {
    family: [],
    frame: [],
    marker: [],
    math: [],
    reasoning: [],
  };

  for (const value of node.explicitTags) {
    const axis = dimensionalTagAxis(value);
    if (axis) grouped[axis].push(value);
  }

  for (const axis of DIMENSIONAL_TAG_AXES) {
    grouped[axis] = [...new Set(grouped[axis])].sort(compareTags);
  }

  return grouped;
}

function resolveNodeTags(
  node: ReviewPaperNode,
  inherited: InheritableTags,
): ReviewPaperNode {
  const explicit = explicitTagsByAxis(node);
  const inheritanceEnabled = node.depth > 0 && node.explicitInherit !== false;
  const availableInherited = inheritanceEnabled
    ? inherited
    : emptyInheritableTags();
  const inheritedTags: EffectiveDimensionalTag[] = [];
  const effectiveTags: EffectiveDimensionalTag[] = [];
  const nextInherited: Record<DimensionalTagAxis, readonly TagLineage[]> =
    emptyInheritableTags();

  for (const axis of DIMENSIONAL_TAG_AXES) {
    for (const tag of availableInherited[axis]) {
      inheritedTags.push({
        axis,
        inheritedFromNodeId: tag.sourceNodeId,
        origin: 'inherited',
        value: tag.value,
      });
    }

    if (explicit[axis].length > 0) {
      nextInherited[axis] = explicit[axis].map((value) => ({
        sourceNodeId: node.id,
        value,
      }));
      effectiveTags.push(
        ...explicit[axis].map((value): EffectiveDimensionalTag => ({
          axis,
          origin: 'explicit',
          value,
        })),
      );
      continue;
    }

    if (availableInherited[axis].length > 0) {
      nextInherited[axis] = availableInherited[axis];
      effectiveTags.push(
        ...availableInherited[axis].map((tag): EffectiveDimensionalTag => ({
          axis,
          inheritedFromNodeId: tag.sourceNodeId,
          origin: 'inherited',
          value: tag.value,
        })),
      );
      continue;
    }

    const implicitValue = implicitDefaults[axis];
    if (implicitValue) {
      effectiveTags.push({
        axis,
        origin: 'implicit',
        value: implicitValue,
      });
    }
  }

  return {
    ...node,
    children: node.children.map((child) =>
      resolveNodeTags(child, nextInherited),
    ),
    effectiveTags,
    inheritedTags,
  };
}

export function resolveReviewPaperTags(paper: ReviewPaper): ReviewPaper {
  return {
    ...paper,
    sections: paper.sections.map((section) => ({
      ...section,
      questions: section.questions.map((question) =>
        resolveNodeTags(question, emptyInheritableTags()),
      ),
    })),
  };
}
