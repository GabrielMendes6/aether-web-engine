import React, { useState } from 'react';
import { Rnd } from "react-rnd";
import { Trash2, GripVertical } from 'lucide-react';
import AdminButtons from '../../../components/Admin/AdminButtons';
import { resolveElement } from '../../../utils/styleResolver';

export default function FlexSectionEditor({  settings = {},  children = [],  updateContent,  currentBreakpoint, isAdmin }) {
    const [showGuides, setShowGuides] = useState({ x: false, y: false });

    const updateBlock = (id, newData) => {
        const newChildren = children.map((item) => {
            if (item.id === id) {
                const b = item.breakpoints || {};
                return {
                    ...item,
                    breakpoints: {
                        ...b,
                        [currentBreakpoint]: { ...(b[currentBreakpoint] || {}), ...newData }
                    }
                };
            }
            return item;
        });
        updateContent({ children: newChildren });
    };

    const EditableElement = ({ item, resolved, updateBlock, isAdmin }) => {
        const { style: config, box: s } = resolved;
        const [isHovered, setIsHovered] = useState(false);

        // Funções auxiliares que você já usa
        const handlePaste = (e) => { /* sua lógica de paste */ };
        const handleKeyDown = (e) => { /* sua lógica de keydown */ };

        // Estilo base do container que preenche o RND
        const containerStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        const CustomTag = config.tag || item.tag || 'p';
        const ListTag = config.listTag || 'ul';

        return (
            <div style={containerStyle} className="cursor-move group/item">
                
                {/* TIPO: TEXTO */}
                {item.type === 'text' && (
                    <div className="w-full h-full flex items-center justify-center">
                        <CustomTag
                            contentEditable={isAdmin}
                            suppressContentEditableWarning={true}
                            onMouseDown={(e) => e.stopPropagation()} // Bloqueia drag só ao editar
                            onBlur={(e) => updateBlock(item.id, { value: e.target.innerText })}
                            style={{
                                ...item.style,
                                fontSize: config.fontSize,
                                textAlign: config.textAlign,
                                lineHeight: config.lineHeight,
                                letterSpacing: config.letterSpacing,
                                width: '100%', // Ocupa 100% para o texto respeitar o alinhamento
                                height: 'auto',
                                outline: 'none',
                            }}
                        >
                            {item.value}
                        </CustomTag>
                    </div>
                )}

                {/* TIPO: BOTÃO */}
                {item.type === 'button' && (
                    <button 
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ 
                            ...item.style, 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: (isHovered && item.style?.hover?.backgroundColor) ? item.style.hover.backgroundColor : item.style?.backgroundColor,
                            color: (isHovered && item.style?.hover?.color) ? item.style.hover.color : item.style?.color,
                            transition: 'ease-in-out .2s',
                            cursor: "move" // Cursor de mover no botão
                        }}
                    >
                        <span
                            contentEditable={isAdmin}
                            suppressContentEditableWarning={true}
                            onMouseDown={(e) => e.stopPropagation()} // Permite drag se clicar fora das letras
                            onBlur={(e) => updateBlock(item.id, { value: e.target.innerText })}
                            className="outline-none"
                            style={{
                                cursor: 'text', // No texto o cursor muda para edição
                                display: 'inline-block',
                                minWidth: '10px'
                            }}
                        >
                            {item.value}
                        </span>
                    </button>
                )}

                {/* TIPO: IMAGEM */}
                {item.type === 'image' && (
                    <div className="w-full h-full pointer-events-none select-none">
                        <img
                            src={item.url || 'https://via.placeholder.com/400'}
                            className="w-full h-full object-cover"
                            style={{ borderRadius: item.style?.borderRadius }}
                            draggable={false}
                        />
                    </div>
                )}

                {/* TIPO: LISTA */}
                {item.type === 'list' && (
                    <div
                        className="w-full h-full flex flex-col justify-center px-4 cursor-move"
                        style={{
                            alignItems: config.textAlign === 'center' ? 'center' :
                                config.textAlign === 'right' ? 'flex-end' : 'flex-start',
                            // Isso garante que o container não bloqueie a seleção de texto interna
                            userSelect: 'text', 
                        }}
                    >
                        <ListTag
                            style={{
                                ...item.style,
                                fontSize: config.fontSize,
                                color: item.style?.color || 'inherit',
                                listStyleType: config.listStyleType || item.style?.listStyleType || 'disc',
                                listStylePosition: 'inside',
                                padding: 0,
                                margin: 0,
                                gap: config.gap || item.style?.gap || '16px',
                                width: '100%',
                                textAlign: config.textAlign || 'left',
                                display: 'flex',
                                flexDirection: item.layout === 'row' ? 'row' : 'column',
                                flexWrap: 'wrap',
                                justifyContent: item.layout === 'row'
                                    ? (config.textAlign === 'center' ? 'center' : config.textAlign === 'right' ? 'flex-end' : 'flex-start')
                                    : 'stretch',
                                alignItems: 'stretch',
                            }}
                            className="outline-none space-y-2"
                        >
                            {item.items?.map((li, liIdx) => (
                                <li 
                                    key={liIdx} 
                                    className="leading-relaxed" 
                                    style={{ 
                                        textAlign: 'inherit',
                                        width: item.layout === 'row' ? 'auto' : '100%',
                                        listStylePosition: 'inside'
                                    }}
                                >
                                    <span
                                        // ATRIBUTOS DE EDIÇÃO
                                        contentEditable={isAdmin}
                                        suppressContentEditableWarning={true}
                                        
                                        // ESSENCIAL PARA FUNCIONAR:
                                        onMouseDown={(e) => {
                                            e.stopPropagation(); // Impede o RND de iniciar o drag ao clicar aqui
                                        }}
                                        onClick={(e) => {
                                            e.currentTarget.focus(); // Força o foco no clique
                                        }}
                                        onBlur={(e) => {
                                            const newItems = [...item.items];
                                            newItems[liIdx] = { ...li, text: e.target.innerText };
                                            updateBlock(item.id, { items: newItems });
                                        }}
                                        
                                        className="outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                                        style={{ 
                                            textDecoration: li.underline ? 'underline' : 'none',
                                            cursor: 'text', // Cursor de I-beam para indicar texto
                                            display: 'inline-block',
                                            minWidth: '20px',
                                            position: 'relative',
                                            zIndex: 50, // Garante que o texto está acima da área de drag
                                            pointerEvents: 'auto', // Força a recepção de eventos de mouse
                                        }}
                                    >
                                        {li.text}
                                    </span>
                                </li>
                            ))}
                        </ListTag>
                    </div>
                )}

                {item.type === 'link' && (
                    <a className={'outline-none pointer-events-auto'}
                        href={item.url}
                        contentEditable={isAdmin}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        suppressContentEditableWarning={true}
                        onMouseDown={(e) => e.stopPropagation()}
                        onBlur={(e) => updateBlock(item.id, { value: e.target.innerText })}
                    >
                        {item.value}
                    </a>
                )}


            </div>
        );
    };

    return (
        <section 
            className="relative w-full border-y border-blue-100 bg-slate-50/10"
            style={{
                backgroundColor: settings.backgroundColor || '#ffffff',
                minHeight: settings.minHeight || '600px',
            }}
        >
            {/* GUIAS */}
            {showGuides.x && <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-500/50 z-50 pointer-events-none" />}
            {showGuides.y && <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/50 z-50 pointer-events-none" />}

            <div className="relative w-full h-full min-h-[600px]">
                {children.map((item) => {
                    const resolved = resolveElement(item, currentBreakpoint);
                    
                    return (
                        <Rnd
                            key={item.id}
                            size={{ width: resolved.box.width, height: resolved.box.height }}
                            position={{ x: resolved.box.x, y: resolved.box.y }}
                            bounds="parent"
                            cancel="[contenteditable='true']"
                            onDragStop={(e, d) => {
                                setShowGuides({ x: false, y: false });
                                updateBlock(item.id, { x: d.x, y: d.y });
                            }}
                            onResizeStop={(e, dir, ref, delta, pos) => {
                                updateBlock(item.id, { 
                                    width: ref.style.width, 
                                    height: ref.style.height, 
                                    ...pos 
                                });
                            }}
                            className="z-20"
                        >
                            <div className="w-full h-full group ring-1 ring-blue-400/20 hover:ring-blue-500 transition-all">
                                {/* TOOLBAR */}
                                <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 z-[60] flex gap-1">
                                    <button 
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => updateContent({ children: children.filter(c => c.id !== item.id) })} 
                                        className="p-1 bg-red-500 text-white rounded shadow hover:bg-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {/* CONTEÚDO */}
                                <EditableElement 
                                    item={item} 
                                    resolved={resolved} 
                                    updateBlock={updateBlock} 
                                    isAdmin={isAdmin}
                                />
                            </div>
                        </Rnd>
                    );
                })}
            </div>

            <AdminButtons updateContent={updateContent} children={children} />
        </section>
    );
}

