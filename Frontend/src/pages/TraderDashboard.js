import { useState, useEffect } from "react";
import api from "../api/axios"; // tomar axios.js

function TraderDashboard(){
  const [myApps, setMyApps] = useState([]);
  const [backendInst, setBackendInst] = useState([]); // real backend data
  const user = JSON.parse(localStorage.getItem("currentTrader") || "null");

  useEffect(()=>{
    // 1. localStorage old data (tomar existing)
    const allApps = JSON.parse(localStorage.getItem("traderApplications") || "[]");
    const approvedIds = JSON.parse(localStorage.getItem("approvedIds") || "[]");
    const filtered = allApps.filter(a=>a.userEmail===user?.email).map(a=>({
      ...a,
      status: approvedIds.includes(a.id) ? "Approved" : a.status
    }));
    setMyApps(filtered);

    // 2. Backend real instruments (mam er main point)
    const fetchBackend = async () => {
      try{
        const res = await api.get("/instruments");
        // latest approved gulo
        setBackendInst(res.data.filter(i=>i.status==="APPROVED"));
      }catch(e){ console.log("Backend not connected", e); }
    };
    fetchBackend();
  },[]);

  if(!user) return <div style={{padding:20}}>Login koro age <a href="/trader">/trader e jao</a></div>;

  return (
    <div style={{padding:20, maxWidth:900, margin:'auto'}}>
      <h2>Welcome, {user.owner}</h2>
      <p style={{fontSize:12}}>{user.shop} - {user.email}</p>

      {/* BACKEND REAL QR - ETA MAM KE DEKHABE */}
      <h3 style={{marginTop:30, color:'#16a34a'}}>✓ Verified Certificates (Backend)</h3>
      {backendInst.length===0 && <p style={{fontSize:12, color:'#666'}}>Backend e kono Approved nei, Inspector diye approve koro. Test ID: WB-LM-2026-4085</p>}
      {backendInst.map(inst=>(
        <div key={inst._id} style={{border:'2px solid #16a34a', padding:15, borderRadius:15, marginTop:10, background:'#f0fdf4'}}>
          <b>{inst.certId}</b> - {inst.name}<br/>
          Status: <b style={{color:'green'}}>{inst.status}</b> | Expiry: {new Date(inst.expiryDate).toLocaleDateString()}<br/>
          <div style={{marginTop:10, display:'flex', gap:15, alignItems:'center'}}>
            <img src={inst.qrCode} alt="qr" width={150} style={{border:'1px solid #ddd', padding:5, background:'white'}}/>
            <div>
              <small style={{wordBreak:'break-all'}}>{inst.qrData}</small><br/><br/>
              <a href={inst.qrCode} download={`${inst.certId}.png`} style={{background:'#16a34a', color:'white', padding:'8px 12px', borderRadius:8, textDecoration:'none'}}>Download QR</a><br/><br/>
              <a href={`/verify?cert=${inst.certId}`} style={{fontSize:12}}>Verify Now →</a>
            </div>
          </div>
        </div>
      ))}

      {/* Old Local Applications */}
      <h3 style={{marginTop:40}}>My Local Applications</h3>
      {myApps.length===0 && <p>No Application</p>}
      {myApps.map(app=>(
        <div key={app.id} style={{border:'1px solid #ddd', padding:15, borderRadius:15, marginTop:10, borderLeft:`5px solid ${app.status==='Approved'?'green':'orange'}`}}>
          <b>LM-{app.id}</b> - {app.machine}<br/>
          Status: <b style={{color: app.status==='Approved'?'green':'orange'}}>{app.status}</b>
        </div>
      ))}
    </div>
  );
}
export default TraderDashboard;