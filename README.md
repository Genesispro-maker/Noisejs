# 🎶 Noise Js

Noise Js is a lightweight JavaScript audio library designed to make audio integration in web projects simple and straightforward.

Personal project. Not published on npm (yet).

# ✨ Features

Simple and minimal API

Easy audio playback control

Configurable audio properties

Lightweight and dependency-free

Metadata load event support

# 📦 Installation

Noise Js is not currently available on npm.

Clone the repository:

````````
https://github.com/Genesispro-maker/Noisejs.git
````````

Then include it in your project:

Using a <script> tag

`````js
<script src="path/to/noise.js"></script>
`````

Using ES Modules

import Noise from "./noise.js"


# 🚀 Usage

Creating an instance

```js
const noise = new Noise({
  src: "audio.mp3",
  volume: 0.5
})

noise.play()
```

# ⚙️ Constructor Options
Property	Type	Default	Description

`src`:	 string	required Path to the audio file

`mute`:  boolean false	Mutes the audio

`volume`: number	1	Volume level (0 to 1)

`pan`: number 0	Stereo pan (-1 left to 1 right)

`loop`: boolean false	Whether the audio should loop

# 🎛 Methods

play()

Plays the audio.
````js
noise.play()
`````

pause()

Pauses the audio.
````js
noise.pause()
`````
````js
onLoadedmetadata(callback)
`````

Fires when the audio metadata has finished loading.
`````js
noise.onLoadedmetadata((data) => {
  console.log("Metadata loaded")
  console.log("name", data.name)
})
`````

# 🛠 Example
``````js
const bgMusic = new Noise({
  src: "background.mp3",
  volume: 0.5,
  loop: true
})
``````
````js
bgMusic.onLoadedmetadata((data) => {
  console.log("Audio ready")
  console.log(data.title)
  console.log(data.currentTime)
})

bgMusic.play()
````

# 🔮 Future Updates
. Publish to npm

. Expand audio control features

. Improve event handling

. Build An Audio Component Library
