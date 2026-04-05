import {
    Image as ImageIcon, Link2
} from 'lucide-react';


export default function RenderLinkSection({block, idx, updateBlock}) { 

    return (
        <div className="space-y-4 p-4 bg-blue-50/30 rounded-[24px] border border-blue-100 animate-in fade-in duration-300">
            <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-tighter">
                    Texto de Exibição
                </label>
                <input 
                    type="text" 
                    value={block.value || ''} 
                    onChange={(e) => updateBlock(idx, { value: e.target.value })} 
                    className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    placeholder="Ex: Saiba Mais"
                />
            </div>
    
            <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-tighter">
                    URL de Destino
                </label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <div className="p-1.5 bg-blue-500 text-white rounded-lg">
                        <Link2 size={12} />
                    </div>
                    <input 
                        type="text" 
                        value={block.url || ''} 
                        onChange={(e) => updateBlock(idx, { url: e.target.value })} 
                        placeholder="https://..."
                        className="w-full bg-transparent border-none text-[11px] font-bold outline-none text-blue-600 placeholder:text-slate-300" 
                    />
                </div>
            </div>
        </div>
    )
};