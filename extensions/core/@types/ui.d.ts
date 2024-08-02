type TUILayer =
  | "Game" // 游戏视图层（单例）
  | "Pop" // 弹出视图层（基于堆栈）
  | "Modal"; // 模态层（单例，多个视图会以队列分别显示）
type TLayer =
  | TUILayer
  | "Loading" // Loading层（加载）
  | "Toast" // Toast层（提示）
  | "Dev"; // 开发层（开发面板及调试）

type IUIResource = IResource & {
  /**
   * UI层级
   * - `Game`：游戏视图层（单例）
   * - `Pop`：弹出视图层（基于堆栈）
   * - `Modal`：模态层（单例，多个视图会以队列分别显示）
   */
  layer: TUILayer;
};

interface IUIConfig {
  [key: number]: IUIResource;
}

interface IUIDefaultConfig {
  Loading?: IResource;
  Toast?: IResource;
}
