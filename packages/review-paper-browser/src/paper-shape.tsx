import React, { type ComponentProps, type ReactNode } from 'react';

export type PaperShapeName = 'square' | 'circle' | 'triangle' | 'hexagon';
export type PaperShapePattern = 'plain' | 'vertical-stripes' | 'wavy-hatch';
export type PaperShapeSize = 'xl' | '2xl';

const SHAPE_PATHS: Record<PaperShapeName, string> = {
  square: 'M3 3H61V61H3Z',
  circle: 'M61 32a29 29 0 1 1-58 0 29 29 0 1 1 58 0',
  triangle: 'M32 3 61 61H3Z',
  hexagon: 'M17 3H47L61 32 47 61H17L3 32Z',
};

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
        viewBox="0 0 64 64"
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
