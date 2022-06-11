import chalk from "chalk";

const now = () => new Date().toLocaleTimeString();
const time = () => chalk.dim(`[${now()}]`);

/**
 * @param {*} subject
 */
export const log = (subject) => {
  console.log(`${time()} ${subject}`);
}

/**
 * @param {*} subject
 */
export const logWarn = (subject) => {
  console.warn(`${time()} ${chalk.bgYellow.bold(" WARN ")} ${subject}`);
}

/**
 * @param {*} subject
 */
export const logError = (subject) => {
  console.error(`${time()} ${chalk.bgRed.bold(" ERROR ")} ${subject}`);
}
