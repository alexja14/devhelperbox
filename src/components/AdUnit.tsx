import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    layoutKey?: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function AdUnit({ slot, format = 'auto', layoutKey, className = '', style }: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        // Prevent double initialization in strict mode or re-renders
        if (initializedRef.current) return;

        try {
            if (window.adsbygoogle) {
                window.adsbygoogle.push({});
                initializedRef.current = true;
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`ad-container my-8 overflow-hidden rounded-lg bg-bg-card/50 border border-border/50 ${className}`}>
            <div className="text-[10px] text-center text-text-muted/50 uppercase tracking-widest py-1">Advertisement</div>
            <ins
                className="adsbygoogle block"
                ref={adRef}
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-9476546199664735"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
                {...(layoutKey && { 'data-ad-layout-key': layoutKey })}
            />
        </div>
    );
}
