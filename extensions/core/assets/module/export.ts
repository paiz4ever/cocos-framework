export { default as config } from "../internal/managers/config/ConfigManager";
export { default as log } from "../internal/managers/log/LogManager";
export { default as res } from "../internal/managers/res/ResManager";
export { default as platform } from "../internal/managers/platform/PlatformManager";
export { default as storage } from "../internal/managers/storage/StorageManager";
export { default as ui } from "../internal/managers/ui/UIManager";
export { default as error } from "../internal/monitors/error/ErrorMonitor";
export { default as audio } from "../internal/managers/audio/AudioManager";
export { default as time } from "../internal/managers/time/TimeManager";
export { default as event } from "../internal/managers/event/EventManager";
export { default as language } from "../internal/managers/language/LanguageManager";
export * as utils from "../internal/utils";
import Root from "../internal/components/Root";
import Recyclable from "../internal/components/Recyclable";
export const comp = { Root, Recyclable };
