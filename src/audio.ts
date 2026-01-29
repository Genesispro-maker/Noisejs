export default class Noise{
    private audioContext : AudioContext
    private gainNode : GainNode
    private panner : StereoPannerNode
    private Source : MediaElementAudioSourceNode
    private loop : boolean
    private audio: HTMLAudioElement
    public duration: number
    constructor({src, volume = 1, pan = 0, loop = false}: {src: string, volume: number, pan: number, loop: boolean}){
        this.audioContext = new AudioContext()
        this.audio = new Audio(src)
        this.loop = this.audio.loop = loop
        this.duration = this.audio.duration
        this.Source = this.audioContext.createMediaElementSource(this.audio)
        this.gainNode = this.audioContext.createGain()
        this.panner = new StereoPannerNode(this.audioContext)

        this.audio.addEventListener("loadeddata", () => {
            this.duration = this.audio.duration;
        })


        this.gainNode.gain.value =  volume
        this.panner.pan.value = pan

        this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination)
    }

    async play(){
        await this.audioContext.resume()

        this.audio.play()
    }


    pause(){
        this.audio.pause()
    }
}
