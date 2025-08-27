import { useState, useEffect } from 'react';
import { 
  Star, 
  Crown, 
  Award, 
  Target,
  Trophy,
  Medal,
  Zap,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Plus,
  Minus,
  Filter,
  Search,
  ChevronDown,
  Sparkles,
  X
} from 'lucide-react';
import Layout from '../components/Layout';
import TeamLogo from '../components/TeamLogo';

export default function SpecialBetting() {
  const [activeCategory, setActiveCategory] = useState('golden-boot');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('odds');

  const [specialNFTs, setSpecialNFTs] = useState({});
  const [userHoldings, setUserHoldings] = useState([]);

  // 模拟数据
  useEffect(() => {
    const mockSpecialNFTs = {
      'golden-boot': [
        {
          id: 1,
          name: 'Erling Haaland',
          team: 'Manchester City',
          league: '英超',
          currentGoals: 18,
          odds: 1.8,
          price: 0.15,
          popularity: 45,
          description: '目前英超射手榜领跑者，状态火热'
        },
        {
          id: 2,
          name: 'Harry Kane',
          team: 'Bayern Munich',
          league: '德甲',
          currentGoals: 16,
          odds: 2.1,
          price: 0.12,
          popularity: 38,
          description: '转会拜仁后状态出色，德甲适应良好'
        },
        {
          id: 3,
          name: 'Kylian Mbappé',
          team: 'Paris Saint-Germain',
          league: '法甲',
          currentGoals: 15,
          odds: 2.5,
          price: 0.10,
          popularity: 35,
          description: '法甲射手榜前列，欧冠表现同样出色'
        },
        {
          id: 4,
          name: 'Mohamed Salah',
          team: 'Liverpool',
          league: '英超',
          currentGoals: 14,
          odds: 3.2,
          price: 0.08,
          popularity: 28,
          description: '利物浦核心球员，稳定的进球机器'
        }
      ],
      'ballon-dor': [
        {
          id: 5,
          name: 'Erling Haaland',
          team: 'Manchester City',
          league: '英超',
          achievements: ['英超冠军', '欧冠冠军'],
          odds: 2.0,
          price: 0.20,
          popularity: 42,
          description: '年轻的超级射手，已获得多项荣誉'
        },
        {
          id: 6,
          name: 'Kylian Mbappé',
          team: 'Paris Saint-Germain',
          league: '法甲',
          achievements: ['世界杯冠军', '法甲冠军'],
          odds: 2.3,
          price: 0.18,
          popularity: 40,
          description: '世界杯冠军得主，技术全面速度惊人'
        },
        {
          id: 7,
          name: 'Kevin De Bruyne',
          team: 'Manchester City',
          league: '英超',
          achievements: ['英超冠军', '欧冠冠军'],
          odds: 3.5,
          price: 0.15,
          popularity: 32,
          description: '中场大师，传球和进球能力兼备'
        }
      ],
      'league-champion': [
        {
          id: 8,
          name: 'Manchester City',
          league: '英超',
          currentPosition: 1,
          odds: 1.5,
          price: 0.25,
          popularity: 55,
          description: '目前英超积分榜领跑者，实力强劲'
        },
        {
          id: 9,
          name: 'Arsenal',
          league: '英超',
          currentPosition: 2,
          odds: 2.8,
          price: 0.18,
          popularity: 35,
          description: '年轻的阿森纳正在崛起'
        },
        {
          id: 10,
          name: 'Real Madrid',
          league: '西甲',
          currentPosition: 1,
          odds: 1.9,
          price: 0.22,
          popularity: 48,
          description: '皇马依然是西甲最强球队'
        }
      ]
    };

    setSpecialNFTs(mockSpecialNFTs);
  }, []);

  const categories = [
    {
      id: 'golden-boot',
      name: '金靴奖',
      icon: Trophy,
      description: '各大联赛射手王竞猜',
      color: 'text-[var(--accent-yellow)]'
    },
    {
      id: 'ballon-dor',
      name: '金球奖',
      icon: Award,
      description: '年度最佳球员预测',
      color: 'text-[var(--accent-blue)]'
    },
    {
      id: 'league-champion',
      name: '联赛冠军',
      icon: Crown,
      description: '各大联赛冠军预测',
      color: 'text-[var(--accent-green)]'
    }
  ];

  const handlePurchase = (item) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    console.log(`购买 ${selectedItem.name} NFT，数量: ${purchaseAmount}`);
    setShowPurchaseModal(false);
    setPurchaseAmount(1);
  };

  const filteredNFTs = specialNFTs[activeCategory]?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.team.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'odds':
        return a.odds - b.odds;
      case 'price':
        return a.price - b.price;
      case 'popularity':
        return b.popularity - a.popularity;
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">特殊竞猜</h1>
          <p className="text-[var(--text-secondary)]">预测特殊奖项和荣誉，获得独特NFT奖励</p>
        </div>

        {/* 分类选择 */}
        <div className="minimal-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">竞猜分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    activeCategory === category.id
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/5'
                      : 'border-[var(--border-light)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                    <h3 className="font-semibold text-[var(--text-primary)]">{category.name}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="minimal-card p-4 mb-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  placeholder="搜索球员或球队..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="minimal-input pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[var(--text-secondary)]">排序:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="minimal-input text-sm"
              >
                <option value="odds">赔率</option>
                <option value="price">价格</option>
                <option value="popularity">热度</option>
              </select>
            </div>
          </div>
        </div>

        {/* NFT列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedNFTs.map((item, index) => (
            <div
              key={item.id}
              className="minimal-card p-6 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* NFT标题区域 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {item.team && <TeamLogo teamName={item.team} size="small" />}
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{item.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.team}</p>
                  </div>
                </div>
                <span className="minimal-tag minimal-tag-primary">{item.league}</span>
              </div>

              {/* 统计信息 */}
              <div className="space-y-3 mb-4">
                {item.currentGoals !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">当前进球</span>
                    <span className="font-semibold text-[var(--text-primary)]">{item.currentGoals}</span>
                  </div>
                )}
                {item.currentPosition !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">当前排名</span>
                    <span className="font-semibold text-[var(--text-primary)]">第{item.currentPosition}名</span>
                  </div>
                )}
                {item.achievements && (
                  <div>
                    <span className="text-sm text-[var(--text-secondary)] block mb-1">主要成就</span>
                    <div className="flex flex-wrap gap-1">
                      {item.achievements.map((achievement, idx) => (
                        <span key={idx} className="minimal-tag minimal-tag-secondary text-xs">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">赔率</span>
                  <span className="font-semibold text-[var(--accent-blue)]">{item.odds}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">热度</span>
                  <span className="font-semibold text-[var(--text-primary)]">{item.popularity}%</span>
                </div>
              </div>

              {/* 描述 */}
              <p className="text-sm text-[var(--text-secondary)] mb-4">{item.description}</p>

              {/* 价格和购买按钮 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[var(--accent-blue)]">{item.price} USDC</span>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  className="minimal-btn minimal-btn-primary"
                >
                  购买NFT
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 购买确认弹窗 */}
        {showPurchaseModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="minimal-card max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">确认购买</h3>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  {selectedItem.team && <TeamLogo teamName={selectedItem.team} size="default" />}
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{selectedItem.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{selectedItem.team}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{selectedItem.description}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  购买数量
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPurchaseAmount(Math.max(1, purchaseAmount - 1))}
                    className="minimal-btn minimal-btn-secondary p-2"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(parseInt(e.target.value) || 1)}
                    className="minimal-input text-center flex-1"
                    min="1"
                  />
                  <button
                    onClick={() => setPurchaseAmount(purchaseAmount + 1)}
                    className="minimal-btn minimal-btn-secondary p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">单价</span>
                    <span className="text-[var(--text-primary)]">{selectedItem.price} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">数量</span>
                    <span className="text-[var(--text-primary)]">{purchaseAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">小计</span>
                    <span className="text-[var(--text-primary)] font-semibold">
                      {(selectedItem.price * purchaseAmount).toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">手续费 (1%)</span>
                    <span className="text-[var(--text-primary)]">
                      {(selectedItem.price * purchaseAmount * 0.01).toFixed(4)} USDC
                    </span>
                  </div>
                  <div className="border-t border-[var(--border-light)] pt-2 flex justify-between">
                    <span className="text-[var(--text-secondary)]">总计</span>
                    <span className="text-[var(--accent-blue)] font-bold">
                      {(selectedItem.price * purchaseAmount * 1.01).toFixed(2)} USDC
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 minimal-btn minimal-btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 minimal-btn minimal-btn-primary"
                >
                  确认购买
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 热门推荐 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[var(--accent-blue)]" />
            热门推荐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Haaland 金靴',
                description: '目前射手榜领跑，赔率最低',
                price: '0.15 USDC',
                trend: '+12%',
                team: 'Manchester City'
              },
              {
                title: 'Manchester City 英超冠军',
                description: '积分榜第一，夺冠热门',
                price: '0.25 USDC',
                trend: '+8%',
                team: 'Manchester City'
              },
              {
                title: 'Mbappé 金球奖',
                description: '世界杯冠军，实力出众',
                price: '0.18 USDC',
                trend: '+15%',
                team: 'Paris Saint-Germain'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="minimal-card p-6 animate-fade-in"
                style={{animationDelay: `${0.2 + index * 0.1}s`}}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <TeamLogo teamName={item.team} size="small" />
                  <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--accent-blue)] font-bold">{item.price}</span>
                  <span className="text-[var(--accent-green)] text-sm font-semibold">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
