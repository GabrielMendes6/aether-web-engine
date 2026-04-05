import React, { useState } from "react";
import {
    Image as ImageIcon,
    AlignCenter, AlignLeft, AlignRight,
    Bold, Italic, CaseUpper, Hash, Type
} from 'lucide-react';


export default function renderTypographySection({block, idx, config, updateBlockStyle, updateBlock}) { 
    if (!config) return null;
    const [isHover, setIsHover] = useState(block.style.hover ? true : false);

    const handleOnChange = (e) => {
        const isChecked = e.target.checked;
        setIsHover(isChecked);

        if (!isChecked) {
            // 1. Extrai o hover e guarda todo o resto em 'styleWithoutHover'
            const { hover, ...styleWithoutHover } = block.style || {};
            
            console.log("Estilo antigo:", block.style);
            console.log("Estilo limpo (sem hover):", styleWithoutHover);
            
            // 2. Passa o objeto JÁ LIMPO para a função
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
    }

    return (
        <div className="space-y-6 px-1 animate-in fade-in slide-in-from-right-4 duration-500">       
            {/* SELETOR DE TAG (SEO) */}
            <div className="space-y-2 text-left">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2">
                    <Hash size={12} /> Hierarquia Visual (SEO)
                </label>
                <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-[18px]">
                    {['h1', 'h2', 'h3', 'p', 'span'].map((t) => { 
                        const activeTag = config.tag || block?.tag || 'p';
                        return (
                            <button
                                key={t}
                                onClick={() => updateBlockStyle(idx, { tag: t })}
                                className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
                                    activeTag === t 
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
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Cor do Fundo</label>
                    <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                        <input 
                            type="color" 
                            value={block.style?.backgroundColor || '#3b82f6'} 
                            onChange={(e) => updateBlockStyle(idx, { backgroundColor: e.target.value })} 
                            className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" 
                        />
                        <span className="text-[10px] font-mono font-black text-slate-500 uppercase">
                            {block.style?.backgroundColor || '#3b82f6'}
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
                        value={parseInt(config.fontSize) || 16} 
                        onChange={(e) => updateBlockStyle(idx, { fontSize: `${e.target.value}px` })} 
                        className="w-full h-11 bg-white border border-slate-100 rounded-2xl pl-9 pr-3 text-[12px] font-black outline-none focus:border-blue-500 shadow-sm" 
                    />
                </div>
            </div>

            {/* ESTILOS RÁPIDOS (Bold, Italic, Case) */}
            <div className="flex gap-1 bg-slate-100 p-1.5 rounded-[22px]">
                {[
                    { key: 'fontWeight', val: '900', icon: <Bold size={16}/>, active: block.style?.fontWeight === '900' },
                    { key: 'fontStyle', val: 'italic', icon: <Italic size={16}/>, active: block.style?.fontStyle === 'italic' },
                    { key: 'textTransform', val: 'uppercase', icon: <CaseUpper size={16}/>, active: block.style?.textTransform === 'uppercase' }
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

            {/* ALINHAMENTO GEOMÉTRICO */}
            <div className="space-y-2 text-left">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Alinhamento</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-[22px] border border-slate-100">
                    {['left', 'center', 'right'].map(pos => (
                        <button 
                            key={pos} 
                            onClick={() => updateBlockStyle(idx, { textAlign: pos })} 
                            className={`py-2.5 rounded-[18px] flex justify-center transition-all duration-300 ${
                                config.textAlign === pos 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                                : 'text-slate-300 hover:bg-white hover:text-slate-500'
                            }`}
                        >
                            {pos === 'left' && <AlignLeft size={18} />}
                            {pos === 'center' && <AlignCenter size={18} />}
                            {pos === 'right' && <AlignRight size={18} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* HOVER */}
            <div className="flex justify-end items-center text-right align-center">
                <input 
                    type="checkbox" 
                    checked={isHover}
                    onChange={handleOnChange}
                />
                <label className="text-[8px] font-black text-slate-400 uppercase ml-l m-[.5rem]">Hover</label>
            </div>

            {isHover && (
                <div className="flex gap-1 bg-slate-100 p-1.5 rounded-[22px]">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Cor do Texto Hover</label>
                            <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                                <input 
                                    type="color" 
                                    value={block.style?.hover?.color || '#1e293b'} 
                                    onChange={(e) => updateBlockStyle(idx, { hover: {...block.style?.hover, color: e.target.value } })} 
                                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" 
                                />
                                <span className="text-[10px] font-mono font-black text-slate-500 uppercase">
                                    {block.style?.hover?.color || '#1e293b'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Cor do Fundo Hover</label>
                            <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                                <input 
                                    type="color" 
                                    value={block.style?.hover?.backgroundColor || '#3b82f6'} 
                                    onChange={(e) => updateBlockStyle(idx, { hover: {...block.style?.hover, backgroundColor: e.target.value} })} 
                                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" 
                                />
                                <span className="text-[10px] font-mono font-black text-slate-500 uppercase">
                                    {block.style?.hover?.backgroundColor || '#3b82f6'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    )

};