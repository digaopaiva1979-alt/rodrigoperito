const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

const hexChars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
const columns = [];
const scanner = { y: 0, speed: 0.75, width: 2 };
const columnCountTarget = 40;

function randomHexGroup() {
    return Array.from({ length: 4 }, () => hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)]).join(' ');
}

function createColumns() {
    columns.length = 0;
    const columnSpacing = Math.max(100, window.innerWidth / columnCountTarget);
    for (let i = 0; i < Math.ceil(window.innerWidth / columnSpacing) + 2; i += 1) {
        const x = i * columnSpacing + columnSpacing / 2;
        const speed = 0.25 + Math.random() * 0.18;
        const offset = Math.random() * window.innerHeight;
        const groupCount = Math.ceil(window.innerHeight / 42) + 4;
        const values = Array.from({ length: groupCount }, randomHexGroup);
        columns.push({ x, y: offset, speed, values, spacing: 42, opacity: 0.03 });
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createColumns();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawBackground() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
}

function drawColumns() {
    columns.forEach((column) => {
        const softLineAlpha = 0.02;
        ctx.save();
        ctx.strokeStyle = `rgba(0, 242, 255, ${softLineAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(column.x, 0);
        ctx.lineTo(column.x, canvas.height);
        ctx.stroke();
        ctx.restore();

        for (let index = 0; index < column.values.length; index += 1) {
            const value = column.values[index];
            const y = (index * column.spacing + column.y) % (canvas.height + column.spacing) - column.spacing;
            const scanDistance = Math.abs(y - scanner.y);
            const isScanned = scanDistance < 18;
            ctx.fillStyle = isScanned ? 'rgba(0, 242, 255, 0.25)' : 'rgba(0, 242, 255, 0.03)';
            if (isScanned) {
                ctx.save();
                ctx.shadowColor = 'rgba(0, 242, 255, 0.35)';
                ctx.shadowBlur = 12;
                ctx.fillText(value, column.x, y);
                ctx.restore();
            } else {
                ctx.fillText(value, column.x, y);
            }
        }

        column.y += column.speed;
        if (column.y > column.spacing) {
            column.y -= column.spacing;
            column.values.shift();
            column.values.push(randomHexGroup());
        }
    });
}

function drawScanner() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
    ctx.lineWidth = scanner.width;
    ctx.shadowColor = 'rgba(0, 242, 255, 0.18)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(0, scanner.y);
    ctx.lineTo(canvas.width, scanner.y);
    ctx.stroke();
    ctx.restore();
}

function animate() {
    drawBackground();
    drawColumns();
    drawScanner();

    scanner.y += scanner.speed;
    if (scanner.y > canvas.height + 14) {
        scanner.y = -14;
    }
    requestAnimationFrame(animate);
}

animate();
