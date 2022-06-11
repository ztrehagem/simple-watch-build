import * as path from "node:path";
import * as fs from "node:fs/promises";
import { processPug } from "../processors/pug.js";
import { Task } from "./task.js";

export class PugTask extends Task {
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

      const pugRendered = processPug(src, {
        filename: this.srcPath,
        baseDir: this.srcDir,
      });

      await fs.mkdir(path.dirname(this.outPath), { recursive: true });
      await fs.writeFile(this.outPath, pugRendered.code);

      console.log(`Wrote ${path.relative(process.cwd(), this.outPath)}`);

      const dependencies = pugRendered.dependencies.map((absPath) =>
        path.relative(this.srcDir, absPath)
      );
      this.setDependencies(dependencies);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
