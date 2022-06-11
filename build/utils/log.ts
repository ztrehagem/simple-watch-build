const { default: chalk } = await import("chalk");

const now = () => new Date().toLocaleTimeString();
const time = () => chalk.dim(`[${now()}]`);

export const log = (subject: unknown) => {
  console.log(`${time()} ${subject}`);
};

export const logWarn = (subject: unknown) => {
  console.warn(`${time()} ${chalk.bgYellow.bold(" WARN ")} ${subject}`);
};

export const logError = (subject: unknown) => {
  console.error(`${time()} ${chalk.bgRed.bold(" ERROR ")} ${subject}`);
};
