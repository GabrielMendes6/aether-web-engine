import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Services/api';
import PageRenderer from '../components/Admin/PageRenderer';
import EditorSidebar from '../components/Admin/SideBar/EditorSidebar'; // Certifique-se do caminho correto
import { Save, RotateCcw, Loader2 } from 'lucide-react';
import { AuthContext } from '../Context/AuthProvider';

export default function GenericPage() {
    const { slug } = useParams();
    const { user, isAdmin } = useContext(AuthContext);
    const pageSlug = slug || 'home';
    const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // NOVO: Estado para saber qual seção estamos editando na Sidebar
    const [editingIndex, setEditingIndex] = useState(null);

    const loadPageData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/sections/${pageSlug}`);
            setSections(res.data);
            setHasChanges(false);
        } catch (err) {
            console.error("[Jarvis] Erro ao carregar:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPageData(); }, [pageSlug]);

    useEffect(() => {
        // Se a tela física for pequena, já começa em modo mobile
        if (window.innerWidth < 768) {
            setCurrentBreakpoint('mobile');
        }
    });

    const handleReorder = (index, direction) => {
        const newSections = [...sections];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        const updated = newSections.map((s, i) => ({ ...s, order: i }));
        setSections(updated);
        setHasChanges(true);
        setEditingIndex(null); // Fecha a sidebar ao reordenar para evitar bugs de índice
    };

    const saveAllChanges = async () => {
        setIsSaving(true);
        try {
            await api.post('/api/sections/reorder', {
                sections: sections.map(s => ({ id: s.id, order: s.order, content: s.content }))
            });
            setHasChanges(false);
            setEditingIndex(null); // Fecha a sidebar após salvar
            alert("Layout sincronizado!");
        } catch (err) {
            alert("Erro ao salvar.");
        } finally { setIsSaving(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="relative min-h-screen bg-white flex overflow-x-hidden">
            
            {/* ÁREA DO SITE: Encolhe quando a sidebar abre */}
            <div className={`flex-1 transition-all duration-300 ${editingIndex !== null ? 'mr-80' : ''}`}>
                <PageRenderer 
                    sections={sections} 
                    setSections={(newList) => {
                        setSections(newList);
                        setHasChanges(true);
                    }}
                    onReorder={handleReorder}
                    onEditSection={(index) => setEditingIndex(index)} 
                    currentBreakpoint={currentBreakpoint}
                    setCurrentBreakpoint={setCurrentBreakpoint}
                    isAdmin={isAdmin}
                    slug={pageSlug}
                />
            </div>

            {/* SIDEBAR DE EDIÇÃO */}
            <EditorSidebar 
                activeSection={editingIndex !== null ? sections[editingIndex] : null}
                onClose={() => setEditingIndex(null)}
                onUpdate={(newContent) => {
                    const updated = [...sections];
                    updated[editingIndex].content = newContent;
                    setSections(updated);
                    setHasChanges(true);
                }}
                currentBreakpoint={currentBreakpoint}
                setCurrentBreakpoint={setCurrentBreakpoint}
            />

            {/* BARRA DE AÇÕES (SALVAR/DESCARTAR) */}
            {hasChanges && (
                <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
                    <button onClick={loadPageData} className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-slate-50 transition-all font-semibold text-sm">
                        <RotateCcw size={18} /> Descartar
                    </button>
                    <button onClick={saveAllChanges} disabled={isSaving} className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-bold">
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        {isSaving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
                    </button>
                </div>
            )}
        </div>
    );
}