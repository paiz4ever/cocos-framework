import { Label } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Label.setFont = function () {};
}
