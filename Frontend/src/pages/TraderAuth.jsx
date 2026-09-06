import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TraderAuth(){
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSignup = async () => {
    if(!form.name || !form.email || !form.password) return alert("All fields required");
    setLoading(true);
    try{
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email.toLowerCase(),
        password: form.password,
        role: "trader"
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      alert("Registered! Now apply for instrument.");
      nav("/trader");
    }catch(err){
      alert(err.response?.data?.msg || "Signup failed");
    } finally { setLoading(false); }
  };

  const handleLogin = async () => {
    if(!form.email || !form.password) return alert("Email & Password required");
    setLoading(true);
    try{
      const res = await api.post("/auth/login", {
        email: form.email.toLowerCase(),
        password: form.password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      
      if(res.data.role === "trader") nav("/trader");
      else nav("/inspector");
    }catch(err){
      alert(err.response?.data?.msg || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{maxWidth:420, margin:'auto', padding:20, fontFamily:'Inter, sans-serif', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center'}}>
      <h2 style={{textAlign:'center'}}>🏪 Trader Portal</h2>
      <div style={{display:'flex', background:'#e2e8f0', borderRadius:30, padding:4, marginTop:15}}>
        <button onClick={()=>setMode("login")} style={{flex:1, padding:10, borderRadius:20, border:'none', background:mode==="login"?'black':'transparent', color:mode==="login"?'white':'black', fontWeight:'bold', cursor:'pointer'}}>Login</button>
        <button onClick={()=>setMode("signup")} style={{flex:1, padding:10, borderRadius:20, border:'none', background:mode==="signup"?'black':'transparent', color:mode==="signup"?'white':'black', fontWeight:'bold', cursor:'pointer'}}>Sign Up</button>
      </div>

      <div style={{background:'white', padding:25, borderRadius:20, marginTop:15, border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
        {mode==="signup" && <input placeholder="Shop / Owner Name *" style={inp} value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>}
        <input placeholder="Email ID *" style={inp} value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input placeholder="Password *" type="password" style={inp} value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        
        <button onClick={mode==="login" ? handleLogin : handleSignup} disabled={loading} style={{...btn, opacity: loading?0.6:1}}>
          {loading ? "..." : mode==="login" ? "Login →" : "Create Account →"}
        </button>

        <p style={{fontSize:11, color:'#94a3b8', textAlign:'center', marginTop:12}}>Test: inspector@wb.gov.in / Inspector@123</p>
      </div>
    </div>
  );
}
const inp = {width:'100%', padding:'12px 14px', marginBottom:10, borderRadius:10, border:'1px solid #e2e8f0', boxSizing:'border-box', fontSize:14, outline:'none'};
const btn = {width:'100%', padding:'12px', background:'#0f172a', color:'white', border:'none', borderRadius:10, fontWeight:'bold', marginTop:10, cursor:'pointer'};