import type { PaperDocument, PaperNode } from './paper-types.ts';

function filterNode(node: PaperNode): PaperNode | null {
  const children = node.children.flatMap(child => {
    const filtered = filterNode(child);
    return filtered ? [filtered] : [];
  });

  if (node.imageOccurrences.length === 0 && children.length === 0) {
    return null;
  }

  return { ...node, children };
}

function flattenNodes(nodes: PaperNode[]): PaperNode[] {
  return nodes.flatMap(node => [node, ...flattenNodes(node.children)]);
}

export function filterDocumentToImageNodes(
  document: PaperDocument,
): PaperDocument {
  const sections = document.sections.flatMap(section => {
    const questions = section.questions.flatMap(question => {
      const filtered = filterNode(question);
      return filtered ? [filtered] : [];
    });

    return questions.length ? [{ ...section, questions }] : [];
  });
  const nodesFlat = flattenNodes(
    sections.flatMap(section => section.questions),
  );

  return {
    ...document,
    imageOccurrences: nodesFlat.flatMap(node => node.imageOccurrences),
    nodesFlat,
    sections,
  };
}
