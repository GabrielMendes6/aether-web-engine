import React from 'react';
import { Type, RectangleHorizontal, ImageIcon, TableIcon, List, Link2, Form, TextCursorInput } from 'lucide-react';

export default function AdminButtons({updateContent, children}) {
    // ADD COM ID ÚNICO
    const addNewBlock = (type) => {
        const baseStyle = { textAlign: 'center', width: '100%' };

        const blockTemplates = {
            text: {
                id: crypto.randomUUID(),
                type: 'text',
                value: 'Novo Texto',
                style: { ...baseStyle, color: '#1e293b', fontSize: '24px', fontWeight: '700' }
            },
            button: {
                id: crypto.randomUUID(),
                type: 'button',
                value: 'Clique Aqui',
                url: '#',
                style: { ...baseStyle, backgroundColor: '#3b82f6', color: '#fff', borderRadius: '12px', width: 'fit-content' }
            },
            image: {
                id: crypto.randomUUID(),
                type: 'image',
                url: '',
                style: { ...baseStyle, borderRadius: '16px', maxWidth: '500px' }
            },
            table: {
                id: crypto.randomUUID(),
                type: 'table',
                rows: [['Item', 'Valor'], ['Exemplo', '0']],
                style: { ...baseStyle, borderColor: '#e2e8f0', zebra: true }
            },
            list: {
                id: crypto.randomUUID(),
                type: 'list',
                listTag: 'ul',
                layout: 'column',
                items: [
                    { text: 'Item 1', isLink: false, url: '' },
                    { text: 'Item 2', isLink: false, url: '' }
                ],
                style: { ...baseStyle, gap: '8px ', color: '#1e293b' }
            },
            link: {
                id: crypto.randomUUID(),
                type: 'link',
                linkTag: 'a',
                url: 'https://exemple.com',
                value: "Saiba Mais",
                icon: 'Link2',
                style: { ...baseStyle, color: '#2563eb', fontWeight: '600', textDecoration: 'underline' }
            },
            input: {
                id: crypto.randomUUID(),
                type: 'input',
                label: 'Nome Completo',
                placeholder: 'Digite aqui...',
                inputType: 'text', // text, email, tel, number
                name: 'user_name', // Nome do campo para o banco de dados/form
                required: false,
                style: { ...baseStyle, borderRadius: '8px', border: '1px solid #e2e8f0' }
            },
            form: {
                id: crypto.randomUUID(),
                type: 'form',
                title: 'Formulário de Contato',
                actionType: 'email', // email, whatsapp, api (webhook)
                destination: '', // E-mail, número ou URL da API
                submitText: 'Enviar Dados',
                successMessage: 'Obrigado! Recebemos suas informações.',
                style: { ...baseStyle, padding: '20px', backgroundColor: '#f8fafc', borderRadius: '24px' }
            },
        };

        if (blockTemplates[type]) {
            updateContent({ children: [...children, blockTemplates[type]] });
        }
    };

    return(
        <div className="mt-10 flex justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/section:translate-y-0">
            <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-md border border-slate-200 p-2.5 rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">

                <button
                    onClick={() => addNewBlock('text')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <Type size={16} className="group-hover/btn:scale-110 transition-transform" /> Texto
                </button>

                <button
                    onClick={() => addNewBlock('button')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <RectangleHorizontal size={16} className="group-hover/btn:scale-110 transition-transform" /> Botão
                </button>

                <button
                    onClick={() => addNewBlock('image')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <ImageIcon size={16} className="group-hover/btn:scale-110 transition-transform" /> Imagem
                </button>

                <button
                    onClick={() => addNewBlock('table')}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <TableIcon size={16} className="group-hover/btn:scale-110 transition-transform" /> Tabela
                </button>

                <button
                    onClick={() => addNewBlock('list')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <List size={16} className="group-hover/btn:scale-110 transition-transform" /> Lista
                </button>

                <button
                    onClick={() => addNewBlock('link')}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <Link2 size={16} className="group-hover/btn:scale-110 transition-transform" /> Link
                </button>
                <button
                    onClick={() => addNewBlock('input')}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transiction-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <Form size={16} className="group-hover/btn:scale-110 transition-transform" /> Formulario
                </button>
                <button
                    onClick={() => addNewBlock('form')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transiction-all duration-300 font-black text-[10px] uppercase tracking-wider group/btn"
                >
                    <TextCursorInput size={16} className="group-hover/btn:scale-110 transition-transform" /> Input
                </button>

            </div>
        </div>
    )

}