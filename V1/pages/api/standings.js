import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_FOOTBALL_API_URL || 'https://api.football-data.org/v4';

// Mock data for fallback
const mockStandings = {
  '英超': {
    competition: { 
      id: 2021, 
      name: '英超',
      code: 'PL',
      type: 'LEAGUE',
      emblem: 'https://crests.football-data.org/PL.png' 
    },
    season: { 
      id: 2023,
      startDate: '2023-08-11',
      endDate: '2024-05-19',
      currentMatchday: 30,
      winner: null
    },
    standings: [
      {
        stage: 'REGULAR_SEASON',
        type: 'TOTAL',
        group: null,
        table: [
          {
            position: 1,
            team: { 
              id: 57, 
              name: '阿森纳', 
              shortName: 'Arsenal',
              tla: 'ARS',
              crest: 'https://crests.football-data.org/57.png' 
            },
            playedGames: 28,
            won: 20,
            draw: 4,
            lost: 4,
            points: 64,
            goalsFor: 70,
            goalsAgainst: 24,
            goalDifference: 46,
            form: 'WWLWD'
          },
          {
            position: 2,
            team: { 
              id: 65, 
              name: '曼城', 
              shortName: 'Man City',
              tla: 'MCI',
              crest: 'https://crests.football-data.org/65.png' 
            },
            playedGames: 28,
            won: 19,
            draw: 6,
            lost: 3,
            points: 63,
            goalsFor: 63,
            goalsAgainst: 28,
            goalDifference: 35,
            form: 'WWWDW'
          }
        ]
      }
    ]
  },
  // Add more leagues as needed
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { season = '2023' } = req.query;
  const competitions = [
    { id: '2021', name: '英超', code: 'PL' },
    { id: '2014', name: '西甲', code: 'PD' },
    { id: '2019', name: '意甲', code: 'SA' },
    { id: '2002', name: '德甲', code: 'BL1' },
    { id: '2015', name: '法甲', code: 'FL1' },
  ];

  // If no API key, return mock data immediately
  if (!API_KEY) {
    console.log('No API key found, using mock data');
    return res.status(200).json({ 
      standings: mockStandings,
      message: 'Using mock data - No API key provided'
    });
  }

  try {
    const standings = {};
    
    // Try to fetch from the real API first
    for (const comp of competitions) {
      try {
        const response = await axios.get(`${API_URL}/competitions/${comp.id}/standings`, {
          headers: { 
            'X-Auth-Token': API_KEY,
            'Accept-Encoding': 'gzip,deflate,compress' 
          },
          params: { 
            season,
            matchday: 30 
          },
          timeout: 10000 
        });

        if (response.data) {
          standings[comp.name] = response.data;
        }
      } catch (error) {
        console.error(`Error fetching standings for ${comp.name}:`, error.message);
        // Use mock data if API call fails
        if (mockStandings[comp.name]) {
          standings[comp.name] = mockStandings[comp.name];
        }
      }
    }

    // If we got any standings from the API, return them
    if (Object.keys(standings).length > 0) {
      return res.status(200).json({ 
        standings,
        source: 'API',
        timestamp: new Date().toISOString()
      });
    }

    // If no standings from API, use mock data
    return res.status(200).json({ 
      standings: mockStandings,
      source: 'Mock Data',
      message: 'No data from API, using mock data'
    });
  } catch (error) {
    console.error('Error in standings API:', error);
    // On error, return mock data
    return res.status(200).json({ 
      standings: mockStandings,
      source: 'Error Fallback',
      error: error.message,
      message: 'Error fetching data, using mock data as fallback'
    });
  }
}
