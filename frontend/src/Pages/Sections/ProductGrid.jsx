import React, { useState, useEffect, useMemo } from 'react';
import api from '../../Services/api';
import { Plus, X, Trash2, AlertCircle, Shuffle, Tag } from 'lucide-react';

export default function ProductGrid({
    title: initialTitle,
    produtos = [],
    style: sectionStyle = {},
    isAdmin,
    updateContent
}) {
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);

    const {
        mode = sectionStyle?.mode || 'random', // 'manual', 'random', ou 'category'
        categoryId = null,
        limit = 8,
        gap = '24px',
        columns = 4,
        titleColor = '#1e293b',
        priceColor = '#ea580c',
        cardRadius = '32px',
        cardBg = '#ffffff'
    } = sectionStyle;

    const [localTitle, setLocalTitle] = useState(initialTitle || 'Novo Título');


    useEffect(() => {
        let isMounted = true;
        console.log(sectionStyle);

        const syncProducts = async () => {
            try {
                setLoading(true);

                // 1. Pegamos os IDs que já estão salvos no JSON da seção
                const savedIds = (produtos || []).map(p => p.id);

                // 2. DEFINIÇÃO DA ESTRATÉGIA DE BUSCA:
                // Se já temos produtos salvos no JSON, nós NÃO queremos novos aleatórios.
                // Queremos buscar os DADOS desses IDs específicos, independente do modo original.
                const shouldFetchSpecificIds = savedIds.length > 0;

                const params = new URLSearchParams();

                if (shouldFetchSpecificIds) {
                    // Se já tem algo salvo, força a busca pelos IDs exatos
                    params.append('mode', 'manual');
                    params.append('ids', savedIds.join(','));
                    console.log("🎯 [Grid] Buscando dados dos IDs salvos no JSON:", savedIds);
                } else {
                    // Se o JSON está vazio (primeira vez), usa a configuração do Sidebar
                    params.append('mode', mode);
                    params.append('limit', limit.toString());
                    if (categoryId) params.append('category_id', categoryId);
                    console.log("🎲 [Grid] JSON vazio. Buscando novos produtos no modo:", mode);
                }

                const res = await api.get(`/api/products/mode?${params.toString()}`);
                const fetched = res.data.products || [];

                if (isMounted) {
                    setProductsData(fetched);

                    // 3. SE O BANCO ESTAVA VAZIO: 
                    // Agora salvamos esses primeiros resultados para "congelar" a vitrine
                    if (!shouldFetchSpecificIds && fetched.length > 0) {
                        console.log("💾 [Grid] Primeira carga detectada. Salvando no JSON...");
                        const newProdutosJson = fetched.map(p => ({ id: p.id, style: {} }));
                        updateContent({ produtos: newProdutosJson });
                    }

                    setLoading(false);
                }
            } catch (err) {
                console.error("❌ [Grid Error]:", err);
                if (isMounted) setLoading(false);
            }
        };

        syncProducts();
        return () => { isMounted = false; };

        // Gatilhos de re-renderização
    }, [mode, categoryId, limit, mode === 'manual' ? JSON.stringify(produtos) : null]);
    // 2. Funções de Manipulação
    const handleRemoveProduct = (idToRemove) => {
        if (!isAdmin) return;
        const updated = produtos.filter(p => p.id !== idToRemove);
        updateContent({ produtos: updated });
    };

    const handleTitleBlur = (e) => {
        if (!isAdmin) return;
        updateContent({ title: e.target.innerText });
    };

    return (
        <section className="py-12 relative group/section">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header com Badge de Modo para o Admin */}
                <div className="mb-10 flex items-center gap-4">
                    <div className="flex flex-col">
                        {isAdmin && (
                            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                                {mode === 'manual' ? <Plus size={10} /> : mode === 'random' ? <Shuffle size={10} /> : <Tag size={10} />}
                                Modo {mode}
                            </span>
                        )}
                        <h1
                            contentEditable={isAdmin}
                            suppressContentEditableWarning
                            onBlur={handleTitleBlur}
                            style={{ color: titleColor }}
                            className={`bg-transparent font-black uppercase italic text-3xl outline-none ${isAdmin ? 'hover:bg-blue-50 p-1 rounded-lg transition-colors' : ''}`}
                        >
                            {localTitle}
                        </h1>
                    </div>
                    <div className="h-[2px] flex-1 bg-slate-100"></div>
                </div>

                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap: gap
                    }}
                >
                    {/* Renderizamos com base no ARRAY 'produtos' do JSON para manter a ordem/estilo */}
                    {produtos.map((item) => {
                        const dbInfo = productsData.find(p => p.id === item.id);
                        const isIndisponivel = !dbInfo;

                        if (isIndisponivel && !isAdmin) return null;

                        return (
                            <div
                                key={item.id}
                                className="relative transition-all duration-300 group/card"
                                style={{
                                    backgroundColor: cardBg,
                                    borderRadius: cardRadius,
                                    padding: '16px',
                                    border: `1px solid #f1f5f9`,
                                    ...item.style
                                }}
                            >
                                {isAdmin && (
                                    <button
                                        onClick={() => handleRemoveProduct(item.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full z-30 shadow-lg opacity-0 group-hover/card:opacity-100 transition-all hover:scale-110"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}

                                {isIndisponivel && isAdmin && (
                                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 rounded-[inherit] flex flex-col items-center justify-center text-red-500 p-4 text-center">
                                        <AlertCircle size={20} />
                                        <span className="font-black text-[9px] uppercase mt-1">Fora de Linha</span>
                                    </div>
                                )}

                                <div className="aspect-square mb-4 overflow-hidden rounded-[20px] bg-slate-50">
                                    <img
                                        src={dbInfo?.image_url || 'https://via.placeholder.com/400'}
                                        className={`w-full h-full object-cover ${isIndisponivel ? 'grayscale opacity-30' : ''}`}
                                    />
                                </div>

                                <h3 style={{ color: titleColor }} className="font-bold text-sm truncate">
                                    {dbInfo?.name || `ID: ${item.id}`}
                                </h3>
                                <p style={{ color: priceColor }} className="font-black text-lg">
                                    {dbInfo ? `R$ ${dbInfo.sale_price || dbInfo.price}` : '---'}
                                </p>
                            </div>
                        );
                    })}

                    {/* Botão de Adicionar (Só aparece no modo manual para não quebrar a lógica automática) */}
                    {isAdmin && mode === 'manual' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[200px] hover:border-blue-400 hover:bg-blue-50 transition-all rounded-[32px]"
                        >
                            <Plus className="text-slate-400" />
                            <span className="text-[10px] font-bold uppercase mt-2">Vincular</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Modal de Busca */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[40px] p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-black uppercase text-sm">Catálogo de Produtos</h2>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <input
                            placeholder="Pesquisar..."
                            className="w-full p-4 bg-slate-100 rounded-2xl mb-4 outline-none focus:ring-2 ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
                            {availableProducts.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        if (!produtos.find(i => i.id === p.id)) {
                                            updateContent({ produtos: [...produtos, { id: p.id, style: {} }] });
                                        }
                                        setIsModalOpen(false);
                                    }}
                                    className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-2xl cursor-pointer border border-transparent hover:border-blue-200"
                                >
                                    <img src={p.image_url} className="w-10 h-10 rounded-lg object-cover" />
                                    <span className="font-bold text-xs">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}