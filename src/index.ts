import chokidar from "chokidar"
import { appendFile, writeFileSync } from "fs"

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
	watchGlob: string
	logFilePath: string
	debug: boolean
	watcher: any

	constructor(config: FALConfig) {
		this.watchGlob = config.watchGlob
		this.logFilePath = config.logFilePath
		this.debug = config.debug

		const msg = {
			fal: "watch-started",
		}
		writeFileSync(this.logFilePath, JSON.stringify(msg))
	}

	watch() {
		if (this.debug) console.log("|- Start Watching")
		const options = {
			userPolling: true,
			alwaysStat: true,
			ignorePermissionErrors: true,
		}
		this.watcher = chokidar
			.watch(this.watchGlob, options)
			.on("all", (event, path, details) => {
				if (this.debug) console.log(`|- ${event} ${path}`)
				let json: any = {}
				if (details) {
					json = details
				}
				json.path = path
				json.event = event
				this.append(json)
			})
			.on("error", (err) => {
				console.log("Watch Error")
				console.log(err)
			})
			.on("ready", () => {
				if (this.debug) console.log("|- Indexing Complete")
				const msg = {
					fal: "indexing-complete",
				}
				this.append(msg)
			})
	}

	async stop() {
		if (this.watcher) {
			await this.watcher.close()
			if (this.debug) console.log("|- Logging stopped")
			const msg = {
				fal: "watch-stopped",
			}
			this.append(msg)
		}
	}

	append(json: any) {
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
