export default class Noise{
    private audioContext : AudioContext
    private gainNode : GainNode
    private panner : StereoPannerNode
    private Source : MediaElementAudioSourceNode
    private loop : boolean
    private audioFile: HTMLAudioElement
    constructor({src, volume = 1, pan = 0, loop = false}: {src: string, volume: number, pan: number, loop: boolean}){
        this.audioContext = new AudioContext()
        this.audioFile = new Audio(src)
        this.loop = this.audioFile.loop = loop
        this.Source = this.audioContext.createMediaElementSource(this.audioFile)
        this.gainNode = this.audioContext.createGain()
        this.panner = new StereoPannerNode(this.audioContext)


        this.gainNode.gain.value =  volume
        this.panner.pan.value = pan

        this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination)
    }

    async play(){
        await this.audioContext.resume()

        this.audioFile.play()
    }


    pause(){
        this.audioFile.pause()
    }
}