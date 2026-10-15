# Noise.js

A small, dependency-free TypeScript wrapper around the Web Audio API. Load a sound, set its volume and stereo pan, play it, and get metadata and progress callbacks, without wiring up the audio graph yourself.

![Written in TypeScript](https://img.shields.io/badge/written%20in-TypeScript-3178c6) ![Runtime dependencies: 0](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen) ![License: MIT](https://img.shields.io/badge/license-MIT-blue)

## Why

Controlling volume and pan means going through the Web Audio API, and that takes more setup than `new Audio().play()`: you build a small audio graph, and browsers keep the audio context suspended until the user interacts. Written by hand it looks like this:

```js
const ctx = new AudioContext();
const audio = new Audio("song.mp3");
const source = ctx.createMediaElementSource(audio);
const gain = ctx.createGain();
const panner = new StereoPannerNode(ctx);

gain.gain.value = 0.5;
panner.pan.value = -0.3;
source.connect(panner).connect(gain).connect(ctx.destination);

button.addEventListener("click", async () => {
  await ctx.resume();
  audio.play();
});
```

With Noise.js:

```js
const noise = new Noise({ src: "song.mp3", volume: 0.5, pan: -0.3 });

button.addEventListener("click", () => noise.play());
```

## Features

- Volume, stereo pan, loop, mute and autoplay as constructor options
- `play()` and `pause()`, with `play()` handling the audio context resume for you
- Callbacks for loaded metadata, time updates (with a progress percentage) and end of playback
- Display-ready `mm:ss` strings for duration and current time
- Written in TypeScript, with no runtime dependencies

## Installation

Noise.js is not on npm yet. Clone the repository:

```bash
git clone https://github.com/Genesispro-maker/Noisejs.git
```

Copy the compiled file from `dist/` into your project and import it. The TypeScript source is in `src/`.

## Quick start

```html
<button id="play">Play</button>
<button id="pause">Pause</button>

<script type="module">
  import Noise from "./noise.js"; // adjust the path to where you put the build

  const noise = new Noise({ src: "song.mp3", volume: 0.5 });

  document.getElementById("play").addEventListener("click", () => noise.play());
  document.getElementById("pause").addEventListener("click", () => noise.pause());
</script>
```

Serve the page over HTTP (for example with `npx serve`). Opening it from `file://` blocks module scripts.

## Examples

### Looping background music

```js
const music = new Noise({ src: "background.mp3", volume: 0.3, loop: true });

startButton.addEventListener("click", () => music.play());
```

### Progress bar and time display

```js
const noise = new Noise({ src: "song.mp3" });

noise.onLoadedMetadata(({ title, duration }) => {
  titleEl.textContent = `${title} (${duration})`;
});

noise
  .onTimeUpdate(({ currentTime, duration, progress }) => {
    timeEl.textContent = `${currentTime} / ${duration}`;
    bar.value = progress ?? 0; // <progress max="100">
  })
  .onEnd(() => {
    playButton.textContent = "Play again";
  });
```

### React

Create the instance in an effect, because it needs the browser's `AudioContext`, and disconnect it in the cleanup.

```tsx
"use client"; // needed in the Next.js App Router

import { useEffect, useRef, useState } from "react";
import Noise from "./noise";

export function Player({ src }: { src: string }) {
  const noiseRef = useRef<Noise | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const noise = new Noise({ src, volume: 0.6 });
    noise.onTimeUpdate((m) => setProgress(m.progress ?? 0));
    noiseRef.current = noise;

    return () => noise.disconnect();
  }, [src]);

  return (
    <div>
      <button onClick={() => noiseRef.current?.play()}>Play</button>
      <button onClick={() => noiseRef.current?.pause()}>Pause</button>
      <progress value={progress} max={100} />
    </div>
  );
}
```

## API

### `new Noise(options)`

Always pass an options object, even an empty one: `new Noise({})`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | `""` | URL or path of the audio file. Nothing loads while it is empty. |
| `volume` | `number` | `1` | Gain level. `0` is silent and `1` is full volume. |
| `pan` | `number` | `0` | `-1` is fully left and `1` is fully right. |
| `loop` | `boolean` | `false` | Restart when the audio ends. |
| `mute` | `boolean` | `false` | Start muted. |
| `autoplay` | `boolean` | `false` | Ask the browser to start playing once loaded. Browsers may block this; see [Browser notes](#browser-notes-and-limitations). |

`volume`, `pan` and `mute` are set when the instance is created.

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `src` | `string` | Get or set the audio source. Setting a new value loads that file. Reading returns the full resolved URL. |
| `loop` | `boolean` | Get or set whether playback loops. |
| `autoplay` | `boolean` | Get or set the autoplay flag. |

### Methods

| Method | Description |
| --- | --- |
| `play(): Promise<void>` | Resumes the audio context and starts playback. Call it from a user action such as a click, tap or key press. |
| `pause(): void` | Pauses playback. |
| `disconnect(): void` | Disconnects the audio nodes, stops playback and clears the source. Call it when you are finished with an instance. |
| `onLoadedMetadata(callback)` | Runs the callback once the file's metadata has loaded. It receives `{ title, duration, currentTime, fileExt }`. |
| `onTimeUpdate(callback)` | Runs the callback repeatedly during playback. It receives the metadata above plus `progress`. Returns the instance, so it can be chained. Each call adds another listener, so register it once. |
| `onEnd(callback)` | Runs the callback when playback finishes. It receives `{ currentTime, progress }`, reset to the start. Returns the instance. It does not fire while `loop` is `true`. |

### Metadata object

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string \| undefined` | File name taken from the end of the URL, for example `song.mp3`. |
| `fileExt` | `string \| undefined` | Text after the last dot in the URL, for example `mp3`. |
| `duration` | `string` | Total length as `mm:ss`. |
| `currentTime` | `string` | Playback position as `mm:ss`. |
| `progress` | `number` | Percentage played, from `0` to `100`. Only passed to `onTimeUpdate` and `onEnd`. |

## Browser notes and limitations

- **User gesture required.** Browsers keep the audio context suspended until the user interacts with the page. Start playback with `play()` inside a click or tap handler. `autoplay: true` is subject to the same browser policies, so it may not start on its own.
- **Browser only.** The constructor uses `AudioContext`, so create instances in the browser (inside an effect or an event handler), not during server rendering.
- **Same-origin audio.** The audio is routed through the Web Audio API, which outputs silence for files from another origin unless they are served with CORS. Noise.js does not set `crossOrigin` yet, so host the files on the same origin as your page.
- **One audio context per instance.** Browsers limit how many a page can create. Reuse an instance where you can and call `disconnect()` when you are done.
- **Fixed at creation.** Volume, pan and mute cannot be changed after the instance is created.
- **URL-based metadata.** `title` and `fileExt` come from the URL text, so query strings or URLs without an extension give odd values.

## Roadmap

- [ ] Publish to npm
- [ ] Expand audio control features
- [ ] Improve event handling

## License

MIT