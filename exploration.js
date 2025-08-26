const earned_total = 6_633;
const pool_beer = 15_013;
const pool_venue = 4_512;
const pool_special = 3_586;
const earned_beer = 4_692;
const earned_venue = 438;
const earned_special = 877;

const pool_non_local = pool_beer + pool_venue + pool_special;
const earned_non_local = earned_beer + earned_venue + earned_special;
const earned_local = earned_total - earned_non_local;

const pool_total = pool_non_local + earned_local;

console.log(earned_local);
console.log(pool_non_local);
console.log(earned_total / pool_total);
