import * as path from "node:path";
import * as fs from "node:fs/promises";
import chalk from "chalk";
import { processSass } from "../processors/sass.js";
import { processPostcss } from "../processors/postcss.js";
import { Task } from "./task.js";
import { log, logError } from "../utils/log.js";

export class SassTask extends Task {
  /**
   * @param {object} options
   * @param {string} options.srcDir
   * @param {string} options.srcPath
   * @param {string} options.outPath
   */
  constructor({ srcDir, srcPath, outPath }) {
    super();
    this.srcDir = srcDir;
    this.srcPath = srcPath;
    this.outPath = outPath;
  }

  async run() {
    try {
      const src = (await fs.readFile(this.srcPath)).toString();

      const sassCompiled = await processSass(src, {
        loadPaths: [path.dirname(this.srcPath), this.srcDir],
      });

      const postcssProcessed = await processPostcss(sassCompiled.code, {
        srcPath: this.srcPath,
        map: sassCompiled.map,
      });

      await fs.mkdir(path.dirname(this.outPath), { recursive: true });
      await fs.writeFile(this.outPath, postcssProcessed.code);

      log(`${chalk.green.bold("out")} ${path.relative(process.cwd(), this.outPath)}`);

      const dependencies = sassCompiled.dependencies.map((url) =>
        path.relative(this.srcDir, url.pathname)
      );
      this.setDependencies(dependencies);
    } catch (error) {
      logError(error);
      throw error;
    }
  }
}
