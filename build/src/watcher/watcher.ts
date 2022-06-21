import * as chokidar from "chokidar";
import { default as anymatch } from "anymatch";
import { DependencyMap } from "./dependency_map.js";
import { log } from "../utils/log.js";
import { Rule } from "../types/rule.js";
const { default: chalk } = await import("chalk");

export interface WatcherOptions {
  baseDir: string;
  rules: readonly Rule[];
}

export class Watcher {
  readonly #baseDir: string;
  readonly #rules: readonly Rule[];
  readonly #depMap = new DependencyMap<string, string>();
  #watcher?: chokidar.FSWatcher;

  constructor(options: WatcherOptions) {
    this.#baseDir = options.baseDir;
    this.#rules = options.rules;
  }

  launch(): void {
    if (this.#watcher) return;

    this.#watcher = chokidar.watch(["."], {
      cwd: this.#baseDir,
    });

    this.#watcher.on("add", (pathname) => this.#onUpdate(pathname));
    this.#watcher.on("change", (pathname) => this.#onUpdate(pathname));
    this.#watcher.on("unlink", (pathname) => this.#onDelete(pathname));
  }

  #onUpdate(pathname: string): void {
    this.#runRules(pathname);
    this.#depMap.getSources(pathname)?.forEach((source) => {
      this.#runRules(source);
    });
  }

  #onDelete(pathname: string): void {
    this.#depMap.set(pathname, []);
    this.#depMap.getSources(pathname)?.forEach((source) => {
      this.#runRules(source);
    });
  }

  #runRules(pathname: string): void {
    for (const rule of this.#rules) {
      if (
        anymatch(rule.include, pathname) &&
        !anymatch(rule.exclude, pathname)
      ) {
        void this.#runRule(pathname, rule);
        break;
      }
    }
  }

  async #runRule(pathname: string, rule: Rule): Promise<void> {
    log(`${chalk.blue.bold("run")}${chalk.dim(`(${rule.name})`)} ${pathname}`);

    const task = rule.createTask(pathname);

    try {
      const result = await task.run();
      this.#depMap.set(pathname, result.dependencies);
    } catch (error) {
      /* Ignore rejection to continue running tasks */
    }
  }
}
