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
    public currentTime: string | undefined

    constructor({src, volume = 1, pan = 0, loop = false}: Partial<NoiseType>){
        this.audioContext = new AudioContext()
        this.audio = new Audio(src)
        this.loop = this.audio.loop = loop
        this.currentTime = formatTime(this.audio.currentTime)
        this.Source = this.audioContext.createMediaElementSource(this.audio)
        this.gainNode = this.audioContext.createGain()
        this.panner = new StereoPannerNode(this.audioContext)
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

const noise = new Noise({
    src: "/plenty.mp3",
})

noise.play()


const play = document.querySelector(".play") as HTMLElement
