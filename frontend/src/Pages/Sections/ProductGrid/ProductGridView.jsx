import React from 'react';

export default function ProductGridView({ item, resolved, allProducts, loading }) {
    if (loading && allProducts.length === 0) return null; // Ou um Shimmer/Skeleton
    if (allProducts.length === 0) return null; // Não renderiza seção vazia no site

    const { style } = resolved;
    const cardStyle = item.props?.cardStyle || { width: '250px', height: '380px' };

    return (
        <section className="w-full py-12" style={{ backgroundColor: style?.backgroundColor }}>
            <div className="max-w-7xl mx-auto px-4">
                <h2 
                    className="text-3xl font-bold mb-10" 
                    style={{ color: style?.color, textAlign: style?.textAlign || 'center' }}
                >
                    {item.title}
                </h2>

                <div 
                    className="flex flex-wrap gap-8"
                    style={{ justifyContent: style?.textAlign === 'center' ? 'center' : 'flex-start' }}
                >
                    {allProducts.map((prod) => (
                        <div 
                            key={prod.id} 
                            style={{ 
                                width: cardStyle.width, 
                                height: cardStyle.height,
                                backgroundColor: cardStyle.backgroundColor || '#fff',
                                borderRadius: cardStyle.borderRadius || '12px'
                            }}
                            className="flex flex-col shadow-sm overflow-hidden border border-slate-100"
                        >
                            <div className="flex-1 bg-slate-50">
                                <img src={prod.image} className="w-full h-full object-cover" alt={prod.name} />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 truncate">{prod.name}</h3>
                                <p className="text-blue-600 font-bold">R$ {prod.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}