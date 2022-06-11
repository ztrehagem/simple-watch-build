import * as chokidar from "chokidar";

/**
 * @param {string | string[]} patterns Glob patterns to pass chokidar
 * @param {object} options
 * @param {string} [options.cwd] base directory path for glob patterns
 * @returns {Promise<string[]>} matched paths
 */
export const glob = async (patterns, options = {}) => {
  const watcher = chokidar.watch(patterns, {
    cwd: options.cwd,
    persistent: false
  })

  /** @type {string[]} */
  const matches = []

  watcher.on('add', (path, stats) => {
    matches.push(path)
  })

  return new Promise((resolve, reject) => {
    watcher.on('ready', () => resolve(matches))
    watcher.on('error', (error) => reject(error))
  })
}
