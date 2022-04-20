"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAL = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const fs_1 = require("fs");
/**
 * The Folder Activity Monitor class
 */
class FAL {
    constructor(config) {
        this.watchGlob = config.watchGlob;
        this.logFilePath = config.logFilePath;
        this.debug = config.debug;
        this.onReady = this.onReady.bind(this);
        this.onAll = this.onAll.bind(this);
        this.onError = this.onError.bind(this);
        const msg = {
            fal: "watch-started",
        };
        (0, fs_1.writeFileSync)(this.logFilePath, JSON.stringify(msg));
    }
    watch() {
        if (this.debug)
            console.log("|- Start Watching");
        const options = {
            userPolling: true,
            alwaysStat: true,
            ignorePermissionErrors: true,
        };
        this.watcher = chokidar_1.default
            .watch(this.watchGlob, options)
            .on("all", this.onAll)
            .on("error", this.onError)
            .on("ready", this.onReady);
    }
    onAll(event, path, details) {
        if (this.debug)
            console.log(`|- ${event} ${path}`);
        let json = {};
        if (details) {
            json = details;
        }
        json.path = path;
        json.event = event;
        this.append(json);
    }
    onReady() {
        if (this.debug)
            console.log("|- Indexing Complete");
    }
    onError(err) {
        console.log("Watch Error");
        console.log(err);
    }
    async stop() {
        if (this.watcher) {
            await this.watcher.close();
            if (this.debug)
                console.log("|- Logging stopped");
            const msg = {
                fal: "watch-stopped",
            };
            this.append(msg);
        }
    }
    append(json) {
        (0, fs_1.appendFile)(this.logFilePath, "\n" + JSON.stringify(json), (err) => {
            if (err) {
                console.log("Append File Error");
                console.log(err);
            }
        });
    }
}
exports.FAL = FAL;
if (require.main == module) {
    console.log("Not yet implemented");
}
