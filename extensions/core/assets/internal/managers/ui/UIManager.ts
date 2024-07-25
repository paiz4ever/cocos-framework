import Singleton from "../../../builtin/structs/abstract/Singleton";

class UIManager extends Singleton {}

const UIMgr = UIManager.getInstance();
export default UIMgr;
