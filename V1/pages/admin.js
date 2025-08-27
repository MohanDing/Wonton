import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Calendar,
  Trophy,
  Target,
  Crown,
  Award,
  DollarSign,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import Layout from '../components/Layout';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('matches');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [adminData, setAdminData] = useState({
    matches: [],
    nfts: [],
    users: [],
    stats: {}
  });

  // 模拟数据
  useEffect(() => {
    const mockAdminData = {
      matches: [
        {
          id: 1,
          homeTeam: '曼城',
          awayTeam: '阿森纳',
          league: '英超',
          date: '2024-01-25 20:00',
          status: 'upcoming',
          nftCount: 25,
          totalVolume: 12.5,
          createdAt: '2024-01-20'
        },
        {
          id: 2,
          homeTeam: '皇马',
          awayTeam: '巴萨',
          league: '西甲',
          date: '2024-01-24 22:00',
          status: 'live',
          nftCount: 42,
          totalVolume: 28.3,
          createdAt: '2024-01-19'
        }
      ],
      nfts: [
        {
          id: 1,
          type: 'score',
          name: '曼城 2-1 阿森纳',
          category: '比分NFT',
          price: 0.10,
          supply: 1000,
          sold: 250,
          revenue: 25.0,
          status: 'active',
          createdAt: '2024-01-20'
        },
        {
          id: 2,
          type: 'special',
          name: '哈兰德金靴',
          category: '特殊NFT',
          price: 0.15,
          supply: 500,
          sold: 180,
          revenue: 27.0,
          status: 'active',
          createdAt: '2024-01-15'
        }
      ],
      users: [
        {
          id: 1,
          address: '0x1234...5678',
          nftCount: 15,
          totalSpent: 2.45,
          totalProfit: 0.32,
          winRate: 68.5,
          joinDate: '2024-01-10',
          status: 'active'
        }
      ],
      stats: {
        totalMatches: 156,
        totalNFTs: 2847,
        totalUsers: 1234,
        totalRevenue: 2847.32,
        platformFees: 28.47,
        activeMatches: 12,
        todayVolume: 156.78
      }
    };

    setAdminData(mockAdminData);
  }, []);

  const tabs = [
    { id: 'overview', name: '总览', icon: BarChart3 },
    { id: 'matches', name: '比赛管理', icon: Trophy },
    { id: 'nfts', name: 'NFT管理', icon: Target },
    { id: 'users', name: '用户管理', icon: Users },
    { id: 'settings', name: '平台设置', icon: Settings }
  ];

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
  };

  const handleSave = () => {
    console.log(`保存${modalType}:`, selectedItem);
    closeModal();
  };

  const handleDelete = (id, type) => {
    console.log(`删除${type}:`, id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'upcoming': return 'text-blue-400 bg-blue-500/20';
      case 'live': return 'text-red-400 bg-red-500/20';
      case 'finished': return 'text-gray-400 bg-gray-500/20';
      case 'sold_out': return 'text-yellow-400 bg-yellow-500/20';
      case 'vip': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-secondary-400 bg-secondary-500/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '活跃';
      case 'upcoming': return '即将开始';
      case 'live': return '进行中';
      case 'finished': return '已结束';
      case 'sold_out': return '售罄';
      case 'vip': return 'VIP';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">管理后台</h1>
                  <p className="text-secondary-400">平台管理和数据监控</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  className="tech-button-secondary p-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="tech-button-secondary p-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* 权限警告 */}
            <div className="tech-card p-4 border-l-4 border-red-500">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium">管理员权限</span>
                <span className="text-secondary-400">请谨慎操作，所有操作都会被记录</span>
              </div>
            </div>
          </motion.div>

          {/* 标签导航 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-secondary-800/30 rounded-lg p-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-secondary-400 hover:text-white hover:bg-secondary-700/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* 标签内容 */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="tech-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="w-8 h-8 text-blue-400" />
                      <TrendingUp className="w-5 h-5 text-accent-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{adminData.stats.totalMatches}</div>
                    <div className="text-secondary-400 text-sm">总比赛数</div>
                  </div>

                  <div className="tech-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8 text-purple-400" />
                      <TrendingUp className="w-5 h-5 text-accent-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{adminData.stats.totalNFTs}</div>
                    <div className="text-secondary-400 text-sm">总NFT数</div>
                  </div>

                  <div className="tech-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-green-400" />
                      <TrendingUp className="w-5 h-5 text-accent-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{adminData.stats.totalUsers}</div>
                    <div className="text-secondary-400 text-sm">总用户数</div>
                  </div>

                  <div className="tech-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-yellow-400" />
                      <TrendingUp className="w-5 h-5 text-accent-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{adminData.stats.totalRevenue} USDC</div>
                    <div className="text-secondary-400 text-sm">总收入</div>
                  </div>
                </div>

                {/* 今日数据 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="tech-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4">今日交易量</h3>
                    <div className="text-3xl font-bold text-primary-400 mb-2">{adminData.stats.todayVolume} USDC</div>
                    <div className="text-accent-400 text-sm">+12.5% vs 昨日</div>
                  </div>

                  <div className="tech-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4">活跃比赛</h3>
                    <div className="text-3xl font-bold text-primary-400 mb-2">{adminData.stats.activeMatches}</div>
                    <div className="text-secondary-400 text-sm">进行中的比赛</div>
                  </div>

                  <div className="tech-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4">平台手续费</h3>
                    <div className="text-3xl font-bold text-primary-400 mb-2">{adminData.stats.platformFees} USDC</div>
                    <div className="text-secondary-400 text-sm">今日收入</div>
                  </div>
                </div>

                {/* 图表占位符 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="tech-card p-6">
                    <h3 className="text-xl font-bold text-white mb-6">交易量趋势</h3>
                    <div className="h-64 bg-secondary-800/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                        <p className="text-secondary-400">交易量图表（待集成）</p>
                      </div>
                    </div>
                  </div>

                  <div className="tech-card p-6">
                    <h3 className="text-xl font-bold text-white mb-6">NFT分布</h3>
                    <div className="h-64 bg-secondary-800/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                        <p className="text-secondary-400">NFT分布图表（待集成）</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'matches' && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* 操作栏 */}
                <div className="tech-card p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => openModal('match')}
                        className="tech-button flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>添加比赛</span>
                      </motion.button>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="tech-input min-w-[120px]"
                      >
                        <option value="all">全部状态</option>
                        <option value="upcoming">即将开始</option>
                        <option value="live">进行中</option>
                        <option value="finished">已结束</option>
                      </select>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                      <input
                        type="text"
                        placeholder="搜索比赛..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="tech-input pl-10 min-w-[250px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 比赛列表 */}
                <div className="space-y-4">
                  {adminData.matches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="tech-card p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {match.homeTeam} vs {match.awayTeam}
                            </h3>
                            <p className="text-secondary-400 text-sm">{match.league} • {match.date}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-secondary-300 text-sm">NFT: {match.nftCount}</span>
                              <span className="text-secondary-300 text-sm">交易量: {match.totalVolume} USDC</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(match.status)}`}>
                                {getStatusText(match.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => openModal('match', match)}
                            className="tech-button-secondary p-2"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(match.id, 'match')}
                            className="tech-button-secondary p-2 text-red-400 hover:bg-red-500/20"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 其他标签内容省略以节省空间 */}
          </AnimatePresence>

          {/* 模态框 */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="tech-card p-8 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {modalType === 'match' ? '比赛管理' : 'NFT管理'}
                    </h3>
                    <motion.button
                      onClick={closeModal}
                      className="text-secondary-400 hover:text-white"
                      whileHover={{ scale: 1.1 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      placeholder="名称"
                      className="tech-input w-full"
                    />
                    <input
                      type="text"
                      placeholder="描述"
                      className="tech-input w-full"
                    />
                    <input
                      type="number"
                      placeholder="价格 (USDC)"
                      className="tech-input w-full"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={closeModal}
                      className="flex-1 tech-button-secondary py-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      取消
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      className="flex-1 tech-button py-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      保存
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
