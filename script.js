// TYPEWRITER
const phrases = [
  'Análise Forense Técnica',
  'Preservação da Cadeia de Custódia',
  'Investigação Cibernética Judicial',
  'Laudos Periciais com Validade Jurídica'
];
let currentPhrase = 0, currentChar = 0, isDeleting = false;
const el = document.querySelector('.typewriter');

function typeWriter() {
  const text = phrases[currentPhrase];
  currentChar = isDeleting ? currentChar - 1 : currentChar + 1;
  el.textContent = text.substring(0, currentChar);
  if (!isDeleting && currentChar === text.length) { isDeleting = true; return setTimeout(typeWriter, 2200); }
  if (isDeleting && currentChar === 0) { isDeleting=false; currentPhrase=(currentPhrase+1)%phrases.length; return setTimeout(typeWriter,600);}
  setTimeout(typeWriter, isDeleting?70:120);
}
typeWriter();

// -------------------- CANVAS AVANÇADO --------------------
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const hexChars = '0123456789ABCDEF'.split('');

function resizeCanvas() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener('resize',resizeCanvas);
resizeCanvas();

function randomHexGroup() { 
  return Array.from({length:4},()=>hexChars[Math.floor(Math.random()*16)]+hexChars[Math.floor(Math.random()*16)]).join(' '); 
}

// Inicializa partículas
function initParticles(count=120){
  particles=[]; 
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      speed:0.2+Math.random()*0.5,
      text: randomHexGroup(),
      spacing: 42
    });
  }
}
initParticles();

let scanY=0, scanSpeed=0.75;

// Função para desenhar linhas conectando partículas próximas
function drawConnections(maxDistance=120){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < maxDistance){
        const alpha = 0.08*(1 - dist/maxDistance);
        ctx.strokeStyle = `rgba(0,242,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Loop de animação
function animate(){
  ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.font='13px monospace';
  ctx.textBaseline='top';
  ctx.textAlign='left';

  // Partículas
  particles.forEach(p=>{
    const isScan=Math.abs(p.y-scanY)<18;
    ctx.fillStyle=isScan?'rgba(0,242,255,0.25)':'rgba(0,242,255,0.03)';
    if(isScan){ 
      ctx.save(); 
      ctx.shadowColor='rgba(0,242,255,0.35)'; 
      ctx.shadowBlur=12; 
      ctx.fillText(p.text,p.x,p.y); 
      ctx.restore(); 
    } else {
      ctx.fillText(p.text,p.x,p.y);
    }
    p.y+=p.speed; 
    if(p.y>canvas.height){ p.y=0; p.text=randomHexGroup(); }
  });

  // Conexões entre partículas
  drawConnections();

  // Scan line
  ctx.save(); 
  ctx.strokeStyle='rgba(0,242,255,0.1)'; 
  ctx.lineWidth=2; 
  ctx.shadowColor='rgba(0,242,255,0.18)'; 
  ctx.shadowBlur=18;
  ctx.beginPath(); 
  ctx.moveTo(0,scanY); 
  ctx.lineTo(canvas.width,scanY); 
  ctx.stroke(); 
  ctx.restore();

  scanY+=scanSpeed; 
  if(scanY>canvas.height+14) scanY=-14;

  requestAnimationFrame(animate);
}
animate();
