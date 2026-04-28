// ── COSMIC BACKGROUND ──
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, stars = [], sparkles = [], moon = {}, planet = {};

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
}

function initObjects() {
    resize();

    // Stars
    stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        o: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005,
        type: Math.random() > 0.85 ? 'cross' : 'dot'
    }));

    // Blue sparkle drifters
    sparkles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.0 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.15,
    }));

    // Moon — top right
    moon = { x: W * 0.82, y: H * 0.06, r: 38 };

    // Golden ringed planet — top left
    planet = { x: W * 0.14, y: H * 0.11, r: 14 };
}

function drawCross(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#c8dff0';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
    ctx.stroke();
    ctx.lineWidth = 0.4;
    ctx.globalAlpha = alpha * 0.4;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.6, y - size * 0.6); ctx.lineTo(x + size * 0.6, y + size * 0.6);
    ctx.moveTo(x + size * 0.6, y - size * 0.6); ctx.lineTo(x - size * 0.6, y + size * 0.6);
    ctx.stroke();
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, W, H);

    // Moon
    const mg = ctx.createRadialGradient(moon.x - moon.r * 0.3, moon.y - moon.r * 0.3, moon.r * 0.1, moon.x, moon.y, moon.r);
    mg.addColorStop(0, 'rgba(220,235,255,0.95)');
    mg.addColorStop(0.5, 'rgba(180,210,240,0.75)');
    mg.addColorStop(1, 'rgba(100,160,210,0)');
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
    ctx.fillStyle = mg;
    ctx.fill();
    const mh = ctx.createRadialGradient(moon.x, moon.y, moon.r * 0.8, moon.x, moon.y, moon.r * 2.5);
    mh.addColorStop(0, 'rgba(58,100,140,0.18)');
    mh.addColorStop(1, 'rgba(58,100,140,0)');
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = mh;
    ctx.fill();

    // Golden planet
    const pg = ctx.createRadialGradient(planet.x - planet.r * 0.3, planet.y - planet.r * 0.3, planet.r * 0.1, planet.x, planet.y, planet.r);
    pg.addColorStop(0, 'rgba(255,220,120,0.95)');
    pg.addColorStop(0.5, 'rgba(201,169,110,0.85)');
    pg.addColorStop(1, 'rgba(140,100,40,0)');
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
    ctx.fillStyle = pg;
    ctx.fill();
    const ph = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.r * 3);
    ph.addColorStop(0, 'rgba(201,169,110,0.25)');
    ph.addColorStop(1, 'rgba(201,169,110,0)');
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = ph;
    ctx.fill();
    // Planet ring
    ctx.save();
    ctx.translate(planet.x, planet.y);
    ctx.rotate(-0.35);
    ctx.scale(1, 0.28);
    ctx.beginPath();
    ctx.arc(0, 0, planet.r * 1.9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,169,110,0.45)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    // Stars
    stars.forEach(s => {
        s.pulse += s.speed;
        const alpha = (Math.sin(s.pulse) * 0.35 + 0.65) * s.o;
        if (s.type === 'cross') {
            drawCross(s.x, s.y, s.r * 2.5, alpha);
        } else {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,220,245,${alpha})`;
            ctx.fill();
        }
    });

    // Blue sparkle drifters
    sparkles.forEach(p => {
        p.pulse += 0.03;
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const alpha = (Math.sin(p.pulse) * 0.4 + 0.5) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58,100,140,${alpha})`;
        ctx.fill();
        if (p.r > 0.9) drawCross(p.x, p.y, p.r * 2, alpha * 0.5);
    });

    requestAnimationFrame(draw);
}

initObjects();
draw();
window.addEventListener('resize', initObjects);

// ── QUOTE TICKER (homepage only) ──
const ticker = document.getElementById('ticker');
if (ticker) {
    const quotes = [
        '"Blue hours: the in-between time when the day forgets to end."',
        '"Everything goes." — Kim Namjoon',
        '"Your eyes are the doorway of your soul."',
        '"He was the mirror of my soul, who awakened me."',
        '"Words have weights and consequences."',
        '"Your mind is a whole another planet,',
        'let\'s go for a tour."'

    ];
    let qi = 0;
    setInterval(() => {
        qi = (qi + 1) % quotes.length;
        ticker.style.opacity = 0;
        setTimeout(() => {
            ticker.textContent = quotes[qi];
            ticker.style.transition = 'opacity 0.8s';
            ticker.style.opacity = 1;
        }, 400);
    }, 5000);
}
