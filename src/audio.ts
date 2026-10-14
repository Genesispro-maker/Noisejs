type NoiseType = {
    src: string,
    volume: number,
    pan: number,
    loop: boolean,
    mute: boolean
    autoplay: boolean
}

interface Metadata {
    title: string | undefined,
    duration: string,
    fileExt: string | undefined,
    currentTime: string
}

function format(time: number){
     const minutes = Math.floor(time / 60);
     const seconds = Math.floor(time % 60);

    return `${String(minutes).padStart(2, "0")}:${(String(seconds).padStart(2, "0"))}`
}

export default class Noise{
    private audioContext : AudioContext
    private gainNode : GainNode
    private panner : StereoPannerNode
    private Source : MediaElementAudioSourceNode
    private audio: HTMLAudioElement
    private metaData: Array<(metadata: Metadata) => void> = []

    constructor({ src = "", autoplay = false, mute = false, volume = 1, pan = 0, loop = false}: Partial<NoiseType>){
        this.audioContext = new AudioContext()
        this.audio = new Audio()
        this.metaData = []
        this.audio.muted = mute

        this.Source = this.audioContext.createMediaElementSource(this.audio)
        this.gainNode = this.audioContext.createGain()
        this.panner = new StereoPannerNode(this.audioContext)
        this.gainNode.gain.value = volume
        this.panner.pan.value = pan

        this.init()
        this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination)

        this.src = src;
        this.loop = loop
        this.autoplay = autoplay
    }

    public get autoplay(): boolean {
        return this.audio.autoplay
    }

    public set autoplay(value: boolean){
        this.audio.autoplay = value
    }

    public get loop(): boolean {
        return this.audio.loop
    }

    public set loop(value: boolean){
        this.audio.loop = value
    }

    public get src(): string {
        return this.audio.src
    }

    public set src(value: string){
        this.audio.src = value

        if(value){
            this.audio.load()
        }
    }

    private init(){
        this.audio.addEventListener("loadedmetadata", () => {
            const metadatas : Metadata = {
                duration: format(this.audio.duration),
                currentTime: format(this.audio.currentTime),
                title: this.audio.src.split("/").pop(),
                fileExt: this.audio.src.split(".").pop(),
            }

            this.notifyEventListners(metadatas)
        })
    }

    private notifyEventListners(metadata: Metadata): void{
        this.metaData.forEach((listner) => {
           listner(metadata)
        })
    }

    onLoadedMetadata(callback: (metadata: Metadata) => void): number | this {
        if(typeof callback === "function"){
            return this.metaData.push(callback)
        }
        return this
    }

    onTimeUpdate(callback: (metadata: Metadata) => void){
        if(typeof callback === "function"){
            this.audio.addEventListener("timeupdate", () => {
                const metadata: Metadata = {
                    duration: format(this.audio.duration),
                    currentTime: format(this.audio.currentTime),
                    title: this.audio.src.split('/').pop(),
                    fileExt: this.audio.src.split(".").pop(),
                }

                callback(metadata)
            })
        }

        return this
    }

    async play(){
        await this.audioContext.resume()

        this.audio.play()
    }

    pause(){
        this.audio.pause()
    }

    disconnect(){
        this.Source.disconnect()
        this.gainNode.disconnect()
        this.panner.disconnect()

        this.audio.src = ""
        this.audio.pause()
        this.audio.load()

        if(this.audioContext.state === "suspended"){
            this.audioContext.close()
        }
    }
}
