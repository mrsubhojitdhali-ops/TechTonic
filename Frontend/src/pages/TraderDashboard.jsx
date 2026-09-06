import { useState, useEffect } from "react";
import api from "../api/axios";

export default function TraderDashboard(){
  const [myInst, setMyInst] = useState([]);
  const [form, setForm] = useState({ name:"", type:"Electronic Scale", price:"" });
  const [loading, setLoading] = useState(false);
  const name = localStorage.getItem("name") || "Trader";

  const load = async () => {
    try{
      const res = await api.get("/instruments");
      setMyInst(res.data);
    }catch(e){ console.log(e); }
  };

  useEffect(()=>{ load(); },[]);

  const apply = async () => {
    if(!form.name.trim()) return alert("Shop/Instrument name dao");
    setLoading(true);
    try{
      await api.post("/instruments", form);
      setForm({ name:"", type:"Electronic Scale", price:"" });
      await load();
      alert("Applied! Sent to Inspector for approval");
    }catch(e){ alert(e.response?.data?.msg || "Apply failed"); }
    finally{ setLoading(false); }
  };

  return (
    <div style={{padding:20, maxWidth:900, margin:'auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div><h2>Welcome, {name} 👋</h2><p style={{fontSize:12, color:'#64748b'}}>Legal Metrology - Trader Portal</p></div>
        <button onClick={()=>{localStorage.clear(); window.location.href='/'}} style={logoutBtn}>Logout</button>
      </div>

      <div style={{background:'white', border:'1px solid #e2e8f0', borderRadius:16, padding:20, marginTop:20}}>
        <h3 style={{margin:0}}>Apply for Verification</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:10, marginTop:15}}>
          <input placeholder="Shop/Instrument Name" style={inp} value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <select style={inp} value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option>Electronic Scale</option><option>Mechanical Scale</option><option>Weights</option><option>Petrol Pump</option>
          </select>
          <input placeholder="Price" type="number" style={inp} value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
          <button onClick={apply} disabled={loading} style={applyBtn}>{loading ? "..." : "Apply"}</button>
        </div>
      </div>

      <h3 style={{marginTop:30}}>My Applications ({myInst.length})</h3>
      <div style={{display:'grid', gap:12}}>
        {myInst.map(inst=>(
          <div key={inst._id} style={{background:'white', border:'1.5px solid #e2e8f0', padding:16, borderRadius:14, display:'flex', justifyContent:'space-between'}}>
            <div>
              <b>{inst.name}</b> - {inst.type}
              <span style={{marginLeft:8, fontSize:11, padding:'3px 8px', borderRadius:20, background: inst.status==='APPROVED' ? '#dcfce7' : inst.status==='REJECTED' ? '#fee2e2' : '#fef3c7'}}>{inst.status}</span>
              <div style={{fontSize:12, color:'#64748b'}}>{inst.certId || 'Cert not generated'} | {new Date(inst.createdAt).toLocaleDateString()}</div>
            </div>
            {inst.qrCode && <img src={inst.qrCode} width={60} style={{borderRadius:8}} alt="qr"/>}
          </div>
        ))}
      </div>
    </div>
  );
}
const inp = {padding:'10px 12px', borderRadius:10, border:'1px solid #e2e8f0', fontSize:13};
const applyBtn = {background:'#0f172a', color:'white', border:'none', borderRadius:10, padding:'0 20px', fontWeight:'bold', cursor:'pointer'};
const logoutBtn = {padding:'8px 14px', borderRadius:20, border:'1px solid #e2e8f0', background:'white', cursor:'pointer'};