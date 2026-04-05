import React, { useState } from 'react';
import api from '../../Services/api';
import { 
    Plus, LayoutTemplate, X, MoveUp, MoveDown, 
    Trash2, Settings, Monitor, Smartphone 
} from 'lucide-react';
import HeroSection from '../../Pages/Sections/HeroSection';
import ProductGrid from '../../Pages/Sections/ProductGrid';
import FlexSection from '../../Pages/Sections/FlexSection';
import CarouselBannerSection from '../../Pages/Sections/CarouselBannerSection';

const COMPONENT_MAP = {
    'HeroSection': HeroSection,
    'ProductSection': ProductGrid,
    'FlexSection': FlexSection,
    'CarrosselBanner': CarouselBannerSection
}

const AVAILABLE_COMPONENTS = [
    {
        name: 'FlexSection',
        label: 'Seção Flexível (Vazia)',
        defaultContent: {
            settings: { backgroundColor: '#ffffff', minHeight: '600px' },
            children: []
        }
    },
    { name: 'HeroSection', label: 'Banner Principal', defaultContent: { title: 'Novo Titulo', subtitle: 'Subtítulo aqui', cta_text: 'Saiba Mais' } },
    { 
        name: 'ProductSection', 
        label: 'Grade de Produtos', 
        defaultContent: { 
            title: 'Nossos Produtos',
            style: { gap: '24px', columns: 4, titleColor: '#1e293b' },
            produtos: [] 
        } 
    },
    {
        name: 'CarrosselBanner',
        label: 'Carrossel de Banners',
        defaultContent: {
            settings: { autoplay: true, delay: 4000, showArrows: true },
            slides: [
                { 
                    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200', 
                    title: 'PROMOÇÃO DE VERÃO', 
                    cta: 'Comprar Agora',
                    link: '#' 
                }
            ]
        }
    },
]

