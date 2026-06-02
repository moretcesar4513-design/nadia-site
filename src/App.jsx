import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useScroll, useTransform,
} from 'framer-motion'

// ── Brand logo
import nadiaLogo from './assets/1-removebg-preview copie.png'

// ── Testimonial screenshots
import screenshotHugo from './assets/screenshot-hugo.png'
import screenshotMohammed from './assets/screenshot-mohammed.png'
import screenshotMatthieu from './assets/screenshot-matthieu.png'
import screenshotAxel from './assets/screenshot-axel.png'

// ── Agent photos
import elioPhoto from './assets/elio copie.png'
import sofiaPhoto from './assets/sofia.jpg  copie.png'
import mayaPhoto from './assets/maya copie.png'
import tomPhoto from './assets/tom copie.png'
import claraPhoto from './assets/Clara copie.png'

// ── Partner / trust logos
import leboncoinLogo from './assets/Leboncoin_id-dyn5xZ__0.png'
import selogerLogo from './assets/SeLoger_idckfxjCfg_0.png'
import orpiLogo from './assets/Orpi_id-HpgxvVQ_0.svg'
import fonciaLogo from './assets/FONCIA_idHPec7iKw_0.png'
import laforetLogo from './assets/Laforêt_France_idgmBOWiPg_0.png'
import logicLogo from './assets/Logic_idtRkIQ4i1_0.png'
import meilleursAgentsLogo from './assets/Meilleurs_Agents_idCda2S_wm_0.png'
import century21Logo from './assets/Century_21_id7ge-1BWF_0.svg'

// ── Integration tool logos
import gmailIcon from './assets/gmail.svg'
import slackIcon from './assets/slack.svg'
import whatsappIcon from './assets/whatsapp-icon.svg'
import gcalIcon from './assets/google-calendar.svg'
import gmeetIcon from './assets/google-meet.svg'
import instagramIcon from './assets/instagram-icon.svg'
import wordpressIcon from './assets/wordpress.svg'
import salesforceIcon from './assets/salesforce.svg'
import webflowIcon from './assets/webflow.svg'
import canvaIcon from './assets/canva.svg'
import trelloIcon from './assets/trello.svg'
import calendlyIcon from './assets/calendly.svg'

const CTA_URL = 'https://cal.com/cesar-moret-iebmmv/30min'
const PRM = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// ── Shared design tokens ───────────────────────────────────────────────────────
const glass = {
  background: 'rgba(255,255,255,0.028)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  border: '1px solid rgba(255,255,255,0.08)',
  position: 'relative',
  overflow: 'hidden',
}
const glassActive = { border: '1px solid rgba(192,0,10,0.35)' }

const ctaBase = {
  background: 'linear-gradient(135deg, #e0000a, #8b0000)',
  borderRadius: '50px',
  fontWeight: 600,
  boxShadow: '0 8px 32px rgba(192,0,10,0.38)',
  color: '#fff',
  border: 'none',
  cursor: 'none',
  fontSize: '16px',
  textDecoration: 'none',
  display: 'inline-block',
  position: 'relative',
  overflow: 'hidden',
  willChange: 'transform',
}

// ── Light reflex overlay (top of glass cards) ─────────────────────────────────
function GlassReflex() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '46%',
      background: 'linear-gradient(180deg,rgba(255,255,255,0.055) 0%,transparent 100%)',
      pointerEvents: 'none', zIndex: 1, borderRadius: 'inherit',
    }} />
  )
}

// ── Glass card with tilt + light sweep ────────────────────────────────────────
function GlassCard({ children, style = {}, tilt = false }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 70, damping: 16 })
  const sry = useSpring(ry, { stiffness: 70, damping: 16 })

  const onMove = (e) => {
    if (!tilt || !ref.current || PRM) return
    const r = ref.current.getBoundingClientRect()
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -10)
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
  }
  const onLeave = () => { rx.set(0); ry.set(0); setHovered(false) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ ...glass, ...style, rotateX: tilt ? srx : 0, rotateY: tilt ? sry : 0, willChange: 'transform' }}
    >
      <GlassReflex />
      {!PRM && (
        <motion.div
          animate={{ x: hovered ? '320%' : '-120%' }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0, width: '28%',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',
            transform: 'skewX(-18deg)', pointerEvents: 'none', zIndex: 2,
          }}
        />
      )}
      {children}
    </motion.div>
  )
}

// ── Magnetic + ripple CTA button ──────────────────────────────────────────────
function CTAButton({ href, style = {}, children, target = '_blank' }) {
  const ref = useRef(null)
  const [ripples, setRipples] = useState([])
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 110, damping: 14, mass: 0.3 })
  const smy = useSpring(my, { stiffness: 110, damping: 14, mass: 0.3 })

  const onMove = (e) => {
    if (PRM || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width / 2) * 0.28)
    my.set((e.clientY - r.top - r.height / 2) * 0.28)
  }
  const onLeave = () => { mx.set(0); my.set(0) }
  const onClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples(p => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    setTimeout(() => setRipples(p => p.filter(rp => rp.id !== id)), 750)
  }

  return (
    <motion.a
      ref={ref} href={href} data-cta="true"
      target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      style={{ ...ctaBase, padding: '18px 36px', ...style, x: smx, y: smy }}
    >
      {children}
      {ripples.map(r => (
        <motion.span key={r.id}
          initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute', pointerEvents: 'none',
            left: r.x - 20, top: r.y - 20,
            width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.22)',
          }}
        />
      ))}
    </motion.a>
  )
}

// ── Photo placeholder ─────────────────────────────────────────────────────────
function PhotoPlaceholder({ name, width = '100%', height = '100%', round = false }) {
  return (
    <div style={{
      width, height,
      borderRadius: round ? '50%' : '16px',
      border: '2px dashed rgba(192,0,10,0.38)',
      background: 'rgba(192,0,10,0.04)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '8px', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,0,10,0.6)'; e.currentTarget.style.background = 'rgba(192,0,10,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(192,0,10,0.38)'; e.currentTarget.style.background = 'rgba(192,0,10,0.04)' }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(192,0,10,0.5)" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3.5" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '10px', textAlign: 'center', lineHeight: 1.4, margin: 0, padding: '0 8px' }}>
        Ajouter photo<br /><span style={{ color: 'rgba(192,0,10,0.5)' }}>{name}</span>
      </p>
    </div>
  )
}

