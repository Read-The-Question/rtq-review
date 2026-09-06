import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  inspectPaperSource,
  listPaperCollections,
  listPaperSources,
  readReviewPaper,
} from './index.ts';

const registeredCollections = [
  'toml',
  'allTagsToml',
  'focusToml',
  'focusTopicToml',
  'focusRagToml',
  'focusRagTopicToml',
  'topicToml',
  'ragToml',
  'ragTopicToml',
] as const;

function createContentWorkspace(
  collections: readonly string[] = registeredCollections,
): string {
  const root = mkdtempSync(join(tmpdir(), 'rtq-review-paper-data-'));
  const papersPackageRoot = join(root, 'packages', 'papers');
  const assetsPackageRoot = join(root, 'packages', 'assets');

  for (const collection of collections) {
    mkdirSync(join(papersPackageRoot, 'papers', collection), {
      recursive: true,
    });
  }
  mkdirSync(join(assetsPackageRoot, 'assets'), { recursive: true });
  mkdirSync(join(papersPackageRoot, 'scripts', 'papers', 'lib', 'model'), {
    recursive: true,
  });
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: '@rtq/content-workspace' }),
  );
  writeFileSync(join(root, 'pnpm-workspace.yaml'), 'packages: []\n');
  writeFileSync(
    join(papersPackageRoot, 'package.json'),
    JSON.stringify({ name: '@rtq/papers' }),
  );
  writeFileSync(
    join(assetsPackageRoot, 'package.json'),
    JSON.stringify({ name: '@rtq/maths-assets' }),
  );
  writeFileSync(
    join(papersPackageRoot, 'scripts', 'papers', 'lib', 'model', 'macros.toml'),
    String.raw`rtq_abbr_test = '''Expanded project abbreviation'''
rtq_abbr_formula = '''$a + b = c$'''
`,
  );

  return root;
}

function writePaper(
  root: string,
  collection: string,
  fileName: string,
  contents: string,
): void {
  const collectionRoot = join(root, 'packages', 'papers', 'papers', collection);
  mkdirSync(collectionRoot, { recursive: true });
  writeFileSync(join(collectionRoot, fileName), contents);
}

const simplePaper = String.raw`[meta]
rtq-focus-group = ["school:test-school", "custom:review"]

[[sections]]
name = "A"

[[sections.questions]]
rtq-question-id = "source-school--11-plus--maths--2020--paper-1:1:2"
rtq-uuid = "QUESTION-UUID"
rtq-tags = ["math.number"]
question = '''Question'''
`;

const completePaper = String.raw`[meta]
rtq-paper-id = "PAPER-ID"
rtq-paper-rag = "rag_wf_g4"
access-tier = "free"
rtq-focus-group = ["school:test-school"]

[meta.schools]
school-ids = ["SCHOOL-ID"]

[meta.year]
value = 2020

[meta.paper-name]
value = "Source name"

[meta.paper-name.display]
value = "Review Paper"

[[sections]]
name = "A"

[[sections.questions]]
rtq-question-id = "source-school--11-plus--maths--2020--paper-1:1:2"
rtq-uuid = "TOP-UUID"
rtq-answer-rag = "rag_wf_ng3"
rtq-review-rag = "rag_wf_prg"
rtq-review-comments = '''Legacy answer comment'''
rtq-question-rag = "rag_wf_g0"
rtq-question-review-rag = "rag_wf_prcc"
rtq-question-review-comments = '''Legacy question comment'''
rtq-tags = ["family.money", "frame.labelled"]
question = '''
rtq_abbr_test

<PaperTable width="wide" grid="all">

| A | B |
|---|---|
| 1 | 2 |

</PaperTable>
'''

[[sections.questions.workings]]
working = '''
<PaperImage assetScope="working" kind="essential" displaySize="lg" />
<LongDivision dividend="345" divisor="12" variant="both" indent="md" />
'''

[[sections.questions.workings.formulas]]
formula = '''rtq_abbr_formula'''

[[sections.questions.workings.formulas]]
formula = '''$x = 1$'''

[[sections.questions.workings.tips]]
tip = '''First tip'''

[[sections.questions.workings.tips]]
tip = '''Second tip'''

[[sections.questions.answers]]
option = '''A'''
key = '''Result'''
answer = '''42

<PaperImage assetScope="answer" kind="essential" />'''

[[sections.questions.subquestions]]
rtq-uuid = "SUB-UUID"
rtq-inherit-tags = true
rtq-tags = ["marker.fill-missing-values"]
question = '''Subquestion'''

[[sections.questions.subquestions.subquestions]]
rtq-uuid = "SUB-SUB-UUID"
rtq-inherit-tags = false
rtq-tags = ["reasoning.direct"]
question = '''Sub-subquestion'''
`;

