import * as path from "node:path";
import { PugTask } from "./tasks/pug.js";
import { ScssTask } from "./tasks/scss.js";

export const srcDir = path.resolve("src");
export const outDir = path.resolve("dist");

export const rules = [
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
    name: "scss",
    include: ["**/*.scss"],
    exclude: ["**/_*", "**/_*/**/*"],
    createTask: (pathname) => {
      const srcPath = path.resolve(srcDir, pathname);
      const outPath = path.resolve(outDir, pathname).replace(/\.scss$/, ".css");
      return new ScssTask({ srcDir, srcPath, outPath });
    },
  },
];
