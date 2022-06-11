export abstract class Task {
  setDependencies: (dependencies: readonly string[]) => void = () => {
    void 0;
  };

  abstract run(): Promise<void>;
}
