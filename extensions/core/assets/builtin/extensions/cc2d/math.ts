import { math } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  math.Vec3.prototype.v2 = function () {
    if (!this._tempVec2) {
      this._tempVec2 = new math.Vec2(this.x, this.y);
    }
    return this._tempVec2.set(this.x, this.y);
  };
  math.Vec2.prototype.v3 = function () {
    if (!this._tempVec3) {
      this._tempVec3 = new math.Vec3(this.x, this.y, 0);
    }
    return this._tempVec3.set(this.x, this.y, 0);
  };
}
