/* Throttle actions to protect against threshold limits. */
const throttle = ms => new Promise(resolve => setTimeout(resolve, ms));
