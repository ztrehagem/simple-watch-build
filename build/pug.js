import * as path from "node:path";
import * as fs from "node:fs/promises";
import pug from "pug";
import { glob } from "./utils.js";

(async () => {
  const baseDir = path.resolve("src");
  const outDir = path.resolve("dist");
  const entries = await glob(["**/*.pug", "!**/_*"], { cwd: baseDir });

  const results = await Promise.allSettled(
    entries.map(async (entry) => {
      const srcPath = path.resolve(baseDir, entry);
      const outPath = path.resolve(outDir, entry).replace(/\.pug$/, ".html");

      const rendered = pug.renderFile(srcPath);

      try {
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, rendered);
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
