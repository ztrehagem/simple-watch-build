export interface TaskResult {
  dependencies: readonly string[];
}

export interface Task {
  run(): Promise<TaskResult>;
}
