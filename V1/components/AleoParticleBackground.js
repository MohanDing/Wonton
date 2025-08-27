import { useEffect, useRef } from 'react';

const AleoParticleBackground = ({ children }) => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const pointsRef = useRef([]); // {x,y,t}
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!canvas || !content) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isVisible = true; // whether hero is in view

    // Stronger avoidance configuration
    const gridGap = Math.max(16, Math.min(24, Math.floor(Math.min(width, height) / 46))); // slightly denser grid
    const baseDotSize = 1.8; // base dot radius
    const softMargin = 180;  // wide feather band for obvious avoidance
    const hardMargin = 48;   // strong strict empty zone
    const featherPower = 3.2; // aggressive feathering
    const hardCutoffT = 0.35; // within this relative distance, drop all dots
    const repelRadius = 140; // larger influence radius for clearer avoidance
    const repelStrength = 16; // stronger displacement
    const repelFalloff = 1.5; // smoother, stronger near-cursor falloff

    const setCanvasDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const getSafeRect = () => {
      const rect = content.getBoundingClientRect();
      const padX = 16; // extra breathing room
      const padY = 16;
      return {
        x: rect.left - padX,
        y: rect.top - padY,
        w: rect.width + padX * 2,
        h: rect.height + padY * 2,
      };
    };

    const inHardSafe = (x, y, safe) => (
      x > safe.x - hardMargin && x < safe.x + safe.w + hardMargin &&
      y > safe.y - hardMargin && y < safe.y + safe.h + hardMargin
    );

    const softFactor = (x, y, safe) => {
      // 0 inside hard zone, 0..1 within feather band, 1 outside band
      const dx = Math.max(safe.x - x, 0, x - (safe.x + safe.w));
      const dy = Math.max(safe.y - y, 0, y - (safe.y + safe.h));
      const d = Math.sqrt(dx * dx + dy * dy);
      const t = Math.min(1, Math.max(0, d / softMargin));
      return t;
    };

    const buildGrid = () => {
      pointsRef.current = [];
      const safe = getSafeRect();
      const startX = ((width % gridGap) / 2);
      const startY = ((height % gridGap) / 2);
      for (let y = startY; y <= height; y += gridGap) {
        for (let x = startX; x <= width; x += gridGap) {
          if (inHardSafe(x, y, safe)) continue; // strict empty
          const t = softFactor(x, y, safe);
          // Hard cutoff band: remove dots near the edge to make gap obvious
          if (t < hardCutoffT) continue;
          // Feather density: keep probability increases with t
          if (t < 1) {
            const keepProb = Math.pow(t, featherPower);
            if (Math.random() > keepProb) continue;
          }
          pointsRef.current.push({ x, y, t });
        }
      }
    };

    const draw = () => {
      // if hero not visible, skip drawing (canvas opacity is set to 0 by IO)
      if (!isVisible) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const mx = mousePosition.current.x;
      const my = mousePosition.current.y;
      for (let i = 0; i < pointsRef.current.length; i++) {
        const p = pointsRef.current[i];
        let px = p.x;
        let py = p.y;

        // Light mouse repel
        const dx = mx - px;
        const dy = my - py;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < repelRadius) {
          const k = (repelRadius - dist) / repelRadius;
          const eased = Math.pow(k, repelFalloff);
          const shift = eased * repelStrength;
          px -= (dx / dist) * shift;
          py -= (dy / dist) * shift;
        }

        // Opacity/size feathering by distance factor t (previous softer look)
        const size = baseDotSize * (0.85 + 0.25 * Math.min(1, p.t * 1.2));
        const alpha = 0.95 * (0.55 + 0.45 * Math.pow(p.t, 1.4));
        ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    };

    const animate = () => {
      draw();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      mousePosition.current.x = e.touches[0].clientX;
      mousePosition.current.y = e.touches[0].clientY;
    };

    const handleResize = () => {
      setCanvasDimensions();
      buildGrid();
    };

    // Optional: rebuild when hero content resizes
    const ro = new ResizeObserver(() => {
      buildGrid();
    });
    ro.observe(content);

    // Hide particles when hero content is not in view (only show on first screen)
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      // fade via CSS
      canvas.style.opacity = isVisible ? '1' : '0';
      // when not visible, clear canvas immediately
      if (!isVisible) {
        ctx.clearRect(0, 0, width, height);
      }
    }, { threshold: 0.1 });
    io.observe(content);

    // init
    setCanvasDimensions();
    buildGrid();
    animate();

    // events
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // cleanup
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-300"
      />
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AleoParticleBackground;
