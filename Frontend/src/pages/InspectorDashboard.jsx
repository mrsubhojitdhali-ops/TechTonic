import { useEffect, useState } from "react";
import api from "../api/axios";

export default function InspectorDashboard(){
  const [apps, setApps] = useState([]);
  const [tab, setTab] = useState("PENDING");
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await api.get('/instruments');
      setApps(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(()=>{ 
    load(); 
    if(localStorage.getItem("theme") === "dark") setIsDark(true); 
  },[]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/instruments/${id}/status`, { status: newStatus });
      load();
    } catch(e){ alert("Failed"); }
  };

  const filtered = apps.filter(a=> a.status===tab).filter(a=>{
    const q = search.toLowerCase();
    return a.name?.toLowerCase().includes(q) || a.certId?.toLowerCase().includes(q) || a.trader?.name?.toLowerCase().includes(q);
  });

  const p = apps.filter(a=>a.status==="PENDING").length;
  const ap = apps.filter(a=>a.status==="APPROVED").length;
  const d = apps.filter(a=>a.status==="REJECTED").length;

  const bg = isDark ? "#0f172a" : "#f1f5f9";
  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const text = isDark ? "#f8fafc" : "#0f172a";
  const subText = isDark ? "#cbd5e1" : "#64748b";
  const border = isDark ? "#334155" : "#e2e8f0";

  return(
    <div style={{minHeight:'100vh', background:bg, color:text, fontFamily:'Inter, sans-serif'}}>
      <div style={{background: isDark ? '#020617' : 'white', borderBottom:`1.5px solid ${border}`, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{width:42, height:42, background:'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>👮‍♂️</div>
          <div><div style={{fontWeight:900, fontSize:15}}>Inspector Portal - LIVE DB</div><div style={{fontSize:11, color:subText}}>Govt. of West Bengal</div></div>
        </div>
        <button onClick={()=>{const nd=!isDark; setIsDark(nd); localStorage.setItem("theme", nd?"dark":"light")}} style={{background:cardBg, border:`1.5px solid ${border}`, color:text, padding:'7px 15px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:'800'}}>{isDark?"☀️ Light":"🌙 Dark"}</button>
      </div>

      <div style={{maxWidth:1100, margin:'auto', padding:20}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginBottom:20}}>
          <div style={{background:cardBg, border:`1.5px solid ${border}`, padding:'18px', borderRadius:16}}><div style={{fontSize:11, fontWeight:'800', color:subText}}>PENDING</div><div style={{fontSize:28, fontWeight:900, color:'#f59e0b'}}>{p}</div></div>
          <div style={{background:cardBg, border:`1.5px solid ${border}`, padding:'18px', borderRadius:16}}><div style={{fontSize:11, fontWeight:'800', color:subText}}>APPROVED</div><div style={{fontSize:28, fontWeight:900, color:'#22c55e'}}>{ap}</div></div>
          <div style={{background:cardBg, border:`1.5px solid ${border}`, padding:'18px', borderRadius:16}}><div style={{fontSize:11, fontWeight:'800', color:subText}}>REJECTED</div><div style={{fontSize:28, fontWeight:900, color:'#ef4444'}}>{d}</div></div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20}}>
          <div style={{display:'flex', gap:8, background:cardBg, padding:'8px', borderRadius:14, border:`1.5px solid ${border}`}}>
            {[
              {label:"PENDING", count:p},
              {label:"APPROVED", count:ap},
              {label:"REJECTED", count:d}
            ].map(({label,count})=>(
              <button key={label} onClick={()=>setTab(label)} style={{
                padding:'9px 16px', borderRadius:20, border:`1.5px solid ${tab===label?'#3b82f6':border}`,
                background: tab===label?'linear-gradient(135deg, #2563eb, #3b82f6)':'transparent', color: tab===label?'white':text,
                fontWeight:'800', fontSize:12, cursor:'pointer'
              }}>{label} ({count})</button>
            ))}
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by Name / CertID..." style={{background:cardBg, color:text, border:`1.5px solid ${border}`, padding:'11px 14px', borderRadius:12, width:310, outline:'none', fontSize:13}}/>
        </div>

        <div style={{display:'grid', gap:14}}>
          {filtered.map(item=>(
            <div key={item._id} style={{background:cardBg, border:`1.5px solid ${border}`, borderRadius:18, padding:20, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{flex:1, display:'flex', gap:15, alignItems:'center'}}>
                {item.qrCode && <img src={item.qrCode} alt="qr" style={{width:64, height:64, borderRadius:10, background:'white', padding:4}}/>}
                <div>
                  <div style={{fontWeight:900, fontSize:15}}>{item.name} <span style={{fontSize:10, padding:'4px 10px', borderRadius:10, marginLeft:8, background: item.status==="APPROVED"?'#dcfce7': item.status==="PENDING"?'#fef3c7':'#fee2e2', color: item.status==="APPROVED"?'#166534':'#991b1b'}}>{item.status}</span></div>
                  <div style={{fontSize:12, color:subText, marginTop:6}}>Cert: {item.certId || 'Not generated yet'} | Type: {item.type} | Price: ₹{item.price}<br/>Trader: {item.trader?.name} - {item.trader?.email}</div>
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:9, minWidth:180}}>
                <button onClick={()=>updateStatus(item._id,"APPROVED")} style={{background:'linear-gradient(135deg, #16a34a, #22c55e)', color:'white', border:'none', padding:'11px 16px', borderRadius:12, fontWeight:'800', cursor:'pointer'}}>✓ APPROVE + QR</button>
                <button onClick={()=>updateStatus(item._id,"REJECTED")} style={{background: isDark?'#7f1d1d':'#fff1f2', color: isDark?'#fecaca':'#dc2626', border:`1.5px solid ${isDark?'#ef4444':'#fca5a5'}`, padding:'10px 16px', borderRadius:12, fontWeight:'700', cursor:'pointer'}}>✕ REJECT</button>
                <button onClick={()=>updateStatus(item._id,"PENDING")} style={{background: isDark?'#1e3a8a':'#eff6ff', border:`1.5px solid ${isDark?'#3b82f6':'#93c5fd'}`, color: isDark?'#bfdbfe':'#1d4ed8', padding:'10px 16px', borderRadius:12, fontWeight:'700', cursor:'pointer'}}>↩ PENDING</button>
              </div>
            </div>
          ))}
          {filtered.length===0 && <div style={{textAlign:'center', padding:50, background:cardBg, borderRadius:20, color:subText}}>No {tab} applications</div>}
        </div>
      </div>
    </div>
  );
}