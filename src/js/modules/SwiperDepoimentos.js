import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export class SwiperDepoimentos {
    constructor() {
        this.init();
    }

    init() {
        const swiperEl = document.querySelector('.swiper-depoimentos');
        if (!swiperEl) {
            console.warn('Elemento .swiper-depoimentos não encontrado');
            return;
        }

        const swiperConfig = {
            modules: [Navigation, Pagination],
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            grabCursor: true,
            breakpoints: {
                768: {
                    slidesPerView: 1
                },
                1024: {
                    slidesPerView: 1
                }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            }
        };

        try {
            this.swiper = new Swiper('.swiper-depoimentos', swiperConfig);
            console.log('Swiper de depoimentos inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar Swiper:', error);
        }
    }
}