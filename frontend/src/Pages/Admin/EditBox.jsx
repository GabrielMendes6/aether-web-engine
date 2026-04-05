import React from 'react';
import Input from '../../components/Input';

export default function EditBox() {
  return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="max-w-2xl">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Informações da Box</h3>
          
          <form className="space-y-6">
            <Input label="Nome da Box" placeholder="Ex: Box Premium de Vinho" />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Preço de Venda" type="number" placeholder="R$ 0,00" />
              <Input label="Estoque Disponível" type="number" placeholder="0" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase text-slate-500 ml-1">Descrição</label>
              <textarea 
                className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all min-h-[120px] text-sm"
                placeholder="Descreva o que vem na box..."
              ></textarea>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Salvar Alterações
              </button>
              <button className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                Descartar
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}