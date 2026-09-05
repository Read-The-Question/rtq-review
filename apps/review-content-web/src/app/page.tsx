import {
  DIMENSIONAL_TAG_AXES,
  getContentWorkspaceStatus,
  type DimensionalTagAxis,
} from '@rtq/review-paper-model';

import { getWorkspaceStatusCopy } from '@/lib/workspace-view-model';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const axisDescriptions: Readonly<Record<DimensionalTagAxis, string>> = {
  family: 'What kind of question is this?',
  math: 'Which mathematical idea is exercised?',
  frame: 'How is the problem presented?',
  marker: 'Which notable features are present?',
  reasoning: 'What reasoning route does it require?',
};

const deliverySequence = [
  ['01', 'Browse', 'Choose a live TOML collection and paper.'],
  ['02', 'Refine', 'Combine dimensional tags without regeneration.'],
  ['03', 'Review', 'Read in context and submit review outcomes.'],
] as const;

export default function HomePage() {
  const workspaceStatus = getContentWorkspaceStatus();
  const statusCopy = getWorkspaceStatusCopy(workspaceStatus);

  return (
    <main className="review-shell">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="RTQ Review Content Web">
          <span aria-hidden="true">RTQ</span>
          <span>Review content</span>
        </a>
        <p className="environment-label">Local review instrument · port 3004</p>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Direct-content review</p>
          <h1>
            Review the source.
            <span>Change the lens.</span>
          </h1>
          <p className="hero-summary">
            A read-only review surface for live RTQ paper content, designed to
            filter a complete paper across five independent tag dimensions.
          </p>
        </div>

        <aside
          className={`connection-card connection-card--${statusCopy.tone}`}
        >
          <span className="connection-light" aria-hidden="true" />
          <div>
            <p>{statusCopy.label}</p>
            <span>{statusCopy.detail}</span>
          </div>
        </aside>
      </section>

      <section className="sequence" aria-labelledby="sequence-title">
        <div className="section-heading">
          <p>Review sequence</p>
          <h2 id="sequence-title">One paper, many useful views.</h2>
        </div>
        <ol>
          {deliverySequence.map(([number, title, detail]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="axis-panel" aria-labelledby="axis-title">
        <div className="section-heading section-heading--inverse">
          <p>Filter grammar</p>
          <h2 id="axis-title">Five axes. One focused question set.</h2>
        </div>
        <ul className="axis-list">
          {DIMENSIONAL_TAG_AXES.map((axis, index) => (
            <li key={axis}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{axis}</h3>
                <p>{axisDescriptions[axis]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <p>Foundation ready</p>
        <span>
          Paper discovery and parsing arrive in the next implementation task.
        </span>
      </footer>
    </main>
  );
}
