import { useState, useMemo, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export default function UrlEncoder() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
    const { copied, copy } = useCopyToClipboard();

    const output = useMemo(() => {
        if (!input.trim()) return '';
        try {
            if (mode === 'encode') {
                return encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input);
            }
            return encodeType === 'component' ? decodeURIComponent(input) : decodeURI(input);
        } catch {
            return '⚠️ Invalid input for ' + mode + ' operation';
        }
    }, [input, mode, encodeType]);

    const swap = useCallback(() => {
        if (output && !output.startsWith('⚠️')) {
            setInput(output);
            setMode(m => m === 'encode' ? 'decode' : 'encode');
        } else {
            setMode(m => m === 'encode' ? 'decode' : 'encode');
        }
    }, [output]);

    return (
        <ToolPage toolIndex={8}>
            <div className="flex flex-col gap-4 max-w-4xl">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-bg-card rounded-lg border border-border p-1">
                        <button onClick={() => setMode('encode')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'encode' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                            Encode
                        </button>
                        <button onClick={() => setMode('decode')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'decode' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                            Decode
                        </button>
                    </div>

                    <div className="flex items-center bg-bg-card rounded-lg border border-border p-1">
                        <button onClick={() => setEncodeType('component')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${encodeType === 'component' ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
                            encodeURIComponent
                        </button>
                        <button onClick={() => setEncodeType('full')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${encodeType === 'full' ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
                            encodeURI
                        </button>
                    </div>

                    <button onClick={swap} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                        ⇄ Swap
                    </button>
                    <button onClick={() => setInput('')} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors ml-auto">
                        Clear
                    </button>
                </div>

                {/* Input */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">Input ({mode === 'encode' ? 'plain text or URL' : 'encoded string'})</span>
                        <span className="text-[10px] text-text-muted font-mono">{input.length} chars</span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'encode' ? 'https://example.com/path?query=hello world&foo=bar' : 'https%3A%2F%2Fexample.com'}
                        className="w-full h-32 resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                        spellCheck={false}
                    />
                </div>

                {/* Output */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">Output ({mode === 'encode' ? 'encoded' : 'decoded'})</span>
                        {output && !output.startsWith('⚠️') && (
                            <button onClick={() => copy(output)} className="text-xs text-accent hover:text-accent-hover transition-colors">
                                {copied ? '✓ Copied' : 'Copy'}
                            </button>
                        )}
                    </div>
                    <pre className="w-full min-h-[80px] overflow-auto text-sm font-mono p-4 text-text-primary whitespace-pre-wrap break-all m-0">
                        {output || <span className="text-text-muted/50">Result will appear here...</span>}
                    </pre>
                </div>
            </div>
        </ToolPage>
    );
}
