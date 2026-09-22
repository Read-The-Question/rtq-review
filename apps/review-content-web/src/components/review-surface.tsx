'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  type FormEvent,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import {
  DIMENSIONAL_TAG_AXES,
  compileContentSearch,
  contentSearchRanges,
  CONTENT_SEARCH_SCOPES,
  filterReviewPaper,
  normalizeContentSearchScope,
  parseReviewFilterSearchParams,
  serializeReviewFilterSearchParams,
  type CompiledContentSearch,
  type DimensionalTagAxis,
  type ContentSearchQuery,
  type ContentSearchScope,
  type ReviewFilterSelection,
  type ReviewPaperNode,
} from '@rtq/review-paper-model/client';

import type {
  DisplayContentField,
  DisplayPaperNode,
  DisplayReviewPaper,
  DisplayWorkingSegment,
} from '@/lib/display-model';
import {
  DEFAULT_REVIEW_PREFERENCES,
  EARLIER_REVIEW_PREFERENCES_KEY,
  INITIAL_REVIEW_PREFERENCES_KEY,
  LEGACY_REVIEW_PREFERENCES_KEY,
  PREVIOUS_REVIEW_PREFERENCES_KEY,
  REVIEW_FILTER_DISCLOSURE_KEY,
  REVIEW_PREFERENCES_KEY,
  activeReviewSides,
  adjacentQuestionId,
  clearReviewFiltersForContext,
  clearReviewOutcomeFiltersForContext,
  collectionRoute,
  paperRoute,
  parseReviewFilterDisclosure,
  parseReviewPreferences,
  reviewFilterSelectionForContext,
  reviewSidesForContext,
  reviewStateLabel,
  visibleFeedbackSides,
  visibleReviewSides,
  type ReviewContext,
  type ReviewPreferences,
  type ReviewControlMode,
} from '@/lib/review-view-model';
import {
  REVIEW_OUTCOME_OPTIONS,
  SIMPLE_REVIEW_OUTCOME_OPTIONS,
  displayedImageReviewMetadata,
  displayedReviewOutcome,
  isReviewOutcome,
  partitionReviewComments,
  reviewCommentTargetForNode,
  reviewTargetForNode,
  reviewTargetKey,
  reviewOutcomeLabel,
  reviewOutcomeFilterLabel,
  reviewOutcomeTone,
  reviewSourceForNode,
  runUniqueReviewRequest,
  type LocalReviewComment,
  type ImageReviewMetadata,
  type ReviewCommentLoad,
  type ReviewOutcomeDestination,
  type ReviewOutcomeLoad,
  type ReviewOutcomeSelection,
  type ReviewSide,
  type ReviewTargetDescriptor,
} from '@/lib/review-types';
import {
  evaluateSourceFreshness,
  sourceVersionUrl,
  type SourceFreshnessStatus,
} from '@/lib/source-freshness';

import { RtqMarkdown } from './rtq-markdown';
import { SiteHeader } from './site-header';

const axisCopy: Readonly<Record<DimensionalTagAxis, string>> = {
  family: 'Family',
  frame: 'Frame',
  marker: 'Marker',
  math: 'Math',
  reasoning: 'Reasoning',
};

const contentScopeLabels: Readonly<Record<ContentSearchScope, string>> = {
  all: 'All content',
  answer: 'Answers',
  question: 'Questions',
  working: 'Workings',
};

const ContentSearchContext = createContext<CompiledContentSearch | undefined>(
  undefined,
);

const PRIMARY_REVIEW_OPTIONS = REVIEW_OUTCOME_OPTIONS.filter(
  ({ outcome }) =>
    outcome === 'PRG' || outcome === 'PRCR' || outcome === 'PRCC',
);
const SECONDARY_REVIEW_OPTIONS = REVIEW_OUTCOME_OPTIONS.filter(
  ({ outcome }) => outcome === 'PRBD' || outcome === 'PRCS',
);

const REVIEW_SIDE_OPTIONS = [
  { label: 'Question', shortLabel: 'Q', value: 'question' },
  { label: 'Question image', shortLabel: 'QI', value: 'question-image' },
  { label: 'Answer', shortLabel: 'A', value: 'answer' },
  { label: 'Answer image', shortLabel: 'AI', value: 'answer-image' },
] as const satisfies readonly Readonly<{
  label: string;
  shortLabel: string;
  value: ReviewSide;
}>[];

const REVIEW_CONTEXT_OPTIONS = [
  { label: 'Question', shortLabel: 'Q', value: 'question' },
  { label: 'Answer', shortLabel: 'A', value: 'answer' },
] as const satisfies readonly Readonly<{
  label: string;
  shortLabel: string;
  value: ReviewContext;
}>[];

function reviewSideLabel(side: ReviewSide): string {
  return REVIEW_SIDE_OPTIONS.find((option) => option.value === side)!.label;
}

function reviewSideShortLabel(side: ReviewSide): string {
  return REVIEW_SIDE_OPTIONS.find((option) => option.value === side)!
    .shortLabel;
}

function dismissReviewPopover(element: Element): void {
  element
    .closest<HTMLDetailsElement>('details.review-popover')
    ?.removeAttribute('open');
}

function hasField(field: DisplayContentField): boolean {
  return Boolean(field.rendered.trim() || field.raw.trim());
}

function ContentField({
  field,
  hideLabel = false,
  label,
  preferences,
}: {
  field: DisplayContentField;
  hideLabel?: boolean;
  label: string;
  preferences: ReviewPreferences;
}) {
  if (!hasField(field)) return null;
  return (
    <div
      className={`content-field${hideLabel ? ' content-field--unlabelled' : ''}`}
    >
      {hideLabel ? null : <div className="content-field-label">{label}</div>}
      {field.rendered.trim() ? <RtqMarkdown markdown={field.rendered} /> : null}
      <FieldSupportingInfo
        field={field}
        label={label}
        preferences={preferences}
      />
    </div>
  );
}

function FieldSupportingInfo({
  field,
  label,
  preferences,
}: {
  field: DisplayContentField;
  label: string;
  preferences: ReviewPreferences;
}) {
  const contentSearch = useContext(ContentSearchContext);
  const searchRanges = useMemo(
    () =>
      contentSearch
        ? contentSearchRanges(field.raw, field.context.scope, contentSearch)
        : [],
    [contentSearch, field.context.scope, field.raw],
  );
  const rawSource = field.raw || '(empty)';
  let rawCursor = 0;

  return (
    <>
      {field.preparationIssue ? (
        <p className="preparation-issue" role="status">
          Content preparation note: {field.preparationIssue}
        </p>
      ) : null}
      {preferences.showRaw ? (
        <details className="raw-source" open>
          <summary>{label} source</summary>
          <pre>
            <code>
              {searchRanges.length === 0
                ? rawSource
                : searchRanges.flatMap((range, index) => {
                    const leading = field.raw.slice(rawCursor, range.start);
                    const matched = field.raw.slice(range.start, range.end);
                    rawCursor = range.end;
                    return [
                      leading,
                      <mark
                        className="raw-search-match"
                        key={`${range.start}-${range.end}-${index}`}
                      >
                        {matched}
                      </mark>,
                      ...(index === searchRanges.length - 1
                        ? [field.raw.slice(rawCursor)]
                        : []),
                    ];
                  })}
            </code>
          </pre>
        </details>
      ) : null}
    </>
  );
}

function statusValue(value: string | undefined): string {
  return value ?? 'Not set';
}

type ReviewRuntimeState = Readonly<{
  appendComment: (
    target: ReviewTargetDescriptor,
    comment: string,
    submissionId: string,
  ) => Promise<LocalReviewComment>;
  commentError?: string;
  comments: readonly LocalReviewComment[];
  imageMetadataOverrides: Readonly<Record<string, ImageReviewMetadata>>;
  outcomeDestination: ReviewOutcomeDestination;
  outcomeError?: string;
  outcomeOverrides: Readonly<Record<string, ReviewOutcomeSelection>>;
  pendingKeys: ReadonlySet<string>;
  reviewer: string;
  showPreviousFeedback: boolean;
  source: Readonly<{ collectionId: string; relativePath: string }>;
  submitOutcome: (
    target: ReviewTargetDescriptor,
    outcome: ReviewOutcomeSelection,
  ) => Promise<string>;
  updateImageMetadata: (
    target: ReviewTargetDescriptor,
    imageMetadata: ImageReviewMetadata,
  ) => void;
}>;

type ReviewActionStatus = Readonly<{
  kind: 'error' | 'idle' | 'success';
  message: string;
}>;

type ReviewCursor = Readonly<{
  node: DisplayPaperNode;
  topLevelQuestion: DisplayPaperNode;
}>;

type KeyboardCommentDialogState = Readonly<{
  nodeLabel: string;
  side: ReviewSide;
  target: ReviewTargetDescriptor;
  topLevelLabel: string;
}>;

type GlobalFindingDialogState = Readonly<{
  collectionId: string;
  nodeId: string;
  nodeLabel: string;
  relativePath: string;
  side: ReviewSide;
  sourceVersion: string;
}>;

function flattenReviewCursors(
  node: DisplayPaperNode,
  topLevelQuestion: DisplayPaperNode = node,
): readonly ReviewCursor[] {
  return [
    { node, topLevelQuestion },
    ...node.children.flatMap((child) =>
      flattenReviewCursors(child, topLevelQuestion),
    ),
  ];
}

type ReviewStatusTone = 'pending' | ReturnType<typeof reviewOutcomeTone>;

type ReviewStatusRail = Readonly<{
  outcome: ReviewOutcomeSelection | undefined;
  side: ReviewSide;
  tone: ReviewStatusTone;
}>;

function reviewStatusTone(
  outcome: ReviewOutcomeSelection | undefined,
): ReviewStatusTone {
  return outcome ? reviewOutcomeTone(outcome) : 'pending';
}

function reviewStatusRails(
  node: DisplayPaperNode,
  reviewSides: readonly ReviewSide[],
  runtime: ReviewRuntimeState,
): readonly ReviewStatusRail[] {
  if (node.depth !== 0) return [];
  return reviewSides.flatMap((side) => {
    if (!reviewTargetForNode(node, side, runtime.source)) return [];
    const outcome = displayedReviewOutcome(
      node,
      side,
      runtime.source,
      runtime.outcomeDestination,
      runtime.outcomeOverrides,
    );
    return [{ outcome, side, tone: reviewStatusTone(outcome) }];
  });
}

function utcDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return `${parsed.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

function CommentList({
  comments,
  current,
}: {
  comments: readonly LocalReviewComment[];
  current: boolean;
}) {
  if (comments.length === 0) {
    return current ? (
      <p className="comment-empty">No comments in this state.</p>
    ) : null;
  }
  return (
    <ol className={`comment-list${current ? '' : ' comment-list--history'}`}>
      {comments.map((comment) => (
        <li key={comment.id}>
          <div>
            <strong>{comment.reviewer}</strong>
            <time dateTime={comment.createdAt}>
              {utcDateTime(comment.createdAt)}
            </time>
            {!current ? (
              <span title={comment.ragState}>
                {reviewStateLabel(comment.ragState)} · not current
              </span>
            ) : null}
          </div>
          <p>{comment.comment}</p>
        </li>
      ))}
    </ol>
  );
}

function targetUnavailableReason(
  node: DisplayPaperNode,
  topLevelQuestion: DisplayPaperNode,
  side: ReviewSide,
): string {
  if (!node.uuid) return 'rtq-uuid is unavailable.';
  if (!topLevelQuestion.review[side]?.contentRag) {
    return `${reviewSideLabel(side)} RAG is unavailable on the top-level question.`;
  }
  if (
    side.endsWith('-image') &&
    topLevelQuestion.review[side]?.contentRag === 'rag_wf_notapplicable'
  ) {
    return `${reviewSideLabel(side)} is Not Applicable. Activate it explicitly at NG2 when image work is discovered.`;
  }
  return 'Review metadata is unavailable.';
}

function imageReviewSide(
  side: ReviewSide,
): 'answer-image' | 'question-image' | undefined {
  return side === 'answer-image' || side === 'question-image'
    ? side
    : undefined;
}

function ImageMetadataControls({
  disabled,
  metadata,
  onChange,
}: {
  disabled: boolean;
  metadata: ImageReviewMetadata;
  onChange: (metadata: ImageReviewMetadata) => void;
}) {
  function toggleType(type: 'generated' | 'screenshot', checked: boolean) {
    const selected = new Set(metadata.types);
    if (checked) selected.add(type);
    else selected.delete(type);
    onChange({
      ...metadata,
      types: (['generated', 'screenshot'] as const).filter((value) =>
        selected.has(value),
      ),
    });
  }

  function toggleDecorative(checked: boolean) {
    onChange({
      ...metadata,
      ignored: checked ? ['decorative'] : [],
    });
  }

  return (
    <fieldset className="image-metadata-controls" disabled={disabled}>
      <legend>Image handling</legend>
      <div>
        <label>
          <input
            checked={metadata.types.includes('generated')}
            onChange={(event) => toggleType('generated', event.target.checked)}
            type="checkbox"
          />
          <span>Generated</span>
        </label>
        <label>
          <input
            checked={metadata.types.includes('screenshot')}
            onChange={(event) => toggleType('screenshot', event.target.checked)}
            type="checkbox"
          />
          <span>Screenshot</span>
        </label>
        <label>
          <input
            checked={metadata.ignored.includes('decorative')}
            onChange={(event) => toggleDecorative(event.target.checked)}
            type="checkbox"
          />
          <span>Ignore decorative source image</span>
        </label>
      </div>
      <small>
        Choose all that apply. Saved immediately for the current image RAG
        state.
      </small>
    </fieldset>
  );
}

function ReviewScope({
  controlMode,
  node,
  outcomesEnabled,
  runtime,
  side,
  topLevelQuestion,
}: {
  controlMode: ReviewControlMode;
  node: DisplayPaperNode;
  outcomesEnabled: boolean;
  runtime: ReviewRuntimeState;
  side: ReviewSide;
  topLevelQuestion: DisplayPaperNode;
}) {
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<ReviewActionStatus>({
    kind: 'idle',
    message: '',
  });
  const submissionId = useRef<string | undefined>(undefined);
  const target = outcomesEnabled
    ? reviewTargetForNode(node, side, runtime.source)
    : reviewCommentTargetForNode(node, topLevelQuestion, side, runtime.source);
  const key = target ? reviewTargetKey(target) : `${node.id}:${side}`;
  const outcomePending = runtime.pendingKeys.has(`${key}:outcome`);
  const commentPending = runtime.pendingKeys.has(`${key}:comment`);
  const displayedOutcome = displayedReviewOutcome(
    node,
    side,
    runtime.source,
    runtime.outcomeDestination,
    runtime.outcomeOverrides,
  );
  const selectedImageSide = imageReviewSide(side);
  const imageState = selectedImageSide
    ? node.review[selectedImageSide]
    : undefined;
  const imageMetadata = selectedImageSide
    ? displayedImageReviewMetadata(
        node,
        selectedImageSide,
        runtime.source,
        runtime.imageMetadataOverrides,
      )
    : undefined;
  const outcomeDisabledReason = !target
    ? targetUnavailableReason(node, topLevelQuestion, side)
    : runtime.outcomeError
      ? runtime.outcomeError
      : runtime.outcomeDestination === 'google-sheets' && !target.sheet
        ? `Source state ${reviewStateLabel(target.ragState)} has no Google Sheets route.`
        : undefined;
  const commentDisabledReason = !target
    ? targetUnavailableReason(node, topLevelQuestion, side)
    : runtime.commentError;

  if (
    side.endsWith('-image') &&
    topLevelQuestion.review[side]?.contentRag === 'rag_wf_notapplicable'
  ) {
    return null;
  }

  async function submitOutcome(outcome: ReviewOutcomeSelection) {
    if (!target || outcomeDisabledReason || outcomePending) return;
    setStatus({ kind: 'idle', message: '' });
    try {
      const message = await runtime.submitOutcome(target, outcome);
      setStatus({ kind: 'success', message });
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Review request failed.',
      });
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target || commentPending || commentDisabledReason) return;
    const comment = draft.trim();
    if (!comment) {
      setStatus({
        kind: 'error',
        message: 'Enter a comment before adding it.',
      });
      return;
    }
    submissionId.current ??= crypto.randomUUID();
    setStatus({ kind: 'idle', message: '' });
    try {
      await runtime.appendComment(target, comment, submissionId.current);
      submissionId.current = undefined;
      setDraft('');
      setStatus({
        kind: 'success',
        message: 'Comment added to local review history.',
      });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Comment failed.',
      });
    }
  }

  return (
    <section
      className={`review-scope review-scope--${side} review-scope--status-${reviewStatusTone(displayedOutcome)}${
        status.kind === 'success' ? ' review-scope--success' : ''
      }`}
    >
      <header>
        <div>
          <span>{outcomesEnabled ? `${side} review` : `${side} feedback`}</span>
          <h4>{reviewSideLabel(side)}</h4>
        </div>
        <dl>
          <div>
            <dt>Source</dt>
            <dd>
              {target
                ? reviewStateLabel(target.ragState)
                : statusValue(node.review[side]?.contentRag)}
            </dd>
          </div>
          {imageState && imageMetadata ? (
            <div>
              <dt>Image types</dt>
              <dd>
                {imageMetadata.types.length
                  ? imageMetadata.types.join(', ')
                  : 'Unclassified at NG2 / none confirmed after NG2'}
              </dd>
            </div>
          ) : null}
          {imageState?.imageNotes ? (
            <div>
              <dt>Image notes</dt>
              <dd>{imageState.imageNotes}</dd>
            </div>
          ) : null}
          {imageMetadata?.ignored.length ? (
            <div>
              <dt>Ignored</dt>
              <dd>{imageMetadata.ignored.join(', ')}</dd>
            </div>
          ) : null}
          {outcomesEnabled ? (
            <>
              <div>
                <dt>Review request</dt>
                <dd>
                  {displayedOutcome
                    ? reviewOutcomeLabel(displayedOutcome)
                    : 'No request'}
                </dd>
              </div>
              {controlMode === 'advanced' &&
              runtime.outcomeDestination === 'google-sheets' ? (
                <div>
                  <dt>Sheet</dt>
                  <dd>{target?.sheet ?? 'Unavailable'}</dd>
                </div>
              ) : null}
            </>
          ) : null}
        </dl>
      </header>

      {outcomesEnabled && selectedImageSide && imageMetadata ? (
        <ImageMetadataControls
          disabled={Boolean(outcomeDisabledReason)}
          metadata={imageMetadata}
          onChange={(next) => {
            if (target) {
              runtime.updateImageMetadata(target, next);
            }
          }}
        />
      ) : null}

      {outcomesEnabled ? (
        <>
          {controlMode === 'simple' ? (
            <div
              aria-label={`${side} review requests`}
              className="outcome-actions outcome-actions--simple"
            >
              {SIMPLE_REVIEW_OUTCOME_OPTIONS.map((option) => (
                <button
                  aria-pressed={displayedOutcome === option.outcome}
                  className={`outcome-action outcome-action--${option.tone}`}
                  disabled={Boolean(outcomeDisabledReason) || outcomePending}
                  key={option.outcome}
                  onClick={() => void submitOutcome(option.outcome)}
                  title={outcomeDisabledReason}
                  type="button"
                >
                  {option.actionLabel}
                </button>
              ))}
              <button
                aria-pressed={!displayedOutcome}
                className="outcome-action outcome-action--reset"
                disabled={Boolean(outcomeDisabledReason) || outcomePending}
                onClick={() => void submitOutcome(null)}
                title={outcomeDisabledReason}
                type="button"
              >
                Reset
              </button>
            </div>
          ) : (
            <div
              className="outcome-actions"
              aria-label={`${side} review requests`}
            >
              {REVIEW_OUTCOME_OPTIONS.map((option) => (
                <button
                  aria-pressed={displayedOutcome === option.outcome}
                  className={`outcome-action outcome-action--${option.tone}`}
                  disabled={Boolean(outcomeDisabledReason) || outcomePending}
                  key={option.outcome}
                  onClick={() => void submitOutcome(option.outcome)}
                  title={outcomeDisabledReason}
                  type="button"
                >
                  {option.actionLabel}
                </button>
              ))}
              <button
                aria-pressed={!displayedOutcome}
                className="outcome-action outcome-action--reset"
                disabled={Boolean(outcomeDisabledReason) || outcomePending}
                onClick={() => void submitOutcome(null)}
                title={outcomeDisabledReason}
                type="button"
              >
                Reset
              </button>
            </div>
          )}
          {outcomeDisabledReason ? (
            <p className="review-unavailable">{outcomeDisabledReason}</p>
          ) : null}
        </>
      ) : null}

      <form
        className="comment-form"
        onSubmit={(event) => void submitComment(event)}
      >
        <label>
          Add feedback as {runtime.reviewer}
          <textarea
            disabled={Boolean(commentDisabledReason)}
            maxLength={10_000}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Append a state-specific comment…"
            rows={3}
            value={draft}
          />
        </label>
        <button
          disabled={Boolean(commentDisabledReason) || commentPending}
          type="submit"
        >
          {commentPending ? 'Adding locally…' : 'Add comment'}
        </button>
      </form>
      {commentDisabledReason ? (
        <p className="review-unavailable">{commentDisabledReason}</p>
      ) : null}
      {status.message ? (
        <p
          className={`review-action-status review-action-status--${status.kind}`}
          role="status"
        >
          {status.message}
        </p>
      ) : null}
    </section>
  );
}

function ReviewFeedback({
  node,
  runtime,
  side,
  topLevelQuestion,
}: {
  node: DisplayPaperNode;
  runtime: ReviewRuntimeState;
  side: ReviewSide;
  topLevelQuestion: DisplayPaperNode;
}) {
  const target = reviewCommentTargetForNode(
    node,
    topLevelQuestion,
    side,
    runtime.source,
  );
  const commentGroups = target
    ? partitionReviewComments(runtime.comments, target)
    : { current: [], history: [] };
  const legacyComments = node.review[side]?.legacyComments;
  const hasFeedback =
    commentGroups.current.length > 0 ||
    commentGroups.history.length > 0 ||
    Boolean(legacyComments);
  if (!hasFeedback) return null;

  return (
    <section
      aria-label={`${side} feedback`}
      aria-live="polite"
      className="feedback-region feedback-region--populated"
    >
      <div className="comment-heading">
        <div>
          <strong>{reviewSideLabel(side)} feedback</strong>
          <span>
            {target ? reviewStateLabel(target.ragState) : 'State unavailable'}
          </span>
        </div>
        <span>
          {commentGroups.current.length} current ·{' '}
          {commentGroups.history.length} previous
        </span>
      </div>
      <CommentList comments={commentGroups.current} current />
      {runtime.showPreviousFeedback && commentGroups.history.length > 0 ? (
        <section className="comment-history">
          <div className="comment-history-heading">
            <strong>Previous feedback</strong>
            <span>{commentGroups.history.length} read only</span>
          </div>
          <p>These comments do not apply to the current RAG state.</p>
          <CommentList comments={commentGroups.history} current={false} />
        </section>
      ) : null}
      {legacyComments ? (
        <details className="legacy-source-comments">
          <summary>Legacy synchronized comment</summary>
          <pre>{legacyComments}</pre>
        </details>
      ) : null}
    </section>
  );
}

function ReviewPanel({
  node,
  preferences,
  runtime,
  topLevelQuestion,
}: {
  node: DisplayPaperNode;
  preferences: ReviewPreferences;
  runtime: ReviewRuntimeState;
  topLevelQuestion: DisplayPaperNode;
}) {
  const outcomesEnabled = node.depth === 0;
  const sides = visibleReviewSides(preferences);
  if (sides.length === 0) return null;
  return (
    <aside
      className={`review-panel${outcomesEnabled ? '' : ' review-panel--nested'}`}
      aria-label={`${node.label} review status`}
    >
      <div className="review-panel-heading">
        <span>{outcomesEnabled ? 'Review workflow' : 'Node feedback'}</span>
        {!outcomesEnabled ? (
          <span>{`Own UUID · RAG inherited from ${topLevelQuestion.label}`}</span>
        ) : null}
      </div>
      <div
        className="review-scopes"
        data-review-context={preferences.reviewSide}
      >
        {sides.map((side) => (
          <ReviewScope
            controlMode={preferences.reviewControlMode}
            key={side}
            node={node}
            outcomesEnabled={outcomesEnabled}
            runtime={runtime}
            side={side}
            topLevelQuestion={topLevelQuestion}
          />
        ))}
      </div>
    </aside>
  );
}

function NodeTags({ node }: { node: DisplayPaperNode }) {
  return (
    <div className="node-tags" aria-label={`${node.label} dimensional tags`}>
      {DIMENSIONAL_TAG_AXES.map((axis) => {
        const tags = node.effectiveTags.filter((tag) => tag.axis === axis);
        return tags.length ? (
          <div className={`tag-group tag-group--${axis}`} key={axis}>
            <span>{axisCopy[axis]}</span>
            {tags.map((tag) => (
              <code key={`${tag.value}:${tag.origin}`} title={tag.origin}>
                {tag.value.slice(axis.length + 1)}
                {tag.origin === 'inherited' ? ' ↳' : ''}
                {tag.origin === 'implicit' ? ' · default' : ''}
              </code>
            ))}
          </div>
        ) : null;
      })}
    </div>
  );
}

function WorkingStage({
  first,
  segment,
  terminal,
}: {
  first: boolean;
  segment: Extract<DisplayWorkingSegment, { kind: 'section' }>;
  terminal: boolean;
}) {
  return (
    <section
      aria-label={segment.title ? undefined : `${segment.phase} working stage`}
      className={`working-stage${segment.title ? '' : ' working-stage--untitled'}`}
      data-first={first}
      data-phase={segment.phase}
      data-terminal={terminal}
    >
      <span aria-hidden="true" className="working-stage-track">
        <span className="working-stage-rail working-stage-rail--start" />
        <span className="working-stage-marker" />
        <span className="working-stage-rail working-stage-rail--end" />
        {terminal ? <span className="working-stage-terminal" /> : null}
      </span>
      {segment.title ? (
        <div className="working-stage-title-rule">
          <span aria-hidden="true" />
          <h5>{segment.title}</h5>
          <span aria-hidden="true" />
        </div>
      ) : null}
      <div className="working-stage-body">
        {segment.rendered ? <RtqMarkdown markdown={segment.rendered} /> : null}
      </div>
    </section>
  );
}

function WorkingBody({
  field,
  preferences,
}: {
  field: DisplayContentField;
  preferences: ReviewPreferences;
}) {
  const segments = field.workingSegments;
  if (!segments) {
    return (
      <ContentField
        field={field}
        hideLabel
        label="Working"
        preferences={preferences}
      />
    );
  }

  const visibleStageCount = segments.filter(
    (segment) => segment.kind === 'section' && segment.visibility === 'visible',
  ).length;
  let stageIndex = 0;

  return (
    <div className="content-field content-field--unlabelled">
      <div
        className="working-section-sequence"
        data-stage-count={visibleStageCount}
      >
        {segments.map((segment, index) => {
          if (segment.kind === 'flat') {
            return segment.rendered ? (
              <div className="working-flat-segment" key={`flat-${index}`}>
                <RtqMarkdown markdown={segment.rendered} />
              </div>
            ) : null;
          }
          if (segment.visibility === 'hidden') return null;
          const currentStage = stageIndex++;
          return (
            <WorkingStage
              first={currentStage === 0}
              key={`section-${index}`}
              segment={segment}
              terminal={currentStage === visibleStageCount - 1}
            />
          );
        })}
      </div>
      <FieldSupportingInfo
        field={field}
        label="Working"
        preferences={preferences}
      />
    </div>
  );
}

function SolutionContentRow({
  fields,
  kind,
  label,
  preferences,
}: {
  fields: readonly DisplayContentField[];
  kind: 'formulas' | 'tips';
  label: string;
  preferences: ReviewPreferences;
}) {
  if (!fields.some(hasField)) return null;
  return (
    <div className={`solution-row solution-row--${kind}`}>
      <div className="solution-row-label">{label}</div>
      <div className="solution-row-body">
        {fields.map((field, index) => (
          <ContentField
            field={field}
            hideLabel
            key={index}
            label={`${kind === 'formulas' ? 'Formula' : 'Tip'} ${index + 1}`}
            preferences={preferences}
          />
        ))}
      </div>
    </div>
  );
}

function hasVisibleWorking(
  field: DisplayContentField,
  preferences: ReviewPreferences,
): boolean {
  if (!field.workingSegments) return hasField(field);
  return Boolean(
    field.preparationIssue ||
    (preferences.showRaw && field.raw.trim()) ||
    field.workingSegments.some(
      (segment) => segment.kind === 'flat' || segment.visibility === 'visible',
    ),
  );
}

function SolutionContent({
  node,
  preferences,
}: {
  node: DisplayPaperNode;
  preferences: ReviewPreferences;
}) {
  if (!preferences.showSolutions) return null;
  const hasWorkings = node.content.workings.some(
    (working) =>
      hasVisibleWorking(working.working, preferences) ||
      working.formulas.some(hasField) ||
      working.tips.some(hasField),
  );
  const hasAnswers = node.content.answers.some(
    (answer) =>
      hasField(answer.option) ||
      hasField(answer.key) ||
      hasField(answer.answer),
  );
  if (!hasWorkings && !hasAnswers) return null;

  return (
    <div className="solution-grid">
      {hasWorkings ? (
        <section className="solution-block">
          <h4>Working</h4>
          {node.content.workings.map((working, index) => (
            <div className="solution-entry working-entry" key={index}>
              {index > 0 ? (
                <div className="working-method-divider">
                  <span>Method {index + 1}</span>
                  <span aria-hidden="true" />
                </div>
              ) : null}
              <div className="working-content-rows">
                <SolutionContentRow
                  fields={working.formulas}
                  kind="formulas"
                  label="Formulas used"
                  preferences={preferences}
                />
                <SolutionContentRow
                  fields={working.tips}
                  kind="tips"
                  label="Keep in mind"
                  preferences={preferences}
                />
                {hasVisibleWorking(working.working, preferences) ? (
                  <div className="solution-row solution-row--working">
                    <div
                      aria-hidden="true"
                      className="solution-row-label solution-row-label--spacer"
                    />
                    <div className="solution-row-body">
                      <WorkingBody
                        field={working.working}
                        preferences={preferences}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      ) : null}
      {hasAnswers ? (
        <section className="solution-block solution-block--answers">
          <h4>Answers</h4>
          {node.content.answers.map((answer, index) => (
            <div className="solution-entry" key={index}>
              {node.content.answers.length > 1 ? (
                <span className="entry-number">Answer {index + 1}</span>
              ) : null}
              <ContentField
                field={answer.option}
                label="Option"
                preferences={preferences}
              />
              <ContentField
                field={answer.key}
                label="Key"
                preferences={preferences}
              />
              <ContentField
                field={answer.answer}
                label="Answer"
                preferences={preferences}
              />
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function ImageReviewStatusBlock({
  node,
  runtime,
  showBackground,
  side,
}: {
  node: DisplayPaperNode;
  runtime: ReviewRuntimeState;
  showBackground: boolean;
  side: 'answer-image' | 'question-image';
}) {
  if (node.depth !== 0) return null;
  const target = reviewTargetForNode(node, side, runtime.source);
  const outcome = displayedReviewOutcome(
    node,
    side,
    runtime.source,
    runtime.outcomeDestination,
    runtime.outcomeOverrides,
  );
  const state = node.review[side];
  const tone = reviewStatusTone(outcome);
  const metadata = displayedImageReviewMetadata(
    node,
    side,
    runtime.source,
    runtime.imageMetadataOverrides,
  );
  const types = metadata.types;
  const ignored = metadata.ignored;

  return (
    <section
      aria-label={`${reviewSideLabel(side)} status`}
      className={`image-review-status${
        showBackground ? ` review-content-status--${tone}` : ''
      }`}
    >
      <span className="image-review-status-mark" aria-hidden="true">
        {reviewSideShortLabel(side)}
      </span>
      <div className="image-review-status-heading">
        <span>{reviewSideLabel(side)}</span>
        <strong>{outcome ? reviewOutcomeLabel(outcome) : 'Pending'}</strong>
      </div>
      <dl>
        <div>
          <dt>RAG state</dt>
          <dd>
            {target
              ? reviewStateLabel(target.ragState)
              : statusValue(state.contentRag)}
          </dd>
        </div>
        <div>
          <dt>Included image</dt>
          <dd>
            {types.length
              ? types.map((type) => reviewStateLabel(type)).join(', ')
              : state.contentRag === 'rag_wf_ng2'
                ? 'Unclassified at NG2'
                : 'No included image confirmed'}
          </dd>
        </div>
        <div>
          <dt>Ignored source image</dt>
          <dd>
            {ignored.length
              ? ignored.map((reason) => reviewStateLabel(reason)).join(', ')
              : 'None'}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function QuestionNode({
  idPrefix = '',
  matchingNodeIds,
  node,
  preferences,
  reviewSides,
  reviewRuntime,
  topLevelQuestion,
}: {
  idPrefix?: string;
  matchingNodeIds: ReadonlySet<string>;
  node: DisplayPaperNode;
  preferences: ReviewPreferences;
  reviewSides: readonly ReviewSide[];
  reviewRuntime: ReviewRuntimeState;
  topLevelQuestion: DisplayPaperNode;
}) {
  const exactMatch = matchingNodeIds.has(node.id);
  const statusRails = reviewStatusRails(node, reviewSides, reviewRuntime);
  const contentStatus = statusRails.find(
    ({ side }) => side === preferences.reviewSide,
  );
  const contentStatusTone = preferences.showStatusBackground
    ? contentStatus?.tone
    : undefined;
  const imageSide = `${preferences.reviewSide}-image` as const;
  const corpusSource = node.depth === 0 ? node.reviewSource : undefined;
  return (
    <article
      className={`question-node question-node--depth-${node.depth}${
        exactMatch ? '' : ' question-node--context'
      }${statusRails.length > 0 ? ' question-node--with-status-rails' : ''}${
        statusRails.some(({ side }) => side.startsWith('question'))
          ? ' question-node--with-question-status'
          : ''
      }${
        statusRails.some(({ side }) => side.startsWith('answer'))
          ? ' question-node--with-answer-status'
          : ''
      }${
        contentStatusTone
          ? ` question-node--status-background-${contentStatusTone}`
          : ''
      }`}
      id={`${idPrefix}question-${node.id}`}
    >
      {corpusSource ? (
        <header className="corpus-result-source">
          <span className="corpus-result-number">
            {String(corpusSource.resultPosition).padStart(3, '0')}
          </span>
          <div>
            <p>{corpusSource.paperTitle}</p>
            <span>
              {corpusSource.sectionLabel} · {node.label}
            </span>
            <code>{corpusSource.relativePath}</code>
          </div>
          <dl className="corpus-result-metadata">
            <div>
              <dt>Year</dt>
              <dd>{corpusSource.paperMetadata.year ?? '—'}</dd>
            </div>
            <div>
              <dt>Paper RAG</dt>
              <dd>{corpusSource.paperMetadata.paperRag ?? '—'}</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>{corpusSource.paperMetadata.accessTier ?? '—'}</dd>
            </div>
            <div>
              <dt>Schools</dt>
              <dd>{corpusSource.paperMetadata.schoolIds.join(', ') || '—'}</dd>
            </div>
          </dl>
          <Link
            href={`${paperRoute(
              corpusSource.collectionId,
              corpusSource.relativePath,
            )}?question=${encodeURIComponent(corpusSource.nodeId)}`}
          >
            Open in paper ↗
          </Link>
        </header>
      ) : null}
      {statusRails.length > 0 ? (
        <div className="question-status-rails" aria-hidden="true">
          {statusRails.map(({ side, tone }) => (
            <span
              className={`question-status-rail question-status-rail--${side} question-status-rail--${tone}`}
              key={side}
            >
              <span>{reviewSideShortLabel(side)}</span>
            </span>
          ))}
        </div>
      ) : null}
      <header className="question-heading">
        <div className="question-heading-main">
          <div className="question-label">
            <span>{node.kind.replaceAll('-', ' ')}</span>
            <h3>{node.label}</h3>
          </div>
          {node.depth === 0 ? (
            <QuestionReviewActivity
              node={node}
              runtime={reviewRuntime}
              statusRails={statusRails}
            />
          ) : null}
        </div>
        <div className="question-identifiers">
          {node.uuid ? <code>UUID {node.uuid}</code> : null}
          <code>{node.sourceQuestionId}</code>
          {node.originalSource?.paperStem ? (
            <span>Source · {node.originalSource.paperStem}</span>
          ) : null}
        </div>
      </header>

      {preferences.showTags ? <NodeTags node={node} /> : null}
      <div className="question-copy">
        <ContentField
          field={node.content.question}
          label="Question"
          preferences={preferences}
        />
      </div>
      {preferences.reviewSide === 'question' ? (
        <ImageReviewStatusBlock
          node={node}
          runtime={reviewRuntime}
          showBackground={preferences.showStatusBackground}
          side={imageSide}
        />
      ) : null}
      {visibleFeedbackSides(preferences)
        .filter((side) => side.startsWith('question'))
        .map((side) => (
          <ReviewFeedback
            key={side}
            node={node}
            runtime={reviewRuntime}
            side={side}
            topLevelQuestion={topLevelQuestion}
          />
        ))}
      <SolutionContent node={node} preferences={preferences} />
      {preferences.reviewSide === 'answer' ? (
        <ImageReviewStatusBlock
          node={node}
          runtime={reviewRuntime}
          showBackground={preferences.showStatusBackground}
          side={imageSide}
        />
      ) : null}
      {visibleFeedbackSides(preferences)
        .filter((side) => side.startsWith('answer'))
        .map((side) => (
          <ReviewFeedback
            key={side}
            node={node}
            runtime={reviewRuntime}
            side={side}
            topLevelQuestion={topLevelQuestion}
          />
        ))}
      {visibleReviewSides(preferences).length > 0 ? (
        <ReviewPanel
          node={node}
          preferences={preferences}
          runtime={reviewRuntime}
          topLevelQuestion={topLevelQuestion}
        />
      ) : null}
      {node.children.length ? (
        <div className="nested-questions">
          {node.children.map((child) => (
            <QuestionNode
              idPrefix={idPrefix}
              key={child.id}
              matchingNodeIds={matchingNodeIds}
              node={child}
              preferences={preferences}
              reviewSides={reviewSides}
              reviewRuntime={reviewRuntime}
              topLevelQuestion={topLevelQuestion}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function QuestionReviewActivity({
  node,
  runtime,
  statusRails,
}: {
  node: DisplayPaperNode;
  runtime: ReviewRuntimeState;
  statusRails: readonly ReviewStatusRail[];
}) {
  const activity = statusRails.flatMap(({ outcome, side, tone }) => {
    const target = reviewTargetForNode(node, side, runtime.source);
    if (!target) return [];
    const commentGroups = partitionReviewComments(runtime.comments, target);
    return [{ commentGroups, outcome, side, tone }];
  });
  if (activity.length === 0) return null;

  return (
    <div
      className="question-review-activity"
      aria-label="Current review activity"
      aria-live="polite"
    >
      {activity.map(({ commentGroups, outcome, side, tone }) => (
        <div className="question-review-activity-side" key={side}>
          <span
            className={`review-activity-badge review-activity-badge--${tone}`}
          >
            {reviewSideLabel(side)} ·{' '}
            {outcome ? reviewOutcomeLabel(outcome) : 'Pending'}
          </span>
          {commentGroups.current.length > 0 ? (
            <span className="review-feedback-badge">
              {reviewSideLabel(side)} feedback · {commentGroups.current.length}
            </span>
          ) : null}
          {runtime.showPreviousFeedback && commentGroups.history.length > 0 ? (
            <span className="review-feedback-badge review-feedback-badge--history">
              {reviewSideLabel(side)} previous · {commentGroups.history.length}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PreferenceToggle({
  checked,
  className,
  label,
  onChange,
}: {
  checked: boolean;
  className?: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`preference-toggle${className ? ` ${className}` : ''}`}>
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        role="switch"
        type="checkbox"
      />
      <span aria-hidden="true" className="preference-toggle-control">
        <span />
      </span>
      <span className="preference-toggle-label">{label}</span>
    </label>
  );
}

function ReviewSideSelector({
  onChange,
  side,
}: {
  onChange: (side: ReviewContext) => void;
  side: ReviewContext;
}) {
  return (
    <div
      aria-label="Review target"
      className="review-side-selector"
      role="group"
    >
      {REVIEW_CONTEXT_OPTIONS.map((option) => {
        return (
          <button
            aria-pressed={side === option.value}
            className={`review-side-option review-side-option--${option.value}`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <span aria-hidden="true">{option.shortLabel}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ReviewLane({
  commentDisabledReason,
  disabledReason,
  displayPreferences,
  feedbackEnabled,
  imageMetadata,
  inlineEnabled,
  nodeLabel,
  onComment,
  onOutcome,
  onImageMetadataChange,
  onToggleFeedback,
  onToggleInline,
  outcome,
  pending,
  side,
}: {
  commentDisabledReason?: string;
  disabledReason?: string;
  displayPreferences: boolean;
  feedbackEnabled: boolean;
  imageMetadata?: ImageReviewMetadata;
  inlineEnabled: boolean;
  nodeLabel: string;
  onComment: () => void;
  onOutcome: (outcome: ReviewOutcomeSelection) => void;
  onImageMetadataChange?: (metadata: ImageReviewMetadata) => void;
  onToggleFeedback: (enabled: boolean) => void;
  onToggleInline: (enabled: boolean) => void;
  outcome: ReviewOutcomeSelection | undefined;
  pending: boolean;
  side: ReviewSide;
}) {
  const label = reviewSideLabel(side);
  const actionDisabled = Boolean(disabledReason) || pending;
  const tone = reviewStatusTone(outcome);
  return (
    <section
      className={`review-lane review-lane--${side} review-lane--status-${tone}`}
      aria-label={`${label} review controls`}
    >
      <header className="review-lane-heading">
        <span className="review-lane-mark" aria-hidden="true">
          {reviewSideShortLabel(side)}
        </span>
        <div>
          <span>{label} review</span>
          <strong>{nodeLabel}</strong>
        </div>
      </header>
      <div className="review-lane-status" aria-live="polite">
        <span>Current outcome</span>
        <strong
          className={
            outcome
              ? `review-lane-status--${reviewOutcomeTone(outcome)}`
              : 'review-lane-status--pending'
          }
        >
          {outcome ? reviewOutcomeLabel(outcome) : 'Pending'}
        </strong>
      </div>
      {imageMetadata && onImageMetadataChange ? (
        <ImageMetadataControls
          disabled={Boolean(disabledReason)}
          metadata={imageMetadata}
          onChange={onImageMetadataChange}
        />
      ) : null}
      <div className="review-lane-actions">
        {PRIMARY_REVIEW_OPTIONS.map((option) => (
          <button
            aria-pressed={outcome === option.outcome}
            className={`review-lane-action review-lane-action--${option.tone}`}
            disabled={actionDisabled}
            key={option.outcome}
            onClick={() => onOutcome(option.outcome)}
            title={disabledReason}
            type="button"
          >
            {option.actionLabel}
          </button>
        ))}
        <button
          className="review-lane-action review-lane-action--comment"
          disabled={Boolean(commentDisabledReason)}
          onClick={onComment}
          title={commentDisabledReason}
          type="button"
        >
          Comment
        </button>
        {SECONDARY_REVIEW_OPTIONS.map((option) => (
          <button
            aria-pressed={outcome === option.outcome}
            className={`review-lane-action review-lane-action--${option.tone}`}
            disabled={actionDisabled}
            key={option.outcome}
            onClick={() => onOutcome(option.outcome)}
            title={disabledReason}
            type="button"
          >
            {option.actionLabel}
          </button>
        ))}
        <button
          aria-pressed={!outcome}
          className="review-lane-action review-lane-action--reset"
          disabled={actionDisabled}
          onClick={() => onOutcome(null)}
          title={disabledReason}
          type="button"
        >
          Reset
        </button>
      </div>
      <div className="review-lane-footer">
        {displayPreferences ? (
          <>
            <PreferenceToggle
              checked={feedbackEnabled}
              label="Review feedback"
              onChange={onToggleFeedback}
            />
            <PreferenceToggle
              checked={inlineEnabled}
              label="Inline review panel"
              onChange={onToggleInline}
            />
          </>
        ) : null}
        {disabledReason ? (
          <span className="review-lane-warning">{disabledReason}</span>
        ) : null}
      </div>
    </section>
  );
}

function FilterPanel({
  facets,
  onClear,
  onClearReviewOutcomes,
  onToggle,
  onToggleState,
  onReturnToQuestion,
  reviewOutcomeError,
  reviewOutcomeFacets,
  reviewContext,
  returnQuestionLabel,
  selection,
  stateFacets,
}: {
  facets: ReturnType<typeof filterReviewPaper>['facets'];
  onClear: () => void;
  onClearReviewOutcomes: () => void;
  onToggle: (axis: DimensionalTagAxis, value: string) => void;
  onToggleState: (
    parameter:
      | 'answerImageRag'
      | 'answerImageReview'
      | 'answerRag'
      | 'answerReview'
      | 'questionImageRag'
      | 'questionImageReview'
      | 'questionRag'
      | 'questionReview',
    value: string,
  ) => void;
  onReturnToQuestion?: () => void;
  reviewOutcomeError?: string;
  reviewOutcomeFacets: ReturnType<
    typeof filterReviewPaper
  >['reviewOutcomeFacets'];
  reviewContext: ReviewContext;
  returnQuestionLabel?: string;
  selection: ReviewFilterSelection;
  stateFacets: ReturnType<typeof filterReviewPaper>['stateFacets'];
}) {
  const selectedCount =
    DIMENSIONAL_TAG_AXES.reduce(
      (count, axis) => count + selection[axis].length,
      0,
    ) +
    selection.questionImageRag.length +
    selection.questionRag.length +
    selection.answerImageRag.length +
    selection.answerRag.length +
    selection.questionImageReview.length +
    selection.questionReview.length +
    selection.answerImageReview.length +
    selection.answerReview.length;
  const selectedReviewOutcomeCount =
    selection.questionImageReview.length +
    selection.questionReview.length +
    selection.answerImageReview.length +
    selection.answerReview.length;
  return (
    <section className="filter-panel" aria-labelledby="filter-title">
      <div className="filter-heading">
        <div>
          <p className="eyebrow">Runtime lens</p>
          <h2 id="filter-title">Review filters</h2>
        </div>
        <div className="filter-heading-actions">
          {onReturnToQuestion ? (
            <button onClick={onReturnToQuestion} type="button">
              Back to {returnQuestionLabel ?? 'current question'}
            </button>
          ) : null}
          <button
            disabled={selectedCount === 0}
            onClick={onClear}
            type="button"
          >
            Clear all {selectedCount ? `(${selectedCount})` : ''}
          </button>
        </div>
      </div>
      <section
        aria-label={`${reviewContext} review filters`}
        className={`review-context-filters review-context-filters--${reviewContext}`}
      >
        <header className="review-context-filter-heading">
          <div>
            <span className="review-context-filter-mark" aria-hidden="true">
              {reviewContext === 'question' ? 'Q' : 'A'}
            </span>
            <div>
              <strong>{reviewContext} review lens</strong>
              <span>
                A match in either the main or image outcome keeps the question
                in this view.
              </span>
            </div>
          </div>
          <div className="state-filter-intro-heading">
            <button
              aria-label="Reset review outcome filters"
              disabled={selectedReviewOutcomeCount === 0}
              onClick={onClearReviewOutcomes}
              type="button"
            >
              Reset
            </button>
          </div>
        </header>
        <div className="review-context-filter-rows">
          {reviewSidesForContext(reviewContext).map((side) => {
            const stateFacet = stateFacets.find((facet) => facet.side === side);
            const outcomeFacet = reviewOutcomeFacets.find(
              (facet) => facet.side === side,
            );
            if (!stateFacet) return null;
            return (
              <div className="review-context-filter-row" key={side}>
                <div className="review-context-filter-track">
                  <span aria-hidden="true">{reviewSideShortLabel(side)}</span>
                  <strong>{reviewSideLabel(side)}</strong>
                </div>
                <fieldset className={`state-facet state-facet--${side}`}>
                  <legend>RAG state</legend>
                  <div className="state-options">
                    {stateFacet.options.map((option) => (
                      <label
                        className={
                          option.disabled ? 'facet-option--disabled' : ''
                        }
                        key={option.value}
                        title={option.value}
                      >
                        <input
                          checked={option.selected}
                          disabled={option.disabled}
                          onChange={() =>
                            onToggleState(stateFacet.parameter, option.value)
                          }
                          type="checkbox"
                        />
                        <span>{reviewStateLabel(option.value)}</span>
                        <strong>{option.count}</strong>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className={`state-facet state-facet--${side}`}>
                  <legend>Review outcome</legend>
                  {reviewOutcomeError ? (
                    <p className="review-unavailable" role="status">
                      Outcomes unavailable: {reviewOutcomeError}
                    </p>
                  ) : (
                    <div className="state-options review-outcome-options">
                      {outcomeFacet?.options.map((option) => (
                        <label
                          className={`${
                            isReviewOutcome(option.value)
                              ? `review-outcome-option--${reviewOutcomeTone(option.value)}`
                              : ''
                          }${option.disabled ? ' facet-option--disabled' : ''}`}
                          key={option.value}
                          title={option.value}
                        >
                          <input
                            checked={option.selected}
                            disabled={option.disabled}
                            onChange={() =>
                              onToggleState(
                                outcomeFacet.parameter,
                                option.value,
                              )
                            }
                            type="checkbox"
                          />
                          <span>{reviewOutcomeFilterLabel(option.value)}</span>
                          <strong>{option.count}</strong>
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>
              </div>
            );
          })}
        </div>
      </section>
      <p className="filter-section-label">Content dimensions</p>
      <div className="facet-grid">
        {facets.map((facet) => (
          <details key={facet.axis} open={selection[facet.axis].length > 0}>
            <summary>
              <span>{facet.label}</span>
              <strong>
                {selection[facet.axis].length || facet.options.length}
              </strong>
            </summary>
            <div className="facet-options">
              {facet.options.map((option) => (
                <label
                  className={option.disabled ? 'facet-option--disabled' : ''}
                  key={option.value}
                >
                  <input
                    checked={option.selected}
                    disabled={option.disabled}
                    onChange={() => onToggle(facet.axis, option.value)}
                    type="checkbox"
                  />
                  <span>{option.value.slice(facet.axis.length + 1)}</span>
                  <strong>{option.count}</strong>
                </label>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function PaperContentSearch({
  error,
  limit,
  onApply,
  onClear,
  search,
}: {
  error?: string;
  limit?: 20 | 50 | 100;
  onApply: (search: ContentSearchQuery, limit?: 20 | 50 | 100) => void;
  onClear: () => void;
  search?: ContentSearchQuery;
}) {
  const [pattern, setPattern] = useState(search?.pattern ?? '');
  const [scope, setScope] = useState<ContentSearchScope>(
    search?.scope ?? 'all',
  );
  const [resultLimit, setResultLimit] = useState<20 | 50 | 100>(limit ?? 20);
  const [draftError, setDraftError] = useState<string>();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const compiled = compileContentSearch({ pattern, scope });
    if (compiled.state === 'invalid') {
      setDraftError(compiled.message);
      return;
    }
    setDraftError(undefined);
    onApply(
      {
        pattern: compiled.search.pattern,
        scope: compiled.search.scope,
      },
      resultLimit,
    );
  }

  const displayedError = draftError ?? error;
  return (
    <section
      className="paper-content-search"
      aria-labelledby="paper-content-search-title"
    >
      <div>
        <p className="eyebrow">Authored source</p>
        <strong id="paper-content-search-title">Search raw content</strong>
        <span>A nested match keeps its complete top-level question.</span>
      </div>
      <form className="raw-content-search" onSubmit={submit}>
        <label>
          <span>Regular expression</span>
          <input
            aria-describedby={
              displayedError ? 'paper-content-search-error' : undefined
            }
            onChange={(event) => setPattern(event.target.value)}
            placeholder={String.raw`For example: \\rtqMaths`}
            type="search"
            value={pattern}
          />
        </label>
        <label>
          <span>Scope</span>
          <select
            onChange={(event) =>
              setScope(normalizeContentSearchScope(event.target.value))
            }
            value={scope}
          >
            {CONTENT_SEARCH_SCOPES.map((value) => (
              <option key={value} value={value}>
                {contentScopeLabels[value]}
              </option>
            ))}
          </select>
        </label>
        {limit ? (
          <label>
            <span>Results</span>
            <select
              onChange={(event) =>
                setResultLimit(Number(event.target.value) as 20 | 50 | 100)
              }
              value={resultLimit}
            >
              {[20, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button disabled={!pattern.trim()} type="submit">
          {limit ? 'Search corpus' : 'Apply'}
        </button>
        {search ? (
          <button onClick={onClear} type="button">
            Clear
          </button>
        ) : null}
      </form>
      {displayedError ? (
        <p
          className="raw-content-search-error"
          id="paper-content-search-error"
          role="alert"
        >
          {displayedError}
        </p>
      ) : search ? (
        <code>
          {contentScopeLabels[search.scope]} · /{search.pattern}/im
        </code>
      ) : null}
    </section>
  );
}

function QuestionIndexNode({
  contentMatchingNodeIds,
  currentNodeId,
  matchingNodeIds,
  node,
}: {
  contentMatchingNodeIds: ReadonlySet<string>;
  currentNodeId: string | undefined;
  matchingNodeIds: ReadonlySet<string>;
  node: ReviewPaperNode;
}) {
  const exactMatch = matchingNodeIds.has(node.id);
  const contentMatch = contentMatchingNodeIds.has(node.id);
  const current = currentNodeId === node.id;
  return (
    <li
      className={`question-index-item question-index-item--depth-${node.depth}`}
    >
      <a
        aria-current={current ? 'true' : undefined}
        className={`${exactMatch ? 'question-index-link--match' : ''}${
          current ? ' question-index-link--current' : ''
        }`}
        href={`#question-${node.id}`}
      >
        <span>
          {node.reviewSource && node.depth === 0
            ? `${node.reviewSource.resultPosition} · ${node.reviewSource.paperTitle}`
            : node.label}
          {node.reviewSource && node.depth === 0 ? (
            <small>
              {node.reviewSource.sectionLabel} · {node.label}
            </small>
          ) : null}
        </span>
        {contentMatch ? (
          <span
            aria-label="Raw content match"
            className="question-index-search-marker"
            title="Raw content match"
          />
        ) : !exactMatch ? (
          <small>context</small>
        ) : null}
      </a>
      {node.children.length > 0 ? (
        <ol>
          {node.children.map((child) => (
            <QuestionIndexNode
              contentMatchingNodeIds={contentMatchingNodeIds}
              currentNodeId={currentNodeId}
              key={child.id}
              matchingNodeIds={matchingNodeIds}
              node={child}
            />
          ))}
        </ol>
      ) : null}
    </li>
  );
}

