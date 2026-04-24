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
    console.log(isMobile)

    const swiperOptions = {
        modules: [Pagination, Navigation],
        spaceBetween: 20,
        slidesPerView: "auto",
        centeredSlides: isMobile,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        slidesOffsetAfter: isMobile ? 0 : 40,
        //navigation: !isMobile,
        pagination: { clickable: true },
    };

    

    return (
        <section className="w-full py-12 product-grid-section overflow-hidden">
            <style>
                {`
                    .product-grid-section .swiper { 
                        width: 100%; 
                        padding: 20px 4px 60px 4px !important; 
                    }
                    
                    .product-grid-section .swiper-slide { 
                        width: auto !important; 
                        display: flex; 
                        justify-content: center; 
                        align-items: flex-start;
                    }
                    
                    .product-grid-section .swiper-button-next, 
                    .product-grid-section .swiper-button-prev {
                        color: #2563eb !important; 
                        background: white; 
                        width: 35px !important; 
                        height: 35px !important;
                        border-radius: 50%; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }

                    .product-grid-section .swiper-button-next:after, 
                    .product-grid-section .swiper-button-prev:after { 
                        font-size: 14px; 
                        font-weight: bold; 
                    }

                    @media (max-width: 430px) {
                        .product-card-wrapper {
                            width: auto !important; 
                            height: auto !important;
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

            <div className="container mx-auto px-4 product-card-wrapper" style={{ maxWidth: '1400px' }}>
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
                            // Verifica se existe promoção real e válida
                            const hasSale = prod?.sale_price != null &&
                                Number(prod.sale_price) > 0 &&
                                Number(prod.sale_price) < Number(prod.price);

                            // Define qual estilo de card usar para reservar o espaço correto no Swiper
                            const activeCardStyle = hasSale ? (promoStyle?.cardStyle || style?.cardStyle) : style?.cardStyle;

                            return (
                                <SwiperSlide key={prod.id}>
                                    <div
                                        className="product-card-wrapper"
                                        style={{
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
                                            style={style}
                                            promoStyle={promoStyle}
                                            updateContent={() => { }}
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