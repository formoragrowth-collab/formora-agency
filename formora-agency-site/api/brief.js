const RECIPIENT = process.env.BRIEF_TO_EMAIL || 'agencyformora@gmail.com';
const SENDER = process.env.BRIEF_FROM_EMAIL || '';
const KEY = process.env.RESEND_API_KEY || '';
const submissions = new Map(); // Best-effort short-window per warm instance; use WAF / durable limits at scale.
const serviceNames = [
  'Brand strategy & branding','Graphic design','Social media marketing','Web design','SEO','GEO/AEO','Performance marketing','Career branding','Multiple services','Not sure yet'
];
const budgetNames = ['Under 500 AZN','500–1,000 AZN','1,000–2,500 AZN','2,500–5,000 AZN','5,000+ AZN','Discuss'];
const text = (v,limit=250)=>typeof v==='string'?v.trim().slice(0,limit):'';
const checkEmail = v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)&&v.length<=254;
module.exports = async (req,res)=>{
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method==='GET')return res.status(200).json({enabled:Boolean(KEY&&SENDER)});
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});
  if(!KEY||!SENDER)return res.status(503).json({error:'delivery_not_configured'});
  const origin=req.headers.origin;
  if(origin){try{if(new URL(origin).host!==req.headers.host)return res.status(403).json({error:'origin_not_allowed'});}catch{return res.status(403).json({error:'invalid_origin'});}}
  if(Number(req.headers['content-length']||0)>12000)return res.status(413).json({error:'too_large'});
  const d=req.body&&typeof req.body==='object'?req.body:{};
  if(text(d.website,300))return res.status(200).json({ok:true}); // silently discard honeypot submissions
  const name=text(d.name,100),company=text(d.company,120),email=text(d.email,254),phone=text(d.phone,40),details=text(d.details,2000),timeline=text(d.timeline,150);
  const s=Number(d.service),b=d.budget===''?NaN:Number(d.budget);
  if(!name||!checkEmail(email)||details.length<20||!Number.isInteger(s)||s<0||s>=serviceNames.length)
    return res.status(400).json({error:'invalid_fields'});
  const ip=text(req.headers['x-forwarded-for']?.split(',')[0]||req.socket?.remoteAddress||'unknown',100);
  const now=Date.now(); for(const [k,t] of submissions){if(now-t>120000)submissions.delete(k);}
  if(submissions.has(ip)&&now-submissions.get(ip)<45000)return res.status(429).json({error:'too_many_requests'});
  submissions.set(ip,now);
  const message=[
    'FORMORA — yeni layihə brifi',
    'Ad: '+name,
    'Şirkət: '+(company||'—'),
    'E-poçt: '+email,
    'Telefon: '+(phone||'—'),
    'Xidmət: '+serviceNames[s],
    'Büdcə: '+(Number.isInteger(b)&&b>=0&&b<budgetNames.length?budgetNames[b]:'—'),
    'Müddət: '+(timeline||'—'),
    'Dil: '+(['az','en','ru'].includes(d.language)?d.language:'az'),
    'Təsvir: '+details
  ].join('\n\n');
  try{
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':'Bearer '+KEY,'Content-Type':'application/json'},
      body:JSON.stringify({from:SENDER,to:[RECIPIENT],reply_to:email,subject:'FORMORA | Yeni layihə brifi — '+name,text:message})
    });
    if(!response.ok){return res.status(502).json({error:'delivery_failed'});}
    return res.status(200).json({ok:true});
  }catch{return res.status(502).json({error:'delivery_failed'});}
};
