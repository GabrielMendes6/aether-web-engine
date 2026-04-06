import React, { useState, useEffect } from 'react';
import ProductGridEditor from './ProductGridEditor';
import ProductGridView from './ProductGridView';
import api from '../../../Services/api';

export default function ProductGrid(props) {
    // 1. Desestruturação correta com base no PageRenderer
    // O PageRenderer passa: {...section.content}, isAdmin, updateContent, etc.
    const { 
        isAdmin, 
        updateContent, 
        title, 
        style, 
        produtos = [], 
        mode = 'random',
        categoryId = null
    } = props;

    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        // Definimos o limite com base no style enviado pelo DB ou padrão 4
        const limit = style?.columns || 4;

        const syncProducts = async () => {
            const isAutoMode = mode === 'random' || mode === 'category';
            const isEmpty = !produtos || produtos.length === 0;

            try {
                setLoading(true);
                let endpoint = '';

                if (isAutoMode && isEmpty) {
                    const params = new URLSearchParams({
                        mode: mode,
                        limit: limit.toString(),
                        category_id: categoryId || ''
                    });
                    endpoint = `/api/products/mode?${params.toString()}`;
                } else if (!isEmpty) {
                    const savedIds = produtos.map(p => p.id).join(',');
                    endpoint = `/api/products/mode?mode=manual&ids=${savedIds}`;
                } else {
                    // Caso não tenha produtos e não seja auto, para o loading
                    setLoading(false);
                    return;
                }

                const res = await api.get(endpoint);
                const fetched = res.data.products || [];

                if (isMounted) {
                    setProductsData(fetched);
                    
                    // Se buscou automático e está no modo admin, sincroniza os IDs para o banco
                    if (isAutoMode && isEmpty && fetched.length > 0) {
                        const newProdutosJson = fetched.map(p => ({ id: p.id, style: {} }));
                        updateContent?.({ produtos: newProdutosJson });
                    }
                }
            } catch (err) {
                console.error("Erro no fetch de produtos:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        syncProducts();
        return () => { isMounted = false; };

    }, [mode, categoryId, produtos?.length, style?.columns]);

    // 2. Renderização Decisiva
    // O isAdmin controla se exibimos o Editor ou a View
    return isAdmin ? (
        <ProductGridEditor 
            {...props} 
            allProducts={productsData} 
            loading={loading} 
        />
    ) : (
        <ProductGridView 
            {...props} 
            allProducts={productsData} 
            loading={loading} 
        />
    );
}