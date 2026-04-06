export const resolveElement = (block, breakpoint) => {
    const baseStyle = block.style || {};
    const responsive = block.breakpoints?.[breakpoint] || {};

    return {
        // Estilos visuais (Cores, Fontes)
        style: {
            ...baseStyle,
            ...(responsive.style || {}),
        },
        // Geometria (Posição e Tamanho)
        box: {
            x: responsive.x ?? block.x ?? 0,
            y: responsive.y ?? block.y ?? 0,
            width: responsive.width ?? baseStyle.width ?? 'auto',
            height: responsive.height ?? baseStyle.height ?? 'auto',
            fontSize: responsive.fontSize ?? baseStyle.fontSize,
            textAlign: responsive.textAlign ?? baseStyle.textAlign
        }
    };
};