import { useState, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export default function UuidGenerator() {
    const [uuids, setUuids] = useState<string[]>(() => [crypto.randomUUID()]);
    const [count, setCount] = useState(1);
    const [uppercase, setUppercase] = useState(false);
    const [noDashes, setNoDashes] = useState(false);
    const { copied, copy } = useCopyToClipboard();

    const format = useCallback((uuid: string) => {
        let result = uuid;
        if (noDashes) result = result.replace(/-/g, '');
        if (uppercase) result = result.toUpperCase();
        return result;
    }, [uppercase, noDashes]);

    const generate = useCallback(() => {
        setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
    }, [count]);

    const copyAll = useCallback(() => {
        copy(uuids.map(format).join('\n'));
    }, [uuids, format, copy]);

    return (
        <ToolPage toolIndex={9}>
            <div className="flex flex-col gap-6 max-w-3xl">
                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={generate} className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
                        ↻ Generate
                    </button>

                    <div className="flex items-center gap-2 bg-bg-card rounded-lg border border-border px-3 py-2">
                        <label className="text-xs text-text-muted">Count:</label>
                        <select value={count} onChange={e => setCount(+e.target.value)} className="bg-transparent text-text-primary text-sm outline-none cursor-pointer">
                            {[1, 5, 10, 25, 50].map(n => <option key={n} value={n} className="bg-bg-card">{n}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => setUppercase(!uppercase)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${uppercase ? 'bg-accent/15 border-accent text-accent' : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'}`}
                    >
                        UPPERCASE
                    </button>

                    <button
                        onClick={() => setNoDashes(!noDashes)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${noDashes ? 'bg-accent/15 border-accent text-accent' : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'}`}
                    >
                        No dashes
                    </button>

                    {uuids.length > 1 && (
                        <button onClick={copyAll} className="px-3 py-2 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors ml-auto">
                            {copied ? '✓ All Copied' : 'Copy All'}
                        </button>
                    )}
                </div>

                {/* UUID list */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">UUID v4 ({uuids.length})</span>
                    </div>
                    <div className="divide-y divide-border/50">
                        {uuids.map((uuid, i) => {
                            const formatted = format(uuid);
                            return (
                                <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover transition-colors group">
                                    {uuids.length > 1 && (
                                        <span className="text-[10px] text-text-muted w-5 shrink-0">{i + 1}</span>
                                    )}
                                    <code className="flex-1 text-sm font-mono text-text-primary select-all tracking-wide">{formatted}</code>
                                    <button
                                        onClick={() => copy(formatted)}
                                        className="text-xs text-accent hover:text-accent-hover transition-colors shrink-0 opacity-50 group-hover:opacity-100"
                                    >
                                        Copy
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-xs text-text-muted bg-bg-card/50 rounded-lg p-3 border border-border/50">
                    🔒 Generated using <code className="text-accent">crypto.randomUUID()</code> — cryptographically secure, entirely in your browser.
                </div>
            </div>
        </ToolPage>
    );
}
