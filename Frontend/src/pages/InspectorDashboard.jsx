import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function InspectorDashboard() {
  const [apps, setApps] = useState([]); const [tab, setTab] = useState('PENDING'); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [selected,setSelected]=useState(null);
  const nav = useNavigate();
  const role = localStorage.getItem('role');
  const isLoggedIn = Boolean(localStorage.getItem('token')) && (role === 'inspector' || role === 'INSPECTOR');

  useEffect(() => { if (!isLoggedIn) nav('/inspector/login', { replace: true }); }, [isLoggedIn, nav]);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await api.get('/instruments');
      let data = Array.isArray(res.data)? res.data : [];
      const now = new Date();
      for(let item of data){
        if(item.status === 'REJECTED'){
          const rejectedDate = new Date(item.updatedAt || item.rejectedAt || now);
          const diffDays = Math.floor((now - rejectedDate) / (1000*60*60*24));
          if(diffDays >= 15){
            try{ await api.delete(`/instruments/${item._id}`); }catch(e){}
          }
        }
      }
      const fresh = await api.get('/instruments');
      setApps(Array.isArray(fresh.data)? fresh.data : []);
    } catch (e) { setError(e.response?.data?.msg || 'Could not load applications.'); } finally { setLoading(false); }
  };

  useEffect(() => { if (isLoggedIn) load(); }, [isLoggedIn]);

  const updateStatus = async (id, status) => { if (!window.confirm(`Set this application to ${status}?`)) return; try { await api.put(`/instruments/${id}/status`, { status }); await load(); } catch (e) { alert(e.response?.data?.msg || 'Update failed'); } };
  const permanentDelete = async (id) => { if(!window.confirm("⚠️ Permanent Reject! Confirm?")) return; try{ await api.delete(`/instruments/${id}`); await load(); }catch(e){ alert(e.response?.data?.msg || 'Delete failed'); } }
  const getDaysLeft = (updatedAt) => { const now = new Date(); const rej = new Date(updatedAt); const diff = Math.floor((now - rej)/(1000*60*60*24)); return 15 - diff; }
  const counts = useMemo(() => ({ PENDING: apps.filter(x => x.status === 'PENDING').length, APPROVED: apps.filter(x => x.status === 'APPROVED').length, REJECTED: apps.filter(x => x.status === 'REJECTED').length }), [apps]);
  const filtered = apps.filter(a => a.status === tab).filter(a => { const q = search.toLowerCase(); return!q || [a.name, a.certId, a.trader?.name, a.serialNo].some(v => String(v || '').toLowerCase().includes(q)); });
  if (!isLoggedIn) return null;

  return <div style={page}>
    <style>{`
  .stat-card{transition: all 0.25s ease; cursor:pointer}.stat-card:hover{transform:translateY(-3px); box-shadow:0 14px 30px rgba(0,0,0,0.25)!important}.stat-active{border-color:#6366f1!important; box-shadow:0 0 0 3px rgba(99,102,241,0.2)!important}
  .item-card{transition: all 0.25s ease; cursor:pointer}.item-card:hover{transform:translateY(-2px); box-shadow:0 14px 32px rgba(0,0,0,0.18)!important; border-color:#c7d2fe!important}
  .btn-act{transition: all 0.2s ease}.btn-act:hover{transform:translateY(-1px); filter:brightness(1.05); box-shadow:0 8px 18px rgba(0,0,0,0.15)}.btn-act:active{transform:scale(0.97)}
  .search-inp{transition: all 0.2s ease}.search-inp:focus{border-color:#6366f1!important; box-shadow:0 0 0 3px rgba(99,102,241,0.15)!important; background:#fff!important; color:#000!important}
   @media print{.no-print{display:none}.cert-paper{box-shadow:none!important; border:1px solid #000!important}}
    `}</style>
    <div style={glow1}></div><div style={glow2}></div>
    <header style={header}><div style={{display:'flex', alignItems:'center', gap:10}}><div style={{width:38,height:38,background:'linear-gradient(135deg,#818cf8,#3b82f6)',display:'grid',placeItems:'center',borderRadius:11,fontWeight:900}}>👮</div><div><b style={{color:'#fff'}}>Inspector Portal</b><span style={small}> • Live MongoDB • {apps.length} total</span></div></div><div><button onClick={load} style={headBtn}>↻ Refresh</button><button onClick={() => { localStorage.clear(); nav('/'); }} style={{...headBtn, background:'#ef4444', color:'#fff', borderColor:'#ef4444'}}>Logout</button></div></header>
    <main style={main}>
      <h1 style={{color:'#f8fafc', margin:'0 0 4px', fontSize:20, fontWeight:900}}>Inspection Queue</h1>
      <p style={{...muted, color:'#94a3b8', marginTop:0}}>Review trader applications and approve verified instruments. (Click card to view certificate)</p>
      <div style={stats}>{['PENDING','APPROVED','REJECTED'].map(s =><button key={s} onClick={() => setTab(s)} className={`stat-card ${tab===s?'stat-active':''}`} style={{...stat, background: s==='PENDING'?'#fef9c7':s==='APPROVED'?'#dcfce7':'#fee2e2', borderColor: tab === s? '#6366f1' : '#1e293b'}}><span style={{fontSize:11, fontWeight:800}}>{s}</span><strong style={{fontSize:22, marginTop:4}}>{counts[s]}</strong></button>)}</div>
      <input className="search-inp" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search name, certificate, serial number or trader…" style={searchBox} />
      {error && <div style={errorBox}>{error}</div>}
      {loading? <div style={empty}>Loading applications…</div> : filtered.length === 0? <div style={empty}>No {tab.toLowerCase()} applications.</div> :
      <div style={{ display: 'grid', gap: 14 }}>{filtered.map(item => {
        const daysLeft = item.status === 'REJECTED'? getDaysLeft(item.updatedAt) : null;
        return <div key={item._id} className="item-card" style={itemCard} onClick={()=>setSelected(item)}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><b style={{fontSize:14}}>{item.name}</b><span style={badge(item.status)}>{item.status}</span>
            {item.status==='REJECTED' && <span style={autoDelBadge}>🕒 Auto-delete in {daysLeft>0? daysLeft : 0} days</span>}
            </div>
            <p style={muted}>Type: {item.type} • Model: {item.model || '—'} • Serial: {item.serialNo || '—'}</p>
            <p style={muted}>Trader: {item.trader?.name || '—'} ({item.trader?.email || '—'})</p>
            {item.certId && <p style={{...muted, color:'#16a34a', fontWeight:700}}>Certificate: <b>{item.certId}</b></p>}
            {item.status==='REJECTED' && <p style={{fontSize:11, color:'#dc2626', marginTop:6, background:'#fef2f2', padding:'5px 8px', borderRadius:6, display:'inline-block', border:'1px solid #fecaca'}}>⚠️ Reject tab e ache, 15 din bade nijei permanently delete hoye jabe.</p>}
          </div>
          {item.qrCode && <img src={item.qrCode} alt="QR" style={{ width: 86, height: 86, background: '#fff', padding: 5, borderRadius:10, border:'1px solid #e2e8f0' }} />}
          <div style={actions} onClick={e=>e.stopPropagation()}>
            {/* APPROVED tab e thakle Approve button lagbe na */}
            {item.status!== 'APPROVED' && (
              <button onClick={() => updateStatus(item._id, 'APPROVED')} className="btn-act" style={approve}>✓ Approve + QR</button>
            )}
            {item.status!== 'REJECTED' && (
              <button onClick={() => updateStatus(item._id, 'REJECTED')} className="btn-act" style={reject}>✕ Reject</button>
            )}
            {item.status!== 'PENDING' && <button onClick={() => updateStatus(item._id, 'PENDING')} className="btn-act" style={pending}>↩ Set Pending</button>}
            {item.status === 'REJECTED' && tab === 'REJECTED' && (
              <button onClick={()=>permanentDelete(item._id)} className="btn-act" style={permReject}>🗑️ Permanent Reject</button>
            )}
          </div>
        </div>
      })}</div>}

      {/* CERTIFICATE MODAL - Click korle asbe */}
      {selected && (
        <div style={modalBg} onClick={()=>setSelected(null)}>
          <div style={modalCard} className="cert-paper" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}} className="no-print">
              <b>Certificate Preview - {selected.status}</b><button onClick={()=>setSelected(null)} style={{border:0,background:'#f1f5f9',padding:'6px 12px',borderRadius:99,cursor:'pointer'}}>✕ Close</button>
            </div>
            {selected.status!=='APPROVED'? (
              <div style={{textAlign:'center',padding:30}}><div style={{fontSize:48}}>⏳</div><h3>{selected.status}</h3><p style={{color:'#64748b',fontSize:13}}>Certificate will be generated after approval.<br/>{selected.name} - {selected.type}</p></div>
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
                    <div><b>Trader:</b> {selected.trader?.name} ({selected.trader?.email})</div>
                    <div><b>Instrument:</b> {selected.name} ({selected.type})</div>
                    <div><b>Model / Serial:</b> {selected.model||'-'} / {selected.serialNo||'-'}</div>
                    <div><b>Issue Date:</b> {new Date(selected.updatedAt).toLocaleDateString()}</div>
                    <div><b>Status:</b> <span style={{color:'#16a34a',fontWeight:800}}>VERIFIED & APPROVED</span></div>
                  </div>
                  {selected.qrCode && <img src={selected.qrCode} width="110" height="110" style={{border:'1px solid #000',padding:4}} alt="QR"/>}
                </div>
                <div style={{marginTop:18,paddingTop:12,borderTop:'1px dashed #cbd5e1',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:11,color:'#64748b'}}>Verifiable at /verify/{selected.certId}</div>
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
    </main>
  </div>;
}

const page={minHeight:'100vh',background:'#0f172a',fontFamily:'Inter,sans-serif',color:'#0f172a',position:'relative',overflow:'hidden'};
const glow1={position:'absolute',width:700,height:700,background:'radial-gradient(circle at 20% 20%, #6366f1aa, transparent 60%)',top:-200,left:-200,filter:'blur(40px)',pointerEvents:'none'};
const glow2={position:'absolute',width:800,height:800,background:'radial-gradient(circle at 80% 30%, #06b6d4aa, transparent 60%)',top:-150,right:-200,filter:'blur(50px)',pointerEvents:'none'};
const header={position:'sticky',top:0,zIndex:10,background:'rgba(15,23,42,0.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1e293b',padding:'14px 22px',display:'flex',justifyContent:'space-between',gap:15,alignItems:'center'};
const main={maxWidth:1100,margin:'auto',padding:22,position:'relative',zIndex:1};
const small={fontSize:11,color:'#94a3b8',marginLeft:8};
const headBtn={padding:'8px 14px',border:'1px solid #334155',borderRadius:99,background:'#1e293b',color:'#fff',marginLeft:8,cursor:'pointer',fontWeight:700,fontSize:12};
const muted={fontSize:12,color:'#64748b',margin:'4px 0'};
const stats={display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,margin:'22px 0 15px'};
const stat={border:'2px solid',borderRadius:16,padding:16,textAlign:'left',display:'flex',flexDirection:'column',boxShadow:'0 8px 20px rgba(0,0,0,0.15)'};
const searchBox={width:'100%',boxSizing:'border-box',padding:'13px 14px',border:'1px solid #334155',borderRadius:12,marginBottom:15,background:'#1e293b',color:'#fff',outline:'none'};
const itemCard={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:18,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',boxShadow:'0 10px 26px rgba(0,0,0,0.18)'};
const actions={display:'flex',flexDirection:'column',gap:7,minWidth:155};
const approve={background:'linear-gradient(135deg,#16a34a,#15803d)',color:'#fff',border:0,padding:11,borderRadius:10,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 16px rgba(22,163,74,0.25)'};
const reject={background:'#fff',color:'#dc2626',border:'1px solid #fca5a5',padding:10,borderRadius:10,fontWeight:700,cursor:'pointer'};
const pending={background:'#eff6ff',color:'#1d4ed8',border:'1px solid #93c5fd',padding:10,borderRadius:10,fontWeight:700,cursor:'pointer'};
const permReject={background:'#0f172a',color:'#fff',border:'1px solid #000',padding:10,borderRadius:10,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 16px rgba(0,0,0,0.25)'};
const empty={background:'#1e293b',padding:45,textAlign:'center',borderRadius:16,color:'#94a3b8',border:'1px solid #334155'};
const errorBox={background:'#fef2f2',color:'#b91c1c',padding:12,borderRadius:10,marginBottom:12,border:'1px solid #fecaca'};
const badge=s=>({fontSize:10,fontWeight:800,padding:'4px 10px',borderRadius:20,background:s==='APPROVED'?'#dcfce7':s==='REJECTED'?'#fee2e2':'#fef9c7',color:s==='APPROVED'?'#166534':s==='REJECTED'?'#991b1b':'#92400e',border:`1px solid ${s==='APPROVED'?'#bbf7d0':s==='REJECTED'?'#fecaca':'#fde68a'}`});
const autoDelBadge={fontSize:10,fontWeight:800,padding:'4px 8px',borderRadius:20,background:'#0f172a',color:'#fff'};
const modalBg={position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(6px)',display:'grid',placeItems:'center',zIndex:100,padding:16};
const modalCard={background:'#fff',width:'100%',maxWidth:600,borderRadius:18,padding:16,boxShadow:'0 30px 80px rgba(0,0,0,0.5)'};
const certPaper={background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:18};