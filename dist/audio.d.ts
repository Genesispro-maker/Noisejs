type NoiseType = {
    src: string;
    volume: number;
    pan: number;
    loop: boolean;
    mute: boolean;
    autoplay: boolean;
};
interface Metadata {
    title: string | undefined;
    duration: string;
    fileExt: string | undefined;
    currentTime: string;
}
export default class Noise {
    private audioContext;
    private gainNode;
    private panner;
    private Source;
    private audio;
    private metaData;
    constructor({ src, autoplay, mute, volume, pan, loop }: Partial<NoiseType>);
    get autoplay(): boolean;
    set autoplay(value: boolean);
    get loop(): boolean;
    set loop(value: boolean);
    get src(): string;
    set src(value: string);
    private init;
    private notifyEventListners;
    onLoadedMetadata(callback: (metadata: Metadata) => void): number | this;
    onTimeUpdate(callback: (metadata: Metadata) => void): this;
    play(): Promise<void>;
    pause(): void;
    disconnect(): void;
}
export {};
//# sourceMappingURL=audio.d.ts.map