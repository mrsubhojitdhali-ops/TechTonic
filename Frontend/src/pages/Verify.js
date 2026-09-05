import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";

export default function Verify(){
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(undefined);
  const [backendData, setBackendData] = useState(null); // backend WB-LM er jonno
  const [inputId, setInputId] = useState("");
  const [msg, setMsg] = useState("");

  // /verify?cert=WB-LM-2026-4085 support
  const certFromQuery = searchParams.get("cert");
  const effectiveId = id || certFromQuery;

  useEffect(()=>{
    if(!effectiveId){
      setApp(null);
      return;
    }
    const check = async () => {
      const raw = String(effectiveId).toUpperCase().trim();

      // CASE 1: Backend WB-LM-xxxx
      if(raw.startsWith("WB-LM")){
        try{
          const res = await api.get(`/instruments/verify/${raw}`);
          if(res.data.valid){
            setBackendData(res.data.data);
            setApp({ id: res.data.data.certId, status: "Approved", isBackend: true });
          } else {
            setApp(false);
            setMsg(res.data.msg);
          }
        }catch(e){
          setApp(false);
          setMsg("Invalid Certificate");
        }
        return;
      }

      // CASE 2: Old Local LM-xxxx (tomar existing logic same)
      try{
        const cleanId = raw.replace("LM-","").trim();
        if(!cleanId || isNaN(cleanId)){
          setApp(false);
          return;
        }
        const all = JSON.parse(localStorage.getItem("traderApplications") || "[]");
        const found = all.find(a => String(a.id) === cleanId);
        if(found) setApp(found);
        else setApp(false);
      }catch(e){ setApp(false); }
    };
    check();
  },[effectiveId]);

  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setMsg("Scanning...");
    try{
      const html5Qr = new Html5Qrcode("reader-hidden");
      const decoded = await html5Qr.scanFile(file, true);
      const decodedStr = String(decoded).toUpperCase();

      // jodi QR e WB-LM thake
      const wbMatch = decodedStr.match(/WB-LM-\d{4}-\d+/);
      if(wbMatch){
        navigate(`/verify/${wbMatch[0]}`);
        return;
      }
      const m = decodedStr.match(/LM-?\d+/i);
      if(m){
        navigate(`/verify/${m[0].toUpperCase()}`);
      }else{
        const num = String(decoded).replace(/[^0-9]/g,"");
        if(num) navigate(`/verify/LM-${num}`);
        else setMsg("This is a wrong qr!");
      }
    }catch(err){
      setMsg("❌ QR is not clear,,Try to take another clear picture");
    }
  };

  if(!effectiveId){
    return (
      <div style={{maxWidth:400, margin:'auto', padding:20, fontFamily:'sans-serif', textAlign:'center'}}>
        <h2>🔍 Verification</h2>
        <div style={{background:'white', border:'2px solid #16a34a', borderRadius:15, padding:20, marginTop:20}}>
          <b>📷 OPTION 1: Scan QR</b>
          <div id="reader-hidden" style={{display:'none'}}></div>
          <label style={{display:'block', width:'100%', padding:14, background:'#16a34a', color:'white', borderRadius:12, marginTop:12, fontWeight:'bold', cursor:'pointer'}}>
            📸 TAKE PHOTO / UPLOAD
            <input type="file" accept="image/*" capture="environment" onChange={handleFileScan} style={{display:'none'}}/>
          </label>
          {msg && <p style={{fontSize:12, marginTop:8, color:'red'}}>{msg}</p>}
        </div>
        <div style={{margin:'12px 0', fontSize:12, color:'#94a3b8', fontWeight:'bold'}}>— OR —</div>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:15, padding:20}}>
          <b>⌨️ OPTION 2: Manual ID</b>
          <input value={inputId} onChange={e=>setInputId(e.target.value)} placeholder="LM-6356 or WB-LM-2026-4085" style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #ddd', textAlign:'center', fontSize:14, marginTop:12, boxSizing:'border-box'}}/>
          <button onClick={()=>{
            if(!inputId) return alert("ID dao");
            const v = inputId.toUpperCase().trim();
            if(v.startsWith("WB-LM")) navigate(`/verify/${v}`);
            else navigate(`/verify/LM-${v.replace("LM-","").trim()}`);
          }} style={{width:'100%', padding:12, background:'black', color:'white', border:'none', borderRadius:12, marginTop:10, fontWeight:'bold'}}>VERIFY</button>
        </div>
        <p style={{fontSize:10, marginTop:15, color:'#666'}}>Test: WB-LM-2026-4085</p>
        <a href="/" style={{display:'block', marginTop:20}}>← Home</a>
      </div>
    );
  }

  if(app === undefined){
    return <div style={{padding:50, textAlign:'center', fontFamily:'sans-serif'}}>Checking... ⏳</div>;
  }

  if(app === false || app === null){
    return (
      <div style={{maxWidth:500, margin:'auto', padding:20, fontFamily:'sans-serif', textAlign:'center'}}>
        <div style={{border:'3px solid #dc2626', borderRadius:20, padding:25, background:'#fef2f2'}}>
          <div style={{fontSize:60}}>❌</div>
          <h1 style={{color:'#dc2626'}}>INVALID QR</h1>
          <p>Certificate ID: <b>{String(effectiveId).toUpperCase()}</b></p>
          <p style={{fontSize:12, background:'white', padding:10, borderRadius:10, marginTop:10}}>{msg || "Database e ei ID nei."}</p>
        </div>
        <button onClick={()=>navigate('/verify')} style={{marginTop:20, padding:'12px 25px', background:'black', color:'white', border:'none', borderRadius:20}}>📷 Scan Again</button>
      </div>
    );
  }

  // BACKEND VALID
  if(app.isBackend && backendData){
    return (
      <div style={{maxWidth:500, margin:'auto', padding:20, fontFamily:'sans-serif', textAlign:'center'}}>
        <div style={{border:'3px solid #16a34a', borderRadius:20, padding:25, background:'#f0fdf4'}}>
          <div style={{fontSize:60}}>✅</div>
          <h1 style={{color:'#16a34a'}}>VERIFIED</h1>
          <p style={{fontSize:12, color:'green', fontWeight:'bold'}}>Signed Hash Matched ✓</p>
          <div style={{textAlign:'left', background:'white', padding:15, borderRadius:12, marginTop:15, fontSize:13, lineHeight:2}}>
            <b>Certificate:</b> {backendData.certId}<br/>
            <b>Instrument:</b> {backendData.name}<br/>
            <b>Type:</b> {backendData.type}<br/>
            <b>Status:</b> APPROVED<br/>
            <b>Expiry:</b> {new Date(backendData.expiryDate).toLocaleDateString()}<br/>
            <b>Hash:</b> <small style={{wordBreak:'break-all'}}>{backendData.signedHash?.slice(0,30)}...</small>
          </div>
          <img src={backendData.qrCode} width={120} style={{marginTop:15, background:'white', padding:5}}/>
        </div>
        <button onClick={()=>navigate('/verify')} style={{marginTop:20, padding:'10px 20px', background:'#16a34a', color:'white', border:'none', borderRadius:20}}>Scan Another</button>
      </div>
    );
  }

  // OLD LOCAL VALID
  const isApproved = app && app.status === "Approved";
  return (
    <div style={{maxWidth:500, margin:'auto', padding:20, fontFamily:'sans-serif', textAlign:'center'}}>
      <div style={{border: isApproved? '3px solid #16a34a':'3px solid #f59e0b', borderRadius:20, padding:25, background:'white'}}>
        <div style={{fontSize:60}}>{isApproved? "✅":"⏳"}</div>
        <h1 style={{color: isApproved?'#16a34a':'#f59e0b'}}>{isApproved? "VERIFIED" : String(app.status).toUpperCase()}</h1>
        <div style={{textAlign:'left', background:'#f8fafc', padding:15, borderRadius:12, marginTop:15, fontSize:14, lineHeight:2}}>
          <b>Certificate:</b> LM-{app.id}<br/>
          <b>Shop:</b> {app.shop}<br/>
          <b>Owner:</b> {app.owner}<br/>
          <b>Machine:</b> {app.machine} - {app.capacity}<br/>
          <b>Address:</b> {app.address}<br/>
          <b>Status:</b> {app.status}
        </div>
      </div>
      <button onClick={()=>navigate('/verify')} style={{marginTop:20, padding:'10px 20px', background:'#16a34a', color:'white', border:'none', borderRadius:20}}>Scan Another</button>
    </div>
  );
}