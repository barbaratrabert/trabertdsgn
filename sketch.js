/* -------------------------- */
/* 1. NAVBAR SCROLL EFFECT    */
/* -------------------------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
});

/* -------------------------- */
/* 2. SMOOTH SCROLL           */
/* -------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    });
});

/* -------------------------- */
/* 3. HERO BACKGROUND IMAGE   */
/* -------------------------- */
/* 3. HERO BACKGROUND IMAGE (Con protección) */
const hero = document.querySelector('.hero');

// Solo ejecutamos esto si la sección .hero existe en esta página
if (hero) {
    const img = new Image();
    img.onload = function() {
        hero.style.backgroundImage = `url(${this.src})`;
    };
    // Cambia la ruta aquí → PNG, WebP, JPG
    img.src = 'https://trabertdsgn.cl/img2/flores-fondo.webp';
}
// Animación que ocurre solo una vez
const animatedElements = document.querySelectorAll(".fade-up");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // <-- deja de observarlo = más liviano
        }
    });
}, { threshold: 0.15 });

animatedElements.forEach(el => observer.observe(el));


