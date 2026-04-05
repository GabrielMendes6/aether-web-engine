import React from 'react';
import { Plus, MoveVertical, Trash2, Edit3 } from 'lucide-react';

export default function AdminControls({ onMoveUp, onMoveDown, onAdd, onDelete }) {
  return (
    <div className="absolute -top-4 right-4 z-50 flex gap-2 animate-in fade-in slide-in-from-top-2">
      <div className="flex bg-[#0f172a] border border-blue-500/30 rounded-lg shadow-2xl p-1 overflow-hidden">
        <button onClick={onMoveUp} className="p-2 hover:bg-blue-600 text-white transition-colors" title="Subir">
          <MoveVertical size={14} className="rotate-180" />
        </button>
        <button onClick={onMoveDown} className="p-2 hover:bg-blue-600 text-white transition-colors border-l border-slate-700" title="Descer">
          <MoveVertical size={14} />
        </button>
        <button onClick={onAdd} className="p-2 hover:bg-green-600 text-white transition-colors border-l border-slate-700" title="Adicionar Sessão">
          <Plus size={14} />
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-red-600 text-white transition-colors border-l border-slate-700" title="Excluir">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}