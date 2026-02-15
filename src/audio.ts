import { type Metadata } from "./type";

type NoiseType = {
    src: string,
    volume: number,
    pan: number,
    loop: boolean,
}

function formatTime(time: number) {
  if (isNaN(time)) return;

  const abs = Math.abs(time);

  const min = Math.floor(abs / 60);
  const sec = Math.floor(abs % 60);

  return `${min}:${sec}`
}

export default class Noise{
    private audioContext : AudioContext
    private gainNode : GainNode
    private panner : StereoPannerNode
    private Source : MediaElementAudioSourceNode
    private loop : boolean
    public audio: HTMLAudioElement
    public metaData: Array<(metadata: Metadata) => void> = []


    constructor({src, volume = 1, pan = 0, loop = false}: Partial<NoiseType>){
        this.audioContext = new AudioContext()
        this.audio = new Audio(src)
        this.metaData = []
        this.loop = this.audio.loop = loop
        this.Source = this.audioContext.createMediaElementSource(this.audio)
        this.gainNode = this.audioContext.createGain()
        this.panner = new StereoPannerNode(this.audioContext)
        this.gainNode.gain.value =  volume
        this.panner.pan.value = pan
        this.init()

        
        this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination)
    }


    init(){
        this.audio.addEventListener("loadedmetadata", () => {
            const metadatas : Metadata = {
                duration: formatTime(this.audio.duration),
                currentTime: formatTime(this.audio.currentTime),
                title: this.audio.src.split("/").pop(),
                fileExt: this.audio.src.split(".").pop()
            }

            this.notifyEventListners(metadatas)
        })
    }

    onLoadedmetadata(callback: (metadata: Metadata) => void): number | this{
        if(typeof callback === "function"){
            return this.metaData.push(callback)
        }
        return this
    }

    notifyEventListners(metadata: Metadata): void{
        this.metaData.forEach((listner) => {
           listner(metadata)
        })
    }


    async play(){
        await this.audioContext.resume()

        this.audio.play()
    }


    pause(){
        this.audio.pause()
    }
}

const noise = new Noise({
    src: "/plenty.mp3",
})

noise.onLoadedmetadata((metadata) => {
    console.log(metadata.duration)
    console.log(metadata.currentTime)
    console.log(metadata.fileExt)
    console.log(metadata.title)
})


const play = document.querySelector(".play") as HTMLElement
