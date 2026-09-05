import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function InspectorLogin(){
  const [email,setEmail]=useState('inspector@wb.gov.in');
  const [password,setPassword]=useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav=useNavigate();

  const handleLogin=async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res=await api.post('/auth/login',{email,password});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      nav('/inspector/dashboard');
    }catch(err){
      alert(err.response?.data?.msg || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return(
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', padding:'20px'}}>
      <form onSubmit={handleLogin} style={{background:'white', padding:'40px 35px', borderRadius:'16px', width:'100%', maxWidth:'400px', boxShadow:'0 15px 35px rgba(0,0,0,0.2)'}}>
        
        <div style={{textAlign:'center', marginBottom:'25px'}}>
          <div style={{width:'60px', height:'60px', background:'#007bff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 15px', fontSize:'28px', color:'white'}}>🛡️</div>
          <h2 style={{margin:'0', fontSize:'22px', color:'#1a202c', fontWeight:'700'}}>Inspector Portal</h2>
          <p style={{margin:'5px 0 0', fontSize:'13px', color:'#718096'}}>Govt. of West Bengal | Legal Metrology</p>
        </div>

        <div style={{marginBottom:'16px'}}>
          <label style={{fontSize:'13px', fontWeight:'600', color:'#4a5568', display:'block', marginBottom:'6px'}}>Official Email</label>
          <input style={{width:'100%', padding:'12px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', fontSize:'14px', boxSizing:'border-box'}} placeholder="inspector@wb.gov.in" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        
        <div style={{marginBottom:'22px'}}>
          <label style={{fontSize:'13px', fontWeight:'600', color:'#4a5568', display:'block', marginBottom:'6px'}}>Password</label>
          <div style={{position:'relative'}}>
            <input 
              style={{width:'100%', padding:'12px 42px 12px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', fontSize:'14px', boxSizing:'border-box'}} 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
            />
            <span 
              onClick={()=>setShowPassword(!showPassword)}
              style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', cursor:'pointer', fontSize:'18px', color:'#718096'}}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{width:'100%', padding:'13px', background: loading ? '#a0aec0' : '#007bff', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'15px', transition:'0.2s'}}>
          {loading ? 'Verifying...' : 'Secure Login'}
        </button>

        <p style={{textAlign:'center', fontSize:'11px', color:'#a0aec0', marginTop:'18px'}}>Authorized personnel only. All activities are monitored.</p>
      </form>
    </div>
  )
}