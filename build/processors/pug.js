import pug from "pug";

/**
 * @param {string} code
 * @param {object} [options]
 * @param {readonly string[]} [options.baseDir]
 */
export const processPug = (code, { baseDir } = {}) => {
  const result = pug.compileClientWithDependenciesTracked(code, {
    basedir: baseDir,
  });

  return {
    code: result.body,
    dependencies: result.dependencies,
  }
}
