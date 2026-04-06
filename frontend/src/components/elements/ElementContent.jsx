export default function ElementContent({ item, resolved, isEditing, onChange }) {
    const { style, box } = resolved;

    // Configurações extraídas do resolved (conforme seu styleResolver)
    const CustomTag = style.tag || item.props?.tag || 'p';
    const ListTag = style.listTag || 'ul';

    const commonProps = {
        style: {
            // No modo de exibição, o texto deve fluir conforme o alinhamento
            textAlign: style.textAlign,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
            color: style.color,
            width: '100%',
            height: 'auto',
            outline: 'none',
        },
        contentEditable: isEditing,
        suppressContentEditableWarning: true,
        onBlur: (e) => {
            if (!isEditing) return;
            // Mantendo sua estrutura de atualização
            onChange?.(item.id, {
                value: e.target.innerText 
            });
        },
        className: "outline-none"
    };

    switch (item.type) {
        case 'text':
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <CustomTag {...commonProps}>
                        {item.value}
                    </CustomTag>
                </div>
            );

        case 'image':
            return (
                <div className="w-full h-full">
                    <img
                        src={item.url || item.props?.url}
                        style={{ borderRadius: style.borderRadius }}
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                    />
                </div>
            );

        case 'button':
            return (
                <div
                    style={{
                        ...style,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isEditing ? 'move' : 'pointer'
                    }}
                >
                    <span {...commonProps} style={{ ...commonProps.style, width: 'auto', cursor: 'text' }}>
                        {item.value}
                    </span>
                </div>
            );

        case 'list':
            return (
                <div 
                    className="w-full h-full flex flex-col justify-center px-4"
                    style={{ 
                        alignItems: style.textAlign === 'center' ? 'center' : 
                                   style.textAlign === 'right' ? 'flex-end' : 'flex-start' 
                    }}
                >
                    <ListTag
                        style={{
                            ...style,
                            listStylePosition: 'inside',
                            display: 'flex',
                            flexDirection: item.layout === 'row' ? 'row' : 'column',
                            gap: style.gap || '10px',
                            width: '100%'
                        }}
                        className="space-y-1"
                    >
                        {item.items?.map((li, idx) => (
                            <li key={idx} style={{ textAlign: 'inherit' }}>
                                <span
                                    contentEditable={isEditing}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                        if (!isEditing) return;
                                        const newItems = [...item.items];
                                        newItems[idx] = { ...li, text: e.target.innerText };
                                        onChange?.(item.id, { items: newItems });
                                    }}
                                    className="outline-none"
                                >
                                    {li.text}
                                </span>
                            </li>
                        ))}
                    </ListTag>
                </div>
            );

        case 'link':
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <a 
                        href={isEditing ? undefined : item.url}
                        {...commonProps}
                        className="hover:underline"
                    >
                        {item.value}
                    </a>
                </div>
            );

        default:
            return null;
    }
}