// ── Logo placeholder ──────────────────────────────────────────────────────────
function LogoPlaceholder() {
  return (
    <div style={{
      width: '120px', height: '40px',
      border: '1.5px dashed rgba(192,0,10,0.4)',
      borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      cursor: 'pointer', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(224,0,10,0.7)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(192,0,10,0.4)')}
    >
      <span style={{ color: 'rgba(192,0,10,0.55)', fontSize: '14px', lineHeight: 1 }}>+</span>
      <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', fontWeight: 500 }}>Ajouter logo</span>
    </div>
  )
}

// ── Scramble + count-up animation ─────────────────────────────────────────────
const CHARS = '0123456789'
function ScrambleCounter({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!inView) return
    const match = value.match(/^([^0-9]*)(\d+)([^0-9]*)$/)
    if (!match) { setDisplay(value); return }
    const [, pre, numStr, suf] = match
    const target = parseInt(numStr, 10)
    const start = performance.now()
    const scrambleDur = PRM ? 0 : 450
    const countDur = PRM ? 0 : 1100

    const tick = (now) => {
      const el = now - start
      if (el < scrambleDur) {
        const sc = numStr.split('').map(() => CHARS[Math.floor(Math.random() * 10)]).join('')
        setDisplay(`${pre}${sc}${suf}`)
        requestAnimationFrame(tick)
      } else {
        const t = Math.min((el - scrambleDur) / countDur, 1)
        const v = Math.round((1 - Math.pow(1 - t, 3)) * target)
        setDisplay(`${pre}${v}${suf}`)
        if (t < 1) requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)
  }, [inView, value])

  return <span ref={ref}>{display}</span>
}

// ── Section title with sweep line + underline ─────────────────────────────────
function SectionTitle({ label, children, mobile, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <div ref={ref} style={style}>
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: 2, width: 48, background: 'linear-gradient(90deg,#e0000a,transparent)', transformOrigin: 'left', margin: '0 auto 14px' }}
      />
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.18, duration: 0.38 }}
        style={{ color: '#e0000a', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}
      >{label}</motion.p>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <motion.h2
          initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.28, duration: 0.52 }}
          style={{ fontSize: mobile ? '30px' : '50px', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1 }}
        >{children}</motion.h2>
        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.65, duration: 0.45 }}
          style={{ position: 'absolute', bottom: '-6px', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#e0000a,rgba(224,0,10,0.2),transparent)', transformOrigin: 'left' }}
        />
      </div>
    </div>
  )
}

// ── Stagger helpers ───────────────────────────────────────────────────────────
const cV = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const iV = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } } }

function StaggerWrap({ children, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return <motion.div ref={ref} variants={cV} initial="hidden" animate={inView ? 'show' : 'hidden'} style={style}>{children}</motion.div>
}
function SI({ children, style = {} }) {
  return <motion.div variants={iV} style={style}>{children}</motion.div>
}

// ── Global background: orbs, grain, grid, aurora ──────────────────────────────
const GRAIN_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E"

function GlobalBg() {
  const { scrollY } = useScroll()
  const o1y = useTransform(scrollY, [0, 3000], [0, -280])
  const o2y = useTransform(scrollY, [0, 3000], [0, -160])
  const o3y = useTransform(scrollY, [0, 3000], [0, -380])
  const o4y = useTransform(scrollY, [0, 3000], [0, -120])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* Orb 1 – top left */}
      <motion.div style={{ position: 'absolute', top: '5%', left: '-5%', width: '55vw', height: '55vw', maxWidth: 700, y: o1y, willChange: 'transform' }}>
        {!PRM && (
          <motion.div
            animate={!PRM ? { x: [0, 90, -30, 0], y: [0, -60, 40, 0] } : {}}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,0,10,0.11) 0%,transparent 72%)', filter: 'blur(70px)' }}
          />
        )}
      </motion.div>

      {/* Orb 2 – right middle */}
      <motion.div style={{ position: 'absolute', top: '35%', right: '-8%', width: '50vw', height: '50vw', maxWidth: 640, y: o2y, willChange: 'transform' }}>
        {!PRM && (
          <motion.div
            animate={!PRM ? { x: [0, -70, 50, 0], y: [0, 50, -40, 0] } : {}}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,0,0,0.09) 0%,transparent 70%)', filter: 'blur(80px)' }}
          />
        )}
      </motion.div>

      {/* Orb 3 – bottom center */}
      <motion.div style={{ position: 'absolute', bottom: '10%', left: '25%', width: '45vw', height: '45vw', maxWidth: 600, y: o3y, willChange: 'transform' }}>
        {!PRM && (
          <motion.div
            animate={!PRM ? { x: [0, 60, -50, 0], y: [0, -50, 30, 0] } : {}}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,0,10,0.08) 0%,transparent 68%)', filter: 'blur(90px)' }}
          />
        )}
      </motion.div>

      {/* Orb 4 – top right small accent */}
      <motion.div style={{ position: 'absolute', top: '15%', right: '15%', width: '30vw', height: '30vw', maxWidth: 380, y: o4y, willChange: 'transform' }}>
        {!PRM && (
          <motion.div
            animate={!PRM ? { x: [0, -40, 30, 0], y: [0, 60, -20, 0] } : {}}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
            style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(224,0,10,0.06) 0%,transparent 70%)', filter: 'blur(60px)' }}
          />
        )}
      </motion.div>

      {/* Aurora sweep */}
      {!PRM && (
        <motion.div
          animate={{ x: ['0%', '30%', '-20%', '0%'], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(125deg,transparent 20%,rgba(192,0,10,0.035) 45%,transparent 65%)',
          }}
        />
      )}

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.038,
        backgroundImage: `url("${GRAIN_URL}")`,
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
      }} />
    </div>
  )
}

// ── Custom cursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const ox = useMotionValue(-200); const oy = useMotionValue(-200)
  const ix = useMotionValue(-200); const iy = useMotionValue(-200)
  const sox = useSpring(ox, { stiffness: 130, damping: 22, mass: 0.5 })
  const soy = useSpring(oy, { stiffness: 130, damping: 22, mass: 0.5 })
  const six = useSpring(ix, { stiffness: 600, damping: 40 })
  const siy = useSpring(iy, { stiffness: 600, damping: 40 })
  const [big, setBig] = useState(false)

  useEffect(() => {
    const move = (e) => { ox.set(e.clientX); oy.set(e.clientY); ix.set(e.clientX); iy.set(e.clientY) }
    const over = (e) => setBig(!!e.target.closest('[data-cta]'))
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [ox, oy, ix, iy])

  return (
    <>
      {/* Outer ring */}
      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none', x: sox, y: soy, translateX: '-50%', translateY: '-50%', willChange: 'transform' }}
        animate={{ width: big ? 54 : 34, height: big ? 54 : 34 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          animate={{ borderColor: big ? 'rgba(224,0,10,0.9)' : 'rgba(224,0,10,0.65)', scale: big ? [1, 1.15, 1] : 1 }}
          transition={{ scale: big ? { duration: 0.5, repeat: Infinity } : { duration: 0.2 } }}
          style={{ width: '100%', height: '100%', borderRadius: '50%', border: '1.5px solid rgba(224,0,10,0.65)', background: 'transparent' }}
        />
      </motion.div>
      {/* Inner dot */}
      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none', x: six, y: siy, translateX: '-50%', translateY: '-50%', willChange: 'transform' }}
        animate={{ width: big ? 7 : 5, height: big ? 7 : 5 }}
        transition={{ duration: 0.15 }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e0000a' }} />
      </motion.div>
    </>
  )
}

// ── Floating particles ────────────────────────────────────────────────────────
const PARTS = Array.from({ length: 16 }, (_, i) => ({
  id: i, left: `${7 + (i * 5.8) % 86}%`, top: `${10 + (i * 9.1) % 80}%`,
  size: 1.4 + (i % 4) * 0.85, opacity: 0.1 + (i % 5) * 0.065,
  dur: 3.6 + (i % 6) * 0.75, delay: (i % 5) * 0.65,
  dx: ((i % 3) - 1) * (10 + (i % 4) * 8), dy: -(10 + (i % 5) * 9),
}))

function Particles() {
  if (PRM) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PARTS.map(p => (
        <motion.div key={p.id}
          animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: '50%', background: '#e0000a', willChange: 'transform,opacity' }}
        />
      ))}
    </div>
  )
}

