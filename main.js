const os = require('os');
const { Worker } = require('worker_threads');

const targetSuffix = '9999'; // ← sửa chuỗi tùy thích
const numThreads = os.cpus().length;

console.log(`🔧 Đang sử dụng ${numThreads} luồng để tìm địa chỉ có đuôi "${targetSuffix}"`);

for (let i = 0; i < numThreads; i++) {
  const worker = new Worker('./worker.js', {
    workerData: { targetSuffix }
  });

  worker.on('message', (data) => {
    console.log('\n🎯 Đã tìm thấy ví phù hợp!');
    console.log('Địa chỉ:', data.address);
    console.log('Private Key:', data.privateKey);
    console.log('Số lần thử:', data.attempts);
    process.exit(0); // Dừng tất cả khi đã tìm thấy
  });

  worker.on('error', (err) => {
    console.error('Worker lỗi:', err);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker thoát với mã lỗi: ${code}`);
    }
  });
}
