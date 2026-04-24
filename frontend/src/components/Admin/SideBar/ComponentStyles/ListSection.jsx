import React from 'react';
import {
    List, ListOrdered, Link2,
    Plus, Trash2, Type, AlignLeft,
    AlignCenter, AlignRight, X, Rows, Columns, Underline
} from 'lucide-react';

export default function ListSection({ block, idx, updateBlock, updateBlockStyle, currentBreakpoint }) {
    if (!block) return null;

    // Extração de dados responsivos e globais
    const currentConfig = block.breakpoints?.[currentBreakpoint] || block.breakpoints?.desktop || {};
    const currentTextAlign = currentConfig.textAlign || 'left';
    const currentListStyle = currentConfig.listStyleType || 'disc';
    const currentGap = currentConfig.gap || '16px';
    const currentTag = block.listTag || 'ul';
    const currentLayout = block.layout || 'column';

    const addItem = () => {
        const newItems = [...(block.items || []), { 
            text: 'Novo Item', 
            isLink: false, 
            url: '',
            underline: false // Inicializamos o estado do item
        }];
        updateBlock(idx, { items: newItems });
    };

    const updateItem = (iIdx, data) => {
        const newItems = [...block.items];
        newItems[iIdx] = { ...newItems[iIdx], ...data };
        updateBlock(idx, { items: newItems });
    };

    const removeItem = (iIdx) => {
        const newItems = block.items.filter((_, i) => i !== iIdx);
        updateBlock(idx, { items: newItems });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-8">
            {/* CONFIGURAÇÃO DE TEXTO (COR E ALINHAMENTO) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Cor do Texto</label>
                    <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
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
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Alinhamento</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                        {['left', 'center', 'right'].map((pos) => (
                            <button
                                key={pos}
                                onClick={() => updateBlockStyle(idx, { textAlign: pos })}
                                className={`flex-1 py-2 rounded-lg flex justify-center transition-all ${
                                    currentTextAlign === pos ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                                }`}
                            >
                                {pos === 'left' && <AlignLeft size={14} />}
                                {pos === 'center' && <AlignCenter size={14} />}
                                {pos === 'right' && <AlignRight size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TIPO DE LISTA E LAYOUT */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Marcador</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                        <button
                            onClick={() => { updateBlock(idx, { listTag: 'ul' }); updateBlockStyle(idx, { listStyleType: 'disc' }); }}
                            className={`flex-1 py-2 rounded-lg flex justify-center ${currentTag === 'ul' && currentListStyle === 'disc' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            <List size={14} />
                        </button>
                        <button
                            onClick={() => { updateBlock(idx, { listTag: 'ol' }); updateBlockStyle(idx, { listStyleType: 'decimal' }); }}
                            className={`flex-1 py-2 rounded-lg flex justify-center ${currentTag === 'ol' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            <ListOrdered size={14} />
                        </button>
                        <button
                            onClick={() => { updateBlock(idx, { listTag: 'ul' }); updateBlockStyle(idx, { listStyleType: 'none' }); }}
                            className={`flex-1 py-2 rounded-lg flex justify-center ${currentListStyle === 'none' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Orientação</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                        <button
                            onClick={() => updateBlock(idx, { layout: 'column' })}
                            className={`flex-1 py-2 rounded-lg flex justify-center ${currentLayout === 'column' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            <Rows size={14} />
                        </button>
                        <button
                            onClick={() => updateBlock(idx, { layout: 'row' })}
                            className={`flex-1 py-2 rounded-lg flex justify-center ${currentLayout === 'row' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            <Columns size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ESPAÇAMENTO RESPONSIVO */}
            <div className="space-y-2 text-left">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase">Espaçamento</label>
                    <span className="text-[10px] font-mono text-blue-600 font-bold">{currentGap}</span>
                </div>
                <div className="bg-slate-100 p-3 rounded-xl">
                    <input
                        type="range" min="0" max="80" step="4"
                        value={parseInt(currentGap) || 16}
                        onChange={(e) => updateBlockStyle(idx, { gap: `${e.target.value}px` })}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>

            {/* GERENCIADOR DE ITENS */}
            <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Itens da Lista</label>
                    <button onClick={addItem} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 transition-all shadow-sm">
                        <Plus size={14} />
                    </button>
                </div>

                <div className="space-y-3">
                    {block.items?.map((item, iIdx) => (
                        <div key={iIdx} className="bg-white border border-slate-100 p-3 rounded-[24px] shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                                    <Type size={12} />
                                </div>
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => updateItem(iIdx, { text: e.target.value })}
                                    className="flex-1 text-[11px] font-bold outline-none bg-transparent"
                                />

                                {/* BOTÃO UNDERLINE (TOGGLE PARA O BLOCO) */}
                                <button 
                                    onClick={() => {
                                        updateItem(iIdx, { underline: !item.underline });
                                    }}
                                    className={`p-2 rounded-lg transition-all ${
                                        item.underline 
                                            ? 'bg-blue-50 text-blue-600 opacity-100' 
                                            : 'text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100'
                                    }`}
                                >
                                    <Underline size={14} />
                                </button>
                                <button onClick={() => removeItem(iIdx)} className="p-2 text-slate-200 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 pl-2 pt-2 border-t border-slate-50">
                                <button
                                    onClick={() => updateItem(iIdx, { isLink: !item.isLink })}
                                    className={`p-1.5 rounded-lg transition-all ${item.isLink ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
                                >
                                    <Link2 size={12} />
                                </button>
                                {item.isLink && (
                                    <input
                                        type="text"
                                        value={item.url || ''}
                                        onChange={(e) => updateItem(iIdx, { url: e.target.value })}
                                        className="flex-1 text-[9px] font-black text-blue-500 outline-none bg-blue-50/50 rounded-lg px-2 py-1"
                                        placeholder="https://..."
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}