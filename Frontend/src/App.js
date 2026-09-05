import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import TraderAuth from "./pages/TraderAuth";
import Verify from "./pages/Verify";
import InspectorLogin from "./pages/InspectorLogin";
import InspectorDashboard from "./pages/InspectorDashboard";

function Home(){
  const nav = useNavigate();
  const [apps, setApps] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(()=>{
    const a = JSON.parse(localStorage.getItem("traderApplications")||"[]");
    setApps(a);
    const savedTheme = localStorage.getItem("theme");
    if(savedTheme === "dark") setIsDark(true);
  },[]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const stats = {
    total: apps.length,
    approved: apps.filter(x=>x.status==="Approved").length,
    pending: apps.filter(x=>x.status==="Pending").length,
  };

  const bg = isDark ? "#020617" : "#f8fafc";
  const cardBg = isDark ? "#1e293b" : "white";
  const text = isDark ? "white" : "#0f172a";
  const subText = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#334155" : "#e2e8f0";

  return(
    <div style={{minHeight:'100vh', background:bg, color:text, fontFamily:'Inter, sans-serif', transition:'all 0.3s'}}>
      
      <div style={{background: isDark ? '#000' : '#0f172a', color:'white', fontSize:11, padding:'6px 20px', display:'flex', justifyContent:'space-between'}}>
        <span>For Government of West Bengal | Team TechTonic</span>
        <span style={{opacity:0.6}}>Helpline: 62890 84162</span>
      </div>

      <div style={{background:cardBg, borderBottom:`1px solid ${border}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{width:44, height:44, background:'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:22}}>⚖️</div>
          <div style={{textAlign:'left'}}>
            <div style={{fontWeight:800, fontSize:17, lineHeight:1}}>Legal Metrology</div>
            <div style={{fontSize:11, color:subText}}>Digital QR Verification System</div>
          </div>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <div style={{fontSize:10, background:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:20, fontWeight:'bold'}}>● LIVE</div>
          <button onClick={toggleTheme} style={{width:42, height:42, borderRadius:'50%', border:`1px solid ${border}`, background: cardBg, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center'}}>
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div style={{maxWidth:1100, margin:'auto', padding:'30px 20px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:25, alignItems:'center'}}>
          <div style={{textAlign:'left'}}>
            <h1 style={{fontSize:44, fontWeight:900, lineHeight:1.1, margin:0, color:text}}>
              Fake License?<br/>
              <span style={{color:'#16a34a'}}>Scan & Verify</span><br/>in 2 Seconds.
            </h1>
            <p style={{color:subText, fontSize:14, lineHeight:1.6, marginTop:12, maxWidth:500}}>
              West Bengal er prothom QR based license verification. Trader apply korbe, Inspector approve korle secure QR certificate auto generate hobe.
            </p>
            <div style={{display:'flex', gap:10, marginTop:20, flexWrap:'wrap'}}>
              <button onClick={()=>nav('/verify')} style={{padding:'12px 22px', background:'#16a34a', color:'white', border:'none', borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>📷 Verify Now</button>
              <button onClick={()=>nav('/trader')} style={{padding:'12px 22px', background:cardBg, color:text, border:`1px solid ${border}`, borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>Apply License →</button>
            </div>
            <div style={{display:'flex', gap:20, marginTop:25}}>
              <div><b style={{fontSize:20}}>{stats.total}</b><div style={{fontSize:10, color:subText}}>TOTAL APPLY</div></div>
              <div style={{width:1, background:border}}></div>
              <div><b style={{fontSize:20, color:'#16a34a'}}>{stats.approved}</b><div style={{fontSize:10, color:subText}}>VERIFIED</div></div>
              <div style={{width:1, background:border}}></div>
              <div><b style={{fontSize:20, color:'#f59e0b'}}>{stats.pending}</b><div style={{fontSize:10, color:subText}}>PENDING</div></div>
            </div>
          </div>

          <div style={{background:cardBg, borderRadius:20, padding:16, boxShadow:'0 20px 40px rgba(0,0,0,0.08)', border:`1px solid ${border}`, textAlign:'center'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:'bold'}}>
              <span style={{color:text}}>Live Certificate</span><span style={{background:'#dcfce7', color:'#166534', padding:'2px 8px', borderRadius:10}}>● VERIFIED</span>
            </div>
            <div style={{background: isDark ? '#0f172a' : '#f8fafc', border:`2px dashed ${border}`, borderRadius:15, padding:15, marginTop:12}}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=LM-DEMO" alt="qr" style={{borderRadius:10, background:'white', padding:8}}/>
              <div style={{fontWeight:'bold', marginTop:8, fontSize:14, color:text}}>LM-DEMO</div>
              <div style={{fontSize:11, color:subText}}>Annapurna Stores</div>
              <div style={{background:'#16a34a', color:'white', padding:'6px', borderRadius:8, fontSize:11, fontWeight:'bold', marginTop:8}}>✅ GOVT. VERIFIED</div>
            </div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:18, marginTop:35}}>
          <div style={{background:cardBg, padding:22, borderRadius:20, border:`1px solid ${border}`, textAlign:'left'}}>
            <div style={{width:48, height:48, background:'#dbeafe', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}>🏪</div>
            <h3 style={{color:text}}>Trader Portal</h3>
            <p style={{fontSize:12, color:subText}}>Apply for new license, upload shop details, track status & download QR certificate.</p>
            <button onClick={()=>nav('/trader')} style={{width:'100%', padding:12, background:'#2563eb', color:'white', borderRadius:12, border:'none', fontWeight:'bold', cursor:'pointer'}}>Trader Apply / Login</button>
          </div>
          <div style={{background:cardBg, padding:22, borderRadius:20, border:`1px solid ${border}`, textAlign:'left'}}>
            <div style={{width:48, height:48, background:'#fef3c7', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}>👮‍♂️</div>
            <h3 style={{color:text}}>Inspector Portal</h3>
            <p style={{fontSize:12, color:subText}}>View pending applications, field verification, approve/deny & generate QR certificate.</p>
            <button onClick={()=>nav('/inspector/login')} style={{width:'100%', padding:12, background:'#0f172a', color:'white', borderRadius:12, border:'none', fontWeight:'bold', cursor:'pointer'}}>Inspector Dashboard</button>
          </div>
          <div style={{background:cardBg, padding:22, borderRadius:20, border:`2px solid #16a34a`, textAlign:'left'}}>
            <div style={{width:48, height:48, background:'#dcfce7', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}>🔍</div>
            <h3 style={{color:text}}>Public Verification</h3>
            <p style={{fontSize:12, color:subText}}>Anyone can scan QR or enter ID to verify license authenticity instantly.</p>
            <button onClick={()=>nav('/verify')} style={{width:'100%', padding:12, background:'#16a34a', color:'white', borderRadius:12, border:'none', fontWeight:'bold', cursor:'pointer'}}>Verify Certificate</button>
          </div>
        </div>

        <div style={{background:cardBg, borderRadius:18, padding:20, marginTop:25, border:`1px solid ${border}`}}>
          <h3 style={{margin:0, textAlign:'center', fontSize:15, color:text}}>How QR Verification Works</h3>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:15, marginTop:18, textAlign:'center'}}>
            <div><div style={{width:28, height:28, background:'#0f172a', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'auto', fontSize:12, fontWeight:'bold'}}>1</div><div style={{fontSize:12, fontWeight:'bold', marginTop:8, color:text}}>Trader Sign Up → Pending</div><div style={{fontSize:10, color:subText}}>Online form + shop details</div></div>
            <div><div style={{width:28, height:28, background:'#0f172a', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'auto', fontSize:12, fontWeight:'bold'}}>2</div><div style={{fontSize:12, fontWeight:'bold', marginTop:8, color:text}}>Inspector Approve → QR</div><div style={{fontSize:10, color:subText}}>LM-ID + secure QR generated</div></div>
            <div><div style={{width:28, height:28, background:'#16a34a', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'auto', fontSize:12, fontWeight:'bold'}}>3</div><div style={{fontSize:12, fontWeight:'bold', marginTop:8, color:text}}>Scan → ✅ VERIFIED</div><div style={{fontSize:10, color:subText}}>Instant govt. verification</div></div>
          </div>
          <div style={{background: isDark ? '#0f172a' : '#f1f5f9', borderRadius:10, padding:'10px', marginTop:18, fontSize:10, color:subText, textAlign:'center'}}>
            💡 <b>Tech Stack:</b> React.js | QR Code Security | LocalStorage (Demo) → Production: Node.js + MongoDB + Blockchain Hash
          </div>
        </div>

        <div style={{textAlign:'center', marginTop:20, fontSize:10, color:subText}}>
          © 2026 Legal Metrology, Ministry of Consumer Affairs, Govt. of India | Team: TechTonic
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
        <Route path="/trader" element={<TraderAuth/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/verify/:id" element={<Verify/>}/>
        <Route path="/inspector/login" element={<InspectorLogin/>}/>
        <Route path="/inspector/dashboard" element={<InspectorDashboard/>}/>
      </Routes>
    </Router>
  )
}