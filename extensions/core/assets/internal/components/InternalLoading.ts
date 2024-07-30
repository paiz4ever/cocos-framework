import { _decorator, Component, Graphics, Node, UITransform } from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("InternalLoading")
@requireComponent(Graphics)
@requireComponent(UITransform)
export class InternalLoading extends Component {
  private declare graphics: Graphics;
  private reverse = false;
  private angleSpeed = 120;
  private ringSpeed = 0.02;
  private progress = 0;

  protected onLoad(): void {
    this.graphics = this.getComponent(Graphics);
  }

  protected onEnable() {
    this.progress = 0;
    this.node.angle = 0;
    this.reverse = false;
    this.draw();
  }

  private draw() {
    const uiTransform = this.node.getComponent(UITransform);
    const radius = Math.min(uiTransform.width / 2, uiTransform.height / 2);
    this.graphics.clear();
    const start = 0.5 * Math.PI;
    const end =
      0.5 * Math.PI + (this.reverse ? 1 : -1) * this.progress * 2 * Math.PI;
    this.graphics.arc(0, 0, radius, start, end, this.reverse);
    this.graphics.stroke();
  }

  protected update(dt: number): void {
    this.node.angle -= this.angleSpeed * dt;
    if (this.node.angle >= 360 || this.node.angle <= -360) {
      this.node.angle = this.node.angle % 360;
    }
    if (this.reverse) {
      this.progress = Math.max(0, this.progress - this.ringSpeed);

      if (this.progress === 0) {
        this.reverse = !this.reverse;
      }
    } else {
      this.progress = Math.min(1, this.progress + this.ringSpeed);
      if (this.progress === 1) {
        this.reverse = !this.reverse;
      }
    }
    this.draw();
  }
}
