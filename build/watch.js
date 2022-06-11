import * as path from "node:path";
import { PugTask } from "./tasks/pug.js";
import { ScssTask } from "./tasks/scss.js";
import { Watcher } from "./watch/watcher.js";

const srcDir = path.resolve("src");
const outDir = path.resolve("dist");

const rules = [
  {
    name: "pug",
    include: "**/*.pug",
    exclude: "**/_*",
    createTask: (pathname) => {
      const srcPath = path.resolve(srcDir, pathname);
      const outPath = path.resolve(outDir, pathname);
      return new PugTask({ srcDir, srcPath, outPath });
    },
  },
  {
    name: "scss",
    include: "**/*.scss",
    exclude: "**/_*",
    createTask: (pathname) => {
      const srcPath = path.resolve(srcDir, pathname);
      const outPath = path.resolve(outDir, pathname);
      return new ScssTask({ srcDir, srcPath, outPath });
    },
  },
];

const watcher = new Watcher({ baseDir: srcDir, rules });

watcher.launch();
