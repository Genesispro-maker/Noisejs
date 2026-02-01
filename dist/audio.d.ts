type NoiseType = {
    src: string;
    volume: number;
    pan: number;
    loop: boolean;
};
export default class Noise {
    private audioContext;
    private gainNode;
    private panner;
    private Source;
    private loop;
    private audio;
    duration: string;
    currentTime: string | undefined;
    constructor({ src, volume, pan, loop }: Partial<NoiseType>);
    play(): Promise<void>;
    pause(): void;
}
export {};
//# sourceMappingURL=audio.d.ts.map