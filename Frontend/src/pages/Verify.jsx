import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";

export default function Verify(){
  const { certId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [inputId, setInputId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveId = certId || searchParams.get("cert");

  useEffect(()=>{
    if(!effectiveId) return;
    const fetchVerify = async () => {
      setLoading(true);
      try{
        const res = await api.get(`/instruments/verify/${effectiveId.toUpperCase()}`);
        if(res.data.valid) setData(res.data.data);
        else { setData(false); setError(res.data.msg); }
      }catch(e){
        setData(false); setError(e.response?.data?.msg || "Invalid Certificate");
      } finally { setLoading(false); }
    };
    fetchVerify();
  },[effectiveId]);

  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setMsg("Scanning...");
    try{
      const html5Qr = new Html5Qrcode("reader-hidden");
      const decoded = await html5Qr.scanFile(file, true);
      const wbMatch = String(decoded).toUpperCase().match(/WB-LM-\d{4}-\d+/);
      if(wbMatch) navigate(`/verify/${wbMatch[0]}`);
      else setMsg("QR valid but CertId not found");
    }catch(err){ setMsg("❌ QR clear na, arekta photo tolo"); }
  };

  if(!effectiveId){
    return (
      <div style={{maxWidth:400, margin:'auto', padding:20, fontFamily:'sans-serif', textAlign:'center'}}>
        <h2>🔍 Verify Certificate</h2>
        <div style={{background:'white', border:'2px solid #16a34a', borderRadius:15, padding:20, marginTop:20}}>
          <div id="reader-hidden" style={{display:'none'}}></div>
          <label style={{display:'block', width:'100%', padding:14, background:'#16a34a', color:'white', borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>
            📸 SCAN QR PHOTO
            <input type="file" accept="image/*" capture="environment" onChange={handleFileScan} style={{display:'none'}}/>
          </label>
          {msg && <p style={{fontSize:12, marginTop:8, color:'red'}}>{msg}</p>}
        </div>
        <div style={{margin:'12px 0', fontSize:12, color:'#94a3b8'}}>— OR —</div>
        <div style={{background:'white', border:'1px solid #e2e8f0', borderRadius:15, padding:20}}>
          <input value={inputId} onChange={e=>setInputId(e.target.value.toUpperCase())} placeholder="WB-LM-2026-XXXX" style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #e2e8f0', textAlign:'center', boxSizing:'border-box'}}/>
          <button onClick={()=>{ if(inputId) navigate(`/verify/${inputId}`)}} style={{width:'100%', padding:12, background:'#0f172a', color:'white', border:'none', borderRadius:12, marginTop:10, fontWeight:'bold'}}>VERIFY</button>
        </div>
        <p style={{fontSize:10, marginTop:15, color:'#666'}}>Test ID: WB-LM-2026-4085 (after approve)</p>
      </div>
    );
  }

  if(loading) return <div style={{padding:50, textAlign:'center'}}>Checking... ⏳</div>;

  if(data === false){
    return (
      <div style={{maxWidth:500, margin:'auto', padding:20, textAlign:'center', fontFamily:'sans-serif'}}>
        <div style={{border:'3px solid #dc2626', borderRadius:20, padding:25, background:'#fef2f2'}}>
          <div style={{fontSize:60}}>❌</div>
          <h1 style={{color:'#dc2626'}}>INVALID</h1>
          <p>Certificate: <b>{effectiveId}</b></p>
          <p style={{fontSize:12, background:'white', padding:10, borderRadius:10}}>{error}</p>
        </div>
        <button onClick={()=>navigate('/verify')} style={{marginTop:20, padding:'12px 25px', background:'black', color:'white', border:'none', borderRadius:20}}>Scan Again</button>
      </div>
    );
  }

  if(data){
    return (
      <div style={{maxWidth:500, margin:'auto', padding:20, textAlign:'center', fontFamily:'sans-serif'}}>
        <div style={{border:'3px solid #16a34a', borderRadius:20, padding:25, background:'#f0fdf4'}}>
          <div style={{fontSize:60}}>✅</div>
          <h1 style={{color:'#16a34a', margin:0}}>VERIFIED</h1>
          <p style={{fontSize:12, color:'green', fontWeight:'bold'}}>Blockchain Hash Matched ✓</p>
          <div style={{textAlign:'left', background:'white', padding:15, borderRadius:12, marginTop:15, fontSize:13, lineHeight:2}}>
            <b>Certificate ID:</b> {data.certId}<br/>
            <b>Instrument:</b> {data.name}<br/>
            <b>Type:</b> {data.type}<br/>
            <b>Status:</b> {data.status}<br/>
            <b>Expiry:</b> {new Date(data.expiryDate).toLocaleDateString()}<br/>
            <b>Trader:</b> {data.trader?.name}<br/>
            <b>Signed Hash:</b> <small style={{wordBreak:'break-all'}}>{data.signedHash}</small>
          </div>
          <img src={data.qrCode} alt="qr" width={130} style={{marginTop:15, background:'white', padding:6, borderRadius:10}}/>
        </div>
        <button onClick={()=>navigate('/verify')} style={{marginTop:20, padding:'10px 20px', background:'#16a34a', color:'white', border:'none', borderRadius:20}}>Verify Another</button>
      </div>
    );
  }

  return null;
}