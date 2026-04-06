import React, { useState, useEffect } from 'react';
import {
    Image as ImageIcon, Trash2,
    ArrowUp, ArrowDown, X, UploadCloud,
    ImagePlus, Layout, Move, MousePointer2, Tag
} from 'lucide-react';
import api from '../../../Services/api';
import ListSection from "./ListSection";
import RenderLinkSection from "./LinkSection";
import RenderImageSection from './ImageSection';
import RenderTypographySection from './TypographySection';

export default function EditorSidebar({ activeSection, onClose, onUpdate, currentBreakpoint }) {
    /*
    |--------------------------------------------------------------------------
    | FLEX SECTION
    |--------------------------------------------------------------------------
    */
   if (!activeSection || !activeSection.content) return null;
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('elements'); // 'elements' ou 'style'
    const { content } = activeSection;
    const { settings = {}, children = [] } = content;
    const [categories, setCategories] = useState([]);

    const productSettings = {
        mode: settings.mode || 'random', // 'random' como padrão
        categoryId: settings.categoryId || null,
        limit: settings.limit || 8,
        ...settings
    };

    const updateSettings = (newS) => {
        // Verifica se a mudança exige um "reset" de dados (troca de modo, limite ou categoria)
        const shouldReset = 
            (newS.mode && newS.mode !== productSettings.mode) || 
            (newS.limit && newS.limit !== productSettings.limit) ||
            (newS.categoryId !== undefined && newS.categoryId !== productSettings.categoryId);

        onUpdate({
            // Se mudou a regra, mandamos o array de produtos VAZIO
            // Isso é o sinal para o ProductGrid chamar a API
            produtos: shouldReset ? [] : (content.produtos || []),
            settings: { 
                ...productSettings, 
                ...newS 
            }
        });
    };

    const updateBlock = (index, data) => {
        const newC = [...children];
        const item = { ...newC[index] };

        // Separamos o que é PROPS (texto, links, imagens) do que é GEOMETRIA
        const propKeys = ['url', 'value', 'items', 'destination'];
        
        const newProps = { ...(item.props || {}) };
        const newGeometry = {};

        Object.keys(data).forEach(key => {
            if (propKeys.includes(key)) {
                newProps[key] = data[key];
            } else {
                newGeometry[key] = data[key];
            }
        });

        newC[index] = {
            ...item,
            props: newProps, // Agora o conteúdo vive aqui
            breakpoints: {
                ...item.breakpoints,
                [currentBreakpoint]: {
                    ...(item.breakpoints?.[currentBreakpoint] || {}),
                    ...newGeometry 
                }
            }
        };

        onUpdate({ ...content, children: newC });
    };

    const updateBlockStyle = (idx, style) => {
        // Propriedades que mudam conforme o tamanho da tela
        const geometricProps = ['fontSize', 'width', 'height', 'textAlign', 'letterSpacing', 'tag', 'lineHeight', 'listStyleType', 'gap'];

        // Propriedades que são iguais em qualquer tamanho de tela
        const isGeometric = Object.keys(style).some(key => geometricProps.includes(key));

        if (isGeometric) {
            updateBlock(idx, style);
        } else {
            // Cores, fontes e outros estilos visuais globais
            const newC = [...children];
            newC[idx].style = { ...(newC[idx].style || {}), ...style };
            onUpdate({ ...content, children: newC });
        }
    };

    const handleFileUpload = async (index, file, isBg = false) => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/sections/uploadFiles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const url = response.data.url;
            isBg ? updateSettings({ backgroundImage: url }) : updateBlock(index, { url: url });

        } catch (err) {
            console.error("Erro de Upload:", err.response?.data);
            alert("Erro ao subir imagem.");
        } finally {
            setIsUploading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Carrossel Banner Section
    |--------------------------------------------------------------------------
    */

    const addCarouselSlide = () => {
        const newSlide = { 
            image: 'https://via.placeholder.com/1200x500', 
            link: '#' 
        };
        const currentSlides = activeSection.content.slides || [];
        onUpdate({ ...activeSection.content, slides: [...currentSlides, newSlide] });
    };

    const updateCarouselSlide = (index, data) => {
        const newSlides = [...(activeSection.content.slides || [])];
        newSlides[index] = { ...newSlides[index], ...data };
        onUpdate({ ...activeSection.content, slides: newSlides });
    };

    const removeCarouselSlide = (index) => {
        const newSlides = (activeSection.content.slides || []).filter((_, i) => i !== index);
        onUpdate({ ...activeSection.content, slides: newSlides });
    };

    const carrosselFileUpload = async (index, file) => {
        if (!file) return;

        console.log(file)
        setIsUploading(true); // Reutilizando seu estado de loading

        const formData = new FormData();
        // Verifique se o backend espera 'file' ou 'image' no append
        formData.append('file', file); 

        try {
            const response = await api.post('/api/sections/uploadFiles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data && response.data.url) {
                updateCarouselSlide(index, { image: response.data.url });
            }
        } catch (err) {
            console.error("Erro de Upload no Carrossel:", err.response?.data);
            alert("Erro ao subir imagem do banner.");
        } finally {
            setIsUploading(false);
        }
    };

    const moveCarouselSlide = (index, direction) => {
        const newSlides = [...(activeSection.content.slides || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Verifica se o movimento é possível (dentro dos limites do array)
        if (targetIndex >= 0 && targetIndex < newSlides.length) {
            // Swap (troca) de posições
            [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
            onUpdate({ ...activeSection.content, slides: newSlides });
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Product Section
    |--------------------------------------------------------------------------
    */

    // Busca as categorias da sua nova API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias do heri_amostra:", error);
            }
        };

        fetchCategories();
    }, []);
    
    return (
        <aside className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-[-20px_0_80px_rgba(0,0,0,0.15)] z-[99999] border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-500 ease-out font-sans">

            {/* HEADER COM SELETOR DE ABAS */}
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">Editor</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ativo: {currentBreakpoint}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="flex bg-slate-200/50 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('elements')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'elements' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        Elementos
                    </button>
                    <button
                        onClick={() => setActiveTab('style')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'style' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        Seção
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-40 scrollbar-hide">

                {activeTab === 'style' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Estilo Visual</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Fundo</label>
                                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <input type="color" value={settings.backgroundColor || '#ffffff'} onChange={(e) => updateSettings({ backgroundColor: e.target.value })} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{settings.backgroundColor || '#ffffff'}</span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Altura Min</label>
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <input type="text" value={settings.minHeight || '400px'} onChange={(e) => updateSettings({ minHeight: e.target.value })} className="w-full bg-transparent border-none text-[11px] font-bold outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 ml-1">
                                    <ImagePlus size={14} /> Background Image
                                </label>
                                <div className="relative group/upload h-32 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all overflow-hidden shadow-inner">
                                    {isUploading ? (
                                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    ) : settings.backgroundImage ? (
                                        <div className="absolute inset-0 group">
                                            <img src={settings.backgroundImage} className="w-full h-full object-cover" alt="Background" />
                                            
                                            {/* BOTÃO PARA REMOVER IMAGEM */}
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateSettings({ backgroundImage: null });
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-30 hover:bg-red-600"
                                                title="Remover Imagem"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                <UploadCloud className="text-white" size={24} />
                                                {/* Input para trocar a imagem atual */}
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleFileUpload(null, e.target.files[0], true)} 
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => handleFileUpload(null, e.target.files[0], true)} 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                            />
                                            <UploadCloud className="text-slate-300" size={24} />
                                            <span className="text-[8px] font-black text-slate-400 mt-2 uppercase">Subir Imagem</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'elements' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
                        {/* LÓGICA PARA CARROSSEL DE BANNERS */}
                        {activeSection.component === 'CarrosselBanner' && (
                            <div className="space-y-6 ">
                                <div className="flex items-center justify-between border-l-4 border-blue-600 pl-3">
                                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Gerenciar Banners</h3>
                                    <button 
                                        onClick={addCarouselSlide}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase"
                                    >
                                        <ImagePlus size={14} /> Add Slide
                                    </button>
                                </div>

                                {(activeSection.content.slides || []).map((slide, sIdx) => (
                                    <div key={sIdx} className="group/slide bg-slate-50 border border-slate-100 rounded-[28px] p-4 space-y-4 relative transition-all hover:shadow-lg">
                                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/slide:opacity-100 transition-all z-10">
                                            <div className="w-7 h-7 bg-white text-slate-600 rounded-full shadow-md flex items-center justify-center border border-slate-100 hover:bg-blue-50 disabled:opacity-30">
                                                {sIdx + 1}
                                            </div>
                                            {/* Mover para Cima */}
                                            <button 
                                                onClick={() => moveCarouselSlide(sIdx, 'up')}
                                                disabled={sIdx === 0}
                                                className="w-7 h-7 bg-white text-slate-600 rounded-full shadow-md flex items-center justify-center border border-slate-100 hover:bg-blue-50 disabled:opacity-30"
                                            >
                                                <ArrowUp size={14} />
                                            </button>

                                            {/* Mover para Baixo */}
                                            <button 
                                                onClick={() => moveCarouselSlide(sIdx, 'down')}
                                                disabled={sIdx === (activeSection.content.slides.length - 1)}
                                                className="w-7 h-7 bg-white text-slate-600 rounded-full shadow-md flex items-center justify-center border border-slate-100 hover:bg-blue-50 disabled:opacity-30"
                                            >
                                                <ArrowDown size={14} />
                                            </button>

                                            {/* Deletar */}
                                            <button 
                                                onClick={() => removeCarouselSlide(sIdx)}
                                                className="w-7 h-7 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center border border-slate-100 hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Preview e Upload */}
                                        <div key={sIdx} className="relative h-24 bg-slate-200 rounded-2xl overflow-hidden group/img border border-slate-200">
                                            <img src={slide.image} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer">
                                                <UploadCloud className="text-white mb-1" size={20} />
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            carrosselFileUpload(sIdx, file); // sIdx vem do map
                                                        }
                                                    }}
                                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                                />
                                            </div>
                                        </div>

                                        {/* Inputs de Conteúdo */}
                                        <div className="space-y-2">
                                            <input 
                                                type="text" 
                                                placeholder="Link"
                                                value={slide.link || ''} 
                                                onChange={(e) => updateCarouselSlide(sIdx, { link: e.target.value })}
                                                className="w-full h-9 bg-white border border-slate-200 rounded-xl px-3 text-[10px] font-bold outline-none" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection.component === 'FlexSection' && children.map((block, idx) => {

                            const config = block.breakpoints?.[currentBreakpoint] || block.breakpoints?.desktop || {
                                x: block.x || 0,
                                y: block.y || 0,
                                width: block.style?.width || '300px'
                            };

                            return (
                                <div key={idx} className="group/block bg-white border border-slate-100 rounded-[32px] p-6 space-y-6 transition-all hover:shadow-2xl hover:shadow-slate-200/50 border-t-4 border-t-blue-500/10">

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-[11px] shadow-lg shadow-slate-900/20">{idx + 1}</div>
                                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{block.type}</span>
                                        </div>
                                        <button onClick={() => onUpdate({ ...content, children: children.filter((_, i) => i !== idx) })} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                    </div>

                                    {/* MÓDULO DE GEOMETRIA (POR BREAKPOINT) */}
                                    <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                        <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Move size={12} /> Posicionamento ({currentBreakpoint})</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1 text-left">
                                                <span className="text-[8px] text-slate-400 font-bold ml-1">Eixo X</span>
                                                <input type="number" value={Math.round(config.x)} onChange={(e) => updateBlock(idx, { x: parseInt(e.target.value) })} className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <span className="text-[8px] text-slate-400 font-bold ml-1">Eixo Y</span>
                                                <input type="number" value={Math.round(config.y)} onChange={(e) => updateBlock(idx, { y: parseInt(e.target.value) })} className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <span className="text-[8px] text-slate-400 font-bold ml-1">Largura</span>
                                                <input type="text" value={config.width} onChange={(e) => updateBlockStyle(idx, { width: e.target.value })} className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <span className="text-[8px] text-slate-400 font-bold ml-1">Z-Index</span>
                                                <input type="number" value={block.zIndex || 1} onChange={(e) => updateBlock(idx, { zIndex: parseInt(e.target.value) })} className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* MÓDULO DE TEXTO / BOTÃO */}
                                    {(block.type === 'text' || block.type === 'button') && (
                                        <RenderTypographySection 
                                            block={block} 
                                            idx={idx} 
                                            config={config}
                                            updateBlockStyle={updateBlockStyle} 
                                            updateBlock={updateBlock}
                                        />
                                    )}

                                    {/* MÓDULO DE IMAGEM */}
                                    {block.type === 'image' && (
                                        <RenderImageSection 
                                            block={block} 
                                            idx={idx} 
                                            handleFileUpload={handleFileUpload} 
                                            updateBlockStyle={updateBlockStyle} 
                                            updateBlock={updateBlock} 
                                        />
                                    )}

                                    {/* SEÇÃO DE LINK */}
                                    {block.type === 'link' && (
                                        <RenderLinkSection 
                                            block={block} 
                                            idx={idx} 
                                            updateBlock={updateBlock} 
                                        />
                                    )}

                                    {/* SEÇÃO DE LISTA */}
                                    {block.type === 'list' && (
                                        <ListSection 
                                            block={block} 
                                            idx={idx} 
                                            updateBlock={updateBlock} 
                                            updateBlockStyle={updateBlockStyle}
                                            currentBreakpoint={currentBreakpoint}
                                        />
                                    )}
                                </div>
                            );
                        })}
                        
                        {activeSection.component === 'ProductSection' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                                        Inteligência da Vitrine
                                    </h3>
                                </div>

                                {/* SELETOR DE MODO */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-tighter">Como os produtos aparecem?</label>
                                    <div className="relative">
                                        <select 
                                            value={productSettings.mode || 'manual'} 
                                            onChange={(e) => updateSettings({ mode: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] font-bold outline-none focus:border-blue-400 transition-all appearance-none cursor-pointer pr-10"
                                        >
                                            <option value="manual">🎯 Seleção Manual (Controle Total)</option>
                                            <option value="random">🎲 Aleatórios (Auto-preenchimento)</option>
                                            <option value="category">📂 Por Categoria (Sincronizado)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Layout size={14} />
                                        </div>
                                    </div>
                                </div>

                                {/* CONFIGURAÇÃO DE QUANTIDADE (Apenas para modos Automáticos) */}
                                {productSettings.mode !== 'manual' && (
                                    <div className="space-y-3 p-4 bg-blue-50/30 border border-blue-100 rounded-[24px] animate-in slide-in-from-top-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Limite de Exibição</label>
                                            <span className="text-[11px] font-black text-blue-700 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-blue-100">
                                                {productSettings.limit || 8} Itens
                                            </span>
                                        </div>
                                        <input 
                                            type="range"
                                            min="1"
                                            max="20"
                                            step="1"
                                            value={productSettings.limit || 8}
                                            onChange={(e) => updateSettings({ limit: parseInt(e.target.value) })}
                                            className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                )}

                                {/* SELETOR DE CATEGORIA (Apenas se modo for Category) */}
                                {productSettings.mode === 'category' && (
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-[24px] space-y-3 animate-in zoom-in-95">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1 flex items-center gap-2">
                                            <Tag size={10} /> Vincular Categoria
                                        </label>
                                        <select 
                                            value={productSettings.categoryId || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                updateSettings({ categoryId: val ? Number(val) : null });
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-[10px] font-bold outline-none focus:border-blue-400"
                                        >
                                            <option value="">Selecione uma categoria...</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* FEEDBACK PARA MODO MANUAL */}
                                {productSettings.mode === 'manual' && (
                                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-[24px] flex items-start gap-3">
                                        <div className="mt-1"><MousePointer2 size={14} className="text-amber-600" /></div>
                                        <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tighter">
                                            Gerencie os produtos diretamente na vitrine clicando nos botões de <span className="text-amber-600">+</span> e <span className="text-red-500">X</span>.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </div>

            <div className="p-8 bg-white border-t border-slate-50">
                <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[3px] rounded-[24px] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]">
                    Pronto
                </button>
            </div>
        </aside>
    );
}