import {
    Image as ImageIcon, Trash2, UploadCloud, Maximize
} from 'lucide-react';

export default function RenderImageSection({ block, idx, handleFileUpload, updateBlockStyle, updateBlock }) {
    return (
        <div className="space-y-5 animate-in slide-in-from-right-2 duration-300">
            {/* PREVIEW E UPLOAD */}
            <div className="relative group/img aspect-video bg-slate-100 rounded-[32px] overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all shadow-inner flex items-center justify-center">
                {block.url ? (
                    <>
                        <img 
                            src={block.url} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
                            alt="Preview" 
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center transition-all z-20">
                            <UploadCloud className="text-white mb-2 animate-bounce" size={24} />
                            <span className="text-[9px] text-white font-black uppercase tracking-widest">Trocar Imagem</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileUpload(idx, e.target.files[0])} 
                                className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                            />
                        </div>
                        {/* BOTÃO PARA RESETAR URL */}
                        <button 
                            onClick={() => updateBlock(idx, { url: '' })}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110 z-40"
                        >
                            <Trash2 size={14} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300">
                            <ImageIcon size={32} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Nenhuma Imagem</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(idx, e.target.files[0])} 
                            className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                        />
                    </div>
                )}
            </div>

            {/* CONTROLES DE ESTILO ESPECÍFICOS */}
            <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-4 rounded-[24px] border border-slate-100">
                <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">
                            <Maximize size={12} /> Arredondamento
                        </label>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                            {block.style?.borderRadius || '0px'}
                        </span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Ex: 24px ou 50%"
                        value={block.style?.borderRadius || ''} 
                        onChange={(e) => updateBlockStyle(idx, { borderRadius: e.target.value })} 
                        className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500 transition-colors shadow-sm" 
                    />
                </div>
            </div>
        </div>
    )
};