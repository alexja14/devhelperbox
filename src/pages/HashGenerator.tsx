import { useState, useCallback, useRef } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import * as jsMd5 from 'js-md5';

interface HashResults {
    md5: string;
    sha1: string;
    sha256: string;
    sha512: string;
}

async function computeHash(algorithm: string, data: BufferSource): Promise<string> {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashText(text: string): Promise<HashResults> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const [sha1, sha256, sha512] = await Promise.all([
        computeHash('SHA-1', data),
        computeHash('SHA-256', data),
        computeHash('SHA-512', data),
    ]);
    return { md5: jsMd5.md5(text), sha1, sha256, sha512 };
}

async function hashFile(file: File): Promise<HashResults> {
    const buffer = await file.arrayBuffer();
    const textForMd5 = new Uint8Array(buffer);
    const [sha1, sha256, sha512] = await Promise.all([
        computeHash('SHA-1', buffer),
        computeHash('SHA-256', buffer),
        computeHash('SHA-512', buffer),
    ]);
    return { md5: jsMd5.md5(Array.from(textForMd5)), sha1, sha256, sha512 };
}

function HashRow({ label, value, color }: { label: string; value: string; color: string }) {
    const { copied, copy } = useCopyToClipboard();
    return (
        <div className="flex items-start gap-4 py-3 border-b border-border/50 last:border-0">
            <span className="text-xs font-bold font-mono w-16 shrink-0 pt-0.5" style={{ color }}>{label}</span>
            <span className="flex-1 text-sm font-mono text-text-primary break-all leading-relaxed">{value}</span>
            <button
                onClick={() => copy(value)}
                className="text-xs text-accent hover:text-accent-hover transition-colors shrink-0 pt-0.5"
            >
                {copied ? '✓ Copied' : 'Copy'}
            </button>
        </div>
    );
}

export default function HashGenerator() {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState<HashResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTextHash = useCallback(async (text: string) => {
        if (!text.trim()) { setHashes(null); return; }
        setLoading(true);
        setFileName(null);
        try {
            const result = await hashText(text);
            setHashes(result);
        } catch { setHashes(null); }
        setLoading(false);
    }, []);

    const handleHashInput = useCallback(async (text: string) => {
        setInput(text);
        await handleTextHash(text);
    }, [handleTextHash]);

    const handleFileDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setLoading(true);
        setFileName(file.name);
        setInput('');
        try {
            const result = await hashFile(file);
            setHashes(result);
        } catch { setHashes(null); }
        setLoading(false);
    }, []);

    const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        setFileName(file.name);
        setInput('');
        try {
            const result = await hashFile(file);
            setHashes(result);
        } catch { setHashes(null); }
        setLoading(false);
    }, []);

    return (
        <ToolPage toolIndex={5}>
            <div className="flex flex-col gap-4 max-w-4xl">
                {/* Text input */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">Input Text</span>
                        <button onClick={() => { setInput(''); setHashes(null); setFileName(null); }} className="text-xs text-text-muted hover:text-text-primary transition-colors">
                            Clear
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => handleHashInput(e.target.value)}
                        placeholder="Enter text to hash..."
                        className="w-full h-32 resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                        spellCheck={false}
                    />
                </div>

                {/* File drop zone */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
                >
                    <div className="text-text-muted text-sm">
                        {fileName ? `📄 ${fileName}` : '📁 Drag & drop a file to hash'}
                    </div>
                    <div className="text-text-muted/50 text-xs mt-1">or click to browse · Uses Web Crypto API</div>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInput} />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center gap-2 text-xs text-accent">
                        <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        Computing hashes...
                    </div>
                )}

                {/* Results */}
                {hashes && !loading && (
                    <div className="rounded-xl bg-bg-card border border-border overflow-hidden animate-fade-in">
                        <div className="px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Hash Results</span>
                        </div>
                        <div className="p-4">
                            <HashRow label="MD5" value={hashes.md5} color="#f59e0b" />
                            <HashRow label="SHA-1" value={hashes.sha1} color="#8b5cf6" />
                            <HashRow label="SHA-256" value={hashes.sha256} color="#22c55e" />
                            <HashRow label="SHA-512" value={hashes.sha512} color="#06b6d4" />
                        </div>
                    </div>
                )}

                {/* Privacy notice */}
                <div className="text-xs text-text-muted bg-bg-card/50 rounded-lg p-3 border border-border/50">
                    🔒 All hashes are computed locally using the Web Crypto API and js-md5. No data leaves your browser.
                </div>
            </div>
        </ToolPage>
    );
}
