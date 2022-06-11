import * as chokidar from "chokidar";

export interface GlobOptions {
  cwd?: string;
}

export const glob = async (
  patterns: string | string[],
  options: GlobOptions = {}
): Promise<string[]> => {
  const watcher = chokidar.watch(patterns, {
    cwd: options.cwd,
    persistent: false,
  });

  const matches: string[] = [];

  watcher.on("add", (path) => {
    matches.push(path);
  });

  return new Promise((resolve, reject) => {
    watcher.on("ready", () => resolve(matches));
    watcher.on("error", (error) => reject(error));
  });
};
