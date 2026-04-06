import React from 'react';
import { Rnd } from "react-rnd";

export default function ProdutoItem({ prod, item, isEditing, onChange }) {

    const cardStyle = item.cardStyle || item.style?.cardStyle || {
        width: '280px',
        height: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '0px'
    };

    const Content = (
        <div 
            className={`flex flex-col h-full w-full overflow-hidden border border-slate-100 shadow-sm transition-all ${!isEditing ? 'hover:shadow-md' : ''}`}
            style={{ 
                backgroundColor: cardStyle.backgroundColor,
                borderRadius: cardStyle.borderRadius,
            }}
        >
            {/* Imagem - O usuário não edita a imagem aqui, ela vem do banco */}
            <div className="relative flex-1 bg-slate-50 overflow-hidden">
                <img 
                    src={prod.image || 'https://via.placeholder.com/300'} 
                    className="w-full h-full object-cover pointer-events-none select-none" 
                    alt={prod.name}
                />
            </div>

            {/* Info do Produto - Conteúdo fixo (Vindo do Banco) */}
            <div className="p-4 flex flex-col gap-1">
                <h4 className="font-bold text-slate-800 truncate text-sm">
                    {prod.name || 'Nome do Produto'}
                </h4>
                <p className="text-blue-600 font-bold">
                    R$ {prod.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-2 w-full py-2 bg-slate-900 text-white text-[10px] uppercase font-bold text-center rounded">
                    Ver Detalhes
                </div>
            </div>
        </div>
    );

    if (!isEditing) {
        return (
            <div style={{ width: cardStyle.width, height: cardStyle.height }}>
                {Content}
            </div>
        );
    }

    return (
        <Rnd
            size={{ width: cardStyle.width, height: cardStyle.height }}
            // No grid de produtos, o arraste individual costuma ser desativado 
            // para manter a ordem, mas o redimensionamento é liberado.
            disableDragging={true} 
            enableResizing={{ bottomRight: true, right: true, bottom: true }}
            onResizeStop={(e, dir, ref, delta, pos) => {
                onChange?.(item.id, {
                    props: {
                        ...item.props,
                        cardStyle: {
                            ...cardStyle,
                            width: ref.style.width,
                            height: ref.style.height
                        }
                    }
                });
            }}
            className="relative group ring-1 ring-blue-400 ring-offset-2"
        >
            {Content}
            {/* Label indicativa no Editor */}
            <div className="absolute -top-6 left-0 text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded shadow">
                Estilo do Card
            </div>
        </Rnd>
    );
}