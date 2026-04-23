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
    children = [], 
    allProducts, 
    updateContent, 
    isAdmin,
    editMode,
    promoStyle,
    showPromo 
}) {
    
    const swiperOptions = {
        // No editor, usamos Navigation para facilitar a troca de slides sem arrastar
        modules: [Navigation, Pagination],
        spaceBetween: 20,
        slidesPerView: "auto", 
        fill: "row",
        centeredSlides: false,
        observer: true,
        observeParents: true,   
        navigation: true,
        pagination: { clickable: true },
        // CRÍTICO: No editor, simulateTouch é false para o mouse não mover o carrossel
        // ao tentar arrastar um elemento (Rnd) dentro do card.
        simulateTouch: false, 
        grabCursor: false,
        touchStartPreventDefault: false,
    };


    return (
        /* Replicamos a classe 'product-grid-section' para herdar os mesmos estilos da View */
        <section className="w-full py-12 p-4 border-2 border-dashed border-blue-200 rounded-[2rem] bg-slate-50/50 product-grid-section relative">
            <style>
                {`
                    .product-grid-section .swiper {
                        width: 100%;
                        overflow: hidden !important; 
                        padding: 20px 4px 60px 4px !important; 
                    }

                    .product-grid-section .swiper-wrapper {
                        display: flex !important;
                        flex-direction: row !important; /* Garante que fiquem lado a lado */
                    }

                    .product-grid-section .swiper-slide {
                        width: auto !important; /* Deixa o conteúdo ditar a largura */
                        pointer-events: auto !important;
                        touch-action: none !important;
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
                            // --- AQUI ESTAVA O ERRO: Faltava definir a variável ---
                            const isMaster = index === 0;
                            
                            const isPromo = isMaster ? showPromo : (prod.sale_price && parseFloat(prod.sale_price) > 0);

                            return (
                                <SwiperSlide key={prod.id}>
                                    <div 
                                        className="product-card-wrapper"
                                        style={{ 
                                            // Se for Master, largura 'auto' para o Rnd dentro do ProdutoItem trabalhar.
                                            // Se não for, fixa no tamanho que está no banco.
                                            width: isMaster ? 'auto' : `${style?.cardStyle?.width || 300}px`, 
                                            height: isMaster ? 'auto' : `${style?.cardStyle?.height || 450}px`,
                                            position: 'relative',
                                            display: 'block'
                                        }}
                                    >
                                        <ProdutoItem
                                            key={prod.id}
                                            prod={prod}
                                            isEditing={isAdmin}
                                            editMode={isMaster ? editMode : (isPromo ? 'promoStyle' : 'style')}
                                            style={style}
                                            promoStyle={promoStyle}
                                            updateContent={updateContent}
                                            isTemplateMaster={index === 0}
                                            showPromo={showPromo}
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