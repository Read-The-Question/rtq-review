'use client';

import { CircleAlert, ImageIcon, ScanSearch } from 'lucide-react';
import { useTransition } from 'react';

import { updateImageTagAction } from '@/app/actions';
import { RtqMarkdown } from '@/components/rtq-markdown';
import type {
  ImageTagCatalog,
  ImageTagCatalogDimension,
  ImageTagOccurrence,
  PaperDocument,
} from '@/lib/paper-types';

const STALE_FILE_MESSAGE =
  'The file changed outside the editor. Reload to continue.';

type SaveState = {
  message: string;
  tone: 'error' | 'idle' | 'saving' | 'success';
};

function GuideState({
  dimension,
  occurrence,
}: {
  dimension: ImageTagCatalogDimension;
  occurrence: ImageTagOccurrence;
}) {
  const current = occurrence.attributes[dimension.attribute];
  const value = dimension.values.find(option => option.value === current);
  if (!current) {
    return (
      <span className="image-tag-guide image-tag-guide--neutral">
        Unclassified
      </span>
    );
  }
  if (!value) {
    return (
      <span className="image-tag-guide image-tag-guide--warning">
        Unsupported value
      </span>
    );
  }
  return (
    <span
      className={`image-tag-guide image-tag-guide--${value.guide.status}`}
      title={value.description}>
      {value.guide.status === 'available' ? 'Guide available' : 'Guide missing'}
    </span>
  );
}

function ImageDimensionControl({
  dimension,
  disabled,
  occurrence,
  onChange,
}: {
  dimension: ImageTagCatalogDimension;
  disabled: boolean;
  occurrence: ImageTagOccurrence;
  onChange: (dimensionKey: string, value: string | null) => void;
}) {
  const current = occurrence.attributes[dimension.attribute] ?? '';
  const isUnsupported =
    current !== '' && !dimension.values.some(value => value.value === current);
  const cardinalityLabel =
    dimension.cardinality === 'zero-or-one'
      ? 'Optional · one value'
      : dimension.cardinality;
  const inheritanceLabel =
    dimension.inheritance === 'none'
      ? 'no inheritance'
      : `inheritance: ${dimension.inheritance}`;
  const omissionLabel =
    dimension.omission === 'unclassified'
      ? 'omission is unclassified'
      : `omission: ${dimension.omission}`;

  return (
    <label className="image-tag-control">
      <span className="image-tag-control__heading">
        <span>{dimension.label}</span>
        <GuideState dimension={dimension} occurrence={occurrence} />
      </span>
      <select
        aria-label={`${dimension.label} for ${occurrence.hierarchyLabel}, ${occurrence.fieldLabel}, image ${occurrence.imageNumber}`}
        disabled={disabled}
        onChange={event => onChange(dimension.key, event.target.value || null)}
        value={current}>
        <option value="">Unclassified</option>
        {isUnsupported ? (
          <option value={current}>{current} (unsupported)</option>
        ) : null}
        {dimension.values.map(value => (
          <option key={value.value} value={value.value}>
            {value.label}
          </option>
        ))}
      </select>
      <span className="image-tag-control__hint">
        {cardinalityLabel} · {inheritanceLabel} · {omissionLabel}
      </span>
    </label>
  );
}

function ImageOccurrenceCard({
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
    <article
      className="image-occurrence-card"
      data-asset-state={occurrence.assetState}>
      <header className="image-occurrence-card__header">
        <div>
          <p className="image-occurrence-card__eyebrow">
            {occurrence.hierarchyLabel} · {occurrence.fieldLabel}
          </p>
          <h2>Image {occurrence.imageNumber}</h2>
        </div>
        <div className="image-occurrence-card__status">
          <span>{occurrence.scope}</span>
          <span
            className={`image-asset-state image-asset-state--${occurrence.assetState}`}>
            {occurrence.assetState === 'available'
              ? 'Asset found'
              : 'Missing asset'}
          </span>
        </div>
      </header>

      <div className="image-occurrence-card__identity">
        <span>Node UUID</span>
        <code>{occurrence.nodeUuid ?? 'Missing UUID'}</code>
      </div>

      {!occurrence.nodeUuid ? (
        <div className="image-occurrence-card__warning" role="alert">
          <CircleAlert aria-hidden="true" className="h-4 w-4" />
          This occurrence cannot be edited until its owning node has an RTQ
          UUID.
        </div>
      ) : null}

      <div className="image-occurrence-card__workspace">
        <section className="image-occurrence-card__preview">
          <header>
            <ImageIcon aria-hidden="true" className="h-4 w-4" />
            Current image
          </header>
          <RtqMarkdown markdown={occurrence.previewMarkdown} />
        </section>

        <section className="image-occurrence-card__controls">
          <header>
            <ScanSearch aria-hidden="true" className="h-4 w-4" />
            Dimensional tags
          </header>
          {catalog.dimensions.map(dimension => (
            <ImageDimensionControl
              dimension={dimension}
              disabled={mutationDisabled}
              key={dimension.key}
              occurrence={occurrence}
              onChange={mutate}
            />
          ))}
          {readOnly ? (
            <p className="image-tag-readonly">This collection is read-only.</p>
          ) : null}
        </section>
      </div>

      <details className="image-occurrence-context" open>
        <summary>Question and field context</summary>
        <div className="image-occurrence-context__body">
          <RtqMarkdown markdown={occurrence.contextMarkdown} />
        </div>
      </details>
    </article>
  );
}

export function ImageTagDocument({
  catalog,
  document,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  readOnly,
}: {
  catalog: ImageTagCatalog;
  document: PaperDocument;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: () => Promise<PaperDocument>;
  onSaveStateChange: (state: SaveState) => void;
  readOnly: boolean;
}) {
  if (document.imageOccurrences.length === 0) {
    return (
      <section className="image-document image-document--empty">
        <ImageIcon aria-hidden="true" className="h-7 w-7" />
        <h2>No authored PaperImage occurrences</h2>
        <p>
          Question, working, and answer fields in this paper do not contain an
          editable PaperImage component.
        </p>
      </section>
    );
  }

  return (
    <section className="image-document">
      <header className="image-document__header">
        <div>
          <p className="image-document__eyebrow">Occurrence review</p>
          <h2>{document.imageOccurrences.length} paper images</h2>
        </div>
        <p>
          Tags apply to one authored image occurrence only. They do not inherit
          from the question or neighbouring images.
        </p>
      </header>
      <div className="image-document__list">
        {document.imageOccurrences.map(occurrence => (
          <ImageOccurrenceCard
            catalog={catalog}
            document={document}
            key={occurrence.id}
            occurrence={occurrence}
            onDocumentChange={onDocumentChange}
            onDocumentRefresh={onDocumentRefresh}
            onSaveStateChange={onSaveStateChange}
            readOnly={readOnly}
          />
        ))}
      </div>
    </section>
  );
}