export default function PageRenderer({ sections = [], setSections, onReorder, onEditSection, currentBreakpoint, setCurrentBreakpoint, slug, isAdmin }) {
    const [showModal, setShowModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    const isMobileView = currentBreakpoint === 'mobile';
    const showDeviceFrame = isMobileView && isAdmin;

    const handleCreateSection = async (comp) => {
        setIsCreating(true);
        try {
            const response = await api.post('/api/sections/add', {
                page_slug: slug,
                component: comp.name,
                content: comp.defaultContent,
                order: sections.length,
                is_visible: true
            });
            const newSection = response.data.section || response.data;
            setSections([...sections, newSection]);
            setShowModal(false);
        } catch (err) {
            console.error('[Luci] Erro ao Criar:', err);
            alert("Erro ao criar seção no servidor.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Deseja remover esta seção permanentemente?')) return;
        try {
            await api.delete(`/api/sections/${id}`);
            setSections(sections.filter(s => s.id !== id));
        } catch (err) {
            console.error('[Luci] Erro ao deletar:', err);
        }
    }

    return (
        <div className={`flex flex-col items-center w-full min-h-screen transition-all duration-500 ${isAdmin ? 'bg-slate-50/50 pb-40' : 'bg-white'}`}>
            
            {/* TOOLBAR DE DISPOSITIVOS - CENTRALIZAÇÃO FIXA REAL */}
            {isAdmin && (
                <div className="fixed top-6 left-59/101 -translate-x-1/2 z-[10000] flex bg-white/95 backdrop-blur-md border border-slate-200 p-1.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4">
                    <button 
                        onClick={() => setCurrentBreakpoint('desktop')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${currentBreakpoint === 'desktop' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Monitor size={16} /> Desktop
                    </button>
                    <button 
                        onClick={() => setCurrentBreakpoint('mobile')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${currentBreakpoint === 'mobile' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Smartphone size={16} /> Mobile
                    </button>
                </div>
            )}

            {/* ÁREA DE RENDERIZAÇÃO: MOLDURA E CONTEÚDO */}
            <div className={`w-full flex flex-col items-center ${isAdmin ? 'pt-28': ''} transition-all duration-700`}>
                <div className={`transition-all duration-700 ease-in-out relative bg-white ${
                    showDeviceFrame 
                    ? 'w-[430px] border-[12px] border-slate-950 rounded-[60px] shadow-[0_0_100px_rgba(0,0,0,0.2)] h-[844px] overflow-y-auto overflow-x-hidden scrollbar-hide box-content' 
                    : 'w-full max-w-none border-none rounded-none'
                }`}>
                    
                    {/* Notch do iPhone (Apenas Admin + Mobile) */}
                    {showDeviceFrame && (
                        <div className="sticky top-0 left-7/10 -translate-x-1/2 w-36 h-7 bg-slate-950 rounded-b-3xl z-[2000] mb-[-28px]" />
                    )}

                    <div className="w-full min-h-full">
                        {sections.map((section, index) => {
                            const Component = COMPONENT_MAP[section.component];
                            if (!Component) return null;

                            return (
                                <div key={`${section.id}-${index}`} className="relative group/section">
                                    {isAdmin && (
                                        <div className="absolute top-4 right-6 z-[1000] flex items-center gap-2 opacity-0 group-hover/section:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/section:translate-y-0">
                                            <div className="flex bg-slate-900/90 shadow-2xl border border-slate-700/50 rounded-2xl p-1.5 backdrop-blur-md">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEditSection(index); }}
                                                    className="p-2.5 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                                                >
                                                    <Settings size={18} />
                                                </button>
                                                <div className="w-px h-4 bg-slate-800 self-center mx-1" />
                                                <button onClick={() => onReorder(index, -1)} className="p-2.5 text-white hover:bg-slate-800 rounded-xl transition-all"><MoveUp size={18} /></button>
                                                <button onClick={() => onReorder(index, 1)} className="p-2.5 text-white hover:bg-slate-800 rounded-xl transition-all"><MoveDown size={18} /></button>
                                                <div className="w-px h-4 bg-slate-800 self-center mx-1" />
                                                <button onClick={() => handleDelete(section.id)} className="p-2.5 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    )}

                                    <section className={section.is_visible !== false ? 'block' : 'hidden'}>
                                        <Component
                                            {...section.content}
                                            isAdmin={isAdmin}
                                            currentBreakpoint={currentBreakpoint}
                                            updateContent={(newContent) => {
                                                const updatedSections = [...sections];
                                                updatedSections[index].content = {
                                                    ...updatedSections[index].content,
                                                    ...newContent
                                                };
                                                setSections(updatedSections);
                                            }}

                                            updateSettings={(newSettings) => {
                                                setSections(prev => prev.map((s, i) => {
                                                    if (i !== index) return s;
                                                    return {
                                                        ...s,
                                                        content: {
                                                            ...s.content,
                                                            settings: { ...(s.content.settings || {}), ...newSettings }
                                                        }
                                                    };
                                                }));
                                            }}
                                        />
                                    </section>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* BOTÃO ADICIONAR SEÇÃO - SINCRONIZADO COM A LARGURA DA MOLDURA */}
                {isAdmin && (
                    <div className={`mt-16 px-6 transition-all duration-700 ${showDeviceFrame ? 'w-[430px]' : 'w-full max-w-4xl'}`}>
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full py-10 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all group"
                        >
                            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                                <Plus size={28} />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px]">Adicionar Nova Seção</span>
                        </button>
                    </div>
                )}
            </div>

            {/* MODAL DE COMPONENTES */}
            {showModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 italic uppercase tracking-tighter">
                                <LayoutTemplate className="text-blue-600" size={24} />
                                Luci Builder
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 grid gap-4">
                            {AVAILABLE_COMPONENTS.map((comp) => (
                                <button
                                    key={comp.name}
                                    disabled={isCreating}
                                    onClick={() => handleCreateSection(comp)}
                                    className="flex items-center justify-between p-5 rounded-[24px] border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group disabled:opacity-50 shadow-sm"
                                >
                                    <div>
                                        <div className="font-black text-slate-800 group-hover:text-blue-700 uppercase tracking-tighter text-sm">{comp.label}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{comp.name}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Plus size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}