import * as chokidar from "chokidar";
import { default as anymatch } from "anymatch";
import { TaskRunner } from "./task_runner.js";
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
  readonly #taskRunner = new TaskRunner();
  readonly #depMap = new DependencyMap<string, string>();
  #watcher?: chokidar.FSWatcher;

  constructor(options: WatcherOptions) {
    this.#baseDir = options.baseDir;
    this.#rules = options.rules;
  }

  launch(): void {
    if (this.#watcher) return;

    this.#watcher = chokidar.watch(["**/*"], {
      cwd: this.#baseDir,
    });

    this.#taskRunner.launch();

    this.#watcher.on("all", (eventName, pathname) => {
      switch (eventName) {
        case "add":
        case "change": {
          this.#runRules(pathname);
          this.#depMap.getSources(pathname)?.forEach((source) => {
            this.#runRules(source);
          });
          break;
        }

        case "unlink": {
          this.#depMap.set(pathname, []);
          this.#depMap.getSources(pathname)?.forEach((source) => {
            this.#runRules(source);
          });
          break;
        }
      }
    });
  }

  #runRules(pathname: string): void {
    for (const rule of this.#rules) {
      if (
        anymatch(rule.include, pathname) &&
        !anymatch(rule.exclude, pathname)
      ) {
        log(
          `${chalk.blue.bold("run")}${chalk.dim(`(${rule.name})`)} ${pathname}`
        );

        const task = rule.createTask(pathname);
        task.reportDependencies = (dependencies) => {
          this.#depMap.set(pathname, dependencies);
        };

        this.#taskRunner.offer(task);
        break;
      }
    }
  }
}
