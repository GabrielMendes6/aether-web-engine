import React, { useState } from "react";
import {
    AlignCenter, AlignLeft, AlignRight,
    Bold, Italic, CaseUpper, Hash, Type, Maximize
} from 'lucide-react';

export default function RenderTypographySection({ block, idx, config, updateBlockStyle, updateBlock }) {
    // Trava de segurança para garantir que existam dados
    if (!config && !block) return null;

    const [isHover, setIsHover] = useState(block.style?.hover ? true : false);
    
    // Verifica se o fundo atual está definido como transparente
    const isTransparent = block.style?.backgroundColor === 'transparent';

    // Função diplomática: Tenta ler do Style (Produtos) ou do Config (Flex)
    const getVal = (prop, defaultVal) => {
        return block.style?.[prop] ?? config?.[prop] ?? defaultVal;
    };

    const handleHoverToggle = (e) => {
        const isChecked = e.target.checked;
        setIsHover(isChecked);

        if (!isChecked) {
            // Remove o objeto hover preservando o restante do estilo
            const { hover, ...styleWithoutHover } = block.style || {};
            updateBlock(idx, { style: styleWithoutHover });
        } else {
            if (!block.style?.hover) {
                updateBlockStyle(idx, {
                    hover: {
                        color: block.style?.color || '#1e293b',
                        backgroundColor: block.style?.backgroundColor || '#3b82f6'
                    }
                });
            }
        }
    };

    const toggleTransparent = (e) => {
        const shouldBeTransparent = e.target.checked;
        updateBlockStyle(idx, { 
            backgroundColor: shouldBeTransparent ? 'transparent' : '#ffffff' 
        });
    };

    return (
        <div className="space-y-6 px-1 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* SELETOR DE TAG (SEO) */}
            <div className="space-y-2 text-left">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2">
                    <Hash size={12} /> Hierarquia Visual (SEO)
                </label>
                <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-[18px]">
                    {['h1', 'h2', 'h3', 'p', 'span'].map((t) => {
                        const activeTag = config?.tag || block?.tag || 'p';
                        return (
                            <button
                                key={t}
                                onClick={() => updateBlockStyle(idx, { tag: t })}
                                className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${activeTag === t
                                        ? 'bg-white text-blue-600 shadow-sm scale-105'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                                    }`}
                            >
                                {t}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* COR DE TEXTO E FUNDO */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Cor do Texto</label>
                    <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                        <input
                            type="color"
                            value={block.style?.color || '#1e293b'}
                            onChange={(e) => updateBlockStyle(idx, { color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-[10px] font-mono font-black text-slate-500 uppercase">
                            {block.style?.color || '#1e293b'}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase">Fundo</label>
                        <div className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="checkbox"
                                id="transparency-check"
                                checked={isTransparent}
                                onChange={toggleTransparent}
                                className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="transparency-check" className="text-[7px] font-black text-slate-400 uppercase cursor-pointer">Transparente</label>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm transition-all duration-300 ${isTransparent ? 'opacity-40 pointer-events-none bg-slate-50' : 'hover:border-blue-200'}`}>
                        <input
                            type="color"
                            disabled={isTransparent}
                            value={isTransparent ? '#ffffff' : (block.style?.backgroundColor || '#3b82f6')}
                            onChange={(e) => updateBlockStyle(idx, { backgroundColor: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-[10px] font-mono font-black text-slate-500 uppercase">
                            {isTransparent ? 'NONE' : (block.style?.backgroundColor || '#3b82f6')}
                        </span>
                    </div>
                </div>
            </div>

            {/* TAMANHO */}
            <div className="space-y-2 text-left">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Tamanho (px)</label>
                <div className="relative flex items-center">
                    <Type size={14} className="absolute left-3 text-slate-300" />
                    <input
                        type="number"
                        value={parseInt(getVal('fontSize', 16))}
                        onChange={(e) => updateBlockStyle(idx, { fontSize: parseInt(e.target.value) })} // Removido o "px"
                        className="w-full h-11 bg-white border border-slate-100 rounded-2xl pl-9 pr-3 text-[12px] font-black outline-none focus:border-blue-500 shadow-sm"
                    />
                </div>
            </div>

            {/* ESTILOS RÁPIDOS */}
            <div className="flex gap-1 bg-slate-100 p-1.5 rounded-[22px]">
                {[
                    { key: 'fontWeight', val: '900', icon: <Bold size={16} />, active: getVal('fontWeight') === '900' },
                    { key: 'fontStyle', val: 'italic', icon: <Italic size={16} />, active: getVal('fontStyle') === 'italic' },
                    { key: 'textTransform', val: 'uppercase', icon: <CaseUpper size={16} />, active: getVal('textTransform') === 'uppercase' }
                ].map((btn, i) => (
                    <button
                        key={i}
                        onClick={() => updateBlockStyle(idx, { [btn.key]: btn.active ? (btn.key === 'fontWeight' ? '400' : btn.key === 'fontStyle' ? 'normal' : 'none') : btn.val })}
                        className={`flex-1 py-2.5 rounded-xl flex justify-center transition-all duration-300 ${btn.active ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {btn.icon}
                    </button>
                ))}
            </div>

            {/* ALINHAMENTO */}
            <div className="space-y-2 text-left">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Alinhamento</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-[22px] border border-slate-100">
                    {['left', 'center', 'right'].map(pos => {
                        const activeAlign = getVal('textAlign', 'left');
                        const ActiveAlingItens = getVal ('alignItems', 'left');
                        return (
                            <button
                                key={pos}
                                onClick={() => updateBlockStyle(idx, { textAlign: pos, alignItems: pos })}
                                className={`py-2.5 rounded-[18px] flex justify-center transition-all duration-300 ${activeAlign === pos && ActiveAlingItens === pos
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'text-slate-300 hover:bg-white hover:text-slate-500'
                                    }` } 
                            >
                                {pos === 'left' && <AlignLeft size={18} />}
                                {pos === 'center' && <AlignCenter size={18} />}
                                {pos === 'right' && <AlignRight size={18} />}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* HOVER TOGGLE */}
            <div className="flex justify-end items-center text-right border-t border-slate-100 pt-4">
                <input
                    type="checkbox"
                    id="hover-master"
                    checked={isHover}
                    onChange={handleHoverToggle}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hover-master" className="text-[8px] font-black text-slate-400 uppercase ml-2 cursor-pointer">Ativar Efeito Hover</label>
            </div>

            {/* CONTROLES DE ESTILO ESPECÍFICOS */}
            {block.type === "button" && (
                <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-4 rounded-[24px] border border-slate-100">
                    <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">
                                <Maximize size={12} /> Arredondamento
                            </label>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                                {block.style?.borderRadius || '0px'}
                            </span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Ex: 24px ou 50%"
                            value={block.style?.borderRadius || ''} 
                            onChange={(e) => updateBlockStyle(idx, { borderRadius: e.target.value })} 
                            className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500 transition-colors shadow-sm" 
                        />
                    </div>
                </div>
            )}

            {isHover && (
                <div className="flex gap-1 bg-slate-50 p-4 rounded-[22px] animate-in zoom-in-95 duration-200 border border-slate-100">
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="space-y-2 text-left">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Texto Hover</label>
                            <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
                                <input
                                    type="color"
                                    value={block.style?.hover?.color || '#1e293b'}
                                    onChange={(e) => updateBlockStyle(idx, { hover: { ...block.style?.hover, color: e.target.value } })}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Fundo Hover</label>
                            <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
                                <input
                                    type="color"
                                    value={block.style?.hover?.backgroundColor || '#3b82f6'}
                                    onChange={(e) => updateBlockStyle(idx, { hover: { ...block.style?.hover, backgroundColor: e.target.value } })}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}