import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ProdutoItem from '../../../components/ProdutoItem'; 
export default function ProductGridView({ title, style, allProducts }) {
    const swiperOptions = {
        modules: [ Pagination, Autoplay],
        spaceBetween: 20,
        slidesPerView: "auto", 
        centeredSlides: false,
        observer: true,
        observeParents: true,
        navigation: true,
        pagination: { clickable: true },
        simulateTouch: true,
        grabCursor: true,
        touchStartPreventDefault: false,
        breakpoints: {
            1024: { 
                slidesPerView: style?.columns || 4,
                slidesPerView: "auto" 
            },
        },
    };

    return (
        <section className="w-full py-12 bg-white overflow-hidden product-grid-section">
            <style>
                {`
                    /* Container principal do Swiper */
                    .product-grid-section .swiper {
                        width: 100%;
                        /* Removemos o overflow visible aqui e tratamos no container para evitar que saia da tela */
                        overflow: hidden !important; 
                        padding: 20px 4px 60px 4px !important; /* Espaço para sombra e paginação */
                    }

                    .product-grid-section .swiper-wrapper {
                        display: flex !important;
                    }

                    .product-grid-section .swiper-slide {
                        width: auto !important;
                        display: flex;
                        justify-content: center;
                    }


                `}
            </style>

            <div className="container mx-auto px-4" style={{ maxWidth: '1400px' }}>
                {title && (
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-black uppercase" style={{ color: style?.titleColor }}>
                            {title}
                        </h2>
                    </div>
                )}

                <div className="w-full relative">
                    <Swiper {...swiperOptions} className="mySwiper !pb-14">
                        {allProducts?.map((prod) => (
                            <SwiperSlide key={prod.id}>
                                <div 
                                    className="product-card-wrapper"
                                    style={{ 
                                        width: `${style?.cardStyle?.width || 300}px`, 
                                        height: `${style?.cardStyle?.height || 450}px`,
                                        position: 'relative'
                                    }}
                                >
                                    <ProdutoItem
                                        prod={prod}
                                        isEditing={false}
                                        isTemplateMaster={false}
                                        style={style}
                                        updateContent={() => {}}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}