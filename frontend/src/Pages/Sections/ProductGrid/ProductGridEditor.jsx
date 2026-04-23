import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ProdutoItem from '../../../components/ProdutoItem';

export default function ProductGridEditor({
    title,
    style,
    allProducts,
    updateContent,
    isAdmin,
    editMode,
    promoStyle,
    showPromo,
    currentBreakpoint
}) {

    const isMobile = currentBreakpoint === "mobile";

    const swiperOptions = {
        modules: [Navigation, Pagination],
        spaceBetween: isMobile ? 10 : 20,
        slidesPerView: "auto",
        centeredSlides: isMobile,
        observer: true,
        observeParents: true,
        navigation: !isMobile,
        pagination: { clickable: true },
        simulateTouch: false,
        grabCursor: false,
        touchStartPreventDefault: false,
    };

    return (
        <section className="w-full py-12 p-4 border-2 border-dashed border-blue-200 rounded-[2rem] bg-slate-50/50 product-grid-section relative">
            <style>
                {`
                    .product-grid-section .swiper {
                        width: 100%;
                        /* CRÍTICO: No editor mobile, precisamos de visible para não cortar o card escalado */
                        overflow: ${isMobile ? 'visible' : 'hidden'} !important; 
                        padding: 20px 4px 80px 4px !important; 
                    }

                    .product-grid-section .swiper-wrapper {
                        display: flex !important;
                        flex-direction: row !important;
                    }

                    .product-grid-section .swiper-slide {
                        width: auto !important; 
                        display: flex;
                        justify-content: center;
                        /* Garante que o slide não seja uma caixa de corte */
                        overflow: visible !important; 
                        pointer-events: auto !important;
                    }

                    .product-grid-section .swiper-slide:first-child {
                        z-index: 100 !important;
                    }

                    .product-grid-section .swiper-button-next, 
                    .product-grid-section .swiper-button-prev {
                        color: #2563eb !important;
                        background: white;
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 50%;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        top: 45% !important;
                    }

                    @media (max-width: 466px) {
                        .product-card-wrapper {
                            width: auto !important; 
                            display: flex;
                            justify-content: center;
                            align-items: flex-start;
                            overflow: visible !important;
                        }
                    }

                    @media (max-width: 437px) {
                        .product-card-wrapper {
                            width: auto !important; 
                            margin: 0 auto;
                            display: flex;
                            justify-content: center;
                            overflow: visible !important;
                            align-items: flex-start;
                        }

                        /* Ajuste de espaçamento para as bolinhas da paginação não sobreporem o card */
                        .product-grid-section .swiper {
                            padding-bottom: 80px !important;
                        }
                    }
                `}
            </style>

            <div className="container mx-auto px-4" style={{ maxWidth: '1400px' }}>
                {title && (
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-black uppercase" style={{ color: style?.titleColor }}>
                            {title}
                        </h2>
                        <div className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase">
                            Modo Editor: Primeiro Card é o Master
                        </div>
                    </div>
                )}

                <div className="w-full relative">
                    <Swiper {...swiperOptions} className="mySwiper !pb-14">
                        {allProducts?.map((prod, index) => {
                            const isMaster = index === 0;
                            const isPromo = isMaster ? (editMode === 'promoStyle' || showPromo) : (prod.sale_price && parseFloat(prod.sale_price) > 0);

                            const activeConfig = isPromo ? promoStyle : style;
                            const cardW = activeConfig?.cardStyle?.width || 300;
                            const cardH = activeConfig?.cardStyle?.height || 450;

                            return (
                                <SwiperSlide key={prod.id}>
                                    <div
                                        className="product-card-wrapper"
                                        style={{
                                            // Se for mobile, deixamos auto para o scale do ProdutoItem gerenciar o espaço real
                                            width: isMobile ? 'auto' : (isMaster ? 'auto' : `${cardW}px`),
                                            height: isMobile ? 'auto' : (isMaster ? 'auto' : `${cardH}px`),
                                            position: 'relative'
                                        }}
                                    >
                                        <ProdutoItem
                                            prod={prod}
                                            isEditing={isAdmin}
                                            editMode={isMaster ? editMode : (isPromo ? 'promoStyle' : 'style')}
                                            style={style}
                                            promoStyle={promoStyle}
                                            updateContent={updateContent}
                                            isTemplateMaster={isMaster}
                                            showPromo={isPromo}
                                        />
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}