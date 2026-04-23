import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ProdutoItem from '../../../components/ProdutoItem';

export default function ProductGridView({ 
    title, 
    style = {},      
    promoStyle = {}, 
    allProducts,
    loading,
    currentBreakpoint
}) {
    if (loading) return null; 

    const isMobile = currentBreakpoint === 'mobile';

    const swiperOptions = {
        modules: [Pagination],
        spaceBetween: 20,
        slidesPerView: "auto", 
        centeredSlides: false, 
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        slidesOffsetAfter: isMobile ? 20 : 40,
        pagination: { clickable: true },
    };

    return (
        <section className="w-full py-12 product-grid-section overflow-hidden">
            <style>
                {`
                    .product-grid-section .swiper { width: 100%; padding: 20px 4px 60px 4px !important; }
                    .product-grid-section .swiper-slide { width: auto !important; display: flex; justify-content: center; }
                    
                    /* Ajuste dos botões de navegação */
                    .product-grid-section .swiper-button-next, .product-grid-section .swiper-button-prev {
                        color: #2563eb !important; background: white; width: 35px !important; height: 35px !important;
                        border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        after { font-size: 14px; font-weight: bold; }
                    }

                    @media (max-width: 767px) {
                        .product-card-wrapper {
                            width: 280px !important; /* Largura fixa menor para mobile */
                            height: auto !important;
                            aspect-ratio: 2/3.3;
                        }
                        .product-card-wrapper > div { width: 100% !important; height: 100% !important; }
                    }
                `}
            </style>

            <div className="container mx-auto px-4" style={{ maxWidth: '1400px' }}>
                {title && (
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-black uppercase" style={{ color: style?.titleColor || '#000' }}>
                            {title}
                        </h2>
                    </div>
                )}

                <div className="w-full relative">
                    <Swiper {...swiperOptions} className="mySwiper">
                        {allProducts?.map((prod) => {
                            // Verifica se existe promoção real
                            const hasSale = prod?.sale_price != null && 
                                          Number(prod.sale_price) > 0 && 
                                          Number(prod.sale_price) < Number(prod.price);

                            // O estilo do card (container externo) deve seguir a regra de qual layout usar
                            const activeCardStyle = hasSale ? (promoStyle?.cardStyle || style?.cardStyle) : style?.cardStyle;

                            return (
                                <SwiperSlide key={prod.id}>
                                    <div
                                        className="product-card-wrapper"
                                        style={{
                                            // No desktop mantemos o que foi desenhado, no mobile o CSS assume
                                            width: isMobile ? undefined : `${activeCardStyle?.width || 300}px`,
                                            height: isMobile ? undefined : `${activeCardStyle?.height || 450}px`,
                                            position: 'relative'
                                        }}
                                    >
                                        <ProdutoItem
                                            prod={prod}
                                            isEditing={false}       
                                            isTemplateMaster={false}
                                            showPromo={hasSale}
                                            // IMPORTANTE: Passamos os dois para o ProdutoItem decidir internamente
                                            style={style} 
                                            promoStyle={promoStyle}
                                            updateContent={() => {}}    
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