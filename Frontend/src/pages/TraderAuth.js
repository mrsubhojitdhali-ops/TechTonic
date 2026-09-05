import { useState, useEffect } from "react";
import api from "../api/axios"; // Step 1 er file ta

export default function TraderAuth(){
  const [mode, setMode] = useState("login");
  const [loggedUser, setLoggedUser] = useState(null);
  const [generatedAppNo, setGeneratedAppNo] = useState("");
  const [form, setForm] = useState({
    shop:"", owner:"", email:"", pass:"", confirmPass:"", address:"", district:"Kolkata", pin:"",
    mobile:"", aadhaar:"", pan:"", gst:"", tradeLicense:"",
    machine:"Electronic Scale", capacity:"50kg", appNo:"", loginPass:""
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem("loggedTrader")||"null");
    if(u) setLoggedUser(u);
  },[]);

  const validateEmail = (email) => {
    if(!email){ setEmailError(""); setEmailValid(false); return false; }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){ setEmailError("Please provide a valid email!"); setEmailValid(false); return false; }
    const fakeDomains = ["tempmail.com","10minutemail.com","fake.com","test.com","abc.com","mailinator.com","yopmail.com"];
    const domain = email.split("@")[1]?.toLowerCase();
    if(fakeDomains.includes(domain)){ setEmailError(`❌ ${domain} - Fake email is not allowed!`); setEmailValid(false); return false; }
    setEmailError(""); setEmailValid(true); return true;
  };

  const getPasswordStrength = (pass) => { let s=0; if(pass.length>=8)s++; if(/[A-Z]/.test(pass))s++; if(/[a-z]/.test(pass))s++; if(/[0-9]/.test(pass))s++; if(/[^A-Za-z0-9]/.test(pass))s++; return s; };
  const strength = getPasswordStrength(form.pass);
  const isStrongPassword = strength >= 4;
  const strengthColor = ["#ef4444","#f97316","#eab308","#22c55e","#16a34a","#15803d"][strength];

  // DATABASE SIGNUP
  const handleSignup = async () => {
    if(!validateEmail(form.email)) return alert("Please provide a vaild email!");
    if(!form.shop.trim()) return alert("please provide a valid shop name!");
    if(!form.owner.trim()) return alert("Owner Name?");
    if(!form.mobile.trim()) return alert("Please give your mobile number");
    if(!form.address.trim()) return alert("Address?");
    if(!form.pin.trim()) return alert("PIN code!");
    if(!form.aadhaar.trim()) return alert("Aadhaar No. din!");
    if(!form.pan.trim()) return alert("PAN No. din!");
    if(!form.tradeLicense.trim()) return alert("Trade License No. din!");
    if(form.aadhaar.length!==12) return alert("Aadhaar 12 digit");
    if(!isStrongPassword) return alert("Pease provide a strong password");
    if(form.pass!==form.confirmPass) return alert("Password mismatch!");

    try{
      const payload = {
        shop: form.shop, owner: form.owner, email: form.email.toLowerCase(),
        password: form.pass, address: `${form.address}, ${form.district} - ${form.pin}`,
        mobile: form.mobile, aadhaar: form.aadhaar, pan: form.pan, gst: form.gst,
        tradeLicense: form.tradeLicense, machine: form.machine, capacity: form.capacity
      };
      // Backend e save hobe
      const {data} = await api.post("/auth/trader/register", payload);

      // Token save for DB auth
      localStorage.setItem("token", data.token);
      const appNo = data.trader?.appNo || data.appNo || `LM${new Date().getFullYear()}${Math.floor(1000+Math.random()*9000)}`;
      setGeneratedAppNo(appNo);

      const newUser = {appNo, email:form.email.toLowerCase(), shop:form.shop, owner:form.owner, token: data.token};
      localStorage.setItem("loggedTrader", JSON.stringify(newUser));
      setLoggedUser(newUser);

      // Backend e Instrument hisabeo application create korchi jate Inspector dekhte pay
      try{
        await api.post("/instruments", {name: form.machine, type: form.machine, price: 5000});
      }catch(e){}

    }catch(err){
      alert(err.response?.data?.msg || "Backend error - server 5000 cholche to? MongoDB connected?");
    }
  };

  const handleLogin = async () => {
    if(!form.appNo) return alert("Application No din");
    if(!form.loginPass) return alert("Password din!");
    try{
      const {data} = await api.post("/auth/trader/login", {appNo: form.appNo.toUpperCase(), password: form.loginPass});
      localStorage.setItem("token", data.token);
      const u = {appNo: data.trader.appNo, email: data.trader.email, shop: data.trader.shop, owner: data.trader.owner};
      localStorage.setItem("loggedTrader", JSON.stringify(u));
      setLoggedUser(u);
    }catch(e){
      alert("AppNo / Password vul! Backend e user ache kina check koro");
    }
  };

  const logout = () => { localStorage.removeItem("loggedTrader"); localStorage.removeItem("token"); setLoggedUser(null); setMode("login"); setGeneratedAppNo(""); };

  if(loggedUser && generatedAppNo){
    return (
      <div style={{maxWidth:450, margin:'auto', padding:20, fontFamily:'sans-serif'}}>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:12, padding:20, textAlign:'center'}}>
          <div style={{width:50, height:50, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', fontSize:24}}>✓</div>
          <h3 style={{margin:'12px 0 5px 0'}}>Registration Successful (Saved in DB)</h3>
          <p style={{fontSize:12, color:'#64748b', margin:0}}>Your application has been submitted to Database</p>
          <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:12, marginTop:15}}>
            <div style={{fontSize:11, color:'#64748b'}}>Application No</div>
            <div style={{fontSize:22, fontWeight:'bold', letterSpacing:1, marginTop:4}}>{generatedAppNo}</div>
          </div>
          <button onClick={()=>{setGeneratedAppNo("");}} style={{marginTop:15, padding:'11px 20px', background:'black', color:'white', border:'none', borderRadius:8, fontWeight:'bold', width:'100%'}}>Go to Dashboard →</button>
        </div>
      </div>
    );
  }

  if(loggedUser &&!generatedAppNo){
    // Simple dashboard redirect
    window.location.href = "/trader/dashboard";
    return null;
  }

  return (
    <div style={{maxWidth:500, margin:'auto', padding:20, fontFamily:'sans-serif'}}>
      <h2 style={{textAlign:'center'}}>🏪 Trader Portal (DB Mode)</h2>
      <div style={{display:'flex', background:'#e2e8f0', borderRadius:30, padding:4, marginTop:15}}>
        <button onClick={()=>setMode("login")} style={{flex:1, padding:10, borderRadius:20, border:'none', background:mode==="login"?'black':'transparent', color:mode==="login"?'white':'black', fontWeight:'bold'}}>Login</button>
        <button onClick={()=>setMode("signup")} style={{flex:1, padding:10, borderRadius:20, border:'none', background:mode==="signup"?'black':'transparent', color:mode==="signup"?'white':'black', fontWeight:'bold'}}>Sign Up</button>
      </div>
      <div style={{background:'white', padding:20, borderRadius:20, marginTop:15, border:'1px solid #e2e8f0'}}>
        {mode==="login"? (
          <>
            <div style={sec}>TRADER LOGIN (Database)</div>
            <input placeholder="Application No * (Ex: LM2026XXXX)" style={{...inp, fontWeight:'bold', letterSpacing:1, textTransform:'uppercase'}} value={form.appNo} onChange={e=>setForm({...form, appNo:e.target.value.toUpperCase()})}/>
            <input placeholder="Password *" type="password" style={inp} value={form.loginPass} onChange={e=>setForm({...form, loginPass:e.target.value})}/>
            <button onClick={handleLogin} style={btn}>Login with App No →</button>
          </>
        ) : (
          <>
            <div style={sec}>SHOP & OWNER DETAILS</div>
            <input placeholder="Shop Name *" style={inp} value={form.shop} onChange={e=>setForm({...form, shop:e.target.value})}/>
            <div style={{display:'flex', gap:8}}><input placeholder="Owner Name *" style={inp} value={form.owner} onChange={e=>setForm({...form, owner:e.target.value})}/><input placeholder="Mobile No *" style={inp} value={form.mobile} onChange={e=>setForm({...form, mobile:e.target.value})}/></div>
            <input placeholder="Full Address *" style={inp} value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
            <div style={{display:'flex', gap:8}}><select style={inp} value={form.district} onChange={e=>setForm({...form, district:e.target.value})}><option>Kolkata</option><option>Howrah</option><option>North 24 Parganas</option></select><input placeholder="PIN *" style={inp} value={form.pin} onChange={e=>setForm({...form, pin:e.target.value})}/></div>
            <div style={sec2}>KYC & GOVT. DOCUMENTS</div>
            <input placeholder="Aadhaar No * (12 digit)" style={inp} value={form.aadhaar} onChange={e=>setForm({...form, aadhaar:e.target.value})}/>
            <div style={{display:'flex', gap:8}}><input placeholder="PAN No *" style={inp} value={form.pan} onChange={e=>setForm({...form, pan:e.target.value})}/><input placeholder="GSTIN No" style={inp} value={form.gst} onChange={e=>setForm({...form, gst:e.target.value})}/></div>
            <input placeholder="Trade License No *" style={inp} value={form.tradeLicense} onChange={e=>setForm({...form, tradeLicense:e.target.value})}/>
            <div style={sec3}>DEVICE DETAILS</div>
            <div style={{display:'flex', gap:8}}><select style={inp} value={form.machine} onChange={e=>setForm({...form, machine:e.target.value})}><option>Electronic Scale</option><option>Mechanical Scale</option><option>Weights</option><option>Petrol Pump</option></select><input placeholder="Capacity *" style={inp} value={form.capacity} onChange={e=>setForm({...form, capacity:e.target.value})}/></div>
            <div style={sec}>LOGIN CREDENTIALS</div>
            <div style={{position:'relative'}}>
              <input placeholder="Email ID *" style={{...inp, borderColor: emailError? 'red' : emailValid? 'green' : '#ddd', borderWidth: emailError || emailValid? '2px' : '1px'}} value={form.email} onChange={e=>{setForm({...form, email:e.target.value}); validateEmail(e.target.value);}}/>
              <span style={{position:'absolute', right:12, top:11}}>{emailValid? '✅' : emailError? '❌' : '📧'}</span>
            </div>
            {emailError && <div style={{fontSize:11, color:'red', background:'#fee2e2', padding:'6px 10px', borderRadius:6, marginTop:-4, marginBottom:8}}>{emailError}</div>}
            <div style={{position:'relative'}}>
              <input placeholder="Password * (Strong)" type={showPass? "text" : "password"} style={inp} value={form.pass} onChange={e=>setForm({...form, pass:e.target.value})}/>
              <span onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:12, top:11, cursor:'pointer'}}>{showPass? "🙈" : "👁️"}</span>
            </div>
            {form.pass && <div style={{display:'flex', gap:4, marginBottom:8}}>{[1,2,3,4,5].map(i => <div key={i} style={{flex:1, height:5, borderRadius:5, background: i <= strength? strengthColor : '#e2e8f0'}}></div>)}</div>}
            <div style={{position:'relative'}}>
              <input placeholder="Re-enter Password *" type={showConfirmPass? "text" : "password"} style={inp} value={form.confirmPass} onChange={e=>setForm({...form, confirmPass:e.target.value})}/>
              <span onClick={()=>setShowConfirmPass(!showConfirmPass)} style={{position:'absolute', right:12, top:11, cursor:'pointer'}}>{showConfirmPass? "🙈" : "👁️"}</span>
            </div>
            <button onClick={handleSignup} disabled={!emailValid} style={{...btn, opacity:!emailValid? 0.5 : 1}}>Save to Database & Generate App No</button>
          </>
        )}
      </div>
    </div>
  );
}
const inp = {width:'100%', padding:11, marginBottom:8, borderRadius:10, border:'1px solid #ddd', boxSizing:'border-box', fontSize:13};
const btn = {width:'100%', padding:12, background:'#0000ff', color:'white', border:'none', borderRadius:10, fontWeight:'bold', marginTop:10, cursor:'pointer'};
const sec = {background:'#eff6ff', padding:'6px 10px', borderRadius:6, fontSize:10, fontWeight:'bold', color:'#1e40af', margin:'10px 0 8px 0'};
const sec2 = {background:'#fef3c7', padding:'6px 10px', borderRadius:6, fontSize:10, fontWeight:'bold', color:'#92400e', margin:'10px 0 8px 0'};
const sec3 = {background:'#dcfce7', padding:'6px 10px', borderRadius:6, fontSize:10, fontWeight:'bold', color:'#166534', margin:'10px 0 8px 0'};