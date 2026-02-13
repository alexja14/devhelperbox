import { useState, useEffect, useMemo, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

function formatDate(date: Date): string {
    return date.toLocaleString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZoneName: 'short',
    });
}

function formatISO(date: Date): string {
    return date.toISOString();
}

function formatRelative(date: Date): string {
    const now = Date.now();
    const diff = date.getTime() - now;
    const absDiff = Math.abs(diff);
    const past = diff < 0;

    if (absDiff < 60000) return past ? 'just now' : 'in a moment';
    if (absDiff < 3600000) { const m = Math.floor(absDiff / 60000); return past ? `${m} minute${m > 1 ? 's' : ''} ago` : `in ${m} minute${m > 1 ? 's' : ''}`; }
    if (absDiff < 86400000) { const h = Math.floor(absDiff / 3600000); return past ? `${h} hour${h > 1 ? 's' : ''} ago` : `in ${h} hour${h > 1 ? 's' : ''}`; }
    const d = Math.floor(absDiff / 86400000);
    return past ? `${d} day${d > 1 ? 's' : ''} ago` : `in ${d} day${d > 1 ? 's' : ''}`;
}

export default function TimestampConverter() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate');
    const [now, setNow] = useState(Date.now());
    const [dateInput, setDateInput] = useState('');
    const { copied, copy } = useCopyToClipboard();

    // Live clock
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSetNow = useCallback(() => {
        if (mode === 'toDate') {
            setInput(Math.floor(Date.now() / 1000).toString());
        } else {
            setDateInput(new Date().toISOString().slice(0, 19));
        }
    }, [mode]);

    const result = useMemo(() => {
        if (mode === 'toDate') {
            if (!input.trim()) return null;
            const num = Number(input);
            if (isNaN(num)) return { error: 'Not a valid number' };

            // Auto-detect seconds vs milliseconds
            const isMs = num > 9999999999;
            const date = new Date(isMs ? num : num * 1000);
            if (isNaN(date.getTime())) return { error: 'Invalid timestamp' };

            return {
                date,
                unit: isMs ? 'milliseconds' : 'seconds',
                local: formatDate(date),
                utc: date.toUTCString(),
                iso: formatISO(date),
                relative: formatRelative(date),
            };
        } else {
            if (!dateInput.trim()) return null;
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return { error: 'Invalid date format' };
            return {
                date,
                seconds: Math.floor(date.getTime() / 1000),
                milliseconds: date.getTime(),
                iso: formatISO(date),
            };
        }
    }, [input, dateInput, mode]);

    return (
        <ToolPage toolIndex={11}>
            <div className="flex flex-col gap-6 max-w-3xl">
                {/* Live clock */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <div>
                        <div className="text-xs text-text-muted">Current Unix Timestamp</div>
                        <div className="text-lg font-mono font-bold text-accent">
                            {Math.floor(now / 1000)}
                        </div>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-xs text-text-muted">Current Time</div>
                        <div className="text-sm font-mono text-text-secondary">
                            {new Date(now).toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* Mode toggle */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-bg-card rounded-lg border border-border p-1">
                        <button onClick={() => setMode('toDate')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'toDate' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                            Timestamp → Date
                        </button>
                        <button onClick={() => setMode('toTimestamp')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'toTimestamp' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                            Date → Timestamp
                        </button>
                    </div>
                    <button onClick={handleSetNow} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                        Use Now
                    </button>
                </div>

                {/* Input */}
                {mode === 'toDate' ? (
                    <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Unix Timestamp (seconds or milliseconds)</span>
                        </div>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="e.g. 1700000000 or 1700000000000"
                            className="w-full bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                            spellCheck={false}
                        />
                    </div>
                ) : (
                    <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Date (ISO, human readable, or datetime-local)</span>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <input
                                type="datetime-local"
                                value={dateInput}
                                onChange={e => setDateInput(e.target.value)}
                                className="bg-bg-tertiary text-text-primary text-sm font-mono p-2 rounded-lg border border-border outline-none"
                            />
                            <input
                                value={dateInput}
                                onChange={e => setDateInput(e.target.value)}
                                placeholder="Or type: 2025-01-15T12:00:00Z"
                                className="bg-transparent text-text-primary text-sm font-mono outline-none placeholder:text-text-muted/50"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && !('error' in result) && (
                    <div className="rounded-xl bg-bg-card border border-border overflow-hidden animate-fade-in">
                        <div className="px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Result</span>
                        </div>
                        <div className="p-4 space-y-3">
                            {mode === 'toDate' && 'local' in result && (
                                <>
                                    <ResultRow label="Local" value={result.local!} onCopy={copy} copied={copied} />
                                    <ResultRow label="UTC" value={result.utc!} onCopy={copy} copied={copied} />
                                    <ResultRow label="ISO 8601" value={result.iso} onCopy={copy} copied={copied} />
                                    <ResultRow label="Relative" value={result.relative!} onCopy={copy} copied={copied} />
                                    <ResultRow label="Detected" value={`Input is in ${'unit' in result ? result.unit : 'unknown'}`} onCopy={copy} copied={copied} />
                                </>
                            )}
                            {mode === 'toTimestamp' && 'seconds' in result && (
                                <>
                                    <ResultRow label="Seconds" value={String(result.seconds)} onCopy={copy} copied={copied} />
                                    <ResultRow label="Milliseconds" value={String(result.milliseconds)} onCopy={copy} copied={copied} />
                                    <ResultRow label="ISO 8601" value={result.iso} onCopy={copy} copied={copied} />
                                </>
                            )}
                        </div>
                    </div>
                )}

                {result && 'error' in result && (
                    <div className="flex items-center gap-2 text-xs font-medium text-error">
                        <span className="w-2 h-2 rounded-full bg-error" />
                        {result.error}
                    </div>
                )}
            </div>
        </ToolPage>
    );
}

function ResultRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: (v: string) => void; copied: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <span className="text-xs text-text-muted w-24 shrink-0">{label}</span>
            <span className="flex-1 text-sm font-mono text-text-primary text-right">{value}</span>
            <button onClick={() => onCopy(value)} className="ml-3 text-xs text-accent hover:text-accent-hover transition-colors shrink-0">
                {copied ? '✓' : '⎘'}
            </button>
        </div>
    );
}
