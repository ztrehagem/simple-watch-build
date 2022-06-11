import pug from "pug";

/**
 * @param {string} code
 * @param {object} [options]
 * @param {string} [options.filename]
 * @param {readonly string[]} [options.baseDir]
 */
export const processPug = (code, { filename, baseDir } = {}) => {
  const result = pug.compileClientWithDependenciesTracked(code, {
    filename,
    basedir: baseDir,
  });

  const renderFunction = new Function("locals", `${result.body}return template(locals);`);

  const html = renderFunction();

  return {
    code: html,
    dependencies: result.dependencies,
  };
};
