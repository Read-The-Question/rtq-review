export const PAPER_SHAPE_VIEWBOX = "0 0 64 64";

export const SHAPE_PATHS = {
  square: "M3 3H61V61H3Z",
  circle: "M61 32a29 29 0 1 1-58 0 29 29 0 1 1 58 0",
  triangle: "M32 3 61 61H3Z",
  hexagon: "M17 3H47L61 32 47 61H17L3 32Z",
} as const;

export type PaperShapeName = keyof typeof SHAPE_PATHS;
