import sass from "sass";

/**
 * @param {string} code
 * @param {object} [options]
 * @param {readonly string[]} [options.loadPaths]
 */
export const processSass = async (code, { loadPaths } = {}) => {
  const compiled = await sass.compileStringAsync(code, {
    loadPaths,
    sourceMap: process.env.NODE_ENV != "production",
    sourceMapIncludeSources: true,
  });

  return {
    code: compiled.css,
    map: compiled.sourceMap,
    dependencies: compiled.loadedUrls,
  }
}
