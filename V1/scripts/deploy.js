const { ethers } = require("hardhat");

async function main() {
  // Base Goerli测试网USDC地址（需要替换为实际的USDC地址）
  const USDC_ADDRESS = "0x176211869cA2b568f2A7D4EE941E073a821EE1ff"; // Base Goerli USDC
  
  // NFT元数据URI（IPFS或HTTP链接）
  const METADATA_URI = "https://your-metadata-uri.com/metadata/{id}.json";
  
  console.log("开始部署FootballBetting1155合约...");
  
  // 获取合约工厂
  const FootballBetting1155 = await ethers.getContractFactory("FootballBetting1155");
  
  // 部署合约
  const footballBetting = await FootballBetting1155.deploy(METADATA_URI, USDC_ADDRESS);
  
  await footballBetting.waitForDeployment();
  
  const contractAddress = await footballBetting.getAddress();
  
  console.log("FootballBetting1155合约部署成功!");
  console.log("合约地址:", contractAddress);
  console.log("USDC地址:", USDC_ADDRESS);
  console.log("元数据URI:", METADATA_URI);
  
  // 验证合约（可选）
  console.log("\n等待区块确认...");
  await new Promise(resolve => setTimeout(resolve, 30000)); // 等待30秒
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [METADATA_URI, USDC_ADDRESS],
    });
    console.log("合约验证成功!");
  } catch (error) {
    console.log("合约验证失败:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 