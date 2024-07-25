import { Intersection2D, math } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Intersection2D.pointInCircle = function (
    point: Readonly<math.Vec2>,
    cp: Readonly<math.Vec2>,
    cr: number
  ) {
    return math.Vec2.distance(point, cp) < cr;
  };

  Intersection2D.pointInRect = function (
    point: Readonly<math.Vec2>,
    rect: math.Rect
  ) {
    return rect.contains(point);
  };
}
