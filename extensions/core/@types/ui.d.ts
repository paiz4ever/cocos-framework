type TLayer =
  | "GameView" // 游戏视图层（基于堆栈）
  | "Fixed" // 固定层（常驻于游戏视图上）
  | "PopView" // 弹出视图层（基于堆栈）
  | "Modal" // 模态层（全局唯一，多个视图会以队列分别显示）
  | "Loading" // Loading层（加载）
  | "Toast" // Toast层（提示）
  | "Touch" // 触摸层（触摸监听及阻塞）
  | "Dev"; // 开发层（开发面板及调试）

interface IUIResource {
  /**
   * UI层级
   */
  layer: TLayer;
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

interface IUIConfig {
  [key: number]: IUIResource;
}

interface IUIShowOptions {
  /**
   * UIID
   */
  id: number;
  /**
   * 传递的数据
   */
  data?: any;
  /**
   * 静默（不显示加载loading，也不屏蔽触摸）
   * @default false
   */
  silent?: boolean;
  /**
   * UI展示时触发
   */
  onShow?: () => Promise<void>;
  /**
   * UI关闭时触发
   */
  onHide?: () => Promise<void>;
}

interface IUIHideOptions {
  /**
   * UIID
   */
  id: number;
  /**
   * 是否释放
   * @description 优先级大于ui本身的设定
   */
  release?: boolean;
  /**
   * UI关闭时触发
   */
  onHide?: () => Promise<void>;
}
