

class AudioClass {
    #audio
    #context
    #gainNode
    #panner
    #source
    #loop
    constructor({ src = [], volume = 1, pan = 0, loop = true}) {
        this.#context = new AudioContext()
        this.#audio = new Audio(src)
        this.#loop = this.#audio.loop = loop;
        this.#source = this.#context.createMediaElementSource(this.#audio)
        this.#gainNode = this.#context.createGain()
        this.#panner = new StereoPannerNode(this.#context)

        this.#gainNode.gain.value = volume
        this.#panner.pan.value = pan

        this.#source
            .connect(this.#panner)
            .connect(this.#gainNode)
            .connect(this.#context.destination)
    }

    async play() {
        await this.#context.resume()
        this.#audio.play()
    }

    pause(){
        this.#audio.pause()
    }   
}



const btn = document.querySelector("button")

const AV = new AudioClass({
    src: ["/plenty.mp3"],
    volume: 1,
    pan: 1,
    loop: true
})

btn.addEventListener("click", () => {
    AV.play()
})