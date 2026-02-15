function formatTime(time) {
    if (isNaN(time))
        return;
    const abs = Math.abs(time);
    const min = Math.floor(abs / 60);
    const sec = Math.floor(abs % 60);
    return `${min}:${sec}`;
}
export default class Noise {
    audioContext;
    gainNode;
    panner;
    Source;
    loop;
    audio;
    metaData = [];
    constructor({ src, mute = false, volume = 1, pan = 0, loop = false }) {
        this.audioContext = new AudioContext();
        this.audio = new Audio(src);
        this.metaData = [];
        this.loop = this.audio.loop = loop;
        this.audio.muted = mute;
        this.Source = this.audioContext.createMediaElementSource(this.audio);
        this.gainNode = this.audioContext.createGain();
        this.panner = new StereoPannerNode(this.audioContext);
        this.gainNode.gain.value = volume;
        this.panner.pan.value = pan;
        this.init();
        this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination);
    }
    init() {
        this.audio.addEventListener("loadedmetadata", () => {
            const metadatas = {
                duration: formatTime(this.audio.duration),
                currentTime: formatTime(this.audio.currentTime),
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
    onLoadedmetadata(callback) {
        if (typeof callback === "function") {
            return this.metaData.push(callback);
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
}
const noise = new Noise({
    src: "/plenty_By_Burna_boy.mp3",
    loop: true,
    mute: false,
});
noise.onLoadedmetadata((data) => {
    console.log(data.duration);
    console.log(data.currentTime);
    console.log(data.title);
});
const play = document.querySelector(".play");
play.addEventListener("click", () => {
    noise.play();
});
const number = [43, 5, 6, 29].findIndex(nums => {
    return nums === 29;
});
console.log(number);
//# sourceMappingURL=audio.js.map