import type { ReactNode } from 'react';

import {
  DIMENSIONAL_TAG_AXES,
  type DimensionalTagAxis,
  type QuestionTagCatalog,
  type ReviewNodeTagState,
} from '@rtq/review-paper-model/client';

export const TAG_AXIS_LABELS: Readonly<Record<DimensionalTagAxis, string>> = {
  family: 'Family',
  frame: 'Frame',
  marker: 'Markers',
  math: 'Math',
  reasoning: 'Reasoning',
};

/** Axes that hold one value: adding a tag replaces the current one. */
export const SINGLE_VALUE_TAG_AXES: ReadonlySet<DimensionalTagAxis> = new Set([
  'family',
  'frame',
  'reasoning',
]);

export function tagAxisFor(value: string): DimensionalTagAxis | undefined {
  return DIMENSIONAL_TAG_AXES.find((axis) => value.startsWith(`${axis}.`));
}

export function shortTagValue(value: string): string {
  const axis = tagAxisFor(value);
  return axis ? value.slice(axis.length + 1) : value;
}

export type QuestionTagTableState = Pick<
  ReviewNodeTagState,
  'effectiveTags' | 'explicitInherit' | 'explicitTags' | 'inheritedTags'
>;

export type QuestionTagTableEditing = Readonly<{
  /** Undefined while the vocabulary loads: "+ add" shows but stays disabled. */
  catalog?: QuestionTagCatalog;
  disabled: boolean;
  /** Shown on hover when the controls are disabled for a reason. */
  disabledReason?: string;
  onAdd: (axis: DimensionalTagAxis, value: string) => void;
  /** Sub-questions only: the "Use parent tags" switch on the Inherited row. */
  onInheritChange?: (inherit: boolean) => void;
  onRemove: (value: string) => void;
}>;

function TagValues({ values }: { values: readonly string[] }) {
  if (!values.length) {
    return (
      <>
        <span aria-hidden="true" className="tag-table__empty">
          —
        </span>
        <span className="visually-hidden">None</span>
      </>
    );
  }
  return values.map((value, index) => (
    <span key={value} title={value}>
      {index > 0 ? ', ' : null}
      {shortTagValue(value)}
    </span>
  ));
}

function EditableTagCell({
  axis,
  editing,
  selected,
}: {
  axis: DimensionalTagAxis;
  editing: QuestionTagTableEditing;
  selected: readonly string[];
}) {
  const label = TAG_AXIS_LABELS[axis];
  const options = (editing.catalog?.[axis] ?? []).filter(
    (tag) => !selected.includes(tag),
  );
  const replaces = SINGLE_VALUE_TAG_AXES.has(axis) && selected.length > 0;
  const disabled = editing.disabled || !editing.catalog;
  const title = disabled ? editing.disabledReason : undefined;

  return (
    <div className="tag-table__edit">
      {selected.map((tag) => (
        <span className="tag-table__chip" key={tag} title={tag}>
          {shortTagValue(tag)}
          <button
            aria-label={`Remove ${tag}`}
            disabled={editing.disabled}
            onClick={() => editing.onRemove(tag)}
            title={editing.disabled ? editing.disabledReason : undefined}
            type="button"
          >
            ×
          </button>
        </span>
      ))}
      {options.length || !editing.catalog ? (
        <label className="tag-table__add" title={title}>
          <span aria-hidden="true">{replaces ? 'change' : '+ add'}</span>
          <select
            aria-label={
              replaces
                ? `Change ${label.toLowerCase()} tag`
                : `Add ${label.toLowerCase()} tag`
            }
            disabled={disabled}
            onChange={(event) => {
              if (event.target.value) editing.onAdd(axis, event.target.value);
            }}
            value=""
          >
            <option value="">{replaces ? 'Change…' : 'Add…'}</option>
            {options.map((tag) => (
              <option key={tag} value={tag}>
                {shortTagValue(tag)}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}

/**
 * One table for a question's dimensional tags, in review and in edit mode:
 * a column per axis, and rows for what the parent passes down, what is set on
 * this question, and the result. Per axis, a value set here replaces the
 * inherited one; with neither, Final shows the model's default. Colour stays
 * on the headers so the values read as plain text. In writable collections
 * the "Set here" row is always editable (there is no separate edit mode), and
 * the Inherited row carries the "Use parent tags" switch.
 */
export function QuestionTagTable({
  corner,
  editing,
  label,
  nodeDepth,
  state,
}: {
  /** Short status for the empty top-left cell, such as "Saving…". */
  corner?: ReactNode;
  editing?: QuestionTagTableEditing;
  label: string;
  nodeDepth: number;
  state: QuestionTagTableState;
}) {
  const valuesFor = (
    tags: readonly Readonly<{ axis: DimensionalTagAxis; value: string }>[],
    axis: DimensionalTagAxis,
  ) => tags.filter((tag) => tag.axis === axis).map((tag) => tag.value);
  const explicitFor = (axis: DimensionalTagAxis) =>
    state.explicitTags.filter((tag) => tagAxisFor(tag) === axis);

  return (
    <div className="tag-table-scroll">
      <table
        aria-label={label}
        className="tag-table"
        data-editing={editing ? 'true' : undefined}
      >
        <thead>
          <tr>
            <td className="tag-table__corner">{corner}</td>
            {DIMENSIONAL_TAG_AXES.map((axis) => (
              <th data-axis={axis} key={axis} scope="col">
                {TAG_AXIS_LABELS[axis]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nodeDepth > 0 ? (
            <tr data-row="inherited">
              <th scope="row">
                {editing?.onInheritChange ? (
                  <label
                    className="tag-table__inherit"
                    title={
                      editing.disabled && editing.disabledReason
                        ? editing.disabledReason
                        : 'Use parent tags'
                    }
                  >
                    <input
                      aria-label="Use parent tags"
                      checked={state.explicitInherit !== false}
                      disabled={editing.disabled}
                      onChange={(event) =>
                        editing.onInheritChange?.(event.target.checked)
                      }
                      type="checkbox"
                    />
                    Inherited
                  </label>
                ) : (
                  'Inherited'
                )}
              </th>
              {state.explicitInherit === false ? (
                <td
                  className="tag-table__note"
                  colSpan={DIMENSIONAL_TAG_AXES.length}
                >
                  Inheritance is off
                </td>
              ) : (
                DIMENSIONAL_TAG_AXES.map((axis) => (
                  <td key={axis}>
                    <TagValues values={valuesFor(state.inheritedTags, axis)} />
                  </td>
                ))
              )}
            </tr>
          ) : null}
          <tr data-row="explicit">
            <th scope="row">
              Set<span className="tag-table__row-label-rest"> here</span>
            </th>
            {DIMENSIONAL_TAG_AXES.map((axis) => (
              <td key={axis}>
                {editing ? (
                  <EditableTagCell
                    axis={axis}
                    editing={editing}
                    selected={explicitFor(axis)}
                  />
                ) : (
                  <TagValues values={explicitFor(axis)} />
                )}
              </td>
            ))}
          </tr>
          <tr data-row="final">
            <th scope="row">Final</th>
            {DIMENSIONAL_TAG_AXES.map((axis) => (
              <td key={axis}>
                <TagValues values={valuesFor(state.effectiveTags, axis)} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
