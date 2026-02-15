type NoiseType = {
    src: string;
    volume: number;
    pan: number;
    loop: boolean;
    mute: boolean;
};
interface Metadata {
    title: string | undefined;
    duration: string | undefined;
    fileExt: string | undefined;
    currentTime: string | undefined;
}
export default class Noise {
    private audioContext;
    private gainNode;
    private panner;
    private Source;
    private loop;
    private audio;
    private metaData;
    constructor({ src, mute, volume, pan, loop }: Partial<NoiseType>);
    private init;
    private notifyEventListners;
    onLoadedmetadata(callback: (metadata: Metadata) => void): number | this;
    play(): Promise<void>;
    pause(): void;
}
export {};
//# sourceMappingURL=audio.d.ts.map