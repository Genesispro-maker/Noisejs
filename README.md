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

git clone https://github.com/yourusername/noise-js.git

Then include it in your project:

Using a <script> tag
`````
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
src	string	required	Path to the audio file
mute	boolean	false	Mutes the audio
volume	number	1	Volume level (0 to 1)
pan	number	0	Stereo pan (-1 left to 1 right)
loop	boolean	false	Whether the audio should loop
🎛 Methods
play()

Plays the audio.

noise.play()
pause()

Pauses the audio.

noise.pause()
onLoadedmetadata(callback)

Fires when the audio metadata has finished loading.

noise.onLoadedmetadata(() => {
  console.log("Metadata loaded")
})

# 🛠 Example
const bgMusic = new Noise({
  src: "background.mp3",
  volume: 0.5,
  loop: true
})

bgMusic.onLoadedmetadata(() => {
  console.log("Audio ready")
})

bgMusic.play()

# 🔮 Future Updates
 npm release

 Add test coverage

 Improve documentation

 Add additional audio utilities

Clean up legacy structure

Publish to npm

Expand audio control features

Improve event handling
