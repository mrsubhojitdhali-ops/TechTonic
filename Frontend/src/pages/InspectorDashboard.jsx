import { useEffect, useState } from "react";

export default function InspectorDashboard(){
  const [apps, setApps] = useState([]);
  const [tab, setTab] = useState("Pending");
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    let data = JSON.parse(localStorage.getItem("traderApplications") || "[]");
    const now = Date.now();
    const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
    let changed = false;
    const filtered = data.filter(item => {
      if(item.status === "Denied" && item.rejectedOn){
        if(now - item.rejectedOn > FIFTEEN_DAYS){ changed = true; return false; }
      }
      return true;
    });
    if(changed){
      localStorage.setItem("traderApplications", JSON.stringify(filtered));
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const deletedApps = data.filter(d=>!filtered.find(f=>f.appNo===d.appNo));
      let finalUsers = [...users];
      deletedApps.forEach(del=>{ finalUsers = finalUsers.filter(u=>u.email.toLowerCase()!==del.userEmail?.toLowerCase()); });
      localStorage.setItem("users", JSON.stringify(finalUsers));
      data = filtered;
    }
    setApps(data);
  };

  useEffect(()=>{ load(); if(localStorage.getItem("theme") === "dark") setIsDark(true); },[]);

  const updateStatus = (appNo, newStatus) => {
    const data = JSON.parse(localStorage.getItem("traderApplications") || "[]");
    const updated = data.map(a => {
      if(a.appNo === appNo){
        if(newStatus === "Denied") return {...a, status: newStatus, rejectedOn: Date.now()};
        if(newStatus === "Pending"){ const {rejectedOn, ...rest} = a; return {...rest, status: newStatus}; }
        return {...a, status: newStatus};
      }
      return a;
    });
    localStorage.setItem("traderApplications", JSON.stringify(updated));
    setApps(updated);
  };

  const permanentDelete = (appNo) => {
    if(!window.confirm("Permanent Delete?")) return;
    const data = JSON.parse(localStorage.getItem("traderApplications") || "[]");
    const toDel = data.find(a=>a.appNo===appNo);
    const updated = data.filter(a=>a.appNo!==appNo);
    localStorage.setItem("traderApplications", JSON.stringify(updated));
    if(toDel){
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      localStorage.setItem("users", JSON.stringify(users.filter(u=>u.email.toLowerCase()!==toDel.userEmail?.toLowerCase())));
    }
    setApps(updated);
  };

  const getDaysLeft = (item) => {
    if(!item.rejectedOn) return 15;
    return Math.max(0, 15 - Math.floor((Date.now() - item.rejectedOn) / (24*60*60*1000)));
  };

  const tabFiltered = apps.filter(a => a.status === tab);
  const filtered = tabFiltered.filter(a => {
    const q = search.toLowerCase();
    return a.shop?.toLowerCase().includes(q) || a.appNo?.toLowerCase().includes(q) || a.owner?.toLowerCase().includes(q) || a.mobile?.includes(q);
  });

  const p = apps.filter(a=>a.status==="Pending").length;
  const ap = apps.filter(a=>a.status==="Approved").length;
  const d = apps.filter(a=>a.status==="Denied").length;

  const bg = isDark ? "#0f172a" : "#f1f5f9";
  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const text = isDark ? "#f8fafc" : "#0f172a";
  const subText = isDark ? "#cbd5e1" : "#64748b";
  const border = isDark ? "#334155" : "#e2e8f0";

  const btnApprove = { background:'linear-gradient(135deg, #16a34a, #22c55e)', color:'white', border:'none', padding:'11px 16px', borderRadius:12, fontWeight:'800', cursor:'pointer', boxShadow:'0 4px 14px rgba(34,197,94,0.4)', fontSize:13 };
  const btnReject = { background: isDark?'#7f1d1d':'#fff1f2', color: isDark?'#fecaca':'#dc2626', border:`1.5px solid ${isDark?'#ef4444':'#fca5a5'}`, padding:'10px 16px', borderRadius:12, fontWeight:'700', cursor:'pointer', fontSize:12 };
  const btnPending = { background: isDark?'#1e3a8a':'#eff6ff', border:`1.5px solid ${isDark?'#3b82f6':'#93c5fd'}`, color: isDark?'#bfdbfe':'#1d4ed8', padding:'10px 16px', borderRadius:12, fontWeight:'700', cursor:'pointer', fontSize:12 };
  const btnDelete = { background:'linear-gradient(135deg, #dc2626, #b91c1c)', color:'white', border:'none', padding:'10px 16px', borderRadius:12, fontWeight:'700', cursor:'pointer', boxShadow:'0 4px 10px rgba(220,38,38,0.4)', fontSize:12 };

  const TabBtn = ({label, count}) => (
    <button onClick={()=>setTab(label)} style={{
      padding:'9px 16px', borderRadius:20, border:`1.5px solid ${tab===label?'#3b82f6':border}`,
      background: tab===label?'linear-gradient(135deg, #2563eb, #3b82f6)':'transparent', color: tab===label?'white':text,
      fontWeight:'800', fontSize:12, cursor:'pointer'
    }}>{label} ({count})</button>
  );

  return(
    <div style={{minHeight:'100vh', background:bg, color:text, fontFamily:'Inter, sans-serif'}}>
      <div style={{background: isDark ? '#020617' : 'white', borderBottom:`1.5px solid ${border}`, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{width:42, height:42, background:'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>👮‍♂️</div>
          <div><div style={{fontWeight:900, fontSize:15}}>Inspector Portal</div><div style={{fontSize:11, color:subText, fontWeight:'600'}}>Search Enabled</div></div>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <div style={{background: isDark ? '#1e293b' : '#f8fafc', border:`1.5px solid ${border}`, color:text, padding:'7px 15px', borderRadius:20, fontSize:12, fontWeight:'900'}}>📋 Total: {apps.length}</div>
          <button onClick={()=>{const nd=!isDark; setIsDark(nd); localStorage.setItem("theme", nd?"dark":"light")}} style={{background:cardBg, border:`1.5px solid ${border}`, color:text, padding:'7px 15px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:'800'}}>{isDark?"☀️ Light":"🌙 Dark"}</button>
        </div>
      </div>

      <div style={{maxWidth:1100, margin:'auto', padding:20}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginBottom:20}}>
          <div style={{background:cardBg, border:`1.5px solid ${border}`, padding:'18px', borderRadius:16}}><div style={{fontSize:11, fontWeight:'800', color:subText}}>PENDING</div><div style={{fontSize:28, fontWeight:900, color:'#f59e0b', marginTop:4}}>{p}</div></div>
          <div style={{background:cardBg, border:`1.5px solid ${border}`, padding:'18px', borderRadius:16}}><div style={{fontSize:11, fontWeight:'800', color:subText}}>APPROVED</div><div style={{fontSize:28, fontWeight:900, color:'#22c55e', marginTop:4}}>{ap}</div></div>
          <div style={{background:cardBg, border:`1.5px solid ${border}`, padding:'18px', borderRadius:16}}><div style={{fontSize:11, fontWeight:'800', color:subText}}>REJECTED</div><div style={{fontSize:28, fontWeight:900, color:'#ef4444', marginTop:4}}>{d}</div></div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20}}>
          <div style={{display:'flex', gap:8, background:cardBg, padding:'8px', borderRadius:14, border:`1.5px solid ${border}`}}>
            <TabBtn label="Pending" count={p} /><TabBtn label="Approved" count={ap} /><TabBtn label="Denied" count={d} />
          </div>
          <div style={{position:'relative'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by Shop, AppNo, Owner..." style={{background:cardBg, color:text, border:`1.5px solid ${border}`, padding:'11px 14px 11px 40px', borderRadius:12, width:310, outline:'none', fontSize:13}}/>
            <span style={{position:'absolute', left:14, top:11}}>🔍</span>
          </div>
        </div>

        {/* EMPTY STATE TOGGLE - PENDING LIST ER NICHE CHOTTO SUNDOR */}
        {filtered.length === 0 ? (
          <div style={{background:cardBg, border:`1.5px dashed ${border}`, padding:'50px 20px', borderRadius:20, textAlign:'center', animation:'fadeIn 0.3s'}}>
            <div style={{width:64, height:64, background: isDark ? '#0f172a' : '#f1f5f9', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'auto', fontSize:30, border:`1px solid ${border}`}}>
              {tab==="Pending" ? "⏳" : tab==="Approved" ? "✅" : "🚫"}
            </div>
            <div style={{fontWeight:900, fontSize:16, marginTop:16, color:text}}>
              {tab==="Pending" ? "No Pending Applications" : tab==="Approved" ? "No Approved Yet" : "No Rejected Applications"}
            </div>
            <div style={{fontSize:12, color:subText, marginTop:6, maxWidth:300, margin:'6px auto 0'}}>
              {tab==="Pending" ? "Sob application review hoye geche. New apply ele ekhane dekhabe." : tab==="Approved" ? "Kono application ekhono approve koro ni." : "Kono application reject kora hoyni. Clean list!"}
            </div>
            <div style={{marginTop:16, display:'inline-flex', gap:8, background: isDark?'#0f172a':'#f8fafc', border:`1px solid ${border}`, padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:'700', color:subText}}>
              <span style={{color: tab==="Pending" ? '#f59e0b' : subText}}>Pending: {p}</span> • 
              <span style={{color: tab==="Approved" ? '#22c55e' : subText}}>Approved: {ap}</span> • 
              <span style={{color: tab==="Denied" ? '#ef4444' : subText}}>Rejected: {d}</span>
            </div>
          </div>
        ) : (
          <div style={{display:'grid', gap:14}}>
            {filtered.map(item=>{
              const qr = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${item.appNo}`;
              return(
                <div key={item.appNo} style={{background:cardBg, border:`1.5px solid ${border}`, borderRadius:18, padding:20, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 16px rgba(0,0,0,0.06)'}}>
                  <div style={{flex:1, textAlign:'left'}}>
                    <div style={{fontWeight:900, fontSize:15}}>{item.shop} <span style={{fontSize:10, padding:'4px 10px', borderRadius:10, marginLeft:8, fontWeight:'800', background: item.status==="Approved"?'#dcfce7': item.status==="Pending"?'#fef3c7':'#fee2e2', color: item.status==="Approved"?'#166534': item.status==="Pending"?'#92400e':'#991b1b'}}>{item.status?.toUpperCase()}</span></div>
                    <div style={{fontSize:12, color:subText, marginTop:8, lineHeight:1.7, fontWeight:'500'}}>
                      <span style={{color:text, fontWeight:'700'}}>App No: {item.appNo}</span> | Owner: {item.owner} | Machine: {item.machine}<br/>
                      Mobile: {item.mobile} | PAN: {item.pan}<br/>
                      {item.status==="Denied" && <span style={{color:'#ef4444', fontWeight:'800', background:'#fee2e2', padding:'2px 8px', borderRadius:8, fontSize:11}}>⏳ Auto delete in {getDaysLeft(item)} days</span>}
                    </div>
                    {item.status==="Approved" && <img src={qr} alt="qr" style={{width:64, height:64, marginTop:10, borderRadius:10, background:'white', border:'2px solid #e2e8f0', padding:4}}/>}
                  </div>
                  <div style={{display:'flex', flexDirection:'column', gap:9, minWidth:180}}>
                    {item.status==="Pending" && (<><button onClick={()=>updateStatus(item.appNo,"Approved")} style={btnApprove}>✓ APPROVE</button><button onClick={()=>updateStatus(item.appNo,"Denied")} style={btnReject}>✕ REJECT</button></>)}
                    {item.status==="Approved" && (<><button onClick={()=>updateStatus(item.appNo,"Pending")} style={btnPending}>↩ PENDING</button><button onClick={()=>updateStatus(item.appNo,"Denied")} style={btnReject}>✕ REJECT</button></>)}
                    {item.status==="Denied" && (<><button onClick={()=>updateStatus(item.appNo,"Approved")} style={btnApprove}>✓ APPROVE</button><button onClick={()=>updateStatus(item.appNo,"Pending")} style={btnPending}>↩ PENDING</button><button onClick={()=>permanentDelete(item.appNo)} style={btnDelete}>🗑️ DELETE</button></>)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}