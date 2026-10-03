'use client';

import { CircleAlert } from 'lucide-react';
import { useTransition } from 'react';
import type { Components } from 'react-markdown';

import { updateImageTagAction } from '@/app/actions';
import { RtqMarkdown } from '@/components/rtq-markdown';
import { TagGroup, TagPicker } from '@/components/tag-review-controls';
import { markdownWithOccurrenceMarkers } from '@/lib/image-tag-markers';
import type {
  DisplayTag,
  ImageTagCatalog,
  ImageTagCatalogDimension,
  ImageTagOccurrence,
  PaperDocument,
  TagKind,
} from '@/lib/paper-types';

const STALE_FILE_MESSAGE =
  'The file changed outside the editor. Reload to continue.';

type SaveState = {
  message: string;
  tone: 'error' | 'idle' | 'saving' | 'success';
};

function displayTagKind(dimensionKey: string): TagKind {
  if (
    dimensionKey === 'family' ||
    dimensionKey === 'frame' ||
    dimensionKey === 'marker' ||
    dimensionKey === 'math' ||
    dimensionKey === 'reasoning'
  ) {
    return dimensionKey;
  }

  return 'legacy';
}

function displayValue(dimension: ImageTagCatalogDimension, value: string) {
  return `${dimension.key}.${value}`;
}

function valueRequirementsSatisfied(
  catalog: ImageTagCatalog,
  requires: Readonly<Record<string, string>>,
  occurrence: ImageTagOccurrence,
) {
  return Object.entries(requires).every(([key, requiredValue]) => {
    const dependency = catalog.dimensions.find(
      candidate => candidate.key === key,
    );
    return (
      dependency &&
      occurrence.attributes[dependency.attribute] === requiredValue
    );
  });
}

function currentTags(
  catalog: ImageTagCatalog,
  dimension: ImageTagCatalogDimension,
  occurrence: ImageTagOccurrence,
): DisplayTag[] {
  const value = occurrence.attributes[dimension.attribute];
  if (!value) {
    return [];
  }

  const option = dimension.values.find(option => option.value === value);
  const supported =
    option !== undefined &&
    valueRequirementsSatisfied(catalog, option.requires, occurrence);
  return [
    {
      active: supported,
      dimensionLabel: dimension.label,
      implicitLabel: null,
      kind: displayTagKind(dimension.key),
      source: 'explicit',
      value: displayValue(dimension, value),
    },
  ];
}

export function imageOccurrenceDisplayTags(
  catalog: ImageTagCatalog,
  occurrence: ImageTagOccurrence,
) {
  return catalog.dimensions.flatMap(dimension =>
    currentTags(catalog, dimension, occurrence),
  );
}

function guideLabel(
  dimension: ImageTagCatalogDimension,
  occurrence: ImageTagOccurrence,
) {
  const current = occurrence.attributes[dimension.attribute];
  const value = dimension.values.find(option => option.value === current);
  if (!current) return 'Unclassified';
  if (!value) return 'Unsupported value';
  if (value.guide.status === 'available') return 'Guide available';
  if (value.guide.status === 'placeholder') return 'Guide placeholder';
  return 'Guide missing';
}

function compatibleValues(
  catalog: ImageTagCatalog,
  dimension: ImageTagCatalogDimension,
  occurrence: ImageTagOccurrence,
) {
  return dimension.values.filter(value =>
    valueRequirementsSatisfied(catalog, value.requires, occurrence),
  );
}

