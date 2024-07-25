/**
 * 音频管理器
 */
import { AudioSource, Node, director } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import EventMgr from "../event/EventManager";
import StorageMgr from "../storage/StorageManager";
import LoadMgr from "../res/ResManager";

class AudioManager extends Singleton {
  init() {
    if (this._audioSource) return;
    let audioNode = new Node("__AudioManager__");
    director.getScene().addChild(audioNode);
    director.addPersistRootNode(audioNode);
    this._audioSource = audioNode.addComponent(AudioSource);
    this._talkAudioSource = audioNode.addComponent(AudioSource);
    this._audioSource.loop = true;
    this._talkAudioSource.loop = false;
    EventMgr.on("BeforeShowRewardAd", () => {
      if (this._audioSource.playing) {
        this.dirty = true;
        this.pauseBgm();
      }
      this._talkAudioSource.stop();
    });
    EventMgr.on("CloseRewardAd", () => {
      if (this.dirty) {
        this.dirty = false;
        this.resumeBgm();
      }
    });
  }

  private _audioSource: AudioSource;
  private _talkAudioSource: AudioSource;
  private _talkTimeRef: any;
  /** 此处脏用作标识是否是由广告展示导致的背景音乐暂停 避免影响其他场景主动暂停的音乐被错误播放 */
  private dirty = false;
  /** 音乐开关 */
  get musicOff() {
    return StorageMgr.get("userSettings")?.musicOff;
  }
  set musicOff(v: boolean) {
    StorageMgr.set("userSettings", (data) => {
      return {
        ...data,
        musicOff: v,
      };
    });
  }
  /** 音效开关 */
  get effectOff() {
    return StorageMgr.get("userSettings")?.effectOff;
  }
  set effectOff(v: boolean) {
    StorageMgr.set("userSettings", (data) => {
      return {
        ...data,
        effectOff: v,
      };
    });
  }

  get audioSource() {
    return this._audioSource;
  }

  /** 播放音效 */
  playEffect(bundleName: string, audioName: string) {
    // if (this.effectOff) return Promise.resolve();
    // return LoadMgr.loadAudio(
    //   bundleName as any,
    //   `${
    //     (bundleName as any) === "resources" ? "" : "res/"
    //   }audios/effects/${audioName}`
    // ).then((audioClip) => {
    //   this._audioSource.playOneShot(audioClip);
    // });
  }

  /** 播放背景音乐 */
  playBgm(bundleName: string, audioName: string) {
    // if (this.musicOff) return Promise.resolve();
    // return LoadMgr.loadAudio(
    //   bundleName as any,
    //   `${
    //     (bundleName as any) === "resources" ? "" : "res/"
    //   }audios/bgms/${audioName}`
    // ).then((audioClip) => {
    //   this._audioSource.clip = audioClip;
    //   this._audioSource.play();
    // });
  }

  /** 停止背景音乐 */
  stopBgm() {
    this._audioSource.stop();
  }

  /** 暂停背景音乐 */
  pauseBgm() {
    this._audioSource.pause();
  }

  /** 恢复背景音乐 */
  resumeBgm() {
    if (this.musicOff) return;
    this._audioSource.play();
  }

  /** 播放对话 */
  playTalk(
    bundleName: string,
    audioName: string
    // 这里不建议采用Promise的形式 因为定时任务被取消后会导致Promise处于pending中内存泄漏
    // cb?: () => void
  ) {
    // return LoadMgr.loadAudio(
    //   bundleName as any,
    //   `${bundleName === "resources" ? "" : "res/"}audios/talks/${audioName}`
    // ).then((audioClip) => {
    //   this._talkAudioSource.clip = audioClip;
    //   this._talkAudioSource.play();
    //   return new Promise((resolve) => {
    //     this._talkTimeRef = setTimeout(() => {
    //       this._talkTimeRef = null;
    //       resolve(void 0);
    //     }, audioClip.getDuration() * 1000);
    //   });
    // });
  }

  /** 停止对话 */
  stopTalk() {
    this._talkTimeRef && clearTimeout(this._talkTimeRef);
    this._talkTimeRef = null;
    this._talkAudioSource.stop();
  }
}

const AudioMgr = AudioManager.getInstance();
export default AudioMgr;
