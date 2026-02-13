import { useState, useMemo, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface ColorValues {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    cssRgb: string;
    cssHsl: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const match = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!match) {
        const short = hex.replace('#', '').match(/^([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (!short) return null;
        return { r: parseInt(short[1] + short[1], 16), g: parseInt(short[2] + short[2], 16), b: parseInt(short[3] + short[3], 16) };
    }
    return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360; s /= 100; l /= 100;
    if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function parseColorInput(input: string): ColorValues | null {
    input = input.trim();

    // HEX
    if (/^#?[0-9a-f]{3,6}$/i.test(input)) {
        const hex = input.startsWith('#') ? input : '#' + input;
        const rgb = hexToRgb(hex);
        if (!rgb) return null;
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl, cssRgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, cssHsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` };
    }

    // RGB
    const rgbMatch = input.match(/rgba?\s*\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})/i);
    if (rgbMatch) {
        const rgb = { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] };
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl, cssRgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, cssHsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` };
    }

    // HSL
    const hslMatch = input.match(/hsla?\s*\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})%?\s*[,\s]\s*(\d{1,3})%?/i);
    if (hslMatch) {
        const hsl = { h: +hslMatch[1], s: +hslMatch[2], l: +hslMatch[3] };
        const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl, cssRgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, cssHsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` };
    }

    return null;
}

function getContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
    const luminance = (rgb: { r: number; g: number; b: number }) => {
        const a = [rgb.r, rgb.g, rgb.b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    const l1 = luminance(rgb1);
    const l2 = luminance(rgb2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function generatePalette(hsl: { h: number; s: number; l: number }): { name: string; colors: ColorValues[] }[] {
    const makeColor = (h: number, s: number, l: number): ColorValues => {
        h = ((h % 360) + 360) % 360;
        s = Math.max(0, Math.min(100, s));
        l = Math.max(0, Math.min(100, l));
        const rgb = hslToRgb(h, s, l);
        return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl: { h, s, l }, cssRgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, cssHsl: `hsl(${h}, ${s}%, ${l}%)` };
    };

    return [
        { name: 'Complementary', colors: [makeColor(hsl.h, hsl.s, hsl.l), makeColor(hsl.h + 180, hsl.s, hsl.l)] },
        { name: 'Analogous', colors: [makeColor(hsl.h - 30, hsl.s, hsl.l), makeColor(hsl.h, hsl.s, hsl.l), makeColor(hsl.h + 30, hsl.s, hsl.l)] },
        { name: 'Triadic', colors: [makeColor(hsl.h, hsl.s, hsl.l), makeColor(hsl.h + 120, hsl.s, hsl.l), makeColor(hsl.h + 240, hsl.s, hsl.l)] },
        { name: 'Shades', colors: [20, 35, 50, 65, 80].map(l => makeColor(hsl.h, hsl.s, l)) },
    ];
}

function FormatRow({ label, value }: { label: string; value: string }) {
    const { copied, copy } = useCopyToClipboard();
    return (
        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <span className="text-xs text-text-muted">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-text-primary">{value}</span>
                <button onClick={() => copy(value)} className="text-xs text-accent hover:text-accent-hover transition-colors">{copied ? '✓' : '⎘'}</button>
            </div>
        </div>
    );
}

export default function ColorConverter() {
    const [input, setInput] = useState('#6366f1');

    const color = useMemo(() => parseColorInput(input), [input]);
    const palettes = useMemo(() => color ? generatePalette(color.hsl) : [], [color]);

    const contrastWhite = useMemo(() => color ? getContrastRatio(color.rgb, { r: 255, g: 255, b: 255 }) : 0, [color]);
    const contrastBlack = useMemo(() => color ? getContrastRatio(color.rgb, { r: 0, g: 0, b: 0 }) : 0, [color]);

    const handleColorPicker = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }, []);

    return (
        <ToolPage toolIndex={4}>
            <div className="flex flex-col gap-6 max-w-4xl">
                {/* Input */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-[250px] bg-bg-card rounded-xl border border-border px-4 py-2.5">
                        <input
                            type="color"
                            value={color?.hex || '#6366f1'}
                            onChange={handleColorPicker}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="#6366f1, rgb(99,102,241), hsl(239,84%,67%)"
                            className="flex-1 bg-transparent text-text-primary text-sm font-mono outline-none placeholder:text-text-muted/50"
                            spellCheck={false}
                        />
                    </div>
                    <button onClick={() => setInput('#6366f1')} className="px-3 py-2 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                        Reset
                    </button>
                </div>

                {color ? (
                    <>
                        {/* Preview */}
                        <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-2xl border border-border shadow-lg" style={{ backgroundColor: color.hex }} />
                            <div className="flex-1 rounded-xl bg-bg-card border border-border p-4">
                                <FormatRow label="HEX" value={color.hex} />
                                <FormatRow label="RGB" value={color.cssRgb} />
                                <FormatRow label="HSL" value={color.cssHsl} />
                                <FormatRow label="Values" value={`R:${color.rgb.r} G:${color.rgb.g} B:${color.rgb.b}`} />
                            </div>
                        </div>

                        {/* WCAG Contrast */}
                        <div className="rounded-xl bg-bg-card border border-border p-4">
                            <h3 className="text-xs font-semibold text-text-secondary mb-3">WCAG Contrast Ratio</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: color.hex }}>
                                    <span className="text-white font-semibold text-sm">White text</span>
                                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${contrastWhite >= 4.5 ? 'bg-green-500/20 text-green-400' : contrastWhite >= 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {contrastWhite.toFixed(1)}:1 {contrastWhite >= 7 ? 'AAA' : contrastWhite >= 4.5 ? 'AA' : 'Fail'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: color.hex }}>
                                    <span className="text-black font-semibold text-sm">Black text</span>
                                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${contrastBlack >= 4.5 ? 'bg-green-500/20 text-green-400' : contrastBlack >= 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {contrastBlack.toFixed(1)}:1 {contrastBlack >= 7 ? 'AAA' : contrastBlack >= 4.5 ? 'AA' : 'Fail'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Palettes */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-text-secondary">Generated Palettes</h3>
                            {palettes.map(palette => (
                                <div key={palette.name} className="rounded-xl bg-bg-card border border-border overflow-hidden">
                                    <div className="px-4 py-2 border-b border-border">
                                        <span className="text-xs text-text-muted font-medium">{palette.name}</span>
                                    </div>
                                    <div className="flex">
                                        {palette.colors.map((c, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setInput(c.hex)}
                                                className="flex-1 h-16 transition-transform hover:scale-105 cursor-pointer relative group"
                                                style={{ backgroundColor: c.hex }}
                                                title={c.hex}
                                            >
                                                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 text-white text-[10px] font-mono transition-opacity">
                                                    {c.hex}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : input.trim() ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-error">
                        <span className="w-2 h-2 rounded-full bg-error" />
                        Unrecognized color format. Try: #ff5733, rgb(255,87,51), hsl(11,100%,60%)
                    </div>
                ) : null}
            </div>
        </ToolPage>
    );
}
