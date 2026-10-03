'use client';

import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react';

export type PaperOutlineBadge = {
  label: string;
  text?: string;
  tone: 'accent' | 'search' | 'warning';
};

export type PaperOutlineNode = {
  badges?: readonly PaperOutlineBadge[];
  children: readonly PaperOutlineNode[];
  description?: ReactNode;
  href: string;
  id: string;
  label: ReactNode;
  state?: 'context' | 'match' | 'neutral';
};

export type PaperOutlineSection = {
  href: string;
  id: string;
  label: ReactNode;
  nodes: readonly PaperOutlineNode[];
};

function OutlineNode({
  activeId,
  node,
  onNavigate,
}: {
  activeId?: string;
  node: PaperOutlineNode;
  onNavigate?: (id: string) => void;
}) {
  const current = activeId === node.id;
  const state = node.state ?? 'neutral';

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(node.id);
  }

  return (
    <li className="paper-outline__item" data-state={state}>
      <a
        aria-current={current ? 'location' : undefined}
        className="paper-outline__link"
        href={node.href}
        onClick={onNavigate ? navigate : undefined}
      >
        <span className="paper-outline__copy">
          <span>{node.label}</span>
          {node.description ? <small>{node.description}</small> : null}
        </span>
        {node.badges?.length ? (
          <span className="paper-outline__badges">
            {node.badges.map((badge, index) => (
              <span
                aria-label={badge.label}
                className="paper-outline__badge"
                data-tone={badge.tone}
                key={`${badge.label}-${index}`}
                title={badge.label}
              >
                {badge.text}
              </span>
            ))}
          </span>
        ) : state === 'context' ? (
          <small className="paper-outline__context">context</small>
        ) : null}
      </a>
      {node.children.length ? (
        <ol>
          {node.children.map((child) => (
            <OutlineNode
              activeId={activeId}
              key={child.id}
              node={child}
              onNavigate={onNavigate}
            />
          ))}
        </ol>
      ) : null}
    </li>
  );
}

export function PaperOutline({
  activeId,
  ariaLabel,
  heading = 'Questions',
  onNavigate,
  sections,
}: {
  activeId?: string;
  ariaLabel: string;
  heading?: ReactNode;
  onNavigate?: (id: string) => void;
  sections: readonly PaperOutlineSection[];
}) {
  const outlineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const outline = outlineRef.current;
      const current = outline?.querySelector<HTMLElement>(
        '[aria-current="location"]',
      );
      if (!outline || !current) return;

      const outlineRect = outline.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();
      if (currentRect.top < outlineRect.top) {
        outline.scrollTo({
          top: outline.scrollTop + currentRect.top - outlineRect.top,
        });
      } else if (currentRect.bottom > outlineRect.bottom) {
        outline.scrollTo({
          top: outline.scrollTop + currentRect.bottom - outlineRect.bottom,
        });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [activeId]);

  return (
    <nav aria-label={ariaLabel} className="paper-outline" ref={outlineRef}>
      <span className="paper-outline__heading">{heading}</span>
      {sections.map((section) => (
        <section className="paper-outline__section" key={section.id}>
          <a className="paper-outline__section-link" href={section.href}>
            <span>{section.label}</span>
            <strong>{section.nodes.length}</strong>
          </a>
          <ol>
            {section.nodes.map((node) => (
              <OutlineNode
                activeId={activeId}
                key={node.id}
                node={node}
                onNavigate={onNavigate}
              />
            ))}
          </ol>
        </section>
      ))}
    </nav>
  );
}
