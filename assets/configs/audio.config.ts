import { ConfigUtil } from "builtin/utils/config";

export enum AudioID {
  BGM,
  Click,
}

/**
 * 音频映射
 */
ConfigUtil.injectAudio({
  config: {
    [AudioID.BGM]: "talk",
    [AudioID.Click]: "pop-up",
  },
  bundle: "dev-test",
});
