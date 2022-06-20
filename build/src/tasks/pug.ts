import * as path from "node:path";
import * as fs from "node:fs/promises";
import { processPug } from "../processors/pug.js";
import { Task, TaskResult } from "./task.js";
import { log, logError } from "../utils/log.js";
const { default: chalk } = await import("chalk");

export interface PugTaskOptions {
  srcDir: string;
  srcPath: string;
  outPath: string;
}

export class PugTask implements Task {
  readonly #srcDir: string;
  readonly #srcPath: string;
  readonly #outPath: string;

  constructor(options: PugTaskOptions) {
    this.#srcDir = options.srcDir;
    this.#srcPath = options.srcPath;
    this.#outPath = options.outPath;
  }

  async run(): Promise<TaskResult> {
    try {
      const src = (await fs.readFile(this.#srcPath)).toString();

      const pugRendered = processPug(src, {
        filename: this.#srcPath,
        baseDir: this.#srcDir,
      });

      await fs.mkdir(path.dirname(this.#outPath), { recursive: true });
      await fs.writeFile(this.#outPath, pugRendered.code);

      log(
        `${chalk.green.bold("out")} ${path.relative(
          process.cwd(),
          this.#outPath
        )}`
      );

      const dependencies = pugRendered.dependencies.map((absPath) =>
        path.relative(this.#srcDir, absPath)
      );

      return { dependencies };
    } catch (error) {
      logError(error);
      throw error;
    }
  }
}
