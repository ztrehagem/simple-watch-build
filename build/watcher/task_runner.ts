import { Task } from "../tasks/task.js";
import { logWarn } from "../utils/log.js";

export class TaskRunner {
  readonly #it = new TaskIterator();

  offer(task: Task): void {
    this.#it.push(task);
  }

  launch(): void {
    void this.#start().then(() => {
      logWarn("TaskRunner terminated.");
    });
  }

  async #start(): Promise<void> {
    for await (const task of this.#it) {
      await task.run().catch(() => {
        /* Ignore rejection to continue running tasks */
      });
    }
  }
}

// TODO: 並列化
class TaskIterator {
  readonly #queue: Task[] = [];
  readonly #eventHub = new EventTarget();

  push(task: Task): void {
    this.#queue.push(task);
    const event = new Event("pushed");
    this.#eventHub.dispatchEvent(event);
  }

  async #poll(): Promise<Task> {
    const top = this.#queue.shift();

    if (top) {
      return top;
    }

    return await new Promise((resolve) => {
      this.#eventHub.addEventListener(
        "pushed",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        () => resolve(this.#queue.shift()!),
        { once: true }
      );
    });
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Task, void, void> {
    while (true) {
      yield await this.#poll();
    }
  }
}
