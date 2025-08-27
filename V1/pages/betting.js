import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  ShoppingCart, 
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Plus,
  Minus,
  ArrowUpDown,
  Filter,
  Search,
  ChevronRight,
  Star,
  Zap,
  ArrowLeft
} from 'lucide-react';
import Layout from '../components/Layout';
import TeamLogo from '../components/TeamLogo';

export default function BettingPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: 选比赛, 2: 选比分, 3: 订单深度表
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);
  const [activeTab, setActiveTab] = useState('buy');
  const [orderAmount, setOrderAmount] = useState(1);
  const [orderPrice, setOrderPrice] = useState(0.1);
  
  const [matches, setMatches] = useState([]);
  const [scoreOptions, setScoreOptions] = useState([]);
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });

  // 模拟数据
  useEffect(() => {
    // 可竞猜比赛数据
    const mockMatches = [
      {
        id: 1,
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        league: '英超',
        startTime: '2024-01-15 20:00',
        status: 'upcoming',
        totalNFTs: 1250,
        totalVolume: 125.5
      },
      {
        id: 2,
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        league: '西甲',
        startTime: '2024-01-16 22:00',
        status: 'upcoming',
        totalNFTs: 2100,
        totalVolume: 210.8
      },
      {
        id: 3,
        homeTeam: 'Bayern Munich',
        awayTeam: 'Borussia Dortmund',
        league: '德甲',
        startTime: '2024-01-17 21:30',
        status: 'upcoming',
        totalNFTs: 890,
        totalVolume: 89.2
      },
      {
        id: 4,
        homeTeam: 'Paris Saint-Germain',
        awayTeam: 'Marseille',
        league: '法甲',
        startTime: '2024-01-18 19:00',
        status: 'upcoming',
        totalNFTs: 750,
        totalVolume: 67.5
      }
    ];

    // 比分选项数据
    const mockScoreOptions = [
      { score: '1-0', odds: 8.5, popularity: 15, nftPrice: 0.1 },
      { score: '2-0', odds: 12.0, popularity: 8, nftPrice: 0.1 },
      { score: '2-1', odds: 6.5, popularity: 25, nftPrice: 0.1 },
      { score: '1-1', odds: 4.2, popularity: 35, nftPrice: 0.1 },
      { score: '0-0', odds: 15.0, popularity: 5, nftPrice: 0.1 },
      { score: '0-1', odds: 18.0, popularity: 4, nftPrice: 0.1 },
      { score: '1-2', odds: 9.5, popularity: 12, nftPrice: 0.1 },
      { score: '0-2', odds: 25.0, popularity: 3, nftPrice: 0.1 },
      { score: '3-0', odds: 20.0, popularity: 2, nftPrice: 0.1 }
    ];

    // 订单深度表数据
    const mockOrderBook = {
      asks: [
        { price: 0.15, amount: 50, total: 7.5 },
        { price: 0.14, amount: 120, total: 16.8 },
        { price: 0.13, amount: 200, total: 26.0 },
        { price: 0.12, amount: 300, total: 36.0 },
        { price: 0.11, amount: 500, total: 55.0 }
      ],
      bids: [
        { price: 0.09, amount: 400, total: 36.0 },
        { price: 0.08, amount: 350, total: 28.0 },
        { price: 0.07, amount: 600, total: 42.0 },
        { price: 0.06, amount: 800, total: 48.0 },
        { price: 0.05, amount: 1000, total: 50.0 }
      ]
    };

    setMatches(mockMatches);
    setScoreOptions(mockScoreOptions);
    setOrderBook(mockOrderBook);
  }, []);

  const steps = [
    { id: 1, title: '选择比赛', description: '选择要竞猜的比赛' },
    { id: 2, title: '选择比分', description: '选择预测的比分结果' },
    { id: 3, title: '交易市场', description: '查看订单深度，执行交易' }
  ];

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setCurrentStep(2);
  };

  const handleScoreSelect = (score) => {
    setSelectedScore(score);
    setCurrentStep(3);
  };

  const handleBuyOrder = (askPrice) => {
    console.log(`买入 ${orderAmount} 个NFT，价格 ${askPrice} USDC`);
  };

  const handleSellOrder = (bidPrice) => {
    console.log(`卖出 ${orderAmount} 个NFT，价格 ${bidPrice} USDC`);
  };

  const createOrder = () => {
    console.log(`创建订单: ${activeTab}, 数量: ${orderAmount}, 价格: ${orderPrice}`);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 页面标题和步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">比分竞猜</h1>
              <p className="text-[var(--text-secondary)]">预测比分，购买NFT，赢取奖励</p>
            </div>
            {currentStep > 1 && (
              <button
                onClick={goBack}
                className="minimal-btn minimal-btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回</span>
              </button>
            )}
          </div>

          {/* 步骤指示器 */}
          <div className="minimal-card p-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      currentStep >= step.id 
                        ? 'bg-[var(--accent-blue)] text-white' 
                        : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'
                    }`}>
                      {step.id}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        currentStep >= step.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-light)]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 步骤1: 选择比赛 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="minimal-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">选择比赛</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      placeholder="搜索比赛..."
                      className="minimal-input pl-10 w-64"
                    />
                  </div>
                  <button className="minimal-btn minimal-btn-ghost">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match, index) => (
                  <div
                    key={match.id}
                    onClick={() => handleMatchSelect(match)}
                    className="border border-[var(--border-light)] rounded-lg p-6 hover:border-[var(--border-medium)] transition-colors cursor-pointer animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="minimal-tag minimal-tag-primary">{match.league}</span>
                      <div className="flex items-center space-x-1 text-[var(--text-secondary)] text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{match.startTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <TeamLogo teamName={match.homeTeam} size="default" />
                        <span className="font-medium text-[var(--text-primary)]">{match.homeTeam}</span>
                      </div>
                      <div className="text-[var(--text-secondary)] text-lg font-medium px-4">VS</div>
                      <div className="flex items-center space-x-3 flex-1 justify-end">
                        <span className="font-medium text-[var(--text-primary)]">{match.awayTeam}</span>
                        <TeamLogo teamName={match.awayTeam} size="default" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-semibold text-[var(--text-primary)]">{match.totalNFTs}</div>
                          <div className="text-[var(--text-secondary)]">NFT数量</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-[var(--text-primary)]">{match.totalVolume}</div>
                          <div className="text-[var(--text-secondary)]">交易量</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 步骤2: 选择比分 */}
        {currentStep === 2 && selectedMatch && (
          <div className="space-y-6">
            <div className="minimal-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">选择比分</h2>
                  <div className="flex items-center space-x-3">
                    <TeamLogo teamName={selectedMatch.homeTeam} size="small" />
                    <span className="text-[var(--text-secondary)]">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</span>
                    <TeamLogo teamName={selectedMatch.awayTeam} size="small" />
                  </div>
                </div>
                <span className="minimal-tag minimal-tag-primary">{selectedMatch.league}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {scoreOptions.map((option, index) => (
                  <div
                    key={option.score}
                    onClick={() => handleScoreSelect(option)}
                    className="border border-[var(--border-light)] rounded-lg p-4 hover:border-[var(--accent-blue)] transition-colors cursor-pointer text-center animate-fade-in"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">{option.score}</div>
                    <div className="text-sm text-[var(--text-secondary)] mb-2">赔率 {option.odds}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mb-3">热度 {option.popularity}%</div>
                    <div className="text-sm font-semibold text-[var(--accent-blue)]">{option.nftPrice} USDC</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 步骤3: 交易市场 */}
        {currentStep === 3 && selectedMatch && selectedScore && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 订单深度表 */}
            <div className="lg:col-span-2 space-y-6">
              <div className="minimal-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">订单深度</h2>
                    <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                      <span>{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</span>
                      <span>•</span>
                      <span>{selectedScore.score}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[var(--text-secondary)]">价差:</span>
                    <span className="text-sm font-semibold text-[var(--accent-red)]">
                      {(orderBook.asks[orderBook.asks.length - 1]?.price - orderBook.bids[0]?.price).toFixed(3)} USDC
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* 卖单 (Ask) */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                      <span className="w-3 h-3 bg-[var(--accent-red)] rounded mr-2"></span>
                      卖单 (Ask)
                    </h3>
                    <div className="space-y-1">
                      {orderBook.asks.map((ask, index) => (
                        <div
                          key={index}
                          onClick={() => handleBuyOrder(ask.price)}
                          className="grid grid-cols-3 gap-2 p-2 rounded hover:bg-[var(--bg-secondary)] cursor-pointer text-sm"
                        >
                          <div className="text-[var(--accent-red)] font-medium">{ask.price.toFixed(3)}</div>
                          <div className="text-[var(--text-secondary)] text-center">{ask.amount}</div>
                          <div className="text-[var(--text-secondary)] text-right">{ask.total.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 买单 (Bid) */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                      <span className="w-3 h-3 bg-[var(--accent-green)] rounded mr-2"></span>
                      买单 (Bid)
                    </h3>
                    <div className="space-y-1">
                      {orderBook.bids.map((bid, index) => (
                        <div
                          key={index}
                          onClick={() => handleSellOrder(bid.price)}
                          className="grid grid-cols-3 gap-2 p-2 rounded hover:bg-[var(--bg-secondary)] cursor-pointer text-sm"
                        >
                          <div className="text-[var(--accent-green)] font-medium">{bid.price.toFixed(3)}</div>
                          <div className="text-[var(--text-secondary)] text-center">{bid.amount}</div>
                          <div className="text-[var(--text-secondary)] text-right">{bid.total.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-[var(--text-tertiary)] mt-4 pt-3 border-t border-[var(--border-light)]">
                  <div>价格 (USDC)</div>
                  <div className="text-center">数量</div>
                  <div className="text-right">总额</div>
                </div>
              </div>
            </div>

            {/* 交易面板 */}
            <div className="minimal-card p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">交易面板</h3>
                <div className="text-sm text-[var(--text-secondary)]">
                  {selectedScore.score} 比分NFT
                </div>
              </div>

              {/* 买入/卖出切换 */}
              <div className="minimal-card p-1 mb-6">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setActiveTab('buy')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                      activeTab === 'buy'
                        ? 'bg-[var(--accent-green)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    买入
                  </button>
                  <button
                    onClick={() => setActiveTab('sell')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                      activeTab === 'sell'
                        ? 'bg-[var(--accent-red)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    卖出
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* 数量选择 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    数量
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setOrderAmount(Math.max(1, orderAmount - 1))}
                      className="minimal-btn minimal-btn-secondary p-2"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(parseInt(e.target.value) || 1)}
                      className="minimal-input text-center flex-1"
                      min="1"
                    />
                    <button
                      onClick={() => setOrderAmount(orderAmount + 1)}
                      className="minimal-btn minimal-btn-secondary p-2"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 价格设置 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    价格 (USDC)
                  </label>
                  <input
                    type="number"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(parseFloat(e.target.value) || 0)}
                    className="minimal-input w-full"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* 预估信息 */}
                <div className="bg-[var(--bg-secondary)] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">总价</span>
                    <span className="text-[var(--text-primary)] font-semibold">
                      {(orderAmount * orderPrice).toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">手续费 (1%)</span>
                    <span className="text-[var(--text-primary)]">
                      {(orderAmount * orderPrice * 0.01).toFixed(4)} USDC
                    </span>
                  </div>
                  <div className="border-t border-[var(--border-light)] pt-2 flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">实际支付</span>
                    <span className="text-[var(--accent-blue)] font-bold">
                      {(orderAmount * orderPrice * 1.01).toFixed(2)} USDC
                    </span>
                  </div>
                </div>

                {/* 交易按钮 */}
                <button
                  onClick={createOrder}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    activeTab === 'buy'
                      ? 'minimal-btn-success'
                      : 'minimal-btn-danger'
                  }`}
                >
                  {activeTab === 'buy' ? '立即买入' : '立即卖出'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
