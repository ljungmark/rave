const buffer = async (requests, allowance = 3) => {
    for (let iteration = 1; iteration <= requests; iteration++) {
        const pagination = document.querySelector('.more_checkins');
        if (!pagination) {
            console.error('No pagination options were found.');
            break;
        }

        await throttle(2000);
        let probes = 0;
        let progression = false;

        while (probes < allowance && !progression) {
            try {
                pagination.click();
                progression = true;
                console.log(`Batch ${iteration}/${requests} requested.`);
            } catch (error) {
                probes++;

                console.error(`Attempt ${probes} failed:`, error);

                if (probes >= allowance) {
                    console.error('Allowance exhausted. Terminating.');
                    break;
                }

                await throttle(1000);
            }
        }

        if (!progression) {
            console.warn('Buffering was unsuccessful.');
            break;
        }
    }

    console.info('Buffer directive completed.');
};

const rave = async (entries = 15) => {
    /* Determine how many network requests are required to load all of the requested entries.

       The initial page load contain 15 check-ins.
       Each subsequent request for more check-ins contains 15 additional entries.

       Expected results:
       entries | requests
       1         0
       15        0
       16        1
       30        1
       31        2
       45        2
       46        3, etc. */
    const requests = Math.floor((entries - 1) / 15);
    console.info(`Will buffer ${requests} network requests.`)

    await buffer(requests);
};

/* Throttle actions to protect against rate limit thresholds. */
const throttle = (base = 1000) => {
    /* Randomize a number based on the `base` argument, +/- 1000.
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

rave(60);
