import postcss from "postcss";
import autoprefixer from "autoprefixer";

/**
 *
 * @param {string} code
 * @param {object} options
 * @param {string} options.srcPath
 * @param {import("source-map-js").RawSourceMap} [options.map]
 */
export const processPostcss = async (code, { srcPath, map }) => {
  const result = await postcss([
    autoprefixer({ grid: "autoplace" }),
  ]).process(code, {
    from: srcPath,
    map: map
      ? { prev: map, inline: true }
      : false,
  });

  return {
    code: result.css,
    map: result.map?.toJSON(),
  }
}
