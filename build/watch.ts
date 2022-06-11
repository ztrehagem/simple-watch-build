import { Watcher } from "./watcher/watcher.js";
import { srcDir, rules } from "./config.js";

const watcher = new Watcher({ baseDir: srcDir, rules });

watcher.launch();
