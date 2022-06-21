const { default: chalk } = await import("chalk");

const now = () => new Date().toLocaleTimeString();
const time = () => chalk.dim(`[${now()}]`);

export const log = (subject: unknown): void => {
  console.log(`${time()} ${String(subject)}`);
};

export const logWarn = (subject: unknown): void => {
  console.warn(`${time()} ${chalk.bgYellow.bold(" WARN ")} ${String(subject)}`);
};

export const logError = (subject: unknown): void => {
  console.error(`${time()} ${chalk.bgRed.bold(" ERROR ")} ${String(subject)}`);
};
