document.addEventListener("DOMContentLoaded", () => {

    /* TYPEWRITER */
    const el = document.querySelector(".typewriter");

    const texts = [
        "Perícia digital e análise forense",
        "Cadeia de custódia e integridade de provas",
        "Suporte técnico à Justiça",
        "Investigação de evidências digitais"
    ];

    let i = 0, j = 0;

    const type = () => {
        if (!el) return;

        el.textContent += texts[i][j];
        j++;

        if (j < texts[i].length) {
            setTimeout(type, 40);
        } else {
            setTimeout(erase, 1500);
        }
    };

    const erase = () => {
        if (!el) return;

        el.textContent = texts[i].substring(0, j--);

        if (j > 0) {
            setTimeout(erase, 20);
        } else {
            i = (i + 1) % texts.length;
            setTimeout(type, 400);
        }
    };

    type();

    /* SWIPER */
    new Swiper(".image-swiper", {
        loop: true,
        autoplay: { delay: 3500 },
        navigation: true,
        pagination: { clickable: true },
        slidesPerView: 1,
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

    /* BACK TO TOP */
    const btn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 300 ? "flex" : "none";
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

});
