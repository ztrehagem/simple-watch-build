import * as path from "node:path";
import * as fs from "node:fs/promises";
import { processSass } from "../processors/sass.js";
import { processPostcss } from "../processors/postcss.js";
import { Task } from "./task.js";
import { log, logError } from "../utils/log.js";
const { default: chalk } = await import("chalk");

export interface SassTaskOptions {
  srcDir: string;
  srcPath: string;
  outPath: string;
}

export class SassTask implements Task {
  readonly #srcDir: string;
  readonly #srcPath: string;
  readonly #outPath: string;

  reportDependencies: Task["reportDependencies"];

  constructor(options: SassTaskOptions) {
    this.#srcDir = options.srcDir;
    this.#srcPath = options.srcPath;
    this.#outPath = options.outPath;
  }

  async run(): Promise<void> {
    try {
      const src = (await fs.readFile(this.#srcPath)).toString();

      const sassCompiled = await processSass(src, {
        loadPaths: [path.dirname(this.#srcPath), this.#srcDir],
      });

      const postcssProcessed = await processPostcss(sassCompiled.code, {
        srcPath: this.#srcPath,
        map: sassCompiled.map,
      });

      await fs.mkdir(path.dirname(this.#outPath), { recursive: true });
      await fs.writeFile(this.#outPath, postcssProcessed.code);

      log(
        `${chalk.green.bold("out")} ${path.relative(
          process.cwd(),
          this.#outPath
        )}`
      );

      const dependencies = sassCompiled.dependencies.map((url) =>
        path.relative(this.#srcDir, url.pathname)
      );
      this.reportDependencies?.(dependencies);
    } catch (error) {
      logError(error);
      throw error;
    }
  }
}
