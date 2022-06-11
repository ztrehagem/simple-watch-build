import * as path from "node:path";
import * as fs from "node:fs/promises";
import { processPug } from "../processors/pug.js";

export class PugTask {
  /**
   * @param {object} options
   * @param {string} options.srcDir
   * @param {string} options.srcPath
   * @param {string} options.outPath
   */
  constructor({ srcDir, srcPath, outPath }) {
    this.srcDir = srcDir;
    this.srcPath = srcPath;
    this.outPath = outPath;
  }

  async run() {
    try {
      const src = (await fs.readFile(this.srcPath)).toString();

      const pugRendered = processPug(src, {
        baseDir: this.srcDir,
      });

      await fs.mkdir(path.dirname(this.outPath), { recursive: true });
      await fs.writeFile(this.outPath, pugRendered.code);

      console.log(`Wrote ${path.relative(process.cwd(), this.outPath)}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
