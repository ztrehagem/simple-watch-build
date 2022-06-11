import * as path from "node:path";
import * as chokidar from "chokidar";

const srcDir = path.resolve("src");
const outDir = path.resolve("dist");

const watcher = chokidar.watch(["**"], {
  cwd: srcDir,
});

watcher.on("all", (eventName, pathname, stats) => {
  console.log(`${eventName}\t${pathname}`);
})