function PaperQuestionIndex({
  contentMatchingNodeIds,
  currentNodeId,
  matchingNodeIds,
  sections,
}: {
  contentMatchingNodeIds: ReadonlySet<string>;
  currentNodeId: string | undefined;
  matchingNodeIds: ReadonlySet<string>;
  sections: ReturnType<typeof filterReviewPaper>['matchingSections'];
}) {
  const indexRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      indexRef.current
        ?.querySelector<HTMLElement>('[aria-current="true"]')
        ?.scrollIntoView({ block: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [currentNodeId]);

  return (
    <aside
      className="question-index"
      aria-label="Filtered question navigation"
      ref={indexRef}
    >
      <span>Questions</span>
      {sections.map((section) => (
        <section className="question-index-section" key={section.id}>
          <a className="question-index-section-link" href={`#${section.id}`}>
            <span>{section.label}</span>
            <strong>{section.questions.length}</strong>
          </a>
          <ol>
            {section.questions.map((question) => (
              <QuestionIndexNode
                contentMatchingNodeIds={contentMatchingNodeIds}
                currentNodeId={currentNodeId}
                key={question.id}
                matchingNodeIds={matchingNodeIds}
                node={question}
              />
            ))}
          </ol>
        </section>
      ))}
    </aside>
  );
}

function QuestionNavigation({
  activeId,
  label,
  onNavigate,
  questionIds,
}: {
  activeId: string | undefined;
  label: string;
  onNavigate: (id: string) => void;
  questionIds: readonly string[];
}) {
  const activeIndex = activeId ? questionIds.indexOf(activeId) : -1;
  const previous = adjacentQuestionId(questionIds, activeId, -1);
  const next = adjacentQuestionId(questionIds, activeId, 1);
  return (
    <nav className="question-navigation" aria-label={label}>
      <button
        disabled={!previous}
        onClick={() => previous && onNavigate(previous)}
        type="button"
      >
        <span aria-hidden="true">←</span> Previous
      </button>
      <span>
        {activeIndex >= 0 ? activeIndex + 1 : 0} / {questionIds.length} matching
      </span>
      <button
        disabled={!next}
        onClick={() => next && onNavigate(next)}
        type="button"
      >
        Next <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}

function SourceFreshnessBanner({
  checking,
  onCheck,
  onRefresh,
  refreshing,
  status,
}: {
  checking: boolean;
  onCheck: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  status: SourceFreshnessStatus;
}) {
  if (status.state === 'current') return null;

  const copy =
    status.state === 'changed'
      ? {
          detail:
            'The TOML changed after this view loaded. Refresh to review the current working-tree version.',
          title: 'Source changed on disk',
        }
      : status.state === 'invalid'
        ? {
            detail: status.message,
            title: 'Source TOML is temporarily invalid',
          }
        : status.state === 'unavailable'
          ? {
              detail: status.message,
              title: 'Source file is unavailable',
            }
          : {
              detail: status.message,
              title: 'Freshness check could not complete',
            };

  return (
    <section
      className={`source-freshness source-freshness--${status.state}`}
      role={status.state === 'changed' ? 'status' : 'alert'}
    >
      <div>
        <strong>{copy.title}</strong>
        <span>{copy.detail}</span>
      </div>
      <div className="source-freshness-actions">
        {status.state === 'changed' ? (
          <button disabled={refreshing} onClick={onRefresh} type="button">
            {refreshing ? 'Refreshing…' : 'Refresh paper'}
          </button>
        ) : null}
        <button disabled={checking} onClick={onCheck} type="button">
          {checking ? 'Checking…' : 'Check again'}
        </button>
        {status.state === 'unavailable' ? (
          <Link href="/">Paper index</Link>
        ) : null}
      </div>
    </section>
  );
}

export type CorpusReviewSurfaceConfig = Readonly<{
  endPosition: number;
  invalidFileCount: number;
  limit: 20 | 50 | 100;
  nextCursor?: string;
  onClearSearch: () => void;
  onPage: (cursor: string) => void;
  onSearch: (search: ContentSearchQuery, limit: 20 | 50 | 100) => void;
  previousCursor?: string;
  scannedFileCount: number;
  searchError?: string;
  startPosition: number;
}>;

function CorpusPageNavigation({
  corpus,
}: {
  corpus: CorpusReviewSurfaceConfig;
}) {
  return (
    <nav className="corpus-page-navigation" aria-label="Corpus result pages">
      <button
        disabled={!corpus.previousCursor}
        onClick={() =>
          corpus.previousCursor && corpus.onPage(corpus.previousCursor)
        }
        type="button"
      >
        ← Previous {corpus.limit}
      </button>
      <span>
        {corpus.startPosition > 0
          ? `Results ${corpus.startPosition}–${corpus.endPosition}`
          : 'No matching results'}
      </span>
      <button
        disabled={!corpus.nextCursor}
        onClick={() => corpus.nextCursor && corpus.onPage(corpus.nextCursor)}
        type="button"
      >
        Next {corpus.limit} →
      </button>
    </nav>
  );
}

export function ReviewSurface({
  commentLoad,
  corpus,
  outcomeLoad,
  paper,
  reviewer,
}: {
  commentLoad: ReviewCommentLoad;
  corpus?: CorpusReviewSurfaceConfig;
  outcomeLoad: ReviewOutcomeLoad;
  paper: DisplayReviewPaper;
  reviewer: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refreshing, startRefresh] = useTransition();
  const [preferences, setPreferences] = useState<ReviewPreferences>(
    DEFAULT_REVIEW_PREFERENCES,
  );
  const [comments, setComments] = useState<readonly LocalReviewComment[]>(
    commentLoad.comments,
  );
  const [showPreviousFeedback, setShowPreviousFeedback] = useState(false);
  const [filterReturnQuestionId, setFilterReturnQuestionId] = useState<
    string | undefined
  >();
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [outcomeOverrides, setOutcomeOverrides] = useState<
    Readonly<Record<string, ReviewOutcomeSelection>>
  >(outcomeLoad.outcomes);
  const [imageMetadataOverrides, setImageMetadataOverrides] = useState<
    Readonly<Record<string, ImageReviewMetadata>>
  >(outcomeLoad.imageMetadata);
  const [pendingKeys, setPendingKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [sourceFreshness, setSourceFreshness] = useState<{
    key?: string;
    status: SourceFreshnessStatus;
  }>({ status: { state: 'current' } });
  const [sourceFreshnessChecking, setSourceFreshnessChecking] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string>();
  const [keyboardStatus, setKeyboardStatus] = useState<ReviewActionStatus>({
    kind: 'idle',
    message: '',
  });
  const [commentDialog, setCommentDialog] =
    useState<KeyboardCommentDialogState>();
  const [commentDraft, setCommentDraft] = useState('');
  const keyboardCommentSubmissionId = useRef<string | undefined>(undefined);
  const [globalFindingDialog, setGlobalFindingDialog] =
    useState<GlobalFindingDialogState>();
  const [globalFindingDraft, setGlobalFindingDraft] = useState('');
  const globalFindingSubmissionId = useRef<string | undefined>(undefined);
  const toolbarRef = useRef<HTMLElement>(null);
  const pendingRequestKeys = useRef(new Set<string>());
  const imageMetadataSaveChains = useRef(new Map<string, Promise<void>>());
  const sourceFreshnessPending = useRef(false);
  const selection = useMemo(
    () => parseReviewFilterSearchParams(searchParams.toString()),
    [searchParams],
  );
  const contentPattern = searchParams.get('content')?.trim() ?? '';
  const contentScope = normalizeContentSearchScope(
    searchParams.get('content-scope'),
  );
  const contentSearch = useMemo<ContentSearchQuery | undefined>(
    () =>
      contentPattern
        ? { pattern: contentPattern, scope: contentScope }
        : undefined,
    [contentPattern, contentScope],
  );
  const compiledContentSearch = useMemo(() => {
    if (!contentSearch) return undefined;
    const compiled = compileContentSearch(contentSearch);
    return compiled.state === 'ready' ? compiled.search : undefined;
  }, [contentSearch]);
  const activeSelection = useMemo(
    () => reviewFilterSelectionForContext(selection, preferences.reviewSide),
    [preferences.reviewSide, selection],
  );
  const enabledReviewSides = activeReviewSides(preferences);
  const reviewOutcomeFilterContext = useMemo(() => {
    if (outcomeLoad.error) return undefined;
    const source = {
      collectionId: paper.source.collection.id,
      relativePath: paper.source.relativePath,
    };
    return {
      values: Object.fromEntries(
        paper.sections.flatMap((section) =>
          section.questions.map((question) => {
            const valueFor = (side: ReviewSide) => {
              const target = reviewTargetForNode(question, side, source);
              return target
                ? (displayedReviewOutcome(
                    question,
                    side,
                    source,
                    outcomeLoad.destination,
                    outcomeOverrides,
                  ) ?? null)
                : undefined;
            };
            return [
              question.id,
              {
                answer: valueFor('answer'),
                'answer-image': valueFor('answer-image'),
                question: valueFor('question'),
                'question-image': valueFor('question-image'),
              },
            ];
          }),
        ),
      ),
    };
  }, [outcomeLoad.destination, outcomeLoad.error, outcomeOverrides, paper]);
  const result = useMemo(
    () =>
      filterReviewPaper(
        paper,
        activeSelection,
        reviewOutcomeFilterContext,
        contentSearch,
      ),
    [activeSelection, contentSearch, paper, reviewOutcomeFilterContext],
  );
  const displayNodeById = useMemo(
    () =>
      new Map(
        paper.sections.flatMap((section) =>
          section.questions.map((question) => [question.id, question] as const),
        ),
      ),
    [paper],
  );
  const activeFromUrl = searchParams.get('question') ?? undefined;
  const activeId = result.matchingQuestionTreeIds.includes(activeFromUrl ?? '')
    ? activeFromUrl
    : result.matchingQuestionTreeIds[0];
  const reviewCursors = useMemo(
    () =>
      result.matchingQuestionTreeIds.flatMap((id) => {
        const question = displayNodeById.get(id);
        return question ? flattenReviewCursors(question) : [];
      }),
    [displayNodeById, result.matchingQuestionTreeIds],
  );
  const reviewCursorById = useMemo(
    () => new Map(reviewCursors.map((cursor) => [cursor.node.id, cursor])),
    [reviewCursors],
  );
  const currentCursor =
    reviewCursorById.get(currentNodeId ?? '') ??
    reviewCursorById.get(activeId ?? '') ??
    reviewCursors[0];
  const navigationActiveId = currentCursor?.topLevelQuestion.id ?? activeId;
  const reviewSource = {
    collectionId: paper.source.collection.id,
    relativePath: paper.source.relativePath,
    version: paper.source.version,
  };
  const currentReviewSource = currentCursor
    ? reviewSourceForNode(currentCursor.node, reviewSource)
    : reviewSource;
  const currentSourceCollectionId = currentReviewSource.collectionId;
  const currentSourcePath = currentReviewSource.relativePath;
  const currentSourceVersion = currentReviewSource.version ?? '';
  const currentSourceKey = `${currentSourceCollectionId}\u0000${currentSourcePath}\u0000${currentSourceVersion}`;
  const hasCurrentCursor = Boolean(currentCursor);
  const isCorpusSurface = Boolean(corpus);
  function toolbarOutcomeTarget(side: ReviewSide) {
    return currentCursor
      ? reviewTargetForNode(currentCursor.topLevelQuestion, side, reviewSource)
      : undefined;
  }
  function outcomeDisabledReason(
    target: ReviewTargetDescriptor | undefined,
  ): string | undefined {
    if (!target) {
      return 'The current question does not have a reviewable UUID and RAG state.';
    }
    if (outcomeLoad.error) return outcomeLoad.error;
    if (outcomeLoad.destination === 'google-sheets' && !target.sheet) {
      return `Source state ${reviewStateLabel(target.ragState)} has no Google Sheets route.`;
    }
    return undefined;
  }
  function toolbarOutcomePending(side: ReviewSide): boolean {
    const target = toolbarOutcomeTarget(side);
    return target
      ? pendingKeys.has(`${reviewTargetKey(target)}:outcome`)
      : false;
  }
  function toolbarOutcome(side: ReviewSide) {
    return currentCursor
      ? displayedReviewOutcome(
          currentCursor.topLevelQuestion,
          side,
          reviewSource,
          outcomeLoad.destination,
          outcomeOverrides,
        )
      : undefined;
  }
  function toolbarImageMetadata(
    side: ReviewSide,
  ): ImageReviewMetadata | undefined {
    const selectedImageSide = imageReviewSide(side);
    return currentCursor && selectedImageSide
      ? displayedImageReviewMetadata(
          currentCursor.topLevelQuestion,
          selectedImageSide,
          reviewSource,
          imageMetadataOverrides,
        )
      : undefined;
  }
  function commentDisabledReason(side: ReviewSide): string | undefined {
    if (!currentCursor) return 'There is no current question to comment on.';
    const target = reviewCommentTargetForNode(
      currentCursor.node,
      currentCursor.topLevelQuestion,
      side,
      reviewSource,
    );
    return target
      ? commentLoad.error
      : targetUnavailableReason(
          currentCursor.node,
          currentCursor.topLevelQuestion,
          side,
        );
  }
  const keyboardCommentPending = commentDialog
    ? pendingKeys.has(`${reviewTargetKey(commentDialog.target)}:comment`)
    : false;
  const globalFindingPending = pendingKeys.has('global-finding:create');
  const matchingNodeIds = useMemo(
    () => new Set(result.matchingNodeIds),
    [result.matchingNodeIds],
  );
  const contentMatchingNodeIds = useMemo(
    () => new Set(result.contentMatchingNodeIds),
    [result.contentMatchingNodeIds],
  );
  const selectedFilterCount =
    DIMENSIONAL_TAG_AXES.reduce(
      (count, axis) => count + activeSelection[axis].length,
      0,
    ) +
    activeSelection.questionImageRag.length +
    activeSelection.questionRag.length +
    activeSelection.answerImageRag.length +
    activeSelection.answerRag.length +
    activeSelection.questionImageReview.length +
    activeSelection.questionReview.length +
    activeSelection.answerImageReview.length +
    activeSelection.answerReview.length;
  const currentQuestionIndex = navigationActiveId
    ? result.matchingQuestionTreeIds.indexOf(navigationActiveId)
    : -1;
  const previousQuestionId = adjacentQuestionId(
    result.matchingQuestionTreeIds,
    navigationActiveId,
    -1,
  );
  const nextQuestionId = adjacentQuestionId(
    result.matchingQuestionTreeIds,
    navigationActiveId,
    1,
  );

  async function checkSourceFreshness() {
    if (isCorpusSurface && !hasCurrentCursor) return;
    if (sourceFreshnessPending.current) return;
    sourceFreshnessPending.current = true;
    setSourceFreshnessChecking(true);

    try {
      const response = await fetch(
        sourceVersionUrl(currentSourceCollectionId, currentSourcePath),
        { cache: 'no-store' },
      );
      const payload: unknown = await response.json().catch(() => undefined);
      setSourceFreshness({
        key: currentSourceKey,
        status: evaluateSourceFreshness(currentSourceVersion, payload),
      });
    } catch {
      setSourceFreshness({
        key: currentSourceKey,
        status: {
          message:
            'The app could not inspect the source file. Check the local server and try again.',
          state: 'error',
        },
      });
    } finally {
      sourceFreshnessPending.current = false;
      setSourceFreshnessChecking(false);
    }
  }
  const checkVisibleSourceFreshness = useEffectEvent(checkSourceFreshness);

  const withPending = useCallback(
    <Result,>(key: string, request: () => Promise<Result>) =>
      runUniqueReviewRequest(
        pendingRequestKeys.current,
        key,
        request,
        setPendingKeys,
      ),
    [],
  );

  const responseMessage = useCallback(async (response: Response) => {
    const body = (await response.json().catch(() => ({}))) as {
      message?: unknown;
    };
    const message =
      typeof body.message === 'string' ? body.message : response.statusText;
    if (!response.ok) throw new Error(message || 'Review request failed.');
    return { body, message };
  }, []);

  const submitOutcome = useCallback(
    (target: ReviewTargetDescriptor, outcome: ReviewOutcomeSelection) => {
      const key = reviewTargetKey(target);
      return withPending(`${key}:outcome`, async () => {
        const response = await fetch('/api/review/outcome', {
          body: JSON.stringify({ outcome, reviewer, target }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const { message } = await responseMessage(response);
        setOutcomeOverrides((current) => ({ ...current, [key]: outcome }));
        return message;
      });
    },
    [responseMessage, reviewer, withPending],
  );

  const updateImageMetadata = useCallback(
    (target: ReviewTargetDescriptor, imageMetadata: ImageReviewMetadata) => {
      const key = reviewTargetKey(target);
      setImageMetadataOverrides((current) => ({
        ...current,
        [key]: imageMetadata,
      }));
      const previous = imageMetadataSaveChains.current.get(key);
      const save = (previous ?? Promise.resolve())
        .catch(() => undefined)
        .then(async () => {
          const response = await fetch('/api/review/image-metadata', {
            body: JSON.stringify({ imageMetadata, reviewer, target }),
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            method: 'POST',
          });
          const { message } = await responseMessage(response);
          setKeyboardStatus({
            kind: 'success',
            message: `${reviewSideLabel(target.side)} metadata: ${message}`,
          });
        })
        .catch((error: unknown) => {
          setKeyboardStatus({
            kind: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Image metadata could not be saved.',
          });
        })
        .finally(() => {
          if (imageMetadataSaveChains.current.get(key) === save) {
            imageMetadataSaveChains.current.delete(key);
          }
        });
      imageMetadataSaveChains.current.set(key, save);
    },
    [responseMessage, reviewer],
  );

  const appendComment = useCallback(
    (target: ReviewTargetDescriptor, comment: string, submissionId: string) => {
      const key = reviewTargetKey(target);
      return withPending(`${key}:comment`, async () => {
        const commentTarget = {
          collectionId: target.collectionId,
          nodeId: target.nodeId,
          questionId: target.questionId,
          ragState: target.ragState,
          relativePath: target.relativePath,
          side: target.side,
          uuid: target.uuid,
        };
        const response = await fetch('/api/review/comments', {
          body: JSON.stringify({
            comment,
            reviewer,
            submissionId,
            target: commentTarget,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const { body } = await responseMessage(response);
        const stored = (body as { comment?: LocalReviewComment }).comment;
        if (!stored) throw new Error('The stored comment was not returned.');
        setComments((current) =>
          current.some((item) => item.id === stored.id)
            ? current
            : [...current, stored],
        );
        return stored;
      });
    },
    [responseMessage, reviewer, withPending],
  );

  const reviewRuntime = useMemo<ReviewRuntimeState>(
    () => ({
      appendComment,
      commentError: commentLoad.error,
      comments,
      outcomeDestination: outcomeLoad.destination,
      outcomeError: outcomeLoad.error,
      outcomeOverrides,
      imageMetadataOverrides,
      pendingKeys,
      reviewer,
      showPreviousFeedback,
      source: {
        collectionId: paper.source.collection.id,
        relativePath: paper.source.relativePath,
      },
      submitOutcome,
      updateImageMetadata,
    }),
    [
      appendComment,
      commentLoad.error,
      comments,
      outcomeLoad.destination,
      outcomeLoad.error,
      outcomeOverrides,
      imageMetadataOverrides,
      paper.source.collection.id,
      paper.source.relativePath,
      pendingKeys,
      reviewer,
      showPreviousFeedback,
      submitOutcome,
      updateImageMetadata,
    ],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let next = DEFAULT_REVIEW_PREFERENCES;
      let nextFiltersExpanded = false;
      try {
        const stored = localStorage.getItem(REVIEW_PREFERENCES_KEY);
        next = parseReviewPreferences(
          stored,
          localStorage.getItem(PREVIOUS_REVIEW_PREFERENCES_KEY),
          localStorage.getItem(LEGACY_REVIEW_PREFERENCES_KEY),
          localStorage.getItem(EARLIER_REVIEW_PREFERENCES_KEY),
          localStorage.getItem(INITIAL_REVIEW_PREFERENCES_KEY),
        );
        if (!stored) {
          localStorage.setItem(REVIEW_PREFERENCES_KEY, JSON.stringify(next));
        }
      } catch {
        // Browser storage is optional; the in-memory controls still work.
      }
      try {
        nextFiltersExpanded = parseReviewFilterDisclosure(
          localStorage.getItem(REVIEW_FILTER_DISCLOSURE_KEY),
        );
      } catch {
        // The disclosure keeps its default when browser storage is unavailable.
      }
      setPreferences(next);
      setFiltersExpanded(nextFiltersExpanded);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function checkVisibleSource() {
      if (document.visibilityState === 'visible') {
        void checkVisibleSourceFreshness();
      }
    }

    window.addEventListener('focus', checkVisibleSource);
    document.addEventListener('visibilitychange', checkVisibleSource);
    return () => {
      window.removeEventListener('focus', checkVisibleSource);
      document.removeEventListener('visibilitychange', checkVisibleSource);
    };
  }, []);

  useEffect(() => {
    if (!activeFromUrl || activeId !== activeFromUrl) return;
    document
      .getElementById(`question-${activeId}`)
      ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [activeFromUrl, activeId]);

  useEffect(() => {
    let frame: number | undefined;

    function updateStickyRailOffset() {
      const toolbarHeight = toolbarRef.current?.getBoundingClientRect().height;
      if (toolbarHeight) {
        document.documentElement.style.setProperty(
          '--review-toolbar-offset',
          `${Math.ceil(toolbarHeight) + 16}px`,
        );
      }
    }

    function updateCurrentCursor() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const toolbarBottom =
          document
            .querySelector<HTMLElement>('.review-toolbar')
            ?.getBoundingClientRect().bottom ?? 0;
        const readingLine = Math.min(
          window.innerHeight - 1,
          toolbarBottom +
            Math.min(200, Math.max(140, window.innerHeight * 0.2)),
        );
        const positioned = reviewCursors.flatMap((cursor) => {
          const element = document.getElementById(`question-${cursor.node.id}`);
          if (!element) return [];
          return [{ cursor, rect: element.getBoundingClientRect() }];
        });
        const containing = positioned
          .filter(
            ({ rect }) => rect.top <= readingLine && rect.bottom > readingLine,
          )
          .toSorted(
            (left, right) =>
              right.cursor.node.depth - left.cursor.node.depth ||
              Math.abs(left.rect.top - readingLine) -
                Math.abs(right.rect.top - readingLine),
          );
        const next =
          containing[0] ??
          positioned
            .filter(({ rect }) => rect.top > readingLine)
            .toSorted((left, right) => left.rect.top - right.rect.top)[0] ??
          positioned
            .filter(({ rect }) => rect.bottom <= readingLine)
            .toSorted((left, right) => right.rect.bottom - left.rect.bottom)[0];
        if (next) {
          setCurrentNodeId((current) =>
            current === next.cursor.node.id ? current : next.cursor.node.id,
          );
        }
      });
    }

    const observer = new IntersectionObserver(updateCurrentCursor, {
      rootMargin: '-1px 0px -40% 0px',
      threshold: [0, 0.01, 0.5],
    });
    const toolbarObserver = new ResizeObserver(() => {
      updateStickyRailOffset();
      updateCurrentCursor();
    });
    if (toolbarRef.current) toolbarObserver.observe(toolbarRef.current);
    reviewCursors.forEach(({ node }) => {
      const element = document.getElementById(`question-${node.id}`);
      if (element) observer.observe(element);
    });
    window.addEventListener('scroll', updateCurrentCursor, { passive: true });
    window.addEventListener('resize', updateCurrentCursor);
    updateStickyRailOffset();
    updateCurrentCursor();
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer.disconnect();
      toolbarObserver.disconnect();
      document.documentElement.style.removeProperty('--review-toolbar-offset');
      window.removeEventListener('scroll', updateCurrentCursor);
      window.removeEventListener('resize', updateCurrentCursor);
    };
  }, [reviewCursors]);

  function replaceSearchParams(next: URLSearchParams) {
    const query = next.toString();
    window.history.replaceState(
      null,
      '',
      query ? `${pathname}?${query}` : pathname,
    );
  }

  function updatePreference<Key extends keyof ReviewPreferences>(
    key: Key,
    value: ReviewPreferences[Key],
  ) {
    setPreferences((current) => {
      const next = { ...current, [key]: value };
      try {
        localStorage.setItem(REVIEW_PREFERENCES_KEY, JSON.stringify(next));
      } catch {
        // Display preferences remain usable when browser storage is unavailable.
      }
      return next;
    });
  }

  function updateFilterDisclosure(expanded: boolean) {
    setFiltersExpanded(expanded);
    try {
      localStorage.setItem(
        REVIEW_FILTER_DISCLOSURE_KEY,
        JSON.stringify({ expanded }),
      );
    } catch {
      // The disclosure remains usable when browser storage is unavailable.
    }
  }

  function toggleFilter(axis: DimensionalTagAxis, value: string) {
    const selected = selection[axis].includes(value);
    const nextSelection = {
      ...selection,
      [axis]: selected
        ? selection[axis].filter((item) => item !== value)
        : [...selection[axis], value],
    };
    const current = new URLSearchParams(searchParams.toString());
    current.delete('question');
    replaceSearchParams(
      new URLSearchParams(
        serializeReviewFilterSearchParams(nextSelection, current),
      ),
    );
  }

  function toggleStateFilter(
    parameter:
      | 'answerImageRag'
      | 'answerImageReview'
      | 'answerRag'
      | 'answerReview'
      | 'questionImageRag'
      | 'questionImageReview'
      | 'questionRag'
      | 'questionReview',
    value: string,
  ) {
    const selected = selection[parameter].includes(value);
    const nextSelection = {
      ...selection,
      [parameter]: selected
        ? selection[parameter].filter((item) => item !== value)
        : [...selection[parameter], value],
    };
    const current = new URLSearchParams(searchParams.toString());
    current.delete('question');
    replaceSearchParams(
      new URLSearchParams(
        serializeReviewFilterSearchParams(nextSelection, current),
      ),
    );
  }

  function clearFilters() {
    const current = new URLSearchParams(searchParams.toString());
    current.delete('question');
    replaceSearchParams(
      new URLSearchParams(
        serializeReviewFilterSearchParams(
          clearReviewFiltersForContext(selection, preferences.reviewSide),
          current,
        ),
      ),
    );
  }

  function clearReviewOutcomes() {
    const current = new URLSearchParams(searchParams.toString());
    current.delete('question');
    replaceSearchParams(
      new URLSearchParams(
        serializeReviewFilterSearchParams(
          clearReviewOutcomeFiltersForContext(
            selection,
            preferences.reviewSide,
          ),
          current,
        ),
      ),
    );
  }

  function applyContentSearch(
    search: ContentSearchQuery,
    requestedLimit?: 20 | 50 | 100,
  ) {
    if (corpus) {
      corpus.onSearch(search, requestedLimit ?? corpus.limit);
      return;
    }
    const current = new URLSearchParams(searchParams.toString());
    current.delete('question');
    current.set('content', search.pattern);
    if (search.scope === 'all') current.delete('content-scope');
    else current.set('content-scope', search.scope);
    replaceSearchParams(current);
  }

  function clearContentSearch() {
    if (corpus) {
      corpus.onClearSearch();
      return;
    }
    const current = new URLSearchParams(searchParams.toString());
    current.delete('content');
    current.delete('content-scope');
    current.delete('question');
    replaceSearchParams(current);
  }

  function navigateTo(id: string) {
    setCurrentNodeId(id);
    const next = new URLSearchParams(searchParams.toString());
    next.set('question', id);
    replaceSearchParams(next);
  }

  function showFilters() {
    setFilterReturnQuestionId(activeId);
    updateFilterDisclosure(true);
    requestAnimationFrame(() => {
      const panel = document.getElementById('review-filters');
      panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      panel?.focus({ preventScroll: true });
    });
  }

  function returnToQuestion() {
    const target =
      filterReturnQuestionId &&
      result.matchingQuestionTreeIds.includes(filterReturnQuestionId)
        ? filterReturnQuestionId
        : activeId;
    if (!target) return;
    navigateTo(target);
    requestAnimationFrame(() => {
      const question = document.getElementById(`question-${target}`);
      question?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      question?.focus({ preventScroll: true });
    });
  }

  function refreshPaper() {
    if (corpus) {
      window.location.reload();
      return;
    }
    startRefresh(() => router.refresh());
  }

  function scrollToPageBoundary(boundary: 'top' | 'bottom') {
    document
      .getElementById(boundary === 'top' ? 'paper-top' : 'paper-bottom')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: boundary === 'top' ? 'start' : 'end',
      });
  }

  async function submitToolbarOutcome(
    side: ReviewSide,
    outcome: ReviewOutcomeSelection,
  ) {
    const target = toolbarOutcomeTarget(side);
    const disabledReason = outcomeDisabledReason(target);
    const pending = toolbarOutcomePending(side);
    if (!target || disabledReason || pending) {
      if (disabledReason) {
        setKeyboardStatus({
          kind: 'error',
          message: disabledReason,
        });
      }
      return;
    }
    setKeyboardStatus({ kind: 'idle', message: '' });
    try {
      const message = await submitOutcome(target, outcome);
      const label = reviewSideLabel(side);
      setKeyboardStatus({ kind: 'success', message: `${label}: ${message}` });
    } catch (error) {
      setKeyboardStatus({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Review request failed.',
      });
    }
  }

  function openKeyboardComment(side: ReviewSide) {
    if (!currentCursor) {
      setKeyboardStatus({
        kind: 'error',
        message: 'There is no current question to comment on.',
      });
      return;
    }
    const target = reviewCommentTargetForNode(
      currentCursor.node,
      currentCursor.topLevelQuestion,
      side,
      {
        collectionId: paper.source.collection.id,
        relativePath: paper.source.relativePath,
      },
    );
    const unavailable = !target
      ? 'The current node does not have a reviewable UUID and RAG state.'
      : commentLoad.error;
    if (!target || unavailable) {
      setKeyboardStatus({
        kind: 'error',
        message: unavailable ?? 'Comments are unavailable.',
      });
      return;
    }
    keyboardCommentSubmissionId.current = undefined;
    setCommentDraft('');
    setKeyboardStatus({ kind: 'idle', message: '' });
    setCommentDialog({
      nodeLabel: currentCursor.node.label,
      side,
      target,
      topLevelLabel: currentCursor.topLevelQuestion.label,
    });
  }

  function closeKeyboardComment() {
    if (keyboardCommentPending) return;
    keyboardCommentSubmissionId.current = undefined;
    setCommentDialog(undefined);
    setCommentDraft('');
  }

  async function submitKeyboardComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!commentDialog || keyboardCommentPending) return;
    const comment = commentDraft.trim();
    if (!comment) {
      setKeyboardStatus({
        kind: 'error',
        message: 'Enter a comment before adding it.',
      });
      return;
    }
    keyboardCommentSubmissionId.current ??= crypto.randomUUID();
    setKeyboardStatus({ kind: 'idle', message: '' });
    try {
      await appendComment(
        commentDialog.target,
        comment,
        keyboardCommentSubmissionId.current,
      );
      keyboardCommentSubmissionId.current = undefined;
      setCommentDialog(undefined);
      setCommentDraft('');
      setKeyboardStatus({
        kind: 'success',
        message: `Comment added to ${commentDialog.nodeLabel}.`,
      });
    } catch (error) {
      setKeyboardStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Comment failed.',
      });
    }
  }

  function openGlobalFinding() {
    if (!currentCursor) {
      setKeyboardStatus({
        kind: 'error',
        message: 'There is no current question to provide context.',
      });
      return;
    }
    globalFindingSubmissionId.current = undefined;
    setGlobalFindingDraft('');
    setKeyboardStatus({ kind: 'idle', message: '' });
    const source = reviewSourceForNode(currentCursor.node, reviewSource);
    setGlobalFindingDialog({
      collectionId: source.collectionId,
      nodeId: source.nodeId,
      nodeLabel: currentCursor.node.label,
      relativePath: source.relativePath,
      side: 'question',
      sourceVersion: source.version ?? paper.source.version,
    });
  }

  function closeGlobalFinding() {
    if (globalFindingPending) return;
    globalFindingSubmissionId.current = undefined;
    setGlobalFindingDialog(undefined);
    setGlobalFindingDraft('');
  }

  async function submitGlobalFinding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!globalFindingDialog || globalFindingPending) return;
    const finding = globalFindingDraft.trim();
    if (!finding) {
      setKeyboardStatus({
        kind: 'error',
        message: 'Enter a finding before submitting it.',
      });
      return;
    }
    globalFindingSubmissionId.current ??= crypto.randomUUID();
    setKeyboardStatus({ kind: 'idle', message: '' });
    try {
      await withPending('global-finding:create', async () => {
        const response = await fetch('/api/review/findings', {
          body: JSON.stringify({
            finding,
            reviewer,
            source: {
              collectionId: globalFindingDialog.collectionId,
              nodeId: globalFindingDialog.nodeId,
              relativePath: globalFindingDialog.relativePath,
              side: globalFindingDialog.side,
              sourceVersion: globalFindingDialog.sourceVersion,
            },
            submissionId: globalFindingSubmissionId.current,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        await responseMessage(response);
      });
      globalFindingSubmissionId.current = undefined;
      setGlobalFindingDialog(undefined);
      setGlobalFindingDraft('');
      setKeyboardStatus({
        kind: 'success',
        message: 'Global finding submitted.',
      });
    } catch (error) {
      setKeyboardStatus({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Finding submission failed.',
      });
    }
  }

  useEffect(() => {
    function closeReviewPopoversOutside(target: Node): void {
      toolbarRef.current
        ?.querySelectorAll<HTMLDetailsElement>('details.review-popover[open]')
        .forEach((details) => {
          if (!details.contains(target)) details.removeAttribute('open');
        });
    }

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node) {
        closeReviewPopoversOutside(event.target);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (globalFindingDialog) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeGlobalFinding();
        }
        return;
      }
      if (commentDialog) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeKeyboardComment();
        }
        return;
      }
      if (event.key === 'Escape') {
        const openPopovers = toolbarRef.current?.querySelectorAll(
          'details.review-popover[open]',
        );
        if (openPopovers?.length) {
          event.preventDefault();
          openPopovers.forEach((details) => details.removeAttribute('open'));
          return;
        }
      }
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName ?? '')
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        (key === 't' || key === 'b')
      ) {
        event.preventDefault();
        scrollToPageBoundary(key === 't' ? 'top' : 'bottom');
        return;
      }

      const direction =
        key === 'j' || (event.altKey && event.key === 'ArrowDown')
          ? 1
          : key === 'k' || (event.altKey && event.key === 'ArrowUp')
            ? -1
            : undefined;
      if (!direction) return;
      const next = adjacentQuestionId(
        result.matchingQuestionTreeIds,
        navigationActiveId,
        direction,
      );
      if (next) {
        event.preventDefault();
        navigateTo(next);
      }
    }
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <main className="paper-shell" id="paper-top">
      <SiteHeader compact outcomeDestination={outcomeLoad.destination} />
      <header className="paper-hero">
        <div className="paper-breadcrumb">
          <Link href="/">Paper index</Link>
          <span>/</span>
          {corpus ? (
            <Link href="/search">Corpus search</Link>
          ) : (
            <Link
              href={collectionRoute(
                paper.source.collection.id,
                searchParams.get('q') ?? undefined,
                contentSearch,
              )}
            >
              {paper.source.collection.label}
            </Link>
          )}
        </div>
        <div className="paper-title-row">
          <div>
            <p className="eyebrow">
              {corpus
                ? 'Canonical question corpus'
                : `${paper.source.provenance.kind} source`}
            </p>
            <h1>
              {corpus && corpus.startPosition > 0
                ? `Search results ${corpus.startPosition}–${corpus.endPosition}`
                : corpus
                  ? 'Search every question'
                  : paper.title}
            </h1>
            <code>
              {corpus && contentSearch
                ? `/${contentSearch.pattern}/im · ${contentScopeLabels[contentSearch.scope]}`
                : paper.source.fileName}
            </code>
          </div>
          <dl className="paper-metadata">
            <div>
              <dt>Questions</dt>
              <dd>{paper.source.questionCount}</dd>
            </div>
            <div>
              <dt>{corpus ? 'Files scanned' : 'Year'}</dt>
              <dd>
                {corpus
                  ? corpus.scannedFileCount
                  : (paper.metadata.year ?? '—')}
              </dd>
            </div>
            <div>
              <dt>{corpus ? 'Page size' : 'Paper RAG'}</dt>
              <dd>
                {corpus ? corpus.limit : (paper.metadata.paperRag ?? '—')}
              </dd>
            </div>
            <div>
              <dt>{corpus ? 'Source' : 'Access'}</dt>
              <dd>
                {corpus ? 'Canonical TOML' : (paper.metadata.accessTier ?? '—')}
              </dd>
            </div>
          </dl>
        </div>
        {corpus ? null : (
          <div className="paper-provenance">
            {paper.metadata.paperId ? (
              <code>ID {paper.metadata.paperId}</code>
            ) : null}
            {paper.metadata.schoolIds.map((school) => (
              <code key={school}>School {school}</code>
            ))}
          </div>
        )}
      </header>

      {!corpus || currentCursor ? (
        <SourceFreshnessBanner
          checking={sourceFreshnessChecking}
          onCheck={() => void checkSourceFreshness()}
          onRefresh={refreshPaper}
          refreshing={refreshing}
          status={
            sourceFreshness.key === currentSourceKey
              ? sourceFreshness.status
              : { state: 'current' }
          }
        />
      ) : null}

      <PaperContentSearch
        error={corpus?.searchError ?? result.contentSearchError}
        key={`${contentSearch?.pattern ?? ''}:${contentSearch?.scope ?? 'all'}:${corpus?.limit ?? ''}`}
        limit={corpus?.limit}
        onApply={applyContentSearch}
        onClear={clearContentSearch}
        search={contentSearch}
      />

      <section
        className={`filter-disclosure${
          filtersExpanded ? ' filter-disclosure--expanded' : ''
        }`}
        id="review-filters"
        tabIndex={-1}
      >
        <button
          aria-controls="review-filters"
          aria-expanded={filtersExpanded}
          className="filter-disclosure-toggle"
          onClick={() => updateFilterDisclosure(!filtersExpanded)}
          type="button"
        >
          <span aria-hidden="true">{filtersExpanded ? '−' : '+'}</span>
          <strong>Review filters</strong>
          <small>
            {selectedFilterCount
              ? `${selectedFilterCount} active · ${result.matchingQuestionTreeCount} matching`
              : contentSearch
                ? `Raw search active · ${result.matchingQuestionTreeCount} matching`
                : 'No active filters'}
          </small>
          <span>{filtersExpanded ? 'Collapse' : 'Expand'}</span>
        </button>
        {filtersExpanded ? (
          <FilterPanel
            facets={result.facets}
            onClear={clearFilters}
            onClearReviewOutcomes={clearReviewOutcomes}
            onToggle={toggleFilter}
            onToggleState={toggleStateFilter}
            onReturnToQuestion={
              filterReturnQuestionId ? returnToQuestion : undefined
            }
            reviewOutcomeError={outcomeLoad.error}
            reviewOutcomeFacets={result.reviewOutcomeFacets}
            reviewContext={preferences.reviewSide}
            returnQuestionLabel={
              filterReturnQuestionId
                ? (displayNodeById.get(filterReturnQuestionId)?.label ??
                  'question')
                : undefined
            }
            selection={activeSelection}
            stateFacets={result.stateFacets}
          />
        ) : null}
      </section>

      <section
        className="review-toolbar"
        aria-label="Paper review console"
        ref={toolbarRef}
      >
        <div className="review-toolbar-common">
          <div className="review-toolbar-group review-toolbar-group--navigation">
            <button
              aria-controls="review-filters"
              aria-expanded={filtersExpanded}
              className="toolbar-filter-button"
              onClick={showFilters}
              type="button"
            >
              Filters
              <strong aria-label={`${selectedFilterCount} active filters`}>
                {selectedFilterCount}
              </strong>
            </button>
            <div className="toolbar-current-question" aria-live="polite">
              <span className="toolbar-label">Current</span>
              <strong>{currentCursor?.node.label ?? 'No question'}</strong>
              <small>
                {currentQuestionIndex >= 0
                  ? `${currentQuestionIndex + 1} of ${result.matchingQuestionTreeIds.length}`
                  : `0 of ${result.matchingQuestionTreeIds.length}`}
              </small>
            </div>
            <div
              aria-label="Question navigation"
              className="toolbar-scroll-controls toolbar-question-controls"
              role="group"
            >
              <button
                aria-label="Previous question (keyboard shortcut: k)"
                disabled={!previousQuestionId}
                onClick={() =>
                  previousQuestionId && navigateTo(previousQuestionId)
                }
                title="Previous question (k)"
                type="button"
              >
                <span aria-hidden="true">←</span>
                <span>Previous</span>
                <kbd>k</kbd>
              </button>
              <button
                aria-label="Next question (keyboard shortcut: j)"
                disabled={!nextQuestionId}
                onClick={() => nextQuestionId && navigateTo(nextQuestionId)}
                title="Next question (j)"
                type="button"
              >
                <span>Next</span>
                <span aria-hidden="true">→</span>
                <kbd>j</kbd>
              </button>
            </div>
          </div>
          <div
            aria-label="Page navigation"
            className="toolbar-scroll-controls"
            role="group"
          >
            <button
              aria-label="Scroll to top (keyboard shortcut: t)"
              onClick={() => scrollToPageBoundary('top')}
              title="Scroll to top (t)"
              type="button"
            >
              <span aria-hidden="true">↑</span>
              <span>Top</span>
              <kbd>t</kbd>
            </button>
            <button
              aria-label="Scroll to bottom (keyboard shortcut: b)"
              onClick={() => scrollToPageBoundary('bottom')}
              title="Scroll to bottom (b)"
              type="button"
            >
              <span aria-hidden="true">↓</span>
              <span>Bottom</span>
              <kbd>b</kbd>
            </button>
          </div>
          <div className="toolbar-view-controls">
            <PreferenceToggle
              checked={preferences.showRaw}
              className="toolbar-raw-toggle"
              label="Raw source"
              onChange={(value) => updatePreference('showRaw', value)}
            />
            <details className="review-view-menu review-popover">
              <summary>View</summary>
              <div
                onChange={(event) => dismissReviewPopover(event.currentTarget)}
              >
                <PreferenceToggle
                  checked={preferences.showSolutions}
                  label="Workings & answers"
                  onChange={(value) => updatePreference('showSolutions', value)}
                />
                <PreferenceToggle
                  checked={preferences.showTags}
                  label="Tags"
                  onChange={(value) => updatePreference('showTags', value)}
                />
                <PreferenceToggle
                  checked={preferences.showStatusBackground}
                  label="Status background"
                  onChange={(value) =>
                    updatePreference('showStatusBackground', value)
                  }
                />
                <PreferenceToggle
                  checked={preferences.reviewControlMode === 'simple'}
                  label="Simple inline actions"
                  onChange={(value) =>
                    updatePreference(
                      'reviewControlMode',
                      value ? 'simple' : 'advanced',
                    )
                  }
                />
                <PreferenceToggle
                  checked={showPreviousFeedback}
                  label="Previous feedback"
                  onChange={setShowPreviousFeedback}
                />
              </div>
            </details>
          </div>
          <button
            className="global-finding-button"
            disabled={!currentCursor || globalFindingPending}
            onClick={openGlobalFinding}
            title="Create a finding for the review content product"
            type="button"
          >
            Global finding
          </button>
        </div>
        <div className={`review-lanes review-lanes--${preferences.reviewSide}`}>
          <ReviewSideSelector
            onChange={(side) => updatePreference('reviewSide', side)}
            side={preferences.reviewSide}
          />
          {reviewSidesForContext(preferences.reviewSide).map((side, index) => (
            <ReviewLane
              commentDisabledReason={commentDisabledReason(side)}
              disabledReason={outcomeDisabledReason(toolbarOutcomeTarget(side))}
              displayPreferences={index === 0}
              feedbackEnabled={preferences.showFeedback}
              imageMetadata={toolbarImageMetadata(side)}
              inlineEnabled={preferences.showInlineReview}
              key={side}
              nodeLabel={currentCursor?.topLevelQuestion.label ?? 'No question'}
              onComment={() => openKeyboardComment(side)}
              onImageMetadataChange={(metadata) => {
                const target = toolbarOutcomeTarget(side);
                if (target) {
                  updateImageMetadata(target, metadata);
                }
              }}
              onOutcome={(outcome) => void submitToolbarOutcome(side, outcome)}
              onToggleFeedback={(value) =>
                updatePreference('showFeedback', value)
              }
              onToggleInline={(value) =>
                updatePreference('showInlineReview', value)
              }
              outcome={toolbarOutcome(side)}
              pending={toolbarOutcomePending(side)}
              side={side}
            />
          ))}
        </div>
        {keyboardStatus.message ? (
          <span
            className={`keyboard-review-status keyboard-review-status--${keyboardStatus.kind}`}
            role="status"
          >
            {keyboardStatus.message}
          </span>
        ) : null}
      </section>

      <QuestionNavigation
        activeId={navigationActiveId}
        label="Top question navigation"
        onNavigate={navigateTo}
        questionIds={result.matchingQuestionTreeIds}
      />
      {corpus ? <CorpusPageNavigation corpus={corpus} /> : null}

      {result.matchingQuestionTreeCount === 0 ? (
        <section className="empty-results" aria-live="polite">
          <span>0 / {result.totalQuestionTreeCount}</span>
          <h2>No question shares that exact lens.</h2>
          <p>
            Change the raw-content expression or clear one filter to widen the
            paper again.
          </p>
          <div className="empty-results-actions">
            {contentSearch ? (
              <button onClick={clearContentSearch} type="button">
                Clear raw search
              </button>
            ) : null}
            <button onClick={clearFilters} type="button">
              Clear review filters
            </button>
          </div>
        </section>
      ) : (
        <ContentSearchContext.Provider value={compiledContentSearch}>
          <div className="paper-body">
            <PaperQuestionIndex
              contentMatchingNodeIds={contentMatchingNodeIds}
              currentNodeId={currentCursor?.node.id}
              matchingNodeIds={matchingNodeIds}
              sections={result.matchingSections}
            />
            <div className="paper-sections">
              {result.matchingSections.map((section) => (
                <section
                  className="paper-section"
                  id={section.id}
                  key={section.id}
                >
                  <header>
                    <span>Section</span>
                    <h2>{section.label}</h2>
                    <strong>{section.questions.length} matching trees</strong>
                  </header>
                  {section.questions.map((question) => {
                    const displayQuestion = displayNodeById.get(question.id);
                    return displayQuestion ? (
                      <QuestionNode
                        key={displayQuestion.id}
                        matchingNodeIds={matchingNodeIds}
                        node={displayQuestion}
                        preferences={preferences}
                        reviewSides={enabledReviewSides}
                        reviewRuntime={reviewRuntime}
                        topLevelQuestion={displayQuestion}
                      />
                    ) : null;
                  })}
                </section>
              ))}
            </div>
          </div>
        </ContentSearchContext.Provider>
      )}

      <QuestionNavigation
        activeId={navigationActiveId}
        label="Bottom question navigation"
        onNavigate={navigateTo}
        questionIds={result.matchingQuestionTreeIds}
      />
      {corpus ? <CorpusPageNavigation corpus={corpus} /> : null}
      <footer className="paper-footer" id="paper-bottom">
        <a href="#paper-top">Back to top ↑</a>
        <span>TOML and canonical assets are never mutated by this app.</span>
      </footer>
      {commentDialog ? (
        <div
          className="keyboard-comment-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeKeyboardComment();
          }}
          role="presentation"
        >
          <section
            aria-labelledby="keyboard-comment-title"
            aria-modal="true"
            className="keyboard-comment-dialog"
            role="dialog"
          >
            <header>
              <div>
                <span>State-specific feedback</span>
                <h2 id="keyboard-comment-title">
                  Comment on {commentDialog.nodeLabel}
                </h2>
              </div>
              <button
                aria-label="Close comment dialog"
                disabled={keyboardCommentPending}
                onClick={closeKeyboardComment}
                type="button"
              >
                ×
              </button>
            </header>
            <dl>
              <div>
                <dt>Target</dt>
                <dd>
                  {reviewSideLabel(commentDialog.side)} ·{' '}
                  {reviewStateLabel(commentDialog.target.ragState)}
                </dd>
              </div>
              {commentDialog.nodeLabel !== commentDialog.topLevelLabel ? (
                <div>
                  <dt>Question tree</dt>
                  <dd>{commentDialog.topLevelLabel}</dd>
                </div>
              ) : null}
            </dl>
            <form onSubmit={(event) => void submitKeyboardComment(event)}>
              <label htmlFor="keyboard-comment-draft">
                Add feedback as {reviewer}
              </label>
              <textarea
                autoFocus
                id="keyboard-comment-draft"
                maxLength={10_000}
                onChange={(event) => setCommentDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    closeKeyboardComment();
                  } else if (
                    event.key === 'Enter' &&
                    (event.ctrlKey || event.metaKey)
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Append a comment to this UUID and current RAG state…"
                rows={6}
                value={commentDraft}
              />
              <div className="keyboard-comment-actions">
                <span>
                  <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to add
                </span>
                <button
                  disabled={keyboardCommentPending}
                  onClick={closeKeyboardComment}
                  type="button"
                >
                  Cancel
                </button>
                <button disabled={keyboardCommentPending} type="submit">
                  {keyboardCommentPending ? 'Adding…' : 'Add comment'}
                </button>
              </div>
            </form>
            {keyboardStatus.kind === 'error' && keyboardStatus.message ? (
              <p className="review-action-status review-action-status--error">
                {keyboardStatus.message}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
      {globalFindingDialog ? (
        <div
          className="keyboard-comment-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeGlobalFinding();
          }}
          role="presentation"
        >
          <section
            aria-labelledby="global-finding-title"
            aria-modal="true"
            className="keyboard-comment-dialog global-finding-dialog"
            role="dialog"
          >
            <header>
              <div>
                <span>Product-wide feedback</span>
                <h2 id="global-finding-title">New global finding</h2>
              </div>
              <button
                aria-label="Close global finding dialog"
                disabled={globalFindingPending}
                onClick={closeGlobalFinding}
                type="button"
              >
                ×
              </button>
            </header>
            <dl>
              <div>
                <dt>Scope</dt>
                <dd>All review content / product</dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>{globalFindingDialog.nodeLabel}</dd>
              </div>
            </dl>
            <form onSubmit={(event) => void submitGlobalFinding(event)}>
              <label htmlFor="global-finding-draft">
                Finding from {reviewer}
              </label>
              <textarea
                autoFocus
                id="global-finding-draft"
                maxLength={10_000}
                onChange={(event) => setGlobalFindingDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    closeGlobalFinding();
                  } else if (
                    event.key === 'Enter' &&
                    (event.ctrlKey || event.metaKey)
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Describe the change needed across the product…"
                rows={6}
                value={globalFindingDraft}
              />
              <div className="keyboard-comment-actions">
                <span>
                  <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to submit
                </span>
                <button
                  disabled={globalFindingPending}
                  onClick={closeGlobalFinding}
                  type="button"
                >
                  Cancel
                </button>
                <button disabled={globalFindingPending} type="submit">
                  {globalFindingPending ? 'Submitting…' : 'Submit finding'}
                </button>
              </div>
            </form>
            {keyboardStatus.kind === 'error' && keyboardStatus.message ? (
              <p className="review-action-status review-action-status--error">
                {keyboardStatus.message}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}
