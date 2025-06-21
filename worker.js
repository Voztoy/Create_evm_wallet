const { workerData, parentPort } = require('worker_threads');
const { ethers } = require('ethers');

const target = workerData.targetSuffix.toLowerCase();
let attempts = 0;

while (true) {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address.toLowerCase();

  attempts++;

  if (address.endsWith(target)) {
    parentPort.postMessage({
      address,
      privateKey: wallet.privateKey,
      attempts
    });
    break;
  }

  // In ra số lần thử mỗi 100k lần để debug (tuỳ chọn)
  if (attempts % 100000 === 0) {
    console.log(`Worker ${process.pid} đã thử ${attempts} lần`);
  }
}
