import {
  _decorator,
  Component,
  EventTouch,
  Graphics,
  Input,
  Intersection2D,
  Label,
  Node,
  Rect,
  UITransform,
  Vec2,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ScratchCardScene")
export class ScratchCardScene extends Component {
  protected appConfig: IAppConfig = {};

  @property({ type: Graphics, tooltip: "画笔" })
  declare graphics: Graphics;
  @property({ type: Node, tooltip: "绘制的区域节点" })
  declare paintNode: Node;
  @property({ tooltip: "画笔宽度" })
  lineWidth: number = 20;
  @property({ type: Label, tooltip: "刮开进度" })
  declare progressLabel: Label;

  private declare paintTransform: UITransform;
  /** 上一次触点 */
  private lastTouchPos = new Vec3();
  /** 当前触点 */
  private currentTouchPos = new Vec3();
  /** 复用节省性能 */
  private tempWorldPos = new Vec3();
  private tempRect = new Rect();
  private tempVec2 = new Vec2();
  /** 当次绘制次数 */
  private paintCount = 0;
  /** 检测像素 */
  private declare pixels: {
    x: number;
    y: number;
    covered: boolean;
  }[];
  private declare _progress: number;
  get progress(): number {
    return this._progress;
  }
  set progress(p: number) {
    if (p === this._progress) return;
    this._progress = p;
    this.progressLabel && (this.progressLabel.string = `已经刮开了 ${p}%`);
  }

  protected onLoad(): void {
    this.paintTransform = this.paintNode.getComponent(UITransform)!;
    this.paintNode.on(Input.EventType.TOUCH_START, this.handleTouch, this);
    this.paintNode.on(Input.EventType.TOUCH_MOVE, this.handleTouch, this);
    this.paintNode.on(Input.EventType.TOUCH_END, this.handleTouchEnd, this);
    this.paintNode.on(Input.EventType.TOUCH_CANCEL, this.handleTouchEnd, this);
    this.initPixels();
    this.reset();
  }

  reset() {
    this.graphics.clear();
    this.paintCount = 0;
    this.progress = 0;
    this.pixels.forEach((p) => (p.covered = false));
  }

  protected handleTouch(e: EventTouch) {
    const pos = e.getUILocation();
    this.tempWorldPos.set(pos.x, pos.y, 0);
    this.lastTouchPos.set(this.currentTouchPos);
    this.paintTransform.convertToNodeSpaceAR(
      this.tempWorldPos,
      this.currentTouchPos
    );
    this.paint();
  }

  protected handleTouchEnd() {
    this.paintCount = 0;
  }

  protected paint() {
    this.paintCount++;
    let flag = false;
    // 只有首次绘制用圆点开始，之后连接线段（否则出现两个圆点距离太远造成间隙的情况）
    if (this.paintCount <= 1) {
      this.graphics.circle(
        this.currentTouchPos.x,
        this.currentTouchPos.y,
        this.lineWidth / 2
      );
      this.graphics.fill();
      this.pixels.forEach((p) => {
        if (p.covered) return;
        if (
          Intersection2D.pointInCircle(
            this.currentTouchPos.v2(),
            this.tempVec2.set(p.x, p.y),
            this.lineWidth / 2
          )
        ) {
          p.covered = true;
          flag = true;
        }
      });
    } else {
      this.graphics.moveTo(this.lastTouchPos.x, this.lastTouchPos.y);
      this.graphics.lineTo(this.currentTouchPos.x, this.currentTouchPos.y);
      this.graphics.lineWidth = this.lineWidth;
      this.graphics.lineCap = Graphics.LineCap.ROUND;
      this.graphics.lineJoin = Graphics.LineJoin.ROUND;
      this.graphics.stroke();
      this.pixels.forEach((p) => {
        if (p.covered) return;
        if (
          Intersection2D.lineRect(
            this.lastTouchPos.v2(),
            this.currentTouchPos.v2(),
            this.tempRect.set(p.x, p.y, this.lineWidth, this.lineWidth)
          )
        ) {
          p.covered = true;
          flag = true;
        }
      });
    }
    if (flag) {
      this.progress = Math.floor(
        (this.pixels.filter((v) => v.covered).length / this.pixels.length) * 100
      );
    }
  }

  private initPixels() {
    this.pixels = [];
    const xMax = Math.round(this.paintTransform.width / this.lineWidth);
    const yMax = Math.round(this.paintTransform.height / this.lineWidth);
    for (let x = 0; x < xMax; x++) {
      for (let y = 0; y < yMax; y++) {
        this.pixels.push({
          x: x * this.lineWidth - this.paintTransform.width / 2,
          y: y * this.lineWidth - this.paintTransform.height / 2,
          covered: false,
        });
      }
    }
  }
}
