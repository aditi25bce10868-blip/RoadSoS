import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ─── Inline styles (converted from class-based CSS) ──────────────────────────
const RED = "#CC0000";

const s: Record<string, React.CSSProperties> = {
  // layout
  wrap: {
    background: "#f0f0f0",
    borderRadius: 20,
    padding: "10px 8px 12px",
    maxWidth: 370,
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
  },
  app: {
    fontFamily: "'Inter', sans-serif",
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
  },
  scrollable: { overflowY: "auto", maxHeight: 580 },

  // step dots
  stepDots: { display: "flex", gap: 5, justifyContent: "center", padding: "8px 0 4px" },
  dot: { width: 6, height: 6, borderRadius: "50%", background: "#ddd" },
  dotOn: { width: 6, height: 6, borderRadius: "50%", background: RED },

  // nav bar
  navBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px 9px",
    borderBottom: "0.5px solid #e5e5e5",
    background: "#fff",
  },
  navLeft: { display: "flex", alignItems: "center", gap: 8 },
  logoCirc: {
    width: 34, height: 34, borderRadius: "50%", background: RED,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  navTitle: { fontSize: 15, fontWeight: 600, color: "#111", fontFamily: "'Poppins', sans-serif" },
  navSub: { fontSize: 11, color: "#888" },
  backBtn: { background: "none", border: "none", cursor: "pointer", padding: "2px 4px" },
  bellBtn: { background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative", marginLeft: "auto" },
  bellBadge: {
    position: "absolute", top: 1, right: 1, width: 14, height: 14,
    borderRadius: "50%", background: "#FFD600", border: "2px solid #fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 8, fontWeight: 500, color: "#7A5F00",
  },

  // splash
  splashBg: {
    background: RED, minHeight: 560,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  splashCard: {
    background: "#fff", borderRadius: 14, padding: "18px 56px", cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  splashText: { color: RED, fontSize: 22, fontWeight: 600, fontFamily: "'Poppins', sans-serif" },

  // SOS area
  sosArea: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 24, padding: "36px 16px 28px", background: "#fff",
  },
  pulseWrap: { position: "relative", width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  sosBtnMain: {
    position: "absolute", width: 160, height: 160, borderRadius: "50%",
    background: "linear-gradient(145deg,#FF2222,#CC0000)", border: "none", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, zIndex: 3,
    boxShadow: "0 0 0 8px rgba(204,0,0,0.12),0 0 0 18px rgba(204,0,0,0.07),0 8px 32px rgba(204,0,0,0.45)",
    outline: "none", transition: "transform 0.15s, box-shadow 0.15s",
  },
  sosBtnText: { color: "#fff", fontSize: 18, fontWeight: 800, letterSpacing: 4, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase", lineHeight: 1, textShadow: "0 2px 6px rgba(0,0,0,0.25)" },
  sosHint: { fontSize: 12, color: "#888", textAlign: "center" },
  botBar: { borderTop: "0.5px solid #e5e5e5", display: "flex", justifyContent: "center", padding: "10px 0", background: "#fff" },
  botItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },

  // modal
  modalWrap: { minHeight: 560, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" },
  modal: {
    background: "#fff", borderRadius: 20, padding: "26px 20px 20px", width: 272,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12, border: "0.5px solid #e5e5e5",
  },
  mH: { fontSize: 17, fontWeight: 600, color: "#111", textAlign: "center", fontFamily: "'Poppins', sans-serif" },
  mP: { fontSize: 12, color: "#888", textAlign: "center", lineHeight: 1.5 },
  btnRed: {
    width: "100%", padding: 13, background: RED, color: "#fff", border: "none",
    borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
  },
  btnOutRed: {
    width: "100%", padding: 13, background: "transparent", color: RED,
    border: `1.5px solid ${RED}`, borderRadius: 12, fontSize: 13, fontWeight: 500,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
  },
  btnCancelLnk: { background: "none", border: "none", fontSize: 12, color: "#888", cursor: "pointer", padding: 3 },
  warnNote: { fontSize: 11, color: "#aaa", textAlign: "center" },
  btnGrayOut: {
    width: "100%", padding: 13, background: "transparent", color: "#111",
    border: "1px solid #ddd", borderRadius: 12, fontSize: 13, fontWeight: 500,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
  },

  // countdown
  cdownPg: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "28px 20px 24px" },
  cdRings: { position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" },
  cdCircle: {
    position: "absolute", width: 148, height: 148, borderRadius: "50%",
    background: "linear-gradient(145deg,#FF2222,#CC0000)", display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 0 8px rgba(204,0,0,0.12),0 0 0 18px rgba(204,0,0,0.06),0 8px 32px rgba(204,0,0,0.45)",
  },
  cdNum: { color: "#fff", fontSize: 52, fontWeight: 700, fontFamily: "'Poppins', sans-serif", textShadow: "0 2px 6px rgba(0,0,0,0.25)", lineHeight: 1 },
  cdTitle: { fontSize: 17, fontWeight: 600, color: "#111", fontFamily: "'Poppins', sans-serif" },
  cdSub: { fontSize: 12, color: "#888", textAlign: "center" },
  progBg: { width: "100%", height: 4, background: "#f0f0f0", borderRadius: 4 },
  progFill: { height: 4, background: RED, borderRadius: 4, transition: "width 1s linear" },
  locCard: { width: "100%", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 7 },
  locRow: { display: "flex", alignItems: "center", gap: 8 },
  locLbl: { fontSize: 10, color: "#888" },
  locVal: { fontSize: 13, fontWeight: 500, color: "#111" },
  locLive: { fontSize: 11, color: "#888" },

  // active SOS screen
  redHero: { background: RED, padding: "14px 14px 18px", borderRadius: "0 0 16px 16px" },
  heroTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  hIcon: {
    width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
  },
  hTitle: { fontSize: 17, fontWeight: 600, color: "#fff", fontFamily: "'Poppins', sans-serif" },
  hSub: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
  xBtn: {
    background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "50%",
    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  etaCard: {
    background: "rgba(255,255,255,0.14)", borderRadius: 11, padding: "11px 13px 13px",
    border: "0.5px solid rgba(255,255,255,0.22)",
  },
  etaTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  etaLbl: { fontSize: 11, color: "rgba(255,255,255,0.8)" },
  livePill: {
    background: "rgba(255,255,255,0.18)", border: "0.5px solid rgba(255,255,255,0.4)",
    borderRadius: 20, padding: "2px 9px", fontSize: 10, color: "#fff",
  },
  etaVal: { fontSize: 32, fontWeight: 600, color: "#fff", lineHeight: 1, fontFamily: "'Poppins', sans-serif" },
  etaUnit: { fontSize: 15, color: "rgba(255,255,255,0.85)", marginLeft: 3 },
  etaBarBg: { height: 4, background: "rgba(255,255,255,0.22)", borderRadius: 4, marginTop: 9 },
  etaBar: { height: 4, background: "#fff", borderRadius: 4, width: "68%" },
  secBody: { display: "flex", flexDirection: "column", gap: 12, padding: "14px 14px 20px" },
  secTtl: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4, fontFamily: "'Poppins', sans-serif" },

  // banners
  warnBanner: { background: "#FAEEDA", border: "0.5px solid #EF9F27", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 9 },
  wbT: { fontSize: 12, fontWeight: 600, color: "#633806", fontFamily: "'Poppins', sans-serif" },
  wbS: { fontSize: 11, color: "#854F0B", marginTop: 1 },
  succBanner: { background: "#EAF3DE", border: "0.5px solid #639922", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 9 },
  sbT: { fontSize: 12, fontWeight: 600, color: "#173404", fontFamily: "'Poppins', sans-serif" },
  sbS: { fontSize: 11, color: "#3B6D11", marginTop: 1 },
  yellowBanner: { background: "#FEFCE8", border: "2px solid #EAB308", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 },
  ybT: { fontSize: 13, fontWeight: 600, color: "#713F12", fontFamily: "'Poppins', sans-serif" },
  ybS: { fontSize: 11, color: "#854D0E", marginTop: 2, lineHeight: 1.4 },

  // map
  mapCard: { background: "#fff", borderRadius: 12, overflow: "hidden", border: "0.5px solid #e5e5e5" },
  mapArea: { background: "#C8D8EC", height: 148, position: "relative", overflow: "hidden" },
  mroadH: { position: "absolute", left: 0, right: 0, height: 20, background: "rgba(255,255,255,0.5)", top: "50%", transform: "translateY(-50%)" },
  mroadV: { position: "absolute", top: 0, bottom: 0, width: 20, background: "rgba(255,255,255,0.5)", left: "38%" },
  mblk: { position: "absolute", background: "#a8bfd4", borderRadius: 3 },
  yloc: {
    position: "absolute", top: "22%", left: "18%", background: "#fff",
    borderRadius: 20, padding: "3px 8px 3px 6px", display: "flex", alignItems: "center",
    gap: 4, border: "0.5px solid #e5e5e5",
  },
  dotY: { position: "absolute", top: "34%", left: "22%", width: 12, height: 12, borderRadius: "50%", background: "#FF6600", border: "2px solid #fff" },
  dotEp: { position: "absolute", top: "50%", left: "49%", width: 38, height: 38, borderRadius: "50%", background: "rgba(204,0,0,0.14)", transform: "translate(-50%,-50%)" },
  dotE: { position: "absolute", top: "50%", left: "49%", width: 13, height: 13, borderRadius: "50%", background: RED, border: "2px solid #fff", transform: "translate(-50%,-50%)" },
  dotS: { position: "absolute", top: "54%", left: "65%", width: 11, height: 11, borderRadius: "50%", background: "#1A6FC4", border: "2px solid #fff" },
  mapInfo: { padding: "9px 12px", borderTop: "0.5px solid #e5e5e5", display: "flex", gap: 9, alignItems: "flex-start" },
  miName: { fontSize: 12, fontWeight: 500, color: "#111" },
  miCoord: { fontSize: 10, color: "#888" },
  miLive: { fontSize: 10, color: "#27500A", display: "flex", alignItems: "center", gap: 4, marginTop: 3 },

  // service cards
  svcCard: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "11px 13px" },
  scTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  scName: { fontSize: 13, fontWeight: 600, color: "#111", fontFamily: "'Poppins', sans-serif" },
  scType: { fontSize: 10, color: "#888", marginTop: 1 },
  spill: { borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 500 },
  spillEn: { background: "#EAF3DE", color: "#27500A", border: "0.5px solid #639922" },
  spillDi: { background: "#EAF3DE", color: "#27500A", border: "0.5px solid #639922" },
  scMeta: { display: "flex", gap: 12, marginTop: 7 },
  scMetaSpan: { fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 3 },

  // contact person cards
  contactCard: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 14, padding: "14px 14px 12px" },
  cpTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  cpAv: { width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(204,0,0,0.1)" },
  cpName: { fontSize: 15, fontWeight: 600, color: "#111", fontFamily: "'Poppins', sans-serif" },
  cpRole: { fontSize: 12, color: "#888" },
  cpPhone: { fontSize: 12, color: "#888", marginTop: 1 },
  btnCall: {
    width: "100%", background: "#16A34A", color: "#fff", border: "none", borderRadius: 10,
    padding: 11, display: "flex", alignItems: "center", justifyContent: "center",
    gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 500,
  },

  // find + safe btn
  findBtn: {
    background: "#2563EB", color: "#fff", border: "none", borderRadius: 14, padding: 15,
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    gap: 9, cursor: "pointer", fontSize: 14, fontWeight: 500,
  },
  safeBtn: {
    background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 13, width: "100%",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#111",
  },
  safeNote: { textAlign: "center", fontSize: 11, color: "#aaa" },

  // eh body
  ehBody: { display: "flex", flexDirection: "column", gap: 12, padding: "14px 14px 24px" },

  // shared location box
  sharedLocBox: { border: "1.5px solid #e0e0e0", borderRadius: 14, overflow: "hidden", background: "#fff" },
  sharedLocHeader: { padding: "12px 14px", borderBottom: "1.5px solid #e0e0e0", background: "#f7f7f7" },
  sharedLocBody: { padding: 14 },

  // step label
  stepLbl: { display: "flex", justifyContent: "center", gap: 8, padding: "8px 0 2px", fontSize: 11, color: "#aaa" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const BellIcon = ({ stroke = "#000000", size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6" />
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </svg>
);

const LiveDot = () => (
  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E9A4E", display: "inline-block", animation: "blink 1.2s infinite" }} />
);

const MapBlock = () => (
  <div style={s.mapCard}>
    <div style={s.mapArea}>
      <div style={{ ...s.mblk, width: 58, height: 38, top: 10, left: 55 }} />
      <div style={{ ...s.mblk, width: 42, height: 48, top: 9, left: 196 }} />
      <div style={{ ...s.mblk, width: 52, height: 34, top: 82, left: 48 }} />
      <div style={{ ...s.mblk, width: 46, height: 42, top: 88, left: 196 }} />
      <div style={s.mroadH} />
      <div style={s.mroadV} />
      <div style={s.yloc}>
        <i className="ti ti-map-pin" style={{ color: RED, fontSize: 12 }} />
        <span style={{ fontSize: 10, color: "#111", fontWeight: 500 }}>Your Location</span>
      </div>
      <div style={s.dotY} />
      <div style={{ ...s.dotEp, animation: "mpulse 1.6s infinite" }} />
      <div style={s.dotE} />
      <div style={s.dotS} />
    </div>
    <div style={s.mapInfo}>
      <i className="ti ti-map-pin" style={{ color: RED, fontSize: 16, flexShrink: 0, marginTop: 1 }} />
      <div>
        <div style={s.miName}>Downtown, Main Street, Los Angeles</div>
        <div style={s.miCoord}>34.0522° N, 118.2437° W</div>
        <div style={s.miLive}><LiveDot />&nbsp;Live location tracking active</div>
      </div>
    </div>
  </div>
);

const NavBell = ({ strokeColor = "#000000" }: { strokeColor?: string }) => (
  <button style={s.bellBtn} aria-label="Notifications">
    <BellIcon stroke={strokeColor} size={22} />
    <div style={s.bellBadge}>3</div>
  </button>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export default function RoadSOS() {
  const [screen, setScreen] = useState<Screen>(0);
  const [cdVal, setCdVal] = useState(10);
  const [progWidth, setProgWidth] = useState("100%");
  const cdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const labels = [
    "Splash — tap to enter",
    "Home — tap SOS to start",
    "Who needs help?",
    "Confirm emergency alert",
    "Countdown — auto-advances",
    "I Want Help — SOS active",
    "Somebody Else Wants Help",
  ];

  const goTo = (n: Screen) => {
    if (cdTimer.current) { clearInterval(cdTimer.current); cdTimer.current = null; }
    setScreen(n);
  };

  const startCountdown = () => {
    goTo(4);
    let val = 10;
    setCdVal(10);
    setProgWidth("100%");
    if (cdTimer.current) clearInterval(cdTimer.current);
    cdTimer.current = setInterval(() => {
      val--;
      const v = Math.max(0, val);
      setCdVal(v);
      setProgWidth(`${v * 10}%`);
      if (v <= 0) {
        clearInterval(cdTimer.current!);
        cdTimer.current = null;
        setTimeout(() => goTo(5), 600);
      }
    }, 1000);
  };

  useEffect(() => () => { if (cdTimer.current) clearInterval(cdTimer.current); }, []);

  return (
    <>
      {/* Inject keyframes + icon font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');
        @keyframes mpulse {
          0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7;}
          50%{transform:translate(-50%,-50%) scale(1.5);opacity:.2;}
        }
        @keyframes blink {
          0%,100%{opacity:1;} 50%{opacity:.3;}
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={s.wrap}>
        {/* Step dots */}
        <div style={s.stepDots}>
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} style={i === screen ? s.dotOn : s.dot} />
          ))}
        </div>

        <div style={s.app}>

          {/* ── S0: Splash ─────────────────────────────────────────────────── */}
          {screen === 0 && (
            <div style={{ minHeight: 560 }}>
              <div style={s.splashBg} onClick={() => goTo(1)}>
                <div style={s.splashCard}>
                  <span style={s.splashText}>RoadSOS</span>
                </div>
              </div>
            </div>
          )}

          {/* ── S1: Home ───────────────────────────────────────────────────── */}
          {screen === 1 && (
            <div style={{ minHeight: 560, display: "flex", flexDirection: "column" }}>
              <div style={s.navBar}>
                <div style={s.navLeft}>
                  <div style={s.logoCirc}><i className="ti ti-bell-ringing" style={{ color: "#fff", fontSize: 17 }} /></div>
                  <div>
                    <div style={s.navTitle}>RoadSOS</div>
                    <div style={s.navSub}>Emergency Response</div>
                  </div>
                </div>
                <NavBell />
              </div>
              <div style={s.sosArea}>
                <div style={s.pulseWrap}>
                  <button
                    style={s.sosBtnMain}
                    onClick={() => goTo(2)}
                    aria-label="SOS"
                  >
                    <i className="ti ti-bell-ringing" style={{ color: "#fff", fontSize: 40, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))", marginBottom: 2 }} />
                    <span style={s.sosBtnText}>SOS</span>
                  </button>
                </div>
                <p style={s.sosHint}>Tap the SOS button in case of emergency</p>
              </div>
              <div style={s.botBar}>
                <div style={s.botItem}>
                  <i className="ti ti-home" style={{ color: RED, fontSize: 22 }} />
                </div>
              </div>
            </div>
          )}

          {/* ── S2: Who Needs Help ─────────────────────────────────────────── */}
          {screen === 2 && (
            <div style={{ minHeight: 560 }}>
              <div style={s.modalWrap}>
                <div style={s.modal}>
                  <p style={s.mH}>Who Needs Help?</p>
                  <p style={s.mP}>Please select who requires emergency assistance</p>
                  <button style={s.btnRed} onClick={() => goTo(3)}>
                    <i className="ti ti-user" />I Want Help
                  </button>
                  <button style={s.btnOutRed} onClick={() => goTo(6)}>
                    <i className="ti ti-users" />Somebody Else Wants Help
                  </button>
                  <button style={s.btnCancelLnk} onClick={() => goTo(1)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* ── S3: Confirm Alert ──────────────────────────────────────────── */}
          {screen === 3 && (
            <div style={{ minHeight: 560 }}>
              <div style={s.modalWrap}>
                <div style={s.modal}>
                  <p style={s.mH}>Emergency Alert</p>
                  <p style={s.mP}>Are you in an emergency? Confirming will send an SOS alert to nearby services and your emergency contacts.</p>
                  <button style={s.btnRed} onClick={startCountdown}>Yes, Send SOS Alert</button>
                  <button style={s.btnGrayOut} onClick={() => goTo(2)}>Cancel</button>
                  <p style={s.warnNote}>False alerts may result in unnecessary emergency response</p>
                </div>
              </div>
            </div>
          )}

          {/* ── S4: Countdown ──────────────────────────────────────────────── */}
          {screen === 4 && (
            <div style={{ minHeight: 560, display: "flex", flexDirection: "column" }}>
              <div style={s.navBar}>
                <div style={s.navLeft}>
                  <div style={s.logoCirc}><i className="ti ti-bell-ringing" style={{ color: "#fff", fontSize: 17 }} /></div>
                  <div>
                    <div style={s.navTitle}>RoadSOS</div>
                    <div style={s.navSub}>Sending alert...</div>
                  </div>
                </div>
                <NavBell />
              </div>
              <div style={s.cdownPg}>
                <div style={s.cdRings}>
                  <div style={s.cdCircle}>
                    <span style={s.cdNum}>{cdVal}</span>
                  </div>
                </div>
                <div style={s.cdTitle}>Sending SOS Alert...</div>
                <div style={s.cdSub}>Emergency services will be notified in {cdVal} seconds</div>
                <div style={s.progBg}>
                  <div style={{ ...s.progFill, width: progWidth }} />
                </div>
                <div style={s.locCard}>
                  <div style={s.locRow}>
                    <i className="ti ti-map-pin" style={{ fontSize: 16, color: RED }} />
                    <div>
                      <div style={s.locLbl}>Sharing Location</div>
                      <div style={s.locVal}>Downtown, Main Street, Los Angeles</div>
                    </div>
                  </div>
                  <div style={s.locRow}>
                    <i className="ti ti-clock" style={{ fontSize: 16, color: "#888" }} />
                    <span style={s.locLive}>Live location tracking active</span>
                  </div>
                </div>
                <button style={s.btnGrayOut} onClick={() => goTo(1)}>
                  <i className="ti ti-x" />Cancel SOS Alert
                </button>
              </div>
            </div>
          )}

          {/* ── S5: I Want Help — SOS Active ──────────────────────────────── */}
          {screen === 5 && (
            <div style={{ minHeight: 680 }}>
              <div style={s.scrollable}>
                <div style={{ background: "#ffffff" }}>
                  {/* Red nav */}
                  <div style={{ ...s.navBar, background: RED, borderBottom: "none" }}>
                    <div style={s.navLeft}>
                      <div style={{ ...s.logoCirc, background: "rgba(255,255,255,0.2)" }}>
                        <i className="ti ti-bell-ringing" style={{ color: "#fff", fontSize: 17 }} />
                      </div>
                      <div>
                        <div style={{ ...s.navTitle, color: "#fff" }}>SOS Alert Active</div>
                        <div style={{ ...s.navSub, color: "rgba(255,255,255,0.75)" }}>Help is on the way</div>
                      </div>
                    </div>
                    <NavBell strokeColor="#ffffff" />
                    <button style={{ ...s.xBtn, marginLeft: 8 }} onClick={() => goTo(1)}>
                      <i className="ti ti-x" style={{ color: "#fff", fontSize: 15 }} />
                    </button>
                  </div>
                  {/* ETA */}
                  <div style={{ background: RED, padding: "14px 14px 18px", borderRadius: "0 0 16px 16px" }}>
                    <div style={s.etaCard}>
                      <div style={s.etaTop}>
                        <span style={s.etaLbl}>Estimated Arrival</span>
                        <span style={s.livePill}>Live</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 2 }}>
                        <span style={s.etaVal}>8</span>
                        <span style={s.etaUnit}>minutes</span>
                      </div>
                      <div style={s.etaBarBg}><div style={s.etaBar} /></div>
                    </div>
                  </div>

                  <div style={s.secBody}>
                    {/* Live Tracking */}
                    <div>
                      <div style={s.secTtl}>Live Tracking</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
                        <div style={s.warnBanner}>
                          <i className="ti ti-wifi-off" style={{ fontSize: 17, color: "#854F0B", flexShrink: 0, marginTop: 1 }} />
                          <div>
                            <div style={s.wbT}>Low network signal</div>
                            <div style={s.wbS}>Location updates may be delayed. Move to open area.</div>
                          </div>
                        </div>
                        <div style={s.succBanner}>
                          <i className="ti ti-circle-check" style={{ fontSize: 17, color: "#27500A", flexShrink: 0, marginTop: 1 }} />
                          <div>
                            <div style={s.sbT}>Emergency services &amp; contacts notified</div>
                            <div style={s.sbS}>All 3 emergency contacts alerted via SMS.</div>
                          </div>
                        </div>
                      </div>
                      <MapBlock />
                    </div>

                    {/* Responding Services */}
                    <div style={s.sharedLocBox}>
                      <div style={s.sharedLocHeader}>
                        <div style={{ ...s.secTtl, marginBottom: 0 }}>Responding Services</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 12px 14px" }}>
                        {/* City Ambulance */}
                        <div style={s.svcCard}>
                          <div style={s.scTop}>
                            <div>
                              <div style={s.scName}>City Ambulance Service</div>
                              <div style={s.scType}>Ambulance</div>
                            </div>
                            <span style={{ ...s.spill, ...s.spillEn }}>En route</span>
                          </div>
                          <div style={s.scMeta}>
                            <span style={s.scMetaSpan}><i className="ti ti-clock" style={{ fontSize: 13 }} />8 min</span>
                            <span style={s.scMetaSpan}><i className="ti ti-send" style={{ fontSize: 13 }} />1.5 km</span>
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <a href="tel:+15559110000" style={{ textDecoration: "none" }}>
                              <button style={s.btnCall}><i className="ti ti-phone" />Call</button>
                            </a>
                          </div>
                        </div>
                        {/* Downtown Police */}
                        <div style={s.svcCard}>
                          <div style={s.scTop}>
                            <div>
                              <div style={s.scName}>Downtown Police Station</div>
                              <div style={s.scType}>Police</div>
                            </div>
                            <span style={{ ...s.spill, ...s.spillDi }}>Dispatched</span>
                          </div>
                          <div style={s.scMeta}>
                            <span style={s.scMetaSpan}><i className="ti ti-clock" style={{ fontSize: 13 }} />6 min</span>
                            <span style={s.scMetaSpan}><i className="ti ti-send" style={{ fontSize: 13 }} />0.8 km</span>
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <a href="tel:+15559110001" style={{ textDecoration: "none" }}>
                              <button style={s.btnCall}><i className="ti ti-phone" />Call</button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div>
                      <div style={s.secTtl}>Emergency Contacts — Manual</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={s.contactCard}>
                          <div style={s.cpTop}>
                            <div style={s.cpAv}><i className="ti ti-user" style={{ color: RED, fontSize: 20 }} /></div>
                            <div>
                              <div style={s.cpName}>Sarah Johnson</div>
                              <div style={s.cpRole}>Family</div>
                              <div style={s.cpPhone}>+1 (555) 123-4567</div>
                            </div>
                          </div>
                          <button style={s.btnCall}><i className="ti ti-phone" />Call</button>
                        </div>
                        <div style={s.contactCard}>
                          <div style={s.cpTop}>
                            <div style={s.cpAv}><i className="ti ti-heart" style={{ color: RED, fontSize: 20 }} /></div>
                            <div>
                              <div style={s.cpName}>Dr. Emily Davis</div>
                              <div style={s.cpRole}>Primary Care</div>
                              <div style={s.cpPhone}>+1 (555) 987-6543</div>
                            </div>
                          </div>
                          <button style={s.btnCall}><i className="ti ti-phone" />Call</button>
                        </div>
                      </div>
                    </div>

                    {/* Shared Location */}
                    <div style={s.sharedLocBox}>
                      <div style={s.sharedLocHeader}>
                        <div style={{ ...s.secTtl, marginBottom: 0 }}>Shared Location</div>
                      </div>
                      <div style={s.sharedLocBody}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <i className="ti ti-map-pin" style={{ color: RED, fontSize: 18, flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>Downtown, Main Street, Los Angeles</div>
                            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>34.0522° N, 118.2437° W</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                              <LiveDot />
                              <span style={{ fontSize: 10, color: "#27500A" }}>Live location tracking active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button style={s.safeBtn} onClick={() => goTo(1)}>
                      <i className="ti ti-shield-check" />I'm Safe - Cancel Alert
                    </button>
                    <p style={s.safeNote}>Only cancel if you're safe and don't need help</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── S6: Somebody Else Wants Help ───────────────────────────────── */}
          {screen === 6 && (
            <div style={{ minHeight: 680 }}>
              <div style={s.scrollable}>
                <div style={s.navBar}>
                  <div style={s.navLeft}>
                    <button style={s.backBtn} onClick={() => goTo(2)} aria-label="Back">
                      <i className="ti ti-arrow-left" style={{ fontSize: 18, color: "#111" }} />
                    </button>
                    <div>
                      <div style={{ ...s.navTitle, fontSize: 16, fontWeight: 500 }}>Emergency Help</div>
                      <div style={s.navSub}>Contact or find services</div>
                    </div>
                  </div>
                  <NavBell />
                </div>

                <div style={s.ehBody}>
                  {/* Yellow network banner */}
                  <div style={s.yellowBanner}>
                    <i className="ti ti-wifi-off" style={{ fontSize: 20, color: "#854D0E", flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={s.ybT}>Low Network Signal</div>
                      <div style={s.ybS}>Your network connection is weak. Some features may be limited or delayed.</div>
                    </div>
                  </div>

                  {/* Live Tracking */}
                  <div>
                    <div style={s.secTtl}>Live Tracking</div>
                    <MapBlock />
                  </div>

                  <button style={s.findBtn}>
                    <i className="ti ti-map-pin" style={{ fontSize: 18 }} />Find Nearby Emergency Services
                  </button>

                  {/* Cancel Alert */}
                  <button style={s.safeBtn} onClick={() => goTo(1)}>
                    <i className="ti ti-shield-x" />Cancel Alert
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Step label */}
        <div style={s.stepLbl}>
          <span>{labels[screen]}</span>
        </div>
      </div>
    </>
  );
}
