import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  BarChart3,
  Target,
  Star,
  User,
  Wallet,
  Settings,
  Menu,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useWallet } from './WalletContext';

export default function Layout({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const {
    isWalletConnected,
    walletAddress,
    isConnecting,
    networkError,
    connectWallet,
    disconnectWallet,
    switchToBaseSepolia,
    formatAddress
  } = useWallet();

  const navigationItems = [
    {
      name: '数据',
      href: '/data',
      icon: BarChart3
    },
    {
      name: '竞猜',
      href: '/betting',
      icon: Target
    },
    {
      name: '特殊',
      href: '/special',
      icon: Star
    },
    {
      name: '账户',
      href: '/account',
      icon: User
    }
  ];

  const isActivePage = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  const isHomePage = router.pathname === '/';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* 网络错误提示 */}
      {networkError && (
        <div className="bg-[var(--accent-red)] bg-opacity-10 border-b border-[var(--accent-red)] border-opacity-20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[var(--accent-red)]" />
            <span className="text-[var(--accent-red)] text-sm font-medium">{networkError}</span>
          </div>
          {networkError.includes('Base Sepolia') && (
            <button
              onClick={switchToBaseSepolia}
              className="minimal-btn minimal-btn-secondary text-xs"
            >
              切换网络
            </button>
          )}
        </div>
      </div>
      )}

      {/* 统一风格导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo - 统一风格 */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 group cursor-pointer"
              aria-label="Go to Home"
              title="首页"
            >
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-colors group-hover:bg-gray-900">
                <span className="font-bold text-lg text-white">W</span>
              </div>
              <span className="font-bold text-xl text-black transition-colors group-hover:text-gray-900">Wonton</span>
            </button>

            {/* 桌面端导航 - 统一风格 */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePage(item.href);
                
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-black bg-gray-100'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 右侧操作区 - 统一风格 */}
            <div className="flex items-center space-x-4">
              {/* 钱包连接按钮 */}
              {isWalletConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-black transition-colors">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="hidden sm:inline text-sm font-medium">
                      {formatAddress(walletAddress)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                    title="断开连接"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 bg-black text-white hover:bg-gray-800 ${
                    isConnecting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isConnecting ? '连接中...' : '连接钱包'}
                  </span>
                </button>
              )}

              {/* 管理员设置 */}
              <button
                onClick={() => router.push('/admin')}
                className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                title="管理后台"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 - 统一风格 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md border-gray-200/20 transition-colors">
            <div className="px-6 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePage(item.href);
                
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-black bg-gray-100'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* 主要内容 */}
      <main className={isHomePage ? '' : 'pt-20'}>
        {children}
      </main>
    </div>
  );
}
