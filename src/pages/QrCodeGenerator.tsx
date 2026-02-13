import { useState, useEffect, useRef, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import QRCode from 'qrcode';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export default function QrCodeGenerator() {
    const [text, setText] = useState('https://devhelperbox.dev');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { copied, copy } = useCopyToClipboard();
    const [dataUrl, setDataUrl] = useState('');

    useEffect(() => {
        if (!text.trim() || !canvasRef.current) return;
        QRCode.toCanvas(canvasRef.current, text, {
            width: size,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
        }).catch(() => { /* invalid input */ });

        QRCode.toDataURL(text, {
            width: size,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
        }).then(setDataUrl).catch(() => setDataUrl(''));
    }, [text, size, fgColor, bgColor]);

    const handleDownload = useCallback(() => {
        if (!dataUrl) return;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'qrcode.png';
        a.click();
    }, [dataUrl]);

    const handleCopySvg = useCallback(async () => {
        try {
            const svg = await QRCode.toString(text, { type: 'svg', width: size, margin: 2, color: { dark: fgColor, light: bgColor } });
            await copy(svg);
        } catch { /* ignore */ }
    }, [text, size, fgColor, bgColor, copy]);

    return (
        <ToolPage toolIndex={6}>
            <div className="flex flex-col gap-6 max-w-3xl">
                {/* Input */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">Content</span>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text, URL, email..."
                        className="w-full h-24 resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                        spellCheck={false}
                    />
                </div>

                {/* Options */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-bg-card rounded-lg border border-border px-3 py-2">
                        <label className="text-xs text-text-muted">Size:</label>
                        <input type="range" min="128" max="512" step="64" value={size} onChange={e => setSize(+e.target.value)} className="w-24 accent-accent" />
                        <span className="text-xs font-mono text-text-secondary w-12">{size}px</span>
                    </div>
                    <div className="flex items-center gap-2 bg-bg-card rounded-lg border border-border px-3 py-2">
                        <label className="text-xs text-text-muted">FG:</label>
                        <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent" />
                    </div>
                    <div className="flex items-center gap-2 bg-bg-card rounded-lg border border-border px-3 py-2">
                        <label className="text-xs text-text-muted">BG:</label>
                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent" />
                    </div>
                </div>

                {/* Preview + Actions */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="rounded-xl bg-white p-4 border border-border shadow-lg">
                        <canvas ref={canvasRef} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <button onClick={handleDownload} className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
                            ⬇ Download PNG
                        </button>
                        <button onClick={handleCopySvg} className="px-4 py-2 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
                            {copied ? '✓ Copied SVG' : '⎘ Copy as SVG'}
                        </button>
                    </div>
                </div>
            </div>
        </ToolPage>
    );
}
