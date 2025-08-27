import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_FOOTBALL_API_URL || 'https://api.football-data.org/v4';

// Mock data for fallback
const mockMatches = [
  {
    id: 1,
    competition: { id: 2021, name: '英超' },
    homeTeam: { id: 57, name: '阿森纳' },
    awayTeam: { id: 65, name: '曼城' },
    score: { 
      fullTime: { 
        home: 2, 
        away: 2 
      }
    },
    status: 'FINISHED',
    utcDate: '2023-10-08T15:30:00Z',
    minute: 90
  },
  {
    id: 2,
    competition: { id: 2014, name: '西甲' },
    homeTeam: { id: 86, name: '皇家马德里' },
    awayTeam: { id: 81, name: '巴塞罗那' },
    score: { 
      fullTime: { 
        home: 3, 
        away: 1 
      }
    },
    status: 'FINISHED',
    utcDate: '2023-10-15T19:00:00Z',
    minute: 90
  },
  // Add more mock matches as needed
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // If no API key, return mock data immediately
    if (!API_KEY) {
      console.log('No API key found, using mock data');
      return res.status(200).json({ matches: mockMatches });
    }

    // Try to fetch from the real API first
    const response = await axios.get(`${API_URL}/matches`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
      params: {
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        competitions: '2001,2002,2014,2015,2019,2021',
      },
    });

    // If we get a successful response, format and return the data
    if (response.data?.matches?.length > 0) {
      const formattedMatches = response.data.matches.map(match => ({
        id: match.id,
        competition: {
          id: match.competition?.id,
          name: getCompetitionName(match.competition?.code) || match.competition?.name || '未知联赛'
        },
        homeTeam: {
          id: match.homeTeam?.id,
          name: match.homeTeam?.name || '待定'
        },
        awayTeam: {
          id: match.awayTeam?.id,
          name: match.awayTeam?.name || '待定'
        },
        score: {
          fullTime: {
            home: match.score?.fullTime?.homeTeam ?? null,
            away: match.score?.fullTime?.awayTeam ?? null
          }
        },
        status: match.status || 'SCHEDULED',
        utcDate: match.utcDate,
        minute: match.minute ?? 0
      }));

      return res.status(200).json({ matches: formattedMatches });
    }

    // If no matches in response, use mock data
    return res.status(200).json({ matches: mockMatches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    // On error, return mock data
    return res.status(200).json({ 
      matches: mockMatches,
      error: 'Using mock data due to API error'
    });
  }
}

// Helper function to get competition names in Chinese
function getCompetitionName(code) {
  if (!code) return null;
  
  const competitions = {
    'WC': '世界杯',
    'CL': '欧冠',
    'BL1': '德甲',
    'DED': '荷甲',
    'BSA': '巴甲',
    'PD': '西甲',
    'FL1': '法甲',
    'ELC': '英冠',
    'PPL': '葡超',
    'EC': '欧洲杯',
    'SA': '意甲',
    'PL': '英超',
    'CLI': '解放者杯',
    'EL': '欧联'
  };

  return competitions[code] || null;
}
