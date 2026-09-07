import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TraderDashboard(){
 const nav=useNavigate(); const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [error,setError]=useState(''); const [selected,setSelected]=useState(null);
 const [form,setForm]=useState({name:'',type:'Electronic Scale',price:'',capacity:'',model:'',serialNo:''}); const name=localStorage.getItem('name')||'Trader';
 const load=async()=>{try{setLoading(true);const r=await api.get('/instruments');setItems(r.data||[]);}catch(e){setError('Could not load')}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 const submit=async e=>{e.preventDefault();if(!form.name.trim())return setError('Instrument name required');setSaving(true);try{await api.post('/instruments',{...form,price:Number(form.price)||0});setForm({name:'',type:'Electronic Scale',price:'',capacity:'',model:'',serialNo:''});await load();setError('')}catch(e){setError(e.response?.data?.msg||'Failed')}finally{setSaving(false)}};

 return <div style={page}>
  <style>{`
    .btn-primary{transition:all 0.25s ease}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 32px rgba(99,102,241,0.45)!important}
    .btn-logout{transition:all 0.2s ease}.btn-logout:hover{background:#ef4444!important;color:#fff!important;border-color:#ef4444!important}
    .app-row{transition:all 0.25s ease; cursor:pointer}.app-row:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(0,0,0,0.22)!important;border-color:#c7d2fe!important}
    .inp-field{transition:all 0.2s ease}.inp-field:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.15)!important}
    @media print {.no-print{display:none} .cert-card{box-shadow:none!important; border:1px solid #000!important}}
  `}</style>
  <div style={glow1}></div><div style={glow2}></div>

  <header style={header}>
    <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:38,height:38,background:'linear-gradient(135deg,#818cf8,#3b82f6)',color:'#fff',display:'grid',placeItems:'center',borderRadius:11,fontWeight:900}}>⚖️</div><div><b style={{fontSize:14,color:'#fff'}}>Trader Portal</b><div style={{fontSize:11,color:'#94a3b8'}}>Welcome, {name}</div></div></div>
    <button onClick={()=>{localStorage.clear();nav('/')}} className="btn-logout" style={logout}>Logout</button>
  </header>

  <main style={main}>
    <div style={card}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><h3 style={{margin:0,fontSize:15,fontWeight:900}}>✨ New Verification Application</h3><span style={{fontSize:10,padding:'6px 11px',borderRadius:20,background:'#0f172a',color:'#fff',fontWeight:800}}>Govt. of WB • Secure</span></div>
      <div style={grid}>
        <input className="inp-field" style={inp} placeholder="Instrument / Shop Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <select className="inp-field" style={inp} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Electronic Scale</option><option>Mechanical Scale</option><option>Weights</option><option>Petrol Pump</option><option>Fuel Dispenser</option></select>
        <input className="inp-field" style={inp} placeholder="Model" value={form.model} onChange={e=>setForm({...form,model:e.target.value})}/>
        <input className="inp-field" style={inp} placeholder="Serial Number" value={form.serialNo} onChange={e=>setForm({...form,serialNo:e.target.value})}/>
        <input className="inp-field" style={inp} placeholder="Capacity" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/>
        <input className="inp-field" style={inp} placeholder="Instrument Value" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
      </div>
      {error&&<div style={errorBox}>{error}</div>}
      <button onClick={submit} disabled={saving} className="btn-primary" style={submitBtn}>{saving?'Submitting…':'Submit for Inspection →'}</button>
    </div>

    <h3 style={{marginTop:26,fontSize:14,fontWeight:900,color:'#e2e8f0'}}>My Applications ({items.length}) - Click to View Certificate</h3>
    {loading?<div style={empty}>Loading…</div>:items.length===0?<div style={empty}>No applications yet.</div>:
    <div style={{display:'grid',gap:12}}>{items.map(x=><div key={x._id} className="app-row" style={row} onClick={()=>setSelected(x)}>
      <div><div style={{display:'flex',alignItems:'center',gap:8}}><b style={{fontSize:13.5}}>{x.name}</b><span style={badge(x.status)}>{x.status}</span></div><div style={{fontSize:11.5,color:'#64748b',marginTop:5}}>{x.type} • {x.model||'No model'} • {x.serialNo||'No Serial'}</div><div style={{fontSize:11,marginTop:4,color:x.certId?'#16a34a':'#94a3b8',fontWeight:700}}>{x.certId?`🎫 ${x.certId} - Click to View`:'Click to view status'}</div></div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>{x.qrCode&&<img src={x.qrCode} width="52" height="52" style={{borderRadius:8,border:'1px solid #e2e8f0'}}/>}<span style={{color:'#6366f1'}}>→</span></div>
    </div>)}</div>}

    {/* CERTIFICATE MODAL */}
    {selected && (
      <div style={modalBg} onClick={()=>setSelected(null)}>
        <div style={modalCard} className="cert-card" onClick={e=>e.stopPropagation()}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}} className="no-print">
            <b>Certificate Preview</b><button onClick={()=>setSelected(null)} style={{border:0,background:'#f1f5f9',padding:'6px 12px',borderRadius:99,cursor:'pointer'}}>✕ Close</button>
          </div>

          {selected.status!=='APPROVED' ? (
            <div style={{textAlign:'center',padding:30}}><div style={{fontSize:48}}>⏳</div><h3>{selected.status}</h3><p style={{color:'#64748b',fontSize:13}}>Certificate will be generated after Inspector approval.<br/>Cert ID: {selected.certId || 'Pending'}</p></div>
          ) : (
            <div style={certPaper}>
              <div style={{textAlign:'center',borderBottom:'2px solid #0f172a',paddingBottom:12,marginBottom:16}}>
                <div style={{fontSize:12,letterSpacing:2,fontWeight:800}}>GOVERNMENT OF WEST BENGAL</div>
                <div style={{fontSize:18,fontWeight:900,marginTop:4}}>Legal Metrology Department</div>
                <div style={{fontSize:12,color:'#475569',marginTop:2}}>VERIFICATION CERTIFICATE</div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',gap:16}}>
                <div style={{fontSize:13,lineHeight:1.9}}>
                  <div><b>Certificate No:</b> {selected.certId}</div>
                  <div><b>Trader Name:</b> {name}</div>
                  <div><b>Instrument:</b> {selected.name} ({selected.type})</div>
                  <div><b>Model / Serial:</b> {selected.model||'-'} / {selected.serialNo||'-'}</div>
                  <div><b>Capacity:</b> {selected.capacity||'-'}</div>
                  <div><b>Issue Date:</b> {new Date(selected.updatedAt||Date.now()).toLocaleDateString()}</div>
                  <div><b>Status:</b> <span style={{color:'#16a34a',fontWeight:800}}>VERIFIED & APPROVED</span></div>
                </div>
                {selected.qrCode && <img src={selected.qrCode} width="110" height="110" style={{border:'1px solid #000',padding:4}} alt="QR"/>}
              </div>
              <div style={{marginTop:18,paddingTop:12,borderTop:'1px dashed #cbd5e1',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:11,color:'#64748b'}}>This certificate is digitally verifiable via QR Code at /verify/{selected.certId}</div>
                <div style={{textAlign:'center'}}><div style={{width:120,borderTop:'1px solid #000',marginTop:30,paddingTop:4,fontSize:11,fontWeight:700}}>Inspector Signature</div></div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:16}} className="no-print">
                <button onClick={()=>window.print()} style={{flex:1,padding:12,background:'#0f172a',color:'#fff',border:0,borderRadius:10,fontWeight:800,cursor:'pointer'}}>🖨️ Print / Save PDF</button>
                <button onClick={()=>nav(`/verify/${selected.certId}`)} style={{flex:1,padding:12,background:'#fff',border:'1px solid #cbd5e1',borderRadius:10,fontWeight:700,cursor:'pointer'}}>🔍 Open Verify Page</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </main></div>;
}

