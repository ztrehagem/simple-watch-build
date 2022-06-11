import { logError } from "../utils/log.js";
import { glob } from "../utils/glob.js";
import { Rule } from "../types/rule.js";

export interface BuilderOptions {
  baseDir: string;
  rules: readonly Rule[];
}

export class Builder {
  readonly #baseDir: string;
  readonly #rules: readonly Rule[];

  constructor(options: BuilderOptions) {
    this.#baseDir = options.baseDir;
    this.#rules = options.rules;
  }

  async run(): Promise<void> {
    const tasks = await Promise.all(
      this.#rules.map(async (rule) => {
        const exclude = rule.exclude.map((pattern) => `!${pattern}`);
        const patterns = [...rule.include, ...exclude];

        const sources = await glob(patterns, {
          cwd: this.#baseDir,
        });

        return sources.map((source) => rule.createTask(source));
      })
    );

    const results = await Promise.allSettled(tasks.flat().map((task) => task.run()));

    const failures = results.filter((result) => result.status == "rejected");

    if (failures.length) {
      const message = `${failures.length} tasks are failed.`;
      logError(message);
      throw new Error(message);
    }
  }
}
