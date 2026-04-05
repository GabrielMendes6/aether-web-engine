import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../Services/api';
import HomeRenderer from '../components/Admin/PageRenderer';
import { AuthContext } from '../Context/AuthProvider';
import { Save, Loader2 } from 'lucide-react';

export default function Home() {
    const [sections, setSections] = useState([]);
    const [loadingHome, setLoadingHome] = useState(true);
    const { user, loading: authLoading } = useContext(AuthContext);

    // Contador de renderização para o console
    const renderCount = useRef(0);
    renderCount.current++;

    console.log(`[RENDER Home #${renderCount.current}] User:`, user?.email, "AuthLoading:", authLoading);

    useEffect(() => {
        console.log("[EFFECT] Buscando seções no Laravel...");
        api.get('http://localhost/home/sections')
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [];
                console.log("[EFFECT] Dados recebidos:", data.length, "seções");
                setSections(data);
            })
            .catch(err => console.error("[ERROR] Falha na busca:", err))
            .finally(() => setLoadingHome(false));
    }, []); // Array vazio garante que só rode uma vez ao montar

    const handleReorder = (index, direction) => {
        const newSections = [...sections];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        setSections(newSections);
    };

    if (authLoading || loadingHome) {
        return <div className="p-20 text-center">Iniciando Jarvis...</div>;
    }

    return (
        <div className="min-h-screen bg-white relative">
            <HomeRenderer
                sections={sections}
                onReorder={handleReorder}
                onEdit={(s) => console.log("Edit:", s.id)}
                onDelete={(id) => setSections(sections.filter(s => s.id !== id))}
            />
        </div>
    );
}