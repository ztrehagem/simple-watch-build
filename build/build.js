import { Builder } from "./builder.js";
import { srcDir, rules } from "./config.js";

const builder = new Builder({ baseDir: srcDir, rules });

try {
  await builder.run();
} catch (error) {
  process.exit(1);
}
