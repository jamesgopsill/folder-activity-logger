/**
 * The config params required to instantiate FAL.
 */
export interface FALConfig {
    watchGlob: string;
    logFilePath: string;
    debug: boolean;
}
/**
 * The Folder Activity Monitor class
 */
export declare class FAL {
    private watchGlob;
    private logFilePath;
    private debug;
    private watcher;
    constructor(config: FALConfig);
    watch(): void;
    private onAll;
    private onReady;
    private onError;
    stop(): Promise<void>;
    private append;
}
