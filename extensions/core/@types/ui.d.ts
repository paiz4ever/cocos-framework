type TUILayer =
  | "GameView" // 游戏视图层（基于堆栈）
  | "Fixed" // 固定层（常驻于游戏视图上）
  | "PopView" // 弹出视图层（基于堆栈）
  | "Modal"; // 模态层（全局唯一，多个视图会以队列分别显示）
type TLayer =
  | TUILayer
  | "Loading" // Loading层（加载）
  | "Toast" // Toast层（提示）
  | "Dev"; // 开发层（开发面板及调试）

interface IUIResource {
  /**
   * UI资源路径
   */
  path: string;
  /**
   * 资源包名称
   */
  bundleName?: string;
  /**
   * 资源包版本
   */
  bundleVersion?: string;
}

type IUIResourceWithLayer = IUIResource & {
  /**
   * UI层级
   */
  layer: TUILayer;
};

interface IUIConfig {
  [key: number]: IUIResourceWithLayer;
}
