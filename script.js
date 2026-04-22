document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       STATE CORE (controle central)
    ========================================================= */
    const state = {
        typewriterIndex: 0,
        charIndex: 0,
        matrixFrame: null,
        matrixRunning: true
    };


    /* =========================================================
       TYPEWRITER ENGINE (determinístico)
    ========================================================= */
    const typewriterEl = document.querySelector(".typewriter");

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

    function typewriterTick() {
        if (!typewriterEl) return;

        const text = texts[state.typewriterIndex];

        if (state.charIndex < text.length) {
            typewriterEl.textContent += text[state.charIndex++];
            setTimeout(typewriterTick, 40);
        } else {
            setTimeout(typewriterErase, 1800);
        }
    }

    function typewriterErase() {
        if (!typewriterEl) return;

        const text = texts[state.typewriterIndex];

        if (state.charIndex > 0) {
            typewriterEl.textContent = text.substring(0, --state.charIndex);
            setTimeout(typewriterErase, 20);
        } else {
            state.typewriterIndex = (state.typewriterIndex + 1) % texts.length;
            setTimeout(typewriterTick, 400);
        }
    }

    if (typewriterEl) typewriterTick();


    /* =========================================================
       SWIPER (safe init)
    ========================================================= */
    function initSwiper() {
        if (typeof Swiper === "undefined") return;

        const el = document.querySelector(".image-swiper");
        if (!el) return;

        new Swiper(el, {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
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
            speed: 800
        });
    }

    initSwiper();


    /* =========================================================
       MATRIX ENGINE (requestAnimationFrame - nível produção)
    ========================================================= */
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas?.getContext("2d");

    const chars = "01";
    const fontSize = 14;

    let columns = 0;
    let drops = [];
    let lastTime = 0;
    const fps = 12;
    const interval = 1000 / fps;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }

    function drawMatrix() {
        if (!ctx || !canvas) return;

        ctx.fillStyle = "rgba(5, 11, 20, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00e0ff";
        ctx.font = `${fontSize}px monospace`;
        ctx.globalAlpha = 0.25;

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }

        ctx.globalAlpha = 1;
    }

    function matrixLoop(timestamp) {
        if (!state.matrixRunning) return;

        if (timestamp - lastTime > interval) {
            drawMatrix();
            lastTime = timestamp;
        }

        requestAnimationFrame(matrixLoop);
    }

    function startMatrix() {
        if (!canvas || !ctx) return;

        resizeCanvas();
        requestAnimationFrame(matrixLoop);
    }

    startMatrix();


    /* =========================================================
       RESIZE HANDLER (debounce técnico)
    ========================================================= */
    let resizeTimeout;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            resizeCanvas();
        }, 150);
    });


    /* =========================================================
       BACK TO TOP (UX limpo)
    ========================================================= */
    const btn = document.getElementById("backToTop");

    if (btn) {
        window.addEventListener("scroll", () => {
            const visible = window.scrollY > 250;
            btn.style.display = visible ? "flex" : "none";
        });

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

});
