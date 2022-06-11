const now = () => new Date().toLocaleTimeString();

/**
 * @param {*} subject
 */
export const log = (subject) => {
  console.log(`[${now()}] ${subject}`);
}

/**
 * @param {*} subject
 */
export const logWarn = (subject) => {
  console.warn(`[${now()}]WARN: ${subject}`);
}

/**
 * @param {*} subject
 */
export const logError = (subject) => {
  console.error(`[${now()}]ERROR: ${subject}`);
}
