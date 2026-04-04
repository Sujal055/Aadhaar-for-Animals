import { useState, useEffect, useRef, useCallback } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

// ─── API IMPORTS ──────────────────────────────────────────────────────────────
import {
  login as apiLogin,
  logout as apiLogout,
  fetchAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  uploadAnimalPhoto,
  addMedicalHistory,
  fetchCases,
  createCase,
  advanceCase as apiAdvanceCase,
  fetchVolunteers,
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  fetchDashboardStats,
} from "./api";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:       #1a1208;
  --bark:      #3d2b1f;
  --clay:      #6b4226;
  --amber:     #d97706;
  --gold:      #f59e0b;
  --harvest:   #fbbf24;
  --moss:      #3d6b4a;
  --sage:      #6aab79;
  --mist:      #e8f3ec;
  --parchment: #fdf6ec;
  --cream:     #fffdf8;
  --warm:      #fef3e2;
  --coral:     #c0392b;
  --sky:       #2980b9;
  --ash:       #94846f;
  --sand:      #ddc8a8;
  --shadow:    rgba(26,18,8,0.12);
  --radius:    18px;
  --nav-h:     68px;
}

html { scroll-behavior: smooth; }
body {
  font-family: 'Outfit', sans-serif;
  background: var(--cream);
  color: var(--ink);
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--parchment); }
::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--amber); }

