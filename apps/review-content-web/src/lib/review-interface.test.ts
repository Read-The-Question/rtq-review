import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const componentUrl = new URL(
  '../components/review-surface.tsx',
  import.meta.url,
);
const siteHeaderUrl = new URL('../components/site-header.tsx', import.meta.url);
const cssUrl = new URL('../app/globals.css', import.meta.url);
const homeUrl = new URL('../app/page.tsx', import.meta.url);
const paperIndexUrl = new URL('../components/paper-index.tsx', import.meta.url);
const browserUrl = new URL('../components/file-browser.tsx', import.meta.url);
const macrosPageUrl = new URL('../app/macros/page.tsx', import.meta.url);
const macrosListUrl = new URL(
  '../components/macro-review-list.tsx',
  import.meta.url,
);
const markdownUrl = new URL('../components/rtq-markdown.tsx', import.meta.url);
const preparePaperUrl = new URL('../lib/prepare-paper.ts', import.meta.url);
const findingsRouteUrl = new URL(
  '../app/api/review/findings/route.ts',
  import.meta.url,
);

test('display preferences separate the active side from inline visibility', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.match(component, /role="switch"/);
  assert.match(component, /role="group"/);
  assert.match(component, /aria-label="Review target"/);
  assert.match(component, /function ReviewLane/);
  assert.match(component, /side=\{preferences\.reviewSide\}/);
  assert.match(component, /inlineEnabled=\{preferences\.showInlineReview\}/);
  assert.match(component, /feedbackEnabled=\{preferences\.showFeedback\}/);
  assert.match(component, /label="Status background"/);
  assert.match(component, /label="Simple inline actions"/);
  assert.match(component, /label="Inline review panel"/);
  assert.match(component, /label="Previous feedback"/);
  assert.doesNotMatch(component, /showQuestionReview|showAnswerReview/);
  assert.doesNotMatch(component, /showQuestionFeedback|showAnswerFeedback/);
  assert.doesNotMatch(component, /label="Show everything"/);
});

