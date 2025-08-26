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
    const min = Math.max(500, base - 500);
    const max = base + 1000;
    const delay =  Math.floor(Math.random() * (max - min + 1)) + min;

    return new Promise(resolve => setTimeout(resolve, delay));
}

const rave = async (entries = 15) => {
    /* Determine how many network requests are required to load all of the requested entries.

       The initial page load contain 15 check-ins.
       Each subsequent request for more check-ins contains 15 additional entries.

       Expected results:
       entries | requests
       -1        0
       1         0
       15        0
       16        1
       30        1
       31        2
       45        2
       46        3, etc. */
    const requests = Math.max(0, Math.floor((entries - 1) / 15));
    console.info(`Will buffer ${requests} network requests.`);

    await buffer(requests);
    await throttle(2000);

    let probes = 0;
    const allowance = 6;
    let sensors = [];

    while (probes < allowance) {
        /* Array.from() returns a NodeList, which has the .slice() method on it. */
        sensors = Array.from(document.querySelectorAll('.toast_btn .toast:not(.active)'));

        /* If enough sensors are available, continue.
           Otherwise, perform another buffer run. */
        if (sensors.length >= entries) {
            break;
        }

        console.warn(`Only found ${sensors.length}/${entries} sensors. Buffering more... (Attempt ${probes + 1}/${allowance})`);
        await buffer(1);
        probes++;
    }

    if (probes >= allowance) {
        console.warn(`Could not fetch enough sensors after ${allowance} attempts. Proceeding with what was found.`);
    }

    toast(sensors.slice(0, entries));
};

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
                console.info(`Batch ${iteration}/${requests} requested.`);
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

const toast = async (sensors) => {
    const volume = sensors.length;
    for (let iteration = 1; iteration <= volume; iteration++) {
        /* Every fifth stimuli, throttle by ~5000ms, otherwise
           throttle for ~1000ms. This is to not breach rate limit
           thresholds. */
        const delay = iteration % 5 === 0 ? 1000 : 500;
        await throttle(delay);

        try {
            sensors[iteration-1].click();
            console.info(`Toasted ${iteration}/${volume}!`);
        } catch (error) {
            console.error(`Failed to toast ${iteration}/${volume}:`, error);
        }
    }

    console.info(`Toast directive completed.`);
};

rave(400);
