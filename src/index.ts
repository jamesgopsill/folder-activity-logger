import chokidar from "chokidar"
import { appendFile, Stats, writeFileSync } from "fs"

/**
 * The config params required to instantiate FAL.
 */
export interface FALConfig {
	watchGlob: string
	logFilePath: string
	debug: boolean
}

/**
 * The Folder Activity Monitor class
 */
export class FAL {
	private watchGlob: string
	private logFilePath: string
	private debug: boolean
	private watcher: any

	constructor(config: FALConfig) {
		this.watchGlob = config.watchGlob
		this.logFilePath = config.logFilePath
		this.debug = config.debug

		this.onReady = this.onReady.bind(this)
		this.onAll = this.onAll.bind(this)
		this.onError = this.onError.bind(this)

		const msg = {
			fal: "watch-started",
		}
		writeFileSync(this.logFilePath, JSON.stringify(msg))
	}

	public watch() {
		if (this.debug) console.log("|- Start Watching")
		const options = {
			userPolling: true,
			alwaysStat: true,
			ignorePermissionErrors: true,
		}
		this.watcher = chokidar
			.watch(this.watchGlob, options)
			.on("all", this.onAll)
			.on("error", this.onError)
			.on("ready", this.onReady)
	}

	private onAll(event: string, path: string, details: Stats) {
		if (this.debug) console.log(`|- ${event} ${path}`)
		let json: any = {}
		if (details) {
			json = details
		}
		json.path = path
		json.event = event
		this.append(json)
	}

	private onReady() {
		if (this.debug) console.log("|- Indexing Complete")
	}

	private onError(err: Error) {
		console.log("Watch Error")
		console.log(err)
	}

	public async stop() {
		if (this.watcher) {
			await this.watcher.close()
			if (this.debug) console.log("|- Logging stopped")
			const msg = {
				fal: "watch-stopped",
			}
			this.append(msg)
		}
	}

	private append(json: any) {
		appendFile(this.logFilePath, "\n" + JSON.stringify(json), (err) => {
			if (err) {
				console.log("Append File Error")
				console.log(err)
			}
		})
	}
}

if (require.main == module) {
	console.log("Not yet implemented")
}
