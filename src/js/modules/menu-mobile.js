
import gsap from "gsap";

export default class MenuMobile {
  constructor(logoMobile, menuButton, menuList, events) {
    this.logoMobile = document.querySelector(logoMobile);
    this.menuButton = document.querySelector(menuButton);
    this.menuList = document.querySelector(menuList);
    this.navigation = document.querySelector('.navigation'); // Novo seletor
    this.activeClass = "active";
    this.events = events || ["click"];
    this.menuOpened = false;
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  isMobile() {
    return window.innerWidth <= 800;
  }

  openMenu(event) {
    if (this.isMobile()) {
      event.stopPropagation();
      if (this.menuOpened) {
        this.closeMenu();
      } else {
        this.menuOpened = true;
        this.logoMobile.classList.add(this.activeClass);
        this.menuList.classList.add(this.activeClass);
        this.navigation.classList.add(this.activeClass); // Alterado
        this.menuButton.classList.add(this.activeClass);
        this.animateMenuItems();
        this.toggleMenuAnimation(true);
        document.body.classList.add('no-scroll');
      }
    }
  }

  closeMenu() {
    if (this.isMobile()) {
      this.menuOpened = false;
      this.logoMobile.classList.remove(this.activeClass);
      this.menuList.classList.remove(this.activeClass);
      this.navigation.classList.remove(this.activeClass); // Alterado
      this.menuButton.classList.remove(this.activeClass);
      this.toggleMenuAnimation(false);
      document.body.classList.remove('no-scroll');
    }
  }

  addMenuMobileEvents() {
    this.menuButton.addEventListener('click', this.openMenu);
    this.menuList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        this.closeMenu();
      }
    });
  }

  addLinkClickEvents() {
    const links = this.menuList.querySelectorAll('a');
    links.forEach(link => this.addLinkEventListener(link));

    const highlightLink = document.querySelector('.sublinhado');
    if (highlightLink) {
      this.addLinkEventListener(highlightLink);
    }
  }

  addLinkEventListener(link) {
    link.addEventListener('click', () => {
      if (this.isMobile()) {
        this.closeMenu();
      }
    });
  }

  animateMenuItems() {
    // Animar o logo primeiro - SEM clearProps para não remover a opacidade final
    gsap.fromTo(this.logoMobile,
      { opacity: 0, y: -20 },
      {
        opacity: 1, y: 0, duration: 0.4, ease: "power1.out"
        // Removido onComplete com clearProps
      }
    );
  
    // Animar o menu-projetos em segundo
    const menuProjetos = document.querySelector('#menu-projetos');
    if (menuProjetos) {
      gsap.fromTo(menuProjetos,
        { opacity: 0, y: -15 },
        {
          opacity: 1, y: 0, duration: 0.4, ease: "power1.out", delay: 0.2,
          onComplete: () => gsap.set(menuProjetos, { clearProps: "all" })
        }
      );
    }
  
    // Animar os itens do menu institucional por último em cascata
    const menuInstitucional = document.querySelectorAll('.menu-institutional li');
    menuInstitucional.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.4, ease: "power1.out", 
          delay: 0.4 + index * 0.1,
          onComplete: () => gsap.set(item, { clearProps: "all" })
        }
      );
    });
  }

  toggleMenuAnimation(show) {
    const menuList = document.querySelector('.js [data-menu="list-projetos"]');
    if (show) {
      gsap.to(menuList, {
        duration: 0.5,
        opacity: 1,
        visibility: 'visible',
        ease: 'power1.inOut',
        onStart: () => menuList.style.display = 'flex'
      });
    } else {
      gsap.to(menuList, {
        duration: 0.5,
        opacity: 0,
        visibility: 'hidden',
        ease: 'power1.inOut',
        onComplete: () => menuList.style.display = 'none'
      });
    }
  }

  init() {
    if (this.logoMobile && this.menuButton && this.menuList) {
      this.addMenuMobileEvents();
      this.addLinkClickEvents();
    }
    return this;
  }
}