// ── Geometric wireframe shapes for hero ───────────────────────────────────────
function GeometricShapes({ mobile }) {
  if (mobile || PRM) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Top-right diamond */}
      <motion.svg
        animate={{ rotate: [0, 360], y: [0, -18, 0] }}
        transition={{ rotate: { duration: 28, repeat: Infinity, ease: 'linear' }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ position: 'absolute', top: '12%', right: '8%', opacity: 0.14, willChange: 'transform' }}
        width="90" height="90" viewBox="0 0 90 90" fill="none" stroke="#e0000a" strokeWidth="1">
        <polygon points="45,4 86,45 45,86 4,45" />
        <line x1="45" y1="4" x2="45" y2="86" />
        <line x1="4" y1="45" x2="86" y2="45" />
        <polygon points="45,18 72,45 45,72 18,45" strokeDasharray="4 3" />
      </motion.svg>

      {/* Bottom-left ring */}
      <motion.svg
        animate={{ rotate: [0, -360], y: [0, 14, 0] }}
        transition={{ rotate: { duration: 22, repeat: Infinity, ease: 'linear' }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 } }}
        style={{ position: 'absolute', bottom: '18%', left: '6%', opacity: 0.1, willChange: 'transform' }}
        width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#e0000a" strokeWidth="1">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="30" strokeDasharray="5 4" />
        <circle cx="50" cy="50" r="14" />
      </motion.svg>

      {/* Mid-right triangle */}
      <motion.svg
        animate={{ rotate: [0, 180, 360], y: [0, -22, 0] }}
        transition={{ rotate: { duration: 35, repeat: Infinity, ease: 'linear' }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 } }}
        style={{ position: 'absolute', top: '42%', right: '4%', opacity: 0.09, willChange: 'transform' }}
        width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="#c0000a" strokeWidth="1">
        <polygon points="35,4 66,62 4,62" />
        <polygon points="35,18 54,54 16,54" strokeDasharray="3 3" />
      </motion.svg>

      {/* Top-left plus */}
      <motion.svg
        animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ position: 'absolute', top: '22%', left: '5%', opacity: 0.12, willChange: 'transform' }}
        width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#e0000a" strokeWidth="1.5">
        <line x1="28" y1="4" x2="28" y2="52" />
        <line x1="4" y1="28" x2="52" y2="28" />
        <rect x="18" y="18" width="20" height="20" strokeDasharray="3 2" />
      </motion.svg>

      {/* Morphing blob */}
      <motion.div
        animate={{ borderRadius: ['50%', '30% 70% 60% 40% / 40% 50% 60% 50%', '60% 40% 40% 60% / 60% 40% 60% 40%', '50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '25%', left: '-8%', width: '320px', height: '320px',
          background: 'radial-gradient(circle,rgba(192,0,10,0.06) 0%,transparent 75%)',
          filter: 'blur(40px)', willChange: 'transform,border-radius',
        }}
      />
    </div>
  )
}

// ── Hero floating metric badges ───────────────────────────────────────────────
const METRICS = [
  { val: '+300h', label: 'gagnées/mois', side: 'left', pct: '4%', top: '40%', delay: 1.3, dy: -8, dur: 3.2 },
  { val: '50 leads', label: 'qualifiés/mois', side: 'right', pct: '4%', top: '40%', delay: 1.5, dy: -11, dur: 2.8 },
  { val: '×3', label: 'productivité', side: 'left', pct: '2%', top: '60%', delay: 1.7, dy: -6, dur: 3.7 },
  { val: '-65%', label: 'temps admin', side: 'right', pct: '2%', top: '60%', delay: 1.9, dy: -9, dur: 3.0 },
  { val: '48h', label: 'installation', side: 'left', pct: '7%', top: '77%', delay: 2.1, dy: -7, dur: 2.6 },
  { val: '90j', label: 'garantie', side: 'right', pct: '6%', top: '77%', delay: 2.3, dy: -10, dur: 3.5 },
]

