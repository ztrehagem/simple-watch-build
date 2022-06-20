import { default as postcss } from "postcss";
import autoprefixer from "autoprefixer";
import { RawSourceMap } from "source-map-js";

export interface ProcessPostcssOptions {
  srcPath: string;
  map?: RawSourceMap;
}

export interface ProcessPostcssResult {
  code: string;
  map?: RawSourceMap;
}

export const processPostcss = async (
  code: string,
  options: ProcessPostcssOptions
): Promise<ProcessPostcssResult> => {
  const result = await postcss([autoprefixer({ grid: "autoplace" })]).process(
    code,
    {
      from: options.srcPath,
      map: options.map ? { prev: options.map, inline: true } : false,
    }
  );

  return {
    code: result.css,
    map: result.map?.toJSON(),
  };
};
