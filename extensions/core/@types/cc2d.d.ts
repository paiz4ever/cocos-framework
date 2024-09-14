/**
 * cc2d接口拓展
 * @version 3.8.3
 * @notice 引擎升级需注意api可能潜在的冲突
 */
declare module "cc" {
  interface Node {
    /**
     * 设置组件（没有则自动添加）
     * @param component 组件类
     * @param handler 组件处理函数
     */
    setComponent<T extends Component>(component: new () => T, handler?: (c: T) => void): T;
    /**
     * 修改组件
     * @param component 组件类
     * @param handler 组件处理函数
     * @returns 是否修改成功
     */
    modifyComponent<T extends Component>(component: new () => T, handler?: (c: T) => void): boolean;
    /**
     * 设置临时属性
     * @description 该属性在节点销毁时会被清除
     * @returns 是否设置成功
     */
    setTemporaryProperty(key: string, val: any): boolean;
    /**
     * 获取临时属性
     */
    getTemporaryProperty(key: string): any;
    /**
     * 激活指定索引的子节点（其余子节点不激活）
     * @param index 子节点的索引
     * @note 你可以使用`-1`使所有子节点都不激活
     */
    activateSingleChild(index: number): void;
    /**
     * // TODO
     * 过滤组件满足条件的保留
     */
    filterComponents<T extends Component>(component: new () => T, filter: (c: T) => boolean): T[];
    /**
     * // TODO
     * 过滤组件满足条件的直接退出递归
     */
    filterComponent<T extends Component>(component: new () => T, filter: (c: T) => boolean): T;
  }
  interface Component {
    /**
     * 设置组件（没有则自动添加）
     * @param component 组件类
     * @param handler 组件处理函数
     */
    setComponent<T extends Component>(component: new () => T, handler?: (c: T) => void): T;
    /**
     * 修改组件
     * @param component 组件类
     * @param handler 组件处理函数
     * @returns 是否修改成功
     */
    modifyComponent<T extends Component>(component: new () => T, handler?: (c: T) => void): boolean;
  }
  namespace math {
    interface Vec3 {
      v2(): Vec2;
    }
    interface Vec2 {
      v3(): Vec3;
    }
  }
  interface ScrollView {
    /**
     * 禁用触摸滚动（优先级高于autoTouchLock）
     */
    touchLock: boolean;
    /**
     * 自动禁用触摸滚动（指通过api调用滚动时不允许触摸滚动）
     */
    autoTouchLock: boolean;
    /**
     * 滚动到指定的item
     * @param index item对应的索引
     * @param timeInSecond 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated 滚动加速是否衰减，默认为 true。
     */
    scrollToItem(index: number, timeInSecond?: number, attenuated?: boolean): void;
  }
  interface UITransform {
    /**
     * 获取两个节点之间约束的边缘距离
     * @param transform 另一个节点的UITransform
     * @return 边缘距离xy
     */
    getOuterDistance(transform: UITransform): Vec2;
  }
  namespace Intersection2D {
    /**
     * 点是否在圆内
     * @param point 点坐标
     * @param cp 圆心坐标
     * @param cr 圆半径
     */
    function pointInCircle(point: Readonly<math.Vec2>, cp: Readonly<math.Vec2>, cr: number): boolean;
    /**
     * 点是否在矩形内
     * @param point 点坐标
     * @param rect 矩形
     */
    function pointInRect(point: Readonly<math.Vec2>, rect: math.Rect): boolean;
  }
  namespace Button {
    /**
     * // TODO
     * 设置全局点击音效
     */
    function setAudio(): void;
  }
  namespace Label {
    /**
     * // TODO
     * 设置全局字体
     */
    function setFont(): void;
  }
  interface Sprite {
    /**
     * 判断图片是否被命中
     * @param evt 点击事件
     * @param localPosition 本地坐标点
     * @param worldPosition 世界坐标点
     */
    hitTest(evt: EventTouch | EventMouse): boolean;
    hitTest(localPosition: Vec3): boolean;
    hitTest(worldPosition: Vec3, isWorld: true): boolean;
    /**
     * 获取命中图片的颜色
     * @param evt 点击事件
     * @param localPosition 本地坐标点
     * @param worldPosition 世界坐标点
     */
    hitColor(evt: EventTouch): Color | null;
    hitColor(localPosition: Vec3): Color | null;
    hitColor(worldPosition: Vec3, isWorld: true): Color | null;
  }
  interface Texture2D {
    /**
     * 读取图片像素
     * @param x 起始点x
     * @param y 起始点y
     * @param width 像素宽
     * @param height 像素高
     * @param buffer 像素缓存
     */
    readPixels(x?: number, y?: number, width?: number, height?: number, buffer?: Uint8Array): Uint8Array | null;
  }
}