function ImageTagPanel({
  catalog,
  document,
  occurrence,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  readOnly,
}: {
  catalog: ImageTagCatalog;
  document: PaperDocument;
  occurrence: ImageTagOccurrence;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: () => Promise<PaperDocument>;
  onSaveStateChange: (state: SaveState) => void;
  readOnly: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const mutationDisabled = readOnly || isPending || !occurrence.nodeUuid;
  const finalTags = imageOccurrenceDisplayTags(catalog, occurrence);
  const columnStyle = {
    gridTemplateColumns: `repeat(${Math.max(catalog.dimensions.length, 1)}, minmax(0, 1fr))`,
  };

  const mutate = (dimensionKey: string, value: string | null) => {
    if (mutationDisabled || !occurrence.nodeUuid) {
      return;
    }

    const nodeUuid = occurrence.nodeUuid;
    onSaveStateChange({ message: 'Saving image tag…', tone: 'saving' });
    startTransition(async () => {
      try {
        const nextDocument = await updateImageTagAction({
          dimensionKey,
          field: occurrence.field,
          folderKey: document.folderKey,
          nodeUuid,
          occurrenceIndex: occurrence.occurrenceIndex,
          relativePath: document.relativePath,
          value,
          versionHash: document.versionHash,
        });
        onDocumentChange(nextDocument);
        onSaveStateChange({ message: 'Image tag saved', tone: 'success' });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to save this image tag.';
        if (message === STALE_FILE_MESSAGE) {
          try {
            await onDocumentRefresh();
            onSaveStateChange({
              message:
                'File changed outside editor. Updated from disk; try again.',
              tone: 'error',
            });
            return;
          } catch {
            // Report the original stale-file failure when refreshing fails.
          }
        }
        onSaveStateChange({ message, tone: 'error' });
      }
    });
  };

  return (
    <section
      aria-label={`${occurrence.fieldLabel} image ${occurrence.imageNumber} tags`}
      className="inline-editor image-inline-editor">
      <div className="inline-editor__top image-inline-editor__top">
        <div>
          <h3 className="inline-editor__title">
            {occurrence.fieldLabel} · Image {occurrence.imageNumber}
          </h3>
          <p className="inline-editor__subtitle">
            {occurrence.assetState === 'available'
              ? 'Image asset found'
              : 'Image asset missing'}
            {' · '}
            {occurrence.nodeUuid
              ? `UUID ${occurrence.nodeUuid}`
              : 'Owning UUID missing'}
          </p>
        </div>
      </div>

      {!occurrence.nodeUuid ? (
        <div className="image-inline-editor__warning" role="alert">
          <CircleAlert aria-hidden="true" className="h-4 w-4" />
          Add an RTQ UUID to the owning node before editing this image.
        </div>
      ) : null}

      <div className="inline-editor__groups">
        <div className="inline-editor__section">
          <div className="inline-editor__section-title">
            {readOnly ? 'Explicit tags' : 'Your tags'}
          </div>
          <div className="tag-editor-matrix">
            <div
              className="tag-editor-matrix__row tag-editor-matrix__row--labels"
              style={columnStyle}>
              {catalog.dimensions.map(dimension => (
                <div className="tag-editor-matrix__label" key={dimension.key}>
                  <span>{dimension.label}</span>
                  <small>{guideLabel(dimension, occurrence)}</small>
                </div>
              ))}
            </div>

            <div
              className="tag-editor-matrix__row tag-editor-matrix__row--values"
              style={columnStyle}>
              {catalog.dimensions.map(dimension => (
                <div
                  className="tag-editor-matrix__cell tag-editor-matrix__cell--values"
                  key={dimension.key}>
                  <TagGroup
                    emptyLabel="Unclassified"
                    onRemove={
                      mutationDisabled
                        ? undefined
                        : () => mutate(dimension.key, null)
                    }
                    tags={currentTags(catalog, dimension, occurrence)}
                  />
                </div>
              ))}
            </div>

            {!readOnly ? (
              <div
                className="tag-editor-matrix__row tag-editor-matrix__row--pickers"
                style={columnStyle}>
                {catalog.dimensions.map(dimension => {
                  const selectedValue =
                    occurrence.attributes[dimension.attribute];
                  const options = compatibleValues(
                    catalog,
                    dimension,
                    occurrence,
                  ).map(value => displayValue(dimension, value.value));

                  return (
                    <div
                      className="tag-editor-matrix__cell tag-editor-matrix__cell--picker"
                      key={dimension.key}>
                      <TagPicker
                        disabled={mutationDisabled}
                        label={`Choose ${dimension.label.toLowerCase()}`}
                        mode="single"
                        onSelect={selected => {
                          const value = dimension.values.find(
                            option =>
                              displayValue(dimension, option.value) ===
                              selected,
                          );
                          if (value) mutate(dimension.key, value.value);
                        }}
                        options={options}
                        selected={
                          selectedValue
                            ? [displayValue(dimension, selectedValue)]
                            : []
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="inline-editor__section">
          <div className="inline-editor__section-title">Final tags</div>
          <TagGroup emptyLabel="Unclassified" tags={finalTags} />
        </div>
      </div>

      {readOnly ? (
        <p className="inline-editor__status">This collection is read-only.</p>
      ) : isPending ? (
        <p className="inline-editor__status">Updating…</p>
      ) : null}
    </section>
  );
}

export function ImageTagMarkdown({
  catalog,
  document,
  markdown,
  occurrences,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  readOnly,
}: {
  catalog: ImageTagCatalog;
  document: PaperDocument;
  markdown: string;
  occurrences: ImageTagOccurrence[];
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: () => Promise<PaperDocument>;
  onSaveStateChange: (state: SaveState) => void;
  readOnly: boolean;
}) {
  if (!occurrences.length) {
    return <RtqMarkdown markdown={markdown} />;
  }

  const marked = markdownWithOccurrenceMarkers(markdown, occurrences);
  const components: Components = {
    div({ node, ...props }) {
      const marker =
        node?.properties?.dataImageTagOccurrence ??
        (props as Record<string, unknown>)['data-image-tag-occurrence'];
      const occurrence =
        typeof marker === 'string' ? marked.marked.get(marker) : undefined;

      if (!occurrence) {
        return <div {...props} />;
      }

      return (
        <div className="image-inline-occurrence">
          <RtqMarkdown markdown={occurrence.previewMarkdown} />
          <ImageTagPanel
            catalog={catalog}
            document={document}
            occurrence={occurrence}
            onDocumentChange={onDocumentChange}
            onDocumentRefresh={onDocumentRefresh}
            onSaveStateChange={onSaveStateChange}
            readOnly={readOnly}
          />
        </div>
      );
    },
  };

  return <RtqMarkdown components={components} markdown={marked.markdown} />;
}
