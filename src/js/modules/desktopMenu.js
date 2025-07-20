import gsap from "gsap";

export default class DesktopMenu {
  constructor() {
    this.menuButton = document.querySelector('[data-menu="button-menu"]');
    this.hamburger = document.getElementById('hamburguer');
    this.institutionalNav = document.querySelector('.institutional-nav');
    this.institutionalMenu = document.querySelector('.menu-institutional');
    this.header = document.querySelector('.header');
    this.menuActive = false;
    this.tl = gsap.timeline({ paused: true });

    this.init();
    this.setupAnimations();
  }

  init() {
    if (window.innerWidth <= 768) return;

    this.menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    document.addEventListener('click', this.closeOnClickOutside.bind(this));
    document.addEventListener('keydown', this.closeOnEsc.bind(this));
  }

  setupAnimations() {
    // Animação do hamburger para "X"
    this.tl
      .to(this.hamburger, { 
        duration: 0.2,
        rotate: 45,
        backgroundColor: 'var(--cor-destaque)'
      }, 0)
      .to(this.hamburger, { 
        duration: 0.2,
        rotate: -45,
      }, 0.2)

      // Overlay e menu
      .to(this.header, {
        duration: 0.3,
        backgroundColor: 'rgba(0,0,0,0.8)',
        ease: 'power2.out'
      }, 0)
      .to(this.institutionalNav, {
        duration: 0.4,
        opacity: 1,
        visibility: 'visible',
        ease: 'power3.out'
      }, 0.2)
      .from(this.institutionalMenu.children, {
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, 0.3);
  }

  toggleMenu(forceState) {
    this.menuActive = forceState !== undefined ? forceState : !this.menuActive;

    if (this.menuActive) {
      this.header.classList.add('menu-active');
      this.menuButton.setAttribute('aria-expanded', 'true');
      this.tl.play();
      
      // Foco acessível
      gsap.delayedCall(0.5, () => {
        const firstItem = this.institutionalMenu.querySelector('a');
        if (firstItem) firstItem.focus();
      });
    } else {
      this.header.classList.remove('menu-active');
      this.menuButton.setAttribute('aria-expanded', 'false');
      this.tl.reverse();
    }
  }

  closeOnClickOutside(e) {
    if (!this.menuActive) return;
    
    const isButton = e.target === this.menuButton || this.menuButton.contains(e.target);
    const isMenu = e.target.closest('.institutional-nav');

    if (!isButton && !isMenu) {
      this.toggleMenu(false);
    }
  }

  closeOnEsc(e) {
    if (e.key === 'Escape' && this.menuActive) {
      this.toggleMenu(false);
    }
  }
}