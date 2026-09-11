# 🎶 Noise.js

A lightweight, dependency-free JavaScript audio library for simple, straightforward audio integration in web projects.

![status](https://img.shields.io/badge/status-personal--project-informational)
![npm](https://img.shields.io/badge/npm-not%20published%20yet-lightgrey)
![license](https://img.shields.io/badge/license-MIT-green)

> Personal project. Not published on npm yet.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Constructor Options](#constructor-options)
- [Methods](#methods)
- [Example](#example)
- [Roadmap](#roadmap)
- [License](#license)

## Features

- Simple, minimal API
- Easy audio playback control
- Configurable audio properties (volume, pan, loop, mute)
- Lightweight and dependency-free
- Metadata load event support
- Written in TypeScript

## Installation

Noise.js isn't on npm yet. Clone it directly:

```bash
git clone https://github.com/Genesispro-maker/Noisejs.git
```

Then include it in your project:

**Using a `<script>` tag**

```html
<script src="path/to/noise.js"></script>
```

**Using ES Modules**

```js
import Noise from "./noise.js";
```

## Usage

```js
const noise = new Noise({
  src: "audio.mp3",
  volume: 0.5,
});

noise.play();
```

## Constructor Options

| Property | Type      | Default | Description                     |
|----------|-----------|---------|----------------------------------|
| `src`    | `string`  | —       | Path to the audio file (required) |
| `mute`   | `boolean` | `false` | Mutes the audio                 |
| `volume` | `number`  | `1`     | Volume level (0 to 1)           |
| `pan`    | `number`  | `0`     | Stereo pan (-1 left to 1 right) |
| `loop`   | `boolean` | `false` | Whether the audio should loop   |

## Methods

### `play()`

Plays the audio.

```js
noise.play();
```

### `pause()`

Pauses the audio.

```js
noise.pause();
```

### `disconnect`

Disconnects audio nodes so the audio graphs built are destroyed or disconnected in the computer to avoid memory leaks.

```js
noise.disconnect();
```

### `onLoadedMetadata(callback)`

Fires when the audio metadata has finished loading.

```js
noise.onLoadedMetadata((data) => {
  console.log("Metadata loaded");
  console.log("name", data.name);
});
```

## Example

```js
const bgMusic = new Noise({
  src: "background.mp3",
  volume: 0.5,
  loop: true,
});

bgMusic.onLoadedMetadata((data) => {
  console.log("Audio ready");
  console.log(data.title);
  console.log(data.currentTime);
});

bgMusic.play();
```

## Roadmap

- [ ] Publish to npm
- [ ] Expand audio control features
- [ ] Improve event handling
- [ ] Build a full audio component library