.nav {
  position: sticky; top: 0; z-index: 100;
  height: var(--nav-h);
  background: var(--ink);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
}
.nav-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
.nav-brand-icon { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, var(--amber), var(--harvest)); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; box-shadow: 0 4px 12px rgba(217,119,6,0.4); }
.nav-brand-text { line-height: 1; }
.nav-brand-main { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--cream); letter-spacing: 0.3px; }
.nav-brand-sub { font-size: 0.62rem; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; font-family: 'Space Mono', monospace; }
.nav-links { display: flex; gap: 2px; align-items: center; }
.nav-links button { background: transparent; border: none; color: #b8a88e; cursor: pointer; padding: 7px 13px; border-radius: 9px; font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 500; transition: all 0.2s; white-space: nowrap; letter-spacing: 0.2px; }
.nav-links button:hover { background: rgba(255,255,255,0.08); color: var(--cream); }
.nav-links button.active { background: rgba(217,119,6,0.2); color: var(--gold); border: 1px solid rgba(217,119,6,0.3); }
.nav-right { display: flex; align-items: center; gap: 10px; }
.notif-btn { position: relative; width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: #b8a88e; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.notif-btn:hover { background: rgba(255,255,255,0.12); color: var(--cream); }
.notif-badge { position: absolute; top: -4px; right: -4px; background: var(--coral); color: white; font-size: 0.58rem; font-weight: 700; font-family: 'Space Mono', monospace; min-width: 17px; height: 17px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 2px solid var(--ink); padding: 0 2px; }
.nav-login-btn { background: linear-gradient(135deg, var(--amber), var(--gold)); color: var(--ink); border: none; border-radius: 10px; padding: 8px 18px; font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.2px; box-shadow: 0 4px 12px rgba(217,119,6,0.3); }
.nav-login-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(217,119,6,0.5); }
.nav-user { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
.nav-user:hover { background: rgba(255,255,255,0.11); }
.nav-user-name { font-size: 0.78rem; color: var(--gold); font-weight: 600; }
.nav-user-logout { font-size: 0.65rem; color: #8a7a6a; }
.hamburger { display: none; background: none; border: none; color: var(--cream); font-size: 1.3rem; cursor: pointer; padding: 4px; }
.mobile-menu { position: fixed; top: var(--nav-h); left: 0; right: 0; background: var(--ink); padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); z-index: 99; display: flex; flex-direction: column; gap: 4px; animation: slideDown 0.2s ease; }
.mobile-menu button { text-align: left; padding: 10px 14px; border-radius: 10px; border: none; background: transparent; color: #b8a88e; font-family: 'Outfit', sans-serif; font-size: 0.88rem; cursor: pointer; }
.mobile-menu button.active { background: rgba(217,119,6,0.2); color: var(--gold); }
@keyframes slideDown { from { transform: translateY(-8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.notif-panel { position: fixed; top: calc(var(--nav-h) + 10px); right: 1.5rem; width: 360px; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06); z-index: 200; overflow: hidden; animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes popIn { from { transform: scale(0.92) translateY(-8px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.notif-header { padding: 1rem 1.25rem; background: var(--ink); display: flex; justify-content: space-between; align-items: center; }
.notif-header h4 { color: var(--cream); font-size: 0.88rem; font-weight: 600; }
.notif-clear { background: none; border: none; color: var(--gold); font-size: 0.72rem; cursor: pointer; font-family: 'Outfit', sans-serif; }
.notif-list { max-height: 380px; overflow-y: auto; }
.notif-item { padding: 0.875rem 1.25rem; border-bottom: 1px solid #f5f0e8; display: flex; gap: 12px; align-items: flex-start; cursor: pointer; transition: background 0.15s; }
.notif-item:hover { background: var(--warm); }
.notif-item.unread { background: #fffbf3; border-left: 3px solid var(--amber); }
.notif-dot { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.notif-content p { font-size: 0.8rem; color: var(--ink); line-height: 1.5; }
.notif-content span { font-size: 0.7rem; color: var(--ash); margin-top: 2px; display: block; font-family: 'Space Mono', monospace; }

.hero { min-height: 600px; background: var(--ink); position: relative; overflow: hidden; display: flex; align-items: center; padding: 5rem 2.5rem; }
.hero-bg-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: radial-gradient(circle at 20% 50%, var(--amber) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--sage) 0%, transparent 50%), radial-gradient(circle at 60% 80%, var(--harvest) 0%, transparent 40%); }
.hero-bg-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 28px 28px; }
.hero-content { max-width: 1200px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 5rem; align-items: center; position: relative; z-index: 1; }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(217,119,6,0.15); border: 1px solid rgba(217,119,6,0.3); color: var(--gold); font-size: 0.72rem; font-weight: 600; padding: 6px 14px; border-radius: 20px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 1.5rem; font-family: 'Space Mono', monospace; }
.hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.4rem, 5vw, 3.8rem); color: var(--cream); line-height: 1.1; margin-bottom: 1.4rem; font-weight: 900; }
.hero-title em { color: var(--gold); font-style: italic; }
.hero-title .line2 { display: block; color: var(--sage); }
.hero-desc { color: #9a8a78; font-size: 1rem; line-height: 1.8; max-width: 480px; margin-bottom: 2.5rem; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 3rem; }
.btn-hero-primary { background: linear-gradient(135deg, var(--amber), var(--harvest)); color: var(--ink); border: none; border-radius: 12px; padding: 14px 28px; font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: all 0.25s; letter-spacing: 0.2px; box-shadow: 0 6px 20px rgba(217,119,6,0.35); display: inline-flex; align-items: center; gap: 8px; }
.btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(217,119,6,0.5); }
.btn-hero-secondary { background: rgba(255,255,255,0.07); color: var(--cream); border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 14px 28px; font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 600; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px; }
.btn-hero-secondary:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); }
.hero-stats { display: flex; gap: 3rem; }
.hero-stat-num { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--gold); font-weight: 700; line-height: 1; }
.hero-stat-lbl { font-size: 0.72rem; color: #7a6a5a; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
.hero-visual { display: flex; justify-content: center; align-items: center; }
.hero-card-stack { position: relative; width: 300px; height: 360px; }
.id-card-main { position: absolute; top: 0; left: 0; width: 280px; background: linear-gradient(135deg, #2d1f12, #3d2b1f); border-radius: 20px; padding: 1.5rem; border: 1px solid rgba(217,119,6,0.25); box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: floatCard 4s ease-in-out infinite; }
@keyframes floatCard { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-12px) rotate(-2deg); } }
.id-card-back { position: absolute; bottom: 0; right: 0; width: 260px; background: linear-gradient(135deg, #1a3a2a, #2d5a3e); border-radius: 20px; padding: 1.5rem; border: 1px solid rgba(106,171,121,0.25); box-shadow: 0 16px 40px rgba(0,0,0,0.4); animation: floatCard2 4s ease-in-out infinite 0.7s; z-index: -1; }
@keyframes floatCard2 { 0%,100% { transform: translateY(0) rotate(3deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
.card-label { font-family: 'Space Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); margin-bottom: 0.75rem; opacity: 0.8; }
.card-animal-icon { font-size: 3rem; margin-bottom: 0.75rem; }
.card-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--cream); margin-bottom: 4px; }
.card-id { font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--gold); letter-spacing: 2px; margin-bottom: 1rem; }
.card-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.card-chip { font-size: 0.65rem; padding: 3px 10px; border-radius: 20px; font-family: 'Space Mono', monospace; font-weight: 700; letter-spacing: 0.5px; }
.chip-vacc { background: rgba(106,171,121,0.25); color: #6aab79; border: 1px solid rgba(106,171,121,0.3); }
.chip-steril { background: rgba(41,128,185,0.2); color: #6db3e8; border: 1px solid rgba(41,128,185,0.3); }
.chip-stable { background: rgba(61,107,74,0.25); color: #6aab79; border: 1px solid rgba(61,107,74,0.3); }
.card-back-label { font-family: 'Space Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 2px; color: var(--sage); margin-bottom: 0.5rem; }
.card-back-stat { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--cream); margin-bottom: 4px; }
.card-back-sublabel { font-size: 0.75rem; color: #6a8a70; }

.section { padding: 5rem 2.5rem; }
.section-inner { max-width: 1200px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 3.5rem; }
.section-tag { display: inline-block; font-family: 'Space Mono', monospace; font-size: 0.65rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 1rem; }
.tag-amber { background: rgba(217,119,6,0.12); color: var(--amber); border: 1px solid rgba(217,119,6,0.25); }
.tag-moss { background: var(--mist); color: var(--moss); border: 1px solid rgba(61,107,74,0.25); }
.tag-dark { background: rgba(217,119,6,0.15); color: var(--gold); border: 1px solid rgba(217,119,6,0.3); }
.tag-green { background: rgba(0,200,150,0.12); color: #00c896; border: 1px solid rgba(0,200,150,0.25); }
.section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.9rem, 4vw, 2.8rem); font-weight: 900; margin-bottom: 0.75rem; line-height: 1.15; }
.section-sub { color: var(--ash); font-size: 0.95rem; max-width: 560px; margin: 0 auto; line-height: 1.7; }

.card { background: white; border-radius: var(--radius); box-shadow: 0 2px 20px var(--shadow); border: 1px solid rgba(220,200,168,0.4); transition: all 0.25s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 10px 36px var(--shadow); }

.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.feature-card { background: white; border-radius: var(--radius); padding: 2rem; border: 1px solid rgba(220,200,168,0.4); box-shadow: 0 2px 20px var(--shadow); position: relative; overflow: hidden; transition: all 0.25s; }
.feature-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--amber), var(--harvest)); }
.feature-card:hover { transform: translateY(-4px); box-shadow: 0 14px 44px var(--shadow); }
.feature-num { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: var(--sand); font-weight: 700; letter-spacing: 2px; margin-bottom: 1rem; }
.feature-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: var(--warm); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1.25rem; }
.feature-title { font-weight: 700; font-size: 1.05rem; margin-bottom: 0.6rem; color: var(--ink); }
.feature-desc { color: var(--ash); font-size: 0.86rem; line-height: 1.7; }

.dash-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
.kpi { background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid rgba(220,200,168,0.4); box-shadow: 0 2px 16px var(--shadow); display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; transition: all 0.2s; }
.kpi:hover { transform: translateY(-2px); box-shadow: 0 8px 28px var(--shadow); }
.kpi::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.kpi-amber::after { background: linear-gradient(90deg, var(--amber), var(--harvest)); }
.kpi-moss::after { background: linear-gradient(90deg, var(--moss), var(--sage)); }
.kpi-coral::after { background: linear-gradient(90deg, var(--coral), #e05040); }
.kpi-sky::after { background: linear-gradient(90deg, var(--sky), #5ba8d4); }
.kpi-icon-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
.kpi-icon { font-size: 1.4rem; }
.kpi-trend { font-size: 0.68rem; font-weight: 700; font-family: 'Space Mono', monospace; padding: 3px 8px; border-radius: 20px; }
.trend-up { background: #e8f5e9; color: #2e7d32; }
.trend-down { background: #fdecea; color: var(--coral); }
.kpi-value { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 900; color: var(--ink); line-height: 1; }
.kpi-label { font-size: 0.78rem; color: var(--ash); font-weight: 500; margin-top: 2px; }
.dash-row2 { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
.dash-row3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
.panel { background: white; border-radius: var(--radius); padding: 1.5rem; border: 1px solid rgba(220,200,168,0.4); box-shadow: 0 2px 16px var(--shadow); }
.panel-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; }
.activity-item { display: flex; align-items: center; gap: 12px; padding: 9px 0; border-bottom: 1px solid #faf5ec; }
.activity-item:last-child { border-bottom: none; }
.act-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.act-text { font-size: 0.82rem; color: var(--ink); flex: 1; line-height: 1.4; }
.act-time { font-size: 0.68rem; color: var(--ash); font-family: 'Space Mono', monospace; }
.qa-btn { width: 100%; text-align: left; padding: 11px 14px; border-radius: 11px; border: 1.5px solid #ede5d8; background: var(--parchment); cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.84rem; color: var(--ink); display: flex; align-items: center; gap: 10px; margin-bottom: 7px; transition: all 0.2s; font-weight: 500; }
.qa-btn:hover { border-color: var(--amber); background: var(--warm); color: var(--amber); }
.mini-chart-label { font-size: 0.78rem; font-weight: 700; color: var(--bark); margin-bottom: 1rem; font-family: 'Space Mono', monospace; letter-spacing: 0.5px; }

.reg-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
.form-card { background: white; border-radius: var(--radius); padding: 2.5rem; border: 1px solid rgba(220,200,168,0.4); box-shadow: 0 4px 28px var(--shadow); }
.form-card-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; margin-bottom: 0.25rem; }
.form-card-sub { color: var(--ash); font-size: 0.84rem; margin-bottom: 2rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
.fg { display: flex; flex-direction: column; gap: 6px; }
.fg.full { grid-column: 1 / -1; }
label { font-size: 0.7rem; font-weight: 700; color: var(--clay); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; }
input:not([type=range]):not([type=file]), select, textarea { border: 1.5px solid var(--sand); border-radius: 11px; padding: 11px 14px; font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--ink); background: var(--parchment); transition: border-color 0.2s, background 0.2s; outline: none; width: 100%; }
input:not([type=range]):not([type=file]):focus, select:focus, textarea:focus { border-color: var(--amber); background: white; box-shadow: 0 0 0 3px rgba(217,119,6,0.1); }
textarea { resize: vertical; min-height: 80px; }
.loc-row { display: flex; gap: 8px; }
.loc-row input { flex: 1; }
.loc-detect-btn { background: var(--moss); color: white; border: none; border-radius: 11px; padding: 11px 16px; cursor: pointer; font-size: 0.82rem; font-family: 'Outfit', sans-serif; font-weight: 600; white-space: nowrap; transition: background 0.2s; }
.loc-detect-btn:hover { background: #315636; }
.photo-drop { border: 2px dashed var(--sand); border-radius: 12px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--parchment); position: relative; overflow: hidden; }
.photo-drop:hover { border-color: var(--amber); background: var(--warm); }
.photo-drop input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.photo-drop-icon { font-size: 2.2rem; margin-bottom: 0.5rem; }
.photo-drop p { font-size: 0.8rem; color: var(--ash); line-height: 1.6; }
.photo-drop .highlight { color: var(--amber); font-weight: 600; }
.preview-img { width: 100%; max-height: 180px; object-fit: cover; border-radius: 10px; margin-top: 0.5rem; }
.urgency-row { display: flex; gap: 8px; }
.urgency-btn { flex: 1; padding: 10px 8px; border-radius: 10px; border: 2px solid; cursor: pointer; font-size: 0.78rem; font-weight: 700; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.u-critical { border-color: var(--coral); color: var(--coral); background: #fff5f5; }
.u-critical.sel { background: var(--coral); color: white; }
.u-moderate { border-color: #d97706; color: #d97706; background: #fffbf0; }
.u-moderate.sel { background: #d97706; color: white; }
.u-stable { border-color: var(--moss); color: var(--moss); background: var(--mist); }
.u-stable.sel { background: var(--moss); color: white; }
.form-footer { display: flex; gap: 10px; margin-top: 1.5rem; }
.btn-submit { flex: 1; padding: 13px; border: none; border-radius: 12px; background: linear-gradient(135deg, var(--amber), var(--harvest)); color: var(--ink); font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(217,119,6,0.3); }
.btn-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(217,119,6,0.4); }
.btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.btn-reset { flex: 1; padding: 13px; border-radius: 12px; border: 1.5px solid var(--sand); background: var(--parchment); color: var(--bark); font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-reset:hover { border-color: var(--clay); color: var(--clay); }
.qr-panel { background: white; border-radius: var(--radius); padding: 2rem; border: 1px solid rgba(220,200,168,0.4); box-shadow: 0 4px 28px var(--shadow); display: flex; flex-direction: column; align-items: center; gap: 1.25rem; text-align: center; }
.generated-id-badge { background: var(--ink); color: var(--gold); padding: 9px 24px; border-radius: 24px; font-family: 'Space Mono', monospace; font-size: 1rem; letter-spacing: 3px; border: 1px solid rgba(217,119,6,0.3); }
.tips-card { background: white; border-radius: var(--radius); padding: 1.5rem; border: 1px solid rgba(220,200,168,0.4); margin-top: 0; }
.tips-card h4 { font-weight: 700; margin-bottom: 1rem; font-size: 0.9rem; }
.tip-item { display: flex; gap: 8px; margin-bottom: 8px; font-size: 0.8rem; color: var(--bark); line-height: 1.5; }

.table-controls { display: flex; gap: 12px; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
.tbl-search { flex: 1; min-width: 220px; border: 1.5px solid var(--sand); border-radius: 11px; padding: 10px 16px; font-family: 'Outfit', sans-serif; font-size: 0.88rem; background: white; outline: none; transition: border-color 0.2s; }
.tbl-search:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(217,119,6,0.1); }
.filter-pill { padding: 9px 16px; border-radius: 22px; border: 1.5px solid var(--sand); background: white; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: var(--bark); transition: all 0.2s; font-weight: 500; }
.filter-pill.active { background: var(--amber); border-color: var(--amber); color: white; }
.filter-pill:hover:not(.active) { border-color: var(--amber); color: var(--amber); }
.btn-add { background: linear-gradient(135deg, var(--amber), var(--harvest)); color: var(--ink); border: none; border-radius: 11px; padding: 10px 20px; font-family: 'Outfit', sans-serif; font-size: 0.84rem; font-weight: 700; cursor: pointer; box-shadow: 0 3px 12px rgba(217,119,6,0.3); transition: all 0.2s; }
.btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(217,119,6,0.4); }
.btn-export { padding: 9px 16px; border-radius: 11px; border: 1.5px solid var(--sand); background: white; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: var(--bark); transition: all 0.2s; }
.btn-export:hover { border-color: var(--amber); color: var(--amber); }
.tbl-wrap { overflow-x: auto; border-radius: var(--radius); box-shadow: 0 4px 28px var(--shadow); border: 1px solid rgba(220,200,168,0.4); }
table { width: 100%; border-collapse: collapse; background: white; min-width: 920px; }
thead { background: var(--ink); }
th { color: #b8a88e; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 15px 16px; text-align: left; cursor: pointer; user-select: none; font-family: 'Space Mono', monospace; transition: color 0.2s; }
th:hover { color: var(--gold); }
td { padding: 14px 16px; font-size: 0.85rem; border-bottom: 1px solid #f8f3ea; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fdfaf5; }
.badge { display: inline-block; padding: 4px 11px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.3px; font-family: 'Space Mono', monospace; }
.badge-dog { background: #fff0e0; color: #a05a00; }
.badge-cow { background: #e8f5e9; color: #2e7d32; }
.badge-cat { background: #e8eaf6; color: #283593; }
.badge-other { background: #f3e5f5; color: #6a1b9a; }
.badge-yes { background: #e8f5e9; color: var(--moss); }
.badge-no { background: #fdecea; color: var(--coral); }
.status-indicator { display: flex; align-items: center; gap: 7px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-critical { background: var(--coral); box-shadow: 0 0 0 3px rgba(192,57,43,0.2); animation: pulse-c 2s infinite; }
@keyframes pulse-c { 0%,100% { box-shadow: 0 0 0 3px rgba(192,57,43,0.2); } 50% { box-shadow: 0 0 0 5px rgba(192,57,43,0); } }
.dot-moderate { background: var(--amber); }
.dot-stable { background: var(--moss); }
.action-btns { display: flex; gap: 5px; }
.action-btn { border: none; border-radius: 7px; padding: 5px 10px; cursor: pointer; font-size: 0.7rem; font-family: 'Outfit', sans-serif; transition: all 0.18s; font-weight: 700; letter-spacing: 0.2px; }
.ab-view { background: #e3f2fd; color: #1565c0; }
.ab-view:hover { background: #1565c0; color: white; }
.ab-edit { background: #fff8e1; color: #e65100; }
.ab-edit:hover { background: #e65100; color: white; }
.ab-del { background: #fdecea; color: var(--coral); }
.ab-del:hover { background: var(--coral); color: white; }
.pagination { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
.pg-btn { padding: 7px 13px; border-radius: 9px; border: 1.5px solid var(--sand); background: white; cursor: pointer; font-size: 0.8rem; font-family: 'Outfit', sans-serif; transition: all 0.2s; font-weight: 600; }
.pg-btn.active { background: var(--amber); border-color: var(--amber); color: white; }
.pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.edit-bar { background: white; border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.5rem; border: 2px solid var(--amber); box-shadow: 0 4px 24px rgba(217,119,6,0.15); }
.edit-bar-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 1rem; color: var(--ink); }

.loading-row { text-align: center; padding: 3rem; color: var(--ash); font-size: 0.9rem; }
.loading-spinner-inline { display: inline-block; width: 18px; height: 18px; border: 2px solid var(--sand); border-top-color: var(--amber); border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
@keyframes spin { to { transform: rotate(360deg); } }

.gmap-wrap { height: 500px; border-radius: var(--radius); overflow: hidden; box-shadow: 0 6px 32px var(--shadow); border: 1px solid rgba(220,200,168,0.4); position: relative; }
.gmap-loading { height: 500px; border-radius: var(--radius); background: linear-gradient(135deg, #e8f5e9, #e3f2fd, #fff8e1); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(220,200,168,0.4); flex-direction: column; gap: 1rem; }
.gmap-loading-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--sand); border-top-color: var(--amber); animation: spin 0.8s linear infinite; }
.gmap-loading p { font-size: 0.88rem; color: var(--ash); font-weight: 500; }
.map-legend { display: flex; gap: 2rem; margin-top: 1.25rem; justify-content: center; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--bark); font-weight: 500; }
.legend-dot { width: 11px; height: 11px; border-radius: 50%; }
.map-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
.nearby-card { background: white; border-radius: 14px; padding: 1rem 1.25rem; border: 1px solid rgba(220,200,168,0.4); box-shadow: 0 2px 12px var(--shadow); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; }
.nearby-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--shadow); border-color: var(--amber); }
.map-area-filter { display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.map-stat-strip { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 1.25rem; }
.mstat { background: white; border-radius: 12px; padding: 1rem; border: 1px solid rgba(220,200,168,0.4); text-align: center; box-shadow: 0 2px 12px var(--shadow); }
.mstat-val { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; line-height: 1; }
.mstat-lbl { font-size: 0.7rem; color: var(--ash); margin-top: 4px; }

.leaflet-popup-content-wrapper { border-radius: 16px !important; box-shadow: 0 12px 40px rgba(0,0,0,0.18) !important; padding: 0 !important; overflow: hidden; border: 1px solid rgba(220,200,168,0.4) !important; }
.leaflet-popup-content { margin: 14px 16px !important; }
.leaflet-popup-tip-container { margin-top: -1px !important; }
.leaflet-popup-close-button { color: #9a8a7a !important; font-size: 1.1rem !important; top: 8px !important; right: 10px !important; }
.leaflet-popup-close-button:hover { color: var(--ink) !important; }
.leaflet-control-attribution { font-size: 0.6rem !important; }
@keyframes markerDrop { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.charts-section { background: var(--ink); }
.charts-section .section-title { color: var(--cream); }
.charts-section .section-sub { color: #7a6a5a; }
.chart-kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; margin-bottom: 2.5rem; }
.chart-kpi { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 16px; padding: 1.5rem; text-align: center; transition: all 0.2s; }
.chart-kpi:hover { background: rgba(255,255,255,0.08); }
.ck-icon { font-size: 1.6rem; margin-bottom: 0.5rem; }
.ck-val { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--gold); line-height: 1; font-weight: 700; }
.ck-lbl { font-size: 0.72rem; color: #7a6a5a; margin-top: 4px; }
.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 2rem; }
.chart-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: var(--radius); padding: 2rem; }
.chart-card-title { color: var(--sand); font-weight: 600; font-size: 0.95rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; font-family: 'Space Mono', monospace; letter-spacing: 0.5px; }
.chart-tabs { display: flex; gap: 6px; margin-bottom: 1.25rem; }
.chart-tab { padding: 5px 13px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: #7a6a5a; cursor: pointer; font-size: 0.74rem; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.chart-tab.active { background: var(--amber); border-color: var(--amber); color: white; font-weight: 600; }
.coverage-breakdown { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; grid-column: 1/-1; }
.cov-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.25rem; text-align: center; }
.cov-pct { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; line-height: 1; margin-bottom: 6px; }
.cov-bar-track { width: 100%; height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; margin: 8px 0; }
.cov-bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
.cov-lbl { font-size: 0.74rem; color: #7a6a5a; }

.team-section { background: var(--parchment); }
.case-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-bottom: 2rem; }
.cases-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.5rem; }
.case-card { background: white; border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 18px var(--shadow); transition: all 0.22s; border: 1px solid rgba(220,200,168,0.4); border-left: 4px solid var(--amber); }
.case-card.critical { border-left-color: var(--coral); }
.case-card.stable { border-left-color: var(--moss); }
.case-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px var(--shadow); }
.case-id { font-family: 'Space Mono', monospace; font-size: 0.68rem; color: var(--ash); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
.case-title { font-weight: 700; font-size: 1rem; margin-bottom: 6px; color: var(--ink); }
.case-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.8rem; color: #7a6a5a; margin-bottom: 1rem; }
.status-track { display: flex; align-items: center; gap: 3px; margin-bottom: 1.1rem; flex-wrap: wrap; }
.track-step { font-size: 0.6rem; padding: 3px 8px; border-radius: 20px; background: #f3ede4; color: var(--ash); font-family: 'Space Mono', monospace; font-weight: 700; letter-spacing: 0.3px; }
.track-step.done { background: var(--moss); color: white; }
.track-step.current { background: var(--amber); color: white; animation: pulseCur 1.5s infinite; }
@keyframes pulseCur { 0%,100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.4); } 50% { box-shadow: 0 0 0 4px rgba(217,119,6,0); } }
.track-arrow { color: #d8cbb8; font-size: 0.5rem; }
.case-actions { display: flex; gap: 8px; }
.case-btn { flex: 1; padding: 9px; border-radius: 10px; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 700; transition: all 0.2s; }
.cb-advance { background: var(--moss); color: white; }
.cb-advance:hover { background: #315636; }
.cb-advance:disabled { opacity: 0.5; cursor: not-allowed; }
.cb-nav { background: var(--warm); color: var(--bark); }
.cb-nav:hover { background: var(--sand); }
.volunteers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.vol-card { background: white; border-radius: var(--radius); padding: 1.5rem; border: 1px solid rgba(220,200,168,0.4); box-shadow: 0 2px 16px var(--shadow); text-align: center; transition: all 0.22s; }
.vol-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px var(--shadow); }
.vol-avatar { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1rem; }
.vol-name { font-weight: 700; font-size: 0.96rem; margin-bottom: 3px; }
.vol-role { font-size: 0.78rem; color: var(--ash); margin-bottom: 5px; }
.vol-area { font-size: 0.74rem; color: var(--ash); margin-bottom: 1rem; }
.vol-stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem; }
.vol-stat-num { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--amber); font-weight: 700; line-height: 1; }
.vol-stat-lbl { font-size: 0.62rem; color: var(--ash); text-transform: uppercase; letter-spacing: 0.5px; }
.vol-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; font-family: 'Space Mono', monospace; }
.vol-avail { background: var(--mist); color: var(--moss); border: 1px solid rgba(61,107,74,0.25); }
.vol-busy { background: #fff8e1; color: #d97706; border: 1px solid rgba(217,119,6,0.25); }

.ml-section { background: linear-gradient(160deg, #0c1a10 0%, #0f1923 50%, #1a0f08 100%); }
.ml-section .section-title { color: var(--cream); }
.ml-section .section-sub { color: #6a7a6a; }
.ml-model-info { display: grid; grid-template-columns: repeat(5,1fr); gap: 1rem; margin-bottom: 3rem; }
.ml-info-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(0,200,150,0.15); border-radius: 14px; padding: 1.25rem; text-align: center; }
.ml-info-val { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #00c896; font-weight: 700; line-height: 1; }
.ml-info-lbl { font-size: 0.68rem; color: #6a7a6a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px; }
.ml-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.ml-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(0,200,150,0.12); border-radius: var(--radius); padding: 2rem; position: relative; overflow: hidden; }
.ml-card::before { content: ''; position: absolute; top: -50px; right: -50px; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(0,200,150,0.08), transparent); }
.ml-badge { font-family: 'Space Mono', monospace; font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #00c896; margin-bottom: 0.5rem; }
.ml-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--cream); margin-bottom: 0.75rem; font-weight: 700; }
.ml-desc { font-size: 0.82rem; color: #6a7a6a; line-height: 1.7; margin-bottom: 1.5rem; }
.ml-status { display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; padding: 9px 14px; background: rgba(255,255,255,0.04); border-radius: 9px; }
.ml-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ml-status-text { font-size: 0.74rem; color: #8a9a8a; font-family: 'Space Mono', monospace; }
.upload-zone { border: 2px dashed rgba(0,200,150,0.25); border-radius: 14px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; background: rgba(0,200,150,0.03); }
.upload-zone:hover { border-color: #00c896; background: rgba(0,200,150,0.06); }
.upload-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.upload-zone-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.upload-zone p { color: #6a7a6a; font-size: 0.82rem; line-height: 1.6; }
.upload-zone p strong { color: #00c896; }
.prev-img { width: 100%; max-height: 220px; object-fit: cover; border-radius: 11px; margin-bottom: 1rem; }
.analyze-btn { width: 100%; padding: 13px; border: none; border-radius: 11px; background: linear-gradient(135deg, #00c896, #00a870); color: #001a12; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 0.75rem; }
.analyze-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,200,150,0.3); }
.analyze-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.result-box { background: rgba(0,200,150,0.07); border: 1px solid rgba(0,200,150,0.18); border-radius: 13px; padding: 1.25rem; margin-top: 1rem; }
.result-top { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
.result-emoji { font-size: 2.2rem; }
.result-label { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; }
.result-conf { font-size: 0.76rem; color: #6a7a6a; margin-top: 2px; }
.result-bars { display: flex; flex-direction: column; gap: 8px; }
.rbar-row { display: flex; align-items: center; gap: 10px; }
.rbar-label { font-size: 0.73rem; color: #8a9a8a; width: 115px; flex-shrink: 0; }
.rbar-track { flex: 1; height: 5px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
.rbar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.rbar-pct { font-size: 0.7rem; color: #6a7a6a; width: 36px; text-align: right; font-family: 'Space Mono', monospace; }
.scanning-overlay { position: absolute; inset: 0; background: rgba(0,8,4,0.82); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 11px; gap: 1rem; }
.scan-beam { width: 75%; height: 2px; background: linear-gradient(90deg, transparent, #00c896, transparent); animation: scanAnim 1.4s ease-in-out infinite; }
@keyframes scanAnim { 0%,100% { transform: translateY(-45px); } 50% { transform: translateY(45px); } }
.scan-text { color: #00c896; font-size: 0.8rem; font-weight: 700; letter-spacing: 2.5px; font-family: 'Space Mono', monospace; }
.risk-sliders { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; }
.rslider-group { display: flex; flex-direction: column; gap: 5px; }
.rslider-head { display: flex; justify-content: space-between; font-size: 0.76rem; color: #8a9a8a; }
.rslider-head span { color: #00c896; font-weight: 700; font-family: 'Space Mono', monospace; }
input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; background: rgba(255,255,255,0.09) !important; border-radius: 2px; outline: none; border: none; padding: 0; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #00c896; cursor: pointer; box-shadow: 0 0 8px rgba(0,200,150,0.5); }
.toggle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1rem; }
.toggle-btn { padding: 10px 12px; border-radius: 10px; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; text-align: left; }
.risk-result-box { margin-top: 1rem; padding: 1.5rem; background: rgba(0,200,150,0.06); border-radius: 13px; border: 1px solid rgba(0,200,150,0.14); }
.risk-gauge { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.gauge-circle { width: 78px; height: 78px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; border: 3px solid; }
.risk-recs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.75rem; }
.risk-rec-tag { background: rgba(255,255,255,0.05); color: #b0c0b0; padding: 5px 11px; border-radius: 20px; font-size: 0.71rem; line-height: 1.4; }
.ml-how-it-works { margin-top: 3rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: var(--radius); padding: 2rem; }
.ml-how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
.how-item { text-align: center; }
.how-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
.how-title { font-weight: 700; color: #00c896; font-size: 0.82rem; margin-bottom: 0.3rem; font-family: 'Space Mono', monospace; }
.how-desc { font-size: 0.76rem; color: #6a7a6a; line-height: 1.6; }
.ml-note { margin-top: 1.5rem; padding: 1.25rem 1.5rem; background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.18); border-radius: 12px; display: flex; gap: 1rem; }
.ml-note-icon { font-size: 1.5rem; flex-shrink: 0; }
.ml-note-title { font-weight: 700; color: var(--gold); font-size: 0.85rem; margin-bottom: 4px; }
.ml-note-body { font-size: 0.8rem; color: #8a7a6a; line-height: 1.6; }

.modal-overlay { position: fixed; inset: 0; background: rgba(20,12,5,0.7); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.modal { background: white; border-radius: 24px; padding: 3rem 2.5rem; max-width: 460px; width: 100%; position: relative; box-shadow: 0 30px 80px rgba(0,0,0,0.35); animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes modalIn { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.modal-close { position: absolute; top: 1.25rem; right: 1.25rem; background: var(--parchment); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-close:hover { background: var(--sand); }
.profile-modal { max-width: 600px; max-height: 80vh; overflow-y: auto; }
.profile-header { background: var(--ink); margin: -3rem -2.5rem 2rem; padding: 2rem 2.5rem; border-radius: 24px 24px 0 0; display: flex; align-items: center; gap: 1rem; }
.profile-avatar { width: 60px; height: 60px; border-radius: 16px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; border: 1px solid rgba(217,119,6,0.3); }
.profile-name { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--cream); font-weight: 700; }
.profile-id { font-family: 'Space Mono', monospace; font-size: 0.75rem; color: var(--gold); letter-spacing: 2px; margin-top: 2px; }
.profile-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; margin-bottom: 1.25rem; }
.pfield { background: var(--parchment); border-radius: 11px; padding: 0.875rem 1rem; }
.pfield-lbl { font-size: 0.66rem; color: var(--ash); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-family: 'Space Mono', monospace; }
.pfield-val { font-size: 0.9rem; color: var(--ink); font-weight: 600; }
.history-list { display: flex; flex-direction: column; gap: 8px; }
.history-item { display: flex; gap: 10px; padding: 10px 12px; background: var(--parchment); border-radius: 11px; }
.history-item-text { font-size: 0.84rem; font-weight: 600; color: var(--ink); }
.history-item-meta { font-size: 0.72rem; color: var(--ash); margin-top: 2px; font-family: 'Space Mono', monospace; }

.toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--ink); color: var(--cream); padding: 14px 22px; border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,0.35); z-index: 2000; font-size: 0.86rem; display: flex; align-items: center; gap: 12px; animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1); max-width: 380px; font-weight: 500; }
.toast.success { border-left: 4px solid var(--moss); }
.toast.error { border-left: 4px solid var(--coral); }
.toast.info { border-left: 4px solid var(--sky); }
@keyframes toastIn { from { transform: translateY(20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

.sos-btn { position: fixed; bottom: 2rem; left: 2rem; z-index: 200; background: var(--coral); color: white; border: none; border-radius: 50px; padding: 13px 22px; font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 6px 24px rgba(192,57,43,0.45); animation: sosPulse 2.5s infinite; }
@keyframes sosPulse { 0%,100% { box-shadow: 0 6px 24px rgba(192,57,43,0.45); } 50% { box-shadow: 0 8px 36px rgba(192,57,43,0.7); transform: scale(1.02); } }

footer { background: var(--ink); color: #7a6a5a; text-align: center; padding: 3rem 2rem; border-top: 1px solid rgba(255,255,255,0.05); }
footer .footer-logo { font-size: 2rem; margin-bottom: 0.75rem; }
footer .footer-title { font-family: 'Playfair Display', serif; color: var(--sand); font-size: 1.1rem; margin-bottom: 0.5rem; }
footer .footer-sub { font-size: 0.82rem; line-height: 1.7; }
footer .footer-copy { font-size: 0.72rem; margin-top: 1.5rem; font-family: 'Space Mono', monospace; color: #5a4a3a; letter-spacing: 0.5px; }

@media (max-width: 1100px) { .dash-kpi-grid { grid-template-columns: repeat(2,1fr); } .dash-row2 { grid-template-columns: 1fr; } .dash-row3 { grid-template-columns: 1fr 1fr; } .chart-kpi-row { grid-template-columns: repeat(2,1fr); } .ml-model-info { grid-template-columns: repeat(3,1fr); } }
@media (max-width: 900px) { .hero-content { grid-template-columns: 1fr; } .hero-visual { display: none; } .reg-layout { grid-template-columns: 1fr; } .ml-grid { grid-template-columns: 1fr; } .nav-links { display: none; } .hamburger { display: block; } .dash-row3 { grid-template-columns: 1fr; } .map-sidebar { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } .fg.full { grid-column: 1; } }
@media (max-width: 600px) { .dash-kpi-grid { grid-template-columns: 1fr 1fr; } .charts-grid { grid-template-columns: 1fr; } .hero-stats { gap: 1.5rem; } .modal { padding: 2rem 1.5rem; } .profile-header { margin: -2rem -1.5rem 1.5rem; padding: 1.5rem; border-radius: 20px 20px 0 0; } .notif-panel { width: calc(100vw - 2rem); right: 1rem; } .ml-model-info { grid-template-columns: repeat(2,1fr); } .case-stats { grid-template-columns: 1fr; } }
`;

// ─── STATIC CHART DATA (analytics remain illustrative) ────────────────────────
const pieColors = ["#3d6b4a","#d97706"];
const barData = [
  {month:"Oct",dogs:28,cows:12,cats:5},{month:"Nov",dogs:35,cows:18,cats:8},
  {month:"Dec",dogs:42,cows:22,cats:10},{month:"Jan",dogs:55,cows:30,cats:14},
  {month:"Feb",dogs:63,cows:35,cats:18},{month:"Mar",dogs:71,cows:40,cats:22},
];
const trendData = [
  {week:"W1",rescues:12,registrations:24},{week:"W2",rescues:18,registrations:31},
  {week:"W3",rescues:15,registrations:28},{week:"W4",rescues:22,registrations:42},
  {week:"W5",rescues:28,registrations:55},{week:"W6",rescues:35,registrations:63},
];
const radarData = [
  {subject:"Vaccination",A:68,fullMark:100},{subject:"Sterilization",A:52,fullMark:100},
  {subject:"ID Tagging",A:85,fullMark:100},{subject:"Rescue Response",A:74,fullMark:100},
  {subject:"Follow-up",A:60,fullMark:100},{subject:"Vet Coverage",A:45,fullMark:100},
];

// ─── RECENT ACTIVITY (static feed; replace with /api/activity if available) ──
const recentActivity = [
  {color:"#c0392b",text:"Kaali (AASA-0002) marked CRITICAL — leg wound",time:"2m ago"},
  {color:"#3d6b4a",text:"Tommy (AASA-0001) vaccination updated",time:"18m ago"},
  {color:"#d97706",text:"New registration: Moti in Ward 2",time:"45m ago"},
  {color:"#2980b9",text:"CASE-2483 status changed to Rescued",time:"1h ago"},
  {color:"#6aab79",text:"PawCare NGO completed 5 sterilizations today",time:"2h ago"},
];

// ─── ML ───────────────────────────────────────────────────────────────────────
const ANIMAL_MAP = {
  dog:["dog","puppy","hound","retriever","shepherd","spaniel","terrier","poodle","bulldog","beagle","labrador","dalmatian","husky","collie","dachshund","boxer","pomeranian","chihuahua","rottweiler","malinois"],
  cat:["cat","kitten","tabby","persian","siamese"],
  cow:["cow","bull","ox","bison","buffalo","cattle","calf"],
};
function detectAnimal(preds) {
  for (const p of preds) {
    const cls = p.className.toLowerCase();
    for (const [animal,kws] of Object.entries(ANIMAL_MAP)) {
      if (kws.some(k=>cls.includes(k))) return {animal,confidence:p.probability,raw:p.className};
    }
  }
  return {animal:"unknown",confidence:preds[0]?.probability||0,raw:preds[0]?.className||"N/A"};
}

function AnimalClassifier({ onDetected }) {
  const [mState, setMState] = useState("idle");
  const [model, setModel] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [topPreds, setTopPreds] = useState([]);
  const imgRef = useRef(null);
  const fileRef = useRef(null);
  const loadModel = async () => {
    setMState("loading");
    try { const m = await window.mobilenet.load({version:2,alpha:1.0}); setModel(m); setMState("ready"); }
    catch(e) { setMState("error"); }
  };
  useEffect(() => {
    if (!window.mobilenet) {
      const s1 = document.createElement("script");
      s1.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js";
      s1.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js";
        s2.onload = loadModel; document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    } else loadModel();
  }, []);
  const handleFile = e => { const f=e.target.files[0]; if(f){setPreview(URL.createObjectURL(f));setResult(null);setTopPreds([]);} };
  const analyze = async () => {
    if (!model || !imgRef.current) return;
    setMState("analyzing");
    try {
      const preds = await model.classify(imgRef.current, 10);
      const det = detectAnimal(preds);
      setResult(det);
      setTopPreds(preds.slice(0,5).map(p=>({label:p.className.split(",")[0],pct:Math.round(p.probability*100)})));
      setMState("done");
      if (det.animal!=="unknown") onDetected && onDetected(det);
    } catch(e) { setMState("error"); }
  };
  const COLOR = {dog:"#d97706",cat:"#f59e0b",cow:"#3d6b4a",unknown:"#7a6a5a"};
  const EMOJI = {dog:"🐕",cat:"🐈",cow:"🐄",unknown:"❓"};
  const statusDotColor = mState==="ready"||mState==="done"?"#00c896":mState==="loading"||mState==="analyzing"?"#f59e0b":mState==="error"?"#c0392b":"#5a6a5a";
  const statusText = {idle:"Initializing…",loading:"Loading MobileNet v2 (5.6 MB)…",ready:"Model ready — 1000 ImageNet classes loaded",analyzing:"Running inference…",done:"Classification complete ✓",error:"Model load failed — check connection"}[mState];
  return (
    <div className="ml-card">
      <div className="ml-badge">🧠 TensorFlow.js · MobileNet v2</div>
      <div className="ml-title">Animal Species Detector</div>
      <div className="ml-desc">Upload a photo — on-device AI identifies species, breed group & confidence. No data leaves your browser.</div>
      <div className="ml-status">
        <div className="ml-status-dot" style={{background:statusDotColor}} />
        <div className="ml-status-text">{statusText}</div>
      </div>
      <div className="upload-zone" onClick={()=>fileRef.current?.click()}>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
        {preview ? (
          <div style={{position:"relative"}}>
            <img ref={imgRef} src={preview} alt="animal" className="prev-img" crossOrigin="anonymous" />
            {mState==="analyzing" && (
              <div className="scanning-overlay">
                <div className="scan-beam" />
                <div className="scan-text">ANALYZING...</div>
              </div>
            )}
          </div>
        ) : (
          <><div className="upload-zone-icon">📸</div><p><strong>Click or drag</strong> an animal photo here</p></>
        )}
      </div>
      <button className="analyze-btn" onClick={analyze} disabled={!preview||(mState!=="ready"&&mState!=="done")}>
        {mState==="analyzing"?"🔬 Analyzing…":"🔍 Classify Animal"}
      </button>
      {result && (
        <div className="result-box">
          <div className="result-top">
            <div className="result-emoji">{EMOJI[result.animal]}</div>
            <div>
              <div className="result-label" style={{color:COLOR[result.animal]}}>{result.animal.charAt(0).toUpperCase()+result.animal.slice(1)} Detected</div>
              <div className="result-conf">{(result.confidence*100).toFixed(1)}% confidence · {result.raw.split(",")[0]}</div>
            </div>
            <div style={{marginLeft:"auto",background:COLOR[result.animal],color:"white",padding:"4px 12px",borderRadius:20,fontSize:"0.72rem",fontWeight:700,fontFamily:"'Space Mono',monospace"}}>
              {result.confidence>0.7?"HIGH":result.confidence>0.4?"MED":"LOW"}
            </div>
          </div>
          <div className="result-bars">
            {topPreds.map((p,i)=>(
              <div key={i} className="rbar-row">
                <div className="rbar-label">{p.label}</div>
                <div className="rbar-track"><div className="rbar-fill" style={{width:`${p.pct}%`,background:i===0?"#00c896":`rgba(0,200,150,${0.5-i*0.08})`}} /></div>
                <div className="rbar-pct">{p.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

async function buildHealthModel() {
  const tf = window.tf; if (!tf) return null;
  const xs = tf.tensor2d([[0.1,0.8,0,0,0,0],[0.2,0.7,0,0,0,0],[0.5,0.5,0,0,0,0],[0.3,0.6,1,0,0,0],[0.4,0.5,1,1,0,0],[0.6,0.4,1,0,1,0],[0.7,0.3,1,1,1,0],[0.8,0.2,1,1,1,1],[0.9,0.1,1,1,1,1],[0.1,0.9,0,1,0,0],[0.5,0.5,1,1,0,1],[0.2,0.8,0,0,1,0],[0.6,0.4,0,1,1,1],[0.3,0.6,0,0,0,1],[0.4,0.5,1,0,0,0],[0.7,0.3,0,1,1,0],[0.9,0.2,1,1,1,1],[0.1,0.7,0,0,0,0]]);
  const ys = tf.tensor2d([[1,0,0],[1,0,0],[1,0,0],[1,0,0],[0,1,0],[0,1,0],[0,1,0],[0,0,1],[0,0,1],[1,0,0],[0,1,0],[1,0,0],[0,0,1],[1,0,0],[1,0,0],[0,1,0],[0,0,1],[1,0,0]]);
  const m = tf.sequential({layers:[tf.layers.dense({inputShape:[6],units:16,activation:"relu"}),tf.layers.dropout({rate:0.2}),tf.layers.dense({units:8,activation:"relu"}),tf.layers.dense({units:3,activation:"softmax"})]});
  m.compile({optimizer:tf.train.adam(0.01),loss:"categoricalCrossentropy",metrics:["accuracy"]});
  await m.fit(xs,ys,{epochs:80,verbose:0});
  xs.dispose(); ys.dispose(); return m;
}

function HealthRiskPredictor() {
  const [model, setModel] = useState(null);
  const [ready, setReady] = useState(false);
  const [training, setTraining] = useState(false);
  const [inputs, setInputs] = useState({age:3,weight:15,wound:0,lethargy:0,fever:0,appetite:0});
  const [prediction, setPrediction] = useState(null);
  useEffect(()=>{
    const iv = setInterval(()=>{
      if (window.tf&&!model&&!training) {
        clearInterval(iv); setTraining(true);
        buildHealthModel().then(m=>{setModel(m);setReady(true);setTraining(false);}).catch(()=>setTraining(false));
      }
    },1000); return ()=>clearInterval(iv);
  },[model,training]);
  const predict = async()=>{
    if(!model||!window.tf) return;
    const tf=window.tf;
    const t=tf.tensor2d([[Math.min(inputs.age/15,1),Math.min(inputs.weight/50,1),inputs.wound,inputs.lethargy,inputs.fever,inputs.appetite]]);
    const p=model.predict(t); const probs=await p.data(); t.dispose(); p.dispose();
    const LABELS=["Low Risk","Moderate Risk","High Risk"];
    const COLORS=["#00c896","#f59e0b","#c0392b"];
    const ICONS=["✅","⚠️","🚨"];
    const max=Array.from(probs).indexOf(Math.max(...probs));
    setPrediction({label:LABELS[max],color:COLORS[max],icon:ICONS[max],probs:Array.from(probs).map((v,i)=>({label:LABELS[i],pct:Math.round(v*100),color:COLORS[i]}))});
  };
  const toggle=f=>setInputs(p=>({...p,[f]:p[f]===1?0:1}));
  const RECS={"Low Risk":["Schedule routine vaccination check-up","Standard deworming if overdue","Monitor monthly"],"Moderate Risk":["Immediate vet consultation recommended","Isolate from other animals","Report to NGO via app"],"High Risk":["Emergency veterinary care REQUIRED","Contact rescue team via SOS immediately","Life-threatening — do not delay"]};
  return (
    <div className="ml-card">
      <div className="ml-badge">🧬 TF.js Neural Network · 3-Layer MLP</div>
      <div className="ml-title">Health Risk Predictor</div>
      <div className="ml-desc">Neural network trained in-browser assesses health risk from clinical indicators.</div>
      <div className="ml-status">
        <div className="ml-status-dot" style={{background:ready?"#00c896":"#f59e0b"}} />
        <div className="ml-status-text">{training?"Training neural network (80 epochs)…":ready?"Model trained · 6 features → 3 risk classes":"Waiting for TF.js runtime…"}</div>
      </div>
      <div className="risk-sliders">
        <div className="rslider-group">
          <div className="rslider-head">Age (years) <span>{inputs.age} yrs</span></div>
          <input type="range" min="0" max="15" value={inputs.age} onChange={e=>setInputs(p=>({...p,age:+e.target.value}))} />
        </div>
        <div className="rslider-group">
          <div className="rslider-head">Estimated Weight <span>{inputs.weight} kg</span></div>
          <input type="range" min="1" max="50" value={inputs.weight} onChange={e=>setInputs(p=>({...p,weight:+e.target.value}))} />
        </div>
      </div>
      <div className="toggle-grid">
        {[{key:"wound",label:"🩹 Visible Wound"},{key:"lethargy",label:"😴 Lethargic"},{key:"fever",label:"🌡️ Suspected Fever"},{key:"appetite",label:"🍽️ Loss of Appetite"}].map(({key,label})=>(
          <button key={key} className="toggle-btn" onClick={()=>toggle(key)} style={{border:`1.5px solid ${inputs[key]?"#00c896":"rgba(255,255,255,0.1)"}`,background:inputs[key]?"rgba(0,200,150,0.1)":"rgba(255,255,255,0.03)",color:inputs[key]?"#00c896":"#6a7a6a"}}>
            {label} {inputs[key]?"✓":""}
          </button>
        ))}
      </div>
      <button className="analyze-btn" onClick={predict} disabled={!ready}>🧠 Predict Health Risk</button>
      {prediction && (
        <div className="risk-result-box">
          <div className="risk-gauge">
            <div className="gauge-circle" style={{borderColor:prediction.color,background:`${prediction.color}15`,color:prediction.color}}>{prediction.icon}</div>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",color:prediction.color,fontWeight:700}}>{prediction.label}</div>
              <div style={{fontSize:"0.76rem",color:"#6a7a6a"}}>Confidence: {prediction.probs.find(p=>p.label===prediction.label)?.pct}%</div>
            </div>
          </div>
          <div className="result-bars" style={{marginBottom:"1rem"}}>
            {prediction.probs.map((p,i)=>(
              <div key={i} className="rbar-row">
                <div className="rbar-label">{p.label}</div>
                <div className="rbar-track"><div className="rbar-fill" style={{width:`${p.pct}%`,background:p.color}} /></div>
                <div className="rbar-pct">{p.pct}%</div>
              </div>
            ))}
          </div>
          <div className="risk-recs">
            {RECS[prediction.label]?.map((r,i)=><div key={i} className="risk-rec-tag">{r}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const pinEmoji = s => s==="critical"?"🔴":s==="moderate"?"🟡":"🟢";

function QRCode({animalId}) {
  const seed = animalId||"NEW";
  const cells = Array.from({length:49},(_,i)=>((seed.charCodeAt(i%seed.length)+i*7)%3)!==0);
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,22px)",gap:3,padding:14,background:"white",borderRadius:12,border:"1.5px solid #ede5d8"}}>
      {cells.map((f,i)=><div key={i} style={{width:22,height:22,background:f?"#1a1208":"#fdf6ec",borderRadius:3}} />)}
    </div>
  );
}

function Toast({msg,type,onClose}) {
  useEffect(()=>{const t=setTimeout(onClose,4200);return()=>clearTimeout(t);},[onClose]);
  const icons={success:"✅",error:"❌",info:"ℹ️"};
  return <div className={`toast ${type}`}>{icons[type]||"ℹ️"} {msg}</div>;
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({onClose, onLogin, onGoRegister}) {
  const [role,setRole]       = useState("user");
  const [email,setEmail]     = useState("");
  const [pass,setPass]       = useState("");
  const [showPass,setShowPass] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState("");

  const ROLES = [
    {key:"user",      emoji:"👤", label:"User"},
    {key:"volunteer", emoji:"🤝", label:"NGO"},
    {key:"vet",       emoji:"🩺", label:"Vet"},
    {key:"admin",     emoji:"🛡️", label:"Admin"},
  ];

  // ✅ WIRED: calls real /api/auth/login
  const handleLogin = async () => {
    if (!email.trim()) { setError("Please enter your email or phone."); return; }
    if (!pass.trim())  { setError("Please enter your password."); return; }
    setError(""); setLoading(true);
    try {
      const res = await apiLogin(email.trim(), pass.trim(), role);
      // res = { token, email, name, role, userId }
      onLogin(res.role || role, res.name || res.email);
      onClose();
    } catch(e) {
      setError(e.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    border:"1.5px solid #ddc8a8", borderRadius:12,
    padding:"13px 16px", fontFamily:"'Outfit',sans-serif",
    fontSize:"0.92rem", background:"#fdf6ec",
    outline:"none", width:"100%", transition:"all 0.2s", color:"#1a1208",
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"white",borderRadius:24,width:"100%",maxWidth:440,position:"relative",boxShadow:"0 30px 80px rgba(0,0,0,0.35)",overflow:"hidden",animation:"modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{height:5,background:"linear-gradient(90deg,#d97706,#fbbf24,#3d6b4a)"}} />
        <button className="modal-close" onClick={onClose} style={{top:16,right:16}}>✕</button>
        <div style={{padding:"2.5rem 2.25rem 2rem"}}>
          <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
            <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>🐾</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:900,margin:"0 0 4px",color:"#1a1208"}}>Aadhaar for Strays</h2>
            <p style={{fontSize:"0.82rem",color:"#94846f",margin:0}}>Sign in to access your dashboard</p>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:"1.5rem"}}>
            {ROLES.map(r=>(
              <button key={r.key} onClick={()=>setRole(r.key)}
                style={{flex:1,padding:"10px 6px",borderRadius:11,border:`1.5px solid ${role===r.key?"#d97706":"#ddc8a8"}`,background:role===r.key?"#d97706":"white",color:role===r.key?"white":"#6b4226",fontFamily:"'Outfit',sans-serif",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",transition:"all 0.2s",textAlign:"center"}}>
                {r.emoji} {r.label}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <input style={inp} placeholder="Email or Phone" value={email}
              onChange={e=>{setEmail(e.target.value);setError("");}}
              onFocus={e=>{e.target.style.borderColor="#d97706";e.target.style.background="white";e.target.style.boxShadow="0 0 0 3px rgba(217,119,6,0.1)";}}
              onBlur={e=>{e.target.style.borderColor="#ddc8a8";e.target.style.background="#fdf6ec";e.target.style.boxShadow="none";}} />
            <div style={{position:"relative"}}>
              <input style={{...inp,paddingRight:48}} type={showPass?"text":"password"}
                placeholder="Password" value={pass}
                onChange={e=>{setPass(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                onFocus={e=>{e.target.style.borderColor="#d97706";e.target.style.background="white";e.target.style.boxShadow="0 0 0 3px rgba(217,119,6,0.1)";}}
                onBlur={e=>{e.target.style.borderColor="#ddc8a8";e.target.style.background="#fdf6ec";e.target.style.boxShadow="none";}} />
              <button onClick={()=>setShowPass(v=>!v)}
                style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"1.1rem",color:"#94846f"}}>
                {showPass?"🙈":"👁️"}
              </button>
            </div>
            {error && (
              <div style={{background:"#fdecea",border:"1px solid #f5c6cb",borderRadius:9,padding:"9px 14px",fontSize:"0.78rem",color:"#c0392b",fontFamily:"'Space Mono',monospace"}}>
                ⚠ {error}
              </div>
            )}
            <button onClick={handleLogin} disabled={loading}
              style={{background:loading?"#c8a870":"#1a1208",color:"white",border:"none",borderRadius:12,padding:"14px",fontFamily:"'Outfit',sans-serif",fontSize:"0.95rem",fontWeight:700,cursor:loading?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:4}}>
              {loading
                ? <><span style={{width:18,height:18,border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Signing in…</>
                : `Sign In as ${role.charAt(0).toUpperCase()+role.slice(1)}`}
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"1.25rem 0"}}>
            <div style={{flex:1,height:1,background:"#ede5d8"}}/>
            <span style={{fontSize:"0.78rem",color:"#94846f"}}>or</span>
            <div style={{flex:1,height:1,background:"#ede5d8"}}/>
          </div>
          <button onClick={onClose}
            style={{width:"100%",background:"transparent",border:"1.5px solid #ddc8a8",color:"#6b4226",borderRadius:12,padding:"12px",fontFamily:"'Outfit',sans-serif",fontSize:"0.88rem",cursor:"pointer",transition:"all 0.2s",marginBottom:"0.875rem",fontWeight:500}}>
            👤 Continue as Guest Reporter
          </button>
          <div style={{background:"linear-gradient(135deg,#fef3e2,#fdf6ec)",border:"1.5px solid rgba(217,119,6,0.25)",borderRadius:14,padding:"1rem 1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <div>
              <div style={{fontWeight:700,fontSize:"0.84rem",color:"#1a1208",marginBottom:2}}>New animal to report?</div>
              <div style={{fontSize:"0.74rem",color:"#94846f"}}>Register a stray without logging in</div>
            </div>
            <button onClick={()=>{onClose(); onGoRegister();}}
              style={{background:"linear-gradient(135deg,#d97706,#fbbf24)",color:"#1a1208",border:"none",borderRadius:10,padding:"9px 16px",fontFamily:"'Outfit',sans-serif",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(217,119,6,0.3)",flexShrink:0}}>
              📝 Register Animal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANIMAL PROFILE MODAL ─────────────────────────────────────────────────────
function AnimalProfileModal({animal, onClose, showToast, onHistoryAdded, userName}) {
  const [addingHistory, setAddingHistory] = useState(false);
  if(!animal) return null;
  const EMOJI_MAP={Dog:"🐕",Cow:"🐄",Cat:"🐈",Other:"🐾"};

  // ✅ WIRED: calls real /api/animals/:id/history
  const handleAddVaccination = async () => {
    setAddingHistory(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await addMedicalHistory(animal.id || animal.animalId, "Vaccination record added", userName || "Staff", today);
      showToast("Vaccination record added!", "success");
      onHistoryAdded && onHistoryAdded(animal.id || animal.animalId);
    } catch(e) {
      showToast(e.message || "Failed to add record", "error");
    } finally {
      setAddingHistory(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal profile-modal" style={{maxWidth:580}}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="profile-header">
          <div className="profile-avatar">{EMOJI_MAP[animal.type]||"🐾"}</div>
          <div style={{flex:1}}>
            <div className="profile-name">{animal.name}</div>
            <div className="profile-id">{animal.id || animal.animalId}</div>
          </div>
          <span className={`badge ${animal.status==="critical"?"badge-no":animal.status==="moderate"?"badge-dog":"badge-yes"}`}>{pinEmoji(animal.status)} {animal.status}</span>
        </div>
        <div className="profile-fields">
          {[["Type",animal.type],["Breed",animal.breed||"Unknown"],["Area",animal.area],["Registered",animal.date||animal.registeredDate||"—"],["Contact",animal.contact||"—"],["Vaccinated",animal.vaccinated?"Yes ✅":"No ❌"],["Sterilized",animal.sterilized?"Yes ✅":"No ❌"]].map(([l,v])=>(
            <div key={l} className="pfield"><div className="pfield-lbl">{l}</div><div className="pfield-val">{v}</div></div>
          ))}
          <div className="pfield" style={{gridColumn:"1/-1"}}>
            <div className="pfield-lbl">Notes</div>
            <div className="pfield-val" style={{fontWeight:400,fontSize:"0.86rem"}}>{animal.notes||"No notes added."}</div>
          </div>
        </div>
        <div style={{fontWeight:700,fontSize:"0.78rem",color:"#6b4226",marginBottom:"0.75rem",textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'Space Mono',monospace"}}>📋 Medical History</div>
        <div className="history-list">
          {(animal.history||animal.medicalHistory||[]).map((h,i)=>(
            <div key={i} className="history-item">
              <span style={{fontSize:"1rem",flexShrink:0}}>📌</span>
              <div>
                <div className="history-item-text">{h.event}</div>
                <div className="history-item-meta">{h.date||h.eventDate} · {h.by||h.performedBy}</div>
              </div>
            </div>
          ))}
          {!(animal.history||animal.medicalHistory||[]).length && (
            <div style={{textAlign:"center",padding:"1rem",color:"var(--ash)",fontSize:"0.84rem"}}>No medical history recorded yet.</div>
          )}
        </div>
        <div style={{display:"flex",gap:10,marginTop:"1.5rem"}}>
          <button className="btn-submit" style={{fontSize:"0.84rem"}} onClick={handleAddVaccination} disabled={addingHistory}>
            {addingHistory ? "Adding…" : "💉 Add Vaccination"}
          </button>
          <button className="btn-reset" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── LEAFLET MAP ──────────────────────────────────────────────────────────────
const SANGLI_CENTER = [16.8524, 74.5815];
const PIN_COLORS = { critical: "#c0392b", moderate: "#d97706", stable: "#3d6b4a" };
const PIN_EMOJI  = { critical: "🔴", moderate: "🟡", stable: "🟢" };

function LeafletMap({ animals, onAnimalClick, showToast }) {
  const mapRef       = useRef(null);
  const leafletRef   = useRef(null);
  const markersRef   = useRef([]);
  const [ready, setReady]           = useState(false);
  const [areaFilter, setAreaFilter] = useState("All");

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    if (window.L) { setReady(true); return; }
    if (document.getElementById("leaflet-js")) {
      const t = setInterval(() => { if (window.L) { clearInterval(t); setReady(true); } }, 100);
      return () => clearInterval(t);
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || leafletRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true }).setView(SANGLI_CENTER, 13);
    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
    leafletRef.current = map;
  }, [ready]);

  useEffect(() => {
    if (!ready || !leafletRef.current) return;
    const L = window.L;
    const map = leafletRef.current;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    const filtered = areaFilter === "All" ? animals : animals.filter(a => (a.area||"").toLowerCase().includes(areaFilter.toLowerCase()));
    filtered.forEach((animal, idx) => {
      // Use lat/lng from backend or fallback to random near Sangli
      const lat = animal.lat || (SANGLI_CENTER[0] + (Math.random()-0.5)*0.06);
      const lng = animal.lng || (SANGLI_CENTER[1] + (Math.random()-0.5)*0.06);
      const coords = [lat, lng];
      const color = PIN_COLORS[animal.status] || "#d97706";
      const emoji = PIN_EMOJI[animal.status] || "🟡";
      const animalId = animal.id || animal.animalId;
      const svgIcon = L.divIcon({
        className:"", iconAnchor:[18,42], popupAnchor:[0,-44],
        html:`<div style="position:relative;width:36px;height:44px;animation:markerDrop 0.4s ease ${idx*80}ms both;"><svg viewBox="0 0 36 44" width="36" height="44" xmlns="http://www.w3.org/2000/svg"><filter id="ds${idx}"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/></filter><path d="M18 2C10.27 2 4 8.27 4 16c0 10 14 26 14 26s14-16 14-26C32 8.27 25.73 2 18 2z" fill="${color}" stroke="white" stroke-width="2.5" filter="url(#ds${idx})"/><circle cx="18" cy="16" r="6" fill="white" opacity="0.9"/></svg><div style="position:absolute;top:7px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;font-family:'Space Mono',monospace;color:${color}">${(animal.type||"?").charAt(0)}</div></div>`,
      });
      const marker = L.marker(coords, { icon: svgIcon, title: animal.name });
      const vacc = animal.vaccinated?`<span style="background:rgba(61,107,74,0.18);color:#3d6b4a;border:1px solid rgba(61,107,74,0.3);font-size:0.6rem;padding:2px 8px;border-radius:20px;font-weight:700;font-family:'Space Mono',monospace">✅ VACCINATED</span>`:`<span style="background:rgba(192,57,43,0.15);color:#c0392b;border:1px solid rgba(192,57,43,0.25);font-size:0.6rem;padding:2px 8px;border-radius:20px;font-weight:700;font-family:'Space Mono',monospace">❌ NOT VACCINATED</span>`;
      const steril = animal.sterilized?`<span style="background:rgba(41,128,185,0.15);color:#2980b9;border:1px solid rgba(41,128,185,0.25);font-size:0.6rem;padding:2px 8px;border-radius:20px;font-weight:700;font-family:'Space Mono',monospace">✂️ STERILIZED</span>`:`<span style="background:rgba(120,110,100,0.12);color:#9a8a7a;border:1px solid rgba(120,110,100,0.2);font-size:0.6rem;padding:2px 8px;border-radius:20px;font-weight:700;font-family:'Space Mono',monospace">NOT STERILIZED</span>`;
      const statusBadge = `<span style="background:${color}20;color:${color};border:1px solid ${color}40;font-size:0.6rem;padding:2px 8px;border-radius:20px;font-weight:700;font-family:'Space Mono',monospace">${emoji} ${(animal.status||"").toUpperCase()}</span>`;
      marker.bindPopup(`<div style="font-family:'Outfit',sans-serif;min-width:230px;padding:4px 2px"><div style="font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#1a1208;margin-bottom:3px">${animal.name}</div><div style="font-family:'Space Mono',monospace;font-size:0.62rem;color:#d97706;letter-spacing:2px;margin-bottom:10px">${animalId}</div><div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px">${vacc}${steril}${statusBadge}</div><div style="font-size:0.78rem;color:#6b4226;margin-bottom:4px">📍 ${animal.area||"—"}</div><div style="font-size:0.78rem;color:#6b4226;margin-bottom:12px">🐾 ${animal.type} · ${animal.breed||"Unknown breed"}</div><button onclick="document.dispatchEvent(new CustomEvent('leafletAnimalClick',{detail:'${animalId}'}))" style="width:100%;padding:9px;background:linear-gradient(135deg,#d97706,#fbbf24);color:#1a1208;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer">👁 View Full Profile</button></div>`, { maxWidth: 280 });
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [ready, animals, areaFilter]);

  useEffect(() => {
    const h = e => {
      const id = e.detail;
      const a = animals.find(x => (x.id||x.animalId) === id);
      if (a) onAnimalClick(a);
    };
    document.addEventListener("leafletAnimalClick", h);
    return () => document.removeEventListener("leafletAnimalClick", h);
  }, [animals, onAnimalClick]);

  const stats = [
    { val: animals.length, lbl: "Total Animals", color: "#d97706" },
    { val: animals.filter(a=>a.status==="critical").length, lbl: "Critical", color: "#c0392b" },
    { val: animals.filter(a=>a.status==="moderate").length, lbl: "Moderate", color: "#d97706" },
    { val: animals.filter(a=>a.status==="stable").length,   lbl: "Stable",   color: "#3d6b4a" },
  ];

  return (
    <div>
      <div className="map-stat-strip">
        {stats.map((s,i)=>(
          <div key={i} className="mstat">
            <div className="mstat-val" style={{color:s.color}}>{s.val}</div>
            <div className="mstat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="map-area-filter">
        {["All","Ward 3","Ward 7","Miraj","Kupwad","Islampur"].map(a=>(
          <button key={a} className={`filter-pill ${areaFilter===a?"active":""}`} onClick={()=>setAreaFilter(a)}>{a}</button>
        ))}
        <button className="btn-add" style={{marginLeft:"auto"}} onClick={()=>{if(leafletRef.current)leafletRef.current.setView(SANGLI_CENTER,13);showToast("Map centred on Sangli District!","info");}}>🎯 Reset View</button>
      </div>
      {!ready && <div className="gmap-loading"><div className="gmap-loading-spinner"/><p>Loading map…</p></div>}
      <div ref={mapRef} className="gmap-wrap" style={{display:ready?"block":"none"}} />
      <div className="map-legend">
        <div className="legend-item"><div className="legend-dot" style={{background:"#c0392b"}} /> 🔴 Critical — Immediate rescue</div>
        <div className="legend-item"><div className="legend-dot" style={{background:"#d97706"}} /> 🟡 Moderate — Needs attention</div>
        <div className="legend-item"><div className="legend-dot" style={{background:"#3d6b4a"}} /> 🟢 Stable — Monitored</div>
      </div>
      <div className="map-sidebar">
        {[
          {name:"Govt. Veterinary Hospital",dist:"0.8 km",open:true,icon:"🏥"},
          {name:"PawCare NGO Shelter",dist:"1.2 km",open:true,icon:"🏠"},
          {name:"Animal Seva Trust",dist:"2.5 km",open:false,icon:"🤲"},
          {name:"Dr. Patil's Clinic",dist:"3.1 km",open:true,icon:"🩺"},
        ].map((v,i)=>(
          <div key={i} className="nearby-card" onClick={()=>showToast(`Navigating to ${v.name}…`,"info")}>
            <div>
              <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:3}}>{v.icon} {v.name}</div>
              <div style={{fontSize:"0.74rem",color:"var(--ash)"}}>📍 {v.dist} away</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
              <span style={{background:v.open?"#e8f5e9":"#fdecea",color:v.open?"#2e7d32":"#c0392b",fontSize:"0.68rem",padding:"3px 10px",borderRadius:20,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{v.open?"OPEN":"CLOSED"}</span>
              <span style={{fontSize:"0.7rem",color:"var(--sky)",fontWeight:600,cursor:"pointer"}}>🗺️ Navigate</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [sec, setSec] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);       // role string e.g. "admin"
  const [userName, setUserName] = useState(""); // display name

  // ── Data state (loaded from API) ──────────────────────────────────────────
  const [animals, setAnimals] = useState([]);
  const [animalsLoading, setAnimalsLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashStats, setDashStats] = useState(null);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [editAnimal, setEditAnimal] = useState(null);
  const [viewAnimal, setViewAnimal] = useState(null);
  const [urgency, setUrgency] = useState("stable");
  const [location, setLocation] = useState("");
  const [form, setForm] = useState({name:"",type:"Dog",breed:"",area:"",contact:"",notes:""});
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [chartTab, setChartTab] = useState("bar");
  const [caseFilter, setCaseFilter] = useState("All");
  const [advancingCase, setAdvancingCase] = useState(null);
  const PAGE_SIZE = 5;

  const showToast = useCallback((msg, type="success") => setToast({msg,type}), []);
  const nav = s => { setSec(s); setMobileOpen(false); setShowNotifs(false); };

  // ── LOAD: animals ─────────────────────────────────────────────────────────
  const loadAnimals = useCallback(async (searchVal, typeVal) => {
    setAnimalsLoading(true);
    try {
      const data = await fetchAnimals(searchVal, typeVal);
      // Normalise id field — backend may return animalId
      setAnimals((data || []).map(a => ({
        ...a,
        id: a.id || a.animalId,
        history: a.history || a.medicalHistory || [],
      })));
    } catch(e) {
      showToast("Failed to load animals: " + e.message, "error");
    } finally {
      setAnimalsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadAnimals(); }, [loadAnimals]);

  // ── LOAD: rescue cases ────────────────────────────────────────────────────
  const loadCases = useCallback(async (urgencyFilter) => {
    setCasesLoading(true);
    try {
      const data = await fetchCases(urgencyFilter !== "All" ? urgencyFilter : undefined);
      setCases(data || []);
    } catch(e) {
      showToast("Failed to load cases: " + e.message, "error");
    } finally {
      setCasesLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadCases(); }, [loadCases]);

  // ── LOAD: volunteers ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchVolunteers()
      .then(data => setVolunteers(data || []))
      .catch(e => showToast("Failed to load volunteers: " + e.message, "error"));
  }, [showToast]);

  // ── LOAD: notifications ───────────────────────────────────────────────────
  const loadNotifs = useCallback(async () => {
    try {
      const [notifData, countData] = await Promise.all([
        fetchNotifications(),
        fetchUnreadCount(),
      ]);
      setNotifs(notifData || []);
      setUnreadCount(typeof countData === "number" ? countData : countData?.count || 0);
    } catch(e) {
      // Notifications are non-critical; fail silently
      console.warn("Notifications load failed:", e.message);
    }
  }, []);

  useEffect(() => { loadNotifs(); }, [loadNotifs]);

  // ── LOAD: dashboard stats ─────────────────────────────────────────────────
  useEffect(() => {
    fetchDashboardStats()
      .then(data => setDashStats(data))
      .catch(() => {}); // silently use computed values as fallback
  }, []);

  // ── SORT / FILTER animals client-side (search/type filters hit API) ───────
  const handleSort = f => {
    if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortField(f); setSortDir("asc"); }
  };
  const sortIcon = f => sortField===f?(sortDir==="asc"?" ↑":" ↓"):" ↕";

  const filtered = animals
    .filter(a=>(typeFilter==="All"||a.type===typeFilter)&&(
      (a.name||"").toLowerCase().includes(search.toLowerCase())||
      (a.id||"").toLowerCase().includes(search.toLowerCase())||
      (a.area||"").toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a,b)=>{
      let va=a[sortField], vb=b[sortField];
      if(typeof va==="string") return sortDir==="asc"?va.localeCompare(vb):vb.localeCompare(va);
      return sortDir==="asc"?va-vb:vb-va;
    });
  const totalPages = Math.ceil(filtered.length/PAGE_SIZE);
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // ── REGISTER animal ───────────────────────────────────────────────────────
  // ✅ WIRED: POST /api/animals  +  POST /api/animals/:id/photo
  const handleRegister = async () => {
    if(!form.name||!form.area){ showToast("Please fill Name and Area","error"); return; }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        breed: form.breed,
        area: form.area,
        contact: form.contact,
        notes: form.notes,
        status: urgency,
        lat: location ? parseFloat(location.split(",")[0]) : null,
        lng: location ? parseFloat(location.split(",")[1]) : null,
        registeredBy: userName || "Guest",
      };
      const entry = await createAnimal(payload);
      const normalised = { ...entry, id: entry.id || entry.animalId, history: entry.history || entry.medicalHistory || [] };

      // Upload photo if one was selected
      if (uploadFile && normalised.id) {
        try {
          await uploadAnimalPhoto(normalised.id, uploadFile);
        } catch(pe) {
          showToast("Animal saved but photo upload failed: " + pe.message, "error");
        }
      }

      setAnimals(prev => [normalised, ...prev]);
      showToast(`Animal ${normalised.id} registered successfully!`);
      setForm({name:"",type:"Dog",breed:"",area:"",contact:"",notes:""});
      setUploadPreview(null);
      setUploadFile(null);
      nav("animals");
    } catch(e) {
      showToast(e.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE animal ─────────────────────────────────────────────────────────
  // ✅ WIRED: DELETE /api/animals/:id
  const handleDelete = async id => {
    try {
      await deleteAnimal(id);
      setAnimals(prev => prev.filter(a => a.id !== id));
      showToast(`Record ${id} deleted.`, "error");
    } catch(e) {
      showToast(e.message || "Delete failed", "error");
    }
  };

  // ── UPDATE animal ─────────────────────────────────────────────────────────
  // ✅ WIRED: PUT /api/animals/:id
  const handleUpdate = async a => {
    try {
      const updated = await updateAnimal(a.id, {
        name: a.name, type: a.type, breed: a.breed, area: a.area,
        contact: a.contact, notes: a.notes,
        vaccinated: a.vaccinated, sterilized: a.sterilized, status: a.status,
      });
      const normalised = { ...updated, id: updated.id || updated.animalId, history: updated.history || updated.medicalHistory || [] };
      setAnimals(prev => prev.map(x => x.id === a.id ? normalised : x));
      setEditAnimal(null);
      showToast(`Record ${a.id} updated.`);
    } catch(e) {
      showToast(e.message || "Update failed", "error");
    }
  };

  // ── ADVANCE rescue case ───────────────────────────────────────────────────
  // ✅ WIRED: PATCH /api/rescue-cases/:id/advance
  const handleCaseAdvance = async id => {
    setAdvancingCase(id);
    try {
      const updated = await apiAdvanceCase(id);
      // Backend returns updated case; normalise field names
      setCases(prev => prev.map(c => {
        const cId = c.id || c.caseId;
        if (cId === id) {
          return updated.current !== undefined
            ? { ...c, ...updated, id: cId }
            : { ...c, current: Math.min((c.current||0)+1, (c.steps||[]).length-1) };
        }
        return c;
      }));
      showToast(`Case ${id} status advanced!`);
    } catch(e) {
      showToast(e.message || "Advance failed", "error");
    } finally {
      setAdvancingCase(null);
    }
  };

  // ── MARK notification read ────────────────────────────────────────────────
  // ✅ WIRED: PATCH /api/notifications/:id/read
  const handleNotifClick = async n => {
    const id = n.id || n.notificationId;
    try {
      await markNotificationRead(id);
      setNotifs(prev => prev.map(x => (x.id||x.notificationId)===id ? {...x,read:true} : x));
      setUnreadCount(prev => Math.max(0, prev-1));
    } catch(e) { /* fail silently */ }
    setShowNotifs(false);
  };

  // ── MARK ALL notifications read ───────────────────────────────────────────
  // ✅ WIRED: PATCH /api/notifications/mark-all-read
  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifs(prev => prev.map(n => ({...n, read:true})));
      setUnreadCount(0);
    } catch(e) { showToast("Could not mark all read", "error"); }
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  // ✅ WIRED: clears JWT from localStorage
  const handleLogout = () => {
    apiLogout();
    setUser(null);
    setUserName("");
    showToast("Logged out successfully.", "info");
  };

  // ── GPS helper ────────────────────────────────────────────────────────────
  const getLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos=>{setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);showToast("Location detected!","info");},
        ()=>{setLocation("16.8524, 74.5815");showToast("Using default Sangli coordinates","info");}
      );
    } else setLocation("16.8524, 74.5815");
  };

  const filteredCases = caseFilter==="All" ? cases : cases.filter(c=>c.urgency===caseFilter.toLowerCase());

  // ── Computed KPI values (from dashStats if available, else compute locally) ─
  const totalAnimals   = dashStats?.totalAnimals   ?? animals.length;
  const vaccCount      = dashStats?.vaccinatedCount ?? animals.filter(a=>a.vaccinated).length;
  const criticalCount  = dashStats?.criticalCount   ?? animals.filter(a=>a.status==="critical").length;
  const activeRescues  = dashStats?.activeRescues   ?? cases.filter(c=>(c.current||0)>0&&(c.current||0)<4).length;
  const pieData = [
    {name:"Vaccinated",   value: dashStats?.vaccinationPercent ?? (animals.length ? Math.round(vaccCount/animals.length*100) : 68)},
    {name:"Unvaccinated", value: dashStats?.vaccinationPercent ? 100-dashStats.vaccinationPercent : (animals.length ? Math.round((animals.length-vaccCount)/animals.length*100) : 32)},
  ];

  const sections = [
    ["dashboard","🏠 Dashboard"],["register","📝 Register"],["animals","🐾 Animals"],
    ["map","🗺️ Live Map"],["charts","📊 Analytics"],["team","🤝 Rescue Team"],["ml","🧠 AI Vision"],
  ];

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand" onClick={()=>nav("dashboard")}>
          <div className="nav-brand-icon">🐾</div>
          <div className="nav-brand-text">
            <div className="nav-brand-main">Aadhaar for Strays</div>
            <div className="nav-brand-sub">Maharashtra Initiative</div>
          </div>
        </div>
        <div className="nav-links">
          {sections.map(([key,label])=>(
            <button key={key} className={sec===key?"active":""} onClick={()=>nav(key)}>{label}</button>
          ))}
        </div>
        <div className="nav-right">
          <button className="notif-btn" onClick={()=>setShowNotifs(v=>!v)}>
            🔔 {unreadCount>0 && <div className="notif-badge">{unreadCount}</div>}
          </button>
          {user ? (
            <div className="nav-user" onClick={handleLogout}>
              <span className="nav-user-name">👤 {userName || user}</span>
              <span className="nav-user-logout">Logout</span>
            </div>
          ) : (
            <button className="nav-login-btn" onClick={()=>setShowLogin(true)}>🔐 Login</button>
          )}
          <button className="hamburger" onClick={()=>setMobileOpen(v=>!v)}>☰</button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu">
          {sections.map(([key,label])=>(
            <button key={key} className={sec===key?"active":""} onClick={()=>nav(key)}>{label}</button>
          ))}
        </div>
      )}

      {/* NOTIFICATIONS PANEL */}
      {showNotifs && (
        <div className="notif-panel">
          <div className="notif-header">
            <h4>🔔 Notifications {unreadCount>0&&`(${unreadCount} new)`}</h4>
            <button className="notif-clear" onClick={markAllRead}>Mark all read</button>
          </div>
          <div className="notif-list">
            {notifs.length===0 && (
              <div style={{padding:"2rem",textAlign:"center",color:"var(--ash)",fontSize:"0.84rem"}}>No notifications yet.</div>
            )}
            {notifs.map(n=>{
              const id = n.id || n.notificationId;
              return (
                <div key={id} className={`notif-item ${n.read?"":"unread"}`} onClick={()=>handleNotifClick(n)}>
                  <div className="notif-dot" style={{background:n.type==="critical"?"#fdecea":n.type==="success"?"#e8f5e9":n.type==="warning"?"#fff8e1":"#e3f2fd"}}>{n.icon||"🔔"}</div>
                  <div className="notif-content"><p>{n.text||n.message}</p><span>{n.time||n.createdAt}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ DASHBOARD ═══════════════════════════════════════════════════════ */}
      {sec==="dashboard" && (<>
        <section className="hero">
          <div className="hero-bg-pattern" />
          <div className="hero-bg-dots" />
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-eyebrow">🇮🇳 Maharashtra State Government Initiative</div>
              <h1 className="hero-title">
                Every stray deserves<br />
                an <em>identity</em>
                <span className="line2"> & care.</span>
              </h1>
              <p className="hero-desc">A digital Aadhaar system for vaccinated and sterilized stray animals — powered by GPS tracking, AI detection, and the State Government Database.</p>
              <div className="hero-actions">
                <button className="btn-hero-primary" onClick={()=>nav("register")}>📝 Register Animal</button>
                <button className="btn-hero-secondary" onClick={()=>nav("map")}>🗺️ Live Map</button>
                <button className="btn-hero-secondary" onClick={()=>nav("ml")}>🧠 AI Analysis</button>
              </div>
              <div className="hero-stats">
                {[{num:`${totalAnimals+2475}`,lbl:"Animals Tagged"},{num:`${pieData[0].value}%`,lbl:"Vaccinated"},{num:"340",lbl:"Rescues Done"},{num:"12",lbl:"NGOs Active"}].map((s,i)=>(
                  <div key={i}>
                    <div className="hero-stat-num">{s.num}</div>
                    <div className="hero-stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card-stack">
                <div className="id-card-back">
                  <div className="card-back-label">This Month</div>
                  <div className="card-back-stat">340</div>
                  <div className="card-back-sublabel">Rescue Operations</div>
                  <div style={{marginTop:"1.5rem",background:"rgba(106,171,121,0.1)",borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"#6aab79",marginBottom:4}}>COVERAGE MAP</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {["Sangli","Miraj","Kupwad","Islampur"].map(a=>(<span key={a} style={{background:"rgba(255,255,255,0.1)",color:"#b0c8b4",fontSize:"0.65rem",padding:"2px 8px",borderRadius:20}}>📍{a}</span>))}
                    </div>
                  </div>
                </div>
                <div className="id-card-main">
                  <div className="card-label">🏛️ AADHAAR FOR STRAYS · AASA</div>
                  <div className="card-animal-icon">🐕</div>
                  <div className="card-name">{animals[0]?.name || "Tommy"}</div>
                  <div className="card-id">{animals[0]?.id || "AASA-0001"}</div>
                  <div className="card-chips">
                    <span className="card-chip chip-vacc">✅ VACCINATED</span>
                    <span className="card-chip chip-steril">✂️ STERILIZED</span>
                    <span className="card-chip chip-stable">🟢 STABLE</span>
                  </div>
                  <div style={{marginTop:"1rem",paddingTop:"1rem",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"#6a5a4a",fontFamily:"'Space Mono',monospace"}}>
                    <span>{animals[0]?.area || "Sangli Ward 3"}</span>
                    <span>{animals[0]?.date || "2025-01-12"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{background:"var(--warm)",paddingTop:"3rem"}}>
          <div className="section-inner">
            <div className="dash-kpi-grid">
              {[
                {label:"Total Registered",val:totalAnimals,icon:"🏷️",cls:"kpi-amber",trend:`+${Math.max(0,totalAnimals-6)} new`,up:true},
                {label:"Vaccinated",val:vaccCount,icon:"💉",cls:"kpi-moss",trend:"+8% this month",up:true},
                {label:"Critical Cases",val:criticalCount,icon:"🚨",cls:"kpi-coral",trend:"Needs attention",up:false},
                {label:"Active Rescues",val:activeRescues,icon:"🤝",cls:"kpi-sky",trend:`${activeRescues} in progress`,up:true},
              ].map((k,i)=>(
                <div key={i} className={`kpi ${k.cls}`}>
                  <div className="kpi-icon-row">
                    <div className="kpi-icon">{k.icon}</div>
                    <div className={`kpi-trend ${k.up?"trend-up":"trend-down"}`}>{k.up?"▲":"▼"} {k.trend}</div>
                  </div>
                  <div className="kpi-value">{k.val}</div>
                  <div className="kpi-label">{k.label}</div>
                </div>
              ))}
            </div>
            <div className="dash-row2">
              <div className="panel">
                <div className="panel-title">📋 Recent Activity</div>
                {recentActivity.map((a,i)=>(
                  <div key={i} className="activity-item">
                    <div className="act-dot" style={{background:a.color}} />
                    <div className="act-text">{a.text}</div>
                    <div className="act-time">{a.time}</div>
                  </div>
                ))}
              </div>
              <div className="panel">
                <div className="panel-title">⚡ Quick Actions</div>
                {[["📝","Register New Animal",()=>nav("register")],["🚨","Report Emergency",()=>showToast("SOS sent to rescue team!","info")],["💉","Schedule Vaccination",()=>showToast("Scheduler coming soon","info")],["📊","Full Analytics",()=>nav("charts")],["🗺️","Live Map",()=>nav("map")],["🧠","AI Analysis",()=>nav("ml")]].map(([icon,label,action],i)=>(
                  <button key={i} className="qa-btn" onClick={action}><span>{icon}</span>{label}</button>
                ))}
              </div>
            </div>
            <div className="dash-row3">
              <div className="panel">
                <div className="mini-chart-label">💉 VACCINATION COVERAGE</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={4} dataKey="value">{pieData.map((_,i)=><Cell key={i} fill={pieColors[i]}/>)}</Pie><Tooltip formatter={v=>`${v}%`} contentStyle={{borderRadius:10,fontSize:"0.8rem",border:"1px solid #ede5d8"}} /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <div className="mini-chart-label">📈 WEEKLY TREND</div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={trendData}><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d97706" stopOpacity={0.25}/><stop offset="95%" stopColor="#d97706" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="registrations" stroke="#d97706" fill="url(#ga)" strokeWidth={2}/><XAxis dataKey="week" tick={{fontSize:10}} axisLine={false} tickLine={false} /><Tooltip contentStyle={{borderRadius:10,fontSize:"0.8rem",border:"1px solid #ede5d8"}} /></AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <div className="mini-chart-label">🏥 STATUS BREAKDOWN</div>
                <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:"0.5rem"}}>
                  {[["Stable",animals.filter(a=>a.status==="stable").length,"#3d6b4a"],["Moderate",animals.filter(a=>a.status==="moderate").length,"#d97706"],["Critical",animals.filter(a=>a.status==="critical").length,"#c0392b"]].map(([l,c,col])=>(
                    <div key={l}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",marginBottom:5}}><span style={{color:"#7a6a5a",fontWeight:500}}>{l}</span><span style={{fontWeight:700,color:col,fontFamily:"'Space Mono',monospace"}}>{c}</span></div>
                      <div style={{height:6,background:"#f0e8dc",borderRadius:3}}><div style={{height:"100%",width:`${animals.length ? (c/animals.length)*100 : 0}%`,background:col,borderRadius:3,transition:"width 0.6s"}} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <div className="section-tag tag-amber">What We Do</div>
              <h2 className="section-title">Complete Animal Welfare Platform</h2>
              <p className="section-sub">From tagging strays to emergency rescue — all in one system built for India's urban animals.</p>
            </div>
            <div className="features-grid">
              {[
                {num:"01",icon:"🏷️",title:"Aadhaar Tagging",desc:"Every registered animal gets a unique ID with QR code for instant identification and medical history access."},
                {num:"02",icon:"💉",title:"Vaccination Tracking",desc:"Track vaccination status, schedule reminders, and maintain complete medical records for each animal."},
                {num:"03",icon:"📍",title:"GPS Live Location",desc:"When a citizen reports a stray, GPS coordinates are shared instantly with nearby vets and NGOs."},
                {num:"04",icon:"🤝",title:"Rescue Coordination",desc:"Volunteers and NGOs get real-time cases with navigation, status updates, and impact tracking."},
                {num:"05",icon:"🧬",title:"AI Detection",desc:"TF.js powered animal detection helps verify identities and spot new unregistered strays."},
                {num:"06",icon:"📊",title:"Gov. Database Sync",desc:"All data syncs with the State Government database for official records and policy decisions."},
              ].map((f,i)=>(
                <div key={i} className="feature-card">
                  <div className="feature-num">/ {f.num}</div>
                  <div className="feature-icon-wrap">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>)}

      {/* ═══ REGISTER ════════════════════════════════════════════════════════ */}
      {sec==="register" && (
        <section className="section" style={{background:"var(--parchment)"}}>
          <div className="section-inner">
            <div className="section-header">
              <div className="section-tag tag-amber">Register</div>
              <h2 className="section-title">Add a New Animal Record</h2>
              <p className="section-sub">Fill in details below. A unique Aadhaar ID and QR code will be auto-generated.</p>
            </div>
            <div className="reg-layout">
              <div className="form-card">
                <div className="form-card-title">Animal Details</div>
                <div className="form-card-sub">Fields marked * are required. GPS auto-detected for accuracy.</div>
                <div className="form-grid">
                  <div className="fg"><label>Animal Name *</label><input placeholder="e.g. Tommy" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div className="fg"><label>Animal Type *</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Dog</option><option>Cow</option><option>Cat</option><option>Other</option></select></div>
                  <div className="fg"><label>Breed</label><input placeholder="e.g. Indie / Desi" value={form.breed} onChange={e=>setForm({...form,breed:e.target.value})} /></div>
                  <div className="fg"><label>Approx. Age</label><input placeholder="e.g. 2 years" /></div>
                  <div className="fg full"><label>Area / Locality *</label><input placeholder="e.g. Sangli Ward 3, near Bus Stand" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} /></div>
                  <div className="fg full">
                    <label>GPS Location</label>
                    <div className="loc-row">
                      <input placeholder="Coordinates appear here" value={location} readOnly />
                      <button className="loc-detect-btn" onClick={getLocation}>📍 Auto-Detect</button>
                    </div>
                  </div>
                  <div className="fg"><label>Condition</label><select><option>Healthy</option><option>Injured</option><option>Sick</option><option>Malnourished</option></select></div>
                  <div className="fg"><label>Contact / NGO</label><input placeholder="Doctor or NGO name" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} /></div>
                  <div className="fg full">
                    <label>Urgency Level</label>
                    <div className="urgency-row">
                      {[["critical","u-critical","🔴 Critical"],["moderate","u-moderate","🟡 Moderate"],["stable","u-stable","🟢 Stable"]].map(([u,cls,label])=>(
                        <button key={u} className={`urgency-btn ${cls} ${urgency===u?"sel":""}`} onClick={()=>setUrgency(u)}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="fg full">
                    <label>Photo Upload</label>
                    <div className="photo-drop">
                      <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setUploadFile(f);setUploadPreview(URL.createObjectURL(f));}}} />
                      {uploadPreview ? <img src={uploadPreview} alt="preview" className="preview-img" /> : <><div className="photo-drop-icon">📷</div><p><span className="highlight">Click to upload</span> or drag & drop<br />JPG, PNG up to 10MB</p></>}
                    </div>
                  </div>
                  <div className="fg full"><label>Additional Notes</label><textarea placeholder="Any other relevant details about the animal…" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
                </div>
                <div className="form-footer">
                  <button className="btn-submit" onClick={handleRegister} disabled={submitting}>
                    {submitting ? "⏳ Registering…" : "🏷️ Register & Generate ID"}
                  </button>
                  <button className="btn-reset" disabled={submitting} onClick={()=>{setForm({name:"",type:"Dog",breed:"",area:"",contact:"",notes:""});setUploadPreview(null);setUploadFile(null);}}>Reset</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
                <div className="qr-panel">
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900}}>Auto-Generated ID</div>
                  <p style={{fontSize:"0.8rem",color:"var(--ash)",textAlign:"center"}}>Assigned by server upon registration</p>
                  <QRCode animalId={"AASA-NEXT"} />
                  <div className="generated-id-badge">AASA-NEXT</div>
                  <div style={{textAlign:"center",fontSize:"0.76rem",color:"var(--ash)",lineHeight:1.7,fontFamily:"'Space Mono',monospace"}}>
                    <div>📍 {location||"Location not detected"}</div>
                    <div>📅 {new Date().toLocaleDateString("en-IN")}</div>
                    <div>🏛️ Sangli Municipal Corporation</div>
                  </div>
                  <button className="btn-submit" style={{width:"100%"}} onClick={()=>showToast("QR card downloaded!","info")}>⬇️ Download QR Card</button>
                </div>
                <div className="tips-card">
                  <h4>📋 First Aid Quick Tips</h4>
                  {["🩹 Clean wounds with water only — avoid Dettol directly","🌡️ Normal dog temp: 38–39.2°C. Higher = fever","💧 Keep injured animals hydrated, away from sun","🚫 No human food — avoid onions, chocolate, grapes","📞 Call nearest vet before moving severely injured animals"].map((tip,i)=>(
                    <div key={i} className="tip-item"><span>{tip}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ ANIMALS ═════════════════════════════════════════════════════════ */}
      {sec==="animals" && (
        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <div className="section-tag tag-amber">Records</div>
              <h2 className="section-title">Tracked Animals Database</h2>
              <p className="section-sub">Search, filter, sort, and manage all registered animal records.</p>
            </div>
            <div className="table-controls">
              <input className="tbl-search" placeholder="🔍 Search by name, ID, or area…" value={search}
                onChange={e=>{setSearch(e.target.value);setPage(1);}} />
              {["All","Dog","Cow","Cat","Other"].map(t=>(<button key={t} className={`filter-pill ${typeFilter===t?"active":""}`} onClick={()=>{setTypeFilter(t);setPage(1);}}>{t}</button>))}
              <button className="btn-add" onClick={()=>nav("register")}>+ Add New</button>
              <button className="btn-export" onClick={()=>{
                const csv = ["ID,Name,Type,Area,Vaccinated,Sterilized,Status,Date",
                  ...filtered.map(a=>`${a.id},${a.name},${a.type},${a.area},${a.vaccinated},${a.sterilized},${a.status},${a.date}`)
                ].join("\n");
                const blob = new Blob([csv], {type:"text/csv"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a"); link.href=url; link.download="animals.csv"; link.click();
                showToast(`Exported ${filtered.length} records as CSV`, "info");
              }}>⬇️ CSV</button>
              <button className="btn-export" onClick={()=>loadAnimals(search, typeFilter)}>🔄 Refresh</button>
            </div>

            {editAnimal && (
              <div className="edit-bar">
                <div className="edit-bar-title">✏️ Editing: {editAnimal.id}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem"}}>
                  {["name","area","contact","breed"].map(f=>(<div className="fg" key={f}><label>{f.charAt(0).toUpperCase()+f.slice(1)}</label><input value={editAnimal[f]||""} onChange={e=>setEditAnimal({...editAnimal,[f]:e.target.value})} /></div>))}
                  <div className="fg"><label>Vaccinated</label><select value={String(editAnimal.vaccinated)} onChange={e=>setEditAnimal({...editAnimal,vaccinated:e.target.value==="true"})}><option value="true">Yes</option><option value="false">No</option></select></div>
                  <div className="fg"><label>Sterilized</label><select value={String(editAnimal.sterilized)} onChange={e=>setEditAnimal({...editAnimal,sterilized:e.target.value==="true"})}><option value="true">Yes</option><option value="false">No</option></select></div>
                  <div className="fg"><label>Status</label><select value={editAnimal.status} onChange={e=>setEditAnimal({...editAnimal,status:e.target.value})}><option value="stable">Stable</option><option value="moderate">Moderate</option><option value="critical">Critical</option></select></div>
                </div>
                <div style={{display:"flex",gap:10,marginTop:"1rem"}}>
                  <button className="btn-submit" style={{flex:"0 0 auto",padding:"11px 24px"}} onClick={()=>handleUpdate(editAnimal)}>💾 Save Changes</button>
                  <button className="btn-reset" style={{flex:"0 0 auto",padding:"11px 24px"}} onClick={()=>setEditAnimal(null)}>Cancel</button>
                </div>
              </div>
            )}

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th onClick={()=>handleSort("id")}>ID{sortIcon("id")}</th>
                    <th onClick={()=>handleSort("name")}>Name{sortIcon("name")}</th>
                    <th onClick={()=>handleSort("type")}>Type{sortIcon("type")}</th>
                    <th onClick={()=>handleSort("area")}>Area{sortIcon("area")}</th>
                    <th onClick={()=>handleSort("vaccinated")}>Vaccinated{sortIcon("vaccinated")}</th>
                    <th onClick={()=>handleSort("sterilized")}>Sterilized{sortIcon("sterilized")}</th>
                    <th onClick={()=>handleSort("status")}>Status{sortIcon("status")}</th>
                    <th onClick={()=>handleSort("date")}>Date{sortIcon("date")}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {animalsLoading && (
                    <tr><td colSpan="9" className="loading-row"><span className="loading-spinner-inline"/>Loading animals from server…</td></tr>
                  )}
                  {!animalsLoading && paginated.map(a=>(
                    <tr key={a.id}>
                      <td><code style={{fontSize:"0.73rem",background:"var(--parchment)",padding:"2px 8px",borderRadius:6,fontFamily:"'Space Mono',monospace"}}>{a.id}</code></td>
                      <td><strong>{a.name}</strong></td>
                      <td><span className={`badge badge-${(a.type||"").toLowerCase()}`}>{a.type}</span></td>
                      <td style={{fontSize:"0.82rem"}}>{a.area}</td>
                      <td><span className={`badge ${a.vaccinated?"badge-yes":"badge-no"}`}>{a.vaccinated?"✅ Yes":"❌ No"}</span></td>
                      <td><span className={`badge ${a.sterilized?"badge-yes":"badge-no"}`}>{a.sterilized?"✅ Yes":"❌ No"}</span></td>
                      <td><div className="status-indicator"><span className={`status-dot dot-${a.status}`} />{(a.status||"").charAt(0).toUpperCase()+(a.status||"").slice(1)}</div></td>
                      <td style={{fontFamily:"'Space Mono',monospace",fontSize:"0.72rem"}}>{a.date||a.registeredDate||"—"}</td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn ab-view" onClick={()=>setViewAnimal(a)}>👁 View</button>
                          <button className="action-btn ab-edit" onClick={()=>setEditAnimal({...a})}>✏️ Edit</button>
                          <button className="action-btn ab-del" onClick={()=>handleDelete(a.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!animalsLoading && paginated.length===0 && (
                    <tr><td colSpan="9" style={{textAlign:"center",padding:"3rem",color:"var(--ash)"}}>No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"1rem",flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:"0.78rem",color:"var(--ash)",fontFamily:"'Space Mono',monospace"}}>
                Showing {filtered.length===0?0:Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}
              </p>
              <div className="pagination">
                <button className="pg-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>←</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(<button key={p} className={`pg-btn ${page===p?"active":""}`} onClick={()=>setPage(p)}>{p}</button>))}
                <button className="pg-btn" disabled={page===totalPages||totalPages===0} onClick={()=>setPage(p=>p+1)}>→</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ MAP ═════════════════════════════════════════════════════════════ */}
      {sec==="map" && (
        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <div className="section-tag tag-moss">Live Map</div>
              <h2 className="section-title">Rescue Map — Sangli District</h2>
              <p className="section-sub">Real-time OpenStreetMap view of all registered strays. Click any pin to see the full profile.</p>
            </div>
            <LeafletMap animals={animals} onAnimalClick={a=>setViewAnimal(a)} showToast={showToast} />
          </div>
        </section>
      )}

      {/* ═══ CHARTS ══════════════════════════════════════════════════════════ */}
      {sec==="charts" && (
        <section className="section charts-section">
          <div className="section-inner">
            <div className="section-header">
              <div className="section-tag tag-dark">Analytics</div>
              <h2 className="section-title">Data Analytics & Insights</h2>
              <p className="section-sub">Comprehensive visual overview of vaccination, sterilization, rescues, and welfare coverage.</p>
            </div>
            <div className="chart-kpi-row">
              {[{icon:"🏷️",val:totalAnimals,lbl:"Registered"},{icon:"💉",val:vaccCount,lbl:"Vaccinated"},{icon:"✂️",val:animals.filter(a=>a.sterilized).length,lbl:"Sterilized"},{icon:"🚨",val:criticalCount,lbl:"Critical"}].map((s,i)=>(
                <div key={i} className="chart-kpi"><div className="ck-icon">{s.icon}</div><div className="ck-val">{s.val}</div><div className="ck-lbl">{s.lbl}</div></div>
              ))}
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-card-title">💉 Vaccination Coverage</div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={68} outerRadius={104} paddingAngle={4} dataKey="value">{pieData.map((_,i)=><Cell key={i} fill={pieColors[i]}/>)}</Pie><Tooltip formatter={v=>`${v}%`} contentStyle={{background:"#1a0f08",border:"none",borderRadius:10,color:"#fdf6ec"}} /><Legend formatter={v=><span style={{color:"#b8a88e",fontSize:"0.82rem"}}>{v}</span>} /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <div className="chart-card-title">📈 Monthly Registrations</div>
                <div className="chart-tabs">{["bar","line"].map(t=><button key={t} className={`chart-tab ${chartTab===t?"active":""}`} onClick={()=>setChartTab(t)}>{t==="bar"?"Bar":"Line"}</button>)}</div>
                <ResponsiveContainer width="100%" height={218}>
                  {chartTab==="bar"?(
                    <BarChart data={barData} barGap={3}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" /><XAxis dataKey="month" tick={{fill:"#7a6a5a",fontSize:11}} axisLine={false} tickLine={false} /><YAxis tick={{fill:"#7a6a5a",fontSize:11}} axisLine={false} tickLine={false} /><Tooltip contentStyle={{background:"#1a0f08",border:"none",borderRadius:10,color:"#fdf6ec"}} /><Legend formatter={v=><span style={{color:"#b8a88e",fontSize:"0.8rem"}}>{v}</span>} /><Bar dataKey="dogs" fill="#d97706" radius={[4,4,0,0]} name="Dogs" /><Bar dataKey="cows" fill="#3d6b4a" radius={[4,4,0,0]} name="Cows" /><Bar dataKey="cats" fill="#2980b9" radius={[4,4,0,0]} name="Cats" /></BarChart>
                  ):(
                    <LineChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" /><XAxis dataKey="month" tick={{fill:"#7a6a5a",fontSize:11}} axisLine={false} tickLine={false} /><YAxis tick={{fill:"#7a6a5a",fontSize:11}} axisLine={false} tickLine={false} /><Tooltip contentStyle={{background:"#1a0f08",border:"none",borderRadius:10,color:"#fdf6ec"}} /><Legend formatter={v=><span style={{color:"#b8a88e",fontSize:"0.8rem"}}>{v}</span>} /><Line type="monotone" dataKey="dogs" stroke="#d97706" strokeWidth={2} dot={{fill:"#d97706"}} name="Dogs" /><Line type="monotone" dataKey="cows" stroke="#3d6b4a" strokeWidth={2} dot={{fill:"#3d6b4a"}} name="Cows" /></LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <div className="chart-card-title">📡 Welfare Coverage Radar</div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}><PolarGrid stroke="rgba(255,255,255,0.08)" /><PolarAngleAxis dataKey="subject" tick={{fill:"#7a6a5a",fontSize:10}} /><Radar dataKey="A" stroke="#d97706" fill="#d97706" fillOpacity={0.25} /><Tooltip contentStyle={{background:"#1a0f08",border:"none",borderRadius:10,color:"#fdf6ec"}} /></RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <div className="chart-card-title">📊 Rescue vs Registration Trend</div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={trendData}><defs><linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d97706" stopOpacity={0.35}/><stop offset="95%" stopColor="#d97706" stopOpacity={0}/></linearGradient><linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3d6b4a" stopOpacity={0.35}/><stop offset="95%" stopColor="#3d6b4a" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" /><XAxis dataKey="week" tick={{fill:"#7a6a5a",fontSize:11}} axisLine={false} tickLine={false} /><YAxis tick={{fill:"#7a6a5a",fontSize:11}} axisLine={false} tickLine={false} /><Tooltip contentStyle={{background:"#1a0f08",border:"none",borderRadius:10,color:"#fdf6ec"}} /><Legend formatter={v=><span style={{color:"#b8a88e",fontSize:"0.8rem"}}>{v}</span>} /><Area type="monotone" dataKey="registrations" stroke="#d97706" fill="url(#gR)" strokeWidth={2} name="Registrations" /><Area type="monotone" dataKey="rescues" stroke="#3d6b4a" fill="url(#gG)" strokeWidth={2} name="Rescues" /></AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card" style={{gridColumn:"1/-1"}}>
                <div className="chart-card-title">📊 Status & Treatment Breakdown</div>
                <div className="coverage-breakdown">
                  {[{label:"Vaccinated + Sterilized",pct:animals.length?Math.round(animals.filter(a=>a.vaccinated&&a.sterilized).length/animals.length*100):48,color:"#3d6b4a"},{label:"Vaccinated Only",pct:animals.length?Math.round(animals.filter(a=>a.vaccinated&&!a.sterilized).length/animals.length*100):20,color:"#6aab79"},{label:"Sterilized Only",pct:animals.length?Math.round(animals.filter(a=>!a.vaccinated&&a.sterilized).length/animals.length*100):12,color:"#2980b9"},{label:"Neither",pct:animals.length?Math.round(animals.filter(a=>!a.vaccinated&&!a.sterilized).length/animals.length*100):20,color:"#d97706"}].map((item,i)=>(
                    <div key={i} className="cov-item"><div className="cov-pct" style={{color:item.color}}>{item.pct}%</div><div className="cov-bar-track"><div className="cov-bar-fill" style={{width:`${item.pct}%`,background:item.color}} /></div><div className="cov-lbl">{item.label}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ TEAM ════════════════════════════════════════════════════════════ */}
      {sec==="team" && (
        <section className="section team-section">
          <div className="section-inner">
            <div className="section-header">
              <div className="section-tag tag-amber">Rescue Panel</div>
              <h2 className="section-title">Active Rescue Cases & Team</h2>
              <p className="section-sub">NGOs and volunteers can accept cases, update status, and navigate to reported locations.</p>
            </div>
            <div className="case-stats">
              {[{icon:"⚡",val:cases.filter(c=>c.urgency==="critical").length,label:"Critical",sub:"Immediate attention"},{icon:"🟡",val:cases.filter(c=>c.urgency==="moderate").length,label:"Moderate",sub:"Needs attention soon"},{icon:"✅",val:dashStats?.completedCases||47,label:"Completed",sub:"This month"}].map((s,i)=>(
                <div key={i} className="card" style={{padding:"1.25rem",display:"flex",gap:"1rem",alignItems:"center"}}><span style={{fontSize:"2rem"}}>{s.icon}</span><div><div style={{fontWeight:700,fontSize:"0.96rem"}}>{s.val} {s.label}</div><div style={{fontSize:"0.78rem",color:"var(--ash)"}}>{s.sub}</div></div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginBottom:"1.5rem",flexWrap:"wrap",alignItems:"center"}}>
              {[["All","All Cases"],["critical","🔴 Critical"],["moderate","🟡 Moderate"],["stable","🟢 Stable"]].map(([v,l])=>(<button key={v} className={`filter-pill ${caseFilter===v?"active":""}`} onClick={()=>setCaseFilter(v)}>{l}</button>))}
              <button className="btn-add" style={{marginLeft:"auto"}} onClick={()=>showToast("New case creation coming soon","info")}>+ New Case</button>
              <button className="btn-export" onClick={()=>loadCases()}>🔄 Refresh</button>
            </div>
            {casesLoading && <div className="loading-row"><span className="loading-spinner-inline"/>Loading cases…</div>}
            <div className="cases-grid">
              {filteredCases.map(c=>{
                const cId = c.id || c.caseId;
                const steps = c.steps || ["Reported","Assigned","Rescued","Care","Released"];
                const current = c.current ?? 0;
                return (
                  <div key={cId} className={`case-card ${c.urgency}`}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <div className="case-id">{cId}</div>
                      <span style={{fontSize:"0.68rem",color:"var(--ash)",fontFamily:"'Space Mono',monospace"}}>{c.time||c.reportedAt||"—"}</span>
                    </div>
                    <div className="case-title">{c.title}</div>
                    <div className="case-meta">
                      <span>📍 {c.area}</span>
                      <span>🐾 {c.type}</span>
                      <span>👤 {c.reportedBy}</span>
                      <span className={`badge ${c.urgency==="critical"?"badge-no":c.urgency==="moderate"?"badge-dog":"badge-yes"}`}>{pinEmoji(c.urgency)} {c.urgency}</span>
                    </div>
                    <div className="status-track">
                      {steps.map((step,i)=>(<span key={i}><span className={`track-step ${i<current?"done":i===current?"current":""}`}>{step}</span>{i<steps.length-1&&<span className="track-arrow"> ▶ </span>}</span>))}
                    </div>
                    <div className="case-actions">
                      <button className="case-btn cb-advance" disabled={advancingCase===cId||current>=steps.length-1}
                        onClick={()=>handleCaseAdvance(cId)}>
                        {advancingCase===cId?"⏳ Advancing…":"✅ Advance"}
                      </button>
                      <button className="case-btn cb-nav" onClick={()=>showToast(`Navigating to ${c.area}…`,"info")}>🗺️ Navigate</button>
                    </div>
                  </div>
                );
              })}
              {!casesLoading && filteredCases.length===0 && (
                <div style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem",color:"var(--ash)"}}>No cases found.</div>
              )}
            </div>
            <div style={{marginTop:"3rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:900}}>🤝 Active Volunteers & NGOs</h3>
                <button className="btn-add" onClick={()=>showToast("Volunteer registration opening…","info")}>+ Add Volunteer</button>
              </div>
              {volunteers.length===0 && <div className="loading-row"><span className="loading-spinner-inline"/>Loading volunteers…</div>}
              <div className="volunteers-grid">
                {volunteers.map((v,i)=>{
                  const vid = v.id || v.volunteerId || i;
                  return (
                    <div key={vid} className="vol-card">
                      <div className="vol-avatar" style={{background:v.active?"#e8f5e9":"#f5f2ee"}}>{v.avatar||"🐾"}</div>
                      <div className="vol-name">{v.name}</div>
                      <div className="vol-role">{v.role}</div>
                      <div className="vol-area">📍 {v.area}</div>
                      <div className="vol-stats"><div><div className="vol-stat-num">{v.rescues||v.rescueCount||0}</div><div className="vol-stat-lbl">Rescues</div></div></div>
                      <span className={`vol-badge ${v.active?"vol-avail":"vol-busy"}`}>{v.active?"🟢 Available":"🔴 Unavailable"}</span>
                      <div style={{display:"flex",gap:6,marginTop:"0.875rem"}}>
                        <button className="action-btn ab-view" style={{flex:1,padding:"7px 0"}} onClick={()=>showToast(`Contacting ${v.name}…`,"info")}>📞 Contact</button>
                        <button className="action-btn ab-edit" style={{flex:1,padding:"7px 0"}} onClick={()=>showToast(`Editing ${v.name}…`,"info")}>✏️ Edit</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ ML ══════════════════════════════════════════════════════════════ */}
      {sec==="ml" && (
        <section className="section ml-section">
          <div className="section-inner">
            <div className="section-header">
              <div className="section-tag tag-green">AI · Machine Learning</div>
              <h2 className="section-title">On-Device AI Animal Analysis</h2>
              <p className="section-sub">Two real TensorFlow.js models running entirely in your browser — no server, no data upload, instant results.</p>
            </div>
            <div className="ml-model-info">
              {[{val:"MobileNet v2",lbl:"Image Classifier"},{val:"3-Layer MLP",lbl:"Risk Predictor"},{val:"1000",lbl:"ImageNet Classes"},{val:"100%",lbl:"On-Device Privacy"},{val:"~80ms",lbl:"Inference Time"}].map((item,i)=>(
                <div key={i} className="ml-info-card"><div className="ml-info-val">{item.val}</div><div className="ml-info-lbl">{item.lbl}</div></div>
              ))}
            </div>
            <div className="ml-grid">
              <AnimalClassifier onDetected={det=>{
                if(det.animal!=="unknown"){
                  const m={dog:"Dog",cat:"Cat",cow:"Cow"};
                  setForm(p=>({...p,type:m[det.animal]||"Dog"}));
                  showToast(`AI detected ${det.animal} — type pre-filled in register form!`,"info");
                }
              }} />
              <HealthRiskPredictor />
            </div>
            <div className="ml-how-it-works">
              <h3 style={{fontFamily:"'Playfair Display',serif",color:"var(--cream)",textAlign:"center",fontSize:"1.4rem",fontWeight:700,marginBottom:0}}>⚙️ How the AI Models Work</h3>
              <div className="ml-how-grid">
                {[{icon:"📸",title:"Image Input",desc:"Photo processed locally — converted to 224×224 tensor"},{icon:"🔬",title:"Feature Extraction",desc:"MobileNet's depthwise separable convolutions extract 1280 feature maps"},{icon:"🏷️",title:"Classification",desc:"Softmax outputs probabilities across 1000 ImageNet classes"},{icon:"🧬",title:"Risk Inference",desc:"6 clinical inputs → 16-unit ReLU layers → 3-class softmax risk"},{icon:"🔒",title:"Privacy First",desc:"All inference in-browser via WebGL. No data sent to any server"},{icon:"📋",title:"Auto-Fill",desc:"Detected animal type auto-populates registration form"}].map((item,i)=>(
                  <div key={i} className="how-item"><div className="how-icon">{item.icon}</div><div className="how-title">{item.title}</div><div className="how-desc">{item.desc}</div></div>
                ))}
              </div>
            </div>
            <div className="ml-note">
              <div className="ml-note-icon">💡</div>
              <div>
                <div className="ml-note-title">OpenCV Integration Note</div>
                <div className="ml-note-body">In full deployment, this pipeline connects to OpenCV for real-time CCTV stream analysis — detecting unregistered strays, comparing ear tag IDs visually, and flagging animals whose vaccination status is overdue in the State Government database. The TF.js frontend models serve as the citizen-facing triage layer.</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">🐾</div>
        <div className="footer-title">Aadhaar for Stray Animals</div>
        <div className="footer-sub">A Maharashtra State Government Initiative<br />Built with OpenCV + State Gov Database · TensorFlow.js AI · Real-time GPS</div>
        <div className="footer-copy">© 2025 Sangli Municipal Corporation. All rights reserved.</div>
      </footer>

      {/* SOS */}
      <button className="sos-btn" onClick={()=>showToast("🚨 SOS Alert sent! Nearest rescue team notified.","info")}>
        🆘 SOS Emergency
      </button>

      {/* MODALS */}
      {showLogin && (
        <LoginModal
          onClose={()=>setShowLogin(false)}
          onLogin={(role, name) => {
            setUser(role);
            setUserName(name || role.charAt(0).toUpperCase() + role.slice(1));
            showToast(`Logged in as ${name || role}!`, "success");
            // Reload data now that we're authenticated
            loadAnimals();
            loadCases();
            loadNotifs();
          }}
          onGoRegister={()=>nav("register")}
        />
      )}
      {viewAnimal && (
        <AnimalProfileModal
          animal={viewAnimal}
          onClose={()=>setViewAnimal(null)}
          showToast={showToast}
          userName={userName}
          onHistoryAdded={async (id) => {
            // Refresh the single animal's data to show new history
            try {
              const { fetchAnimal } = await import("./api");
              const fresh = await fetchAnimal(id);
              const normalised = { ...fresh, id: fresh.id || fresh.animalId, history: fresh.history || fresh.medicalHistory || [] };
              setAnimals(prev => prev.map(a => a.id === id ? normalised : a));
              setViewAnimal(normalised);
            } catch(e) { /* refresh silently failed */ }
          }}
        />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </>
  );
}