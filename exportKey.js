const { Wallet } = require("ethers");

// 用你的助记词替换下面这行
const mnemonic = "这里填你的12或24个英文单词，用空格分隔";

const wallet = Wallet.fromPhrase(mnemonic);


console.log("0x开头的私钥是：", wallet.privateKey);