import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkError, setNetworkError] = useState('');

  // Base Sepolia 网络配置
  const BASE_SEPOLIA_CONFIG = {
    chainId: '0x14a34', // 84532 in hex
    chainName: 'Base Sepolia',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia-explorer.base.org'],
  };

  // 检查钱包连接状态
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsWalletConnected(true);
            await checkNetwork();
          }
        } catch (error) {
          console.error('检查钱包连接失败:', error);
        }
      }
    };

    checkWalletConnection();

    // 监听账户变化
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setWalletAddress('');
          setIsWalletConnected(false);
          setNetworkError('');
        } else {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          checkNetwork();
        }
      };

      const handleChainChanged = () => {
        checkNetwork();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // 检查网络
  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== BASE_SEPOLIA_CONFIG.chainId) {
        setNetworkError('请切换到Base Sepolia网络');
      } else {
        setNetworkError('');
      }
    } catch (error) {
      console.error('检查网络失败:', error);
    }
  };

  // 切换到Base Sepolia网络
  const switchToBaseSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CONFIG.chainId }],
      });
      setNetworkError('');
    } catch (switchError) {
      if (switchError.code === 4902) {
        // 网络不存在，添加网络
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_CONFIG],
          });
          setNetworkError('');
        } catch (addError) {
          console.error('添加网络失败:', addError);
          setNetworkError('添加Base Sepolia网络失败');
        }
      } else {
        console.error('切换网络失败:', switchError);
        setNetworkError('切换网络失败');
      }
    }
  };

  // 钱包连接逻辑
  const connectWallet = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setNetworkError('');

      // 检查MetaMask是否安装
      if (typeof window.ethereum === 'undefined') {
        throw new Error('请安装MetaMask钱包!');
      }

      // 检查MetaMask是否解锁
      if (!window.ethereum.isMetaMask) {
        throw new Error('请使用MetaMask钱包!');
      }

      // 请求连接账户
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('未获取到账户信息');
      }

      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);

      // 检查并切换网络
      await checkNetwork();
      
      console.log('钱包连接成功:', accounts[0]);
      
    } catch (error) {
      console.error('钱包连接失败:', error);
      
      // 处理常见错误
      if (error.code === 4001) {
        setNetworkError('用户拒绝连接钱包');
      } else if (error.code === -32002) {
        setNetworkError('请在MetaMask中确认连接请求');
      } else {
        setNetworkError(error.message || '钱包连接失败');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开钱包连接
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsWalletConnected(false);
    setNetworkError('');
  };

  // 格式化地址显示
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const value = {
    isWalletConnected,
    walletAddress,
    isConnecting,
    networkError,
    connectWallet,
    disconnectWallet,
    switchToBaseSepolia,
    formatAddress,
    checkNetwork
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
