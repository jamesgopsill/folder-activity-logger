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
    watchGlob: string;
    logFilePath: string;
    debug: boolean;
    watcher: any;
    constructor(config: FALConfig);
    watch(): void;
    stop(): Promise<void>;
    append(json: any): void;
}
