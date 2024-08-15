type TUILayer =
  | "Scene" // 场景层（单例）
  | "Pop" // 弹出视图层（基于堆栈）
  | "Modal"; // 模态层（单例，多个视图会以队列分别显示）
type TLayer =
  | TUILayer
  | "Launch" // 启动层
  | "Loading" // Loading层（加载）
  | "Toast" // Toast层（提示）
  | "Dev"; // 开发层（开发面板及调试）

type IUIResource = IResource & {
  /**
   * UI层级
   * - `Scene`：场景层（单例）
   * - `Pop`：弹出视图层（基于堆栈）
   * - `Modal`：模态层（单例，多个视图会以队列分别显示）
   */
  layer: TUILayer;
};

interface IUIConfig {
  [key: number]: IUIResource;
}

interface IUIDefaultConfig {
  /** 启动页 */
  Launch?: IResource;
  /** 加载页 */
  Loading?: IResource;
  /** 提示 */
  Toast?: IResource;
}

interface ILaunchTracker {
  /**
   * 更新进度
   */
  update: (finished: number, total: number) => void;
  /**
   * 模拟进度
   * @param timeout 进度持续时间（单位：秒）
   */
  fake: (timeout: number) => Promise<void>;
  /**
   * 结束启动流程
   * @notice 一般为内部使用，可以使用此函数提前中断启动
   */
  end: () => void;
}
