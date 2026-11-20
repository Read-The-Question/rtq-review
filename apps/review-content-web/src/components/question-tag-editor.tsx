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

export function QuestionTagEditor({
  catalog,
  disabled,
  nodeDepth,
  nodeLabel,
  onChange,
  state,
  status,
}: {
  catalog: QuestionTagCatalog;
  disabled: boolean;
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

  return (
    <section
      aria-label={`Edit dimensional tags for ${nodeLabel}`}
      className="question-tag-editor"
    >
      <header className="question-tag-editor__header">
        <div>
          <span>Tag edit mode</span>
          <strong>{nodeLabel}</strong>
        </div>
        {nodeDepth > 0 ? (
          <label className="tag-inheritance-toggle">
            <input
              checked={state.explicitInherit !== false}
              disabled={disabled}
              onChange={(event) =>
                onChange(state.explicitTags, event.target.checked)
              }
              type="checkbox"
            />
            <span>Use parent tags</span>
          </label>
        ) : (
          <span className="tag-root-note">Top-level tag source</span>
        )}
      </header>

      <QuestionTagTable
        editing={{ catalog, disabled, onAdd: addTag, onRemove: removeTag }}
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
              {disabled ? null : (
                <button
                  aria-label={`Remove ${tag}`}
                  onClick={() => removeTag(tag)}
                  type="button"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      ) : null}

      {status.kind !== 'idle' ? (
        <span
          className={`tag-save-status tag-save-status--${status.kind}`}
          role={status.kind === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </span>
      ) : null}
    </section>
  );
}
