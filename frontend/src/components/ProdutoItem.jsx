import React, { useState, useEffect, useRef, memo } from 'react';
import { Rnd } from "react-rnd";

// --- SUB-COMPONENTE: ELEMENTO VISUAL ---
const ElementoVisual = ({ styleConfig, children, className, isPromoPrice = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const baseStyle = styleConfig?.style || {};
    const hoverStyle = baseStyle?.hover || {};

    const activeStyle = {
        color: isHovered && hoverStyle.color !== undefined ? hoverStyle.color : (baseStyle.color || (isPromoPrice ? '#dc2626' : 'inherit')),
        fontSize: baseStyle.fontSize ? `${baseStyle.fontSize}px` : 'inherit',
        fontWeight: baseStyle.fontWeight || (isPromoPrice ? '900' : 'inherit'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: baseStyle.textAlign === 'left' ? 'flex-start' : baseStyle.textAlign === 'right' ? 'flex-end' : 'center',
        textAlign: baseStyle.textAlign || 'center',
        width: '100%',
        height: '100%',
        backgroundColor: isHovered && hoverStyle.backgroundColor !== undefined ? hoverStyle.backgroundColor : (baseStyle.backgroundColor || 'transparent'),
        borderRadius: baseStyle.borderRadius ? `${baseStyle.borderRadius}` : '0px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    };

    return (
        <div className={className} style={activeStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <span style={{ width: 'auto' }}>{children}</span>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL: PRODUTO ITEM ---
const ProdutoItem = ({ prod, isEditing, updateContent, style, promoStyle, editMode = 'style', isTemplateMaster, showPromo }) => {
    const draggingRef = useRef(false);
    const syncTimeoutRef = useRef(null);

    const activeMode = isEditing ? (editMode || 'style') : (showPromo ? 'promoStyle' : 'style');

    const getStyleConfig = (key) => {
        const config = activeMode === 'promoStyle' ? promoStyle : style;
        if (activeMode === 'promoStyle' && (!config || !config[key])) {
            return style?.[key];
        }
        return config?.[key];
    };

    const modeRef = useRef(activeMode);
    useEffect(() => { modeRef.current = activeMode; }, [activeMode]);

    const [cardSize, setCardSize] = useState({ width: 300, height: 450 });
    const [imageStyle, setImageStyle] = useState({ x: 0, y: 0, width: 300, height: 250 });
    const [nameStyle, setNameStyle] = useState({ x: 16, y: 270, width: 260, height: 25 });
    const [priceStyle, setPriceStyle] = useState({ x: 16, y: 310, width: 150, height: 30 });
    const [salePriceStyle, setSalePriceStyle] = useState({ x: 16, y: 355, width: 150, height: 30 });
    const [buttonStyle, setButtonStyle] = useState({ x: 16, y: 380, width: 268, height: 40 });
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (draggingRef.current) return;
        setCardSize(getStyleConfig('cardStyle') || { width: 300, height: 450 });
        setImageStyle(getStyleConfig('imageStyle') || { x: 0, y: 0, width: 300, height: 250 });
        setNameStyle(getStyleConfig('nameStyle') || { x: 16, y: 270, width: 260, height: 25 });
        setPriceStyle(getStyleConfig('priceStyle') || { x: 16, y: 310, width: 150, height: 30 });
        setSalePriceStyle(getStyleConfig('salePriceStyle') || { x: 16, y: 355, width: 150, height: 30 });
        setButtonStyle(getStyleConfig('buttonStyle') || { x: 16, y: 380, width: 268, height: 40 });
    }, [style, promoStyle, activeMode]);

    useEffect(() => {
        if (isEditing) {
            setScale(1);
            return;
        }
        const handleResize = () => {
            const threshold = 438;
            if (window.innerWidth < threshold) {
                const availableWidth = window.innerWidth * 0.85; 
                setScale(availableWidth / cardSize.width);
            } else {
                setScale(1);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [cardSize.width, isEditing]);

    const handleSave = (key, data) => {
        draggingRef.current = true;
        const currentMode = modeRef.current;
        if (typeof updateContent === 'function') {
            const baseData = currentMode === 'promoStyle' ? (promoStyle || {}) : (style || {});
            updateContent({ [currentMode]: { ...baseData, [key]: data } });
        }
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => { draggingRef.current = false; }, 500);
    };

    const renderElement = (key, content, pos, setPos, className = "") => {
        if (activeMode === 'style' && key === 'salePriceStyle') return null;
        const geometry = {
            left: `${pos.x}px`, top: `${pos.y}px`, width: `${pos.width}px`, height: `${pos.height}px`,
            zIndex: pos.zIndex || 10, position: 'absolute'
        };
        const linkedContent = (
            <a href={`/produtos/${prod.slug}`}>
                <div className="w-full h-full overflow-hidden flex items-center justify-center">
                    {content}
                </div>
            </a>
        );
        if (!isEditing || !isTemplateMaster) {
            return <div className={`absolute ${className}`} style={geometry}>{linkedContent}</div>;
        }
        return (
            <Rnd
                size={{ width: Math.round(pos.width), height: Math.round(pos.height) }}
                position={{ x: Math.round(pos.x), y: Math.round(pos.y) }}
                bounds="parent"
                className={`border border-dashed ${activeMode === 'promoStyle' ? 'border-red-400' : 'border-blue-400'} ${className}`}
                onDragStop={(e, d) => handleSave(key, { ...pos, x: Math.round(d.x), y: Math.round(d.y) })}
                onResizeStop={(e, dir, ref, delta, p) => handleSave(key, { ...pos, width: ref.offsetWidth, height: ref.offsetHeight, x: p.x, y: p.y })}
            >
                <div className="w-full h-full select-none pointer-events-none overflow-hidden">{linkedContent}</div>
            </Rnd>
        );
    };

    // --- CÁLCULO DE COMPENSAÇÃO LATERAL ---
    const widthDecline = cardSize.width * (1 - scale);

    return (
        <div style={{ 
            width: `${cardSize.width}px`, 
            height: `${cardSize.height}px`, // ALTURA MANTIDA FIXA
            position: 'relative',
            transform: scale !== 1 ? `scale(${scale})` : 'none',
            transformOrigin: 'top center', // Centraliza o encolhimento para as margens funcionarem
            
            // Compensação lateral para o Swiper não esmagar o card
            marginLeft: scale !== 1 ? `-${widthDecline / 2}px` : '0px',
            marginRight: scale !== 1 ? `-${widthDecline / 2}px` : '0px',
            
            transition: 'transform 0.2s ease-out',
        }}>
            <div className={`relative bg-white shadow-lg w-full h-full rounded-[16px] overflow-hidden border ${activeMode === 'promoStyle' ? 'border-red-100' : 'border-slate-100'}`}>
                {renderElement('imageStyle',
                    <img src={prod?.image_url} className="w-full h-full object-fill pointer-events-none" alt="" />,
                    imageStyle, setImageStyle
                )}
                {renderElement('nameStyle', <ElementoVisual styleConfig={nameStyle} className="px-2"><span>{prod?.name}</span></ElementoVisual>, nameStyle, setNameStyle)}
                {renderElement('priceStyle',
                    <ElementoVisual styleConfig={priceStyle}>
                        <span style={{ textDecoration: activeMode === 'promoStyle' ? 'line-through' : 'none', opacity: activeMode === 'promoStyle' ? 0.5 : 1 }}>
                            R$ {prod?.price}
                        </span>
                    </ElementoVisual>, priceStyle, setPriceStyle)}
                {renderElement('salePriceStyle',
                    <ElementoVisual styleConfig={salePriceStyle} isPromoPrice={true}>
                        <span>R$ {prod?.sale_price || '99,90'}</span>
                    </ElementoVisual>, salePriceStyle, setSalePriceStyle)}
                {renderElement('buttonStyle',
                    <ElementoVisual styleConfig={buttonStyle} className="bg-blue-600 text-white rounded-lg font-bold">
                        <span>Comprar</span>
                    </ElementoVisual>, buttonStyle, setButtonStyle)}
            </div>
        </div>
    );
};

export default memo(ProdutoItem);