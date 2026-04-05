import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CarouselBannerSection({ 
    slides = [], 
    settings = {}, 
    isAdmin, 
    currentBreakpoint,
}) {
    // Configurações padrão caso não venham do banco
    const {
        autoplay = true,
        delay = 3000,
        loop = true,
        showArrows = true,
        showPagination = true
    } = settings;

    // Ajuste de altura baseado no breakpoint para não quebrar o layout
    const containerHeight = currentBreakpoint === 'mobile' ? 'h-[250px]' : 'h-[500px]';

    if (slides.length === 0 && isAdmin) {
        return (
            <div className={`w-full ${containerHeight} bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl`}>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    Nenhum banner adicionado. Clique em configurar.
                </p>
            </div>
        );
    }

    return (
        <div className={`w-full ${containerHeight} group relative overflow-hidden`}>
            <div className='absolute inset-0 w-full h-full '>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={showArrows && !isAdmin} // Esconde setas no modo edição para facilitar o clique
                    pagination={showPagination ? { clickable: true } : false}
                    autoplay={autoplay ? { delay, disableOnInteraction: false } : false}
                    loop={loop}
                    className="w-full h-full"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <a 
                                href={slide.link || '#'} 
                                className="relative block w-full h-full group/slide-link cursor-pointer"
                                // Se o link for externo, você pode adicionar target="_blank"
                            >
                                <img 
                                    src={slide.image} 
                                    alt={slide.alt || `Banner ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Overlay de Conteúdo (Opcional) */}
                                {(slide.title || slide.cta) && (
                                    <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white p-6 text-center">
                                        {slide.title && (
                                            <h2 className={`font-black uppercase tracking-tighter mb-2 ${currentBreakpoint === 'mobile' ? 'text-2xl' : 'text-5xl'}`}>
                                                {slide.title}
                                            </h2>
                                        )}
                                        {slide.cta && (
                                            <a 
                                                href={slide.link || '#'} 
                                                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full uppercase text-xs hover:scale-105 transition-transform"
                                            >
                                                {slide.cta}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>

            {/* CSS Customizado para os bullets do Swiper combinarem com a Luci */}
            <style jsx="true" global="true">{`
                .swiper-pagination-bullet-active {
                    background: #0f172a !important;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: #fff !important;
                    transform: scale(0.6);
                    opacity: 0;
                    transition: all 0.3s;
                }
                .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}