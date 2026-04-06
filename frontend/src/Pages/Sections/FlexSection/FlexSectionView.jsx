
import { resolveElement } from '../../../utils/styleResolver';
import ElementContent from '../../../components/elements/ElementContent';

export default function FlexSectionView({ settings = {}, children = [], currentBreakpoint }) {

    return (
        <section
            style={{
                backgroundColor: settings.backgroundColor || '#fff',
                backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                minHeight: settings.minHeight || '600px',
                position: 'relative'
            }}
        >
            <div className="relative w-full h-full">
                {children.map((item) => {
                    const resolved = resolveElement(item, currentBreakpoint);

                    return (
                        <div
                            key={item.id}
                            style={{
                                position: 'absolute',
                                left: resolved?.box?.x,
                                top: resolved?.box?.y,
                                width: resolved?.box?.width,
                                height: resolved?.box?.height,
                                zIndex: item.zIndex || 1
                            }}
                        >
                            <ElementContent
                                item={item}
                                resolved={resolved}
                                isEditing={false}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
