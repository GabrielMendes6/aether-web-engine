import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../styles/productGridEditor.css';

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
        simulateTouch: isMobile, // Permitir touch no mobile como na View
    };

    return (
        <section className="w-full py-12 p-4 border-2 border-dashed border-blue-200 rounded-[2rem] bg-slate-50/50 product-grid-section relative">
            <style>
                {`
                    .product-grid-section .swiper {
                        width: 100%;
                        overflow: ${isMobile ? 'visible' : 'hidden'} !important; 
                        padding: 20px 4px 80px 4px !important; 
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
                    <Swiper 
                        {...swiperOptions} 
                        className="mySwiper !pb-14"
                    >
                        {allProducts?.map((prod, index) => {
                            const isMaster = index === 0;
                            const isPromo = isMaster 
                                ? (editMode === 'promoStyle' || showPromo) 
                                : (prod.sale_price && parseFloat(prod.sale_price) > 0);

                            const activeConfig = isPromo ? promoStyle : style;
                            const cardW = activeConfig?.cardStyle?.width || 300;
                            const cardH = activeConfig?.cardStyle?.height || 450;

                            return (
                                <SwiperSlide 
                                key={prod.id}
                                style={{
                                    width: isMobile ? 'auto' : `${cardW}px`, 
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <div
                                        className="product-card-wrapper"
                                        style={{
                                            width: isMobile ? undefined : (isMaster ? 'auto' : `${cardW}px`),
                                            height: isMobile ? undefined : (isMaster ? 'auto' : `${cardH}px`),
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