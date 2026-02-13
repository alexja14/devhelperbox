import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { diffLines } from 'diff';
import type { Change } from 'diff';

export default function DiffChecker() {
    const [original, setOriginal] = useState('');
    const [modified, setModified] = useState('');
    const { copied, copy } = useCopyToClipboard();

    const changes = useMemo((): Change[] => {
        if (!original && !modified) return [];
        return diffLines(original, modified);
    }, [original, modified]);

    const stats = useMemo(() => {
        let added = 0, removed = 0, unchanged = 0;
        for (const c of changes) {
            const lines = (c.value.match(/\n/g) || []).length + (c.value.endsWith('\n') ? 0 : 1);
            if (c.added) added += lines;
            else if (c.removed) removed += lines;
            else unchanged += lines;
        }
        return { added, removed, unchanged };
    }, [changes]);

    const diffText = useMemo(() => {
        return changes.map(c => {
            const prefix = c.added ? '+' : c.removed ? '-' : ' ';
            return c.value.split('\n').filter(l => l !== '' || !c.value.endsWith('\n')).map(l => prefix + l).join('\n');
        }).join('\n');
    }, [changes]);

    return (
        <ToolPage toolIndex={10}>
            <div className="flex flex-col gap-4">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {(original || modified) && (
                        <>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-success font-medium">+{stats.added} added</span>
                                <span className="text-error font-medium">-{stats.removed} removed</span>
                                <span className="text-text-muted">{stats.unchanged} unchanged</span>
                            </div>
                            <button onClick={() => copy(diffText)} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors ml-auto">
                                {copied ? '✓ Copied' : 'Copy Diff'}
                            </button>
                        </>
                    )}
                    <button onClick={() => { setOriginal(''); setModified(''); }} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                        Clear
                    </button>
                </div>

                {/* Input panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: '250px' }}>
                    <div className="flex flex-col rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Original</span>
                        </div>
                        <textarea
                            value={original}
                            onChange={e => setOriginal(e.target.value)}
                            placeholder="Paste original text..."
                            className="flex-1 w-full resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50 min-h-[150px]"
                            spellCheck={false}
                        />
                    </div>
                    <div className="flex flex-col rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Modified</span>
                        </div>
                        <textarea
                            value={modified}
                            onChange={e => setModified(e.target.value)}
                            placeholder="Paste modified text..."
                            className="flex-1 w-full resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50 min-h-[150px]"
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Diff output */}
                {changes.length > 0 && (original || modified) && (
                    <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Diff Result</span>
                        </div>
                        <div className="overflow-auto max-h-[500px]">
                            {changes.map((change, i) => {
                                const lines = change.value.split('\n');
                                // Remove trailing empty string from split
                                if (lines[lines.length - 1] === '') lines.pop();

                                return lines.map((line, j) => (
                                    <div
                                        key={`${i}-${j}`}
                                        className={`px-4 py-0.5 font-mono text-sm border-l-3 ${change.added
                                            ? 'bg-success/8 text-success border-l-success'
                                            : change.removed
                                                ? 'bg-error/8 text-error border-l-error'
                                                : 'text-text-secondary border-l-transparent'
                                            }`}
                                    >
                                        <span className="inline-block w-5 text-text-muted/50 select-none text-xs">
                                            {change.added ? '+' : change.removed ? '-' : ' '}
                                        </span>
                                        {line || ' '}
                                    </div>
                                ));
                            })}
                        </div>
                    </div>
                )}
            </div>
        </ToolPage>
    );
}
