// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll para anclas internas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load background image
const hero = document.querySelector('.hero');
const img = new Image();
img.onload = function() {
    hero.style.backgroundImage = `url(${this.src})`;
};
// Reemplaza esta URL con la ruta de tu imagen de flores
img.src = 'ruta-a-tu-imagen-de-flores.jpg';