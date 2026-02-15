function formatTime(time) {
  if (isNaN(time)) return;
  const abs = Math.abs(time);
  const min = Math.floor(abs / 60);
  const sec = Math.floor(abs % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default class Noise{
    constructor({src, volume = 1, pan = 0, loop = false}){
          this.metaData = []
          this.audioContext = new AudioContext()
          this.audio = new Audio(src)
          this.audio.preload = 'metadata'
          this.loop = this.audio.loop = loop;
          this.Source = this.audioContext.createMediaElementSource(this.audio)
          this.gainNode = this.audioContext.createGain()
          this.panner = new StereoPannerNode(this.audioContext)
          this.gainNode.gain.value = volume
          this.panner.pan.value = pan     
          this.initialize()   

          this.Source.connect(this.panner).connect(this.gainNode).connect(this.audioContext.destination)
    }

    initialize(){
        this.audio.addEventListener("loadedmetadata", () => {
            const audioFileData = {
                duration: formatTime(this.audio.duration),
                title: this.audio.src.split("/").pop(),
                fileext: this.audio.src.split(".").pop(),
            }


            this.notifyListners(audioFileData)
        })
    }


    onLoadedmetadata(callback){
        if(typeof callback === "function"){
            this.metaData.push(callback)
        }

        return this
    }

    notifyListners(metadata){
        this.metaData.forEach(listener => {
            listener(metadata)
        })
    }


    get currentTime(){
       return formatTime(this.audio.currentTime)
    }

    async play(){
        await this.audio.play()
    }

    

    pause(){
        this.audio.pause()
    }
}


const noise = new Noise({
    src: "/plenty.mp3"
})




const playbtn = document.querySelector(".play")



playbtn.addEventListener("click", () => {
   noise.play()
})

noise.onLoadedmetadata((metaData) => {
    console.log(metaData.duration)
    console.log(metaData.title)
    console.log(metaData.fileext)
})
