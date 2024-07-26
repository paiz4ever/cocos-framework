import { DEBUG } from "cc/env";
import * as app from "./export";

Object.defineProperty(app, "table", {
  get() {
    return app.config.tables;
  },
});
if (DEBUG) {
  window["app"] = app;
}
export default app as any;
