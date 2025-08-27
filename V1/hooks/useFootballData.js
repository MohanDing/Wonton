import { useState, useEffect, useCallback } from 'react';

const TOP_5_LEAGUES = {
  PL: '英超',
  PD: '西甲',
  BL1: '德甲',
  SA: '意甲',
  FL1: '法甲'
};

export function useFootballData() {
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 获取模拟足球数据
  const getMockFootballData = useCallback(() => {
    return [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0],
        time: '20:00',
        homeTeam: '曼城',
        awayTeam: '利物浦',
        homeScore: 2,
        awayScore: 1,
        status: 'live',
        league: '英超',
        leagueCode: 'PL',
        minute: 67
      },
      // 更多模拟数据...
    ];
  }, []);

  // 获取实时足球数据
  const fetchLiveFootballData = useCallback(async () => {
    const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
    
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      console.log('使用模拟足球数据 - API密钥未配置');
      return getMockFootballData();
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const proxyUrl = '/api/football';
      const allMatches = [];
      
      // 尝试获取所有联赛数据
      try {
        const response = await fetch(proxyUrl);
        if (response.ok) {
          const data = await response.json();
          // 处理API返回的数据格式
          if (data.matches && Array.isArray(data.matches)) {
            data.matches.forEach(match => {
              allMatches.push({
                id: match.id,
                date: match.utcDate.split('T')[0],
                time: match.utcDate.split('T')[1].substring(0, 5),
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                homeScore: match.score.fullTime.home,
                awayScore: match.score.fullTime.away,
                status: match.status === 'IN_PLAY' ? 'live' : match.status === 'FINISHED' ? 'finished' : 'upcoming',
                league: TOP_5_LEAGUES[match.competition.code] || match.competition.name,
                leagueCode: match.competition.code,
                minute: match.status === 'IN_PLAY' ? match.minute : null
              });
            });
          }
        }
      } catch (error) {
        console.error('获取足球数据失败:', error);
        return getMockFootballData();
      }

      setLastUpdated(new Date());
      return allMatches;
    } catch (error) {
      console.error('获取实时足球数据失败:', error);
      setError('无法加载比赛数据，请稍后重试');
      return getMockFootballData();
    } finally {
      setIsLoading(false);
    }
  }, [getMockFootballData]);

  // 加载比赛数据
  const loadMatches = useCallback(async () => {
    const data = await fetchLiveFootballData();
    if (data) {
      setMatches(data);
      setLiveMatches(data.filter(match => match.status === 'live'));
    }
  }, [fetchLiveFootballData]);

  // 初始化加载数据
  useEffect(() => {
    loadMatches();
    
    // 设置轮询，每30秒更新一次数据
    const intervalId = setInterval(loadMatches, 30000);
    
    return () => clearInterval(intervalId);
  }, [loadMatches]);

  return {
    matches,
    liveMatches,
    isLoading,
    error,
    lastUpdated,
    refreshData: loadMatches
  };
}
