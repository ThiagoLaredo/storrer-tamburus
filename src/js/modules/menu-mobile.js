
import gsap from "gsap";

export default class MenuMobile {
  constructor(logoMobile, menuButton, menuList, contatoMobile, whatsappMobile, linkedinMobile, instagramMobile, headerAcoes, events) {
    this.logoMobile = document.querySelector(logoMobile);
    this.menuButton = document.querySelector(menuButton);
    this.menuList = document.querySelector(menuList);
    this.contatoMobile = document.querySelector(contatoMobile);
    this.whatsappMobile = document.querySelector(whatsappMobile);
    this.linkedinMobile = document.querySelector(linkedinMobile);
    this.instagramMobile = document.querySelector(instagramMobile);
    this.headerAcoes = document.querySelector(headerAcoes); // Novo seletor
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
        this.menuList.classList.add(this.activeClass);
        this.menuButton.classList.add(this.activeClass);
        this.contatoMobile.classList.add(this.activeClass);
        this.whatsappMobile.classList.add(this.activeClass);
        this.linkedinMobile.classList.add(this.activeClass);
        this.instagramMobile.classList.add(this.activeClass);
        if (this.headerAcoes) this.headerAcoes.classList.add(this.activeClass); // Adiciona classe aos botões
        this.animateMenuItems();
        this.toggleMenuAnimation(true);
        document.body.classList.add('no-scroll');
      }
    }
  }

  closeMenu() {
    if (this.isMobile()) {
      this.menuOpened = false;
      this.menuList.classList.remove(this.activeClass);
      this.menuButton.classList.remove(this.activeClass);
      this.contatoMobile.classList.remove(this.activeClass);
      this.whatsappMobile.classList.remove(this.activeClass);
      this.linkedinMobile.classList.remove(this.activeClass);
      this.instagramMobile.classList.remove(this.activeClass);
      if (this.headerAcoes) this.headerAcoes.classList.remove(this.activeClass); // Remove classe dos botões
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
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: "power1.out", delay: 0.1 + index * 0.1,
          onComplete: () => gsap.set(item, { clearProps: "all" })
        });
    });

        // Anima os botões de ação
        if (this.headerAcoes) {
          gsap.fromTo(this.headerAcoes,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power1.out", delay: 0.3 + menuItems.length * 0.1 });
        }

    gsap.fromTo(this.contatoMobile,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power1.out", delay: 0.1 + menuItems.length * 0.1 });

    gsap.fromTo(this.whatsappMobile,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power1.out", delay: 0.1 + menuItems.length * 0.1 });
      
    gsap.fromTo(this.linkedinMobile,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power1.out", delay: 0.1 + (menuItems.length + 1) * 0.1 });

    gsap.fromTo(this.instagramMobile,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power1.out", delay: 0.1 + (menuItems.length + 1) * 0.1 });
  }

  toggleMenuAnimation(show) {
    const menuList = document.querySelector('.js [data-menu="list"]');
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
    if (this.logoMobile && this.menuButton && this.menuList && this.contatoMobile && this.whatsappMobile && this.linkedinMobile && this.instagramMobile) {
      this.addMenuMobileEvents();
      this.addLinkClickEvents();
    }
    return this;
  }
}
