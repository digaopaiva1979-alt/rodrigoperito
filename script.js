// script.js - Dynamic Canvas Background for Rodrigo A. Paiva Portfolio

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];
const nodeCount = 50; // Otimizado para performance
let scannerY = 0;
let mouse = { x: null, y: null };

class Node {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2; // Movimento lento
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.1 + 0.02; // 0.02 a 0.12
        this.scanned = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse attraction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                this.x += dx * 0.01;
                this.y += dy * 0.01;
                this.opacity = Math.min(this.opacity + 0.01, 0.15);
            } else {
                this.opacity = Math.max(this.opacity - 0.001, 0.02);
            }
        }

        // Scanner effect
        if (Math.abs(this.y - scannerY) < 5) {
            this.scanned = true;
            this.opacity = 0.15;
        } else if (this.scanned) {
            this.scanned = false;
            this.opacity = Math.max(this.opacity - 0.01, 0.02);
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#00f2ff';
        if (this.scanned) {
            ctx.shadowColor = '#00f2ff';
            ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize nodes
for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node());
}

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) { // Connection threshold
                ctx.save();
                ctx.globalAlpha = 0.05;
                ctx.strokeStyle = '#00f2ff';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

function drawScanner() {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#00f2ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, scannerY);
    ctx.lineTo(canvas.width, scannerY);
    ctx.stroke();
    ctx.restore();
}

function animate() {
    // Fundo preto
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update scanner
    scannerY += 2;
    if (scannerY > canvas.height) scannerY = 0;

    // Update and draw nodes
    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    // Draw connections
    drawConnections();

    // Draw scanner
    drawScanner();

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reinitialize nodes if needed, but for simplicity, just resize
});