// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FootballBetting1155 is ERC1155, Ownable {
    // USDC合约地址
    IERC20 public usdc;
    // NFT价格（0.1 USDC，USDC通常6位小数）
    uint256 public constant NFT_PRICE = 1e5; // 0.1 USDC
    // 平台手续费（1%，100为1%）
    uint256 public feeRate = 100;
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public feeBalance;

    // 比分NFT信息
    struct ScoreInfo {
        uint256 matchId;
        string score; // 比如 "2:1"
        uint256 odds; // 赔率，乘以1000存储（如3.5倍存3500）
        uint256 saleEndTime; // 售卖截止时间（比赛开始前）
        bool exists;
    }
    // tokenId => ScoreInfo
    mapping(uint256 => ScoreInfo) public scoreInfos;
    // tokenId => 是否可mint
    mapping(uint256 => bool) public isMintable;

    // 市场订单结构
    struct Order {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerNFT; // 单价，单位USDC
        uint256 remaining;
        bool active;
    }
    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId;

    // 事件
    event ScoreNFTAdded(uint256 indexed tokenId, uint256 matchId, string score, uint256 odds, uint256 saleEndTime);
    event Mint(address indexed user, uint256 indexed tokenId, uint256 amount);
    event OrderCreated(uint256 indexed orderId, address indexed seller, uint256 tokenId, uint256 amount, uint256 pricePerNFT);
    event OrderCancelled(uint256 indexed orderId);
    event OrderFilled(uint256 indexed orderId, address indexed buyer, uint256 amount, uint256 totalPrice, uint256 fee);
    event FeeWithdrawn(address indexed to, uint256 amount);
    event USDCWithdrawn(address indexed to, uint256 amount);
    event FeeRateChanged(uint256 newFeeRate);

    constructor(string memory uri, address usdcAddress) ERC1155(uri) Ownable(msg.sender) {
        usdc = IERC20(usdcAddress);
    }

    // 管理员添加比分NFT
    function addScoreNFT(
        uint256 tokenId,
        uint256 matchId,
        string memory score,
        uint256 odds,
        uint256 saleEndTime
    ) external onlyOwner {
        require(!scoreInfos[tokenId].exists, "TokenId exists");
        scoreInfos[tokenId] = ScoreInfo(matchId, score, odds, saleEndTime, true);
        isMintable[tokenId] = true;
        emit ScoreNFTAdded(tokenId, matchId, score, odds, saleEndTime);
    }

    // 用户购买NFT（比赛开始前）
    function mint(uint256 tokenId, uint256 amount) external {
        require(isMintable[tokenId], "Not mintable");
        require(block.timestamp < scoreInfos[tokenId].saleEndTime, "Sale ended");
        uint256 totalCost = NFT_PRICE * amount;
        require(usdc.transferFrom(msg.sender, address(this), totalCost), "USDC transfer failed");
        _mint(msg.sender, tokenId, amount, "");
        emit Mint(msg.sender, tokenId, amount);
    }

    // 比赛开始后，管理员可关闭mint
    function closeMint(uint256 tokenId) external onlyOwner {
        isMintable[tokenId] = false;
    }

    // 市场：创建挂单
    function createOrder(uint256 tokenId, uint256 amount, uint256 pricePerNFT) external {
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient NFT balance");
        require(amount > 0, "Amount must be > 0");
        require(pricePerNFT > 0, "Price must be > 0");
        // 将NFT转到合约托管
        safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        orders[nextOrderId] = Order({
            seller: msg.sender,
            tokenId: tokenId,
            amount: amount,
            pricePerNFT: pricePerNFT,
            remaining: amount,
            active: true
        });
        emit OrderCreated(nextOrderId, msg.sender, tokenId, amount, pricePerNFT);
        nextOrderId++;
    }

    // 市场：取消挂单
    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.active, "Order inactive");
        require(order.seller == msg.sender, "Not seller");
        require(order.remaining > 0, "Order empty");
        uint256 refundAmount = order.remaining;
        order.active = false;
        order.remaining = 0;
        // NFT退还给卖家
        _safeTransferFrom(address(this), msg.sender, order.tokenId, refundAmount, "");
        emit OrderCancelled(orderId);
    }

    // 市场：购买NFT（支持部分购买）
    function buyOrder(uint256 orderId, uint256 amount) external {
        Order storage order = orders[orderId];
        require(order.active, "Order inactive");
        require(amount > 0 && amount <= order.remaining, "Invalid amount");
        uint256 totalPrice = order.pricePerNFT * amount;
        uint256 fee = (totalPrice * feeRate) / FEE_DENOMINATOR;
        uint256 sellerAmount = totalPrice - fee;
        // USDC转账
        require(usdc.transferFrom(msg.sender, address(this), totalPrice), "USDC transfer failed");
        require(usdc.transfer(order.seller, sellerAmount), "USDC to seller failed");
        feeBalance += fee;
        // NFT转给买家
        _safeTransferFrom(address(this), msg.sender, order.tokenId, amount, "");
        order.remaining -= amount;
        if (order.remaining == 0) {
            order.active = false;
        }
        emit OrderFilled(orderId, msg.sender, amount, totalPrice, fee);
    }

    // 管理员提取手续费
    function withdrawFee(address to) external onlyOwner {
        require(feeBalance > 0, "No fee");
        require(usdc.transfer(to, feeBalance), "USDC transfer failed");
        emit FeeWithdrawn(to, feeBalance);
        feeBalance = 0;
    }

    // 管理员提取合约USDC余额（不含手续费）
    function withdrawUSDC(address to, uint256 amount) external onlyOwner {
        require(usdc.balanceOf(address(this)) >= amount + feeBalance, "Insufficient balance");
        require(usdc.transfer(to, amount), "USDC transfer failed");
        emit USDCWithdrawn(to, amount);
    }

    // 管理员设置手续费比例（如100为1%）
    function setFeeRate(uint256 newFeeRate) external onlyOwner {
        require(newFeeRate <= 1000, "Fee too high"); // 最大10%
        feeRate = newFeeRate;
        emit FeeRateChanged(newFeeRate);
    }

    // OpenSea等外部市场兼容
    function setApprovalForAll(address operator, bool approved) public override {
        super.setApprovalForAll(operator, approved);
    }

    // 必须实现ERC1155Receiver接口
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
} 