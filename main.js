const os = require('os');
const { Worker } = require('worker_threads');
const fs = require('fs');

const targetSuffix = '99999'; // <- Thay đổi đuôi ví tại đây
const numThreads = os.cpus().length;
const suffixLength = targetSuffix.length;
const probability = Math.pow(16, suffixLength);
let totalAttempts = 0;
let startTime = Date.now();

console.log(`📍 Tìm ví có đuôi "${targetSuffix}"`);
console.log(`🧮 Xác suất trúng: (1/16)^${suffixLength} = 1/${probability.toLocaleString()}`);
console.log(`💻 Sử dụng ${numThreads} luồng CPU...\n`);

const workers = [];

for (let i = 0; i < numThreads; i++) {
  const worker = new Worker('./worker.js', {
    workerData: { targetSuffix }
  });

  worker.on('message', (data) => {
    if (data.type === 'progress') {
      totalAttempts += data.count;
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      process.stdout.write(
        `\r⏱️ ${elapsedSeconds}s | 🔁 Đã thử: ${totalAttempts.toLocaleString()} ví | ⚡ Tốc độ: ${data.speed.toLocaleString()} ví/s`
      );
    } else if (data.type === 'result') {
      const { address, privateKey, attempts, elapsed, speed } = data;

      console.log(`\n\n🎉 Tìm thấy địa chỉ phù hợp sau ${attempts.toLocaleString()} lần thử!`);
      console.log(`⏱️ Thời gian: ${elapsed}s | ⚡ Tốc độ trung bình: ${speed.toLocaleString()} ví/s`);
      console.log(`📬 Address: ${address}`);
      console.log(`🔐 Private Key: ${privateKey}`);

      const content = `Address: ${address}\nPrivate Key: ${privateKey}\n-------------------------\n`;
      fs.appendFileSync('wallet.txt', content, 'utf8');
      console.log('💾 Đã lưu ví vào file wallet.txt');

      for (const w of workers) w.terminate();
      process.exit(0);
    }
  });

  workers.push(worker);
}
