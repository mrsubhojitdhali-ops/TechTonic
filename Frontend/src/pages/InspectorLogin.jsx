import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function InspectorLogin(){
  const [email,setEmail]=useState('inspector@wb.gov.in');
  const [password,setPassword]=useState('');
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
        <input style={{width:'100%', padding:'10px', marginBottom:'15px'}} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input style={{width:'100%', padding:'10px', marginBottom:'20px'}} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" style={{width:'100%', padding:'12px', background:'#007bff', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Login</button>
      </form>
    </div>
  )
}