import {
  PAPER_SHAPE_VIEWBOX,
  SHAPE_PATHS,
  type PaperShapeName,
} from '@rtq/review-paper-markdown/paper-shape-paths';
import React, { type ComponentProps, type ReactNode } from 'react';

export type { PaperShapeName } from '@rtq/review-paper-markdown/paper-shape-paths';
export type PaperShapePattern = 'plain' | 'vertical-stripes' | 'wavy-hatch';
export type PaperShapeSize = 'xl' | '2xl';

export function PaperShape({
  children,
  name,
  pattern = 'plain',
  size = 'xl',
}: Readonly<{
  children?: ReactNode;
  name: PaperShapeName;
  pattern?: PaperShapePattern;
  size?: PaperShapeSize;
}>) {
  const patternId = React.useId();
  const blank =
    children == null ||
    (typeof children === 'string' && children.trim() === '');
  const label = `${name} shape, ${pattern.replace('-', ' ')} pattern${blank ? ', blank' : ''}`;

  return (
    <span
      aria-label={label}
      className="rtq-paper-shape"
      data-paper-shape-name={name}
      data-paper-shape-pattern={pattern}
      data-paper-shape-size={size}
      role="group"
    >
      <svg
        aria-hidden="true"
        className="rtq-paper-shape__graphic"
        focusable="false"
        viewBox={PAPER_SHAPE_VIEWBOX}
      >
        {pattern !== 'plain' ? (
          <defs>
            <pattern
              height="12"
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="12"
            >
              {pattern === 'vertical-stripes' ? (
                <path
                  className="rtq-paper-shape__pattern-stroke"
                  d="M3 0V12M9 0V12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ) : (
                <path
                  className="rtq-paper-shape__pattern-stroke"
                  d="M-6 3Q-3 0 0 3T6 3T12 3T18 3M-6 9Q-3 6 0 9T6 9T12 9T18 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              )}
            </pattern>
          </defs>
        ) : null}
        <path
          d={SHAPE_PATHS[name]}
          fill={pattern === 'plain' ? 'none' : `url(#${patternId})`}
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      {blank ? null : (
        <span className="rtq-paper-shape__content">{children}</span>
      )}
    </span>
  );
}

type MarkerSpanProps = ComponentProps<'span'> & {
  node?: unknown;
  'data-paper-shape'?: unknown;
  'data-paper-shape-name'?: unknown;
  'data-paper-shape-pattern'?: unknown;
  'data-paper-shape-size'?: unknown;
};

/** Keep ordinary spans (including KaTeX spans) intact. */
export function PaperShapeSpan({
  node: _node,
  children,
  ...props
}: MarkerSpanProps) {
  if (props['data-paper-shape'] === undefined) {
    return <span {...props}>{children}</span>;
  }
  return (
    <PaperShape
      name={props['data-paper-shape-name'] as PaperShapeName}
      pattern={props['data-paper-shape-pattern'] as PaperShapePattern}
      size={props['data-paper-shape-size'] as PaperShapeSize}
    >
      {children}
    </PaperShape>
  );
}
