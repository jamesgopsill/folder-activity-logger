import { FAL, FALConfig } from "../src"

const config: FALConfig = {
	watchGlob: __dirname+"/../src",
	logFilePath: __dirname+"/log.txt",
	debug: true
}

console.log(config)


const watcher = new FAL(config)

watcher.watch()

setTimeout(() => {
	watcher.stop()
}, 5000)