function HeroMetrics() {
  return (
    <>
      {METRICS.map((m, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: m.delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', [m.side]: m.pct, top: m.top }}
        >
          <motion.div
            animate={!PRM ? { y: [0, -m.dy, 0] } : {}}
            transition={{ duration: m.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{
              ...glass, borderRadius: '12px', padding: '10px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)', willChange: 'transform',
            }}
          >
            <GlassReflex />
            <div style={{ color: '#e0000a', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.5px', position: 'relative', zIndex: 3 }}>{m.val}</div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px', position: 'relative', zIndex: 3 }}>{m.label}</div>
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}

// ── Shimmer badge ─────────────────────────────────────────────────────────────
function ShimmerBadge({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      background: 'rgba(192,0,10,0.1)', border: '1px solid rgba(192,0,10,0.3)',
      borderRadius: '50px', padding: '8px 18px',
      fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 500,
      position: 'relative', overflow: 'hidden',
    }}>
      {!PRM && (
        <motion.div
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8 }}
          style={{
            position: 'absolute', top: 0, bottom: 0, width: '35%',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)',
            transform: 'skewX(-18deg)', pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  )
}

// ── Animated hero title (word by word with blur-in) ───────────────────────────
const HERO_WORDS = [
  { w: 'Vos' }, { w: 'agents' }, { w: 'IA' }, { w: 'qui' },
  { w: 'prospectent,', em: true }, { w: 'qualifient', em: true },
  { w: 'et' }, { w: 'relancent', em: true },
  { w: 'pendant' }, { w: 'que' }, { w: 'vous' }, { w: 'faites' }, { w: 'visiter.' },
]

function HeroTitle({ mobile }) {
  return (
    <h1 style={{
      fontSize: mobile ? '32px' : '62px', fontWeight: 800, lineHeight: 1.1,
      color: '#fff', maxWidth: '900px', marginBottom: '24px',
      letterSpacing: mobile ? '-1px' : '-2px', position: 'relative', zIndex: 1,
    }}>
      {HERO_WORDS.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: i < HERO_WORDS.length - 1 ? '0.22em' : 0 }}>
          <motion.span
            initial={PRM ? {} : { y: '105%', opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 + i * 0.055, duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-block',
              ...(w.em ? { fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#e0000a' } : {}),
            }}
          >
            {w.w}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ mobile }) {
  const [prog, setProg] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setProg(Math.min(window.scrollY / 120, 1))
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const nav = [['Nos agents', '#agents'], ['Comment ça marche', '#process'], ['Résultats', '#resultats'], ['Intégrations', '#integrations'], ['FAQ', '#faq']]
  const go = (e, href) => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: `rgba(8,0,10,${(prog * 0.97).toFixed(2)})`,
        backdropFilter: prog > 0.05 ? `blur(${Math.round(prog * 18)}px)` : 'none',
        WebkitBackdropFilter: prog > 0.05 ? `blur(${Math.round(prog * 18)}px)` : 'none',
        borderBottom: `1px solid rgba(192,0,10,${(prog * 0.22).toFixed(3)})`,
        padding: mobile ? '16px 20px' : '20px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'padding 0.3s',
      }}
    >
      <img src={nadiaLogo} alt="NADIA" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />

      {!mobile && (
        <div style={{ display: 'flex', gap: '30px' }}>
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={e => go(e, href)} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, cursor: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target.style.color = '#fff')}
              onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.6)')}
            >{label}</a>
          ))}
        </div>
      )}

      {!mobile
        ? <CTAButton href={CTA_URL} style={{ padding: '11px 22px', fontSize: '13px' }}>Déployer mes agents IA →</CTAButton>
        : <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer' }}>{menuOpen ? '✕' : '☰'}</button>
      }

      <AnimatePresence>
        {mobile && menuOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(8,0,10,0.98)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {nav.map(([label, href]) => (
              <a key={href} href={href} onClick={e => go(e, href)} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '16px', fontWeight: 500 }}>{label}</a>
            ))}
            <CTAButton href={CTA_URL} style={{ padding: '14px 24px', fontSize: '14px', textAlign: 'center', display: 'block' }}>Déployer mes agents IA →</CTAButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ mobile }) {
  const sRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sRef, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, mobile ? -40 : -90])
  const partners = [
    { src: leboncoinLogo, name: 'Leboncoin' },
    { src: selogerLogo, name: 'SeLoger' },
    { src: orpiLogo, name: 'Orpi' },
    { src: fonciaLogo, name: 'Foncia' },
    { src: laforetLogo, name: 'Laforêt' },
    { src: logicLogo, name: 'Logic-Immo' },
    { src: meilleursAgentsLogo, name: 'Meilleurs Agents' },
    { src: century21Logo, name: 'Century 21' },
  ]

  return (
    <section ref={sRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: mobile ? '120px 20px 80px' : '160px 60px 120px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <Particles />
      <GeometricShapes mobile={mobile} />
      {!mobile && !PRM && <HeroMetrics />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
        <ShimmerBadge>
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#e0000a', display: 'inline-block' }} />
          Offre limitée — 3 agences ce mois-ci
        </ShimmerBadge>
      </motion.div>

      <motion.div style={{ y: titleY, position: 'relative', zIndex: 1 }}>
        <HeroTitle mobile={mobile} />
      </motion.div>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
        style={{ fontSize: mobile ? '16px' : '19px', color: 'rgba(255,255,255,0.45)', maxWidth: '580px', marginBottom: '44px', lineHeight: 1.65, position: 'relative', zIndex: 1 }}>
        NADIA automatise vos tâches chronophages grâce à des agents IA spécialisés dans l'immobilier. Opérationnel en 48h, sans effort de votre côté.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }}
        style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '64px', position: 'relative', zIndex: 1 }}>
        <CTAButton href={CTA_URL} style={{ padding: mobile ? '14px 24px' : '18px 36px' }}>Déployer mes agents IA →</CTAButton>
        <CTAButton href="#process" target="_self" style={{ padding: mobile ? '14px 24px' : '18px 36px', background: 'transparent', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)' }}>
          Voir comment ça marche
        </CTAButton>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }}
        style={{ width: '100%', maxWidth: '760px', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginBottom: '20px', letterSpacing: '2px', textTransform: 'uppercase' }}>Nos partenaires</p>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: '28px', bottom: 0, width: '60px', background: 'linear-gradient(90deg,#08000a,transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: '28px', bottom: 0, width: '60px', background: 'linear-gradient(270deg,#08000a,transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <motion.div
          animate={!PRM ? { x: ['0%', '-50%'] } : {}}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', alignItems: 'center', gap: '36px', width: 'max-content', willChange: 'transform' }}
        >
          {[...partners, ...partners].map((p, i) => (
            <img key={i} src={p.src} alt={p.name} style={{ height: '28px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.42, flexShrink: 0 }} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── Process ───────────────────────────────────────────────────────────────────
function Process({ mobile }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const steps = [
    { n: '01', title: 'Appel découverte', desc: 'On comprend votre agence, vos outils et vos objectifs en 30 minutes chrono.', from: { x: -70, y: 0 } },
    { n: '02', title: 'On installe tout', desc: 'Notre équipe configure et connecte vos agents IA à vos outils existants.', from: { x: 0, y: 60 } },
    { n: '03', title: 'Vos agents sont live', desc: 'Vos agents commencent à prospecter, qualifier et relancer automatiquement.', from: { x: 70, y: 0 } },
  ]
  const badges = ['Opérationnel sous 48h', 'Garantie 90 jours', 'Remboursement intégral', 'Zéro risque']

  return (
    <section id="process" style={{ padding: mobile ? '80px 20px' : '120px 60px', position: 'relative', zIndex: 1 }}>
      <SectionTitle label="Comment ça marche" mobile={mobile} style={{ textAlign: 'center', marginBottom: mobile ? '48px' : '72px' }}>
        Vos agents IA opérationnels, <em style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#e0000a' }}>en 48h.</em>
      </SectionTitle>

      <div ref={ref} style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', maxWidth: '960px', margin: '0 auto 56px' }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', flexDirection: mobile ? 'column' : 'row', flex: mobile ? 'none' : 1, width: mobile ? '100%' : 'auto' }}>
            <motion.div
              initial={PRM ? {} : { ...s.from, opacity: 0 }}
              animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, y: -5 }}
              style={{ flex: 1, willChange: 'transform' }}
            >
              <GlassCard style={{ borderRadius: '20px', padding: '28px 24px', textAlign: 'center' }} tilt>
                <div style={{ position: 'relative', zIndex: 3 }}>
                  <div style={{ fontSize: '44px', fontWeight: 800, color: 'rgba(192,0,10,0.22)', marginBottom: '14px', letterSpacing: '-2px' }}>{s.n}</div>
                  <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
            {i < 2 && <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '22px', padding: mobile ? '6px 0' : '0 14px', flexShrink: 0 }}>{mobile ? '↓' : '→'}</div>}
          </div>
        ))}
      </div>

      <StaggerWrap style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {badges.map(b => (
            <SI key={b}>
              <span style={{ background: 'rgba(192,0,10,0.09)', border: '1px solid rgba(192,0,10,0.22)', borderRadius: '50px', padding: '7px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: 500, display: 'inline-block' }}>✓ {b}</span>
            </SI>
          ))}
        </div>
      </StaggerWrap>
    </section>
  )
}

