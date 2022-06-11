import * as path from "node:path";
import * as fs from "node:fs/promises";
import { processSass } from "../processors/sass.js";
import { processPostcss } from "../processors/postcss.js";

export class ScssTask {
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

      const scssCompiled = await processSass(src, {
        loadPaths: [path.dirname(this.srcPath), this.srcDir],
      });

      const postcssProcessed = await processPostcss(scssCompiled.code, {
        srcPath: this.srcPath,
        map: scssCompiled.map,
      });

      await fs.mkdir(path.dirname(this.outPath), { recursive: true });
      await fs.writeFile(this.outPath, postcssProcessed.code);

      console.log(`Wrote ${path.relative(process.cwd(), this.outPath)}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
