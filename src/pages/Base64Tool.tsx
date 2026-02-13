import { useState, useMemo, useCallback, useRef } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export default function Base64Tool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [urlSafe, setUrlSafe] = useState(false);
    const [fileResult, setFileResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { copied, copy } = useCopyToClipboard();

    const output = useMemo(() => {
        if (!input.trim()) return '';
        try {
            if (mode === 'encode') {
                let encoded = btoa(unescape(encodeURIComponent(input)));
                if (urlSafe) encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                return encoded;
            } else {
                let decoded = input;
                if (urlSafe) decoded = decoded.replace(/-/g, '+').replace(/_/g, '/');
                return decodeURIComponent(escape(atob(decoded)));
            }
        } catch {
            return '⚠️ Invalid input for ' + mode + ' operation';
        }
    }, [input, mode, urlSafe]);

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setFileResult(result);
            setInput(file.name);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setFileResult(result);
            setInput(file.name);
        };
        reader.readAsDataURL(file);
    }, []);

    const swap = useCallback(() => {
        if (output && !output.startsWith('⚠️')) {
            setInput(output);
            setMode(m => m === 'encode' ? 'decode' : 'encode');
        } else {
            setMode(m => m === 'encode' ? 'decode' : 'encode');
        }
        setFileResult(null);
    }, [output]);

    return (
        <ToolPage toolIndex={1}>
            <div className="flex flex-col gap-4 max-w-4xl">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-bg-card rounded-lg border border-border p-1">
                        <button
                            onClick={() => { setMode('encode'); setFileResult(null); }}
                            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'encode' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => { setMode('decode'); setFileResult(null); }}
                            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'decode' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            Decode
                        </button>
                    </div>

                    <button onClick={swap} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors" title="Swap input/output">
                        ⇄ Swap
                    </button>

                    <button
                        onClick={() => setUrlSafe(!urlSafe)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${urlSafe ? 'bg-accent/15 border-accent text-accent' : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'}`}
                    >
                        URL Safe
                    </button>

                    <button onClick={() => { setInput(''); setFileResult(null); }} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors ml-auto">
                        Clear
                    </button>
                </div>

                {/* File drop zone */}
                {mode === 'encode' && (
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
                    >
                        <div className="text-text-muted text-sm">
                            📁 Drag & drop a file here for Data URI encoding
                        </div>
                        <div className="text-text-muted/50 text-xs mt-1">or click to browse</div>
                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInput} />
                    </div>
                )}

                {/* Input */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">
                            {fileResult ? `File: ${input}` : `Input (${mode === 'encode' ? 'plain text' : 'base64 string'})`}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">{input.length} chars</span>
                    </div>
                    {!fileResult && (
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter base64 string to decode...'}
                            className="w-full h-40 resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                            spellCheck={false}
                        />
                    )}
                </div>

                {/* Output */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">
                            Output ({mode === 'encode' ? 'base64' : 'decoded text'})
                        </span>
                        {(output || fileResult) && (
                            <button
                                onClick={() => copy(fileResult || output)}
                                className="text-xs text-accent hover:text-accent-hover transition-colors"
                            >
                                {copied ? '✓ Copied' : 'Copy'}
                            </button>
                        )}
                    </div>
                    <pre className="w-full min-h-[100px] max-h-[300px] overflow-auto text-sm font-mono p-4 text-text-primary whitespace-pre-wrap break-all m-0">
                        {fileResult || output || <span className="text-text-muted/50">Result will appear here...</span>}
                    </pre>
                </div>
            </div>
        </ToolPage>
    );
}
