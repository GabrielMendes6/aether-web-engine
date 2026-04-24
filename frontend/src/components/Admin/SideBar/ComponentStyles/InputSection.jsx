export default function RenderInputSection({block, idx, updateBlock}) {
    return (
        <div className="space-y-4 p-4 bg-emerald-50/30 rounded-[24px] border border-emerald-100 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Label</label>
                    <input 
                        type="text" 
                        value={block.label || ''} 
                        onChange={(e) => updateBlock(idx, { label: e.target.value })} 
                        className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">ID do Campo</label>
                    <input 
                        type="text" 
                        value={block.name || ''} 
                        onChange={(e) => updateBlock(idx, { name: e.target.value })} 
                        placeholder="ex: nome_cliente"
                        className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-mono text-emerald-600 outline-none" 
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Tipo de Entrada</label>
                <select 
                    value={block.inputType || 'text'} 
                    onChange={(e) => updateBlock(idx, { inputType: e.target.value })}
                    className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-black uppercase outline-none focus:border-emerald-500"
                >
                    <option value="text">Texto Simples</option>
                    <option value="email">E-mail</option>
                    <option value="tel">Telefone / WhatsApp</option>
                    <option value="number">Número</option>
                    <option value="password">Senha</option>
                </select>
            </div>
        </div>
    )
};