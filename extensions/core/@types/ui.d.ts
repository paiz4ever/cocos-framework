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
  update: (finished: number, total: number) => void;
  fake: (timeout: number) => Promise<void>;
  end: () => void;
}
