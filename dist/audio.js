function format(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${(String(seconds).padStart(2, "0"))}`;
}
export default class Noise {
    audioContext;
    gainNode;
    panner;
    Source;
    audio;
    metaData = [];
    constructor({ src = "", autoplay = false, mute = false, volume = 1, pan = 0, loop = false }) {
        this.audioContext = new AudioContext();
        this.audio = new Audio();
        this.metaData = [];
        this.audio.muted = mute;
        this.Source = this.audioContext.createMediaElementSource(this.audio);
        this.gainNode = this.audioContext.createGain();
        this.panner = new StereoPannerNode(this.audioContext);
        this.gainNode.gain.value = volume;
        this.panner.pan.value = pan;
        this.init();
        this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination);
        this.src = src;
        this.loop = loop;
        this.autoplay = autoplay;
    }
    get autoplay() {
        return this.audio.autoplay;
    }
    set autoplay(value) {
        this.audio.autoplay = value;
    }
    get loop() {
        return this.audio.loop;
    }
    set loop(value) {
        this.audio.loop = value;
    }
    get src() {
        return this.audio.src;
    }
    set src(value) {
        this.audio.src = value;
        if (value) {
            this.audio.load();
        }
    }
    init() {
        this.audio.addEventListener("loadedmetadata", () => {
            const metadatas = {
                duration: format(this.audio.duration),
                currentTime: format(this.audio.currentTime),
                title: this.audio.src.split("/").pop(),
                fileExt: this.audio.src.split(".").pop(),
            };
            this.notifyEventListners(metadatas);
        });
    }
    notifyEventListners(metadata) {
        this.metaData.forEach((listner) => {
            listner(metadata);
        });
    }
    onLoadedMetadata(callback) {
        if (typeof callback === "function") {
            return this.metaData.push(callback);
        }
        return this;
    }
    onTimeUpdate(callback) {
        if (typeof callback === "function") {
            this.audio.addEventListener("timeupdate", () => {
                const timeElapsed = this.audio.duration > 0 ? (this.audio.currentTime / this.audio.duration) * 100 : 0;
                const metadata = {
                    duration: format(this.audio.duration),
                    currentTime: format(this.audio.currentTime),
                    title: this.audio.src.split('/').pop(),
                    fileExt: this.audio.src.split(".").pop(),
                    progress: timeElapsed
                };
                callback(metadata);
            });
        }
        return this;
    }
    onEnd(callback) {
        if (typeof callback === "function") {
            this.audio.addEventListener("ended", () => {
                const data = {
                    currentTime: "0:00",
                    progress: 0
                };
                callback(data);
            });
        }
        return this;
    }
    async play() {
        await this.audioContext.resume();
        this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
    disconnect() {
        this.Source.disconnect();
        this.gainNode.disconnect();
        this.panner.disconnect();
        this.audio.src = "";
        this.audio.pause();
        this.audio.load();
        if (this.audioContext.state === "suspended") {
            this.audioContext.close();
        }
    }
}
//# sourceMappingURL=audio.js.map