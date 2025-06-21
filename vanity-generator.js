const { ethers } = require("ethers");

const targetSuffix = "999".toLowerCase();

let attempts = 0;

console.log("🔍 Đang tìm ví có địa chỉ kết thúc bằng:", targetSuffix);

while (true) {
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address.toLowerCase();

    attempts++;

    if (address.endsWith(targetSuffix)) {
        console.log("\n🎉 Tìm thấy địa chỉ phù hợp!");
        console.log("Địa chỉ:", address);
        console.log("Private Key:", wallet.privateKey);
        console.log("Số lần thử:", attempts);
        break;
    }

    if (attempts % 10000 === 0) {
        console.log("Đã thử:", attempts, "ví...");
    }
}
