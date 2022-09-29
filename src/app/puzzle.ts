export interface Puzzle {
  level?: number;
  size: number;
  solution: string[];
  rows?: string[];
  columns?: string[];
  order?: number;
}
