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

const rally = async () => {
    /* The button doesn't disappear at the end of the list,
       but is hidden. So this is to evaluate if the button
       is visible (to continue) or not (to stop). */
    while (window.getComputedStyle(document.querySelector('.more_friends')).display !== 'none') {
        await throttle(2000);
        document.querySelector('.more_friends').click();
    }

    const sensors = document.querySelectorAll('.addFriend');
    /* Produces an array with the uids.

       Expected results:
       [
          '<a class="addFriend" href="#" uid="1">',
          '<a class="addFriend" href="#" uid="2">',
          '<a class="addFriend" href="#" uid="3">'
       ]
       ...becomes...
       [1, 2, 3] */
    const uids = Array.from(sensors, sensor => sensor.dataset.uid);

    store(uids);
};

/* In order to save the array in a file, add a link in the DOM
   to a blob containing the array. This allows for the data to
   be downloaded. */
const store = async (uids, filename = 'uids.txt') => {
    const blob = new Blob([uids], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(a);
    link.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(link.href);
}

rally();
