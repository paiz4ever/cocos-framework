import { ConfigUtil } from "builtin/utils/config";

export enum AudioID {
  BGM,
  Click,
}

/**
 * 定义音频映射
 * @notice 配置方式参考 `ui.config.ts`
 */
ConfigUtil.defineAudio({
  config: {
    [AudioID.BGM]: "talk",
    [AudioID.Click]: "pop-up",
  },
  bundle: "dev-test",
});