// ── Agents Carousel ───────────────────────────────────────────────────────────
const AGENTS = [
  {
    name: 'Élio', role: 'Prospection', photo: elioPhoto,
    skills: ['Détecte les leads sur vos portails', 'Contacte automatiquement 24h/24', 'Qualifie et score les prospects'],
  },
  {
    name: 'Sofia', role: 'Qualification', photo: sofiaPhoto,
    skills: ['Analyse chaque profil entrant', 'Constitue les dossiers automatiquement', 'Score et classe les candidatures'],
  },
  {
    name: 'Maya', role: 'Relance', photo: mayaPhoto,
    skills: ['Relance les leads froids au bon moment', 'Réactive les prospects inactifs', 'Planifie les suivis automatiquement'],
  },
  {
    name: 'Tom', role: 'Visites', photo: tomPhoto,
    skills: ['Planifie les visites sans appel', 'Confirme les créneaux par SMS/mail', 'Envoie les rappels automatiques'],
  },
  {
    name: 'Clara', role: 'Mandats', photo: claraPhoto,
    skills: ['Suit vos mandats en temps réel', 'Relance avant expiration', 'Génère les rapports propriétaires'],
  },
]

function AgentsCarousel({ mobile }) {
  const [active, setActive] = useState(0)
  const n = AGENTS.length
  const prev = () => setActive(a => (a - 1 + n) % n)
  const next = () => setActive(a => (a + 1) % n)

  // Compute signed dist (centered): -2 … 0 … +2
  const visible = AGENTS.map((ag, i) => {
    const off = i - active
    const w = (off + n) % n
    const dist = w > n / 2 ? w - n : w
    return { ...ag, i, dist }
  }).filter(ag => Math.abs(ag.dist) <= (mobile ? 0 : 2))

  const CARD_W = mobile ? Math.min(window.innerWidth - 80, 300) : 260

  return (
    <section id="agents" style={{ padding: mobile ? '80px 0' : '120px 0', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

      {/* Section header — centré */}
      <div style={{ textAlign: 'center', padding: mobile ? '0 20px 48px' : '0 60px 56px' }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ color: '#e0000a', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>
          Vos agents IA
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.52 }}
          style={{ fontSize: mobile ? '28px' : '46px', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '14px' }}>
          Votre équipe,{' '}
          <em style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>disponible</em>{' '}
          24h/24
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
          style={{ color: 'rgba(255,255,255,0.42)', fontSize: mobile ? '14px' : '15px', lineHeight: 1.65 }}>
          Chaque agent est spécialisé dans un rôle précis.<br />
          Ensemble ils gèrent votre activité de A à Z.
        </motion.p>
      </div>

      {/* Carousel row — centré avec flèches latérales */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: mobile ? '8px' : '16px', padding: '0 0 36px' }}>
        <motion.button onClick={prev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
          style={{ ...glass, borderRadius: '50%', width: 42, height: 42, color: '#fff', fontSize: '18px', cursor: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>‹</motion.button>

        <div style={{ display: 'flex', gap: mobile ? '10px' : '14px', alignItems: 'center', perspective: '1200px' }}>
          {visible.map(({ name, role, photo, skills, i, dist }) => {
            const isActive = dist === 0
            return (
              <motion.div
                key={name}
                animate={{
                  scale: isActive ? 1 : 0.84,
                  opacity: isActive ? 1 : 0.45,
                  rotateY: dist * -8,
                  boxShadow: isActive
                    ? ['0 0 28px rgba(192,0,10,0.2)', '0 0 56px rgba(192,0,10,0.42)', '0 0 28px rgba(192,0,10,0.2)']
                    : '0 0 0px transparent',
                }}
                transition={{
                  scale: { duration: 0.3 }, opacity: { duration: 0.3 }, rotateY: { duration: 0.3 },
                  boxShadow: isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 },
                }}
                onClick={() => !isActive && setActive(i)}
                style={{
                  ...glass,
                  ...(isActive ? glassActive : {}),
                  borderRadius: '20px',
                  width: CARD_W,
                  flexShrink: 0,
                  overflow: 'hidden',
                  cursor: isActive ? 'default' : 'none',
                  willChange: 'transform,opacity',
                  transformStyle: 'preserve-3d',
                }}
              >
                <GlassReflex />
                {/* Photo — grand format */}
                <div style={{ width: '100%', height: isActive ? (mobile ? 220 : 280) : (mobile ? 180 : 230), overflow: 'hidden', flexShrink: 0 }}>
                  <img src={photo} alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </div>
                {/* Info */}
                <div style={{ padding: '16px 18px 20px', position: 'relative', zIndex: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#e0000a', fontSize: isActive ? '17px' : '14px', fontWeight: 800, letterSpacing: '-0.3px' }}>{name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.36)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>{role}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {skills.map(sk => (
                      <div key={sk} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                        <span style={{ color: '#e0000a', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>▸</span>
                        <span style={{
                          fontSize: isActive ? '12px' : '10px',
                          color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
                          lineHeight: 1.4, fontWeight: 500,
                        }}>{sk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.button onClick={next} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
          style={{ ...glass, borderRadius: '50%', width: 42, height: 42, color: '#fff', fontSize: '18px', cursor: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>›</motion.button>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginBottom: '36px' }}>
        {AGENTS.map((_, i) => (
          <motion.button key={i} onClick={() => setActive(i)}
            animate={{ width: i === active ? 22 : 8, background: i === active ? '#e0000a' : 'rgba(255,255,255,0.18)' }}
            style={{ height: '8px', borderRadius: '4px', border: 'none', cursor: 'none', padding: 0 }}
          />
        ))}
      </div>

      {/* CTA centré */}
      <div style={{ textAlign: 'center' }}>
        <CTAButton href={CTA_URL} style={{ padding: mobile ? '14px 28px' : '16px 36px', fontSize: '15px' }}>
          Déployer mes agents IA →
        </CTAButton>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials({ mobile }) {
  const [active, setActive] = useState(0)
  const items = [
    { name: 'Hugo R.', agency: 'Century 21', tag: 'Gain de temps', color: '#c0000a', stars: 5, photo: screenshotHugo, objPos: 'top left', title: '+300h récupérées par mois', quote: 'Avant NADIA, je passais mes soirées à relancer des prospects. Maintenant Maya gère tout ça et je me concentre sur mes visites.', s1: { v: '300h', l: 'récupérées/mois' }, s2: { v: '×2', l: 'mandats signés' } },
    { name: 'Mohammed K.', agency: 'IAD France', tag: 'Foncier', color: '#8b0000', stars: 5, photo: screenshotMohammed, objPos: 'center', title: '+50 fonciers qualifiés en un mois', quote: "Élio prospecte pour moi 24h/24. J'ai reçu 50 opportunités foncières qualifiées dès le premier mois. Résultat inespéré.", s1: { v: '50+', l: 'fonciers/mois' }, s2: { v: '80%', l: 'taux qualification' } },
    { name: 'Matthieu V.', agency: 'Orpi Bordeaux', tag: 'Productivité', color: '#c0000a', stars: 5, photo: screenshotMatthieu, objPos: 'top right', title: '×3 sur ma productivité globale', quote: "J'ai multiplié par 3 le nombre de dossiers traités sans embaucher. NADIA c'est comme avoir 3 assistants dévoués.", s1: { v: '×3', l: 'productivité' }, s2: { v: '0€', l: "d'embauche" } },
    { name: 'Axel B.', agency: 'Guy Hoquet', tag: 'Efficacité', color: '#8b0000', stars: 5, photo: screenshotAxel, objPos: 'top right', title: '+40 dossiers/mois, -65% de temps admin', quote: "Le temps passé sur l'admin est passé de 40% à 14%. Clara gère les mandats, Tom les visites. Magique.", s1: { v: '+40', l: 'dossiers/mois' }, s2: { v: '-65%', l: 'temps admin' } },
  ]
  const t = items[active]

  return (
    <section id="resultats" style={{ padding: mobile ? '80px 20px' : '120px 60px', position: 'relative', zIndex: 1 }}>
      <SectionTitle label="Résultats" mobile={mobile} style={{ textAlign: 'center', marginBottom: '56px' }}>
        Ils ont transformé leur <em style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#e0000a' }}>agence</em>.
      </SectionTitle>

      <StaggerWrap style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
        {items.map((it, i) => (
          <SI key={i}><button onClick={() => setActive(i)} style={{ padding: '8px 18px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'none', border: i === active ? '1px solid rgba(192,0,10,0.4)' : '1px solid rgba(255,255,255,0.1)', background: i === active ? 'rgba(192,0,10,0.1)' : 'transparent', color: i === active ? '#fff' : 'rgba(255,255,255,0.38)', transition: 'all 0.2s' }}>{it.name}</button></SI>
        ))}
      </StaggerWrap>

      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.3 }}>
          <GlassCard tilt style={{ maxWidth: '780px', margin: '0 auto', borderRadius: '24px', padding: mobile ? '28px 20px' : '44px' }}>
            <div style={{ display: 'flex', gap: mobile ? '20px' : '40px', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'center' : 'flex-start', textAlign: mobile ? 'center' : 'left', position: 'relative', zIndex: 3 }}>
              {/* Round photo placeholder + float + rotate */}
              <motion.div
                animate={!PRM ? { y: [0, -8, 0], rotate: [-2, 2, -2] } : {}}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ flexShrink: 0 }}
              >
                <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${t.color}50`, flexShrink: 0 }}>
                  <img src={t.photo} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: t.objPos }} />
                </div>
              </motion.div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', justifyContent: mobile ? 'center' : 'flex-start' }}>
                  <span style={{ background: 'rgba(192,0,10,0.1)', border: '1px solid rgba(192,0,10,0.25)', borderRadius: '50px', padding: '4px 12px', fontSize: '12px', color: '#e0000a', fontWeight: 600 }}>{t.tag}</span>
                  <span style={{ color: '#e0000a', fontSize: '13px' }}>{'★'.repeat(t.stars)}</span>
                </div>
                <h3 style={{ color: '#fff', fontSize: mobile ? '20px' : '26px', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.5px' }}>{t.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '24px', fontSize: '15px', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', justifyContent: mobile ? 'center' : 'flex-start' }}>
                  {[t.s1, t.s2].map(s => (
                    <motion.div key={s.l} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }}
                      style={{ ...glass, borderRadius: '12px', padding: '12px 18px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <GlassReflex />
                      <div style={{ color: '#e0000a', fontSize: '20px', fontWeight: 800, position: 'relative', zIndex: 3 }}><ScrambleCounter value={s.v} /></div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', position: 'relative', zIndex: 3 }}>{s.l}</div>
                    </motion.div>
                  ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '13px' }}>{t.name} · {t.agency}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

// ── Integrations ──────────────────────────────────────────────────────────────
const LOGOS = [
  { name: 'Gmail', img: gmailIcon, dy: [-6, -14, -6], rot: [-3, 3, -3], dur: 2.9, d: 0 },
  { name: 'Slack', img: slackIcon, dy: [0, -8, 0], rot: [2, -2, 2], dur: 3.4, d: 0.4 },
  { name: 'WhatsApp', img: whatsappIcon, dy: [-10, -3, -10], rot: [-1, 4, -1], dur: 2.6, d: 0.8 },
  { name: 'Google Cal.', img: gcalIcon, dy: [-4, -12, -4], rot: [4, -1, 4], dur: 3.8, d: 0.2 },
  { name: 'Google Meet', img: gmeetIcon, dy: [-8, -2, -8], rot: [-4, 2, -4], dur: 2.4, d: 1.0 },
  { name: 'Instagram', img: instagramIcon, dy: [-2, -10, -2], rot: [1, -3, 1], dur: 3.1, d: 0.6 },
  { name: 'WordPress', img: wordpressIcon, dy: [-12, -4, -12], rot: [-2, 5, -2], dur: 2.8, d: 1.2 },
  { name: 'Salesforce', img: salesforceIcon, dy: [-5, -13, -5], rot: [3, -4, 3], dur: 3.5, d: 0.3 },
  { name: 'Webflow', img: webflowIcon, dy: [-9, -2, -9], rot: [-5, 1, -5], dur: 2.7, d: 0.9 },
  { name: 'Canva', img: canvaIcon, dy: [-1, -11, -1], rot: [2, -5, 2], dur: 3.2, d: 0.5 },
  { name: 'Trello', img: trelloIcon, dy: [-7, -15, -7], rot: [-3, 3, -3], dur: 2.5, d: 1.1 },
  { name: 'Calendly', img: calendlyIcon, dy: [-3, -9, -3], rot: [5, -2, 5], dur: 3.7, d: 0.7 },
]

function Integrations({ mobile }) {
  return (
    <section id="integrations" style={{ padding: mobile ? '80px 20px' : '120px 60px', position: 'relative', zIndex: 1 }}>
      <SectionTitle label="Intégrations" mobile={mobile} style={{ textAlign: 'center', marginBottom: '16px' }}>
        Intégrez NADIA avec vos <em style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#e0000a' }}>outils favoris</em>.
      </SectionTitle>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', textAlign: 'center', marginBottom: '56px', marginTop: '16px' }}>SeLoger, WhatsApp, Gmail, Notion…</p>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)', gap: '14px', maxWidth: '880px', margin: '0 auto' }}>
        {LOGOS.map(({ name, img, dy, rot, dur, d }) => (
          <motion.div key={name}
            animate={!PRM ? { y: dy, rotate: rot } : {}}
            transition={{ duration: dur, delay: d, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.08 }}
            style={{ willChange: 'transform' }}
          >
            <GlassCard style={{ borderRadius: '14px', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, margin: '0 auto 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px', position: 'relative', zIndex: 3 }}>
                <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', fontWeight: 600, position: 'relative', zIndex: 3 }}>{name}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Reassurance ───────────────────────────────────────────────────────────────
function Reassurance({ mobile }) {
  const chats = [
    { agent: 'Élio', photo: elioPhoto, msg: "Bonjour ! Je m'occupe de vos premières prospections dès aujourd'hui.", d: 0.2 },
    { agent: 'Sofia', photo: sofiaPhoto, msg: 'Votre portefeuille est analysé. Voici vos 10 leads les plus chauds.', d: 0.5 },
    { agent: 'Clara', photo: claraPhoto, msg: "Vos premiers mandats automatiques sont prêts. Plus qu'à signer !", d: 0.8 },
  ]
  return (
    <section style={{ padding: mobile ? '80px 20px' : '120px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '56px', alignItems: 'center' }}>
        <StaggerWrap>
          <SI><p style={{ color: '#e0000a', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Vous hésitez ?</p></SI>
          <SI><h2 style={{ fontSize: mobile ? '28px' : '40px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '18px' }}>"J'ai peur que ce soit trop <em style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#e0000a' }}>compliqué</em>."</h2></SI>
          <SI><p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>Nos agents s'installent en 48h. Notre équipe s'occupe de tout. Vous n'avez rien à configurer, rien à apprendre. Juste à profiter des résultats.</p></SI>
          <SI><CTAButton href={CTA_URL} style={{ padding: mobile ? '14px 24px' : '18px 36px' }}>Déployer mes agents IA →</CTAButton></SI>
        </StaggerWrap>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {chats.map((c, i) => (
            <motion.div key={c.agent}
              initial={PRM ? {} : { opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: c.d, duration: 0.45 }}
            >
              <GlassCard style={{ borderRadius: '16px', padding: '18px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative', zIndex: 3 }}>
                  <motion.div
                    animate={!PRM ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 2.6 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, border: '1.5px solid rgba(192,0,10,0.4)', overflow: 'hidden' }}>
                    <img src={c.photo} alt={c.agent} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </motion.div>
                  <div>
                    <p style={{ color: '#e0000a', fontSize: '12px', fontWeight: 700, marginBottom: '5px' }}>{c.agent}</p>
                    <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14px', lineHeight: 1.55 }}>{c.msg}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ({ mobile }) {
  const [open, setOpen] = useState(null)
  const qs = [
    { q: "Comment fonctionne l'installation ?", a: "Notre équipe gère tout en 48h. Un appel de 30 minutes suffit pour configurer vos agents selon vos besoins. Aucune compétence technique requise." },
    { q: "Est-ce compatible avec mes outils actuels ?", a: "NADIA s'intègre avec SeLoger, Leboncoin, Gmail, WhatsApp, Notion, et bien d'autres. Si un outil manque, nous créons une intégration sur mesure." },
    { q: "Que se passe-t-il si je ne suis pas satisfait ?", a: "Nous offrons une garantie de remboursement intégral pendant 90 jours. Si vous n'êtes pas satisfait, nous vous remboursons sans questions." },
    { q: "Mes données sont-elles en sécurité ?", a: "Absolument. Toutes vos données sont hébergées en France, chiffrées, et jamais partagées avec des tiers. Conformité RGPD garantie." },
    { q: "Combien de temps pour voir les premiers résultats ?", a: "La plupart de nos clients voient leurs premiers leads qualifiés dans les 7 premiers jours. Les résultats significatifs arrivent en 2-3 semaines." },
  ]
  return (
    <section id="faq" style={{ padding: mobile ? '80px 20px' : '120px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '2fr 3fr', gap: '56px', alignItems: 'start' }}>
        <StaggerWrap style={{ position: mobile ? 'static' : 'sticky', top: '120px' }}>
          <SI><p style={{ color: '#e0000a', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>FAQ</p></SI>
          <SI><h2 style={{ fontSize: mobile ? '28px' : '40px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '18px' }}>Vos questions, <em style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#e0000a' }}>nos réponses</em>.</h2></SI>
          <SI><p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px' }}>Une autre question ? On est disponible.</p></SI>
          <SI><CTAButton href={CTA_URL} style={{ padding: '13px 26px', fontSize: '14px' }}>Parler à l'équipe →</CTAButton></SI>
        </StaggerWrap>

        <StaggerWrap>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {qs.map((item, i) => (
              <SI key={i}>
                <GlassCard style={{ borderRadius: '14px', overflow: 'hidden', ...(open === i ? glassActive : {}) }}>
                  <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', textAlign: 'left', position: 'relative', zIndex: 3 }}>
                    <span style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{item.q}</span>
                    <motion.span animate={{ rotate: open === i ? 45 : 0 }} style={{ color: open === i ? '#e0000a' : 'rgba(255,255,255,0.35)', fontSize: '20px', flexShrink: 0, display: 'inline-block' }}>+</motion.span>
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                        <div style={{ padding: '0 22px 18px', color: 'rgba(255,255,255,0.52)', fontSize: '14px', lineHeight: 1.7, position: 'relative', zIndex: 3 }}>{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </SI>
            ))}
          </div>
        </StaggerWrap>
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA({ mobile }) {
  return (
    <section style={{ padding: mobile ? '80px 20px' : '120px 60px', textAlign: 'center', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      {!PRM && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse,rgba(192,0,10,0.16) 0%,transparent 65%)', pointerEvents: 'none' }}
        />
      )}
      <StaggerWrap>
        <SI>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', ...glass, borderRadius: '50px', padding: '8px 20px', marginBottom: '36px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            <GlassReflex />
            <span style={{ color: '#00b67a', fontSize: '15px', position: 'relative', zIndex: 3 }}>★★★★★</span>
            <span style={{ fontWeight: 700, color: '#fff', position: 'relative', zIndex: 3 }}>4.7/5</span>
            <span style={{ position: 'relative', zIndex: 3 }}>sur Trustpilot</span>
          </div>
        </SI>
        <SI>
          <h2 style={{ fontSize: mobile ? '34px' : '62px', fontWeight: 800, color: '#fff', letterSpacing: mobile ? '-1px' : '-2px', lineHeight: 1.08, marginBottom: '22px', maxWidth: '780px', margin: '0 auto 22px' }}>
            Prêt à récupérer votre <em style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#e0000a' }}>temps</em> ?
          </h2>
        </SI>
        <SI>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: mobile ? '16px' : '19px', maxWidth: '480px', margin: '0 auto 44px', lineHeight: 1.65 }}>
            Rejoignez les agences qui ont automatisé leur prospection avec NADIA. Installation en 48h, garantie 90 jours.
          </p>
        </SI>
        <SI>
          <CTAButton href={CTA_URL} style={{ padding: mobile ? '16px 32px' : '20px 48px', fontSize: mobile ? '16px' : '18px' }}>
            Déployer mes agents IA →
          </CTAButton>
        </SI>
      </StaggerWrap>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ mobile }) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: mobile ? '36px 20px' : '44px 60px',
      display: 'flex', flexDirection: mobile ? 'column' : 'row',
      justifyContent: 'space-between', alignItems: 'center',
      gap: mobile ? '24px' : '20px', position: 'relative', zIndex: 1,
    }}>
      {/* Logo */}
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <img src={nadiaLogo} alt="NADIA" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
      </motion.div>

      {/* Centre : lien légal + icônes sociales */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <motion.a href="#" whileHover={{ color: 'rgba(255,255,255,0.65)' }}
          style={{ color: 'rgba(255,255,255,0.28)', fontSize: '13px', textDecoration: 'none', cursor: 'none' }}>
          Mentions légales
        </motion.a>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* LinkedIn */}
          <motion.a href="https://www.linkedin.com/in/cesar-moret-90a3642a9/" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.12, opacity: 1 }} style={{ opacity: 0.7, display: 'block', cursor: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="#0A66C2"/>
              <path d="M9 11.5h2.4V19H9v-7.5zm1.2-3.8a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM13 11.5h2.3v1c.4-.6 1.2-1.2 2.4-1.2 2.6 0 3 1.7 3 3.9V19h-2.4v-3.5c0-1 0-2.2-1.4-2.2-1.4 0-1.6 1-1.6 2.1V19H13v-7.5z" fill="white"/>
            </svg>
          </motion.a>

          {/* Instagram */}
          <motion.a href="https://www.instagram.com/30moret/" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.12, opacity: 1 }} style={{ opacity: 0.7, display: 'block', cursor: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
                  <stop offset="0%" stopColor="#fdf497"/>
                  <stop offset="20%" stopColor="#fd5949"/>
                  <stop offset="60%" stopColor="#d6249f"/>
                  <stop offset="90%" stopColor="#285AEB"/>
                </radialGradient>
              </defs>
              <rect width="28" height="28" rx="7" fill="url(#igGrad)"/>
              <rect x="7" y="7" width="14" height="14" rx="4" stroke="white" strokeWidth="1.6" fill="none"/>
              <circle cx="14" cy="14" r="3.6" stroke="white" strokeWidth="1.6" fill="none"/>
              <circle cx="19.2" cy="8.8" r="1.1" fill="white"/>
            </svg>
          </motion.a>
        </div>
      </motion.div>

      {/* Copyright */}
      <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
        style={{ color: 'rgba(255,255,255,0.16)', fontSize: '13px', textAlign: mobile ? 'center' : 'right' }}>
        © 2026 NADIA. Tous droits réservés.
      </motion.p>
    </footer>
  )
}

// ── Trust marquee (infinite auto-scroll) ─────────────────────────────────────
const TRUST_LOGOS = [
  { src: leboncoinLogo, name: 'Leboncoin' },
  { src: selogerLogo, name: 'SeLoger' },
  { src: orpiLogo, name: 'Orpi' },
  { src: fonciaLogo, name: 'Foncia' },
  { src: laforetLogo, name: 'Laforêt' },
  { src: logicLogo, name: 'Logic-Immo' },
  { src: meilleursAgentsLogo, name: 'Meilleurs Agents' },
  { src: century21Logo, name: 'Century 21' },
]

function TrustMarquee({ mobile }) {
  // Duplicate 3× for seamless infinite loop
  const items = [...TRUST_LOGOS, ...TRUST_LOGOS, ...TRUST_LOGOS]
  return (
    <section style={{ padding: mobile ? '48px 0' : '64px 0', position: 'relative', zIndex: 1, overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginBottom: '28px', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center' }}>
        Ils nous font confiance
      </p>
      {/* Fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(90deg,#08000a,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(270deg,#08000a,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ overflow: 'hidden' }}>
        <motion.div
          animate={!PRM ? { x: ['0%', '-33.333%'] } : {}}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', alignItems: 'center', gap: mobile ? '40px' : '64px', width: 'max-content', willChange: 'transform' }}
        >
          {items.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.name}
              style={{ height: '32px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.35, flexShrink: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.target.style.opacity = '0.75')}
              onMouseLeave={e => (e.target.style.opacity = '0.35')}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const ro = new ResizeObserver(e => setMobile(e[0].contentRect.width < 768))
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  // Hide system cursor on desktop (unless prefers-reduced-motion)
  useEffect(() => {
    if (mobile || PRM) return
    const s = document.createElement('style')
    s.id = 'nadia-cursor'
    s.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.append(s)
    return () => s.remove()
  }, [mobile])

  return (
    <div style={{ background: '#08000a', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#fff' }}>
      <GlobalBg />
      {!mobile && !PRM && <CustomCursor />}
      <Navbar mobile={mobile} />
      <Hero mobile={mobile} />
      <Process mobile={mobile} />
      <AgentsCarousel mobile={mobile} />
      <Testimonials mobile={mobile} />
      <Integrations mobile={mobile} />
      <Reassurance mobile={mobile} />
      <FAQ mobile={mobile} />
      <FinalCTA mobile={mobile} />
      <TrustMarquee mobile={mobile} />
      <Footer mobile={mobile} />
    </div>
  )
}
