const { parentPort } = require('worker_threads');
const { ethers } = require('ethers');

let attempts = 0;

// Hàm kiểm tra pattern: ví dụ '333555', 'aaa888', 'dddeee'
function isTailPattern(addr) {
  const tail = addr.slice(-6); // lấy 6 ký tự cuối
  // Kiểm tra dạng aaabbb
  return (
    tail[0] === tail[1] &&
    tail[1] === tail[2] &&
    tail[3] === tail[4] &&
    tail[4] === tail[5] &&
    tail[0] !== tail[3] // a ≠ b
  );
}

while (true) {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address.slice(2).toLowerCase(); // bỏ "0x"

  attempts++;

  if (isTailPattern(address)) {
    parentPort.postMessage({
      address: '0x' + address,
      privateKey: wallet.privateKey,
      attempts
    });
    break;
  }

  if (attempts % 100000 === 0) {
    console.log(`Worker ${process.pid} đã thử ${attempts} lần`);
  }
}
