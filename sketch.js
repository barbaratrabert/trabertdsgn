
const CONFIG = {
    jsonURL: "https://api.myjson.online/v1/records/5df883c6-4a59-47b8-ba92-e2e340ed317a",
    allowedDomains: [
        'raw.githubusercontent.com',
        'github.com',
        'githubusercontent.com',
        'barbaratrabert.github.io',
        'i.imgur.com',
        'images.unsplash.com'
    ]
};


function sanitizeImageURL(url) {
    try {
        const urlObj = new URL(url);
        
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            console.warn('Protocolo no seguro:', urlObj.protocol);
            return null;
        }
        
        const isAllowed = CONFIG.allowedDomains.some(domain => 
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );
        
        if (!isAllowed) {
            console.warn('Dominio no permitido:', urlObj.hostname);
            return null;
        }
        
        return urlObj.href;
    } catch (e) {
        console.warn('URL inválida:', url);
        return null;
    }
}

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function createProjectCard(proyecto) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = proyecto.categoria ? proyecto.categoria.toLowerCase().replace(/\s/g, '-') : 'general';
    
    const sanitizedImageURL = sanitizeImageURL(proyecto.imagen);
    if (sanitizedImageURL) {
        const img = document.createElement('img');
        img.className = 'project-image';
        img.src = sanitizedImageURL;
        img.alt = escapeHTML(proyecto.titulo || 'Proyecto de diseño');
        img.loading = 'lazy'; 
        img.referrerPolicy = 'no-referrer'; 
        card.appendChild(img);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'project-image-placeholder';
        placeholder.style.cssText = 'width:100%;height:300px;background:#e0e0e0;display:flex;align-items:center;justify-content:center;';
        placeholder.textContent = 'Imagen no disponible';
        card.appendChild(placeholder);
    }
    
    const info = document.createElement('div');
    info.className = 'project-info';
    
    const category = document.createElement('div');
    category.className = 'project-category';
    category.textContent = escapeHTML(proyecto.categoria || 'General');
    info.appendChild(category);
    
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = escapeHTML(proyecto.titulo || 'Sin título');
    info.appendChild(title);
    
    card.appendChild(info);
    
    return card;
}


async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    
    if (!grid) {
        console.error('Grid de proyectos no encontrado');
        return;
    }
    
    grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:3rem;">Cargando proyectos...</p>';
    
    try {
        const apiURL = new URL(CONFIG.jsonURL);
        if (!['http:', 'https:'].includes(apiURL.protocol)) {
            throw new Error('Protocolo no seguro');
        }
        
        let response = await fetch(CONFIG.jsonURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'omit'
        });
        
        if (response.status === 429) {
            console.log('Rate limit alcanzado, reintentando en 2 segundos...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            response = await fetch(CONFIG.jsonURL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'omit'
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        let proyectos;
        if (resultado.data && Array.isArray(resultado.data)) {
            proyectos = resultado.data; // myjson.online
        } else if (Array.isArray(resultado)) {
            proyectos = resultado; // JSON directo
        } else {
            throw new Error('Formato de datos inválido');
        }
        
        if (proyectos.length === 0) {
            grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:3rem;">No hay proyectos disponibles</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        const MAX_PROJECTS = 50;
        const proyectosLimitados = proyectos.slice(0, MAX_PROJECTS);
        
        const fragment = document.createDocumentFragment();
        
        proyectosLimitados.forEach(proyecto => {
            if (proyecto && typeof proyecto === 'object') {
                const card = createProjectCard(proyecto);
                fragment.appendChild(card);
            }
        });
        
        grid.appendChild(fragment);
        
        console.log(`${proyectosLimitados.length} proyectos cargados exitosamente`);
        
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'grid-column:1/-1;text-align:center;padding:3rem;';
        errorDiv.innerHTML = '<p>No se pudieron cargar los proyectos en este momento.</p><p style="margin-top:1rem;"><button onclick="loadProjects()" style="padding:0.75rem 1.5rem;background:#2a2a2a;color:white;border:none;border-radius:50px;cursor:pointer;">Reintentar</button></p>';
        grid.innerHTML = '';
        grid.appendChild(errorDiv);
    }
}


function handleActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => observer.observe(section));
}


function handleHeaderScroll() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}


function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}


function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}


function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('.about-preview, .services-section, .cta-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}



function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log('Inicializando portafolio...');
    
    loadProjects();
    
    handleActiveNav();
    handleHeaderScroll();
    setupMobileMenu();
    setupScrollAnimations();
    setupSmoothScroll();
    
    setTimeout(() => {
        setupFilters();
    }, 1000);
    
    console.log('Portafolio inicializado correctamente');
}

window.loadProjects = loadProjects;