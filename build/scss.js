import * as path from "node:path";
import { glob } from "./utils.js";
import { ScssTask } from "./tasks/scss.js";

const srcDir = path.resolve("src");
const outDir = path.resolve("dist");
const entries = await glob(["**/*.scss", "!**/_*"], { cwd: srcDir });

const tasks = entries.map((entry) => {
  const srcPath = path.resolve(srcDir, entry);
  const outPath = path.resolve(outDir, entry).replace(/\.scss$/, ".css");

  return new ScssTask({ srcDir, srcPath, outPath });
});

const results = await Promise.allSettled(tasks.map((task) => task.run()));

const resolved = results.filter((result) => result.status == "fulfilled");
const rejected = results.filter((result) => result.status == "rejected");

console.log(`wrote: ${resolved.length}, error: ${rejected.length}`);

if (rejected.length) {
  process.exit(1);
}
