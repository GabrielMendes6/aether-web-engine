import React, { useState, useEffect } from 'react';
import { Heart, Edit3 } from 'lucide-react';

export default function HeroSection({ title: initialTitle, subtitle: initialSubtitle, cta_text: initialCtaText, bg_image, isAdmin, updateContent }) {
    
    const [title, setTitle] = useState(initialTitle || 'Amor em cada detalhe');
    const [subtitle, setSubtitle] = useState(initialSubtitle || 'Box de presentes exclusivos para momentos inesquecíveis.');
    const [ctaText, setCtaText] = useState(initialCtaText || 'Montar minha Box');

    useEffect(() => {
        setTitle(initialTitle || 'Amor em cada detalhe');
        setSubtitle(initialSubtitle || 'Box de presentes exclusivos para momentos inesquecíveis.');
        setCtaText(initialCtaText || 'Montar minha Box');
    }, [initialTitle, initialSubtitle, initialCtaText]);

    const handleBlur = (field, e) => {
        if (!isAdmin) return;
        const newValue = e.target.innerText; 
        
        switch(field) {
            case 'title': setTitle(newValue); break;
            case 'subtitle': setSubtitle(newValue); break;
            case 'cta_text': setCtaText(newValue); break;
            default: break;
        }

        if (updateContent) {
            updateContent({ [field]: newValue });
        }
    };

    const editorStyles = isAdmin ? 'hover:bg-red-500/5 rounded-lg outline-none focus:ring-1 ring-red-500/30 transition-all p-1 cursor-text' : '';

    return (
        /* Uso do h-[100dvh] para adaptação perfeita a frames mobile e barras de navegador */
        <section className="relative w-full h-[100dvh] flex items-center justify-center text-white overflow-hidden bg-[#0a0a0a] font-sans">
            
            {/* Background com Overlay de Luxo */}
            <div className="absolute inset-0 z-0">
                {bg_image ? (
                    <>
                        <img 
                            src={bg_image} 
                            alt="Lovever Background" 
                            className="w-full h-full object-cover opacity-40 scale-100" 
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0a_80%)]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
                    </>
                ) : (
                    <div className="absolute inset-0 opacity-[0.05]" 
                         style={{ backgroundImage: `radial-gradient(#dc2626 0.5px, transparent 0.5px)`, backgroundSize: '40px 40px' }} />
                )}
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center">
                
                {/* Nome da Marca / Badge */}
                <div className="mb-6 flex items-center gap-3 animate-fade-in">
                    <div className="h-[1px] w-8 bg-red-600"></div>
                    <span className="text-red-500 font-light tracking-[0.5em] uppercase text-[10px] md:text-sm">
                        Lovever
                    </span>
                    <div className="h-[1px] w-8 bg-red-600"></div>
                </div>

                <h1 
                    contentEditable={isAdmin}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('title', e)}
                    className={`
                        /* 1. O padrão agora é o texto GRANDE (Desktop) */
                        text-8xl 
                        
                        /* 2. Se a tela (ou frame) for menor que 768px, ele BAIXA para 4xl */
                        max-md:text-5xl 
                        
                        /* 3. Se a tela for menor que 480px (iPhone/Frame), ele BAIXA para 3xl */
                        max-sm:text-3xl 

                        font-serif font-light tracking-tight leading-[1.1] mb-8 
                        w-full max-w-[90%] mx-auto break-words
                        ${editorStyles}
                    `}
                    style={{ fontFamily: 'serif' }}
                >
                    {title}
                </h1>
                {/* Subtítulo */}
                <p 
                    contentEditable={isAdmin}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('subtitle', e)}
                    className={`text-sm md:text-lg text-gray-300 max-w-xl leading-relaxed mb-12 font-light tracking-wide ${editorStyles}`}
                >
                    {subtitle}
                </p>

                {/* Botão CTA Estilo Boutique */}
                <div className="relative group">
                    <button 
                        contentEditable={isAdmin}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleBlur('cta_text', e)}
                        className={`
                            relative inline-flex items-center gap-3 px-10 py-4 
                            bg-red-600 text-white text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] 
                            transition-all duration-500 hover:bg-white hover:text-black cursor-pointer
                            ${editorStyles} ${isAdmin ? 'min-w-[250px]' : ''}
                        `}
                    >
                        {ctaText}
                        {!isAdmin && <Heart size={16} className="fill-current" />}
                    </button>
                    
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-red-600 transition-all duration-500 group-hover:w-full"></div>
                </div>

                {isAdmin && (
                    <div className="mt-8 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest animate-bounce">
                        <Edit3 size={12} /> Modo Edição Ativo
                    </div>
                )}
            </div>

            {/* Barra de Rodapé Sutil da Hero */}
            <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-30">
                <div className="flex gap-6 md:gap-10 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-light">
                    <span>Curadoria</span>
                    <span>Exclusividade</span>
                    <span>Afeto</span>
                </div>
            </div>

            {/* Fade inferior para suavizar a transição */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
        </section>
    );
}