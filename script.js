const canvas = document.getElementById('background-canvas') || document.createElement('canvas');
if (!canvas.parentElement) {
    canvas.id = 'background-canvas';
    document.body.prepend(canvas);
}
const ctx = canvas.getContext('2d');

const mouse = { x: null, y: null };
const nodes = [];
const nodeCount = 40;
const maxConnectionDistance = 140;
const scanner = { y: 0, speed: 0.95 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

class Node {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.24;
        this.vy = (Math.random() - 0.5) * 0.24;
        this.size = Math.random() * 1.5 + 0.75;
        this.baseOpacity = 0.04 + Math.random() * 0.05;
        this.opacity = this.baseOpacity;
        this.glow = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 140) {
                this.vx += dx * 0.00035;
                this.vy += dy * 0.00035;
                this.opacity = Math.min(0.15, this.opacity + 0.02);
            }
        }

        const scanDistance = Math.abs(this.y - scanner.y);
        if (scanDistance < 14) {
            this.glow = 1;
            this.opacity = Math.min(0.15, this.opacity + 0.06);
        }

        this.glow = Math.max(0, this.glow - 0.04);
        this.opacity = Math.max(this.baseOpacity, Math.min(0.15, this.opacity - 0.001));
    }

    draw() {
        ctx.save();
        if (this.glow > 0) {
            ctx.shadowColor = '#00f2ff';
            ctx.shadowBlur = 12 * this.glow;
            ctx.globalAlpha = 0.18 + 0.32 * this.glow;
        } else {
            ctx.globalAlpha = this.opacity;
        }
        ctx.fillStyle = '#00f2ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createNodes() {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }
}

function drawConnections() {
    ctx.save();
    ctx.strokeStyle = '#00f2ff';
    ctx.lineWidth = 0.7;
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < maxConnectionDistance) {
                ctx.globalAlpha = 0.05 * (1 - distance / maxConnectionDistance);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }
    ctx.restore();
}

function drawScanner() {
    ctx.save();
    ctx.strokeStyle = '#00f2ff';
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.12;
    ctx.shadowColor = 'rgba(0, 242, 255, 0.18)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(0, scanner.y);
    ctx.lineTo(canvas.width, scanner.y);
    ctx.stroke();
    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    nodes.forEach((node) => {
        node.update();
        node.draw();
    });

    drawScanner();

    scanner.y += scanner.speed;
    if (scanner.y > canvas.height + 10) {
        scanner.y = -10;
    }

    requestAnimationFrame(animate);
}

createNodes();
animate();
