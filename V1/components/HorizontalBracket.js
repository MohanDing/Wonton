import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useImperativeHandle } from 'react'

// Horizontal symmetric knockout bracket
// API
// - data: {
//     left: Round[];  // outer -> inner, e.g. R16, QF, SF
//     right: Round[]; // outer -> inner, e.g. R16, QF, SF
//     final: Match;   // center final
//   }
// - showTeams: boolean (default false). When false or when team name is missing, render placeholders.
// - title: optional string for header
// - onMatchClick: optional (match) => void
// Types
// - type Match = { id?: string; home?: string | null; away?: string | null }
// - type Round = Match[]

const Slot = React.forwardRef(function Slot({ label, muted = false, style, className = '' }, ref) {
  return (
    <div ref={ref} style={style} className={`px-3 py-2 rounded-md border text-sm whitespace-nowrap bg-white/5 ${muted ? 'text-black border-neutral-700' : 'text-black border-neutral-600'} ${className}`}>
      {label}
    </div>
  )
})

const MatchBox = React.forwardRef(function MatchBox({ match, showTeams, onClick, boxWidth = 120, orientation = 'vertical', homeOffsetY = 0, awayOffsetY = 0 }, ref) {
  const homeLabel = showTeams && match?.home ? match.home : '——'
  const awayLabel = showTeams && match?.away ? match.away : '——'
  const isEmpty = homeLabel === '——' && awayLabel === '——'
  const rootRef = useRef(null)
  const homeRef = useRef(null)
  const awayRef = useRef(null)

  useImperativeHandle(ref, () => ({ rootEl: rootRef.current, homeEl: homeRef.current, awayEl: awayRef.current }))

  return (
    <div
      ref={rootRef}
      className={`flex ${orientation === 'horizontal' ? 'flex-row items-center gap-2' : 'flex-col gap-1'} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ minWidth: boxWidth }}
      onClick={onClick ? () => onClick(match) : undefined}
    >
      <Slot
        ref={homeRef}
        label={homeLabel}
        muted={isEmpty}
        className="smooth-transform"
        style={{ transform: `translate3d(0, ${homeOffsetY}px, 0)` }}
      />
      {orientation === 'horizontal' ? <span className="!text-black text-xs">vs</span> : null}
      <Slot
        ref={awayRef}
        label={awayLabel}
        muted={isEmpty}
        className="smooth-transform"
        style={{ transform: `translate3d(0, ${awayOffsetY}px, 0)` }}
      />
    </div>
  )
})

function RoundColumn({ roundMatches = [], showTeams, onMatchClick, refsArray, boxWidth }) {
  return (
    <div className="flex flex-col items-center">
      {roundMatches.map((m, idx) => (
        <div key={m?.id || idx} className="flex flex-col items-center">
          <MatchBox ref={el => (refsArray.current[idx] = el)} match={m} showTeams={showTeams} onClick={onMatchClick} boxWidth={boxWidth} />
        </div>
      ))}
    </div>
  )
}

function buildEmptyRounds(levels, firstRoundMatches) {
  // Create placeholder structure for one side
  // Example: levels=3, firstRoundMatches=8 -> [8,4,2]
  const rounds = []
  let n = firstRoundMatches
  for (let i = 0; i < levels; i += 1) {
    rounds.push(Array.from({ length: n }, (_, k) => ({ id: `R${i + 1}-${k + 1}` })))
    n = Math.max(1, Math.floor(n / 2))
  }
  return rounds
}

function useResizeObserver(targetRef, cb) {
  useEffect(() => {
    if (!targetRef.current) return
    let scheduled = false
    const schedule = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        cb()
      })
    }
    const ro = new ResizeObserver(schedule)
    ro.observe(targetRef.current)
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', schedule)
    }
  }, [targetRef, cb])
}

// shallow 2D array near-equality check for numeric offsets (tolerate sub-pixel noise)
function arrays2DNearEqual(a = [], b = [], eps = 0.5) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    const ai = a[i] || []
    const bi = b[i] || []
    if (ai.length !== bi.length) return false
    for (let j = 0; j < ai.length; j += 1) {
      const av = ai[j] || 0
      const bv = bi[j] || 0
      if (Math.abs(av - bv) > eps) return false
    }
  }
  return true
}

function quantizeOffset(offset, step = 0.5, epsilon = 0.5) {
  return Math.round(offset / step) * step
}

function linesNearEqual(a = [], b = [], eps = 1) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    const ai = a[i] || {}
    const bi = b[i] || {}
    if (Math.abs(ai.x1 - bi.x1) > eps || Math.abs(ai.y1 - bi.y1) > eps || Math.abs(ai.x2 - bi.x2) > eps || Math.abs(ai.y2 - bi.y2) > eps) return false
  }
  return true
}

export default function HorizontalBracket({
  data,
  showTeams = false,
  title = 'Cup Bracket',
  onMatchClick,
  // Fallback shape when data is not fully provided
  levels = 3, // Rounds per side: e.g., 3 => R16->QF->SF (per side), then Final
  firstRoundMatchesPerSide = 4, // number of matches in the outer-most round per side
  baseGap = 24, // base vertical gap between matches in the outer-most round (px)
  columnPaddingY = 12, // vertical padding for each round column (px)
  matchMinWidth = 120, // min width per match box (px)
  // Stability tuning
  offsetEpsilon = 1.5, // px tolerance for offsets
  lineEpsilon = 1.5, // px tolerance for polyline updates
  quantizeStep = 1, // px step to snap offsets
  measureDelayMs = 340, // delay after transform before measuring lines
  slotMinGapPx = 6, // minimal visual gap between home/away after transforms to avoid overlap
  showConnectors = false, // whether to render connector lines
  autoAlignParents = false, // disable parent-centering offsets when false
  centerOnce = true, // compute offsets once (and on resize/data change) to avoid oscillation
  // Round headers
  showRoundHeaders = true,
  roundLabelsLeft = [], // e.g. ['16强', '8强', '半决赛'] from outer->inner
  roundLabelsRight = [], // e.g. ['16强', '8强', '半决赛'] from outer->inner
  finalLabel = '决赛',
}) {
  const leftRounds = data?.left && data.left.length ? data.left : buildEmptyRounds(levels, firstRoundMatchesPerSide)
  const rightRounds = data?.right && data.right.length ? data.right : buildEmptyRounds(levels, firstRoundMatchesPerSide)
  const finalMatch = data?.final || { id: 'F1' }

  // Refs for measuring
  const containerRef = useRef(null)
  const leftRefs = useMemo(() => leftRounds.map(() => ({ current: [] })), [leftRounds])
  const rightRefs = useMemo(() => rightRounds.map(() => ({ current: [] })), [rightRounds])
  const finalRef = useRef(null)

  const [lines, setLines] = useState([])
  // Per-slot offsets: [round][matchIdx] => { home: number, away: number }
  const [offsetsLeft, setOffsetsLeft] = useState([])
  const [offsetsRight, setOffsetsRight] = useState([])
  const [finalSlotOffsets, setFinalSlotOffsets] = useState({ home: 0, away: 0 })

  const measure = () => {
    if (!containerRef.current) return
    const ctnRect = containerRef.current.getBoundingClientRect()
    const segments = []

    // helper to get midpoint on a given side of element
    const mid = (el, side = 'right') => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      const x = side === 'right' ? r.right - ctnRect.left : r.left - ctnRect.left
      const y = r.top - ctnRect.top + r.height / 2
      return { x, y }
    }
    const centerY = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return r.top - ctnRect.top + r.height / 2
    }

    // Helpers to collect centers per slot
    const slotCentersForRound = (refsArr) => (refsArr.current || []).map(n => ({ home: centerY(n?.homeEl), away: centerY(n?.awayEl) }))

    // LEFT: desired slot Y recursion: desired[r][j] = { home, away }
    const leftDesiredSlots = leftRefs.map(() => [])
    if (leftRefs.length > 0) {
      leftDesiredSlots[0] = slotCentersForRound(leftRefs[0])
      for (let r = 1; r < leftRefs.length; r += 1) {
        const prevDesired = leftDesiredSlots[r - 1]
        const currRefs = leftRefs[r]
        leftDesiredSlots[r] = []
        for (let j = 0; j < (currRefs.current || []).length; j += 1) {
          const childA = prevDesired[2 * j] || {}
          const childB = prevDesired[2 * j + 1] || {}
          const homeTarget = (childA.home != null && childA.away != null) ? (childA.home + childA.away) / 2 : null
          const awayTarget = (childB.home != null && childB.away != null) ? (childB.home + childB.away) / 2 : null
          leftDesiredSlots[r][j] = { home: homeTarget, away: awayTarget }
        }
      }
    }
    const nextOffsetsLeft = leftRefs.map((_, r) => {
      const curr = leftRefs[r].current || []
      return curr.map((n, j) => {
        const target = leftDesiredSlots?.[r]?.[j] || {}
        const homeC = centerY(n?.homeEl)
        const awayC = centerY(n?.awayEl)
        const homeH = n?.homeEl?.getBoundingClientRect?.().height || 0
        const awayH = n?.awayEl?.getBoundingClientRect?.().height || 0
        const homeRaw = (target.home != null && homeC != null) ? (target.home - homeC) : 0
        const awayRaw = (target.away != null && awayC != null) ? (target.away - awayC) : 0
        const adjusted = adjustPair({ homeC: homeC || 0, awayC: awayC || 0, homeH, awayH, homeRaw, awayRaw, minGap: slotMinGapPx })
        return { home: quantizeOffset(adjusted.home, quantizeStep, offsetEpsilon / 2), away: quantizeOffset(adjusted.away, quantizeStep, offsetEpsilon / 2) }
      })
    })

    // RIGHT: desired slot Y recursion
    const rightDesiredSlots = rightRefs.map(() => [])
    if (rightRefs.length > 0) {
      rightDesiredSlots[0] = slotCentersForRound(rightRefs[0])
      for (let r = 1; r < rightRefs.length; r += 1) {
        const prevDesired = rightDesiredSlots[r - 1]
        const currRefs = rightRefs[r]
        rightDesiredSlots[r] = []
        for (let j = 0; j < (currRefs.current || []).length; j += 1) {
          const childA = prevDesired[2 * j] || {}
          const childB = prevDesired[2 * j + 1] || {}
          const homeTarget = (childA.home != null && childA.away != null) ? (childA.home + childA.away) / 2 : null
          const awayTarget = (childB.home != null && childB.away != null) ? (childB.home + childB.away) / 2 : null
          rightDesiredSlots[r][j] = { home: homeTarget, away: awayTarget }
        }
      }
    }
    const nextOffsetsRight = rightRefs.map((_, r) => {
      const curr = rightRefs[r].current || []
      return curr.map((n, j) => {
        const target = rightDesiredSlots?.[r]?.[j] || {}
        const homeC = centerY(n?.homeEl)
        const awayC = centerY(n?.awayEl)
        const homeH = n?.homeEl?.getBoundingClientRect?.().height || 0
        const awayH = n?.awayEl?.getBoundingClientRect?.().height || 0
        const homeRaw = (target.home != null && homeC != null) ? (target.home - homeC) : 0
        const awayRaw = (target.away != null && awayC != null) ? (target.away - awayC) : 0
        const adjusted = adjustPair({ homeC: homeC || 0, awayC: awayC || 0, homeH, awayH, homeRaw, awayRaw, minGap: slotMinGapPx })
        return { home: quantizeOffset(adjusted.home, quantizeStep, offsetEpsilon / 2), away: quantizeOffset(adjusted.away, quantizeStep, offsetEpsilon / 2) }
      })
    })

    // Final: compute desired for final home from all left innermost slots, and final away from all right innermost slots
    const leftLast = leftDesiredSlots[leftDesiredSlots.length - 1] || []
    const rightLast = rightDesiredSlots[rightDesiredSlots.length - 1] || []
    const avgVals = (vals) => {
      const f = vals.filter(v => v != null)
      if (!f.length) return null
      return f.reduce((a, b) => a + b, 0) / f.length
    }
    const leftAllSlotCenters = leftLast.flatMap(x => [x?.home, x?.away]).filter(v => v != null)
    const rightAllSlotCenters = rightLast.flatMap(x => [x?.home, x?.away]).filter(v => v != null)
    const finalHomeTarget = avgVals(leftAllSlotCenters)
    const finalAwayTarget = avgVals(rightAllSlotCenters)
    const currFinalHomeC = centerY(finalRef.current?.homeEl)
    const currFinalAwayC = centerY(finalRef.current?.awayEl)
    const fHomeH = finalRef.current?.homeEl?.getBoundingClientRect?.().height || 0
    const fAwayH = finalRef.current?.awayEl?.getBoundingClientRect?.().height || 0
    const fHomeRaw = (finalHomeTarget != null && currFinalHomeC != null) ? (finalHomeTarget - currFinalHomeC) : 0
    const fAwayRaw = (finalAwayTarget != null && currFinalAwayC != null) ? (finalAwayTarget - currFinalAwayC) : 0
    const fAdjusted = adjustPair({ homeC: currFinalHomeC || 0, awayC: currFinalAwayC || 0, homeH: fHomeH, awayH: fAwayH, homeRaw: fHomeRaw, awayRaw: fAwayRaw, minGap: slotMinGapPx })
    const nextFinal = {
      home: quantizeOffset(fAdjusted.home, quantizeStep, offsetEpsilon / 2),
      away: quantizeOffset(fAdjusted.away, quantizeStep, offsetEpsilon / 2)
    }

    // If auto centering is disabled, zero-out offsets and skip building lines
    if (!autoAlignParents) {
      const zeroLeft = leftRefs.map(r => (r.current || []).map(() => ({ home: 0, away: 0 })))
      const zeroRight = rightRefs.map(r => (r.current || []).map(() => ({ home: 0, away: 0 })))
      const arraysSlotsNearEqual = (a = [], b = [], eps = 1) => {
        if ((a?.length || 0) !== (b?.length || 0)) return false
        for (let i = 0; i < a.length; i += 1) {
          const ai = a[i] || []
          const bi = b[i] || []
          if ((ai?.length || 0) !== (bi?.length || 0)) return false
          for (let j = 0; j < ai.length; j += 1) {
            const av = ai[j] || { home: 0, away: 0 }
            const bv = bi[j] || { home: 0, away: 0 }
            if (Math.abs((av.home || 0) - (bv.home || 0)) > eps) return false
            if (Math.abs((av.away || 0) - (bv.away || 0)) > eps) return false
          }
        }
        return true
      }
      const finalNearEqual = (a = {home:0, away:0}, b = {home:0, away:0}, eps = 1) => (
        Math.abs((a.home||0) - (b.home||0)) <= eps && Math.abs((a.away||0) - (b.away||0)) <= eps
      )
      setOffsetsLeft(prev => (arraysSlotsNearEqual(prev, zeroLeft, offsetEpsilon) ? prev : zeroLeft))
      setOffsetsRight(prev => (arraysSlotsNearEqual(prev, zeroRight, offsetEpsilon) ? prev : zeroRight))
      setFinalSlotOffsets(prev => (finalNearEqual(prev, {home:0, away:0}, offsetEpsilon) ? prev : {home:0, away:0}))
      // Do not update lines when auto-alignment is off
      return
    }

    // If offsets changed, update them first and return; we'll measure lines next frame.
    const arraysSlotsNearEqual = (a = [], b = [], eps = 1) => {
      if ((a?.length || 0) !== (b?.length || 0)) return false
      for (let i = 0; i < a.length; i += 1) {
        const ai = a[i] || []
        const bi = b[i] || []
        if ((ai?.length || 0) !== (bi?.length || 0)) return false
        for (let j = 0; j < ai.length; j += 1) {
          const av = ai[j] || { home: 0, away: 0 }
          const bv = bi[j] || { home: 0, away: 0 }
          if (Math.abs((av.home || 0) - (bv.home || 0)) > eps) return false
          if (Math.abs((av.away || 0) - (bv.away || 0)) > eps) return false
        }
      }
      return true
    }

    const finalNearEqual = (a = {home:0, away:0}, b = {home:0, away:0}, eps = 1) => (
      Math.abs((a.home||0) - (b.home||0)) <= eps && Math.abs((a.away||0) - (b.away||0)) <= eps
    )

    const offsetsChanged = !arraysSlotsNearEqual(offsetsLeft, nextOffsetsLeft, offsetEpsilon) || !arraysSlotsNearEqual(offsetsRight, nextOffsetsRight, offsetEpsilon) || !finalNearEqual(finalSlotOffsets, nextFinal, offsetEpsilon)
    if (offsetsChanged) {
      setOffsetsLeft(prev => (arraysSlotsNearEqual(prev, nextOffsetsLeft, offsetEpsilon) ? prev : nextOffsetsLeft))
      setOffsetsRight(prev => (arraysSlotsNearEqual(prev, nextOffsetsRight, offsetEpsilon) ? prev : nextOffsetsRight))
      setFinalSlotOffsets(prev => (finalNearEqual(prev, nextFinal, offsetEpsilon) ? prev : nextFinal))
      return
    }

    // Left side connectors (shared trunks per parent to avoid overlapping segments)
    for (let r = 0; r < leftRefs.length; r += 1) {
      const current = leftRefs[r].current
      const isFinalHop = r >= leftRefs.length - 1
      const next = isFinalHop ? [finalRef.current] : leftRefs[r + 1].current
      if (!current || !next) continue

      if (!isFinalHop) {
        for (let i = 0; i < current.length; i += 2) {
          const a = current[i]
          const b = current[i + 1]
          const parent = next[Math.floor(i / 2)]
          if (!parent) continue
          const pTo = mid(parent?.homeEl, 'left')
          if (!pTo) continue
          const pAH = mid(a?.homeEl, 'right')
          const pAA = mid(a?.awayEl, 'right')
          const pBH = mid(b?.homeEl, 'right')
          const pBA = mid(b?.awayEl, 'right')
          const children = [pAH, pAA, pBH, pBA].filter(Boolean)
          if (!children.length) continue
          const midX = (Math.min(...children.map(p => p.x)) + pTo.x) / 2
          for (const p of children) segments.push({ x1: p.x, y1: p.y, x2: midX, y2: p.y })
          const minY = Math.min(...children.map(p => p.y))
          const maxY = Math.max(...children.map(p => p.y))
          segments.push({ x1: midX, y1: minY, x2: midX, y2: maxY })
          segments.push({ x1: midX, y1: pTo.y, x2: pTo.x, y2: pTo.y })
        }
      } else {
        for (let i = 0; i < current.length; i += 1) {
          const parent = next[0]
          const pTo = mid(parent?.homeEl, 'left')
          const pH = mid(current[i]?.homeEl, 'right')
          const pA = mid(current[i]?.awayEl, 'right')
          if (pH && pTo) segments.push({ x1: pH.x, y1: pH.y, x2: pTo.x, y2: pTo.y })
          if (pA && pTo) segments.push({ x1: pA.x, y1: pA.y, x2: pTo.x, y2: pTo.y })
        }
      }
    }

    // Right side connectors (shared trunks per parent)
    for (let r = 0; r < rightRefs.length; r += 1) {
      const current = rightRefs[r].current
      const isFinalHop = r >= rightRefs.length - 1
      const next = isFinalHop ? [finalRef.current] : rightRefs[r + 1].current
      if (!current || !next) continue

      if (!isFinalHop) {
        for (let i = 0; i < current.length; i += 2) {
          const a = current[i]
          const b = current[i + 1]
          const parent = next[Math.floor(i / 2)]
          if (!parent) continue
          const pTo = mid(parent?.awayEl, 'right')
          if (!pTo) continue
          const pAH = mid(a?.homeEl, 'left')
          const pAA = mid(a?.awayEl, 'left')
          const pBH = mid(b?.homeEl, 'left')
          const pBA = mid(b?.awayEl, 'left')
          const children = [pAH, pAA, pBH, pBA].filter(Boolean)
          if (!children.length) continue
          const midX = (pTo.x + Math.max(...children.map(p => p.x))) / 2
          for (const p of children) segments.push({ x1: p.x, y1: p.y, x2: midX, y2: p.y })
          const minY = Math.min(...children.map(p => p.y))
          const maxY = Math.max(...children.map(p => p.y))
          segments.push({ x1: midX, y1: minY, x2: midX, y2: maxY })
          segments.push({ x1: midX, y1: pTo.y, x2: pTo.x, y2: pTo.y })
        }
      } else {
        for (let i = 0; i < current.length; i += 1) {
          const parent = next[0]
          const pTo = mid(parent?.awayEl, 'right')
          const pH = mid(current[i]?.homeEl, 'left')
          const pA = mid(current[i]?.awayEl, 'left')
          if (pH && pTo) segments.push({ x1: pH.x, y1: pH.y, x2: pTo.x, y2: pTo.y })
          if (pA && pTo) segments.push({ x1: pA.x, y1: pA.y, x2: pTo.x, y2: pTo.y })
        }
      }
    }

    // Snap to pixel grid to reduce anti-aliased shimmer/ghosting
    const snap = (v) => Math.round(v)
    const snapped = segments.map(s => ({ x1: snap(s.x1), y1: snap(s.y1), x2: snap(s.x2), y2: snap(s.y2) }))
    if (showConnectors) {
      setLines(prev => (linesNearEqual(prev, snapped, lineEpsilon) ? prev : snapped))
    }
  }

  const adjustPair = ({ homeC, awayC, homeH, awayH, homeRaw, awayRaw, minGap }) => {
    const targetHome = homeC + homeRaw
    const targetAway = awayC + awayRaw
    const required = (homeH / 2) + (awayH / 2) + (minGap || 0)
    const gap = targetAway - targetHome
    if (!(isFinite(required) && isFinite(gap))) return { home: homeRaw, away: awayRaw }
    if (gap >= required) return { home: homeRaw, away: awayRaw }
    const deficit = required - gap
    // push apart equally to preserve the mid-point as much as possible
    return { home: homeRaw - deficit / 2, away: awayRaw + deficit / 2 }
  }

  useLayoutEffect(() => {
    // measure after first paint
    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  }, [leftRounds, rightRounds, showTeams, baseGap, columnPaddingY, matchMinWidth])

  useResizeObserver(containerRef, (autoAlignParents || showConnectors) ? measure : () => {})

  // Re-measure after transforms settle (match transition ~260ms)
  useEffect(() => {
    // Only schedule a post-transform re-measure when we are actively animating toward targets.
    // If centerOnce is true, we avoid chaining re-measures on offset changes to prevent feedback.
    if (!(autoAlignParents || showConnectors)) return
    if (centerOnce) return
    const timer = setTimeout(() => {
      measure()
    }, measureDelayMs)
    return () => clearTimeout(timer)
  }, [offsetsLeft, offsetsRight, finalSlotOffsets, autoAlignParents, showConnectors, centerOnce])

  return (
    <div className="w-full overflow-x-auto py-4">
      <div ref={containerRef} className="relative min-w-[1000px]">
        {/* SVG connectors (optional) */}
        {showConnectors ? (
          <svg
            className="pointer-events-none absolute inset-0"
            width="100%"
            height="100%"
            style={{ opacity: 1 }}
          >
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="#52525b"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                shapeRendering="crispEdges"
              />
            ))}
          </svg>
        ) : null}

        {/* local styles for smooth transitions */}
        <style jsx>{`
          .smooth-transform {
            transition: transform 260ms cubic-bezier(.2,.8,.2,1);
            will-change: transform;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            contain: layout paint;
          }
          .smooth-transform svg { isolation: isolate; }
        `}</style>

        {title ? (
          <div className="mb-4 text-lg font-semibold text-black">
            {title}
          </div>
        ) : null}

        <div className="relative flex items-stretch gap-6">
          {/* Left side: outer -> inner */}
          {leftRounds.map((round, rIdx) => (
            <div
              key={`L-${rIdx}`}
              className="flex flex-col justify-center"
              style={{
                gap: 8, // minimize structural gap so transforms dominate positioning
                paddingTop: columnPaddingY,
                paddingBottom: columnPaddingY,
                transition: 'gap 260ms cubic-bezier(.2,.8,.2,1), padding 260ms cubic-bezier(.2,.8,.2,1)'
              }}
            >
              {/* Round header (left) */}
              {showRoundHeaders ? (
                <div className="text-xs text-black mb-1 text-center min-h-[16px]">
                  {roundLabelsLeft?.[rIdx] || null}
                </div>
              ) : null}
              <div className="flex flex-col items-center" style={{ gap: 8, transition: 'gap 260ms cubic-bezier(.2,.8,.2,1)' }}>
                {round.map((m, idx) => (
                  <div key={m?.id || idx} className="flex flex-col items-center">
                    <MatchBox
                      ref={el => (leftRefs[rIdx].current[idx] = el)}
                      match={m}
                      showTeams={showTeams}
                      onClick={onMatchClick}
                      boxWidth={matchMinWidth}
                      homeOffsetY={offsetsLeft?.[rIdx]?.[idx]?.home || 0}
                      awayOffsetY={offsetsLeft?.[rIdx]?.[idx]?.away || 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Center Final */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="text-xs text-black mb-1">{finalLabel}</div>
                <MatchBox
                  ref={finalRef}
                  match={finalMatch}
                  showTeams={showTeams}
                  onClick={onMatchClick}
                  boxWidth={matchMinWidth}
                  orientation="horizontal"
                  homeOffsetY={finalSlotOffsets.home}
                  awayOffsetY={finalSlotOffsets.away}
                />
              </div>
            </div>
          </div>

          {/* Right side: inner <- outer (render visually outer at far right) */}
          {[...rightRounds].reverse().map((round, rIdx) => (
            <div
              key={`R-${rIdx}`}
              className="flex flex-col justify-center"
              style={{
                gap: 8, // minimize structural gap so transforms dominate positioning
                paddingTop: columnPaddingY,
                paddingBottom: columnPaddingY,
                transition: 'gap 260ms cubic-bezier(.2,.8,.2,1), padding 260ms cubic-bezier(.2,.8,.2,1)'
              }}
            >
              {/* Round header (right). Map visual index back to original outer->inner index */}
              {showRoundHeaders ? (
                <div className="text-xs text-black mb-1 text-center min-h-[16px]">
                  {roundLabelsRight?.[(rightRounds.length - 1) - rIdx] || null}
                </div>
              ) : null}
              <div className="flex flex-col items-center" style={{ gap: 8, transition: 'gap 260ms cubic-bezier(.2,.8,.2,1)' }}>
                {round.map((m, idx) => (
                  <div key={m?.id || idx} className="flex flex-col items-center">
                    <MatchBox
                      ref={el => (rightRefs[(rightRounds.length - 1) - rIdx].current[idx] = el)}
                      match={m}
                      showTeams={showTeams}
                      onClick={onMatchClick}
                      boxWidth={matchMinWidth}
                      homeOffsetY={offsetsRight?.[(rightRounds.length - 1) - rIdx]?.[idx]?.home || 0}
                      awayOffsetY={offsetsRight?.[(rightRounds.length - 1) - rIdx]?.[idx]?.away || 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}