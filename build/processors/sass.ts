import sass from "sass";
import { RawSourceMap } from "source-map-js";

export interface ProcessSassOptions {
  loadPaths?: readonly string[];
}

export interface ProcessSassResult {
  code: string;
  map?: RawSourceMap;
  dependencies: URL[];
}

export const processSass = async (
  code: string,
  options: ProcessSassOptions = {}
): Promise<ProcessSassResult> => {
  const compiled = await sass.compileStringAsync(code, {
    loadPaths: options.loadPaths,
    sourceMap: process.env.NODE_ENV != "production",
    sourceMapIncludeSources: true,
  });

  return {
    code: compiled.css,
    map: compiled.sourceMap,
    dependencies: compiled.loadedUrls,
  };
};
