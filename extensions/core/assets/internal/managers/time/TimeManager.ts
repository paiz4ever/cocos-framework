/**
 * 定时管理器
 */
import Singleton from "../../../builtin/structs/abstract/Singleton";
import { MinHeap } from "../../../builtin/structs/collections";

class TimeTask {
  constructor(
    public time: number,
    public callback: () => void,
    public interval: number = 0,
    public repeat: number = 0
  ) {}
}
class TimeManager extends Singleton {
  private heap = new MinHeap<TimeTask>((v) => v.time);
  private currentTime: number = 0;

  update(dt: number): void {
    this.currentTime += dt;
    while (!this.heap.isEmpty() && this.heap.peek()!.time <= this.currentTime) {
      const task = this.heap.extract();
      task?.callback();
      if (task && task.interval > 0 && task.repeat > 0) {
        task.time += task.interval;
        task.repeat -= 1;
        this.heap.insert(task);
      }
    }
  }

  scheduleTask(
    delay: number,
    callback: () => void,
    interval: number = 0,
    repeat: number = 0
  ): void {
    const taskTime = this.currentTime + delay;
    const newTask = new TimeTask(taskTime, callback, interval, repeat);
    this.heap.insert(newTask);
  }
}

const TimeMgr = TimeManager.getInstance();
export default TimeMgr;
