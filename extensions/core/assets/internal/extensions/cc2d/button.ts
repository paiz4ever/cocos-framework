import { Button } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Button.setAudio = function () {};
}
