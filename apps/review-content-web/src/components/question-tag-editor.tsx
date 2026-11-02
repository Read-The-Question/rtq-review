'use client';

import { useMemo } from 'react';

import {
  DIMENSIONAL_TAG_AXES,
  type DimensionalTagAxis,
  type QuestionTagCatalog,
  type ReviewNodeTagState,
} from '@rtq/review-paper-model/client';

const axisLabels: Readonly<Record<DimensionalTagAxis, string>> = {
  family: 'Family',
  frame: 'Frame',
  marker: 'Markers',
  math: 'Math',
  reasoning: 'Reasoning',
};
const singleAxes = new Set<DimensionalTagAxis>([
  'family',
  'frame',
  'reasoning',
]);

export type QuestionTagSaveStatus = Readonly<{
  kind: 'error' | 'idle' | 'saving' | 'success';
  message: string;
}>;

function axisFor(value: string): DimensionalTagAxis | undefined {
  return DIMENSIONAL_TAG_AXES.find((axis) => value.startsWith(`${axis}.`));
}

function shortTag(value: string): string {
  const axis = axisFor(value);
  return axis ? value.slice(axis.length + 1) : value;
}

function TagChips({
  empty,
  onRemove,
  tags,
}: {
  empty?: string;
  onRemove?: (tag: string) => void;
  tags: readonly string[];
}) {
  if (!tags.length)
    return empty ? <span className="tag-edit-empty">{empty}</span> : null;
  return (
    <span className="tag-edit-chips">
      {tags.map((tag) => (
        <span className="tag-edit-chip" key={tag} title={tag}>
          <code>{shortTag(tag)}</code>
          {onRemove ? (
            <button
              aria-label={`Remove ${tag}`}
              onClick={() => onRemove(tag)}
              type="button"
            >
              ×
            </button>
          ) : null}
        </span>
      ))}
    </span>
  );
}

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
  const explicitByAxis = useMemo(
    (): Record<DimensionalTagAxis, readonly string[]> => ({
      family: state.explicitTags.filter((tag) => axisFor(tag) === 'family'),
      frame: state.explicitTags.filter((tag) => axisFor(tag) === 'frame'),
      marker: state.explicitTags.filter((tag) => axisFor(tag) === 'marker'),
      math: state.explicitTags.filter((tag) => axisFor(tag) === 'math'),
      reasoning: state.explicitTags.filter(
        (tag) => axisFor(tag) === 'reasoning',
      ),
    }),
    [state.explicitTags],
  );
  const legacyTags = state.explicitTags.filter((tag) => !axisFor(tag));

  function addTag(axis: DimensionalTagAxis, value: string) {
    if (!value) return;
    const retained = singleAxes.has(axis)
      ? state.explicitTags.filter((tag) => axisFor(tag) !== axis)
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
            <span>
              <strong>Use parent tags</strong>
              <small>Explicit tags still override their own dimension.</small>
            </span>
          </label>
        ) : (
          <span className="tag-root-note">Top-level tag source</span>
        )}
      </header>

      {nodeDepth > 0 ? (
        <div className="tag-lineage-row">
          <span>Inherited</span>
          <TagChips
            empty={
              state.explicitInherit === false ? 'Inheritance is off' : 'None'
            }
            tags={state.inheritedTags.map((tag) => tag.value)}
          />
        </div>
      ) : null}

      <div className="tag-axis-grid">
        {DIMENSIONAL_TAG_AXES.map((axis) => {
          const selected = explicitByAxis[axis];
          const options = catalog[axis].filter(
            (tag) => !selected.includes(tag),
          );
          return (
            <fieldset
              className={`tag-axis-card tag-axis-card--${axis}`}
              key={axis}
            >
              <legend>{axisLabels[axis]}</legend>
              <TagChips
                empty="No explicit tag"
                onRemove={disabled ? undefined : removeTag}
                tags={selected}
              />
              <label>
                <span className="visually-hidden">
                  Add {axisLabels[axis]} tag
                </span>
                <select
                  aria-label={`Add ${axisLabels[axis]} tag`}
                  disabled={disabled || options.length === 0}
                  onChange={(event) => addTag(axis, event.target.value)}
                  value=""
                >
                  <option value="">
                    {singleAxes.has(axis) && selected.length
                      ? `Replace ${axisLabels[axis].toLowerCase()}…`
                      : `Add ${axisLabels[axis].toLowerCase()}…`}
                  </option>
                  {options.map((tag) => (
                    <option key={tag} value={tag}>
                      {shortTag(tag)}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          );
        })}
      </div>

      {legacyTags.length ? (
        <div className="tag-lineage-row tag-lineage-row--legacy">
          <span>Legacy</span>
          <TagChips
            onRemove={disabled ? undefined : removeTag}
            tags={legacyTags}
          />
        </div>
      ) : null}

      <footer className="question-tag-editor__footer">
        <div className="tag-lineage-row tag-lineage-row--effective">
          <span>Effective</span>
          <TagChips tags={state.effectiveTags.map((tag) => tag.value)} />
        </div>
        {status.kind !== 'idle' ? (
          <span
            className={`tag-save-status tag-save-status--${status.kind}`}
            role={status.kind === 'error' ? 'alert' : 'status'}
          >
            {status.message}
          </span>
        ) : null}
      </footer>
    </section>
  );
}
