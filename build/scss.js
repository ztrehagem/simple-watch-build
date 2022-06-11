const path = require("node:path");
const fs = require("node:fs/promises");
const sass = require("sass");
const { default: postcss } = require("postcss");
const autoprefixer = require("autoprefixer");
const { glob } = require("./utils");

(async () => {
  const baseDir = path.resolve(__dirname, "../src");
  const outDir = path.resolve(__dirname, "../dist");
  const entries = await glob(["**/*.scss", "!**/_*"], { cwd: baseDir });

  const results = await Promise.allSettled(
    entries.map(async (entry) => {
      const srcPath = path.resolve(baseDir, entry);
      const outPath = path
        .resolve(outDir, entry)
        .replace(/\.scss$/, ".css");

      let compiled;

      try {
        compiled = await sass.compileAsync(srcPath, {
          loadPaths: [baseDir],
          sourceMap: process.env.NODE_ENV != "production",
          sourceMapIncludeSources: true,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }

      let processed;

      try {
        processed = await postcss([
          autoprefixer({ grid: "autoplace" }),
        ]).process(compiled.css, {
          from: srcPath,
          map: compiled.sourceMap
            ? { prev: compiled.sourceMap, inline: true }
            : false,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }

      try {
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, processed.css);
      } catch (error) {
        console.error(error);
        throw error;
      }

      console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
    }),
  );

  const resolved = results.filter((result) => result.status == "fulfilled");
  const rejected = results.filter((result) => result.status == "rejected");

  console.log(`wrote: ${resolved.length}, error: ${rejected.length}`);

  if (rejected.length) {
    process.exit(1);
  }
})();
