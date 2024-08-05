import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday.js";
import "dayjs/locale/zh-cn.js";
import { DEBUG } from "cc/env";

dayjs.extend(weekday);

if (DEBUG) {
  (window as any)["dayjs"] = dayjs;
}