const looseExemplar = String.raw`[meta]
school = "%school%"
year = %year%

[[sections]]
name = "A"

[[sections.questions]]
rtq-question-id = "source-paper:1:1"
rtq-uuid = "EXEMPLAR-UUID"
question = '''Exemplar question'''

[[sections.questions.workings]]
working = '''Work'''

[[sections.questions.workings.formulas]]
formula = '''One'''

[[sections.questions.workings.formulas]]
formula = '''Two'''
`;

test('discovers only supported existing collections in stable order', async () => {
  const root = createContentWorkspace([
    'toml',
    'allTagsToml',
    'focusToml',
    'topicToml',
    'exemplarsLevel11Toml',
    'exemplarsLevel3Toml',
    'questionNodeToml',
    '.hiddenToml',
  ]);

  try {
    const collections = await listPaperCollections({
      environment: { RTQ_CONTENT_ROOT: root },
    });

    assert.deepEqual(
      collections.map((collection) => collection.id),
      [
        'toml',
        'allTagsToml',
        'focusToml',
        'topicToml',
        'exemplarsLevel3Toml',
        'exemplarsLevel11Toml',
      ],
    );
    assert.equal(
      collections.every((collection) => collection.readOnly),
      true,
    );
    assert.equal(collections[0].generated, false);
    assert.equal(collections[1].generated, true);
    assert.equal(collections[1].label, 'All Tags Papers');
    assert.equal(collections.at(-1)?.exemplarLevel, 11);
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test('indexes canonical, derived, and exemplar papers without admitting non-paper entries', async () => {
  const root = createContentWorkspace([
    'toml',
    'topicToml',
    'exemplarsLevel3Toml',
    'ragToml',
    'ragTopicToml',
  ]);
  writePaper(
    root,
    'toml',
    'source-school--11-plus--maths--2020--paper-1.toml',
    simplePaper.replace(/^rtq-question-id = .*\n/m, ''),
  );
  writePaper(
    root,
    'topicToml',
    'topicpapers_math.fraction_1.toml',
    simplePaper,
  );
  writePaper(
    root,
    'exemplarsLevel3Toml',
    'exemplarpapers_math.fraction_1.toml',
    simplePaper,
  );
  writePaper(
    root,
    'ragTopicToml',
    'topicpapers_math.fraction_rag_ng3_1.toml',
    simplePaper,
  );
  writePaper(root, 'ragToml', 'broken.toml', '[meta\n');
  writePaper(root, 'toml', '.hidden.toml', simplePaper);
  writeFileSync(
    join(root, 'packages', 'papers', 'papers', 'toml', 'manifest.json'),
    '{}',
  );
  writePaper(root, 'toml', 'manifest.toml', simplePaper);
  mkdirSync(
    join(root, 'packages', 'papers', 'papers', 'toml', 'nested-folder'),
  );
  writePaper(root, 'toml', 'nested-folder/nested.toml', simplePaper);

  try {
    const sources = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    assert.equal(sources.length, 5);

    const canonical = sources.find(
      (entry) =>
        entry.state === 'ready' && entry.source.collection.id === 'toml',
    );
    assert.ok(canonical && canonical.state === 'ready');
    assert.equal(canonical.source.questionCount, 1);
    assert.deepEqual(canonical.source.focusGroups, [
      'custom:review',
      'school:test-school',
    ]);
    assert.deepEqual(canonical.source.provenance, {
      kind: 'canonical',
      sourcePaperStems: ['source-school--11-plus--maths--2020--paper-1'],
    });
    const canonicalPaper = await readReviewPaper(
      'toml',
      'source-school--11-plus--maths--2020--paper-1.toml',
      { environment: { RTQ_CONTENT_ROOT: root } },
    );
    assert.equal(
      canonicalPaper.sections[0].questions[0].sourceQuestionId,
      'source-school--11-plus--maths--2020--paper-1:1:1',
    );

    const topic = sources.find(
      (entry) =>
        entry.state === 'ready' && entry.source.collection.id === 'topicToml',
    );
    assert.ok(topic && topic.state === 'ready');
    assert.equal(topic.source.topic, 'math.fraction');
    assert.equal(topic.source.title, 'Math / Fraction');
    assert.deepEqual(topic.source.provenance.sourcePaperStems, [
      'source-school--11-plus--maths--2020--paper-1',
    ]);

    const exemplar = sources.find(
      (entry) =>
        entry.state === 'ready' &&
        entry.source.collection.id === 'exemplarsLevel3Toml',
    );
    assert.ok(exemplar && exemplar.state === 'ready');
    assert.equal(exemplar.source.provenance.kind, 'exemplar');

    const ragTopic = sources.find(
      (entry) =>
        entry.state === 'ready' &&
        entry.source.collection.id === 'ragTopicToml',
    );
    assert.ok(ragTopic && ragTopic.state === 'ready');
    assert.equal(ragTopic.source.topic, 'math.fraction');
    assert.equal(ragTopic.source.ragGrouping, 'NG3');

    const invalid = sources.find((entry) => entry.state === 'invalid');
    assert.ok(invalid && invalid.state === 'invalid');
    assert.equal(invalid.collection.id, 'ragToml');
    assert.match(invalid.message, /could not be parsed/);
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test('parses the complete nested read model and safe preparation inputs', async () => {
  const root = createContentWorkspace(['toml', 'topicToml']);
  writePaper(
    root,
    'topicToml',
    'topicpapers_family.money_1.toml',
    completePaper,
  );

  try {
    const paper = await readReviewPaper(
      'topicToml',
      'topicpapers_family.money_1.toml',
      { environment: { RTQ_CONTENT_ROOT: root } },
    );
    const question = paper.sections[0].questions[0];
    const subquestion = question.children[0];
    const subSubquestion = subquestion.children[0];

    assert.equal(paper.title, 'Review Paper');
    assert.deepEqual(paper.metadata, {
      accessTier: 'free',
      focusGroups: ['school:test-school'],
      paperId: 'PAPER-ID',
      paperRag: 'rag_wf_g4',
      schoolIds: ['SCHOOL-ID'],
      year: '2020',
    });
    assert.equal(paper.source.questionCount, 1);
    assert.equal(question.content.question.raw.includes('rtq_abbr_test'), true);
    assert.match(
      question.content.question.expanded,
      /Expanded project abbreviation/,
    );
    assert.deepEqual(question.explicitTags, ['family.money', 'frame.labelled']);
    assert.deepEqual(
      question.effectiveTags.map((tag) => [tag.value, tag.origin]),
      [
        ['family.money', 'explicit'],
        ['math.unknown', 'implicit'],
        ['frame.labelled', 'explicit'],
        ['reasoning.direct', 'implicit'],
      ],
    );
    assert.equal(question.review.answer.contentRag, 'rag_wf_ng3');
    assert.equal(question.review.answer.reviewOutcome, 'rag_wf_prg');
    assert.equal(
      question.review.answer.legacyComments,
      'Legacy answer comment',
    );
    assert.equal(question.review.question.contentRag, 'rag_wf_g0');
    assert.equal(
      question.review.question.legacyComments,
      'Legacy question comment',
    );
    assert.equal(question.content.workings[0].formulas.length, 2);
    assert.equal(question.content.workings[0].tips.length, 2);
    assert.equal(
      question.content.workings[0].formulas[0].expanded,
      '$a + b = c$',
    );
    assert.equal(subquestion.kind, 'subquestion');
    assert.equal(subquestion.explicitInherit, true);
    assert.equal(subquestion.sourceQuestionId, question.questionId);
    assert.equal(subSubquestion.kind, 'sub-subquestion');
    assert.equal(subSubquestion.explicitInherit, false);
    assert.deepEqual(subSubquestion.children, []);
    assert.deepEqual(question.originalSource, {
      paperStem: 'source-school--11-plus--maths--2020--paper-1',
      questionNumber: 2,
      rawValue: 'source-school--11-plus--maths--2020--paper-1:1:2',
      sectionNumber: 1,
    });

    const table = question.content.question.preparations[0];
    assert.ok(table && table.kind === 'paper-table');
    assert.deepEqual(table.attributes, { grid: 'all', width: 'wide' });
    assert.match(table.markdown, /\| A \| B \|/);

    const [image, longDivision] =
      question.content.workings[0].working.preparations;
    assert.ok(image && image.kind === 'paper-image');
    assert.deepEqual(image.attributes, {
      assetScope: 'working',
      displaySize: 'lg',
      kind: 'essential',
    });
    assert.deepEqual(image.context, {
      paperStem: 'source-school--11-plus--maths--2020--paper-1',
      questionIndex: 1,
      scope: 'working',
      sectionIndex: 0,
      workingIndex: 0,
    });
    assert.ok(longDivision && longDivision.kind === 'long-division');
    assert.deepEqual(longDivision.attributes, {
      dividend: '345',
      divisor: '12',
      indent: 'md',
      variant: 'both',
    });
    assert.equal(
      question.content.answers[0].answer.preparations[0]?.kind,
      'paper-image',
    );
    assert.doesNotThrow(() => JSON.stringify(paper));
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test('uses loose parsing only for recognized exemplar placeholders', async () => {
  const root = createContentWorkspace(['toml', 'exemplarsLevel2Toml']);
  writePaper(root, 'exemplarsLevel2Toml', 'placeholder.toml', looseExemplar);
  writePaper(root, 'toml', 'placeholder.toml', looseExemplar);

  try {
    const exemplar = await readReviewPaper(
      'exemplarsLevel2Toml',
      'placeholder.toml',
      { environment: { RTQ_CONTENT_ROOT: root } },
    );
    assert.equal(exemplar.sections[0].questions[0].uuid, 'EXEMPLAR-UUID');
    assert.deepEqual(
      exemplar.sections[0].questions[0].content.workings[0].formulas.map(
        (formula) => formula.raw,
      ),
      ['One', 'Two'],
    );

    await assert.rejects(
      readReviewPaper('toml', 'placeholder.toml', {
        environment: { RTQ_CONTENT_ROOT: root },
      }),
      /could not be parsed/,
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test('isolates missing, empty, malformed, and traversal cases', async () => {
  const root = createContentWorkspace(['toml', 'focusToml', 'ragToml']);
  writePaper(root, 'toml', 'valid.toml', simplePaper);
  writePaper(root, 'ragToml', 'invalid.toml', 'title = "Not a paper"\n');

  try {
    const sources = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    assert.equal(sources.length, 2);
    assert.equal(
      sources.filter((source) => source.state === 'ready').length,
      1,
    );
    assert.equal(
      sources.filter((source) => source.state === 'invalid').length,
      1,
    );

    await assert.rejects(
      readReviewPaper('focusToml', 'missing.toml', {
        environment: { RTQ_CONTENT_ROOT: root },
      }),
      /unavailable/,
    );
    await assert.rejects(
      readReviewPaper('toml', '../valid.toml', {
        environment: { RTQ_CONTENT_ROOT: root },
      }),
      /safe repository-relative path/,
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test('reuses unchanged index summaries and invalidates additions, renames, removals, and metadata changes', async () => {
  const root = createContentWorkspace(['toml']);
  const collectionRoot = join(root, 'packages', 'papers', 'papers', 'toml');
  const originalName = 'original.toml';
  const renamedName = 'renamed.toml';
  writePaper(root, 'toml', originalName, simplePaper);

  try {
    const first = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    const unchanged = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    assert.strictEqual(unchanged[0], first[0]);

    writePaper(
      root,
      'toml',
      originalName,
      simplePaper.replace(
        '\n[[sections]]',
        '\n[meta.paper-name]\nvalue = "Changed metadata"\n\n[[sections]]',
      ),
    );
    const metadataChanged = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    assert.notStrictEqual(metadataChanged[0], first[0]);
    assert.equal(
      metadataChanged[0]?.state === 'ready'
        ? metadataChanged[0].source.title
        : undefined,
      'Changed metadata',
    );

    writePaper(root, 'toml', 'added.toml', simplePaper);
    const added = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    assert.deepEqual(
      added.map((entry) =>
        entry.state === 'ready'
          ? entry.source.relativePath
          : entry.relativePath,
      ),
      ['added.toml', originalName],
    );

    renameSync(
      join(collectionRoot, originalName),
      join(collectionRoot, renamedName),
    );
    const renamed = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    assert.deepEqual(
      renamed.map((entry) =>
        entry.state === 'ready'
          ? entry.source.relativePath
          : entry.relativePath,
      ),
      ['added.toml', renamedName],
    );

    rmSync(join(collectionRoot, 'added.toml'));
    const removed = await listPaperSources({
      environment: { RTQ_CONTENT_ROOT: root },
    });
    assert.deepEqual(
      removed.map((entry) =>
        entry.state === 'ready'
          ? entry.source.relativePath
          : entry.relativePath,
      ),
      [renamedName],
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test('reads selected-source versions directly and recovers after transiently invalid TOML', async () => {
  const root = createContentWorkspace(['toml']);
  const fileName = 'fresh.toml';
  writePaper(root, 'toml', fileName, simplePaper);
  const options = { environment: { RTQ_CONTENT_ROOT: root } };

  try {
    const initial = await inspectPaperSource('toml', fileName, options);
    const initialPaper = await readReviewPaper('toml', fileName, options);
    assert.equal(initial.state, 'ready');
    assert.equal(
      initial.state === 'ready' ? initial.source.version : undefined,
      initialPaper.source.version,
    );

    writePaper(root, 'toml', fileName, '[meta\n');
    const invalid = await inspectPaperSource('toml', fileName, options);
    assert.equal(invalid.state, 'invalid');
    assert.match(
      invalid.state === 'invalid' ? invalid.message : '',
      /could not be parsed/,
    );

    writePaper(root, 'toml', fileName, `${simplePaper}\n# recovered\n`);
    const recovered = await inspectPaperSource('toml', fileName, options);
    assert.equal(recovered.state, 'ready');
    assert.notEqual(
      recovered.state === 'ready' ? recovered.source.version : undefined,
      initial.state === 'ready' ? initial.source.version : undefined,
    );

    rmSync(join(root, 'packages', 'papers', 'papers', 'toml', fileName));
    await assert.rejects(
      inspectPaperSource('toml', fileName, options),
      /unavailable/,
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});
