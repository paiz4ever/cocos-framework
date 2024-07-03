import { UITransform, v2 } from "cc";

UITransform.prototype.getOuterDistance = function (transform: UITransform) {
  const up: UITransform =
    this.node.position.y > transform.node.position.y ? this : transform;
  const down: UITransform =
    this.node.position.y > transform.node.position.y ? transform : this;
  const left: UITransform =
    this.node.position.x > transform.node.position.x ? transform : this;
  const right: UITransform =
    this.node.position.x > transform.node.position.x ? this : transform;
  return v2(
    right.node.position.x -
      left.node.position.x +
      right.contentSize.width * (1 - right.anchorX) +
      left.contentSize.width * left.anchorX,
    up.node.position.y -
      down.node.position.y +
      up.contentSize.height * (1 - up.anchorY) +
      down.contentSize.height * down.anchorY
  );
};
