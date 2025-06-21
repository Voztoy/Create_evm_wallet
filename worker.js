const { workerData, parentPort } = require('worker_threads');
const { Wallet, randomBytes, hexlify } = require('ethers'); // ethers v6

const target = workerData.targetSuffix.toLowerCase();
let attempts = 0;
let totalAttempts = 0;
const start = Date.now();

function sendProgress() {
  const now = Date.now();
  const elapsed = (now - start) / 1000;
  const speed = totalAttempts / elapsed;

  parentPort.postMessage({
    type: 'progress',
    count: attempts,
    speed: Math.round(speed),
    elapsed: Math.round(elapsed)
  });

  totalAttempts += attempts;
  attempts = 0;
}

setInterval(sendProgress, 1000);

while (true) {
  const privateKeyBytes = randomBytes(32);
  const privateKeyHex = hexlify(privateKeyBytes); // ✅ chuyển sang hex
  const wallet = new Wallet(privateKeyHex);       // ✅ tạo Wallet từ hex
  const address = wallet.address.slice(2).toLowerCase();
  attempts++;

  if (address.endsWith(target)) {
    totalAttempts += attempts;
    const elapsed = (Date.now() - start) / 1000;
    const speed = totalAttempts / elapsed;

    parentPort.postMessage({
      type: 'result',
      address: wallet.address,
      privateKey: wallet.privateKey,
      attempts: totalAttempts,
      elapsed: elapsed.toFixed(2),
      speed: Math.round(speed)
    });
    break;
  }
}
