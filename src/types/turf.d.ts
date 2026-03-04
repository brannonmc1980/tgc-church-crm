declare module "@turf/boolean-point-in-polygon" {
  import { Feature, Point, Polygon, MultiPolygon } from "@turf/helpers";
  function booleanPointInPolygon(
    point: Feature<Point> | Point | number[],
    polygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
    options?: { ignoreBoundary?: boolean }
  ): boolean;
  export default booleanPointInPolygon;
}
