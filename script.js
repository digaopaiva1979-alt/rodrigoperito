const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

const hexChars = '0123456789ABCDEF';
const columns = [];
const columnCountTarget = 40;
const scanner = { y: 0, speed: 0.75, width: 2 };

function randomHexGroup() {
  return Array.from({length:4}, ()=>hexChars[Math.floor(Math.random()*16)]+hexChars[Math.floor(Math.random()*16)]).join(' ');
}

function createColumns(){
  columns.length=0;
  const columnSpacing = Math.max(100, window.innerWidth/columnCountTarget);
  for(let i=0;i<Math.ceil(window.innerWidth/columnSpacing)+2;i++){
    const x=i*columnSpacing+columnSpacing/2;
    const speed=0.25+Math.random()*0.18;
    const offset=Math.random()*window.innerHeight;
    const groupCount=Math.ceil(window.innerHeight/42)+4;
    const values=Array.from({length:groupCount},randomHexGroup);
    columns.push({x,y:offset,speed,values,spacing:42,opacity:0.03});
  }
}

function resizeCanvas(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  createColumns();
}

window.addEventListener('resize',resizeCanvas);
resizeCanvas();

function drawBackground(){
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.font='13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  ctx.textBaseline='top';
  ctx.textAlign='left';
}

function drawColumns(){
  columns.forEach(col=>{
    ctx.save();
    ctx.strokeStyle='rgba(0,242,255,0.02)';
    ctx.lineWidth=0.6;
    ctx.beginPath();
    ctx.moveTo(col.x,0);
    ctx.lineTo(col.x,canvas.height);
    ctx.stroke();
    ctx.restore();

    col.values.forEach((val,i)=>{
      const y=(i*col.spacing+col.y)%(canvas.height+col.spacing)-col.spacing;
      const scanDistance=Math.abs(y-scanner.y);
      const isScanned = scanDistance<18;
      ctx.fillStyle = isScanned ? 'rgba(0,242,255,0.25)' : 'rgba(0,242,255,0.03)';
      if(isScanned){
        ctx.save();
        ctx.shadowColor='rgba(0,242,255,0.35)';
        ctx.shadowBlur=12;
        ctx.fillText(val,col.x,y);
        ctx.restore();
      } else ctx.fillText(val,col.x,y);
    });
    col.y+=col.speed;
    if(col.y>col.spacing){
      col.y-=col.spacing;
      col.values.shift();
      col.values.push(randomHexGroup());
    }
  });
}

function drawScanner(){
  ctx.save();
  ctx.strokeStyle='rgba(0,242,255,0.1)';
  ctx.lineWidth=scanner.width;
  ctx.shadowColor='rgba(0,242,255,0.18)';
  ctx.shadowBlur=18;
  ctx.beginPath();
  ctx.moveTo(0,scanner.y);
  ctx.lineTo(canvas.width,scanner.y);
  ctx.stroke();
  ctx.restore();
}

function animate(){
  drawBackground();
  drawColumns();
  drawScanner();
  scanner.y+=scanner.speed;
  if(scanner.y>canvas.height+14) scanner.y=-14;
  requestAnimationFrame(animate);
}

animate();

// TYPEWRITER HERO
const phrases=[
  'Análise Forense Técnica',
  'Preservação da Cadeia de Custódia',
  'Investigação Cibernética Judicial',
  'Laudos Periciais com Validade Jurídica'
];

let currentPhrase=0, currentChar=0, isDeleting=false;
const el=document.querySelector('.typewriter');

function typeWriter(){
  const text=phrases[currentPhrase];
  currentChar=isDeleting?currentChar-1:currentChar+1;
  el.textContent=text.substring(0,currentChar);
  if(!isDeleting && currentChar===text.length){isDeleting=true;return setTimeout(typeWriter,2200);}
  if(isDeleting && currentChar===0){isDeleting=false; currentPhrase=(currentPhrase+1)%phrases.length; return setTimeout(typeWriter,600);}
  setTimeout(typeWriter,isDeleting?70:120);
}
typeWriter();
