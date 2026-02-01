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
    duration;
    currentTime;
    constructor({ src, volume = 1, pan = 0, loop = false }) {
        this.audioContext = new AudioContext();
        this.audio = new Audio(src);
        this.loop = this.audio.loop = loop;
        this.duration = this.audio.addEventListener("loadedmetadata", () => {
            return this.duration = formatTime(this.audio.duration);
        });
        this.currentTime = formatTime(this.audio.currentTime);
        this.Source = this.audioContext.createMediaElementSource(this.audio);
        this.gainNode = this.audioContext.createGain();
        this.panner = new StereoPannerNode(this.audioContext);
        this.gainNode.gain.value = volume;
        this.panner.pan.value = pan;
        this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination);
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
    src: "/plenty.mp3",
});
const play = document.querySelector(".play");
const h1 = document.createElement("h1");
h1.textContent = `${noise.duration}`;
play.addEventListener("click", () => {
    noise.play();
    console.log(noise.duration);
});
//# sourceMappingURL=audio.js.map