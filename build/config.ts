import * as path from "node:path";
import { PugTask } from "./tasks/pug.js";
import { SassTask } from "./tasks/sass.js";
import { Rule } from "./types/rule.js";

export const srcDir = path.resolve("src");
export const outDir = path.resolve("dist");

export const rules: readonly Rule[] = [
  {
    name: "pug",
    include: ["**/*.pug"],
    exclude: ["**/_*", "**/_*/**/*"],
    createTask: (pathname) => {
      const srcPath = path.resolve(srcDir, pathname);
      const outPath = path.resolve(outDir, pathname).replace(/\.pug$/, ".html");
      return new PugTask({ srcDir, srcPath, outPath });
    },
  },
  {
    name: "sass",
    include: ["**/*.s[ac]ss"],
    exclude: ["**/_*", "**/_*/**/*"],
    createTask: (pathname) => {
      const srcPath = path.resolve(srcDir, pathname);
      const outPath = path.resolve(outDir, pathname).replace(/\.s[ac]ss$/, ".css");
      return new SassTask({ srcDir, srcPath, outPath });
    },
  },
];
