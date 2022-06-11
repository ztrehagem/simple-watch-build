import { logWarn } from "../utils/log.js";

export class TaskRunner {
  #it = new TaskIterator();

  offer(task) {
    this.#it.push(task);
  }

  launch() {
    void this.#start().then(() => {
      logWarn("TaskRunner terminated.");
    });
  }

  async #start() {
    for await (const task of this.#it) {
      await task.run().catch(() => {
        /* Ignore rejection to continue running tasks */
      });
    }
  }
}

// TODO: 並列化
class TaskIterator {
  #queue = [];
  #eventHub = new EventTarget();

  push(task) {
    this.#queue.push(task);
    const event = new Event("pushed");
    this.#eventHub.dispatchEvent(event);
  }

  async #poll() {
    if (this.#queue.length) {
      return this.#queue.shift();
    }

    return await new Promise((resolve) => {
      this.#eventHub.addEventListener(
        "pushed",
        () => resolve(this.#queue.shift()),
        { once: true }
      );
    });
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      yield await this.#poll();
    }
  }
}
