import { AudioClip, AudioSource, macro, Node } from "cc";

export default class Audio {
  private declare _id: number;
  private declare _volume: number;
  private declare _muted: boolean;
  private declare repeat: number;
  private declare endedCallback: (interrupted: boolean) => void;
  private declare audioSource: AudioSource;

  constructor() {
    const node = new Node("__Audio__");
    this.audioSource = node.addComponent(AudioSource);
    node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
  }

  get id() {
    return this._id;
  }

  get playing() {
    return this.audioSource.playing;
  }

  get loop() {
    return this.audioSource.loop;
  }

  get volume() {
    return this._volume;
  }

  get muted() {
    return this._muted;
  }

  private onAudioEnded() {
    this.repeat--;
    if (this.repeat > 0) {
      this.audioSource.play();
      return;
    }
    this.endedCallback?.(false);
    this.endedCallback = null;
  }

  play(clip: AudioClip) {
    this.audioSource.clip = clip;
    this.audioSource.play();
    return this;
  }

  pause() {
    this.audioSource.pause();
    return this;
  }

  resume() {
    if (this.playing) return this;
    this.audioSource.play();
    return this;
  }

  setID(id: number) {
    this._id = id;
    return this;
  }

  setVolume(volume: number) {
    this._volume = volume;
    this.audioSource.volume = volume * (this._muted ? 0 : 1);
    return this;
  }

  setRepeat(repeat: number) {
    if (repeat < 0) repeat = macro.REPEAT_FOREVER;
    else if (repeat === 0) repeat = 1;
    let loop = repeat === macro.REPEAT_FOREVER;
    this.audioSource.loop = loop;
    this.repeat = repeat;
    return this;
  }

  setMute(muted: boolean) {
    this._muted = muted;
    this.audioSource.volume = this._volume * (muted ? 0 : 1);
    return this;
  }

  onEnded(endedCallback: (interrupted: boolean) => void) {
    this.endedCallback = endedCallback;
    return this;
  }

  recovery() {
    this._id = undefined;
    this._volume = undefined;
    this._muted = undefined;
    this.endedCallback?.(true);
    this.endedCallback = null;
    this.audioSource.stop();
    this.audioSource.clip = null;
    return this;
  }
}
