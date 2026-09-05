import { useState, useEffect } from "react";

export default function Dashboard(){
  const [tab, setTab] = useState("Pending");
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");

  const load = () => setApps(JSON.parse(localStorage.getItem("traderApplications")||"[]"));
  useEffect(()=>{load();},[]);

  const update = (id, status) => {
    const all = JSON.parse(localStorage.getItem("traderApplications")||"[]").map(a=> a.id===id ? {...a, status} : a);
    localStorage.setItem("traderApplications", JSON.stringify(all));
    load();
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure?\n The application will be permanently deleted!")) {
      const all = JSON.parse(localStorage.getItem("traderApplications")||"[]").filter(a=> a.id !== id);
      localStorage.setItem("traderApplications", JSON.stringify(all));
      load();
    }
  };

  const filtered = apps.filter(a=> a.status===tab && (a.shop.toLowerCase().includes(search.toLowerCase()) || String(a.id).includes(search) || a.owner.toLowerCase().includes(search.toLowerCase())));

  const stats = {
    total: apps.length,
    pending: apps.filter(a=>a.status==="Pending").length,
    approved: apps.filter(a=>a.status==="Approved").length,
    denied: apps.filter(a=>a.status==="Denied").length,
  };

  return(
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'Inter, sans-serif'}}>
      <div style={{background:'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color:'white', padding:'20px'}}>
        <div style={{maxWidth:1100, margin:'auto', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <h1 style={{margin:0, fontSize:22}}>🏛️ Inspector Panel</h1>
            <p style={{margin:'5px 0 0 0', fontSize:12, opacity:0.7}}>Govt. of West Bengal - Legal Metrology Dept.</p>
          </div>
          <a href="/" style={{background:'white', color:'#0f172a', padding:'8px 16px', borderRadius:20, textDecoration:'none', fontSize:12, fontWeight:'bold'}}>← Home</a>
        </div>
      </div>

      <div style={{maxWidth:1100, margin:'auto', padding:20}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:15, marginBottom:20}}>
          <div style={statCard}><div style={{fontSize:24, fontWeight:'bold'}}>{stats.total}</div><div style={{fontSize:11, color:'#64748b'}}>TOTAL APPLICATIONS</div></div>
          <div style={{...statCard, borderLeft:'4px solid #f59e0b'}}><div style={{fontSize:24, fontWeight:'bold', color:'#f59e0b'}}>{stats.pending}</div><div style={{fontSize:11, color:'#64748b'}}>PENDING</div></div>
          <div style={{...statCard, borderLeft:'4px solid #16a34a'}}><div style={{fontSize:24, fontWeight:'bold', color:'#16a34a'}}>{stats.approved}</div><div style={{fontSize:11, color:'#64748b'}}>APPROVED</div></div>
          <div style={{...statCard, borderLeft:'4px solid #dc2626'}}><div style={{fontSize:24, fontWeight:'bold', color:'#dc2626'}}>{stats.denied}</div><div style={{fontSize:11, color:'#64748b'}}>DENIED</div></div>
        </div>

        <div style={{background:'white', borderRadius:15, padding:15, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10, boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex', gap:8}}>
            {["Pending","Approved","Denied"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                padding:'8px 18px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:'bold', fontSize:13,
                background: tab===t ? (t==="Pending"?'#f59e0b': t==="Approved"?'#16a34a':'#dc2626') : '#f1f5f9',
                color: tab===t ? 'white' : '#475569'
              }}>{t} ({t==="Pending"?stats.pending: t==="Approved"?stats.approved:stats.denied})</button>
            ))}
          </div>
          <input placeholder="🔍 Search by Shop / Owner / ID..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:'8px 15px', borderRadius:20, border:'1px solid #e2e8f0', width:250, fontSize:13}}/>
        </div>

        <div style={{marginTop:20, display:'grid', gap:12}}>
          {filtered.length===0 && <div style={{textAlign:'center', padding:50, background:'white', borderRadius:15, color:'#94a3b8'}}>No {tab} applications found</div>}
          {filtered.map(app=>{
            const qrData = `LM-${app.id}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`;
            return(
            <div key={app.id} style={{background:'white', borderRadius:16, padding:16, display:'flex', gap:16, alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', border:'1px solid #f1f5f9'}}>
              {app.status==="Approved" ? <img src={qrUrl} alt="qr" style={{width:80, height:80, borderRadius:10, border:'1px solid #e2e8f0'}}/> : <div style={{width:80, height:80, borderRadius:10, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30}}>{app.status==="Pending"?"⏳":"❌"}</div>}
              
              <div style={{flex:1}}>
                <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                  <span style={{background:'#0f172a', color:'white', padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:'bold'}}>{qrData}</span>
                  <span style={{background: app.status==="Pending"?'#fef9c3': app.status==="Approved"?'#dcfce7':'#fee2e2', color: app.status==="Pending"?'#a16207': app.status==="Approved"?'#15803d':'#b91c1c', padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:'bold'}}>{app.status}</span>
                  <span style={{fontSize:10, color:'#94a3b8'}}>{app.appliedOn}</span>
                </div>
                <div style={{marginTop:6, fontWeight:'bold', fontSize:15}}>{app.shop} <span style={{fontWeight:'normal', fontSize:12, color:'#64748b'}}>by {app.owner}</span></div>
                <div style={{fontSize:12, color:'#475569', marginTop:4}}>⚖️ {app.machine} - {app.capacity} | 📍 {app.address}</div>
                <div style={{fontSize:11, color:'#94a3b8', marginTop:2}}>📧 {app.userEmail}</div>
              </div>

              <div style={{display:'flex', flexDirection:'column', gap:6, minWidth:140}}>
                {tab!=="Approved" && <button onClick={()=>update(app.id,"Approved")} style={{padding:'8px 16px', background:'#16a34a', color:'white', border:'none', borderRadius:20, fontSize:12, fontWeight:'bold', cursor:'pointer'}}>✅ Approve</button>}
                {tab!=="Denied" && <button onClick={()=>update(app.id,"Denied")} style={{padding:'8px 16px', background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:20, fontSize:12, fontWeight:'bold', cursor:'pointer'}}>❌ Deny</button>}
                {tab!=="Pending" && <button onClick={()=>update(app.id,"Pending")} style={{padding:'6px 16px', background:'#f8fafc', color:'#64748b', border:'1px solid #e2e8f0', borderRadius:20, fontSize:11, cursor:'pointer'}}>↩️ Move to Pending</button>}
                
                {/* NEW DELETE BUTTON - ONLY IN DENIED TAB */}
                {tab==="Denied" && <button onClick={()=>handleDelete(app.id)} style={{padding:'8px 16px', background:'#dc2626', color:'white', border:'none', borderRadius:20, fontSize:12, fontWeight:'bold', cursor:'pointer', marginTop:5}}>🗑️ Delete Permanently</button>}
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}

const statCard = {background:'white', borderRadius:12, padding:'15px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', borderLeft:'4px solid #0f172a'};