import Singleton from "../../structs/abstract/Singleton";

class UIManager extends Singleton {}

const UIMgr = UIManager.getInstance();
export default UIMgr;
