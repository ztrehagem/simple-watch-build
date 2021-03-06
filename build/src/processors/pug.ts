import pug from "pug";

export interface ProcessPugOptions {
  filename?: string;
  baseDir?: string;
}

export interface ProcessPugResult {
  code: string;
  dependencies: string[];
}

export const processPug = (
  code: string,
  options: ProcessPugOptions = {}
): ProcessPugResult => {
  const result = pug.compileClientWithDependenciesTracked(code, {
    filename: options.filename,
    basedir: options.baseDir,
  });

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const renderFunction = new Function(
    "locals",
    `${result.body}return template(locals);`
  ) as () => string;

  const html = renderFunction();

  return {
    code: html,
    dependencies: result.dependencies,
  };
};
