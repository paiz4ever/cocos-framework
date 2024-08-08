/**
 * 音频管理器
 */
import { AudioClip, js, macro } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import Root from "../../components/Root";
import ResMgr from "../res/ResManager";
import Audio from "./Audio";
import { ArrayMap } from "../../../builtin/structs";

class AudioManager extends Singleton {
  private declare idg: js.IDGenerator;
  private declare pool: Audio[];
  private declare _musicMuted: boolean;
  private declare _effectMuted: boolean;
  private declare _musicVolume: number;
  private declare _effectVolume: number;
  private declare music: Audio;
  private declare effects: Map<string, Audio>;
  declare config: IAudioConfig;

  init() {
    this.idg = new js.IDGenerator("AudioManager");
    this.pool = [];
    this.effects = new Map();
    this._musicMuted = false;
    this._effectMuted = false;
    this._musicVolume = 1;
    this._effectVolume = 1;
  }

  get isMusicPlaying() {
    return this.music?.playing;
  }

  get musicMuted() {
    return this._musicMuted;
  }
  set musicMuted(muted: boolean) {
    this._musicMuted = muted;
    this.music?.setMute(muted);
  }

  get effectMuted() {
    return this._effectMuted;
  }
  set effectMuted(muted: boolean) {
    this._effectMuted = muted;
    this.effects.forEach((effect) => effect.setMute(muted));
  }

  get musicVolume() {
    return this._musicVolume;
  }
  set musicVolume(volume: number) {
    this._musicVolume = volume;
    this.music?.setVolume(volume);
  }

  get effectVolume() {
    return this._effectVolume;
  }
  set effectVolume(volume: number) {
    this._effectVolume = volume;
    this.effects.forEach((effect) => effect.setVolume(volume));
  }

  async playMusic(options: {
    id: number;
    repeat?: number;
    volume?: number;
    cover?: boolean;
  }) {
    const { id, repeat, volume, cover } = options;
    if (this.music?.id === id && !cover) {
      this.music
        .setVolume(volume ?? this.musicVolume)
        .setRepeat(repeat)
        .resume();
      return;
    }
    const res = this.config?.[id];
    if (!res) {
      throw new Error("invalid audio ID: " + id);
    }
    const { path, bundleName, bundleVersion } = res;
    const clip = await ResMgr.loadAudio({
      path,
      bundleName,
      bundleVersion,
    });
    this.recycle(this.music);
    this.music = this.acquire();
    this.music
      .setID(id)
      .setRepeat(repeat ?? macro.REPEAT_FOREVER)
      .setVolume(volume ?? this.musicVolume)
      .setMute(this.musicMuted)
      .play(clip);
  }

  stopMusic() {
    this.recycle(this.music);
    this.music = null;
  }

  pauseMusic() {
    this.music?.pause();
  }

  resumeMusic() {
    this.music?.resume();
  }

  async playEffect(options: { id: number; repeat?: number; volume?: number }) {
    const { id, repeat, volume } = options;
    const res = this.config?.[id];
    if (!res) {
      throw new Error("invalid audio ID: " + id);
    }
    const { path, bundleName, bundleVersion } = res;
    const clip = await ResMgr.loadAudio({
      path,
      bundleName,
      bundleVersion,
    });
    const effect = this.acquire();
    const uuid = this.idg.getNewId();
    this.effects.set(uuid, effect);
    effect
      .setID(id)
      .setRepeat(repeat ?? 1)
      .setVolume(volume ?? this.effectVolume)
      .setMute(this.effectMuted)
      .onEnded((interrupted) => {
        // 如果是通过stopEffect停止，那么一次性处理effects
        if (interrupted) return;
        this.effects.delete(uuid);
        this.recycle(effect);
      })
      .play(clip);
    return uuid;
  }

  stopEffect(uuid?: string) {
    if (!uuid) {
      this.effects.forEach((effect) => {
        this.recycle(effect);
      });
      this.effects.clear();
    } else {
      const effect = this.effects.get(uuid);
      if (effect) {
        this.effects.delete(uuid);
        this.recycle(effect);
      }
    }
  }

  pauseEffect(uuid?: string) {
    if (!uuid) {
      this.effects.forEach((effect) => {
        effect.pause();
      });
    } else {
      const effect = this.effects.get(uuid);
      if (effect) {
        effect.pause();
      }
    }
  }

  resumeEffect(uuid?: string) {
    if (!uuid) {
      this.effects.forEach((effect) => {
        effect.resume();
      });
    } else {
      const effect = this.effects.get(uuid);
      if (effect) {
        effect.resume();
      }
    }
  }

  release(id: number[] | number) {
    const ids = Array.isArray(id) ? id : [id];
    for (let id of ids) {
      const res = this.config?.[id];
      if (!res) {
        continue;
      }
      const { path, bundleName } = res;
      ResMgr.release({
        path,
        bundleName,
        type: AudioClip,
      });
    }
  }

  preload(id: number[] | number) {
    const ids = Array.isArray(id) ? id : [id];
    const map = new ArrayMap<string, string>();
    for (let id of ids) {
      const res = this.config?.[id];
      if (!res) {
        continue;
      }
      const { path, bundleName } = res;
      map.setValue(bundleName, path);
    }
    map.forEach((path, bundleName) => {
      ResMgr.preload({
        path,
        bundleName,
        type: AudioClip,
      });
    });
  }

  getInfo(id: number) {
    return this.config?.[id];
  }

  private acquire() {
    return this.pool.pop() || new Audio();
  }

  private recycle(audio: Audio) {
    if (!audio) {
      return;
    }
    audio.recovery();
    this.pool.push(audio);
  }
}

const AudioMgr = AudioManager.getInstance();
export default AudioMgr;
