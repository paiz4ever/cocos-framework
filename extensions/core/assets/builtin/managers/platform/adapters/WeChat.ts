import BasicAdapter from "./Basic";

export default class WeChatAdapter
  extends BasicAdapter<"WeChat">
  implements IPlatform
{
  protected ClassName: "WeChat";
}
