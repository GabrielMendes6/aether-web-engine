import React from 'react';
import ProdutoItem from '../../../components/ProdutoItem';

export default function ProductGridEditor({ item, resolved, onChange, allProducts, loading }) {
    const { style } = resolved;

    console.log("here");

    // Fallback: se estiver carregando ou vazio, mostra placeholders para o editor não sumir
    const displayProducts = allProducts?.length > 0
        ? allProducts
        : Array(item.props?.limit || 4).fill({ id: 'temp', name: 'Carregando...', price: 0 });

    return (
        <div className="w-full h-full p-4 border-2 border-dashed border-blue-100 bg-blue-50/10">
            <div className="w-full mb-8 text-center">
                <h2
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onMouseDown={(e) => e.stopPropagation()} // Permite focar sem arrastar
                    onBlur={(e) => onChange?.(item.id, { value: e.target.innerText })}
                    className="text-2xl font-bold outline-none focus:ring-2 ring-blue-300 rounded px-2 inline-block"
                    style={{ color: style?.color }}
                >
                    {item.title || "Título da Vitrine"}
                </h2>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
                {displayProducts.map((prod, idx) => (
                    <ProdutoItem
                        key={prod.id === 'temp' ? `idx-${idx}` : prod.id}
                        prod={prod}
                        item={item}
                        isEditing={true}
                        onChange={onChange}
                    />
                ))}
            </div>
        </div>
    );
}