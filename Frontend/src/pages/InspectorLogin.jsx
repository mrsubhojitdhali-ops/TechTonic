import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function InspectorLogin(){
  const [email,setEmail]=useState('inspector@wb.gov.in');
  const [password,setPassword]=useState('');
  const [showPassword, setShowPassword] = useState(false);
  const nav=useNavigate();

  const handleLogin=async(e)=>{
    e.preventDefault();
    try{
      const res=await api.post('/auth/login',{email,password});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      nav('/inspector/dashboard');
    }catch(err){
      alert(err.response?.data?.msg || 'Login Failed');
    }
  };

  return(
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f2f5'}}>
      <form onSubmit={handleLogin} style={{background:'white', padding:'40px', borderRadius:'10px', width:'350px', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}}>
        <h2 style={{textAlign:'center', marginBottom:'20px'}}>Inspector Login</h2>
        <input style={{width:'100%', padding:'10px', marginBottom:'15px', boxSizing:'border-box'}} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        
        <div style={{position:'relative', marginBottom:'20px'}}>
          <input 
            style={{width:'100%', padding:'10px', paddingRight:'40px', boxSizing:'border-box'}} 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
          />
          <span 
            onClick={()=>setShowPassword(!showPassword)}
            style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', cursor:'pointer', userSelect:'none', fontSize:'18px'}}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" style={{width:'100%', padding:'12px', background:'#007bff', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Login</button>
      </form>
    </div>
  )
}