import { 
  useState, useEffect, useMemo, useRef
} from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar,
  BarChart3,
  Award,
  Zap,
  Clock,
  ChevronDown,
  ChevronLeft,
  Search
} from 'lucide-react';
import Layout from '../components/Layout';
import TeamLogo from '../components/TeamLogo';
import HorizontalBracket from '../components/HorizontalBracket'

export default function DataPage() {
  // 顶部：赛事选择（五大联赛 / 欧冠 / 世界杯）
  const [selectedCompetition, setSelectedCompetition] = useState('英超');
  // 次级：数据栏目
  const [activeSubTab, setActiveSubTab] = useState('standings'); // standings | scorers | teams | fixtures | history
  const [leagueData, setLeagueData] = useState({});
  const [topScorers, setTopScorers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  // 赛季选择
  const [selectedSeason, setSelectedSeason] = useState('2024/25');
  const seasons = ['2024/25', '2023/24', '2022/23', '2021/22'];
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
  // 球员榜指标选择
  const playerMetrics = [
    { key: 'goals', name: '射手榜' },
    { key: 'assists', name: '助攻榜' },
    { key: 'yellowCards', name: '黄牌' },
    { key: 'redCards', name: '红牌' },
    { key: 'penalties', name: '点球' },
    { key: 'shots', name: '射门' },
    { key: 'shotsOnTarget', name: '射正' },
    { key: 'dribblesAttempted', name: '尝试过人' },
    { key: 'dribblesCompleted', name: '过人' },
    { key: 'fouled', name: '被犯规' },
    { key: 'chancesCreated', name: '创造进球机会' },
    { key: 'bigChancesMissed', name: '措施绝佳机会' },
    { key: 'keyPasses', name: '关键传球' },
    { key: 'passes', name: '传球' },
    { key: 'passAccuracy', name: '传球成功率' },
    { key: 'touches', name: '触球' },
    { key: 'crosses', name: '传中' },
    { key: 'accurateCrosses', name: '成功传中' },
    { key: 'longBalls', name: '长传' },
    { key: 'tackles', name: '抢断' },
    { key: 'interceptions', name: '拦截' },
    { key: 'clearances', name: '解围' },
    { key: 'fouls', name: '犯规' },
    { key: 'saves', name: '扑救' },
  ];
  const [selectedPlayerMetric, setSelectedPlayerMetric] = useState('goals');
  const [metricMenuOpen, setMetricMenuOpen] = useState(false);
  // 球队榜指标选择
  const teamMetrics = [
    { key: 'value', name: '身价' },
    { key: 'goalsFor', name: '进球' },
    { key: 'goalsAgainst', name: '失球' },
    { key: 'assists', name: '助攻' },
    { key: 'yellowCards', name: '黄牌' },
    { key: 'redCards', name: '红牌' },
    { key: 'penalties', name: '点球' },
    { key: 'shots', name: '射门' },
    { key: 'shotsOnTarget', name: '射正' },
    { key: 'hitWoodwork', name: '击中门框' },
    { key: 'dribblesAttempted', name: '尝试过人' },
    { key: 'dribblesCompleted', name: '成功过人' },
    { key: 'offsides', name: '越位' },
    { key: 'corners', name: '角球' },
    { key: 'chancesCreated', name: '创造进球机会' },
    { key: 'bigChancesMissed', name: '错失绝佳机会' },
    { key: 'keyPasses', name: '关键传球' },
    { key: 'passes', name: '传球' },
    { key: 'passAccuracy', name: '传球成功率' },
    { key: 'tackles', name: '抢断' },
    { key: 'interceptions', name: '拦截' },
    { key: 'clearances', name: '解围' },
    { key: 'fouls', name: '犯规' },
    { key: 'saves', name: '扑救' },
  ];
  const [selectedTeamMetric, setSelectedTeamMetric] = useState('value');
  const [teamMetricMenuOpen, setTeamMetricMenuOpen] = useState(false);
  // 赛程：按轮次展示
  const [selectedRound, setSelectedRound] = useState(1);

  useEffect(() => {
    // 模拟联赛数据
    const mockLeagueData = {
      '英超': {
        name: '英格兰足球超级联赛',
        season: '2023-24',
        matchday: 15,
        totalGoals: 412,
        avgGoalsPerMatch: 2.74,
        // 每轮赛程（示例：仅部分轮次）
        fixturesByRound: {
          1: [
            { date: '2023-08-12', time: '20:00', homeTeam: 'Manchester City', awayTeam: 'Burnley' },
            { date: '2023-08-12', time: '22:30', homeTeam: 'Arsenal', awayTeam: 'Nottingham Forest' },
            { date: '2023-08-13', time: '20:00', homeTeam: 'Chelsea', awayTeam: 'Liverpool' }
          ],
          2: [
            { date: '2023-08-19', time: '20:00', homeTeam: 'Manchester United', awayTeam: 'Tottenham' },
            { date: '2023-08-19', time: '22:30', homeTeam: 'Manchester City', awayTeam: 'Newcastle United' },
            { date: '2023-08-20', time: '20:00', homeTeam: 'West Ham', awayTeam: 'Chelsea' }
          ],
          15: [
            { date: '2023-12-09', time: '20:00', homeTeam: 'Liverpool', awayTeam: 'Chelsea' },
            { date: '2023-12-09', time: '22:30', homeTeam: 'Manchester City', awayTeam: 'Arsenal' },
            { date: '2023-12-10', time: '20:00', homeTeam: 'Newcastle United', awayTeam: 'Tottenham' }
          ]
        },
        standings: [
          { position: 1, team: 'Manchester City', played: 15, won: 12, drawn: 2, lost: 1, gf: 38, ga: 12, gd: 26, points: 38,
            value: 1200, goalsFor: 38, goalsAgainst: 12, assists: 28, yellowCards: 22, redCards: 1, penalties: 5, shots: 210, shotsOnTarget: 120, hitWoodwork: 7,
            dribblesAttempted: 210, dribblesCompleted: 140, offsides: 18, corners: 98, chancesCreated: 160, bigChancesMissed: 18, keyPasses: 220,
            passes: 9200, passAccuracy: 91, tackles: 180, interceptions: 120, clearances: 150, fouls: 160, saves: 48 },
          { position: 2, team: 'Arsenal', played: 15, won: 11, drawn: 3, lost: 1, gf: 35, ga: 15, gd: 20, points: 36,
            value: 1000, goalsFor: 35, goalsAgainst: 15, assists: 24, yellowCards: 25, redCards: 1, penalties: 4, shots: 198, shotsOnTarget: 110, hitWoodwork: 6,
            dribblesAttempted: 180, dribblesCompleted: 120, offsides: 20, corners: 90, chancesCreated: 150, bigChancesMissed: 16, keyPasses: 200,
            passes: 8800, passAccuracy: 88, tackles: 175, interceptions: 118, clearances: 148, fouls: 170, saves: 52 },
          { position: 3, team: 'Liverpool', played: 15, won: 10, drawn: 4, lost: 1, gf: 32, ga: 14, gd: 18, points: 34,
            value: 950, goalsFor: 32, goalsAgainst: 14, assists: 22, yellowCards: 26, redCards: 1, penalties: 4, shots: 205, shotsOnTarget: 112, hitWoodwork: 8,
            dribblesAttempted: 200, dribblesCompleted: 130, offsides: 22, corners: 92, chancesCreated: 155, bigChancesMissed: 19, keyPasses: 210,
            passes: 8700, passAccuracy: 87, tackles: 185, interceptions: 122, clearances: 145, fouls: 175, saves: 55 },
          { position: 4, team: 'Chelsea', played: 15, won: 9, drawn: 3, lost: 3, gf: 28, ga: 18, gd: 10, points: 30,
            value: 900, goalsFor: 28, goalsAgainst: 18, assists: 20, yellowCards: 29, redCards: 2, penalties: 3, shots: 180, shotsOnTarget: 95, hitWoodwork: 5,
            dribblesAttempted: 170, dribblesCompleted: 110, offsides: 24, corners: 85, chancesCreated: 140, bigChancesMissed: 17, keyPasses: 190,
            passes: 8300, passAccuracy: 86, tackles: 178, interceptions: 116, clearances: 140, fouls: 168, saves: 50 },
          { position: 5, team: 'Newcastle United', played: 15, won: 8, drawn: 4, lost: 3, gf: 25, ga: 19, gd: 6, points: 28,
            value: 700, goalsFor: 25, goalsAgainst: 19, assists: 18, yellowCards: 31, redCards: 2, penalties: 2, shots: 160, shotsOnTarget: 85, hitWoodwork: 4,
            dribblesAttempted: 160, dribblesCompleted: 90, offsides: 26, corners: 80, chancesCreated: 130, bigChancesMissed: 15, keyPasses: 170,
            passes: 7600, passAccuracy: 83, tackles: 190, interceptions: 125, clearances: 160, fouls: 182, saves: 60 },
          { position: 6, team: 'Manchester United', played: 15, won: 8, drawn: 3, lost: 4, gf: 24, ga: 20, gd: 4, points: 27,
            value: 850, goalsFor: 24, goalsAgainst: 20, assists: 17, yellowCards: 33, redCards: 2, penalties: 2, shots: 165, shotsOnTarget: 88, hitWoodwork: 3,
            dribblesAttempted: 165, dribblesCompleted: 95, offsides: 25, corners: 82, chancesCreated: 128, bigChancesMissed: 14, keyPasses: 175,
            passes: 7900, passAccuracy: 84, tackles: 188, interceptions: 121, clearances: 158, fouls: 176, saves: 58 },
          { position: 7, team: 'Tottenham', played: 15, won: 7, drawn: 4, lost: 4, gf: 26, ga: 22, gd: 4, points: 25,
            value: 780, goalsFor: 26, goalsAgainst: 22, assists: 19, yellowCards: 30, redCards: 1, penalties: 3, shots: 175, shotsOnTarget: 96, hitWoodwork: 6,
            dribblesAttempted: 175, dribblesCompleted: 100, offsides: 27, corners: 84, chancesCreated: 135, bigChancesMissed: 16, keyPasses: 180,
            passes: 8000, passAccuracy: 85, tackles: 182, interceptions: 118, clearances: 152, fouls: 174, saves: 53 },
          { position: 8, team: 'Brighton', played: 15, won: 6, drawn: 5, lost: 4, gf: 22, ga: 18, gd: 4, points: 23,
            value: 650, goalsFor: 22, goalsAgainst: 18, assists: 16, yellowCards: 28, redCards: 1, penalties: 2, shots: 150, shotsOnTarget: 80, hitWoodwork: 5,
            dribblesAttempted: 150, dribblesCompleted: 85, offsides: 21, corners: 78, chancesCreated: 120, bigChancesMissed: 13, keyPasses: 160,
            passes: 7500, passAccuracy: 84, tackles: 172, interceptions: 112, clearances: 146, fouls: 168, saves: 49 },
        ]
      },
      '西甲': {
        name: '西班牙足球甲级联赛',
        season: '2023-24',
        matchday: 14,
        totalGoals: 320,
        avgGoalsPerMatch: 2.45,
        fixturesByRound: {
          1: [
            { date: '2023-08-13', time: '20:00', homeTeam: 'Real Madrid', awayTeam: 'Athletic Bilbao' },
            { date: '2023-08-13', time: '22:30', homeTeam: 'Barcelona', awayTeam: 'Getafe' }
          ],
          14: [
            { date: '2023-12-10', time: '20:00', homeTeam: 'Real Madrid', awayTeam: 'Barcelona' }
          ]
        },
        standings: []
      },
      '德甲': {
        name: '德国足球甲级联赛', season: '2023-24', matchday: 14, totalGoals: 355, avgGoalsPerMatch: 3.02,
        fixturesByRound: {
          1: [
            { date: '2023-08-18', time: '20:30', homeTeam: 'Bayern Munich', awayTeam: 'Werder Bremen' },
            { date: '2023-08-19', time: '20:30', homeTeam: 'Leverkusen', awayTeam: 'RB Leipzig' }
          ],
          14: [
            { date: '2023-12-09', time: '18:30', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund' }
          ]
        },
        standings: []
      },
      '意甲': {
        name: '意大利足球甲级联赛', season: '2023-24', matchday: 14, totalGoals: 310, avgGoalsPerMatch: 2.48,
        fixturesByRound: {
          1: [
            { date: '2023-08-20', time: '20:45', homeTeam: 'Inter', awayTeam: 'Monza' },
            { date: '2023-08-20', time: '22:45', homeTeam: 'Napoli', awayTeam: 'Frosinone' }
          ],
          14: [
            { date: '2023-12-10', time: '21:00', homeTeam: 'Juventus', awayTeam: 'Inter' }
          ]
        },
        standings: []
      },
      '法甲': {
        name: '法国足球甲级联赛', season: '2023-24', matchday: 14, totalGoals: 290, avgGoalsPerMatch: 2.32,
        fixturesByRound: {
          1: [
            { date: '2023-08-12', time: '20:00', homeTeam: 'PSG', awayTeam: 'Lorient' },
            { date: '2023-08-12', time: '22:30', homeTeam: 'Marseille', awayTeam: 'Reims' }
          ],
          14: [
            { date: '2023-12-09', time: '20:00', homeTeam: 'PSG', awayTeam: 'Lyon' }
          ]
        },
        standings: []
      },
      '欧冠': { name: '欧洲冠军联赛', season: '2023-24', matchday: 6, totalGoals: 180, avgGoalsPerMatch: 2.96,
        fixturesByRound: {
          1: [
            { date: '2023-09-19', time: '21:00', homeTeam: 'Manchester City', awayTeam: 'Red Star' },
            { date: '2023-09-19', time: '21:00', homeTeam: 'PSG', awayTeam: 'Dortmund' }
          ],
          6: [
            { date: '2023-12-13', time: '21:00', homeTeam: 'Barcelona', awayTeam: 'Antwerp' }
          ]
        },
        // 杯赛：小组赛 + 淘汰赛
        groups: {
          'A': [
            { position: 1, team: 'Bayern Munich', played: 6, won: 5, drawn: 1, lost: 0, gf: 14, ga: 4, gd: 10, points: 16 },
            { position: 2, team: 'Manchester United', played: 6, won: 3, drawn: 1, lost: 2, gf: 9, ga: 7, gd: 2, points: 10 },
            { position: 3, team: 'Copenhagen', played: 6, won: 1, drawn: 2, lost: 3, gf: 5, ga: 8, gd: -3, points: 5 },
            { position: 4, team: 'Galatasaray', played: 6, won: 0, drawn: 2, lost: 4, gf: 3, ga: 12, gd: -9, points: 2 }
          ],
          'B': [
            { position: 1, team: 'Real Madrid', played: 6, won: 6, drawn: 0, lost: 0, gf: 15, ga: 4, gd: 11, points: 18 },
            { position: 2, team: 'Napoli', played: 6, won: 3, drawn: 1, lost: 2, gf: 8, ga: 6, gd: 2, points: 10 },
            { position: 3, team: 'Braga', played: 6, won: 1, drawn: 1, lost: 4, gf: 4, ga: 10, gd: -6, points: 4 },
            { position: 4, team: 'Union Berlin', played: 6, won: 0, drawn: 2, lost: 4, gf: 3, ga: 10, gd: -7, points: 2 }
          ]
        },
        bracket: [
          { round: '1/8决赛', matches: [
            { homeTeam: 'Real Madrid', awayTeam: 'Copenhagen', homeScore: 3, awayScore: 1 },
            { homeTeam: 'Bayern Munich', awayTeam: 'Napoli', homeScore: 2, awayScore: 0 },
            { homeTeam: 'Manchester City', awayTeam: 'Inter', homeScore: 2, awayScore: 1 },
            { homeTeam: 'Barcelona', awayTeam: 'PSG', homeScore: 1, awayScore: 1 },
            { homeTeam: 'Arsenal', awayTeam: 'Porto', homeScore: 2, awayScore: 0 },
            { homeTeam: 'Atletico Madrid', awayTeam: 'Dortmund', homeScore: 1, awayScore: 0 },
            { homeTeam: 'RB Leipzig', awayTeam: 'Real Sociedad', homeScore: 1, awayScore: 2 },
            { homeTeam: 'Benfica', awayTeam: 'Juventus', homeScore: 0, awayScore: 1 },
          ]},
          { round: '1/4决赛', matches: [
            { homeTeam: 'Real Madrid', awayTeam: 'Napoli', homeScore: 2, awayScore: 0 },
            { homeTeam: 'Manchester City', awayTeam: 'PSG', homeScore: 2, awayScore: 2 },
            { homeTeam: 'Arsenal', awayTeam: 'Atletico Madrid', homeScore: 1, awayScore: 0 },
            { homeTeam: 'Real Sociedad', awayTeam: 'Juventus', homeScore: 1, awayScore: 2 },
          ]},
          { round: '半决赛', matches: [
            { homeTeam: 'Real Madrid', awayTeam: 'PSG', homeScore: 1, awayScore: 0 },
            { homeTeam: 'Arsenal', awayTeam: 'Juventus', homeScore: 2, awayScore: 1 },
          ]},
          { round: '决赛', matches: [
            { homeTeam: 'Real Madrid', awayTeam: 'Arsenal', homeScore: 2, awayScore: 1 },
          ]}
        ],
        standings: []
      },
      '世界杯': { name: '国际足联世界杯', season: '2022', matchday: 7, totalGoals: 172, avgGoalsPerMatch: 2.69,
        fixturesByRound: {
          1: [ { date: '2022-11-20', time: '19:00', homeTeam: 'Qatar', awayTeam: 'Ecuador' } ],
          7: [ { date: '2022-12-18', time: '18:00', homeTeam: 'Argentina', awayTeam: 'France' } ]
        },
        groups: {
          'A': [
            { position: 1, team: 'Netherlands', played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 1, gd: 4, points: 7 },
            { position: 2, team: 'Senegal', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 4, gd: 1, points: 6 },
            { position: 3, team: 'Ecuador', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 3, gd: 1, points: 4 },
            { position: 4, team: 'Qatar', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, points: 0 }
          ],
          'B': [
            { position: 1, team: 'England', played: 3, won: 2, drawn: 1, lost: 0, gf: 9, ga: 2, gd: 7, points: 7 },
            { position: 2, team: 'USA', played: 3, won: 1, drawn: 2, lost: 0, gf: 2, ga: 1, gd: 1, points: 5 },
            { position: 3, team: 'Iran', played: 3, won: 1, drawn: 0, lost: 2, gf: 4, ga: 7, gd: -3, points: 3 },
            { position: 4, team: 'Wales', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 6, gd: -5, points: 1 }
          ]
        },
        bracket: [
          { round: '1/8决赛', matches: [
            { homeTeam: 'Netherlands', awayTeam: 'USA', homeScore: 3, awayScore: 1 },
            { homeTeam: 'Argentina', awayTeam: 'Australia', homeScore: 2, awayScore: 1 },
            { homeTeam: 'France', awayTeam: 'Poland', homeScore: 3, awayScore: 1 },
            { homeTeam: 'England', awayTeam: 'Senegal', homeScore: 3, awayScore: 0 },
            { homeTeam: 'Japan', awayTeam: 'Croatia', homeScore: 1, awayScore: 1 },
            { homeTeam: 'Brazil', awayTeam: 'South Korea', homeScore: 4, awayScore: 1 },
            { homeTeam: 'Morocco', awayTeam: 'Spain', homeScore: 0, awayScore: 0 },
            { homeTeam: 'Portugal', awayTeam: 'Switzerland', homeScore: 6, awayScore: 1 },
          ]},
          { round: '1/4决赛', matches: [
            { homeTeam: 'Netherlands', awayTeam: 'Argentina', homeScore: 2, awayScore: 2 },
            { homeTeam: 'France', awayTeam: 'England', homeScore: 2, awayScore: 1 },
            { homeTeam: 'Croatia', awayTeam: 'Brazil', homeScore: 1, awayScore: 1 },
            { homeTeam: 'Morocco', awayTeam: 'Portugal', homeScore: 1, awayScore: 0 },
          ]},
          { round: '半决赛', matches: [
            { homeTeam: 'Argentina', awayTeam: 'Croatia', homeScore: 3, awayScore: 0 },
            { homeTeam: 'France', awayTeam: 'Morocco', homeScore: 2, awayScore: 0 },
          ]},
          { round: '决赛', matches: [
            { homeTeam: 'Argentina', awayTeam: 'France', homeScore: 3, awayScore: 3 },
          ]}
        ],
        standings: []
      },
    };

    const mockTopScorers = [
      { league: '英超', name: 'Erling Haaland', team: 'Manchester City', matches: 15, goals: 18, assists: 3, yellowCards: 2, redCards: 0, penalties: 5, shots: 60, shotsOnTarget: 32, dribblesAttempted: 20, dribblesCompleted: 12, fouled: 18, chancesCreated: 10, bigChancesMissed: 7, keyPasses: 14, passes: 380, passAccuracy: 78, touches: 520, crosses: 2, accurateCrosses: 1, longBalls: 3, tackles: 8, interceptions: 5, clearances: 6, fouls: 12, saves: 0 },
      { league: '英超', name: 'Mohamed Salah', team: 'Liverpool', matches: 15, goals: 15, assists: 7, yellowCards: 1, redCards: 0, penalties: 4, shots: 55, shotsOnTarget: 28, dribblesAttempted: 45, dribblesCompleted: 28, fouled: 22, chancesCreated: 24, bigChancesMissed: 5, keyPasses: 30, passes: 520, passAccuracy: 82, touches: 690, crosses: 30, accurateCrosses: 8, longBalls: 5, tackles: 12, interceptions: 7, clearances: 3, fouls: 10, saves: 0 },
      { league: '德甲', name: 'Harry Kane', team: 'Bayern Munich', matches: 13, goals: 14, assists: 4, yellowCards: 1, redCards: 0, penalties: 3, shots: 48, shotsOnTarget: 25, dribblesAttempted: 18, dribblesCompleted: 10, fouled: 16, chancesCreated: 18, bigChancesMissed: 4, keyPasses: 20, passes: 450, passAccuracy: 84, touches: 600, crosses: 5, accurateCrosses: 2, longBalls: 10, tackles: 9, interceptions: 6, clearances: 5, fouls: 9, saves: 0 },
      { league: '法甲', name: 'Kylian Mbappé', team: 'Paris Saint-Germain', matches: 14, goals: 13, assists: 5, yellowCards: 2, redCards: 0, penalties: 4, shots: 58, shotsOnTarget: 31, dribblesAttempted: 70, dribblesCompleted: 45, fouled: 30, chancesCreated: 26, bigChancesMissed: 6, keyPasses: 27, passes: 410, passAccuracy: 81, touches: 650, crosses: 18, accurateCrosses: 6, longBalls: 4, tackles: 7, interceptions: 5, clearances: 2, fouls: 11, saves: 0 },
      { league: '意甲', name: 'Victor Osimhen', team: 'Napoli', matches: 12, goals: 12, assists: 2, yellowCards: 3, redCards: 0, penalties: 2, shots: 42, shotsOnTarget: 22, dribblesAttempted: 35, dribblesCompleted: 20, fouled: 24, chancesCreated: 12, bigChancesMissed: 5, keyPasses: 16, passes: 280, passAccuracy: 74, touches: 480, crosses: 6, accurateCrosses: 2, longBalls: 2, tackles: 8, interceptions: 4, clearances: 4, fouls: 13, saves: 0 },
    ];

    const mockRecentMatches = [
      { homeTeam: 'Manchester City', awayTeam: 'Arsenal', homeScore: 2, awayScore: 1, date: '2023-12-10', league: '英超' },
      { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 1, awayScore: 1, date: '2023-12-10', league: '西甲' },
      { homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', homeScore: 3, awayScore: 0, date: '2023-12-09', league: '德甲' },
      { homeTeam: 'Liverpool', awayTeam: 'Chelsea', homeScore: 2, awayScore: 2, date: '2023-12-09', league: '英超' }
    ];

    setLeagueData(mockLeagueData);
    // 默认将轮次设置为所选赛事当前轮
    setSelectedRound(mockLeagueData[selectedCompetition]?.matchday || 1);
    setTopScorers(mockTopScorers);
    setRecentMatches(mockRecentMatches);
  }, []);

  // 当更换赛事时，轮次重置到该赛事的当前轮
  useEffect(() => {
    if (leagueData && selectedCompetition && leagueData[selectedCompetition]?.matchday) {
      setSelectedRound(leagueData[selectedCompetition].matchday);
    } else {
      setSelectedRound(1);
    }
  }, [selectedCompetition, leagueData]);

  // 次级栏目
  const subTabs = [
    { id: 'standings', name: '积分排名', icon: Trophy },
    { id: 'scorers', name: '球员榜', icon: Users },
    { id: 'teams', name: '球队榜', icon: Award },
    { id: 'fixtures', name: '赛程', icon: Calendar },
    { id: 'history', name: '历史统计', icon: BarChart3 }
  ];

  // 顶部赛事选项
  const competitions = ['英超', '西甲', '德甲', '意甲', '法甲', '欧冠', '世界杯'];

  // 该联赛可用的最大轮次（用于按钮禁用与边界）
  const maxRound = useMemo(() => {
    const rounds = Object.keys(leagueData[selectedCompetition]?.fixturesByRound || {}).map(n => Number(n));
    if (rounds.length) return Math.max(...rounds);
    return leagueData[selectedCompetition]?.matchday || 1;
  }, [leagueData, selectedCompetition]);

  // 历史统计分类
  const historyCategories = [
    '历届冠军',
    '历届金靴',
    '历史总积分',
    '历史射手王',
    '历届最佳球员',
    '历届最佳教练',
  ];
  const [selectedHistoryCategory, setSelectedHistoryCategory] = useState(historyCategories[0]);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);

  // 历史统计：按赛事的假数据
  const historyByLeague = useMemo(() => ({
    '英超': {
      champions: [
        { season: '2022-23', champion: 'Manchester City', runnerUp: 'Arsenal' },
        { season: '2021-22', champion: 'Manchester City', runnerUp: 'Liverpool' },
        { season: '2020-21', champion: 'Manchester City', runnerUp: 'Manchester United' },
      ],
      goldenBoots: [
        { season: '2022-23', player: 'Erling Haaland', team: 'Manchester City', goals: 36 },
        { season: '2021-22', player: 'Mohamed Salah', team: 'Liverpool', goals: 23 },
        { season: '2020-21', player: 'Harry Kane', team: 'Tottenham', goals: 23 },
      ],
      totalPoints: [
        { team: 'Manchester United', points: 2358 },
        { team: 'Arsenal', points: 2265 },
        { team: 'Chelsea', points: 2230 },
      ],
      topScorersAllTime: [
        { player: 'Alan Shearer', goals: 260 },
        { player: 'Harry Kane', goals: 213 },
        { player: 'Wayne Rooney', goals: 208 },
      ],
      bestPlayers: [
        { season: '2022-23', player: 'Kevin De Bruyne', team: 'Manchester City' },
        { season: '2021-22', player: 'Mohamed Salah', team: 'Liverpool' },
        { season: '2020-21', player: 'Rúben Dias', team: 'Manchester City' },
      ],
      bestCoaches: [
        { season: '2022-23', coach: 'Pep Guardiola', team: 'Manchester City' },
        { season: '2021-22', coach: 'Jürgen Klopp', team: 'Liverpool' },
        { season: '2020-21', coach: 'Pep Guardiola', team: 'Manchester City' },
      ],
    },
    '西甲': {
      champions: [
        { season: '2022-23', champion: 'Barcelona', runnerUp: 'Real Madrid' },
        { season: '2021-22', champion: 'Real Madrid', runnerUp: 'Barcelona' },
      ],
      goldenBoots: [
        { season: '2022-23', player: 'Robert Lewandowski', team: 'Barcelona', goals: 23 },
        { season: '2021-22', player: 'Karim Benzema', team: 'Real Madrid', goals: 27 },
      ],
      totalPoints: [
        { team: 'Real Madrid', points: 3400 },
        { team: 'Barcelona', points: 3380 },
      ],
      topScorersAllTime: [
        { player: 'Lionel Messi', goals: 474 },
        { player: 'Cristiano Ronaldo', goals: 311 },
      ],
      bestPlayers: [
        { season: '2022-23', player: 'Marc-André ter Stegen', team: 'Barcelona' },
      ],
      bestCoaches: [
        { season: '2021-22', coach: 'Carlo Ancelotti', team: 'Real Madrid' },
      ],
    },
    '德甲': {
      champions: [
        { season: '2022-23', champion: 'Bayern Munich', runnerUp: 'Borussia Dortmund' },
      ],
      goldenBoots: [
        { season: '2022-23', player: 'Niclas Füllkrug', team: 'Werder Bremen', goals: 16 },
      ],
      totalPoints: [
        { team: 'Bayern Munich', points: 3200 },
        { team: 'Borussia Dortmund', points: 2800 },
      ],
      topScorersAllTime: [
        { player: 'Gerd Müller', goals: 365 },
      ],
      bestPlayers: [
        { season: '2022-23', player: 'Jamal Musiala', team: 'Bayern Munich' },
      ],
      bestCoaches: [
        { season: '2022-23', coach: 'Thomas Tuchel', team: 'Bayern Munich' },
      ],
    },
    '意甲': {
      champions: [
        { season: '2022-23', champion: 'Napoli', runnerUp: 'Lazio' },
      ],
      goldenBoots: [
        { season: '2022-23', player: 'Victor Osimhen', team: 'Napoli', goals: 26 },
      ],
      totalPoints: [
        { team: 'Juventus', points: 3500 },
        { team: 'Inter', points: 3000 },
      ],
      topScorersAllTime: [
        { player: 'Silvio Piola', goals: 274 },
      ],
      bestPlayers: [
        { season: '2022-23', player: 'Khvicha Kvaratskhelia', team: 'Napoli' },
      ],
      bestCoaches: [
        { season: '2022-23', coach: 'Luciano Spalletti', team: 'Napoli' },
      ],
    },
    '法甲': {
      champions: [
        { season: '2022-23', champion: 'PSG', runnerUp: 'Lens' },
      ],
      goldenBoots: [
        { season: '2022-23', player: 'Kylian Mbappé', team: 'PSG', goals: 29 },
      ],
      totalPoints: [
        { team: 'PSG', points: 2500 },
        { team: 'Marseille', points: 2100 },
      ],
      topScorersAllTime: [
        { player: 'Delio Onnis', goals: 299 },
      ],
      bestPlayers: [
        { season: '2022-23', player: 'Kylian Mbappé', team: 'PSG' },
      ],
      bestCoaches: [
        { season: '2022-23', coach: 'Franck Haise', team: 'Lens' },
      ],
    },
    '欧冠': {
      champions: [
        { season: '2022-23', champion: 'Manchester City', runnerUp: 'Inter' },
        { season: '2021-22', champion: 'Real Madrid', runnerUp: 'Liverpool' },
      ],
      goldenBoots: [
        { season: '2022-23', player: 'Erling Haaland', team: 'Manchester City', goals: 12 },
      ],
      totalPoints: [
        { team: 'Real Madrid', points: 1000 },
        { team: 'Bayern Munich', points: 950 },
      ],
      topScorersAllTime: [
        { player: 'Cristiano Ronaldo', goals: 140 },
      ],
      bestPlayers: [
        { season: '2021-22', player: 'Karim Benzema', team: 'Real Madrid' },
      ],
      bestCoaches: [
        { season: '2021-22', coach: 'Carlo Ancelotti', team: 'Real Madrid' },
      ],
    },
    '世界杯': {
      champions: [
        { season: '2022', champion: 'Argentina', runnerUp: 'France' },
        { season: '2018', champion: 'France', runnerUp: 'Croatia' },
      ],
      goldenBoots: [
        { season: '2022', player: 'Kylian Mbappé', team: 'France', goals: 8 },
        { season: '2018', player: 'Harry Kane', team: 'England', goals: 6 },
      ],
      totalPoints: [
        { team: 'Brazil', points: 237 },
        { team: 'Germany', points: 221 },
      ],
      topScorersAllTime: [
        { player: 'Miroslav Klose', goals: 16 },
      ],
      bestPlayers: [
        { season: '2022', player: 'Lionel Messi', team: 'Argentina' },
      ],
      bestCoaches: [
        { season: '2022', coach: 'Lionel Scaloni', team: 'Argentina' },
      ],
    },
  }), []);

  // 杯赛判断：欧冠、世界杯显示小组赛与对阵图
  const isCup = useMemo(() => ['欧冠', '世界杯'].includes(selectedCompetition), [selectedCompetition]);

  // 将通用轮次数据适配为 HorizontalBracket 需要的结构
  // 输入：[{ round:'1/8决赛', matches:[{homeTeam, awayTeam, homeScore?, awayScore?}, ...]}, ..., { round:'决赛', matches:[{...}] }]
  // 输出：{ leftRounds, rightRounds, finalMatch }
  const buildBracketForComponent = (bracketRounds = []) => {
    if (!Array.isArray(bracketRounds) || bracketRounds.length === 0) return { leftRounds: [], rightRounds: [], finalMatch: null };
    // 取最后一轮作为决赛（若最后一轮只有一场）
    let rounds = [...bracketRounds];
    let finalMatch = null;
    const last = rounds[rounds.length - 1];
    if (last && Array.isArray(last.matches) && last.matches.length === 1) {
      const fm = last.matches[0];
      finalMatch = {
        home: fm.home || fm.homeTeam,
        away: fm.away || fm.awayTeam,
        scoreHome: fm.scoreHome ?? fm.homeScore,
        scoreAway: fm.scoreAway ?? fm.awayScore,
      };
      rounds = rounds.slice(0, -1);
    }

    const leftRounds = [];
    const rightRounds = [];

    // 从外到内：将每一轮的上半区分到左侧，下半区分到右侧（并反转以便视觉从上到下合并）
    rounds.forEach((r) => {
      const ms = Array.isArray(r.matches) ? r.matches : [];
      const half = Math.ceil(ms.length / 2);
      const mapMatch = (m) => ({
        home: m.home || m.homeTeam,
        away: m.away || m.awayTeam,
        scoreHome: m.scoreHome ?? m.homeScore,
        scoreAway: m.scoreAway ?? m.awayScore,
        aggHome: m.aggHome,
        aggAway: m.aggAway,
      });
      const left = ms.slice(0, half).map(mapMatch);
      const right = ms.slice(half).map(mapMatch).reverse();
      leftRounds.push(left);
      rightRounds.unshift(right); // 右侧从内到外显示，反向压入
    });

    return { leftRounds, rightRounds, finalMatch };
  };

  // 静态占位版杯赛对阵图：不绘制连线、只渲染占位框，完全无测量逻辑，避免任何抖动
  function CupSkeleton({
    levels = 4,
    firstRound = 8,
    boxWidth = 136,
    columnGap = 36,
    rowGap = 20,
    sidePadding = 24,
    boxHeight = 58,
    finalLeftScore = 0,
    finalRightScore = 0,
    scoreGap = 12,
    centerGap = 20,
    // 自定义每一对球队之间的标签（比分/状态），side: 'left'|'right', roundIndex: 0..levels-2（从外到内）, pairIndex
    pairLabelResolver = () => '未开始',
  }) {
    // 每列卡片数量（左外->内）
    const counts = [];
    let n = firstRound;
    for (let i = 0; i < levels; i += 1) {
      counts.push(n);
      n = Math.max(1, Math.floor(n / 2));
    }

    // 自适应: 仅测量容器宽度，应用稳定的 scale，避免抖动
    const wrapRef = useRef(null);
    const [scale, setScale] = useState(1);
    useEffect(() => {
      const el = wrapRef.current;
      if (!el) return;
      let raf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const cw = el.clientWidth || 0;
          const columns = levels * 2 + 1; // 左levels + 中心1 + 右levels
          const needed = columns * boxWidth + (columns - 1) * columnGap + sidePadding * 2;
          const next = needed > 0 ? Math.min(1, (cw - sidePadding * 2) / needed) : 1;
          setScale(Number.isFinite(next) && next > 0 ? next : 1);
        });
      });
      ro.observe(el);
      return () => { ro.disconnect(); cancelAnimationFrame(raf); };
    }, [levels, boxWidth, columnGap, sidePadding]);

    const Box = () => (
      <div className="px-4 py-3 rounded-lg border border-neutral-300/80 bg-white shadow-sm h-full flex flex-col justify-center">
        <div className="h-[10px] w-12 bg-neutral-200 rounded mb-2" />
        <div className="h-[10px] w-16 bg-neutral-200 rounded" />
      </div>
    );

    // 计算每列中每个盒子的纵向位置，使父节点位于两个子节点的中点
    const yPositions = [];
    // 最外层（叶子）
    const y0 = Array.from({ length: counts[0] }, (_, i) => i * (boxHeight + rowGap));
    yPositions.push(y0);
    for (let c = 1; c < levels; c += 1) {
      const prev = yPositions[c - 1];
      const curr = [];
      const parentCount = counts[c];
      for (let p = 0; p < parentCount; p += 1) {
        const a = prev[Math.min(prev.length - 1, p * 2)];
        const b = prev[Math.min(prev.length - 1, p * 2 + 1)];
        curr.push((a + b) / 2);
      }
      yPositions.push(curr);
    }

    // 画布尺寸（未缩放前）
    const columns = levels * 2 + 1;
    const stageWidth = columns * boxWidth + (columns - 1) * columnGap + sidePadding * 2;
    const stageHeight = (counts[0] - 1) * (boxHeight + rowGap) + boxHeight;

    const stageStyle = {
      width: stageWidth,
      height: stageHeight,
      position: 'relative',
    };

    const scaledStyle = { transform: `scale(${scale})`, transformOrigin: 'center center' };

    return (
      <div ref={wrapRef} className="w-full overflow-hidden">
        <div className="flex items-center justify-center">
          <div style={scaledStyle}>
            <div style={stageStyle}>
              {/* 连接线（SVG） */}
              {(() => {
                const xLeft = (c) => sidePadding + c * (boxWidth + columnGap);
                // 让 centerGap 控制“内圈到中心”的间距
                const xCenterBase = sidePadding + levels * (boxWidth + columnGap);
                const xCenter = xCenterBase - (columnGap - centerGap);
                const xRight = (c) => xCenter + centerGap + (levels - 1 - c) * (boxWidth + columnGap);
                const stroke = '#d4d4d8'; // neutral-300
                const sw = 2;
                const showFinalConnectors = false; // 关闭中心比分两侧的晋级线
                return (
                  <svg
                    width={stageWidth}
                    height={stageHeight}
                    style={{ position: 'absolute', left: 0, top: 0 }}
                  >
                    <g stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none">
                      {/* 左侧从外到内的连接线 */}
                      {Array.from({ length: Math.max(0, levels - 1) }).map((_, c) => {
                        const parentCount = counts[c + 1] ?? 0;
                        const xChildRight = xLeft(c) + boxWidth;
                        const xParentLeft = xLeft(c + 1);
                        const midX = xChildRight + columnGap / 2;
                        return Array.from({ length: parentCount }).map((__, p) => {
                          const a = yPositions[c][Math.min(counts[c] - 1, p * 2)] + boxHeight / 2;
                          const b = yPositions[c][Math.min(counts[c] - 1, p * 2 + 1)] + boxHeight / 2;
                          const yP = yPositions[c + 1][p] + boxHeight / 2;
                          const label = pairLabelResolver('left', c, p) ?? '未开始';
                          return (
                            <g key={`LC-${c}-${p}`}>
                              <line x1={xChildRight} y1={a} x2={midX} y2={a} />
                              <line x1={xChildRight} y1={b} x2={midX} y2={b} />
                              <line x1={midX} y1={Math.min(a, b)} x2={midX} y2={Math.max(a, b)} />
                              <line x1={midX} y1={yP} x2={xParentLeft} y2={yP} />
                              {/* 左侧配对标签 */}
                              {typeof label === 'string' ? (
                                <text
                                  x={midX - 6}
                                  y={(a + b) / 2}
                                  textAnchor="end"
                                  dominantBaseline="middle"
                                  fill="#000000"
                                  fontWeight="700"
                                  fontSize="12"
                                >
                                  {label}
                                </text>
                              ) : (
                                <g>
                                  {label.leg1 && (
                                    <text
                                      x={midX - 6}
                                      y={(a + b) / 2 - 6}
                                      textAnchor="end"
                                      dominantBaseline="middle"
                                      fill="#000000"
                                      fontWeight="700"
                                      fontSize="12"
                                    >
                                      {label.leg1}
                                    </text>
                                  )}
                                  {label.leg2 && (
                                    <text
                                      x={midX - 6}
                                      y={(a + b) / 2 + 6}
                                      textAnchor="end"
                                      dominantBaseline="middle"
                                      fill="#000000"
                                      fontWeight="700"
                                      fontSize="12"
                                    >
                                      {label.leg2}
                                      {label.agg ? ` (${label.agg})` : ''}
                                    </text>
                                  )}
                                </g>
                              )}
                            </g>
                          );
                        });
                      })}
                      {/* 右侧从内到外（镜像）的连接线 */}
                      {Array.from({ length: Math.max(0, levels - 1) }).map((_, c) => {
                        const parentCount = counts[c + 1] ?? 0;
                        const xChildLeft = xCenter + centerGap + (levels - 1 - c) * (boxWidth + columnGap);
                        const xParentRight = xCenter + centerGap + (levels - 2 - c) * (boxWidth + columnGap) + boxWidth;
                        const midX = xChildLeft - columnGap / 2;
                        return Array.from({ length: parentCount }).map((__, p) => {
                          const a = yPositions[c][Math.min(counts[c] - 1, p * 2)] + boxHeight / 2;
                          const b = yPositions[c][Math.min(counts[c] - 1, p * 2 + 1)] + boxHeight / 2;
                          const yP = yPositions[c + 1][p] + boxHeight / 2;
                          const label = pairLabelResolver('right', c, p) ?? '未开始';
                          return (
                            <g key={`RC-${c}-${p}`}>
                              <line x1={xChildLeft} y1={a} x2={midX} y2={a} />
                              <line x1={xChildLeft} y1={b} x2={midX} y2={b} />
                              <line x1={midX} y1={Math.min(a, b)} x2={midX} y2={Math.max(a, b)} />
                              <line x1={midX} y1={yP} x2={xParentRight} y2={yP} />
                              {/* 右侧配对标签 */}
                              {typeof label === 'string' ? (
                                <text
                                  x={midX + 6}
                                  y={(a + b) / 2}
                                  textAnchor="start"
                                  dominantBaseline="middle"
                                  fill="#000000"
                                  fontWeight="700"
                                  fontSize="12"
                                >
                                  {label}
                                </text>
                              ) : (
                                <g>
                                  {label.leg1 && (
                                    <text
                                      x={midX + 6}
                                      y={(a + b) / 2 - 6}
                                      textAnchor="start"
                                      dominantBaseline="middle"
                                      fill="#000000"
                                      fontWeight="700"
                                      fontSize="12"
                                    >
                                      {label.leg1}
                                    </text>
                                  )}
                                  {label.leg2 && (
                                    <text
                                      x={midX + 6}
                                      y={(a + b) / 2 + 6}
                                      textAnchor="start"
                                      dominantBaseline="middle"
                                      fill="#000000"
                                      fontWeight="700"
                                      fontSize="12"
                                    >
                                      {label.leg2}
                                      {label.agg ? ` (${label.agg})` : ''}
                                    </text>
                                  )}
                                </g>
                              )}
                            </g>
                          );
                        });
                      })}
                      {/* 左侧半决赛到决赛 */}
                      {showFinalConnectors && (() => {
                        const xParentRight = xLeft(levels - 1) + boxWidth;
                        const xFinalLeft = xCenter;
                        const midX = xParentRight + columnGap / 2;
                        const y = (yPositions[levels - 1]?.[0] ?? 0) + boxHeight / 2;
                        return (
                          <g key="L-final">
                            <line x1={xParentRight} y1={y} x2={midX} y2={y} />
                            <line x1={midX} y1={y} x2={xFinalLeft} y2={y} />
                          </g>
                        );
                      })()}
                      {/* 右侧半决赛到决赛 */}
                      {showFinalConnectors && (() => {
                        const xParentLeft = xCenter + centerGap + (levels - 1) * (boxWidth + columnGap);
                        const xFinalRight = xCenter + boxWidth;
                        const midX = xParentLeft - columnGap / 2;
                        const y = (yPositions[levels - 1]?.[0] ?? 0) + boxHeight / 2;
                        return (
                          <g key="R-final">
                            <line x1={xParentLeft} y1={y} x2={midX} y2={y} />
                            <line x1={midX} y1={y} x2={xFinalRight} y2={y} />
                          </g>
                        );
                      })()}
                    </g>
                  </svg>
                );
              })()}
              {/* 左侧：外 -> 内 */}
              {counts.map((count, c) => (
                Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`L-${c}-${i}`}
                    style={{
                      position: 'absolute',
                      width: boxWidth,
                      height: boxHeight,
                      left: sidePadding + c * (boxWidth + columnGap),
                      top: yPositions[c][i],
                    }}
                  >
                    <Box />
                  </div>
                ))
              ))}
              {/* 中心：决赛 */}
              <div
                style={{
                  position: 'absolute',
                  width: boxWidth,
                  height: boxHeight,
                  left: (sidePadding + levels * (boxWidth + columnGap)) - (columnGap - centerGap),
                  top: yPositions[levels - 1][0],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div className="w-full h-full flex items-center justify-center select-none">
                  <div className="flex items-center" style={{ gap: scoreGap }}>
                    <span className="!text-black text-[15px] font-bold">{finalLeftScore}</span>
                    <span className="!text-black text-[15px] font-bold">-</span>
                    <span className="!text-black text-[15px] font-bold">{finalRightScore}</span>
                  </div>
                </div>
              </div>
              {/* 右侧：内 -> 外（镜像） */}
              {counts.map((count, c) => (
                Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`R-${c}-${i}`}
                    style={{
                      position: 'absolute',
                      width: boxWidth,
                      height: boxHeight,
                      left: (sidePadding + levels * (boxWidth + columnGap)) - (columnGap - centerGap) + centerGap + (levels - 1 - c) * (boxWidth + columnGap),
                      top: yPositions[c][i],
                    }}
                  >
                    <Box />
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">数据中心</h1>
          <p className="text-[var(--text-secondary)]">全面的足球数据统计与分析</p>
        </div>

        {/* 顶部：赛事选择 + 次级栏目（合并为一个框） */}
        <div className="minimal-card !border-0 p-1 mb-6 overflow-x-auto">
          <div className="flex space-x-1 overflow-x-auto pb-1">
            {competitions.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCompetition(c)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCompetition === c
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <hr className="minimal-divider my-1" />
          <div className="flex space-x-1 overflow-x-auto pt-1">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 积分排名 / 杯赛小组赛+对阵图 */}
        {activeSubTab === 'standings' && leagueData[selectedCompetition] && (
          <div className="space-y-6">
            {!isCup ? (
              <div className="minimal-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{leagueData[selectedCompetition].name} - 积分榜</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[var(--text-secondary)]">赛季</span>
                    <div className="relative">
                      <button
                        type="button"
                        className="minimal-input w-[10rem] h-10 flex items-center justify-between px-3"
                        onClick={() => setSeasonMenuOpen(!seasonMenuOpen)}
                      >
                        <span className="truncate whitespace-nowrap">{selectedSeason}</span>
                        <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                      </button>
                      {seasonMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 z-30 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {seasons.map((s) => (
                            <button
                              key={s}
                              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-secondary)] ${selectedSeason === s ? 'text-[var(--accent-blue)] font-medium' : 'text-[var(--text-primary)]'}`}
                              onClick={() => { setSelectedSeason(s); setSeasonMenuOpen(false); }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="minimal-table w-full">
                    <thead>
                      <tr>
                        <th className="text-left">排名</th>
                        <th className="text-left">球队</th>
                        <th className="text-center">赛</th>
                        <th className="text-center">胜</th>
                        <th className="text-center">平</th>
                        <th className="text-center">负</th>
                        <th className="text-center">进</th>
                        <th className="text-center">失</th>
                        <th className="text-center">净</th>
                        <th className="text-center">积分</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leagueData[selectedCompetition].standings.map((team, index) => (
                        <tr key={team.position} className={`animate-fade-in ${team.position === 1 ? 'bg-[var(--accent-blue)]/5' : team.position === 2 ? 'bg-[var(--accent-orange)]/5' : ''}`} style={{animationDelay: `${index * 0.05}s`}}>
                          <td>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                              team.position <= 4 ? 'bg-[var(--accent-blue)] text-white' :
                              team.position <= 6 ? 'bg-[var(--accent-orange)] text-white' :
                              'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                            }`}>
                              {team.position}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <TeamLogo teamName={team.team} size="small" />
                              <span className="font-medium text-[var(--text-primary)]">{team.team}</span>
                            </div>
                          </td>
                          <td className="text-center">{team.played}</td>
                          <td className="text-center">{team.won}</td>
                          <td className="text-center">{team.drawn}</td>
                          <td className="text-center">{team.lost}</td>
                          <td className="text-center">{team.gf}</td>
                          <td className="text-center">{team.ga}</td>
                          <td className={`text-center font-medium ${
                            team.gd > 0 ? 'text-emerald-500' : team.gd < 0 ? 'text-rose-500' : 'text-[var(--text-secondary)]'
                          }`}>
                            {team.gd > 0 ? '+' : ''}{team.gd}
                          </td>
                          <td className="text-center font-bold text-[var(--text-primary)]">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="minimal-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{leagueData[selectedCompetition].name} - 淘汰赛与小组赛</h3>
                </div>

                {/* 淘汰赛对阵图（居中决赛，使用真实数据） */}
                <div className="mt-8">
                  <div className="text-base font-semibold mb-3">淘汰赛对阵图</div>
                  <CupSkeleton
                    levels={4}
                    firstRound={8}
                    boxWidth={136}
                    columnGap={48}
                    rowGap={80}      // 增大纵向间距，便于放两行比分
                    boxHeight={66}   // 增加卡片高度
                    pairLabelResolver={(side, roundIndex, pairIndex) => {
                      // 示例：最外圈(roundIndex=0)若干对展示两回合与总比分，其他显示未开始
                      // left / right 两侧各给几个样例
                      if (roundIndex === 0) {
                        if (side === 'left') {
                          if (pairIndex === 0) return { leg1: '2 - 1', leg2: '0 - 0', agg: '2-1' };
                          if (pairIndex === 1) return { leg1: '1 - 3', leg2: '2 - 1', agg: '3-4' };
                          if (pairIndex === 2) return '未开始';
                          if (pairIndex === 3) return { leg1: '0 - 0', leg2: '1 - 0', agg: '1-0' };
                        } else {
                          if (pairIndex === 0) return { leg1: '3 - 2', leg2: '1 - 1', agg: '4-3' };
                          if (pairIndex === 1) return '未开始';
                          if (pairIndex === 2) return { leg1: '0 - 2', leg2: '2 - 2', agg: '2-4' };
                          if (pairIndex === 3) return { leg1: '1 - 0', leg2: '0 - 2', agg: '1-2' };
                        }
                      }
                      // 次外圈(roundIndex=1)给少量样例
                      if (roundIndex === 1) {
                        if (side === 'left' && pairIndex === 0) return { leg1: '1 - 1', leg2: '2 - 0', agg: '3-1' };
                        if (side === 'right' && pairIndex === 0) return { leg1: '0 - 0', leg2: '1 - 1', agg: '1-1(客场晋级)' };
                      }
                      // 其它默认
                      return '未开始';
                    }}
                  />
                </div>

                {/* 小组赛积分榜（底部） */}
                {leagueData[selectedCompetition].groups && (
                  <div>
                    <div className="text-base font-semibold mb-3">小组赛积分榜</div>
                    <div className="grid grid-cols-2 gap-4 items-stretch">
                      {Object.entries(leagueData[selectedCompetition].groups).map(([group, teams]) => (
                        <div key={group} className="border border-[var(--border-light)] rounded-lg h-full min-h-[220px] flex flex-col">
                          <div className="px-4 py-2 border-b border-[var(--border-light)] flex items-center justify-between">
                            <div className="font-semibold">{group} 组</div>
                            <div className="text-[10px] sm:text-xs text-[var(--text-tertiary)] flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                              <span className="w-7 sm:w-8 text-right">赛</span>
                              <span className="w-12 sm:w-14 text-right">胜/平/负</span>
                              <span className="hidden sm:inline-block sm:w-20 text-right">进/失/净</span>
                              <span className="w-9 sm:w-10 text-right font-medium">积分</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="divide-y divide-[var(--border-light)]">
                              {teams.map((team, idx) => (
                                <div
                                  key={team.team}
                                  className={`p-3 animate-fade-in ${team.position === 1 ? 'bg-[var(--accent-blue)]/5' : team.position === 2 ? 'bg-[var(--accent-orange)]/5' : ''}`}
                                  style={{animationDelay: `${idx * 0.05}s`}}
                                >
                                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        team.position === 1 ? 'bg-[var(--accent-blue)] text-white' :
                                        team.position === 2 ? 'bg-[var(--accent-orange)] text-white' :
                                        'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                                      }`}>{team.position}</div>
                                      <TeamLogo teamName={team.team} size="small" />
                                      <span className="truncate text-[var(--text-primary)]">{team.team}</span>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-2 sm:gap-3 whitespace-nowrap text-[10px] sm:text-xs text-[var(--text-secondary)] font-mono [font-variant-numeric:tabular-nums]">
                                      <span className="w-7 sm:w-8 text-right">{team.played}</span>
                                      <span className="w-12 sm:w-14 text-right">{team.won}-{team.drawn}-{team.lost}</span>
                                      <span className="hidden sm:inline-block sm:w-20 text-right">{team.gf}/{team.ga}/{team.gd > 0 ? `+${team.gd}` : team.gd}</span>
                                      <div className="w-9 sm:w-10 flex justify-end">
                                        <div className={`px-2 py-0.5 rounded text-xs font-semibold leading-none ${
                                          team.position === 1 ? 'bg-[var(--accent-blue)] text-white' :
                                          team.position === 2 ? 'bg-[var(--accent-orange)] text-white' :
                                          'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                                        }`}>{team.points}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 球员榜 */}
        {activeSubTab === 'scorers' && (
          <div className="space-y-6">
            <div className="minimal-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{playerMetrics.find(m => m.key === selectedPlayerMetric)?.name || '球员榜'}</h3>
                <div className="flex items-center">
                  <div className="relative">
                    <button
                      className="minimal-input w-[11rem] min-w-[11rem] max-w-[11rem] h-10 flex items-center justify-between px-3 shrink-0"
                      onClick={() => setMetricMenuOpen(!metricMenuOpen)}
                      type="button"
                    >
                      <span className="truncate whitespace-nowrap">{playerMetrics.find(m => m.key === selectedPlayerMetric)?.name || '球员榜'}</span>
                      <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </button>
                    {metricMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 z-30 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {playerMetrics.map((m) => (
                          <button
                            key={m.key}
                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-secondary)] ${selectedPlayerMetric === m.key ? 'text-[var(--accent-blue)] font-medium' : 'text-[var(--text-primary)]'}`}
                            onClick={() => { setSelectedPlayerMetric(m.key); setMetricMenuOpen(false); }}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(() => {
                  const filtered = topScorers.filter(p => p.league === selectedCompetition);
                  if (!filtered.length) {
                    return (
                      <div className="text-[var(--text-secondary)] text-sm">该赛事暂无球员数据</div>
                    );
                  }
                  return filtered
                    .sort((a,b) => (b[selectedPlayerMetric] ?? 0) - (a[selectedPlayerMetric] ?? 0))
                    .map((player, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 border border-[var(--border-light)] rounded-lg hover:border-[var(--border-medium)] transition-colors animate-fade-in ${index <= 1 ? 'bg-[var(--accent-blue)]/5' : ''}`} style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-[var(--accent-orange)] text-white' :
                            index === 1 ? 'bg-[var(--text-secondary)] text-white' :
                            index === 2 ? 'bg-[var(--accent-red)] text-white' :
                            'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                          }`}>
                            {index + 1}
                          </div>
                          <TeamLogo teamName={player.team} size="small" />
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">{player.name}</div>
                            <div className="text-sm text-[var(--text-secondary)]">{player.team}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                          <div className="text-center">
                            <div className="font-bold text-[var(--text-primary)] text-lg">{player[selectedPlayerMetric] ?? '—'}</div>
                            <div className="text-[var(--text-secondary)]">{playerMetrics.find(m => m.key === selectedPlayerMetric)?.name}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-[var(--text-primary)]">{player.matches}</div>
                            <div className="text-[var(--text-secondary)]">出场</div>
                          </div>
                        </div>
                      </div>
                    ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 赛程 */}
        {activeSubTab === 'fixtures' && (
          <div className="space-y-6">
            <div className="minimal-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedCompetition} - 赛程</h3>
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center px-3 h-8 sm:h-9 rounded border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 text-xs sm:text-sm leading-none whitespace-nowrap"
                    onClick={() => setSelectedRound(r => Math.max(1, r - 1))}
                    disabled={selectedRound <= 1}
                  >
                    <div className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" /><span>上一轮</span></div>
                  </button>
                  <div className="minimal-input h-9 px-3 flex items-center w-[9rem] justify-center">
                    第 {selectedRound} 轮
                  </div>
                  <button
                    className="inline-flex items-center px-3 h-8 sm:h-9 rounded border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 text-xs sm:text-sm leading-none whitespace-nowrap"
                    onClick={() => setSelectedRound(r => Math.min(maxRound, r + 1))}
                    disabled={selectedRound >= maxRound}
                  >
                    <div className="flex items-center gap-1"><span>下一轮</span><ChevronDown className="w-4 h-4" /></div>
                  </button>
                </div>
              </div>

              {(() => {
                const fixtures = leagueData[selectedCompetition]?.fixturesByRound?.[selectedRound] || [];
                if (!fixtures.length) {
                  return <div className="text-[var(--text-secondary)]">该轮暂无赛程数据</div>;
                }
                return (
                  <div className="space-y-3">
                    {fixtures.map((m, idx) => (
                      <div key={idx} className="border border-[var(--border-light)] rounded-lg p-3 flex items-center justify-between">
                        <div className="text-[var(--text-secondary)] w-28">{m.date} {m.time}</div>
                        <div className="flex-1 grid grid-cols-3 items-center gap-2">
                          <div className="flex items-center gap-2 min-w-[9rem] justify-end">
                            <span className="truncate"><TeamLogo teamName={m.homeTeam} size="tiny" /> {m.homeTeam}</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm leading-none whitespace-nowrap">
                              {m.score ?? `${m.homeScore}-${m.awayScore}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 min-w-[9rem]">
                            <span className="hidden sm:block"><TeamLogo teamName={m.awayTeam} size="tiny" /></span>
                            <span className="truncate">{m.awayTeam}</span>
                          </div>
                        </div>
                        <button className="ml-3 h-8 px-3 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">购买比分NFT</button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 历史统计 */}
        {activeSubTab === 'history' && (
          <div className="space-y-4">
            {/* 分类选择器 + 分类内容（合并为一个框） */}
            <div className="minimal-card p-0">
              {/* 头部：标题 + 下拉 */}
              <div className="p-4 flex items-center justify-between border-b border-[var(--border-light)]">
                <div className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">{selectedHistoryCategory}</div>
                <div className="relative">
                  <button
                    type="button"
                    className="minimal-input w-[12rem] h-10 flex items-center justify-between px-3"
                    onClick={() => setHistoryMenuOpen((o) => !o)}
                  >
                    <span className="truncate">{selectedHistoryCategory}</span>
                    <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </button>
                  {historyMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 z-30 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-56 overflow-y-auto">
                      {historyCategories.map((c) => (
                        <button
                          key={c}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] ${selectedHistoryCategory === c ? 'text-[var(--accent-blue)] font-medium' : 'text-[var(--text-primary)]'}`}
                          onClick={() => { setSelectedHistoryCategory(c); setHistoryMenuOpen(false); }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* 内容区 */}
              <div className="p-6">
                {(() => {
                  const cat = selectedHistoryCategory;
                  const h = historyByLeague[selectedCompetition] || historyByLeague['英超'];
                  if (cat === '历届冠军') {
                    return (
                      <div className="overflow-x-auto">
                        <table className="minimal-table w-full">
                          <thead>
                            <tr>
                              <th className="text-left">赛季</th>
                              <th className="text-left">冠军</th>
                              <th className="text-left">亚军</th>
                            </tr>
                          </thead>
                          <tbody>
                            {h.champions.map((r, i) => (
                              <tr key={i}>
                                <td>{r.season}</td>
                                <td className="font-medium text-[var(--text-primary)]">{r.champion}</td>
                                <td className="text-[var(--text-secondary)]">{r.runnerUp}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (cat === '历届金靴') {
                    return (
                      <div className="overflow-x-auto">
                        <table className="minimal-table w-full">
                          <thead>
                            <tr>
                              <th className="text-left">赛季</th>
                              <th className="text-left">球员</th>
                              <th className="text-left">球队</th>
                              <th className="text-center">进球</th>
                            </tr>
                          </thead>
                          <tbody>
                            {h.goldenBoots.map((r, i) => (
                              <tr key={i}>
                                <td>{r.season}</td>
                                <td className="font-medium text-[var(--text-primary)]">{r.player}</td>
                                <td className="text-[var(--text-secondary)]">{r.team}</td>
                                <td className="text-center font-bold">{r.goals}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (cat === '历史总积分') {
                    return (
                      <div className="overflow-x-auto">
                        <table className="minimal-table w-full">
                          <thead>
                            <tr>
                              <th className="text-left">球队</th>
                              <th className="text-center">总积分</th>
                            </tr>
                          </thead>
                          <tbody>
                            {h.totalPoints.map((r, i) => (
                              <tr key={i}>
                                <td className="font-medium text-[var(--text-primary)]">{r.team}</td>
                                <td className="text-center font-bold">{r.points}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (cat === '历史射手王') {
                    return (
                      <div className="overflow-x-auto">
                        <table className="minimal-table w-full">
                          <thead>
                            <tr>
                              <th className="text-left">球员</th>
                              <th className="text-center">进球</th>
                            </tr>
                          </thead>
                          <tbody>
                            {h.topScorersAllTime.map((r, i) => (
                              <tr key={i}>
                                <td className="font-medium text-[var(--text-primary)]">{r.player}</td>
                                <td className="text-center font-bold">{r.goals}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (cat === '历届最佳球员') {
                    return (
                      <div className="overflow-x-auto">
                        <table className="minimal-table w-full">
                          <thead>
                            <tr>
                              <th className="text-left">赛季</th>
                              <th className="text-left">球员</th>
                              <th className="text-left">球队</th>
                            </tr>
                          </thead>
                          <tbody>
                            {h.bestPlayers.map((r, i) => (
                              <tr key={i}>
                                <td>{r.season}</td>
                                <td className="font-medium text-[var(--text-primary)]">{r.player}</td>
                                <td className="text-[var(--text-secondary)]">{r.team}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  // 历届最佳教练
                  return (
                    <div className="overflow-x-auto">
                      <table className="minimal-table w-full">
                        <thead>
                          <tr>
                            <th className="text-left">赛季</th>
                            <th className="text-left">教练</th>
                            <th className="text-left">球队</th>
                          </tr>
                        </thead>
                        <tbody>
                          {h.bestCoaches.map((r, i) => (
                            <tr key={i}>
                              <td>{r.season}</td>
                              <td className="font-medium text-[var(--text-primary)]">{r.coach}</td>
                              <td className="text-[var(--text-secondary)]">{r.team}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 球队榜（基于积分榜球队列表的简单视图） */}
        {activeSubTab === 'teams' && (
          <div className="space-y-6">
            <div className="minimal-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedCompetition} - 球队榜</h3>
                <div className="relative">
                  <button
                    type="button"
                    className="minimal-input w-[11rem] min-w-[11rem] max-w-[11rem] h-10 flex items-center justify-between px-3 shrink-0"
                    onClick={() => setTeamMetricMenuOpen(!teamMetricMenuOpen)}
                  >
                    <span className="truncate whitespace-nowrap">{teamMetrics.find(m => m.key === selectedTeamMetric)?.name || '分类'}</span>
                    <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </button>
                  {teamMetricMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 z-30 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {teamMetrics.map((m) => (
                        <button
                          key={m.key}
                          className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-secondary)] ${selectedTeamMetric === m.key ? 'text-[var(--accent-blue)] font-medium' : 'text-[var(--text-primary)]'}`}
                          onClick={() => { setSelectedTeamMetric(m.key); setTeamMetricMenuOpen(false); }}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {leagueData[selectedCompetition]?.standings?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {([...leagueData[selectedCompetition].standings]
                    .sort((a,b) => (b[selectedTeamMetric] ?? 0) - (a[selectedTeamMetric] ?? 0))
                  ).map((team) => (
                    <div key={team.team} className="border border-[var(--border-light)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <TeamLogo teamName={team.team} size="small" />
                          <div className="font-medium text-[var(--text-primary)]">{team.team}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-sm font-bold">{team.position}</div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                        <div className="grid grid-cols-4 gap-x-3">
                          <div>赛 {team.played}</div>
                          <div>胜 {team.won}</div>
                          <div>平 {team.drawn}</div>
                          <div>负 {team.lost}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[var(--text-primary)] font-semibold">
                            {(() => {
                              const m = teamMetrics.find(m => m.key === selectedTeamMetric);
                              const v = team[selectedTeamMetric];
                              if (v === undefined || v === null) return '—';
                              if (m?.key === 'passAccuracy') return `${v}%`;
                              if (m?.key === 'value') return `$${v}M`;
                              return v;
                            })()}
                          </div>
                          <div>{teamMetrics.find(m => m.key === selectedTeamMetric)?.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[var(--text-secondary)]">暂无该赛事的球队数据</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
