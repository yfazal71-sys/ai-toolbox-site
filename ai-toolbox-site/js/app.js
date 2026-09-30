(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const rt=document.documentElement;
const TH=$$('#th [data-th]'),cur=()=>rt.dataset.t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'),mark=()=>TH.forEach(b=>b.setAttribute('aria-pressed',b.dataset.th===cur()));
TH.forEach(b=>b.addEventListener('click',()=>{rt.dataset.t=b.dataset.th;try{localStorage.setItem('t',b.dataset.th)}catch{}mark()}));mark();
// mobile menu
const mb=$('#mb'),mn=$('#mn');
if(mb){const set=o=>{mn.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')};
 mb.addEventListener('click',()=>set(!mn.classList.contains('open')));
 document.addEventListener('click',e=>{if(!mn.contains(e.target)&&!mb.contains(e.target))set(false)});
 document.addEventListener('keydown',e=>{if(e.key=='Escape'&&mn.classList.contains('open')){set(false);mb.focus()}});
 $$('a',mn).forEach(a=>a.addEventListener('click',()=>set(false)));
 matchMedia('(min-width:1241px)').addEventListener('change',e=>e.matches&&set(false))}
// search
const cards=$$('.card[data-s]');
function filt(){const q=($('[name=q]',document)?.value||'').toLowerCase().trim(),h=location.hash.slice(1);
 cards.forEach(c=>c.hidden=!!((q&&!c.dataset.s.includes(q))||(h&&c.dataset.c!==h)));
 $$('.none').forEach(n=>n.hidden=cards.some(c=>!c.hidden))}
if(cards.length){$$('[name=q]').forEach(i=>i.addEventListener('input',e=>{$$('[name=q]').forEach(o=>o.value=e.target.value);filt()}));
 const p=new URLSearchParams(location.search).get('q');if(p)$$('[name=q]').forEach(i=>i.value=p);addEventListener('hashchange',filt);filt()}
// tools
const U={Length:{mm:.001,cm:.01,m:1,km:1e3,inch:.0254,foot:.3048,yard:.9144,mile:1609.344},Weight:{mg:1e-6,g:.001,kg:1,ounce:.028349523,pound:.45359237},Volume:{ml:.001,l:1,'US cup':.2365882365,'US gallon':3.785411784},Temperature:{C:1,F:1,K:1}};
const T={
words:o=>{const t=o.t,n=t.trim()?t.trim().split(/\s+/).length:0;return `Words: ${n}\nCharacters: ${t.length}\nSentences: ${(t.match(/[.!?]+(\s|$)/g)||[]).length}\nParagraphs: ${t.split(/\n\s*\n/).filter(x=>x.trim()).length}\nReading time: ${Math.ceil(n/230)} min`},
chars:o=>{const t=o.t;return `With spaces: ${[...t].length}\nWithout spaces: ${[...t.replace(/\s/g,'')].length}\nLetters: ${(t.match(/\p{L}/gu)||[]).length}\nDigits: ${(t.match(/\d/g)||[]).length}\nLines: ${t.split('\n').length}`},
case:o=>{const t=o.t,w=t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);return{upper:t.toUpperCase(),lower:t.toLowerCase(),title:t.toLowerCase().replace(/(^|\s)\p{L}/gu,x=>x.toUpperCase()),sentence:t.toLowerCase().replace(/(^\s*|[.!?]\s+)\p{L}/gu,x=>x.toUpperCase()),camel:w.map((x,i)=>i?x[0].toUpperCase()+x.slice(1):x).join(''),snake:w.join('_'),kebab:w.join('-')}[o.m]},
summarize:o=>{const s=o.t.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g)||[],K=x=>x.toLowerCase().match(/\p{L}{4,}/gu)||[],f={};K(o.t).forEach(w=>f[w]=(f[w]||0)+1);
 return s.map((x,i)=>[i,K(x).reduce((a,w)=>a+f[w],0)/Math.sqrt(x.split(' ').length)]).sort((a,b)=>b[1]-a[1]).slice(0,+o.n).map(x=>x[0]).sort((a,b)=>a-b).map(i=>s[i].trim()).join(' ')},
prompt:o=>`Act as an expert assistant.\n\nTask: ${o.task||'[describe your task]'}\nAudience: ${o.aud||'general readers'}\nTone: ${o.tone}\nFormat: ${o.fmt}\n${o.x?'Extra context: '+o.x+'\n':''}\nInstructions:\n- Ask one clarifying question first if anything is unclear.\n- Be accurate and say when you are unsure.\n- End with a short summary of the key points.`,
json:o=>{try{return JSON.stringify(JSON.parse(o.t),null,o.m=='min'?0:+o.m)}catch(e){return 'Invalid JSON: '+e.message}},
unit:o=>{const v=+o.v,c=o.c;if(o.v===''||isNaN(v))return'';let r;if(c=='Temperature'){const k=o.a=='C'?v:o.a=='F'?(v-32)*5/9:v-273.15;r=o.b=='C'?k:o.b=='F'?k*9/5+32:k+273.15}else r=v*U[c][o.a]/U[c][o.b];return `${v} ${o.a} = ${+r.toPrecision(8)} ${o.b}`}};
function pdf(t){const L=[];t.replace(/[^\x20-\x7e\n]/g,'?').split('\n').forEach(l=>{while(l.length>90){L.push(l.slice(0,90));l=l.slice(90)}L.push(l)});
 const P=[];for(let i=0;i<L.length;i+=52)P.push(L.slice(i,i+52));if(!P.length)P.push([]);const e=s=>s.replace(/[\\()]/g,'\\$&'),b=[];
 b[1]='<</Type/Catalog/Pages 2 0 R>>';b[2]=`<</Type/Pages/Kids[${P.map((_,i)=>4+2*i+' 0 R').join(' ')}]/Count ${P.length}>>`;b[3]='<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>';
 P.forEach((p,i)=>{const c='BT/F1 11 Tf 14 TL 50 810 Td '+p.map(l=>`(${e(l)})'`).join('\n')+' ET';b[4+2*i]=`<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 3 0 R>>>>/Contents ${5+2*i} 0 R>>`;b[5+2*i]=`<</Length ${c.length}>>\nstream\n${c}\nendstream`});
 let s='%PDF-1.4\n';const x=[];for(let i=1;i<b.length;i++){x[i]=s.length;s+=`${i} 0 obj\n${b[i]}\nendobj\n`}
 const r=s.length;s+=`xref\n0 ${b.length}\n0000000000 65535 f \n`+x.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<</Size ${b.length}/Root 1 0 R>>\nstartxref\n${r}\n%%EOF`;return new Blob([s],{type:'application/pdf'})}
const save=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4e3)};
let last;
async function img(el,o){const f=$('[name=f]',el).files[0];if(!f){o.textContent='';return}
 const bm=await createImageBitmap(f),g=n=>+($(`[name=${n}]`,el)?.value)||0;let W=g('w'),H=g('h');
 if(W&&!H)H=Math.round(bm.height*W/bm.width);else if(H&&!W)W=Math.round(bm.width*H/bm.height);else if(!W){W=bm.width;H=bm.height}
 W=Math.min(W,8000);H=Math.min(H,8000);const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),fm=$('[name=fmt]',el).value;
 if(fm=='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,W,H)}x.drawImage(bm,0,0,W,H);
 c.toBlob(bl=>{if(!bl){o.textContent='This browser cannot create that format. Try JPG or PNG.';return}
  const k=n=>(n/1024).toFixed(1)+' KB',d=$('#d',el),p=$('#p',el);if(last)URL.revokeObjectURL(last);last=URL.createObjectURL(bl);
  o.textContent=`Original: ${k(f.size)} (${bm.width} x ${bm.height})\nResult: ${k(bl.size)} (${W} x ${H})`;p.src=last;p.hidden=false;d.href=last;d.download=f.name.replace(/\.\w+$/,'')+'.'+fm.split('/')[1].replace('jpeg','jpg');d.hidden=false},fm,(g('q')||75)/100)}
$$('.tool').forEach(el=>{const fn=el.dataset.fn,o=$('output',el),vals=()=>Object.fromEntries($$('[name]',el).map(i=>[i.name,i.value]));
 if(fn=='unit'){const c=$('[name=c]',el),fill=()=>{const k=Object.keys(U[c.value]).map(u=>`<option>${u}</option>`).join('');$('[name=a]',el).innerHTML=k;$('[name=b]',el).innerHTML=k;$('[name=b]',el).selectedIndex=1}
  fill();c.addEventListener('change',()=>{fill();run()})}
 const run=()=>{if(fn=='img')return img(el,o).catch(()=>o.textContent='Could not read this file as an image.');const v=vals();o.textContent=('t' in v&&!v.t.trim())?'':T[fn](v)};
 el.addEventListener('input',run);el.addEventListener('change',run);run();
 el.addEventListener('click',e=>{const a=e.target.dataset.a;if(a=='copy')navigator.clipboard?.writeText(o.textContent).then(()=>{e.target.textContent='Copied';setTimeout(()=>e.target.textContent='Copy',1500)});
  if(a=='dl'){fn=='pdf'?save(pdf(vals().t),'document.pdf'):save(new Blob([o.textContent],{type:'text/plain'}),'result.'+(el.dataset.ext||'txt'))}
  if(a=='reset'){$$('[name]',el).forEach(i=>{if(i.tagName=='SELECT')return;i.type=='file'?i.value='':i.value=i.defaultValue});o.textContent='';const d=$('#d',el),p=$('#p',el);if(d){d.hidden=true;p.hidden=true}run()}})});
})();