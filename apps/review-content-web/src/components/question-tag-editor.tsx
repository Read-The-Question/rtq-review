'use client';

import type {
  DimensionalTagAxis,
  QuestionTagCatalog,
  ReviewNodeTagState,
} from '@rtq/review-paper-model/client';

import {
  QuestionTagTable,
  SINGLE_VALUE_TAG_AXES,
  shortTagValue,
  tagAxisFor,
} from './question-tag-table';

export type QuestionTagSaveStatus = Readonly<{
  kind: 'error' | 'idle' | 'saving' | 'success';
  message: string;
}>;

const cornerStatus: Readonly<
  Partial<Record<QuestionTagSaveStatus['kind'], string>>
> = {
  saving: 'Saving…',
  success: 'Saved',
};

/**
 * The tag table with its "Set here" row editable. Each change saves straight
 * to the question's source TOML; the save state sits in the table's empty
 * corner so saving never shifts the layout.
 */
export function QuestionTagEditor({
  catalog,
  disabled,
  disabledReason,
  nodeDepth,
  nodeLabel,
  onChange,
  state,
  status,
}: {
  catalog?: QuestionTagCatalog;
  disabled: boolean;
  disabledReason?: string;
  nodeDepth: number;
  nodeLabel: string;
  onChange: (
    explicitTags: readonly string[],
    explicitInherit: boolean | null,
  ) => void;
  state: ReviewNodeTagState;
  status: QuestionTagSaveStatus;
}) {
  const legacyTags = state.explicitTags.filter((tag) => !tagAxisFor(tag));

  function addTag(axis: DimensionalTagAxis, value: string) {
    const retained = SINGLE_VALUE_TAG_AXES.has(axis)
      ? state.explicitTags.filter((tag) => tagAxisFor(tag) !== axis)
      : state.explicitTags;
    onChange([...retained, value], state.explicitInherit);
  }

  function removeTag(value: string) {
    onChange(
      state.explicitTags.filter((tag) => tag !== value),
      state.explicitInherit,
    );
  }

  const corner = cornerStatus[status.kind];

  return (
    <>
      <QuestionTagTable
        corner={
          corner ? (
            <span
              className={`tag-save-status tag-save-status--${status.kind}`}
              role="status"
              title={status.message}
            >
              {corner}
            </span>
          ) : null
        }
        editing={{
          catalog,
          disabled,
          disabledReason,
          onAdd: addTag,
          ...(nodeDepth > 0
            ? {
                onInheritChange: (inherit: boolean) =>
                  onChange(state.explicitTags, inherit),
              }
            : {}),
          onRemove: removeTag,
        }}
        label={`${nodeLabel} dimensional tags`}
        nodeDepth={nodeDepth}
        state={state}
      />

      {legacyTags.length ? (
        <div className="tag-legacy-row">
          <span>Legacy</span>
          {legacyTags.map((tag) => (
            <span className="tag-table__chip" key={tag} title={tag}>
              {shortTagValue(tag)}
              <button
                aria-label={`Remove ${tag}`}
                disabled={disabled}
                onClick={() => removeTag(tag)}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {status.kind === 'error' ? (
        <p className="tag-save-error" role="alert">
          {status.message}
        </p>
      ) : null}
    </>
  );
}
