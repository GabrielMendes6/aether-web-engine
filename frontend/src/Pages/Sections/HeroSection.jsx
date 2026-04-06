import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, MousePointer2 } from 'lucide-react';

export default function HeroSection({ title: initialTitle, subtitle: initialSubtitle, cta_text: initialCtaText, bg_image, isAdmin, updateContent }) {
    
    // ESTADO LOCAL (Mantido para edição fluida)
    const [title, setTitle] = useState(initialTitle || 'Novo Título');
    const [subtitle, setSubtitle] = useState(initialSubtitle || 'Subtítulo editável...');
    const [ctaText, setCtaText] = useState(initialCtaText || 'Saiba Mais');

    // Sincronização com o Pai (GenericPage)
    useEffect(() => {
        setTitle(initialTitle || 'Novo Título');
        setSubtitle(initialSubtitle || 'Subtítulo editável...');
        setCtaText(initialCtaText || 'Saiba Mais');
    }, [initialTitle, initialSubtitle, initialCtaText]);

    // Função de Blur (Mantida para salvar)
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

    // Estilos de Editor Heri Amostra (Refinados)
    const editorStyles = isAdmin ? 'hover:bg-blue-500/10 rounded-xl outline-none focus:ring-2 ring-blue-500/50 transition-all duration-200 p-2 cursor-text border border-transparent hover:border-blue-500/20' : '';

    return (
        // MUDANÇA: Fundo Slate 950, altura mínima 85vh, centralização vertical flex
        <section className="relative w-full min-h-[85vh] flex items-center justify-center text-white overflow-hidden bg-[#020617] font-sans">
            
            {/* EFEITO DE GLOW CENTRAL HERI AMORSTRA PRO */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none z-0" />
            
            {/* Background Image com Overlay Gradiente Premium */}
            {bg_image ? (
                <div className="absolute inset-0 z-0">
                    <img 
                        src={bg_image} 
                        alt="Hero Background" 
                        // MUDANÇA: Opacidade menor e leve zoom para profundidade
                        className="w-full h-full object-cover opacity-30 scale-105 transition-transform duration-1000" 
                    />
                    {/* Gradiente que escurece para o fundo da seção */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#020617]" />
                </div>
            ) : (
                // Linhas de Grid sutis se não houver imagem (padrão tech)
                <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
                     style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
            )}

            {/* Conteúdo sobreposto */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-8 py-20">
                
                {/* Badge Premium Animado */}
                <div className="animate-pulse mb-2">
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full border border-blue-500/20 flex items-center gap-2 shadow-lg shadow-blue-500/10">
                        <Sparkles size={12} className="text-blue-300" /> HERI AMOSTRA 
                    </span>
                </div>

                {/* Título Editável - Padrão PRO (Black, Tracking Negativo) */}
                <h1 
                    contentEditable={isAdmin}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('title', e)}
                    // MUDANÇA: text-8xl, font-black, tracking extra negativo
                    className={`text-6xl md:text-8xl font-black tracking-[-0.05em] leading-[0.95] drop-shadow-2xl ${editorStyles}`}
                >
                    {title}
                </h1>

                {/* Subtítulo Editável - Cor Slate 400 para contraste elegante */}
                <p 
                    contentEditable={isAdmin}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('subtitle', e)}
                    // MUDANÇA: Cor slate-400, text-lg
                    className={`text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-medium ${editorStyles}`}
                >
                    {subtitle}
                </p>

                {/* Container do Botão CTA - Estilo Borda Neon */}
                <div className="mt-10 flex flex-col items-center gap-4 group/btn">
                    {/* MUDANÇA: Wrapper de gradiente para criar a borda neon */}
                    <div className="relative p-[1px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all active:scale-95 duration-300">
                        <a 
                            contentEditable={isAdmin}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleBlur('cta_text', e)}
                            // MUDANÇA: Estilo Pill, text-xs, font-black uppercase tracking
                            className={`inline-flex items-center justify-center px-14 py-5 text-xs font-black uppercase tracking-[0.2em] text-white bg-[#020617] rounded-full hover:bg-transparent transition-colors duration-300 outline-none cursor-pointer ${editorStyles} ${isAdmin ? 'min-w-[200px] border-none' : ''}`}
                        >
                            {ctaText}
                        </a>
                    </div>
                    
                    {/* MUDANÇA: Indicador de edição admin em Slate 500 */}
                    {isAdmin && (
                        <div className="flex items-center gap-2 text-[9px] text-slate-500 font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">
                            <ExternalLink size={10} /> Editar destino do link
                        </div>
                    )}
                </div>
            </div>

            {/* Fade inferior para suavizar a transição com a próxima seção */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent z-10" />
        </section>
    );
}