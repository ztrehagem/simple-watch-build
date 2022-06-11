import * as chokidar from "chokidar";
import anymatch from "anymatch";
import { TaskRunner } from "./task_runner.js";

export class Watcher {
  #baseDir;
  #rules;
  #watcher;

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

    const taskRunner = new TaskRunner();
    taskRunner.launch();

    this.#watcher.on("all", (eventName, pathname, stats) => {
      switch (eventName) {
        case "add":
        case "change": {
          for (const rule of this.#rules) {
            if (
              anymatch(rule.include, pathname) &&
              !anymatch(rule.exclude, pathname)
            ) {
              console.log(`[${rule.name}] ${pathname}`);
              const task = rule.createTask(pathname);
              taskRunner.offer(task);
              break;
            }
          }
          break;
        }
      }
    });
  }
}
