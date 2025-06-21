// benchmark.js
const { Wallet } = require('ethers');
const crypto = require('crypto');

let count = 0;
const start = Date.now();
while (Date.now() - start < 1000) {
  const pk = '0x' + crypto.randomBytes(32).toString('hex');
  new Wallet(pk);
  count++;
}
console.log(`✅ Benchmark: ${count.toLocaleString()} ví/s`);