test('review requests use descriptive canonical actions in both modes', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(component, /controlMode === 'simple'/);
  assert.match(component, /SIMPLE_REVIEW_OUTCOME_OPTIONS\.map/);
  assert.match(component, /REVIEW_OUTCOME_OPTIONS\.map/);
  assert.match(component, /option\.actionLabel/);
  assert.match(component, /submitOutcome\(null\)/);
  assert.match(component, />\s*Reset\s*<\/button>/);
  assert.match(
    css,
    /\.outcome-action--approved\s*{[^}]*background:\s*var\(--review-option-background\)/s,
  );
  assert.match(css, /\.outcome-action--change-requested\s*{/);
  assert.match(css, /\.outcome-action--change-complete\s*{/);
  assert.match(css, /\.outcome-action--blocked\s*{/);
  assert.match(css, /\.outcome-action--coming-soon\s*{/);
  assert.match(css, /\.review-scope--success\s*{[^}]*background:\s*#eaf7f0/s);
  assert.match(
    css,
    /\.review-action-status--success\s*{[^}]*font-weight:\s*800/s,
  );
});

test('review filters are context-scoped, paired, URL-backed, and failure-safe', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.match(component, /className="review-context-filter-row"/);
  assert.match(component, /reviewSidesForContext\(reviewContext\)\.map/);
  assert.match(
    component,
    /reviewOutcomeFacets=\{result\.reviewOutcomeFacets\}/,
  );
  assert.match(component, /reviewOutcomeFilterLabel\(option\.value\)/);
  assert.match(component, /reviewOutcomeError=\{outcomeLoad\.error\}/);
  assert.match(component, /reviewContext=\{preferences\.reviewSide\}/);
  assert.match(component, /selection=\{activeSelection\}/);
  assert.match(component, /aria-label="Reset review outcome filters"/);
  assert.match(
    component,
    /clearReviewOutcomeFiltersForContext\([\s\S]*selection,[\s\S]*preferences\.reviewSide/,
  );
  assert.match(component, /onClearReviewOutcomes=\{clearReviewOutcomes\}/);
  assert.match(
    component,
    /filterReviewPaper\(paper, activeSelection, reviewOutcomeFilterContext\)/,
  );
  assert.match(
    component,
    /reviewFilterSelectionForContext\(selection, preferences\.reviewSide\)/,
  );
});

test('top-level questions expose current outcomes and feedback as scan badges', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(component, /function QuestionReviewActivity/);
  assert.match(component, /node\.depth === 0/);
  assert.match(component, /aria-label="Current review activity"/);
  assert.match(component, /reviewOutcomeLabel\(outcome\)/);
  assert.match(component, /commentGroups\.current\.length/);
  assert.match(component, /runtime\.showPreviousFeedback/);
  assert.match(component, /function reviewStatusRails/);
  assert.match(
    component,
    /reviewStatusRails\(node, reviewSides, reviewRuntime\)/,
  );
  assert.match(component, /reviewSides=\{enabledReviewSides\}/);
  assert.match(component, /activeReviewSides\(preferences\)/);
  assert.match(component, /return reviewSides\.flatMap/);
  assert.match(component, /aria-label="Review target"/);
  assert.match(component, /question-status-rail--\$\{tone\}/);
  assert.match(component, /question-status-rail--\$\{side\}/);
  assert.match(component, /reviewSideShortLabel\(side\)/);
  assert.match(component, /function ImageReviewStatusBlock/);
  assert.match(component, /review-content-status--\$\{contentStatusTone\}/);
  assert.match(component, /review-content-status--\$\{tone\}/);
  assert.match(
    component,
    /outcome \? reviewOutcomeLabel\(outcome\) : 'Pending'/,
  );
  assert.match(css, /--review-approved-background:/);
  assert.match(css, /--review-change-requested-background:/);
  assert.match(css, /--review-change-complete-background:/);
  assert.match(css, /--review-blocked-background:/);
  assert.match(css, /--review-coming-soon-background:/);
  assert.match(css, /--review-coming-soon-background:\s*#e7d9f2/);
  assert.match(css, /--review-coming-soon-border:\s*#694f7c/);
  assert.match(css, /--review-coming-soon-tint:\s*#f5eff8/);
  assert.match(
    css,
    /\.review-activity-badge\s*{[^}]*background:\s*var\(--review-option-background/s,
  );
  assert.match(css, /\.question-status-rail--approved\s*{/);
  assert.match(css, /\.question-status-rail--pending\s*{/);
  assert.match(css, /\.review-content-status--blocked\s*{/);
  assert.doesNotMatch(css, /\.question-node--status-background-blocked\s*{/);
  assert.doesNotMatch(component, /question-node--active/);
  assert.doesNotMatch(css, /\.question-node--active/);
});

test('the sticky toolbar keeps compact filter access with focus and return controls', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(component, /aria-controls="review-filters"/);
  assert.match(component, /aria-expanded=\{filtersExpanded\}/);
  assert.match(component, /updateFilterDisclosure\(true\)/);
  assert.match(component, /filtersExpanded \? \(/);
  assert.match(component, /selectedFilterCount/);
  assert.match(component, /aria-label="Page navigation"/);
  assert.match(component, /aria-label="Question navigation"/);
  assert.match(component, /Scroll to top \(keyboard shortcut: t\)/);
  assert.match(component, /Scroll to bottom \(keyboard shortcut: b\)/);
  assert.match(component, /key === 't' \|\| key === 'b'/);
  assert.match(component, /id="paper-bottom"/);
  assert.match(component, /id="review-filters"/);
  assert.match(component, /panel\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(component, /Back to \{returnQuestionLabel/);
  assert.match(
    css,
    /\.review-toolbar\s*{[^}]*position:\s*sticky;[^}]*top:\s*0/s,
  );
  assert.match(css, /\.filter-disclosure-toggle\s*{/);
});

test('review filter disclosure restores and persists its expanded state', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.match(
    component,
    /localStorage\.getItem\(REVIEW_FILTER_DISCLOSURE_KEY\)/,
  );
  assert.match(component, /parseReviewFilterDisclosure/);
  assert.match(
    component,
    /localStorage\.setItem\([\s\S]*REVIEW_FILTER_DISCLOSURE_KEY,[\s\S]*JSON\.stringify\(\{ expanded \}\)/,
  );
  assert.match(
    component,
    /onClick=\{\(\) => updateFilterDisclosure\(!filtersExpanded\)\}/,
  );
});

test('the sticky toolbar exposes both tracks in one selected review context', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(component, /function ReviewSideSelector/);
  assert.match(component, /REVIEW_CONTEXT_OPTIONS\.map/);
  assert.match(component, /updatePreference\('reviewSide', side\)/);
  assert.match(
    component,
    /reviewSidesForContext\(preferences\.reviewSide\)\.map/,
  );
  assert.match(component, /submitToolbarOutcome\(side, outcome\)/);
  assert.match(component, /openKeyboardComment\(side\)/);
  assert.equal(component.match(/<ReviewLane/g)?.length, 1);
  assert.match(component, /PRIMARY_REVIEW_OPTIONS\.map/);
  assert.match(component, /SECONDARY_REVIEW_OPTIONS\.map/);
  assert.match(component, /onClick=\{\(\) => onOutcome\(option\.outcome\)\}/);
  assert.match(component, /onClick=\{\(\) => onOutcome\(null\)\}/);
  assert.doesNotMatch(component, /<summary>More<\/summary>/);
  assert.doesNotMatch(component, /review-lane-more/);
  assert.doesNotMatch(component, /review-lane--disabled/);
  assert.match(component, /function ImageMetadataControls/);
  assert.match(component, />Generated</);
  assert.match(component, />Screenshot</);
  assert.match(component, />Ignore decorative source image</);
  assert.match(
    component,
    /Saved with the current or next image review[\s\S]*action/,
  );
  assert.match(component, /displayedImageReviewMetadata/);
  assert.match(
    component,
    /JSON\.stringify\(\{ imageMetadata, outcome, reviewer, target \}\)/,
  );
  assert.match(css, /\.image-metadata-controls\s*{/);
  assert.match(component, /pendingOutcomeSelections/);
  assert.match(
    component,
    /while \(pendingRequestKeys\.current\.has\(`\$\{key\}:outcome`\)\)/,
  );
  assert.match(component, /imageMetadataSaveChains/);
  assert.match(component, /sameImageMetadata/);
});

test('the sticky View popover dismisses after selection, outside click, and Escape', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.match(component, /function dismissReviewPopover/);
  assert.match(component, /review-view-menu review-popover/);
  assert.match(
    component,
    /onChange=\{\(event\) => dismissReviewPopover\(event\.currentTarget\)\}/,
  );
  assert.match(
    component,
    /details\.review-popover\[open\][\s\S]*!details\.contains\(target\)[\s\S]*removeAttribute\('open'\)/,
  );
  assert.match(component, /window\.addEventListener\('pointerdown'/);
  assert.match(
    component,
    /event\.key === 'Escape'[\s\S]*details\.removeAttribute\('open'\)/,
  );
});

test('reports the active outcome destination once in the page header', async () => {
  const [component, siteHeader] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(siteHeaderUrl, 'utf8'),
  ]);

  assert.match(
    component,
    /<SiteHeader compact outcomeDestination={outcomeLoad\.destination} \/>/,
  );
  assert.doesNotMatch(component, /Outcomes → Sheets/);
  assert.match(siteHeader, /Outcomes & comments → local SQLite/);
  assert.match(siteHeader, /Outcomes → Sheets · comments → local SQLite/);
});

test('paper header omits source-paper filename badges', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.doesNotMatch(component, /sourcePaperStems\.map/);
  assert.doesNotMatch(component, /<code key=\{stem\}>Source \{stem\}<\/code>/);
});

test('the filtered paper rail links every visible question hierarchy level', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(component, /function QuestionIndexNode/);
  assert.match(component, /href=\{`#question-\$\{node\.id\}`\}/);
  assert.match(component, /node\.children\.map/);
  assert.match(component, /aria-current=\{current \? 'true' : undefined\}/);
  assert.match(component, /currentNodeId=\{currentCursor\?\.node\.id\}/);
  assert.match(
    component,
    /querySelector<HTMLElement>\('\[aria-current="true"\]'\)/,
  );
  assert.match(component, /sections=\{result\.matchingSections\}/);
  assert.match(component, /aria-label="Filtered question navigation"/);
  assert.match(
    css,
    /\.question-index\s*{[^}]*position:\s*sticky;[^}]*top:\s*var\(--review-toolbar-offset, 6rem\)/s,
  );
  assert.match(
    css,
    /\.paper-section\s*{[^}]*scroll-margin-top:\s*calc\(var\(--review-toolbar-offset, 16rem\) \+ 2rem\)/s,
  );
  assert.match(
    css,
    /\.question-node\s*{[^}]*scroll-margin-top:\s*calc\(var\(--review-toolbar-offset, 16rem\) \+ 2rem\)/s,
  );
  assert.match(css, /\.question-index-link--current\s*{/);
});

test('previous feedback is controlled globally without repeated hidden-history prompts', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.match(component, /label="Previous feedback"/);
  assert.match(component, /checked=\{showPreviousFeedback\}/);
  assert.match(component, /runtime\.showPreviousFeedback/);
  assert.doesNotMatch(component, /previous comments are hidden/i);
  assert.doesNotMatch(component, /Use Show previous feedback above/i);
});

test('feedback is independent from review panels and only renders when populated', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);
  const reviewScope = component.slice(
    component.indexOf('function ReviewScope'),
    component.indexOf('function ReviewFeedback'),
  );

  assert.match(reviewScope, /className="comment-form"/);
  assert.doesNotMatch(reviewScope, /feedback-region/);
  assert.match(component, /function ReviewFeedback/);
  assert.match(component, /if \(!hasFeedback\) return null/);
  assert.match(
    component,
    /visibleFeedbackSides\(preferences\)[\s\S]*side\.startsWith\('question'\)/,
  );
  assert.match(
    component,
    /<SolutionContent[\s\S]*visibleFeedbackSides\(preferences\)[\s\S]*side\.startsWith\('answer'\)/,
  );
  assert.match(component, /visibleReviewSides\(preferences\)\.length > 0/);
  assert.match(
    css,
    /\.review-scopes\s*{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s,
  );
  assert.match(
    css,
    /\.feedback-region--populated\s*{[^}]*border:\s*2px solid var\(--signal\)/s,
  );
});

test('question bodies do not navigate when clicked or focused', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.doesNotMatch(component, /onFocusCapture=/);
  assert.doesNotMatch(component, /tabIndex=\{node\.depth === 0 \? 0 : -1\}/);
});

test('the review console follows the exact visible node with explicit side targets', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(component, /function flattenReviewCursors/);
  assert.match(component, /new IntersectionObserver\(updateCurrentCursor/);
  assert.match(component, /new ResizeObserver/);
  assert.match(
    component,
    /Math\.min\(200, Math\.max\(140, window\.innerHeight \* 0\.2\)\)/,
  );
  assert.match(component, /window\.addEventListener\('scroll'/);
  assert.match(
    component,
    /right\.cursor\.node\.depth - left\.cursor\.node\.depth/,
  );
  assert.match(component, /function toolbarOutcomeTarget\(side: ReviewSide\)/);
  assert.match(component, /currentCursor\.topLevelQuestion,[\s\S]*side,/);
  assert.match(
    component,
    /reviewCommentTargetForNode\(\s*currentCursor\.node,\s*currentCursor\.topLevelQuestion/s,
  );
  assert.match(component, /aria-label=\{`\$\{label\} review controls`\}/);
  assert.doesNotMatch(component, /keyboardSide/);
  assert.doesNotMatch(component, /submitKeyboardOutcome/);
  assert.doesNotMatch(component, /key === 'g'/);
  assert.match(component, /role="dialog"/);
  assert.match(component, /aria-modal="true"/);
  assert.match(component, /event\.currentTarget\.form\?\.requestSubmit\(\)/);
  assert.match(css, /\.review-lanes\s*{/);
  assert.match(css, /\.review-lane--question/);
  assert.match(css, /\.review-lane--answer/);
  assert.match(
    css,
    /\.review-toolbar\s*{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*justify-content:\s*stretch;[^}]*width:\s*100%/s,
  );
  assert.match(
    css,
    /\.review-lane--answer \.review-lane-actions[\s\S]*?justify-content:\s*flex-end/,
  );
  assert.match(
    css,
    /\.review-lane--answer \.review-lane-heading > div[\s\S]*?text-align:\s*right/,
  );
  assert.match(css, /\.review-view-menu\s*{[^}]*margin-left:\s*auto/s);
  assert.match(css, /\.keyboard-comment-backdrop\s*{[^}]*position:\s*fixed/s);
});

test('global findings use one product-wide composer and stay out of paper state', async () => {
  const [component, route] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(findingsRouteUrl, 'utf8'),
  ]);

  assert.match(component, />\s*Global finding\s*<\/button>/);
  assert.match(component, /All review content \/ product/);
  assert.match(component, /fetch\('\/api\/review\/findings'/);
  assert.match(component, /sourceVersion: paper\.source\.version/);
  assert.match(component, /message: 'Global finding submitted\.'/);
  assert.doesNotMatch(component, /setGlobalFindings|globalFindingCount/);
  assert.match(route, /export function GET\(\)/);
  assert.match(route, /listTodoGlobalReviewFindings\(\)/);
  assert.match(route, /export async function PATCH/);
  assert.match(route, /processGlobalReviewFinding\(input\)/);
});

test('review surfaces stay light and reviewer-facing rem sizes stay readable', async () => {
  const css = await fs.readFile(cssUrl, 'utf8');
  const remSizes = [...css.matchAll(/font-size:\s*(0\.\d+)rem/g)].map((match) =>
    Number(match[1]),
  );

  assert.doesNotMatch(css, /#1d2822/i);
  assert.doesNotMatch(css, /repeating-linear-gradient/);
  assert.match(
    css,
    /\.raw-source pre\s*{[^}]*background:\s*var\(--paper-deep\)/s,
  );
  assert.ok(
    remSizes.every((size) => size >= 0.875),
    `found a reviewer-facing rem size below 0.875rem: ${Math.min(...remSizes)}`,
  );
});

test('review Markdown uses the shared Paper component contracts', async () => {
  const [markdown, preparation, css] = await Promise.all([
    fs.readFile(markdownUrl, 'utf8'),
    fs.readFile(preparePaperUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(markdown, /@rtq\/review-paper-markdown/);
  assert.match(markdown, /remarkPaperListMdx/);
  assert.match(markdown, /remarkPaperList/);
  assert.match(markdown, /remarkPaperSmall/);
  assert.match(markdown, /remarkPaperTable/);
  assert.match(markdown, /rehypePaperTable/);
  assert.match(preparation, /preparePaperTableMarkdown/);
  assert.match(
    preparation,
    /const paperLists = preparePaperListMarkdown\(tables\.markdown\)/,
  );
  assert.match(preparation, /rendered: normalizeWorkingSections\(prepared/);
  assert.match(preparation, /children: node\.children\.map\(prepareNode\)/);
  assert.match(
    preparation,
    /question: prepareField\(node\.content\.question\)/,
  );
  assert.match(preparation, /answer: prepareField\(answer\.answer\)/);
  assert.match(preparation, /key: prepareField\(answer\.key\)/);
  assert.match(preparation, /option: prepareField\(answer\.option\)/);
  assert.match(preparation, /formulas: working\.formulas\.map/);
  assert.match(preparation, /tips: working\.tips\.map/);
  assert.match(preparation, /working: prepareField\(working\.working/);
  assert.match(css, /\.rtq-markdown ul\s*{[^}]*list-style-type:\s*disc/s);
  assert.match(css, /\.rtq-markdown ol\s*{[^}]*list-style-type:\s*decimal/s);
  assert.match(
    css,
    /\.rtq-markdown small\[data-paper-small\]\s*{[^}]*font-size:\s*0\.8em[^}]*line-height:\s*1\.5/s,
  );
});

test('the landing page uses a compact paper-first introduction', async () => {
  const [home, paperIndex, browser, component, css] = await Promise.all([
    fs.readFile(homeUrl, 'utf8'),
    fs.readFile(paperIndexUrl, 'utf8'),
    fs.readFile(browserUrl, 'utf8'),
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(home, /<PaperIndex initialQuery=/);
  assert.match(paperIndex, /<h1>Choose a paper<\/h1>/);
  assert.doesNotMatch(paperIndex, /Change the lens/);
  assert.match(browser, /href=\{collectionRoute\(collection\.id\)\}/);
  assert.match(browser, /aria-current=/);
  assert.match(browser, /window\.history\.replaceState/);
  assert.match(browser, /parameters\.set\('q', normalized\)/);
  assert.match(browser, /paper\.relativePath,\s*query,/);
  assert.match(
    component,
    /collectionRoute\(\s*paper\.source\.collection\.id,\s*searchParams\.get\('q'\)/,
  );
  assert.match(css, /\.index-intro\s*{[^}]*padding:\s*1\.5rem 0/s);
  assert.match(
    css,
    /\.collection-rail\s*{[^}]*background:\s*var\(--paper-deep\)/s,
  );
});

test('the paper rail links to a read-only whole-file macro review', async () => {
  const [browser, macrosPage, macrosList, css] = await Promise.all([
    fs.readFile(browserUrl, 'utf8'),
    fs.readFile(macrosPageUrl, 'utf8'),
    fs.readFile(macrosListUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(browser, /href="\/macros"/);
  assert.match(macrosPage, /readReviewMacros/);
  assert.match(
    macrosPage,
    /<MacroReviewList entries=\{macroDocument\.entries\}/,
  );
  assert.match(macrosPage, /Show complete raw file/);
  assert.match(macrosList, /entries\.map/);
  assert.match(macrosList, /role="switch"/);
  assert.match(macrosList, /Show original source/);
  assert.match(macrosList, /showOriginalSource \? \(/);
  assert.match(macrosList, /<RtqMarkdown markdown=\{entry\.expanded\}/);
  assert.doesNotMatch(macrosList, /Show expansion source/);
  assert.doesNotMatch(macrosList, /<details className="macro-entry-source"/);
  assert.doesNotMatch(macrosPage, /ReviewSurface|reviewContentReviewer/);
  assert.match(
    css,
    /\.review-toolbar\s*{[^}]*position:\s*sticky;[^}]*top:\s*0/s,
  );
  assert.match(
    css,
    /\.macro-preview\s*{[^}]*border-left:\s*3px solid var\(--ink\)/s,
  );
});

test('working content mirrors the production row hierarchy and stage rail', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  const formulasPosition = component.indexOf('label="Formulas used"');
  const tipsPosition = component.indexOf('label="Keep in mind"');
  const bodyPosition = component.indexOf('solution-row--working');

  assert.ok(formulasPosition >= 0, 'formula row label should render');
  assert.ok(tipsPosition > formulasPosition, 'tips should follow formulas');
  assert.ok(bodyPosition > tipsPosition, 'working body should follow tips');
  assert.match(component, /className="working-method-divider"/);
  assert.match(component, /className="working-stage-track"/);
  assert.match(component, /className="working-stage-title-rule"/);
  assert.match(component, /segment\.visibility === 'hidden'/);
  assert.match(
    css,
    /\.working-stage\s*{[^}]*grid-template-columns:\s*0\.8rem minmax\(0, 1fr\)/s,
  );
  assert.match(css, /\.working-stage-rail\s*{[^}]*width:\s*1px/s);
  assert.match(
    css,
    /@media \(max-width: 800px\)[\s\S]*\.solution-row\s*{[^}]*grid-template-columns:\s*1fr/s,
  );
});