const page={minHeight:'100vh',background:'#0f172a',fontFamily:'Inter,sans-serif',position:'relative',overflow:'hidden'};
const glow1={position:'absolute',width:700,height:700,background:'radial-gradient(circle at 20% 20%, #6366f1aa, transparent 60%)',top:-200,left:-200,filter:'blur(40px)',pointerEvents:'none'};
const glow2={position:'absolute',width:800,height:800,background:'radial-gradient(circle at 80% 30%, #06b6d4aa, transparent 60%)',top:-150,right:-200,filter:'blur(50px)',pointerEvents:'none'};
const header={background:'rgba(15,23,42,0.8)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1e293b',padding:'12px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:10};
const main={maxWidth:900,margin:'auto',padding:22,position:'relative',zIndex:1};
const card={background:'#fff',padding:22,borderRadius:20,boxShadow:'0 25px 60px rgba(0,0,0,0.35)'};
const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,margin:'15px 0'};
const inp={padding:12,border:'1px solid #cbd5e1',borderRadius:11,fontSize:13,outline:'none',background:'#f8fafc'};
const submitBtn={marginTop:8,padding:'13px 20px',background:'linear-gradient(135deg,#2563eb,#7c3aed)',color:'#fff',border:0,borderRadius:12,fontWeight:800,cursor:'pointer',boxShadow:'0 12px 24px rgba(99,102,241,0.4)',fontSize:13.5};
const logout={padding:'8px 16px',background:'#1e293b',color:'#fff',border:'1px solid #334155',borderRadius:99,cursor:'pointer',fontWeight:700,fontSize:12};
const row={background:'#fff',borderRadius:16,padding:16,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,boxShadow:'0 8px 20px rgba(0,0,0,0.12)',border:'1px solid #e2e8f0'};
const badge=s=>({fontSize:10,fontWeight:800,padding:'4px 10px',borderRadius:20,background:s==='APPROVED'?'#dcfce7':s==='REJECTED'?'#fee2e2':'#fef9c7',color:s==='APPROVED'?'#166534':s==='REJECTED'?'#991b1b':'#854d0e'});
const errorBox={background:'#fef2f2',color:'#b91c1c',padding:10,borderRadius:10,fontSize:12,marginBottom:10,border:'1px solid #fecaca'};
const empty={background:'#1e293b',border:'1px solid #334155',padding:36,textAlign:'center',borderRadius:16,color:'#94a3b8',fontSize:13};
const modalBg={position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(6px)',display:'grid',placeItems:'center',zIndex:100,padding:16};
const modalCard={background:'#fff',width:'100%',maxWidth:600,borderRadius:18,padding:16,boxShadow:'0 30px 80px rgba(0,0,0,0.5)',animation:'pop 0.2s ease'};
const certPaper={background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:18};