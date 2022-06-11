export abstract class Task {
  setDependencies = (dependencies: readonly string[]) => {}

  abstract run(): Promise<void>
}
