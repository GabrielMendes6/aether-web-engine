import React, { useState } from 'react';
import { Rnd } from "react-rnd"
import { Trash2, Type, ImageIcon, Table as TableIcon, GripVertical, Columns, Rows, List, Link2, TextCursorInput, Form } from 'lucide-react';
import AdminButtons from '../../components/Admin/AdminButtons';

export default function FlexSection({ settings, children = [], isAdmin, updateContent, currentBreakpoint }) {
    const [showGuides, setShowGuides] = useState({ x: false, y: false });
    const [isHovered, setIsHovered] = useState(false);

    const s = settings || {};

    const sectionStyle = {
        backgroundColor: s.backgroundColor || '#ffffff',
        backgroundImage: s.backgroundImage ? `url(${s.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: s.minHeight || '200px',
        position: 'relative',
        overflow: 'hidden',
    };

    const updateBlock = (id, newData) => {
        if (!isAdmin) return;

        const newChildren = children.map((item) => {
            if (item.id === id) {
                // Pega o estado atual ou define o padrão desktop
                const b = item.breakpoints || {
                    desktop: {
                        x: item.x || 0,
                        y: item.y || 0,
                        width: item.style?.width || '300px',
                        height: item.style?.height || 'auto'
                    }
                };

                // Criamos a nova configuração para o breakpoint ativo
                const currentConfig = b[currentBreakpoint] || b.desktop;

                const updatedBreakpointConfig = {
                    ...currentConfig,
                    ...newData // Aqui entram x, y, width, height vindos do Rnd
                };

                return {
                    ...item,
                    // Mantém o root sincronizado se for desktop (opcional, para legado)
                    x: currentBreakpoint === 'desktop' ? (newData.x ?? item.x) : item.x,
                    y: currentBreakpoint === 'desktop' ? (newData.y ?? item.y) : item.y,

                    breakpoints: {
                        ...b,
                        [currentBreakpoint]: updatedBreakpointConfig
                    }
                };
            }
            return item;
        });

        updateContent({ children: newChildren });
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const handleKeyDown = (e) => {
        // Evita que o "Enter" crie novas <div> dentro do componente
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur(); // Opcional: fecha a edição ao dar Enter
        }
    };

    // Para Tabelas
    const addNewRow = (id) => {
        const block = children.find(c => c.id === id);
        if (!block || !block.rows) return;

        // Usamos o comprimento da primeira linha para criar a nova com o mesmo número de colunas
        const newRow = new Array(block.rows[0].length).fill('Novo Item');
        updateBlock(id, { rows: [...block.rows, newRow] });
    };

    const addNewColumn = (id) => {
        const block = children.find(c => c.id === id);

        if (!block || !block.rows) return

        const newRows = block.rows.map(row => [...row, 'Novo']);
        updateBlock(id, { rows: newRows });
    }

    const handleDrag = (id) => {
        if (!isAdmin) return;
        const dragElement = document.querySelector(`[data-id="${id}"]`);
        const sectionElement = document.getElementById(`section-${s.id || 'main'}`);
        if (!dragElement || !sectionElement) return;

        const rect = dragElement.getBoundingClientRect();
        const sectionRect = sectionElement.getBoundingClientRect();
        const objectCenterX = rect.left - sectionRect.left + (rect.width / 2);
        const objectCenterY = rect.top - sectionRect.top + (rect.height / 2);
        const centerX = sectionRect.width / 2;
        const centerY = sectionRect.height / 2;

        const threshold = 15;
        setShowGuides({
            x: Math.abs(objectCenterX - centerX) < threshold,
            y: Math.abs(objectCenterY - centerY) < threshold
        });
    };

    return (
        <section style={sectionStyle} className="group/section relative border-none" id={`section-${s.id || 'main'}`}>
            {/* GUIAS DE ALINHAMENTO */}
            {isAdmin && showGuides.x && (
                <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-blue-500/50 z-[50] pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}
            {isAdmin && showGuides.y && (
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-blue-500/50 z-[50] pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}

            <div className="relative mx-auto w-full h-full max-w-none" style={{ minHeight: s.minHeight || '600px' }}>
                {children.map((item, idx) => {
                    const config = item.breakpoints?.[currentBreakpoint] || item.breakpoints?.desktop || {
                        x: item.x || 0,
                        y: item.y || 0,
                        width: item.style?.width || '300px',
                        height: item.style?.height || 'auto'
                    };

                    const CustomTag = config.tag || item.tag || 'p';
                    const ListTag = item.listTag || 'ul'

                    return (
                        <Rnd
                            key={item.id}
                            data-id={item.id}
                            size={{ width: config.width, height: config.height }}
                            position={{ x: config.x, y: config.y }}
                            disableDragging={!isAdmin}
                            enableResizing={isAdmin}
                            bounds='parent'
                            style={{ zIndex: item.zIndex || 1 }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                // IMPORTANTE: Capturamos a nova largura, altura e a posição (que pode mudar no resize)
                                updateBlock(item.id, {
                                    width: ref.style.width,
                                    height: ref.style.height,
                                    x: position.x,
                                    y: position.y
                                });
                            }}
                            dragHandleClassName='drag-handle-area'
                            onDrag={(e, d) => {
                                handleDrag(item.id, d);
                            }}
                            onDragStop={(e, d) => {
                                setShowGuides({ x: false, y: false }); // Esconde ao soltar
                                updateBlock(item.id, { x: d.x, y: d.y });
                            }}
                        >
                            <div className={`w-full h-full relative group/item drag-handle-area transiction-all duration-200 ${isAdmin ? 'ring-2 ring-blue400/50 bg-blue-50/5 rounded-sm' : ''}`}>

                                {isAdmin && (
                                    <div className="absolute -top-8 left-0 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-all z-[100]">
                                        <div className='p-1 bg-blue-600 text-white rounded cursor-move'><GripVertical size={14} /></div>
                                        <button className='p-1 bg-red-500 text-white rounded' onClick={() => updateContent({ children: children.filter(c => c.id !== item.id) })}><Trash2 size={14} /></button>
                                    </div>
                                )}

                                <div className='w-full h-full flex items-center justify-center'>
                                    {item.type === 'text' && (
                                        <CustomTag className={'outline-none pointer-events-auto'}
                                            style={{
                                                ...item.style, // Estilos globais (cor, bold, etc)
                                                fontSize: config.fontSize,    // INJETANDO GEOMETRIA
                                                textAlign: config.textAlign,  // INJETANDO GEOMETRIA
                                                lineHeight: config.lineHeight,
                                                letterSpacing: config.letterSpacing,
                                                width: s.width || 'auto',
                                                height: 'auto',

                                            }}
                                            contentEditable={isAdmin}
                                            onPaste={handlePaste}
                                            onKeyDown={handleKeyDown}
                                            suppressContentEditableWarning={true}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateBlock(item.id, { value: e.target.innerText })}
                                            
                                        >
                                            {item.value}
                                        </CustomTag>
                                    )}

                                    {item.type === 'button' && (
                                        <button 
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
                                                cursor: "pointer"
                                            }}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            
                                        >
                                            <span
                                                contentEditable={isAdmin}
                                                onBlur={(e) => updateBlock(item.id, { value: e.target.innerText })}
                                                onPaste={handlePaste}
                                                onKeyDown={handleKeyDown}
                                                suppressContentEditableWarning={true}
                                            >
                                                {item.value}
                                            </span>
                                        </button>
                                    )}

                                    {item.type === 'table' && (
                                        <div className="group/table relative w-full h-full p-4 pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>

                                            {/* BOTÃO ADICIONAR COLUNA (Direita) */}
                                            {isAdmin && (
                                                <button
                                                    onClick={() => addNewColumn(item.id)}
                                                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 text-white rounded-full opacity-0 group-hover/table:opacity-100 transition-opacity shadow-lg flex items-center justify-center z-[130] hover:scale-110"
                                                    title="Adicionar Coluna"
                                                >
                                                    <Columns size={12} />
                                                </button>
                                            )}

                                            {/* BOTÃO ADICIONAR LINHA (Baixo) */}
                                            {isAdmin && (
                                                <button
                                                    onClick={() => addNewRow(item.id)}
                                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-600 text-white rounded-full opacity-0 group-hover/table:opacity-100 transition-opacity shadow-lg flex items-center justify-center z-[130] hover:scale-110"
                                                    title="Adicionar Linha"
                                                >
                                                    <Rows size={12} />
                                                </button>
                                            )}
                                            <div className="w-full h-full overflow-auto">
                                                <table className="w-full h-full border-collapse" style={{ ...item.style, border: `1px solid ${item.style?.borderColor}` }}>
                                                    <tbody>
                                                        {item.rows?.map((row, rIdx) => (
                                                            <tr key={rIdx} className={item.style?.zebra && rIdx % 2 === 0 ? 'bg-slate-50/50' : ''}>
                                                                {row.map((cell, cIdx) => (
                                                                    <td
                                                                        key={cIdx}
                                                                        contentEditable={isAdmin}
                                                                        onPaste={handlePaste}
                                                                        onKeyDown={handleKeyDown}
                                                                        suppressContentEditableWarning={true}
                                                                        onBlur={(e) => {
                                                                            const newRows = item.rows.map((r, i) =>
                                                                                i === rIdx
                                                                                    ? r.map((c, j) => (j === cIdx ? e.target.innerText : c))
                                                                                    : r
                                                                            );
                                                                            updateBlock(item.id, { rows: newRows });
                                                                        }}
                                                                        className="p-3 border text-[13px] outline-none focus:bg-blue-50/30 transition-colors"
                                                                        style={{ borderColor: item.style?.borderColor || '#e2e8f0' }}
                                                                    >
                                                                        {cell}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

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

                                    {item.type === 'list' && (
                                        <div
                                            className="w-full h-full flex flex-col justify-center px-4"
                                            style={{
                                                alignItems: config.textAlign === 'center' ? 'center' :
                                                    config.textAlign === 'right' ? 'flex-end' : 'flex-start',
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

                                                    alignItems: item.layout === 'column'
                                                        ? (config.textAlign === 'center' ? 'center' : config.textAlign === 'right' ? 'flex-end' : 'flex-start')
                                                        : 'baseline',

                                                }}
                                                className="outline-none pointer-events-auto space-y-2"
                                            >
                                                {item.items?.map((li, liIdx) => (
                                                    <li key={liIdx} className="leading-relaxed" style={{
                                                        textAlign: 'inherit',
                                                    }}>
                                                        {li.isLink ? (
                                                            <a
                                                                href={li.url || '#'}
                                                                className="hover:underline transition-all"
                                                                style={{
                                                                    color: item.style?.color || '#2563eb',
                                                                    textDecoration: li.underline ? 'underline' : 'none',
                                                                }}
                                                                onClick={(e) => isAdmin && e.preventDefault()}
                                                            >
                                                                {li.text}
                                                            </a>
                                                        ) : (
                                                            <span
                                                                style={{ textDecoration: li.underline ? 'underline' : 'none', }}
                                                                contentEditable={isAdmin}
                                                                suppressContentEditableWarning={true}
                                                                onBlur={(e) => {
                                                                    const newItems = [...item.items];
                                                                    newItems[liIdx] = { ...li, text: e.target.innerText };
                                                                    updateBlock(item.id, { items: newItems });
                                                                }}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                className="outline-none"
                                                            >
                                                                {li.text}
                                                            </span>
                                                        )}
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


                            </div>
                        </Rnd>
                    )

                })}
            </div>

            {/* ADD BAR REESTILIZADA */}
            {isAdmin && (
                <AdminButtons
                    updateContent={updateContent}
                    children={children}
                />
            )}
        </section>
    );
}