document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // TYPEWRITER EFFECT
    // =========================
    const el = document.querySelector(".typewriter");

    const texts = [
        "Perito Judicial com atuação no TJSP e suporte técnico em litígios complexos",
        "Especialista em Computação Forense e reconstrução de evidências digitais",
        "Atuação avançada em Segurança Cibernética e resposta a incidentes",
        "Análise de Cadeia de Custódia com conformidade legal e integridade probatória",
        "Investigação de logs, correlação de eventos e rastreabilidade digital",
        "Produção de laudos técnicos com validade jurídica e rigor metodológico",
        "Atuação em perícia digital aplicada a fraudes, vazamentos e crimes cibernéticos",
        "Pesquisa aplicada em tecnologias emergentes e computação quântica",
        "Análise forense em dispositivos, redes e ambientes corporativos",
        "Suporte técnico para advogados em estratégias probatórias digitais"
    ];

    let textIndex = 0;
    let charIndex = 0;

    function type() {
        if (!el) return;

        if (charIndex < texts[textIndex].length) {
            el.innerHTML += texts[textIndex][charIndex];
            charIndex++;
            setTimeout(type, 45);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (!el) return;

        if (charIndex > 0) {
            el.innerHTML = texts[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 25);
        } else {
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        }
    }

    if (el) {
        type();
    }

    // =========================
    // SWIPER CARROSSEL
    // =========================
    if (typeof Swiper !== "undefined") {
        new Swiper(".image-swiper", {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            spaceBetween: 30,
            slidesPerView: 1,
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            },
            speed: 800,
            grabCursor: true
        });
    } else {
        console.warn("Swiper não carregado");
    }

    // =========================
    // CANVAS MATRIX EFFECT
    // =========================
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const binaryChars = "01";
    const fontSize = 14;

    let columns = 0;
    let drops = [];
    let interval = null;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initDrops() {
        if (!canvas) return;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }

    function drawMatrix() {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(5, 11, 20, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00e0ff";
        ctx.font = `${fontSize}px monospace`;
        ctx.globalAlpha = 0.3;

        for (let i = 0; i < drops.length; i++) {
            const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }

        ctx.globalAlpha = 1;
    }

    if (canvas && ctx) {
        resizeCanvas();
        initDrops();

        interval = setInterval(drawMatrix, 100);

        window.addEventListener("resize", () => {
            resizeCanvas();
            initDrops();

            clearInterval(interval);
            interval = setInterval(drawMatrix, 100);
        });
    }

});
