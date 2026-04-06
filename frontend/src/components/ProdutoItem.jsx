import React, { useState, useEffect, useRef, memo } from 'react';
import { Rnd } from "react-rnd";

const ProdutoItem = ({ prod, isEditing, updateContent, style, isTemplateMaster }) => {
    const draggingRef = useRef(false);
    const syncTimeoutRef = useRef(null);
    const [cardSize, setCardSize] = useState(style?.cardStyle || { width: 300, height: 450 });

    const [imageStyle, setImageStyle] = useState(style?.imageStyle || { x: 0, y: 0, width: 300, height: 250 });
    const [nameStyle, setNameStyle] = useState(style?.nameStyle || { x: 16, y: 270, width: 260, height: 25 });
    const [priceStyle, setPriceStyle] = useState(style?.priceStyle || { x: 16, y: 310, width: 150, height: 30 });
    const [buttonStyle, setButtonStyle] = useState(style?.buttonStyle || { x: 16, y: 380, width: 268, height: 40 });

    useEffect(() => {
        if (!draggingRef.current) {
            if (style?.cardStyle) setCardSize(style.cardStyle);
            if (style?.imageStyle) setImageStyle(style.imageStyle);
            if (style?.nameStyle) setNameStyle(style.nameStyle);
            if (style?.priceStyle) setPriceStyle(style.priceStyle);
            if (style?.buttonStyle) setButtonStyle(style.buttonStyle);
        }
    }, [style]);

    const handleSave = (key, data) => {
        if (key === 'cardStyle') setCardSize(data);
        if (key === 'imageStyle') setImageStyle(data);
        if (key === 'nameStyle') setNameStyle(data);
        if (key === 'priceStyle') setPriceStyle(data);
        if (key === 'buttonStyle') setButtonStyle(data);

        draggingRef.current = true;

        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

        updateContent({
            style: { ...style, [key]: data }
        });

        syncTimeoutRef.current = setTimeout(() => {
            draggingRef.current = false;
        }, 300);
    };

    const renderInternalRnd = (key, content, pos, setPos, className) => {
        if (!isEditing || !isTemplateMaster) {
            return (
                <div className={`absolute ${className}`} style={{ left: pos.x, top: pos.y, width: pos.width, height: pos.height }}>
                    {content}
                </div>
            );
        }

        return (
            <Rnd
                size={{ width: pos.width, height: pos.height }}
                position={{ x: pos.x, y: pos.y }}
                bounds="parent"
                onDragStart={(e) => {
                    e.stopPropagation();
                    draggingRef.current = true;
                }}
                onDrag={(e, d) => setPos(prev => ({ ...prev, x: d.x, y: d.y }))}
                onDragStop={(e, d) => handleSave(key, { ...pos, x: d.x, y: d.y })}
                onResizeStart={() => { draggingRef.current = true; }}
                onResizeStop={(e, dir, ref, delta, pos) => handleSave(key, { width: ref.offsetWidth, height: ref.offsetHeight, ...pos })}
                className={`z-50 border border-dashed border-blue-400/50 bg-blue-50/5 hover:bg-blue-50/10 ${className}`}
            >
                <div className="w-full h-full flex items-center justify-center overflow-hidden">{content}</div>
            </Rnd>
        );
    };

    const CardContent = (
        <div
            className={`relative bg-white shadow-lg border text-center border-slate-100 transition-shadow duration-300 ${isTemplateMaster && isEditing ? 'ring-2 ring-blue-500 shadow-blue-100' : ''}`}
            style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden' }}
        >
            {/* IMAGEM  */}
            {renderInternalRnd('imageStyle',
                <img
                    src={prod.image_url}
                    className="w-full h-full object-cover pointer-events-none"
                    alt=""
                />,
                imageStyle, setImageStyle, "bg-slate-100"
            )}

            {/* NOME DO PRODUTO */}
            {renderInternalRnd('nameStyle',
                <span className="font-bold text-slate-800 uppercase text-sm truncate block w-full px-1">{prod.name}</span>,
                nameStyle, setNameStyle, ""
            )}

            {/* PREÇO */}
            {renderInternalRnd('priceStyle',
                <span className="font-black text-blue-600 text-lg">R$ {prod.price}</span>,
                priceStyle, setPriceStyle, ""
            )}

            {/* BOTÃO COMPRAR */}
            {renderInternalRnd('buttonStyle',
                <div className="w-full h-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center rounded-lg uppercase tracking-widest">
                    Comprar
                </div>,
                buttonStyle, setButtonStyle, ""
            )}
        </div>
    );

    if (isEditing && isTemplateMaster) {
        return (
            <Rnd
                size={{ width: cardSize.width, height: cardSize.height }}
                disableDragging={true}
                enableResizing={{ bottomRight: true, right: true, bottom: true }}
                onResizeStart={() => { draggingRef.current = true; }}
                onResizeStop={(e, dir, ref) => {
                    handleSave('cardStyle', { width: ref.offsetWidth, height: ref.offsetHeight });
                }}
                style={{ position: 'relative' }}
            >
                {CardContent}
            </Rnd>
        );
    }

    return (
        <div style={{ width: `${cardSize.width}px`, height: `${cardSize.height}px`, position: 'relative' }}>
            {CardContent}
        </div>
    );
};

export default memo(ProdutoItem);