declare module "@turf/helpers" {
  export interface Feature<G = Geometry, P = Record<string, unknown>> {
    type: "Feature";
    geometry: G;
    properties: P | null;
    id?: string | number;
  }
  export interface Point {
    type: "Point";
    coordinates: number[];
  }
  export interface Polygon {
    type: "Polygon";
    coordinates: number[][][];
  }
  export interface MultiPolygon {
    type: "MultiPolygon";
    coordinates: number[][][][];
  }
  export type Geometry = Point | Polygon | MultiPolygon;
  export function point(coordinates: number[], properties?: Record<string, unknown>): Feature<Point>;
  export function polygon(coordinates: number[][][], properties?: Record<string, unknown>): Feature<Polygon>;
}

declare module "@turf/boolean-point-in-polygon" {
  import { Feature, Point, Polygon, MultiPolygon } from "@turf/helpers";
  function booleanPointInPolygon(
    point: Feature<Point> | Point | number[],
    polygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
    options?: { ignoreBoundary?: boolean }
  ): boolean;
  export default booleanPointInPolygon;
}
