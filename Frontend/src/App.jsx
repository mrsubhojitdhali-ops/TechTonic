import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TraderAuth from "./pages/TraderAuth";
import TraderDashboard from "./pages/TraderDashboard";
import Verify from "./pages/Verify";
import InspectorDashboard from "./pages/InspectorDashboard";
import api from "./api/axios";

function Home(){
  const nav = useNavigate();
  const [stats, setStats] = useState({total:0, approved:0, pending:0});
  const [isDark, setIsDark] = useState(false);

  useEffect(()=>{
    const fetchStats = async () => {
      try{
        const res = await api.get("/instruments/stats/public");
        setStats(res.data);
      }catch{
        setStats({total: 12, approved: 8, pending: 4});
      }
    };
    fetchStats();
    if(localStorage.getItem("theme")==="dark") setIsDark(true);
  },[]);

  const toggleTheme = () => {
    const nt = !isDark;
    setIsDark(nt);
    localStorage.setItem("theme", nt ? "dark" : "light");
  };

  const bg = isDark ? "#020617" : "#f8fafc";
  const cardBg = isDark ? "#1e293b" : "white";
  const text = isDark ? "white" : "#0f172a";
  const subText = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#334155" : "#e2e8f0";

  return(
    <div style={{minHeight:'100vh', background:bg, color:text, fontFamily:'Inter, sans-serif'}}>
      <div style={{background:cardBg, borderBottom:`1px solid ${border}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{width:44, height:44, background:'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>⚖️</div>
          <div><div style={{fontWeight:800, fontSize:17}}>Legal Metrology</div><div style={{fontSize:11, color:subText}}>Digital QR Verification System</div></div>
        </div>
        <button onClick={toggleTheme} style={{width:42, height:42, borderRadius:'50%', border:`1px solid ${border}`, background: cardBg, cursor:'pointer'}}>{isDark ? "☀️" : "🌙"}</button>
      </div>

      <div style={{maxWidth:1100, margin:'auto', padding:'30px 20px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:25, alignItems:'center'}}>
          <div>
            <h1 style={{fontSize:44, fontWeight:900, lineHeight:1.1, margin:0}}>Fake License?<br/><span style={{color:'#16a34a'}}>Scan & Verify</span><br/>in 2 Seconds.</h1>
            <p style={{color:subText, fontSize:14, marginTop:12, maxWidth:500}}>West Bengal er prothom QR based license verification. Backend MongoDB + Secure Hash.</p>
            <div style={{display:'flex', gap:10, marginTop:20}}>
              <button onClick={()=>nav('/verify')} style={{padding:'12px 22px', background:'#16a34a', color:'white', border:'none', borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>📷 Verify Now</button>
              <button onClick={()=>nav('/trader/auth')} style={{padding:'12px 22px', background:cardBg, color:text, border:`1px solid ${border}`, borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>Apply License →</button>
            </div>
            <div style={{display:'flex', gap:20, marginTop:25}}>
              <div><b style={{fontSize:20}}>{stats.total}</b><div style={{fontSize:10, color:subText}}>TOTAL</div></div>
              <div><b style={{fontSize:20, color:'#16a34a'}}>{stats.approved}</b><div style={{fontSize:10, color:subText}}>VERIFIED</div></div>
              <div><b style={{fontSize:20, color:'#f59e0b'}}>{stats.pending}</b><div style={{fontSize:10, color:subText}}>PENDING</div></div>
            </div>
          </div>
          <div style={{background:cardBg, borderRadius:20, padding:16, border:`1px solid ${border}`, textAlign:'center'}}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=WB-LM-2026-DEMO" alt="qr" style={{borderRadius:10, background:'white', padding:8}}/>
            <div style={{fontWeight:'bold', marginTop:8}}>WB-LM-2026-DEMO</div>
            <div style={{fontSize:11, color:subText}}>Govt. Verified Certificate</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:18, marginTop:35}}>
          <div style={{background:cardBg, padding:22, borderRadius:20, border:`1px solid ${border}`}}>
            <h3>🏪 Trader Portal</h3><p style={{fontSize:12, color:subText}}>Apply & track license.</p>
            <button onClick={()=>nav('/trader/auth')} style={{width:'100%', padding:12, background:'#2563eb', color:'white', borderRadius:12, border:'none', fontWeight:'bold', cursor:'pointer'}}>Trader Login</button>
          </div>
          <div style={{background:cardBg, padding:22, borderRadius:20, border:`1px solid ${border}`}}>
            <h3>👮‍♂️ Inspector Portal</h3><p style={{fontSize:12, color:subText}}>Approve & generate QR - NO LOGIN.</p>
            <button onClick={()=>nav('/inspector')} style={{width:'100%', padding:12, background:'#0f172a', color:'white', borderRadius:12, border:'none', fontWeight:'bold', cursor:'pointer'}}>Inspector Dashboard →</button>
          </div>
          <div style={{background:cardBg, padding:22, borderRadius:20, border:`2px solid #16a34a`}}>
            <h3>🔍 Public Verification</h3><p style={{fontSize:12, color:subText}}>Scan QR to verify.</p>
            <button onClick={()=>nav('/verify')} style={{width:'100%', padding:12, background:'#16a34a', color:'white', borderRadius:12, border:'none', fontWeight:'bold', cursor:'pointer'}}>Verify</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/trader/auth" element={<TraderAuth/>}/>
        <Route path="/trader" element={<TraderDashboard/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/verify/:certId" element={<Verify/>}/>
        <Route path="/inspector" element={<InspectorDashboard/>}/>
        <Route path="/inspector/login" element={<InspectorDashboard/>}/>
      </Routes>
    </Router>
  )
}