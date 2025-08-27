import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Layout from '../components/Layout';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, ComposedChart, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';

// 节流函数
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 统一平台数据获取：优先从 /api/stats 拉取，未提供时使用本地模拟值
function usePlatformStats() {
  const [stats, setStats] = useState({
    tvl: null,
    users: null,
    chains: 3,
    contracts: 12,
    gas24h: '8.2 Gwei',
    minted: '56,780',
    airdropValue: null,
    airdropUsers: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 8000);
    fetch('/api/stats', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Bad status ${r.status}`))))
      .then((data) => {
        setStats((prev) => ({
          tvl: data?.tvl ?? prev.tvl,
          users: data?.users ?? prev.users,
          chains: data?.chains ?? prev.chains,
          contracts: data?.contracts ?? prev.contracts,
          gas24h: data?.gas24h ?? prev.gas24h,
          minted: data?.minted ?? prev.minted,
          airdropValue: data?.airdropValue ?? prev.airdropValue,
          airdropUsers: data?.airdropUsers ?? prev.airdropUsers,
        }));
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e);
      })
      .finally(() => {
        clearTimeout(to);
        setLoading(false);
      });
    return () => {
      clearTimeout(to);
      ctrl.abort();
    };
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}

export default function Home() {
  // 平台数据（含模拟，后端就绪后会从 /api/stats 自动填充）
  const { stats } = usePlatformStats();

  // 热门比赛数据
  const featuredMatches = [
    {
      id: 1,
      homeTeam: '曼城',
      awayTeam: '利物浦',
      homeScore: 2,
      awayScore: 2,
      time: '21:00',
      date: '2025-08-15',
      league: '英超',
      status: 'live',
      minute: '67'
    },
    {
      id: 2,
      homeTeam: '阿森纳',
      awayTeam: '切尔西',
      homeScore: 1,
      awayScore: 1,
      time: '23:30',
      date: '2025-08-15',
      league: '英超',
      status: 'upcoming',
      minute: ''
    },
    {
      id: 3,
      homeTeam: '曼联',
      awayTeam: '热刺',
      homeScore: 0,
      awayScore: 2,
      time: '19:30',
      date: '2025-08-16',
      league: '英超',
      status: 'upcoming',
      minute: ''
    }
  ];

  // 热门比分NFT（示例数据）
  const hotScoreNFTs = [
    { id: 'n1', match: '曼城 2-2 利物浦', score: '2-2', price: 0.1, volume: 128, change: '+12%' },
    { id: 'n2', match: '阿森纳 1-0 切尔西', score: '1-0', price: 0.1, volume: 96, change: '+8%' },
    { id: 'n3', match: '拜仁 3-1 多特', score: '3-1', price: 0.1, volume: 84, change: '+5%' },
    { id: 'n4', match: '皇马 1-1 巴萨', score: '1-1', price: 0.1, volume: 142, change: '+9%' },
    { id: 'n5', match: '国米 2-0 AC米兰', score: '2-0', price: 0.1, volume: 77, change: '+3%' },
    { id: 'n6', match: '巴黎 3-0 马赛', score: '3-0', price: 0.1, volume: 91, change: '+7%' },
  ];

  // 特殊NFT（示例数据）
  const specialNFTs = [
    { id: 's1', name: '金靴热门-哈兰德', odds: 3.2, price: 0.2, trend: '+6%' },
    { id: 's2', name: '金手套-埃德森', odds: 4.5, price: 0.18, trend: '+4%' },
    { id: 's3', name: '年度黑马-布莱顿', odds: 9.0, price: 0.12, trend: '+11%' },
    { id: 's4', name: '年度最佳教练', odds: 6.5, price: 0.15, trend: '+2%' },
    { id: 's5', name: '欧冠八强资格', odds: 2.8, price: 0.22, trend: '+5%' },
  ];

  // 平台数据可视化（示例数据）
  const platformSeries = [
    { date: '7/01', tvl: 24, users: 1.2 },
    { date: '7/08', tvl: 32, users: 2.1 },
    { date: '7/15', tvl: 41, users: 3.6 },
    { date: '7/22', tvl: 38, users: 4.2 },
    { date: '7/29', tvl: 52, users: 5.8 },
    { date: '8/05', tvl: 68, users: 7.1 },
    { date: '8/12', tvl: 83, users: 9.0 },
  ];

  // 平台数据（像素风格用的更多可视化数据）
  const dailyTrades = [
    { d: '07-01', t: 212 }, { d: '07-03', t: 245 }, { d: '07-05', t: 198 }, { d: '07-07', t: 276 },
    { d: '07-09', t: 302 }, { d: '07-11', t: 281 }, { d: '07-13', t: 330 }, { d: '07-15', t: 298 },
    { d: '07-17', t: 351 }, { d: '07-19', t: 372 }, { d: '07-21', t: 361 }, { d: '07-23', t: 398 },
    { d: '07-25', t: 420 }, { d: '07-27', t: 441 }, { d: '07-29', t: 465 }, { d: '07-31', t: 489 },
  ];

  const buySellStack = [
    { w: '第1周', buy: 5200, sell: 3100 },
    { w: '第2周', buy: 6400, sell: 3800 },
    { w: '第3周', buy: 5900, sell: 4200 },
    { w: '第4周', buy: 7600, sell: 5100 },
  ];

  // 自定义粒子柱子（用小方块填充条形区域，稳定的轻微抖动）
  const ParticleBar = (props) => {
    const { x, y, width, height, fill } = props;
    const cells = [];
    const size = 2;      // 粒子尺寸
    const gap = 4;       // 粒子网格间距
    const xEnd = x + width;
    const yEnd = y + height;
    for (let px = x; px <= xEnd - size; px += gap) {
      for (let py = y; py <= yEnd - size; py += gap) {
        // 通过坐标生成确定性微抖动，避免闪烁
        const jx = (((px * 31 + py * 17) % 100) / 100 - 0.5) * 0.6;
        const jy = (((px * 13 + py * 29) % 100) / 100 - 0.5) * 0.6;
        cells.push(
          <rect key={`${px}-${py}`} x={px + jx} y={py + jy} width={size} height={size} fill={fill} opacity={0.95} />
        );
      }
    }
    return <g>{cells}</g>;
  };

  // 将周度TVL转成“粒子面积”散点（每个x生成自下而上的粒子列）
  const particleAreaPoints = React.useMemo(() => {
    const pts = [];
    const stepY = 0.8; // 垂直粒子间距（越小越密）
    for (let i = 0; i < platformSeries.length; i++) {
      const row = platformSeries[i];
      for (let y = 0; y <= row.tvl; y += stepY) {
        // x 基于索引，加上确定性抖动，营造颗粒填充感
        const jitter = (Math.sin(i * 97.13 + y * 13.57) * 0.5);
        pts.push({ x: i + jitter * 0.35, y });
      }
    }
    return pts;
  }, [platformSeries]);

  // 热门/特殊 NFT 横向滚动（双行）
  const hotCarouselRef = useRef(null);
  const [isHotHover, setIsHotHover] = useState(false);
  const specialCarouselRef = useRef(null);
  const [isSpecialHover, setIsSpecialHover] = useState(false);

  // 第2屏交互方块背景
  const section2Ref = useRef(null);
  const squaresCanvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(0);
  const squaresRef = useRef([]);
  const avoidBoxRef = useRef({ hard: null });
  const avoidFnRef = useRef(() => 1);

  // 第2屏交互方块背景配置（避免未定义报错）
  const config = {
    edgePadding: 16,        // 画布边缘内缩像素
    areaInsetPct: 0.08,     // 生成区域相对内缩百分比（0~0.2）
    gapX: 28,               // 列间距（更大 -> 列更稀疏）
    gapY: 18,               // 行间距（保持不变）
    edgeKill: 0,            // 边缘剔除强度（0~64）
    repelRadius: 120,       // 鼠标排斥半径
    repelForce: 0.06,       // 鼠标排斥强度
    damping: 0.92,          // 阻尼
    maxSpeed: 2.0,          // 最大速度
    fade: 0.9,              // 粒子不透明度系数
    edgeFeather: 56,        // 边缘羽化宽度（像素）
    area: {}                // 运行时写入的区域参数
  };

  useEffect(() => {
    const container = section2Ref.current;
    const canvas = squaresCanvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // 辅助函数：计算点到圆角矩形的距离
    const sdfRoundedRect = (x, y, cx, cy, hx, hy, r) => {
      const dx = Math.abs(x - cx) - (hx - r);
      const dy = Math.abs(y - cy) - (hy - r);
      const dxPos = Math.max(dx, 0);
      const dyPos = Math.max(dy, 0);
      return Math.hypot(dxPos, dyPos) + Math.min(Math.max(dx, dy), 0) - r;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // 计算生成区域
      const px = Math.max(0, Math.min(64, config.edgePadding || 0));
      const inset = Math.max(0, Math.min(0.2, config.areaInsetPct || 0));
      const startX = Math.floor(px + width * inset);
      const startY = Math.floor(px + height * inset);
      const endX = Math.max(startX, Math.floor(width - (px + width * inset))); 
      const endY = Math.max(startY, Math.floor(height - (px + height * inset)));
      
      // 计算中心点和半宽高
      const cx = width * 0.5;
      const cy = height * 0.5; // 整体上移30像素
      const hx = (endX - startX) * 0.5;
      const hy = (endY - startY) * 0.5;
      const r = Math.min(48, Math.min(hx, hy) * 0.28); // 圆角半径
      
      // 更新区域参数
      config.area = { cx, cy, hx, hy, r };
      
      // 生成粒子
      const squares = [];
      const gapX = config.gapX ?? config.gap ?? 20;
      const gapY = config.gapY ?? config.gap ?? 20;
      
      // 计算网格范围（确保对称轴上有粒子）
      const gridStartX = cx - Math.floor((cx - startX) / gapX) * gapX;
      const gridStartY = cy - Math.floor((cy - startY) / gapY) * gapY;
      const gridEndX = cx + Math.floor((endX - cx) / gapX) * gapX;
      const gridEndY = cy + Math.floor((endY - cy) / gapY) * gapY;
      
      // 生成整个网格的粒子（不再使用镜像）
      for (let y = gridStartY; y <= gridEndY; y += gapY) {
        // 每行交替偏移，实现六边形紧密排列
        const rowIndex = Math.round((y - gridStartY) / gapY);
        const rowOffset = (rowIndex % 2 === 0) ? 0 : gapX * 0.5;
        
        for (let x = gridStartX + rowOffset; x <= gridEndX; x += gapX) {
          // 检查是否在边界内
          const d = sdfRoundedRect(x, y, cx, cy, hx, hy, r);
          if (d <= 0) {
            squares.push({
              ox: x, oy: y,
              x: x, y: y,
              vx: 0, vy: 0,
            });
          }
        }
      }
      
      // 添加中心点（如果需要）
      if (sdfRoundedRect(cx, cy, cx, cy, hx, hy, r) <= 0) {
        squares.push({
          ox: cx, oy: cy,
          x: cx, y: cy,
          vx: 0, vy: 0,
        });
      }
      
      squaresRef.current = squares;
    };

    const handleMouseMove = (e) => {
      // 获取相对于页面的坐标
      const rect = canvas.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      mouseRef.current = {
        x: e.clientX - rect.left + scrollX,
        y: e.clientY - rect.top + scrollY,
        vx: 0,
        vy: 0
      };
    };
    const onMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const step = () => {
      const squares = squaresRef.current;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      for (let i = 0; i < squares.length; i++) {
        const s = squares[i];
        // 边缘清除：删除靠屏幕边缘的粒子（不绘制，并略微拉回原位）
        const pad = Math.max(0, Math.min(64, config.edgeKill ?? 0));
        if (pad > 0 && (s.x < pad || s.x > width - pad || s.y < pad || s.y > height - pad)) {
          s.vx += (s.ox - s.x) * 0.04;
          s.vy += (s.oy - s.y) * 0.04;
          continue;
        }

        // 受鼠标排斥力影响
        const dx = s.x - mouseRef.current.x;
        const dy = s.y - mouseRef.current.y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < config.repelRadius * config.repelRadius) {
          const dist = Math.max(8, Math.sqrt(dist2));
          const force = (1 - dist / config.repelRadius) * config.repelForce;
          s.vx += (dx / dist) * force * 8;
          s.vy += (dy / dist) * force * 8;
        }

        // 朝原位的微弱回弹
        s.vx += (s.ox - s.x) * 0.02;
        s.vy += (s.oy - s.y) * 0.02;

        // 阻尼与限速
        s.vx *= config.damping;
        s.vy *= config.damping;
        if (s.vx > config.maxSpeed) s.vx = config.maxSpeed;
        if (s.vx < -config.maxSpeed) s.vx = -config.maxSpeed;
        if (s.vy > config.maxSpeed) s.vy = config.maxSpeed;
        if (s.vy < -config.maxSpeed) s.vy = -config.maxSpeed;

        // 移动
        s.x += s.vx;
        s.y += s.vy;

        // 绘制
        ctx.fillStyle = '#000';
        ctx.globalAlpha = config.fade;
        ctx.fillRect(s.x - config.size / 2, s.y - config.size / 2, config.size, config.size);
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(step);
    };

    // 监听
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    resize();
    animRef.current = requestAnimationFrame(step);

    return () => {
      ro.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    const el = hotCarouselRef.current;
    if (!el) return;
    let rafId;
    const speed = 0.7; // px/frame
    const step = () => {
      if (!isHotHover) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isHotHover]);

  useEffect(() => {
    const el = specialCarouselRef.current;
    if (!el) return;
    let rafId;
    const speed = 0.7; // px/frame
    const step = () => {
      if (!isSpecialHover) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isSpecialHover]);

  // 第1屏交互方块背景（与第2屏一致）
  const [heroVisible, setHeroVisible] = useState(true);
  const heroVisibleRef = useRef(true);
  const section1Ref = useRef(null);
  const heroContentRef = useRef(null);
  const squares1CanvasRef = useRef(null);
  const mouse1Ref = useRef({ x: -9999, y: -9999 });
  const anim1Ref = useRef(0);
  const squares1Ref = useRef([]);
  const avoidBoxRef1 = useRef({ hard: null });
  const avoidFnRef1 = useRef(() => 1);

  useEffect(() => {
    if (!section1Ref.current || !squares1CanvasRef.current) return;
    
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        let visible = entry.isIntersecting;
        const rect = entry.boundingClientRect;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (!visible) {
          const coverage = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / vh;
          if (coverage > 0.5) visible = true; // Increased from 0.25 to 0.5 to require more visibility
        }
        heroVisibleRef.current = visible;
        setHeroVisible(visible);
      }
    }, { 
      threshold: [0, 0.2, 0.5, 0.8],  // Adjusted thresholds
      root: null, 
      rootMargin: '30% 0px -40% 0px'  // Adjusted to make particles disappear earlier
    });
    
    io.observe(section1Ref.current);
    const t = setTimeout(() => {
      heroVisibleRef.current = true;
      setHeroVisible(true);
    }, 300);

    const onScroll = () => {
      const el = section1Ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const topVisible = rect.top < vh * 0.8;  // Changed from 0.6 to 0.8 - particles disappear earlier when scrolling down
      const bottomVisible = rect.bottom > vh * 0.2;  // Changed from 0.4 to 0.2 - particles disappear earlier when scrolling up
      const v = topVisible && bottomVisible;
      heroVisibleRef.current = v;
      setHeroVisible(v);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    
    return () => {
      io.disconnect();
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    heroVisibleRef.current = heroVisible;
  }, [heroVisible]);

  useEffect(() => {
    const container = section1Ref.current;
    const canvas = squares1CanvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const config = {
      gapX: 36,         // 列间距更大（列更稀疏）
      gapY: 24,         // 行间距维持原值
      size: 3,          // 更小更密集
      repelRadius: 100,  // 稍微扩大交互半径
      repelForce: 0.12,
      damping: 0.9,
      maxSpeed: 2.2,
      fade: 0.8,        // 增加基础透明度
      edgeKill: 18,     // 边缘清除范围（像素），删除靠边粒子
      edgePadding: 28,  // 边缘留白，避免贴边（适中）
      areaInsetPct: 0.06, // 以百分比进一步内缩范围（宽高各收缩6%）
      edgeFeather: 56,  // 边缘羽化宽度（像素）
      area: {}                // 运行时写入的区域参数
    };

    // 辅助函数：计算点到圆角矩形的距离
    const sdfRoundedRect = (x, y, cx, cy, hx, hy, r) => {
      const dx = Math.abs(x - cx) - (hx - r);
      const dy = Math.abs(y - cy) - (hy - r);
      const dxPos = Math.max(dx, 0);
      const dyPos = Math.max(dy, 0);
      return Math.hypot(dxPos, dyPos) + Math.min(Math.max(dx, dy), 0) - r;
    };

    const updateAvoidBox = () => {
      const content = heroContentRef.current;
      if (!content) { 
        avoidBoxRef1.current.hard = null; 
        return; 
      }
      
      // 延后到下一帧，确保最新布局完成
      requestAnimationFrame(() => {
        const r = content.getBoundingClientRect();
        const hardMargin = 12;  // 硬边距（留出明显空白）
        const softMargin = 40; // 软边距（更柔和过渡）
        const radius = 20;     // 圆角半径（规则形状）
        
        // 应用与粒子区域相同的垂直偏移（上移30像素）
        const verticalOffset = 0;
        const box = {
          l: Math.max(0, r.left - hardMargin),
          t: Math.max(0, r.top - hardMargin - verticalOffset), // 应用垂直偏移
          r: Math.min(width, r.right + hardMargin),
          b: Math.min(height, r.bottom + hardMargin - verticalOffset) // 应用垂直偏移
        };
        
        // 更新避让区域引用
        avoidBoxRef1.current.hard = box;
        avoidBoxRef1.current.soft = {
          l: Math.max(0, box.l - softMargin),
          t: Math.max(0, box.t - softMargin),
          r: Math.min(width, box.r + softMargin),
          b: Math.min(height, box.b + softMargin),
          radius: radius + softMargin,
        };

        // 更新避让函数
        avoidFnRef1.current = (x, y) => {
          // 基础圆角矩形SDF
          const cx = (box.l + box.r) / 2;
          const cy = (box.t + box.b) / 2;
          const hx = (box.r - box.l) / 2;
          const hy = (box.b - box.t) / 2;
          const qx = Math.abs(x - cx) - (hx - radius);
          const qy = Math.abs(y - cy) - (hy - radius);
          const qxPos = Math.max(qx, 0);
          const qyPos = Math.max(qy, 0);
          let d = Math.hypot(qxPos, qyPos) + Math.min(Math.max(qx, qy), 0) - radius;

          // 轻微外扩，保证与内容间留白更小但不贴边
          const growPx = 24;
          d -= growPx;

          if (d <= 0) return 0; // 内部硬避让
          if (d < softMargin) {
            const t = d / softMargin; // 0..1
            return t * t * (3 - 2 * t); // smoothstep 羽化
          }
          return 1;
        };
      });
    };

    const resize = () => {
      // 使用第1屏容器尺寸，使画布随页面滚动
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const px = Math.max(0, Math.min(64, config.edgePadding || 0));
      const inset = Math.max(0, Math.min(0.2, config.areaInsetPct || 0));
      const startX1 = Math.floor(px + width * inset);
      const startY1 = Math.floor(px + height * inset);
      const endX1 = Math.max(startX1, Math.floor(width - (px + width * inset))); // 减少2个像素
      const endY1 = Math.max(startY1, Math.floor(height - (px + height * inset)));
      
      // 更新区域参数到config
      config.area = {
        cx: width * 0.5,  // 使用画布中心点
        cy: height * 0.5, // 移除上移30像素的偏移，使粒子区域下移30像素
        hx: (endX1 - startX1) * 0.5,
        hy: (endY1 - startY1) * 0.5,
        r: Math.min(48, Math.min((endX1 - startX1) * 0.14, (endY1 - startY1) * 0.14))
      };
      
      const { cx: areaCx, cy: areaCy, hx: areaHx, hy: areaHy, r: areaR } = config.area;
      
      // 生成对称粒子
      const squares1 = [];
      const gapX = config.gapX ?? config.gap ?? 24;
      const gapY = config.gapY ?? config.gap ?? 24;
      
      // 计算网格范围（确保对称轴上有粒子）
      const startX = areaCx - Math.floor((areaCx - startX1) / gapX) * gapX;
      const startY = areaCy - Math.floor((areaCy - startY1) / gapY) * gapY;
      const endX = areaCx + Math.floor((endX1 - areaCx) / gapX) * gapX;
      const endY = areaCy + Math.floor((endY1 - areaCy) / gapY) * gapY;
      
      // 生成整个网格的粒子（不再使用镜像）
      for (let y = startY; y <= endY; y += gapY) {
        // 每行交替偏移，实现六边形紧密排列
        const rowIndex = Math.round((y - startY) / gapY);
        const rowOffset = (rowIndex % 2 === 0) ? 0 : gapX * 0.5;
        
        for (let x = startX + rowOffset; x <= endX; x += gapX) {
          // 计算到中心点的距离（用于对称）
          const dx = x - areaCx;
          const dy = y - areaCy;
          
          // 跳过靠近对称轴的粒子（删除对称轴两侧的两列）
          const minDistanceX = gapX * 2; // 设置最小距离为2倍列间距
          const minDistanceY = gapY * 2; // 设置最小距离为2倍行间距
          if (Math.abs(dx) < minDistanceX || Math.abs(dy) < minDistanceY) continue;
          
          // 只生成第一象限的粒子
          if (dx < 0 || dy < 0) continue;
          
          // 创建4个对称的粒子
          const positions = [
            { x: areaCx + dx, y: areaCy + dy },  // 第一象限
            { x: areaCx - dx, y: areaCy + dy },  // 第二象限
            { x: areaCx + dx, y: areaCy - dy },  // 第四象限
            { x: areaCx - dx, y: areaCy - dy }   // 第三象限
          ];
          
          for (const pos of positions) {
            const qx = Math.abs(pos.x - areaCx) - (areaHx - areaR);
            const qy = Math.abs(pos.y - areaCy) - (areaHy - areaR);
            const qxPos = Math.max(qx, 0);
            const qyPos = Math.max(qy, 0);
            const d = Math.hypot(qxPos, qyPos) + Math.min(Math.max(qx, qy), 0) - areaR;
            if (d <= 0) {  // 只在边界内生成
              squares1.push({
                ox: pos.x, oy: pos.y,
                x: pos.x, y: pos.y,
                vx: 0, vy: 0,
              });
            }
          }
        }
      }
      squares1Ref.current = squares1;
      updateAvoidBox();
    };

    const handleMouseMove1 = (e) => {
      // 获取相对于页面的坐标
      const rect = canvas.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      mouse1Ref.current = {
        x: e.clientX - rect.left + scrollX,
        y: e.clientY - rect.top + scrollY,
        vx: 0,
        vy: 0
      };
    };

    const onMouseLeave1 = () => {
      mouse1Ref.current.x = -9999;
      mouse1Ref.current.y = -9999;
    };

    const step = () => {
      const squares = squares1Ref.current;
      if (!squares || squares.length === 0) {
        resize();
        return;
      }

      // 不可见时跳过重绘，节省CPU
      if (!heroVisibleRef.current) {
        anim1Ref.current = requestAnimationFrame(step);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      for (const s of squares) {
        // 边缘清除：删除靠屏幕边缘的粒子（不绘制，并略微拉回原位）
        const pad = Math.max(0, Math.min(64, config.edgeKill ?? 0));
        if (pad > 0 && (s.x < pad || s.x > width - pad || s.y < pad || s.y > height - pad)) {
          s.vx += (s.ox - s.x) * 0.04;
          s.vy += (s.oy - s.y) * 0.04;
          continue;
        }

        const avoidStrength = avoidFnRef1.current ? avoidFnRef1.current(s.x, s.y) : 1;
        
        // 计算到边缘的距离（用于透明度渐变）
        const { cx, cy, hx, hy, r } = config.area;
        const d = sdfRoundedRect(s.x, s.y, cx, cy, hx, hy, r);
        
        // 计算边缘透明度（距离边缘越近越透明）
        let edgeAlpha = 1.0;
        if (d > -config.edgeFeather) {
          const t = Math.min(1, (d + config.edgeFeather) / config.edgeFeather);
          edgeAlpha = 1.0 - t * t * (3 - 2 * t); // 平滑过渡
        }

        // 受鼠标排斥力影响
        const dx = s.x - mouse1Ref.current.x;
        const dy = s.y - mouse1Ref.current.y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < config.repelRadius * config.repelRadius) {
          const dist = Math.max(8, Math.sqrt(dist2));
          const force = (1 - dist / config.repelRadius) * config.repelForce;
          s.vx += (dx / dist) * force * 8;
          s.vy += (dy / dist) * force * 8;
        }

        s.vx += (s.ox - s.x) * 0.02;
        s.vy += (s.oy - s.y) * 0.02;
        s.vx *= config.damping;
        s.vy *= config.damping;
        s.vx = Math.max(-config.maxSpeed, Math.min(config.maxSpeed, s.vx));
        s.vy = Math.max(-config.maxSpeed, Math.min(config.maxSpeed, s.vy));
        s.x += s.vx;
        s.y += s.vy;

        // 设置绘制样式
        ctx.fillStyle = '#000';
        ctx.globalAlpha = config.fade * avoidStrength * edgeAlpha;
        ctx.fillRect(s.x - config.size/2, s.y - config.size/2, config.size, config.size);
      }
      ctx.globalAlpha = 1;
      anim1Ref.current = requestAnimationFrame(step);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    
    const roContent = new ResizeObserver(updateAvoidBox);
    if (heroContentRef.current) roContent.observe(heroContentRef.current);
    
    window.addEventListener('mousemove', handleMouseMove1, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave1, { passive: true });
    
    resize();
    anim1Ref.current = requestAnimationFrame(step);

    return () => {
      ro.disconnect();
      roContent.disconnect();
      window.removeEventListener('mousemove', handleMouseMove1);
      window.removeEventListener('mouseleave', onMouseLeave1);
      cancelAnimationFrame(anim1Ref.current);
    };
  }, []);

  // 右侧独立粒子面板（无统计图，仅动画）
  function ParticlePanel() {
    const canvasRefs = useRef([]);
    useEffect(() => {
      const TAU = Math.PI * 2;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const spacing = 11;     // 采样步距（x方向）
      const size = 2;         // 粒子大小
      const amplitude = 18;   // 波幅
      const wavelength = 202; // 波长（px）
      const speed = 1.1;      // 相位速度
      const move = 40;        // 飘带水平移动速度(px/s)
      const band = 20;        // 飘带厚度（总高度，像素）—加粗
      const layerGap = 30;    // 双层飘带间距
      const sharedT0 = performance.now(); // 同步两画布起始时间，确保完全一致
      const cleanups = [];

      const initCanvas = (cv, idx) => {
        if (!cv) return () => {};
        const ctx = cv.getContext('2d');
        let w = 0, h = 0;

        const resize = () => {
          const parent = cv.parentElement || cv;
          const rect = parent.getBoundingClientRect();
          w = Math.max(1, Math.floor(rect.width));
          h = Math.max(160, Math.floor(rect.height));
          cv.width = Math.floor(w * DPR);
          cv.height = Math.floor(h * DPR);
          cv.style.width = w + 'px';
          cv.style.height = h + 'px';
          ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        resize();

        let raf = 0;
        const step = () => {
          const now = performance.now();
          const t = (now - sharedT0) / 1000; // 秒
          ctx.clearRect(0, 0, w, h);

          const c1 = h * 0.45;
          const c2 = c1 + layerGap;
          const c3 = c1 - layerGap; // 额外增加一条带（每层三条）
          const c4 = c2 + layerGap; // 再增加一条彩色带（每层四条：黑/彩/黑/彩）

          // 上层：黑色；下层：根据面板切换颜色（第一个面板绿色，第二个面板红色）；再加一条黑色弱化带与一条彩色弱化带
          const drawRibbon = (cy, phaseOffset, alpha = 0.3, color = '#000') => {
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            // 回卷一次：在可视宽度内渲染一个完整周期
            for (let sx = 0; sx <= w; sx += spacing) {
              const baseX = sx; // 不再平移和取模，避免多重重复带
              const flip = idx === 1 ? Math.PI : 0; // 第二个面板与第一个相反
              const ph = (sx / Math.max(1, w)) * TAU + t * speed + phaseOffset + flip; // 一个周期（相反相位）
              const yCenter = cy + Math.sin(ph) * amplitude;
              for (let o = -band * 0.5; o <= band * 0.5; o += 3) { // 更密更厚
                const j = Math.sin((sx + o) * 0.03) * 0.6;
                ctx.fillRect(baseX + j, yCenter + o, size, size);
              }
            }
          };

          // 上层：黑色；下层：根据面板切换颜色（第一个面板绿色，第二个面板红色）；再加一条黑色弱化带与一条彩色弱化带
          drawRibbon(c1, 0.0, 0.44, '#000');
          const isSecondPanel = idx === 1;
          const secondaryColor = isSecondPanel ? '#dc2626' : '#16a34a'; // 第二个面板红色，否则绿色
          const secondaryAlpha = isSecondPanel ? 0.30 : 0.44; // 单独设置红色带透明度
          drawRibbon(c2, 0.9, secondaryAlpha, secondaryColor);
          drawRibbon(c3, 0.45, 0.8, '#000'); // 第三条：轻度黑色，细腻叠加
          drawRibbon(c4, 1.8, Math.max(0.16, secondaryAlpha * 1.5), secondaryColor); // 第四条：同色弱化带，层次更丰富

          ctx.globalAlpha = 1;
          raf = requestAnimationFrame(step);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(cv.parentElement || cv);
        raf = requestAnimationFrame(step);
        return () => { ro.disconnect(); cancelAnimationFrame(raf); };
      };

      const cvs = canvasRefs.current.filter(Boolean);
      cvs.forEach((cv, idx) => cleanups.push(initCanvas(cv, idx)));
      return () => { cleanups.forEach((fn) => fn && fn()); };
    }, []);

    return (
      <div className="relative bg-white rounded-xl border border-gray-300 p-3 h-full min-h-[260px] overflow-hidden">{/* 缩小卡片内边距，面板更贴近边框 */}
        <div className="relative flex flex-col gap-6">{/* 面板间距更近 */}
          <div className="relative h-[220px]"><canvas ref={el => (canvasRefs.current[0] = el)} className="absolute inset-0 pointer-events-none" style={{ imageRendering: 'pixelated' }} /></div>
          <div className="relative h-[220px] -mt-4"><canvas ref={el => (canvasRefs.current[1] = el)} className="absolute inset-0 pointer-events-none" style={{ imageRendering: 'pixelated' }} /></div>
        </div>
      </div>
    );
  }

  // 能量传输粒子动画：节点-连线网络，脉冲沿边传播
  function SpiralPanel() {
    const canvasRef = useRef(null);
    useEffect(() => {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      let w = 0, h = 0;

      const resize = () => {
        const parent = cv.parentElement || cv;
        const rect = parent.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(220, Math.floor(rect.height));
        cv.width = Math.floor(w * DPR);
        cv.height = Math.floor(h * DPR);
        cv.style.width = w + 'px';
        cv.style.height = h + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(cv.parentElement || cv);

      // 构建两条从左到右的节点网络（两条能量通道）
      const cols = 16; // 列（第一版尺寸）
      const rows = 6;  // 行（第一版尺寸）
      const marginX = Math.max(24, w * 0.04);
      const marginY = Math.max(20, h * 0.08);
      const networks = []; // [{nodes, edges, pulses, color}]

      const layoutBand = (bandIdx, bands) => {
        const nodes = [], edges = [];
        const innerW = Math.max(1, w - marginX * 2);
        const innerHTotal = Math.max(1, h - marginY * 2);
        const bandGap = Math.max(16, innerHTotal * 0.18); // 组间距保持
        const bandH = (innerHTotal - bandGap * (bands - 1)) / bands;
        const yStart = marginY + bandIdx * (bandH + bandGap);
        
        // 第一版：矩形规则网格（无错列），按 band 线性插值
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = marginX + (c / (cols - 1)) * innerW;
            const y = yStart + (r / (rows - 1)) * bandH;
            nodes.push({ id: bandIdx * 1000 + c * rows + r, x, y, c, r });
          }
        }
        
        // 构建边（仅连接右侧同一行），并记录从节点到右侧边/左侧边的映射
        const edgeRight = new Map();
        const edgeLeft = new Map();
        for (let c = 0; c < cols - 1; c++) {
          for (let r = 0; r < rows; r++) {
            const from = nodes[c * rows + r];
            const targets = [r]; // 第一版：仅连接右侧同一行，形成水平能量通道
            
            for (const tr of targets) {
              const to = nodes[(c + 1) * rows + tr];
              if (!to) continue;
              const len = Math.hypot(to.x - from.x, to.y - from.y);
              // 为每条边预计算由粒子构成的“网格线”采样点（更密集）
              const spacing = 4; // 更密的点阵
              const count = Math.max(2, Math.floor(len / spacing));
              const samples = [];
              for (let i = 0; i <= count; i++) {
                const t = i / count;
                samples.push({
                  x: from.x + (to.x - from.x) * t,
                  y: from.y + (to.y - from.y) * t
                });
              }
              const edge = { from, to, len, samples };
              edges.push(edge);
              edgeRight.set(from.id, edge);
              edgeLeft.set(to.id, edge);
            }
          }
        }
        // 返回映射
        return { nodes, edges, edgeRight, edgeLeft };
      };

      const layoutGraph = () => {
        networks.length = 0; // 确保干净初始化
        const bands = 2;
        for (let i = 0; i < bands; i++) {
          const b = layoutBand(i, bands);
          networks.push({
            ...b,
            blocks: [],
            band: i,
            // 顶部绿色左->右，底部红色右->左
            dir: i === 0 ? 1 : -1,
            color: i === 0 ? { r: 22, g: 163, b: 74 } : { r: 220, g: 38, b: 38 }
          });
          
          // 在每两条线之间生成一个“粒子方块”，沿着线方向移动
          const net = networks[networks.length - 1];
          for (let r = 0; r < rows - 1; r++) {
            const y0 = b.nodes[0 * rows + r].y;
            const y1 = b.nodes[0 * rows + (r + 1)].y;
            const yMid = (y0 + y1) / 2;
            const startX = net.dir === 1 ? marginX : (w - marginX);
            const speed = 40 + Math.random() * 20; // 与原脉冲相近速度
            const size = 24; // 方块边长（像素，放大）
            net.blocks.push({ x: startX, y: yMid, speed, size, row: r });
            // 每个间隙生成两个方块，增加数量
            const innerW = Math.max(1, w - marginX * 2);
            const offset = innerW * 0.5; // 第二个方块起始错位一半带宽
            const startX2 = net.dir === 1 ? (startX - offset) : (startX + offset);
            net.blocks.push({ x: startX2, y: yMid, speed: speed * (0.9 + Math.random() * 0.2), size, row: r });
            
            // 额外增加两组：分别错位四分之一与四分之三带宽
            const quarter = innerW * 0.25;
            const startX3 = net.dir === 1 ? (startX - quarter) : (startX + quarter);
            const seed3 = Math.abs(Math.sin(yMid * 0.061 + startX3 * 0.021 + net.band * 1.9 + r * 0.33));
            const cols3 = 5 + Math.floor(seed3 * 6);
            net.blocks.push({ x: startX3, y: yMid, speed: speed * (0.85 + Math.random() * 0.25), size, row: r, cols: cols3 });
            
            const threeQuarter = innerW * 0.75;
            const startX4 = net.dir === 1 ? (startX - threeQuarter) : (startX + threeQuarter);
            const seed4 = Math.abs(Math.sin(yMid * 0.073 + startX4 * 0.025 + net.band * 2.7 + r * 0.37));
            const cols4 = 5 + Math.floor(seed4 * 6);
            net.blocks.push({ x: startX4, y: yMid, speed: speed * (0.95 + Math.random() * 0.25), size, row: r, cols: cols4 });
          }
        }
      };
      layoutGraph();

      // 为某条网络生成脉冲
      // const spawnPulse = (net) => {
      //   // 每行设置最小时间间隔，保证脉冲之间距离更长
      //   const nowSec = performance.now() / 1000;
      //   const minGap = 1.2 + Math.random() * 0.8; // 1.2~2.0s
      //   let r = -1;
      //   for (let tries = 0; tries < 4; tries++) {
      //     const cand = (Math.random() * rows) | 0;
      //     if (nowSec - (net.rowCooldowns?.[cand] ?? 0) >= minGap) { r = cand; break; }
      //   }
      //   if (r === -1) return; // 暂不生成，等待冷却
      //   net.rowCooldowns[r] = nowSec;

      //   // 根据通道方向选择起始列：左->右从最左，右->左从倒数第二列（因为边从左指向右）
      //   const startCol = net.dir === 1 ? 0 : (cols - 2);
      //   const startId = startCol * rows + r;
      //   const startNode = net.nodes[startId];
      //   const e = net.edgeRight.get(startNode.id);
      //   if (!e) return;
      //   const speed = 40 + Math.random() * 20; // 稍微快一点 px/s
      //   // 每个脉冲的高亮长度不同：更长、更明显（偏向长脉冲）
      //   const rad = (Math.random() < 0.6)
      //     ? 24 + Math.random() * 16   // 长段：24~40
      //     : 12 + Math.random() * 10;  // 短段：12~22
      //   net.pulses.push({ e, dist: 0, speed, dir: net.dir, rad });
      // };

      let last = performance.now();
      let raf = 0;
      const step = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        ctx.clearRect(0, 0, w, h);

        // 背景能量雾化
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = '#000';
        for (let i = 0; i < 80; i++) {
          const x = (i * 73.7 + now * 0.03) % w;
          const y = (i * 41.3 + now * 0.02) % h;
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;

        // 生成脉冲（降低频率，结合按行冷却，拉大脉冲间距）
        // for (const net of networks) {
        //   if (Math.random() < 0.12) spawnPulse(net);
        // }

        // 轻微上下浮动（按行、按带、按x相位），amp单位px
        const wobbleY = (row, x, t, band) => {
          // 已禁用浮动：返回0，保持线条与方块垂直位置稳定
          return 0;
        };

        // 先绘制基础网格线（由粒子构成的点阵）+ 节点（与线点统一），并加入轻微上下浮动
        for (const net of networks) {
          // 网格线点阵
          ctx.globalAlpha = 1; // 统一不透明度，避免颜色不一致
          ctx.fillStyle = 'rgba(160,160,160,1)'; // 统一为单一灰色
          const ps = 2.2;          // 与方块内部一致的粒子尺寸
          const spacing = 4;        // 与采样一致/更密的间距，保证线连续
          for (let r = 0; r < rows; r++) {
            const baseY = net.nodes[0 * rows + r].y;
            for (let x = 0; x <= w; x += spacing) {
              const wy = wobbleY(r, x, now, net.band);
              ctx.fillRect(x - ps / 2, (baseY + wy) - ps / 2, ps, ps);
            }
          }
          ctx.globalAlpha = 1;
        }

        // 更新/绘制脉冲：高亮靠近脉冲位置的网格线粒子与节点（恢复为放大、变亮、通道色）
        // for (const net of networks) {
        //   for (let i = net.pulses.length - 1; i >= 0; i--) {
        //     const p = net.pulses[i];
        //     p.dist += p.speed * dt;
        //     const t = Math.min(1, p.dist / Math.max(1, p.e.len));
        //     const tt = p.dir === 1 ? t : (1 - t);
        //     const px = p.e.from.x + (p.e.to.x - p.e.from.x) * tt;
        //     const py = p.e.from.y + (p.e.to.y - p.e.from.y) * tt;
        //     const { r: cr, g: cg, b: cb } = net.color;
        //     const highlightRadius = p.rad; // 每个脉冲的高亮长度不同

        //     // 高亮当前边的采样点
        //     for (const s of p.e.samples) {
        //       const d = Math.hypot(s.x - px, s.y - py);
        //       if (d <= highlightRadius) {
        //         const r = 2.0; // 脉冲点更大
        //         ctx.fillStyle = `rgba(${cr},${cg},${cb},0.42)`; // 更深一些
        //         ctx.beginPath();
        //         ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        //         ctx.fill();
        //       }
        //     }

        //     // 节点与线点统一的高亮：相同的放大与颜色，无额外发光
        //     // for (const n of net.nodes) {
        //     //   const d = Math.hypot(n.x - px, n.y - py);
        //     //   if (d <= highlightRadius) {
        //     //     const r = 1.4; // 统一点大小（略大于基础1.0，增强可见性）
        //     //     ctx.fillStyle = `rgba(${cr},${cg},${cb},0.28)`; // 固定透明度（略提升）
        //     //     ctx.beginPath();
        //     //     ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        //     //     ctx.fill();
        //     //   }
        //     // }

        //     // 到达当前边尾部后，接力到下一条边；按方向决定下一条
        //     if (t >= 1) {
        //       const nextEdge = p.dir === 1 ? net.edgeRight.get(p.e.to.id) : net.edgeLeft.get(p.e.from.id);
        //       if (nextEdge) {
        //         p.e = nextEdge;
        //         p.dist = 0;
        //       } else {
        //         net.pulses.splice(i, 1);
        //       }
        //     }
        //   }
        // }

        // 更新/绘制移动方块（由粒子组成，位于两条线之间，沿线方向移动）
        for (const net of networks) {
          const { r: cr, g: cg, b: cb } = net.color;
          for (const b of net.blocks) {
            // 运动
            b.x += net.dir * b.speed * dt;
            const leftBound = marginX - b.size;
            const rightBound = w - marginX + b.size;
            if (net.dir === 1 && b.x > rightBound) b.x = leftBound;
            if (net.dir === -1 && b.x < leftBound) b.x = rightBound;

            // 选择与之相邻的行用于抖动（更接近下方那条线）
            const wyTop = wobbleY(b.row, b.x, now, net.band);
            const wyBottom = wobbleY(b.row + 1, b.x, now, net.band);
            const wy = (wyTop + wyBottom) * 0.5;

            // 行间透明度：上方的方块更不透明，下方更透明（按带与行索引计算）
            const gapsPerBand = Math.max(1, rows - 1);
            const rowNorm = Math.max(0, Math.min(1, b.row / (gapsPerBand - 1))); // 0..1 顶->底（带内）
            let alphaTop, alphaBottom;
            if (net.band === 0) {
              // 绿带：顶部更不透明 → 底部更透明
              alphaTop = 0.95;
              alphaBottom = 0.25;
            } else {
              // 红带：顶部更透明 → 底部更不透明（下面深上面浅）
              alphaTop = 0.22;
              alphaBottom = 0.72;
            }
            const a = alphaTop + (alphaBottom - alphaTop) * rowNorm;
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${a.toFixed(3)})`;
            // 使用等数量(n x n)的子粒子，但横向间距更大于纵向间距，使整体为左右更长的矩形
            const n = 7;           // 横竖粒子个数相同
            const gapX = 8.0;      // 列间距（更大）
            const gapY = 3.5;      // 行间距（较小）
            const halfW = (n - 1) * gapX * 0.5;
            const halfH = (n - 1) * gapY * 0.5;
            const dotSize = 2.2;   // 小粒子尺寸
            for (let iy = 0; iy < n; iy++) {
              const oy = -halfH + iy * gapY;
              for (let ix = 0; ix < n; ix++) {
                const ox = -halfW + ix * gapX;
                ctx.fillRect(b.x + ox, b.y + wy + oy, dotSize, dotSize);
              }
            }
          }
        }

        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);

      const onResize = () => { resize(); layoutGraph(); };
      window.addEventListener('resize', onResize);
      return () => { ro.disconnect(); window.removeEventListener('resize', onResize); cancelAnimationFrame(raf); };
    }, []);

    return (
      <div className="relative h-[440px]">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
      </div>
    );
  }

  // 统计值（用于列表展示）
  const latest = platformSeries[platformSeries.length - 1] || { tvl: 0, users: 0 };
  const totalTrades30 = dailyTrades.reduce((a, b) => a + (b.t || 0), 0);
  const avgDailyTrades = Math.round(totalTrades30 / Math.max(1, dailyTrades.length));
  const lastTrades = dailyTrades[dailyTrades.length - 1]?.t || 0;
  const totalBuy = buySellStack.reduce((a, b) => a + (b.buy || 0), 0);
  const totalSell = buySellStack.reduce((a, b) => a + (b.sell || 0), 0);
  const buyPct = totalBuy + totalSell > 0 ? Math.round((totalBuy / (totalBuy + totalSell)) * 100) : 0;

  // 交易数据（模拟）
  const trading = {
    vol24h: '23,480',        // 万 USDC
    trades24h: '1,342',
    activeOrders: '3,210',
    avgPrice: '0.12 USDC',
    makers: '482',
    takers: '860',
    fee: '1%',
    openInterest: '12,450',
  };

  // 操作界面动画：OKX 风格深色交易面板（订单簿条形动态 + 细网格背景 + 买卖按钮）
  function TradeDemoAnim() {
    const rows = 20;
    return (
      <div className="relative w-full h-full overflow-hidden rounded-3xl">
        {/* 背景网格与光晕 */}
        <div className="absolute inset-0 gridBg rounded-3xl" />
        <div className="absolute -inset-x-1 -top-1/2 h-full opacity-30 blur-3xl pointer-events-none"
             style={{ background: 'radial-gradient(800px 200px at 30% 20%, rgba(0,200,255,0.15), transparent), radial-gradient(600px 180px at 80% 0%, rgba(0,255,170,0.12), transparent)'}} />
        
        <div className="relative z-10 w-full h-full flex items-stretch gap-2 p-2">
          {/* 左：订单簿（卖盘） */}
          <div className="flex-1 flex flex-col gap-1">
            {[...Array(rows)].map((_, i) => (
              <div key={`ask-${i}`} className="h-7 rounded-xl bg-[#121821] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ff3d3d] via-[#ff6b6b] to-[#332] animate-widthPulse"
                     style={{ width: `${20 + ((i * 13) % 60)}%`, opacity: 0.9 }} />
              </div>
            ))}
          </div>
          
          {/* 中间细分隔线 */}
          <div className="w-px bg-[#202835] self-stretch" />
          
          {/* 中：价格与微交互 */}
          <div className="w-44 hidden md:flex flex-col justify-between py-1">
            <div>
              <div className="text-xs text-gray-400">标记价格</div>
              <div className="text-lg font-semibold text-white tracking-tight">0.1204 USDC</div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> 实时撮合中
            </div>
          </div>
          
          {/* 右：订单簿（买盘） */}
          <div className="flex-1 flex flex-col gap-1">
            {[...Array(rows)].map((_, i) => (
              <div key={`bid-${i}`} className="h-7 rounded-xl bg-[#121821] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#053] via-[#19c37d] to-[#1b2a22] animate-widthPulse"
                     style={{ width: `${25 + ((i * 17) % 55)}%`, opacity: 0.9 }} />
              </div>
            ))}
          </div>
          
          {/* 右侧：买卖面板 */}
          <div className="hidden lg:flex w-56 flex-col gap-3 bg-[#0b0f14]/60 border border-[#1a2330] rounded-2xl p-2.5">
            <div className="text-gray-300 text-sm">快速下单</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="col-span-2 bg-[#101620] border border-[#1a2330] rounded-xl px-2 py-1.5">
                价格
                <div className="text-white text-sm">0.120</div>
              </div>
              <div className="bg-[#101620] border border-[#1a2330] rounded-xl px-2 py-1.5">数量<div className="text-white text-sm">10</div></div>
              <div className="bg-[#101620] border border-[#1a2330] rounded-xl px-2 py-1.5">金额<div className="text-white text-sm">1.2</div></div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 h-10 rounded-xl bg-[#19c37d] text-[#072] font-medium hover:brightness-110 active:brightness-95 transition transform hover:-translate-y-0.5">
                买入
              </button>
              <button className="flex-1 h-10 rounded-xl bg-[#ff6b6b] text-[#400] font-medium hover:brightness-110 active:brightness-95 transition transform hover:-translate-y-0.5">
                卖出
              </button>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .gridBg { background-image:
            linear-gradient(rgba(32,40,53,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(32,40,53,0.5) 1px, transparent 1px);
            background-size: 32px 32px, 32px 32px;
            background-color: #0b0f14;
          }
          @keyframes widthPulse {
            0%, 100% { transform: scaleX(0.95); opacity: .85; }
            50% { transform: scaleX(1); opacity: 1; }
          }
          .animate-widthPulse { transform-origin: left center; animation: widthPulse 1.8s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // 这里正在发生（第4屏新板块）
  function HappeningNow() {
    const [active, setActive] = useState(null); // id | null
    const cards = [
      {
        id: 1,
        title: '让您的彩票活起来',
        short: '链上凭证 + 二级交易，让“彩票”变成可持有、可交易的资产。',
        long: '通过 ERC1155 与订单簿机制，您的每一次选择都不仅仅是一张静态的票据，而是一个可自由流通的资产。支持部分成交、低费用撮合与可视化深度，帮助您随时调整仓位，让“彩票”真正活起来。',
        img: null,
      },
      {
        id: 2,
        title: '专为短期投资者而生',
        short: '分钟级进出与清晰深度，服务短线策略与事件驱动。',
        long: '聚焦赛前/赛中窗口的瞬时价格与流动性，提供低滑点、低手续费体验。您可以快速建仓、止盈/止损，并通过盘口变化捕捉事件驱动机会，满足短期投资者对效率与透明度的双重需求。',
        img: null,
      },
      {
        id: 3,
        title: '在娱乐中做交易',
        short: '把看球的激情转化为可度量的交易表达。',
        long: '不只是观赛，更是参与市场。您对比分、走势的判断将即时反映到订单簿之中。我们用极简、清爽且专业的交互，让娱乐与交易自然融合，在乐趣中建立自己的交易曲线。',
        img: null,
      },
    ];

    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">这里正在发生</h2>
        </div>

        <div className="relative">
          {/* 竖向堆叠卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <motion.div
                key={c.id}
                layout
                onClick={() => setActive(c.id)}
                className="cursor-pointer bg-white select-none overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                {/* 图片占位：若提供 img 则展示图片，否则展示简洁占位块 */}
                {c.img ? (
                  <div className="w-full h-44 sm:h-56 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-44 sm:h-56 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">图片占位</div>
                  </div>
                )}

                {/* 文本区域（简短） */}
                <div className="px-4 py-4">
                  <div className="text-xl font-semibold text-black mb-2">{c.title}</div>
                  <div className="text-gray-600 leading-relaxed text-sm sm:text-base">{c.short}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 展开层：覆盖其他卡片，展示长文案 */}
          <motion.div
            initial={false}
            animate={active ? { opacity: 1, pointerEvents: 'auto' } : { opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20"
          >
            {active && (
              <motion.div
                key={active}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg h-full overflow-y-auto"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="text-2xl font-bold text-black">
                    {cards.find((x) => x.id === active)?.title}
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="shrink-0 px-3 py-1.5 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                  >
                   关闭
                  </button>
                </div>
                <div className="text-gray-700 leading-7 whitespace-pre-line">
                  {cards.find((x) => x.id === active)?.long}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Wonton Football NFT - 足球比分预测平台</title>
        <meta name="description" content="预测足球比分，交易独特NFT" />
      </Head>
      
      <div>
        {/* 第1屏：英雄区域 */}
        <div ref={section1Ref} className="relative w-full h-full min-h-screen flex items-center justify-center pt-[-10px]">
          <canvas
            ref={squares1CanvasRef}
            className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-500 ${
              heroVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div id="hero-content" className="relative z-40 w-full">
            <div ref={heroContentRef} className="mx-auto max-w-3xl text-center px-6 py-6">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Wonton Football NFT
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                预测足球比分，交易独特NFT
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <button className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                  开始竞猜 →
                </button>
                <button className="border-2 border-black text-black hover:bg-gray-100 text-lg px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                  ▶ 观看介绍
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 第2屏：热门NFT展示 */}
        <div ref={section2Ref} className="relative w-full max-w-[1360px] mx-auto px-2 sm:px-4 py-4 min-h-[42vh] bg-white">
           {/* 按要求：只保留横向滚动内容，移除该区块的标题、说明和装饰元素 */}
           <div className="space-y-0">
             {/* 热门比分NFT */}
             <div className="relative z-10">
               <div
                 ref={hotCarouselRef}
                 onMouseEnter={() => setIsHotHover(true)}
                 onMouseLeave={() => setIsHotHover(false)}
                 className="overflow-x-hidden"
                 style={{ '--sep-offset': '-18px' }}
               >
                 <div className="flex gap-0 w-max pr-2 items-center">
                   {[...hotScoreNFTs, ...hotScoreNFTs].map((nft, idx, arr) => (
                     <div className="contents" key={`hot-wrap-${nft.id}-${idx}`}>
                       <motion.div
                         key={`hot-row-${nft.id}-${idx}`}
                         initial={{ opacity: 0, y: 10 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, amount: 0.2 }}
                         transition={{ duration: 0.4 }}
                         className="min-w-[190px] sm:min-w-[210px] h-[64px] sm:h-[72px] bg-white rounded-xl border-none p-2 flex flex-col gap-0 overflow-hidden leading-tight"
                       >
                         <div className="flex items-center justify-between mb-0">
                           <div className="text-sm font-semibold text-gray-900 truncate max-w-[70%]">
                             {(() => {
                               const mt = (nft.match || '').trim();
                               // Pattern: TeamA <score> TeamB, e.g., "A 2-1 B" / "A 2:1 B" / "A 2：1 B"
                               const m = mt.match(/^(.+?)\s*\b\d+\s*[-:：]\s*\d+\b\s*(.+)$/);
                               if (m) {
                                 const left = m[1].trim();
                                 const right = m[2].trim();
                                 return `${left} vs ${right}`;
                               }
                               // Fallback: remove trailing score if any
                               return mt.replace(/\s*\b\d+\s*[-:：]\s*\d+\b.*$/, '').trim();
                             })()}
                           </div>
                           <div className="text-xs font-mono text-gray-700">{nft.score}</div>
                         </div>
                         <div className="flex items-center justify-between text-xs py-0">
                           <span className="text-gray-500">涨跌</span>
                           <span className={`${(typeof nft.change === 'string' && nft.change.startsWith('-')) ? 'text-red-500' : 'text-green-600'} font-medium`}>{nft.change}</span>
                         </div>
                       </motion.div>
                       {idx !== arr.length - 1 && <div className="w-px h-6 self-center mx-1 bg-gray-400" style={{ marginTop: 'var(--sep-offset)' }} />}
                     </div>
                   ))}
                 </div>
               </div>
             </div>

             {/* 特殊NFT */}
             <div className="relative z-10">
               <div
                 ref={specialCarouselRef}
                 onMouseEnter={() => setIsSpecialHover(true)}
                 onMouseLeave={() => setIsSpecialHover(false)}
                 className="overflow-x-hidden"
                 style={{ '--sep-offset': '-18px' }}
               >
                 <div className="flex gap-0 w-max pr-2 items-center">
                   {[...specialNFTs, ...specialNFTs].map((nft, idx, arr) => (
                     <div className="contents" key={`sp-wrap-${nft.id}-${idx}`}>
                       <motion.div
                         key={`sp-row-${nft.id}-${idx}`}
                         initial={{ opacity: 0, y: 10 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, amount: 0.2 }}
                         transition={{ duration: 0.4 }}
                         className="min-w-[190px] sm:min-w-[210px] h-[64px] sm:h-[72px] bg-white rounded-xl border-none p-2 flex flex-col gap-0 overflow-hidden leading-tight"
                       >
                         <div className="flex items-center justify-between mb-0">
                           <div className="text-sm font-semibold text-gray-900 truncate max-w-[70%]">{nft.match || nft.name}</div>
                           {nft.score && (
                             <div className="text-xs font-mono text-gray-700">{nft.score}</div>
                           )}
                         </div>
                         <div className="flex items-center justify-between text-xs py-0">
                           <span className="text-gray-500">涨跌</span>
                           {(() => {
                             const delta = (nft.change ?? nft.trend ?? '').toString();
                             const negative = delta.startsWith('-');
                             return (
                               <span className={`${negative ? 'text-red-500' : 'text-green-600'} font-medium`}>{delta || '--'}</span>
                             );
                           })()}
                         </div>
                       </motion.div>
                       {idx !== arr.length - 1 && <div className="w-px h-6 self-center mx-1 bg-gray-400" style={{ marginTop: 'var(--sep-offset)' }} />}
                     </div>
                   ))}
                 </div>
               </div>
             </div>

             {/* 与走马灯的可见间距（使用固定高度间隔，避免被 space-y-0 覆盖） */}
             <div className="h-20 sm:h-28 md:h-32" />

             {/* 关于展示板块 */}
             <div className="relative z-10 mt-0 text-center">
               <h2 className="text-4xl font-bold text-gray-900 mb-4">彩票就像交易</h2>
               <p className="text-gray-600 max-w-2xl mx-auto">更低手续费 · 更快下单 · 更高赔率</p>
               <div className="mt-4 h-[480px] sm:h-[640px] w-full max-w-[1200px] mx-auto rounded-3xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                 {/* 占位：操作界面动画容器（后续可接入真实动画/Lottie/视频） */}
                 <div className="w-[96%] max-h-[98%] aspect-[16/9] rounded-3xl bg-[#0b0f14] border border-[#1a2330] shadow-sm flex items-center justify-center text-gray-300">
                   <TradeDemoAnim />
                 </div>
               </div>
             </div>
           </div>
         </div>

        {/* 第3屏：Wonton 平台数据 */}
        <div className="w-full max-w-6xl mx-auto px-4 py-16">
          {/* 与上方保持一致的间距 */}
          <div className="h-20 sm:h-28 md:h-32" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Wonton 平台数据</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">链上透明数据，实时增长</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-white px-6 py-4">
                <ul className="h-full flex flex-col justify-between">
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">累计成交额（万 USDC）</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{stats.tvl ?? (typeof latest !== 'undefined' ? latest.tvl : '—')}</span></li>
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">累计用户（千）</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{stats.users ?? (typeof latest !== 'undefined' ? latest.users : '—')}</span></li>
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">支持网络</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">base chain</span></li>
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">合约数</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{stats.contracts}</span></li>
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">平均Gas费(24h)</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{stats.gas24h}</span></li>
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">已铸造NFT</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{stats.minted}</span></li>
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">累计空投价值</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{stats.airdropValue ?? '—'}</span></li>
                  <li className="flex items-baseline justify-between"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">预计空投人数</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{stats.airdropUsers ?? '—'}</span></li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <ParticlePanel />
              </div>
          </div>
        </div>

        {/* 第3.5屏：交易数据（右） + 螺旋动画（左） */}
        <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-12 -mt-[90px]">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 左：螺旋动画 */}
            <div className="bg-white rounded-xl border border-gray-300 p-3">
              <SpiralPanel />
            </div>
            {/* 右：交易数据 */}
            <div className="bg-white rounded-xl border border-white px-6 py-4">
              <ul className="h-full flex flex-col justify-between">
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">24H 成交额（万 USDC）</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.vol24h}</span></li>
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">24H 成交笔数</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.trades24h}</span></li>
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">活跃挂单</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.activeOrders}</span></li>
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">平均成交价</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.avgPrice}</span></li>
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">做市人数</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.makers}</span></li>
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">吃单人数</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.takers}</span></li>
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">手续费</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.fee}</span></li>
                <li className="flex items-baseline justify-between py-1.5 first:pt-0 last:pb-0"><span className="text-black uppercase tracking-wide text-lg sm:text-xl font-semibold">未平仓量</span><span className="text-gray-900 font-mono tabular-nums text-xl sm:text-2xl font-medium">{trading.openInterest}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 第4屏：这里正在发生 */}
        <div className="w-full bg-white">
          {/* 与上方保持一致的间距 */}
          <div className="h-15 sm:h-21 md:h-24" />
          <HappeningNow />
        </div>

        {/* 第5屏：我们的优势 & 联系方式（原第4屏） */}
        <div className="w-full max-w-6xl mx-auto px-4 py-16">
          {/* 与上方保持一致的间距 */}
          <div className="h-20 sm:h-28 md:h-32" />
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">我们的优势</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 rounded-full bg-black mt-2"></span>
                  <div>
                    <div className="font-semibold">极简黑白专业风格</div>
                    <div className="text-sm text-gray-600">统一的交互与视觉规范，沉浸式体验</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 rounded-full bg-black mt-2"></span>
                  <div>
                    <div className="font-semibold">链上透明 · 低手续费</div>
                    <div className="text-sm text-gray-600">基于 ERC1155 与 USDC，平台手续费 1%</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 rounded-full bg-black mt-2"></span>
                  <div>
                    <div className="font-semibold">Polymarket式深度交易</div>
                    <div className="text-sm text-gray-600">订单深度表 + 买卖面板，专业交易体验</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 rounded-full bg-black mt-2"></span>
                  <div>
                    <div className="font-semibold">实时数据接入</div>
                    <div className="text-sm text-gray-600">五大联赛数据与比赛状态实时更新</div>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold mb-6">联系我们</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <div className="text-sm text-gray-500">邮箱</div>
                  <div className="font-medium">contact@wonton.app</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Telegram</div>
                  <div className="font-medium">@wonton_support</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Twitter</div>
                  <div className="font-medium">@wonton_nft</div>
                </div>
                <div className="pt-2">
                  <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">
                   立刻开始
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}