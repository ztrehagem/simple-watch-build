import * as chokidar from "chokidar";
import anymatch from "anymatch";
import { TaskRunner } from "./task_runner.js";
import { DependencyMap } from "./dependency_map.js";
import { log } from "../log.js";

export class Watcher {
  #baseDir;
  #rules;
  /** @type {chokidar.FSWatcher?} */
  #watcher;
  #taskRunner = new TaskRunner();
  #depMap = new DependencyMap();

  constructor({ baseDir, rules }) {
    this.#baseDir = baseDir;
    this.#rules = rules;
    this.#watcher = null;
  }

  launch() {
    if (this.#watcher) return;

    this.#watcher = chokidar.watch(["**/*"], {
      cwd: this.#baseDir,
    });

    this.#taskRunner.launch();

    this.#watcher.on("all", (eventName, pathname, stats) => {
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
          this.#depMap.getSources(pathname)?.forEach((source) => {
            this.#runRules(source);
          });
          break;
        }
      }
    });
  }

  /**
   * @param {string} pathname
   */
  #runRules(pathname) {
    for (const rule of this.#rules) {
      if (
        anymatch(rule.include, pathname) &&
        !anymatch(rule.exclude, pathname)
      ) {
        log(`run(${rule.name}) ${pathname}`);

        const task = rule.createTask(pathname);
        task.setDependencies = (dependencies) => {
          this.#depMap.set(pathname, dependencies);
        };

        this.#taskRunner.offer(task);
        break;
      }
    }
  }
}
