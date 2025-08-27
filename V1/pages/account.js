import { useState, useEffect } from 'react';
import { 
  User, 
  Wallet, 
  Trophy, 
  TrendingUp,
  TrendingDown,
  History,
  Settings,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Star,
  Award,
  Target,
  Crown,
  DollarSign,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  Activity,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react';
import Layout from '../components/Layout';
import { useWallet } from '../components/WalletContext';

export default function Account() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 使用钱包上下文获取真实的钱包状态
  const { isWalletConnected, walletAddress, formatAddress } = useWallet();

  const [accountData, setAccountData] = useState({
    balance: 0,
    nftHoldings: [],
    transactions: [],
    stats: {}
  });

  // 模拟数据
  useEffect(() => {
    const mockAccountData = {
      balance: 125.67,
      totalValue: 89.32,
      totalProfit: 23.45,
      profitPercentage: 18.7,
      nftHoldings: [
        {
          id: 1,
          type: 'score',
          name: 'Manchester City 2-1 Arsenal',
          category: '比分NFT',
          quantity: 5,
          avgPrice: 0.10,
          currentPrice: 0.12,
          profit: 0.10,
          profitPercentage: 20,
          status: 'active',
          matchDate: '2024-01-15'
        },
        {
          id: 2,
          type: 'special',
          name: 'Haaland 金靴',
          category: '特殊NFT',
          quantity: 2,
          avgPrice: 0.15,
          currentPrice: 0.18,
          profit: 0.06,
          profitPercentage: 20,
          status: 'active',
          matchDate: '2024-01-20'
        },
        {
          id: 3,
          type: 'score',
          name: 'Real Madrid 3-1 Barcelona',
          category: '比分NFT',
          quantity: 3,
          avgPrice: 0.12,
          currentPrice: 0.09,
          profit: -0.09,
          profitPercentage: -25,
          status: 'active',
          matchDate: '2024-01-18'
        },
        {
          id: 4,
          type: 'special',
          name: 'Manchester City 英超冠军',
          category: '特殊NFT',
          quantity: 1,
          avgPrice: 0.20,
          currentPrice: 0.25,
          profit: 0.05,
          profitPercentage: 25,
          status: 'active',
          matchDate: '2024-01-10'
        }
      ],
      transactions: [
        {
          id: 1,
          type: 'buy',
          item: 'Manchester City 2-1 Arsenal',
          quantity: 5,
          price: 0.10,
          total: 0.50,
          fee: 0.005,
          date: '2024-01-15 14:30',
          status: 'completed',
          hash: '0x1234...5678'
        },
        {
          id: 2,
          type: 'sell',
          item: 'Haaland 金靴',
          quantity: 1,
          price: 0.18,
          total: 0.18,
          fee: 0.0018,
          date: '2024-01-16 10:45',
          status: 'completed',
          hash: '0x2345...6789'
        },
        {
          id: 3,
          type: 'buy',
          item: 'Real Madrid 3-1 Barcelona',
          quantity: 3,
          price: 0.12,
          total: 0.36,
          fee: 0.0036,
          date: '2024-01-18 16:20',
          status: 'completed',
          hash: '0x3456...7890'
        },
        {
          id: 4,
          type: 'buy',
          item: 'Liverpool 1-3 Real Madrid',
          quantity: 3,
          price: 0.08,
          total: 0.24,
          fee: 0.0024,
          date: '2024-01-17 09:15',
          status: 'completed',
          hash: '0x4567...8901'
        }
      ],
      stats: {
        totalTrades: 12,
        successRate: 75,
        avgProfit: 0.08,
        bestTrade: 0.25,
        totalVolume: 2.45
      }
    };

    setAccountData(mockAccountData);
  }, []);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      // 这里可以添加一个toast提示
      console.log('地址已复制到剪贴板');
    }
  };

  const refreshData = () => {
    console.log('刷新账户数据');
  };

  const tabs = [
    { id: 'overview', name: '总览', icon: BarChart3 },
    { id: 'nfts', name: 'NFT持仓', icon: Trophy },
    { id: 'history', name: '交易记录', icon: History },
    { id: 'settings', name: '设置', icon: Settings }
  ];

  const filteredNFTs = accountData.nftHoldings.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || nft.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredTransactions = accountData.transactions.filter(tx =>
    tx.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 页面标题和钱包状态 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">我的账户</h1>
              <p className="text-[var(--text-secondary)]">管理您的资产和交易记录</p>
            </div>
            <button
              onClick={refreshData}
              className="minimal-btn minimal-btn-ghost"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* 钱包连接状态 */}
          {isWalletConnected ? (
            <div className="minimal-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--accent-green)]/10 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-[var(--accent-green)]" />
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">钱包已连接</div>
                    <div className="text-sm text-[var(--text-secondary)]">{formatAddress(walletAddress)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyAddress}
                    className="minimal-btn minimal-btn-ghost p-2"
                    title="复制地址"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(`https://sepolia.basescan.org/address/${walletAddress}`, '_blank')}
                    className="minimal-btn minimal-btn-ghost p-2"
                    title="在区块浏览器中查看"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="minimal-card p-6 text-center">
              <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-[var(--text-tertiary)]" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">未连接钱包</h3>
              <p className="text-[var(--text-secondary)] mb-4">请先连接钱包以查看账户信息</p>
            </div>
          )}
        </div>

        {/* 标签导航 */}
        <div className="minimal-card p-1 mb-8">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent-blue)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 标签内容 */}
        <div className="space-y-6">
          {/* 总览标签页 */}
          {activeTab === 'overview' && isWalletConnected && (
            <div className="space-y-6">
              {/* 资产概览卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="minimal-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--text-secondary)] text-sm">USDC余额</span>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">
                    {showBalance ? `${accountData.balance} USDC` : '****'}
                  </div>
                </div>

                <div className="minimal-card p-6">
                  <div className="text-[var(--text-secondary)] text-sm mb-2">NFT总价值</div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">
                    {showBalance ? `${accountData.totalValue} USDC` : '****'}
                  </div>
                </div>

                <div className="minimal-card p-6">
                  <div className="text-[var(--text-secondary)] text-sm mb-2">总盈亏</div>
                  <div className={`text-2xl font-bold ${
                    accountData.totalProfit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'
                  }`}>
                    {showBalance ? (
                      <>
                        {accountData.totalProfit >= 0 ? '+' : ''}{accountData.totalProfit} USDC
                      </>
                    ) : '****'}
                  </div>
                  <div className={`text-sm ${
                    accountData.profitPercentage >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'
                  }`}>
                    {accountData.profitPercentage >= 0 ? '+' : ''}{accountData.profitPercentage}%
                  </div>
                </div>

                <div className="minimal-card p-6">
                  <div className="text-[var(--text-secondary)] text-sm mb-2">NFT数量</div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">
                    {accountData.nftHoldings.length}
                  </div>
                </div>
              </div>

              {/* 交易统计 */}
              <div className="minimal-card p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">交易统计</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{accountData.stats.totalTrades}</div>
                    <div className="text-sm text-[var(--text-secondary)]">总交易次数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--accent-green)] mb-1">{accountData.stats.successRate}%</div>
                    <div className="text-sm text-[var(--text-secondary)]">成功率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{accountData.stats.avgProfit}</div>
                    <div className="text-sm text-[var(--text-secondary)]">平均盈利</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--accent-blue)] mb-1">{accountData.stats.bestTrade}</div>
                    <div className="text-sm text-[var(--text-secondary)]">最佳交易</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{accountData.stats.totalVolume}</div>
                    <div className="text-sm text-[var(--text-secondary)]">总交易量</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NFT持仓标签页 */}
          {activeTab === 'nfts' && isWalletConnected && (
            <div className="space-y-6">
              {/* 搜索和筛选 */}
              <div className="minimal-card p-4">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <input
                        type="text"
                        placeholder="搜索NFT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="minimal-input pl-10 w-full"
                      />
                    </div>
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="minimal-input"
                  >
                    <option value="all">全部类型</option>
                    <option value="score">比分NFT</option>
                    <option value="special">特殊NFT</option>
                  </select>
                </div>
              </div>

              {/* NFT列表 */}
              <div className="space-y-4">
                {filteredNFTs.map((nft, index) => (
                  <div
                    key={nft.id}
                    className="minimal-card p-6 animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center">
                          <Trophy className="w-8 h-8 text-[var(--accent-blue)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)] mb-1">{nft.name}</h3>
                          <div className="flex items-center space-x-3 text-sm text-[var(--text-secondary)]">
                            <span className="minimal-tag minimal-tag-primary">{nft.category}</span>
                            <span>数量: {nft.quantity}</span>
                            <span>平均价格: {nft.avgPrice} USDC</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                          {nft.currentPrice} USDC
                        </div>
                        <div className={`text-sm font-medium ${
                          nft.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'
                        }`}>
                          {nft.profit >= 0 ? '+' : ''}{nft.profit} USDC ({nft.profitPercentage >= 0 ? '+' : ''}{nft.profitPercentage}%)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 交易记录标签页 */}
          {activeTab === 'history' && isWalletConnected && (
            <div className="space-y-6">
              {/* 搜索 */}
              <div className="minimal-card p-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="搜索交易记录..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="minimal-input pl-10 w-full"
                  />
                </div>
              </div>

              {/* 交易记录列表 */}
              <div className="space-y-4">
                {filteredTransactions.map((tx, index) => (
                  <div
                    key={tx.id}
                    className="minimal-card p-6 animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          tx.type === 'buy' 
                            ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                            : 'bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
                        }`}>
                          {tx.type === 'buy' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)] mb-1">{tx.item}</h3>
                          <div className="flex items-center space-x-3 text-sm text-[var(--text-secondary)]">
                            <span>{tx.date}</span>
                            <span>•</span>
                            <span>数量: {tx.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`minimal-tag ${
                            tx.type === 'buy' ? 'minimal-tag-success' : 'minimal-tag-danger'
                          }`}>
                            {tx.type === 'buy' ? '买入' : '卖出'}
                          </span>
                          <span className="minimal-tag minimal-tag-secondary">
                            {tx.status === 'completed' ? '已完成' : '处理中'}
                          </span>
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-[var(--text-primary)]">{tx.quantity} × {tx.price} USDC</p>
                          <p className="text-[var(--text-secondary)]">总计: {tx.total} USDC</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 设置标签页 */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="minimal-card p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">隐私设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">隐藏余额</p>
                      <p className="text-sm text-[var(--text-secondary)]">在总览页面隐藏资产余额</p>
                    </div>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        showBalance ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--accent-blue)]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          showBalance ? 'translate-x-1' : 'translate-x-7'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="minimal-card p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">数据管理</h3>
                <div className="space-y-4">
                  <button className="minimal-btn minimal-btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>导出交易记录</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
