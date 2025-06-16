/* Throttle actions to protect against rate limit thresholds. */
const throttle = (base = 1000) => {
    /* Emulate human imprecision by generating a number with a random element,
       yet within a restricted range. The number is based on the `base` argument, +/- 1000.
       The value will never go below 1000.

       Expected results:
       base | delay
       50     1000-1050
       500    1000-1500
       1000   1000-2000
       1500   1000-2500
       2000   1000-3000
       3000   2000-4000
       5000   4000-60000, etc. */
    const min = Math.max(1000, base - 1000);
    const max = base + 1000;
    const delay =  Math.floor(Math.random() * (max - min + 1)) + min;

    return new Promise(resolve => setTimeout(resolve, delay));
}
