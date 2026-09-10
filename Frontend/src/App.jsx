import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TraderAuth from './pages/TraderAuth';
import TraderDashboard from './pages/TraderDashboard';
import Verify from './pages/Verify';
import InspectorDashboard from './pages/InspectorDashboard';

function Guard({ role, children }) {
  const token = localStorage.getItem('token'); const current = localStorage.getItem('role');
  return token && current === role? children : <Navigate to={role === 'trader'? '/trader/auth' : '/inspector/login'} replace />;
}

function Home(){
  const nav=useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [filter, setFilter] = useState('all');
  const [statsData, setStatsData] = useState({ total:0, pending:0, approved:0, rejected:0 });
  const API = 'http://localhost:5000/api/instruments';

  useEffect(()=>{ localStorage.setItem('theme', darkMode? 'dark' : 'light'); }, [darkMode]);
  useEffect(()=>{
    fetch(`${API}/stats/public`).then(r=>r.json()).then(setStatsData).catch(()=>{});
  }, []);

  const isDark = darkMode;
  const theme = {
    bg: isDark? '#020617' : '#f8fafc',
    card: isDark? '#0f172a' : '#fff',
    cardBorder: isDark? '#1e293b' : '#e2e8f0',
    text: isDark? '#f1f5f9' : '#0f172a',
    subText: isDark? '#94a3b8' : '#475569',
    headerBg: isDark? '#0f172acc' : '#ffffffcc',
    badgeBg: isDark? '#1e293b' : '#f1f5f9',
  };

  const onBtnEnter = (e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.25)'; };
  const onBtnLeave = (e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(37,99,235,0.28)'; };

  return (
  <div style={{minHeight:'100vh',fontFamily:'Inter, system-ui, sans-serif',background:theme.bg,color:theme.text,transition:'all 0.3s', display:'flex', flexDirection:'column'}}>
    <header style={{padding:'14px 28px',background:theme.headerBg,backdropFilter:'blur(10px)',borderBottom:`1px solid ${theme.cardBorder}`,display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:10}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:38,height:38,background:isDark?'#fff':'#0f172a',color:isDark?'#0f172a':'#fff',display:'grid',placeItems:'center',borderRadius:10,fontWeight:900,fontSize:18}}>⚖️</div>
        <div><div style={{fontWeight:900,letterSpacing:-0.3,lineHeight:1}}>NYAAY</div><div style={{fontSize:10,letterSpacing:2,color:theme.subText,fontWeight:700}}>GOVT. OF WEST BENGAL</div></div>
      </div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <button onClick={()=>setDarkMode(!isDark)} style={{width:40,height:40,borderRadius:12,border:`1px solid ${theme.cardBorder}`,background:theme.card,cursor:'pointer', fontSize:16}}>{isDark?'☀️':'🌙'}</button>
        <span style={{fontSize:11,color:theme.subText,background:theme.badgeBg,border:`1px solid ${theme.cardBorder}`,padding:'7px 12px',borderRadius:20}}>Total: {statsData.total}</span>
      </div>
    </header>

    <main style={{flex:1, maxWidth:1100, margin:'0 auto', padding:'80px 24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', width:'100%'}}>
      <div style={{maxWidth:820, width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div style={{display:'inline-flex',gap:8,alignItems:'center',background:isDark?'#1e3a8a30':'#eff6ff',border:`1px solid ${isDark?'#1e40af':'#dbeafe'}`,color:isDark?'#60a5fa':'#2563eb',padding:'8px 16px',borderRadius:99,fontSize:12,fontWeight:800}}>● WEST BENGAL • LEGAL METROLOGY • TRUSTED SYSTEM</div>
        <h1 style={{fontSize:'clamp(40px,6vw,68px)',lineHeight:0.95,margin:'22px 0 18px',letterSpacing:-1.8,fontWeight:900}}>Verify instruments with a <br/><span style={{background:'linear-gradient(90deg,#16a34a,#22c55e)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>trusted QR certificate.</span></h1>
        <p style={{fontSize:18,color:theme.subText,lineHeight:1.7,maxWidth:620, margin:'0 auto'}}>Trader applications, inspector verification, digitally generated certificates and public QR-based status verification.</p>
        <div style={{display:'flex',gap:18,flexWrap:'wrap',marginTop:36, justifyContent:'center'}}>
          <button onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave} onClick={()=>nav('/trader/auth')} style={primaryBtn}>🏪 Trader Portal →</button>
          <button onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave} onClick={()=>nav('/inspector/login')} style={{...primaryBtn, background:isDark?'#fff':'#0f172a', color:isDark?'#0f172a':'#fff'}}>👮 Inspector Login</button>
          <button onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave} onClick={()=>nav('/verify')} style={{...primaryBtn, background:'#16a34a'}}>🔍 Verify Certificate</button>
        </div>
      </div>

      {/* CHOTO STATS - LIVE DB */}
      <div style={{display:'flex', gap:12, marginTop:40, flexWrap:'wrap', justifyContent:'center', width:'100%', maxWidth:700}}>
        <div style={{flex:'1 1 150px', maxWidth:200, background:isDark?'#f59e0b14':'#fffbeb', border:`1px solid ${theme.cardBorder}`, borderLeft:'3px solid #f59e0b', borderRadius:14, padding:'14px 16px', textAlign:'left', display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:32,height:32, borderRadius:8, background:theme.card, border:`1px solid ${theme.cardBorder}`, display:'grid', placeItems:'center'}}>⏳</div>
          <div><div style={{fontSize:20, fontWeight:900, color:'#d97706', lineHeight:1}}>{statsData.pending}</div><div style={{fontSize:11, color:theme.subText, fontWeight:600, marginTop:2}}>Pending</div></div>
        </div>
        <div style={{flex:'1 1 150px', maxWidth:200, background:isDark?'#16a34a14':'#f0fdf4', border:`1px solid ${theme.cardBorder}`, borderLeft:'3px solid #16a34a', borderRadius:14, padding:'14px 16px', textAlign:'left', display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:32,height:32, borderRadius:8, background:theme.card, border:`1px solid ${theme.cardBorder}`, display:'grid', placeItems:'center'}}>✅</div>
          <div><div style={{fontSize:20, fontWeight:900, color:'#16a34a', lineHeight:1}}>{statsData.approved}</div><div style={{fontSize:11, color:theme.subText, fontWeight:600, marginTop:2}}>Approved</div></div>
        </div>
        <div style={{flex:'1 1 150px', maxWidth:200, background:isDark?'#ef444414':'#fef2f2', border:`1px solid ${theme.cardBorder}`, borderLeft:'3px solid #ef4444', borderRadius:14, padding:'14px 16px', textAlign:'left', display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:32,height:32, borderRadius:8, background:theme.card, border:`1px solid ${theme.cardBorder}`, display:'grid', placeItems:'center'}}>❌</div>
          <div><div style={{fontSize:20, fontWeight:900, color:'#dc2626', lineHeight:1}}>{statsData.rejected}</div><div style={{fontSize:11, color:theme.subText, fontWeight:600, marginTop:2}}>Rejected</div></div>
        </div>
      </div>

      <div style={cards}>
        <Feature theme={theme} icon="🏪" title="Trader Portal" text="Register, submit instrument details and track verification status in real-time."/>
        <Feature theme={theme} icon="🛡️" title="Inspector Dashboard" text="Internal queue for inspection, approval/rejection and automatic QR issuance."/>
        <Feature theme={theme} icon="🔍" title="Public Verification" text="Anyone can verify certificate status without login — just scan QR."/>
      </div>
    </main>

    <footer style={{textAlign:'center',padding:'22px',fontSize:11,color:theme.subText,borderTop:`1px solid ${theme.cardBorder}`}}>© Govt. of West Bengal | Legal Metrology Department</footer>
  </div>
  )
}

const Feature=({theme,icon,title,text})=>{
  const onEnter = e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow= theme.bg==='#020617'? '0 16px 40px rgba(255,255,255,0.06)' : '0 16px 40px rgba(15,23,42,0.12)'; };
  const onLeave = e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow= theme.bg==='#020617'? 'none' : '0 6px 24px rgba(15,23,42,0.05)'; };
  return (<div onMouseEnter={onEnter} onMouseLeave={onLeave} style={{background:theme.card,border:`1px solid ${theme.cardBorder}`,borderRadius:20,padding:24,boxShadow:theme.bg==='#020617'?'none':'0 6px 24px rgba(15,23,42,0.05)',transition:'all 0.3s ease', textAlign:'left'}}><div style={{width:42,height:42,borderRadius:12,background:theme.bg,border:`1px solid ${theme.cardBorder}`,display:'grid',placeItems:'center',marginBottom:14, fontSize:20}}>{icon}</div><b style={{fontSize:15}}>{title}</b><p style={{fontSize:13.5,color:theme.subText,lineHeight:1.6,marginTop:8}}>{text}</p></div>);
};

const primaryBtn={padding:'16px 28px', fontSize:15, background:'#2563eb',color:'#fff',border:0,borderRadius:14,fontWeight:800,cursor:'pointer',boxShadow:'0 10px 24px rgba(37,99,235,0.28)',transition:'all 0.25s',display:'inline-flex',alignItems:'center',gap:8};
const cards={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,marginTop:40, width:'100%', maxWidth:1000};

export default function App(){
  return <Router><Routes><Route path="/" element={<Home/>}/><Route path="/trader/auth" element={<TraderAuth/>}/><Route path="/trader" element={<Guard role="trader"><TraderDashboard/></Guard>}/><Route path="/inspector/login" element={<TraderAuth inspector/>}/><Route path="/inspector" element={<Guard role="inspector"><InspectorDashboard/></Guard>}/><Route path="/verify" element={<Verify/>}/><Route path="/verify/:certId" element={<Verify/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Router>
}