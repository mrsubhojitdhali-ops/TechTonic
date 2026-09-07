import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TraderAuth({ inspector = false }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', aadhaar: '', pan: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const nav = useNavigate();

  const isValidEmail = (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e);
  const isValidAadhaar = (n) => /^\d{12}$/.test(n);
  const isValidPAN = (p) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(p.toUpperCase());
  const getStrength = (p) => {
    let s=0; if(p.length>=8)s++; if(/[A-Z]/.test(p))s++; if(/[a-z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++;
    if(['123456','password','qwerty'].includes(p.toLowerCase())) s=0;
    return s;
  };
  const strength = getStrength(form.password);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    const email = form.email.trim().toLowerCase();
    if (!isValidEmail(email)) return setError('Enter a valid email address');
    if (mode==='signup') {
      if(!form.name.trim()||!form.aadhaar||!form.pan) return setError('Fill all fields');
      if(strength<4) return setError('Weak password! Use 8+ chars, Upper, Lower, Number & Symbol');
      if(!isValidAadhaar(form.aadhaar)) return setError('Aadhaar must be 12 digits');
      if(!isValidPAN(form.pan)) return setError('PAN format: ABCDE1234F');
    }
    setLoading(true);
    try {
      const endpoint = mode==='signup'?'/auth/register':'/auth/login';
      const payload = mode==='signup'?{...form, email, pan:form.pan.toUpperCase()}:{email, password:form.password};
      const {data} = await api.post(endpoint, payload);
      localStorage.setItem('token',data.token); localStorage.setItem('role',data.role);
      localStorage.setItem('name',data.name); localStorage.setItem('email',data.email||email);
      nav(data.role==='inspector'?'/inspector':'/trader',{replace:true});
    } catch(err){ setError(err.response?.data?.msg||'Server not reachable'); } finally{ setLoading(false); }
  };

  return (
    <div style={page}>
      <div style={glow1}></div><div style={glow2}></div>
      
      <div style={{position:'absolute', top:18, left:18, zIndex:10}}>
        <button onClick={()=>nav('/')} style={homeBtn}>← Home</button>
      </div>

      <div style={card}>
        <h2 style={{margin:0, fontSize:24, fontWeight:900}}>{inspector?"👮 Inspector Login":"🏪 Trader Portal"}</h2>
        <p style={{fontSize:12.5, color:'#64748b', marginTop:6, marginBottom:16}}>{mode==='login'?"Welcome back! Login to continue.":"Create your verified trader account."}</p>

        <div style={tabs}>
          <button onClick={()=>{setMode('login');setError('')}} style={tab(mode==='login')}>Login</button>
          {!inspector && <button onClick={()=>{setMode('signup');setError('')}} style={tab(mode==='signup')}>Sign Up</button>}
        </div>

        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:10, marginTop:16}}>
          {mode==='signup' && <>
            <input placeholder="Full / Shop Name *" style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              <input placeholder="Aadhaar * 12 digit" maxLength={12} style={inp} value={form.aadhaar} onChange={e=>setForm({...form,aadhaar:e.target.value.replace(/\D/g,'')})}/>
              <input placeholder="PAN * ABCDE1234F" maxLength={10} style={{...inp, textTransform:'uppercase'}} value={form.pan} onChange={e=>setForm({...form,pan:e.target.value.toUpperCase()})}/>
            </div>
          </>}
          <input placeholder="Email *" type="email" style={inp} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <div style={{position:'relative'}}>
            <input placeholder="Password *" type={showPass?'text':'password'} style={{...inp, marginBottom:0, paddingRight:40}} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
            <span onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:12, top:11, cursor:'pointer', fontSize:12, color:'#64748b'}}>{showPass?'Hide':'Show'}</span>
          </div>

          {mode==='signup' && form.password && (
            <div style={{display:'flex', gap:4, marginTop:2}}>
              {[...Array(4)].map((_,i)=><div key={i} style={{height:4, flex:1, borderRadius:20, background: i<strength? (strength<2?'#ef4444':strength<4?'#f59e0b':'#16a34a') : '#e2e8f0'}}/>)}
            </div>
          )}

          {error && <div style={errBox}>{error}</div>}
          <button disabled={loading} style={{...btn, opacity:loading?.65:1}}>{loading?'Please wait…': mode==='login'?'Login →':'Create Account →'}</button>
        </form>
      </div>
    </div>
  );
}

const page={minHeight:'100vh', background:'#020617', display:'flex', justifyContent:'center', alignItems:'center', padding:20, fontFamily:'Inter,sans-serif', position:'relative', overflow:'hidden'};
const glow1={position:'absolute', width:500, height:500, background:'radial-gradient(circle at 30% 30%, #2563eb55, transparent 60%)', top:-100, left:-100, filter:'blur(40px)'};
const glow2={position:'absolute', width:600, height:600, background:'radial-gradient(circle at 70% 70%, #16a34a33, transparent 60%)', bottom:-150, right:-150, filter:'blur(50px)'};
const card={width:'100%', maxWidth:440, background:'#fff', padding:28, borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,0.5)', zIndex:1, border:'1px solid #e2e8f0'};
const tabs={display:'flex', background:'#f1f5f9', borderRadius:99, padding:4};
const tab=a=>({flex:1, padding:10, borderRadius:20, border:0, fontWeight:800, fontSize:13, cursor:'pointer', background:a?'#0f172a':'transparent', color:a?'#fff':'#64748b', transition:'0.25s', boxShadow:a?'0 6px 14px rgba(15,23,42,0.2)':'none'});
const inp={width:'100%', padding:'12px 14px', borderRadius:10, border:'1px solid #cbd5e1', fontSize:13.5, outline:'none', boxSizing:'border-box'};
const btn={width:'100%', padding:13, borderRadius:12, border:0, background:'#0f172a', color:'#fff', fontWeight:800, cursor:'pointer', marginTop:6, boxShadow:'0 10px 20px rgba(15,23,42,0.2)', transition:'0.2s'};
const homeBtn={border:'1px solid #1e293b', background:'#0f172a', color:'#fff', padding:'8px 16px', borderRadius:99, cursor:'pointer', fontWeight:700, fontSize:12};
const errBox={background:'#fef2f2', color:'#b91c1c', border:'1px solid #fecaca', padding:9, borderRadius:8, fontSize:11.5, marginTop:4};