import React, { useState, useEffect } from 'react';
import ProductGridEditor from './ProductGridEditor';
import ProductGridView from './ProductGridView';
import api from '../../../Services/api';

export default function ProductGrid(props) {
    // 1. CORREÇÃO DA VALIDAÇÃO: Deve bater com o 'name' do AVAILABLE_COMPONENTS
    if (!props?.item || props.item.type !== 'ProductGrid') {
        return null;
    }

    const { item, isEditing, resolved, onChange } = props;
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        // 2. ACESSO AOS DADOS: No seu DB, eles estão na raiz do 'item'
        const mode = item.mode || 'random';
        // Buscamos colunas de dentro de style conforme seu defaultContent
        const limit = item.style?.columns || 4;
        const categoryId = item.categoryId;
        const produtos = item.produtos || [];

        const syncProducts = async () => {
            const isAutoMode = mode === 'random' || mode === 'category';
            const isEmpty = !produtos || produtos.length === 0;

            if (isAutoMode && isEmpty) {
                try {
                    setLoading(true);
                    const params = new URLSearchParams({
                        mode: mode,
                        limit: limit.toString(),
                        category_id: categoryId || ''
                    });

                    const res = await api.get(`/api/products/mode?${params.toString()}`);
                    const fetched = res.data.products || [];

                    if (isMounted && fetched.length > 0) {
                        setProductsData(fetched);
                        const newProdutosJson = fetched.map(p => ({ id: p.id, style: {} }));

                        // 3. ATUALIZAÇÃO: Enviamos de volta para o DB na estrutura correta
                        onChange?.(item.id, { produtos: newProdutosJson });
                    }
                } catch (err) {
                    console.error("Erro ProductGrid Fetch:", err);
                } finally {
                    if (isMounted) setLoading(false);
                }
            } else if (!isEmpty) {
                const savedIds = produtos.map(p => p.id);
                try {
                    const res = await api.get(`/api/products/mode?mode=manual&ids=${savedIds.join(',')}`);
                    if (isMounted) {
                        setProductsData(res.data.products || []);
                    }
                } catch (err) {
                    console.error("Erro ProductGrid Manual:", err);
                } finally {
                    if (isMounted) setLoading(false);
                }
            }
        };

        syncProducts();
        return () => { isMounted = false; };

        // Sincroniza quando o ID ou a lista de produtos mudar
    }, [item.id, item.produtos?.length, item.mode]);

    return isEditing ? (
        <ProductGridEditor {...props} allProducts={productsData} loading={loading} />
    ) : (
        <ProductGridView {...props} allProducts={productsData} loading={loading} />
    );
}