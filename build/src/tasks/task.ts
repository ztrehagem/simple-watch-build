export interface Task {
  reportDependencies?: (dependencies: readonly string[]) => void;
  run(): Promise<void>;
}
