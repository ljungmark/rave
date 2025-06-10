const rave = async (entries) => {
    /* Determine how many network requests are required to load all of the requested entries.

       The initial page load contain 15 check-ins.
       Each subsequent request for more check-ins contains 15 additional entries.

       Expected results:
       entries | result
       1         0
       15        0
       16        1
       30        1
       31        2
       45        2
       46        3, etc. */
    const requests = Math.floor((entries - 1) / 15);
};

/* Throttle actions to protect against rate limit thresholds. */
const throttle = ms => new Promise(resolve => setTimeout(resolve, ms));
