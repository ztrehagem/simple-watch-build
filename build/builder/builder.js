import { logError } from "../utils/log.js";
import { glob } from "../utils/glob.js";

export class Builder {
  #baseDir;
  #rules;

  constructor({ baseDir, rules }) {
    this.#baseDir = baseDir;
    this.#rules = rules;
  }

  async run() {
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
