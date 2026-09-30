(()=>{const t=document.getElementById('qt');if(!t)return;
const c=document.getElementById('qc'),m=document.getElementById('qm'),d=document.getElementById('qd'),s=document.getElementById('qs'),l=document.getElementById('ql');
function draw(){const v=t.value;if(!v){c.hidden=true;d.hidden=true;m.textContent='';return}
let q;try{q=new QRCodeLib(-1,+l.value);q.addData(unescape(encodeURIComponent(v)));q.make()}catch(e){c.hidden=true;d.hidden=true;m.textContent='This text is too long for a QR code. Shorten it or lower the error correction.';return}
const n=q.getModuleCount(),S=+s.value,z=Math.floor(S/(n+8)),W=z*(n+8);c.width=c.height=W;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,W);x.fillStyle='#000';
for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))x.fillRect((k+4)*z,(r+4)*z,z,z);
c.hidden=false;m.textContent='';c.toBlob(b=>{if(d.href.startsWith('blob:'))URL.revokeObjectURL(d.href);d.href=URL.createObjectURL(b);d.hidden=false})}
t.addEventListener('input',draw);s.addEventListener('change',draw);l.addEventListener('change',draw);
document.getElementById('qr').addEventListener('click',()=>{t.value='';draw();t.focus()})})();
