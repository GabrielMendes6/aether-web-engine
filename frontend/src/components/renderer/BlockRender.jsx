// components/renderer/BlockRenderer.jsx

const ELEMENT_MAP = {
    text: ({ value, style }) => <p style={style}>{value}</p>,
    button: ({ value, style, url }) => (
        <a href={url}>
            <button style={style}>{value}</button>
        </a>
    ),
    list: ({ items, style }) => (
        <ul style={style}>
            {items.map((item, i) => (
                <li key={i}>{item.text}</li>
            ))}
        </ul>
    )
};

export default function BlockRenderer({ item }) {
    const Component = ELEMENT_MAP[item.type];

    if (!Component) return null;

    return <Component {...item} />;
}