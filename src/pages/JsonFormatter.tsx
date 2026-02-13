import { useState, useCallback, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import { useInputHistory } from '../hooks/useLocalStorage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [indent, setIndent] = useState(2);
    const [sortKeys, setSortKeys] = useState(false);
    const { history, addToHistory } = useInputHistory('json');
    const { copied, copy } = useCopyToClipboard();

    const result = useMemo(() => {
        if (!input.trim()) return { output: '', error: null, valid: null as boolean | null };
        try {
            const parsed = JSON.parse(input);
            const sortedReplacer = sortKeys
                ? (_key: string, value: unknown) => {
                    if (value && typeof value === 'object' && !Array.isArray(value)) {
                        return Object.keys(value as Record<string, unknown>).sort().reduce((sorted: Record<string, unknown>, k: string) => {
                            sorted[k] = (value as Record<string, unknown>)[k];
                            return sorted;
                        }, {});
                    }
                    return value;
                }
                : undefined;
            const output = JSON.stringify(parsed, sortedReplacer as ((this: unknown, key: string, value: unknown) => unknown) | undefined, indent);
            return { output, error: null, valid: true };
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Invalid JSON';
            return { output: '', error: message, valid: false };
        }
    }, [input, indent, sortKeys]);

    const handleMinify = useCallback(() => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed));
        } catch { /* ignore */ }
    }, [input]);

    const handleFormat = useCallback(() => {
        if (result.output) {
            setInput(result.output);
            addToHistory(input);
        }
    }, [result.output, input, addToHistory]);

    return (
        <ToolPage toolIndex={0}>
            <div className="flex flex-col gap-4">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-bg-card rounded-lg border border-border px-3 py-1.5 text-sm">
                        <label className="text-text-muted text-xs">Indent:</label>
                        {[2, 4].map(n => (
                            <button
                                key={n}
                                onClick={() => setIndent(n)}
                                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${indent === n ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setSortKeys(!sortKeys)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${sortKeys ? 'bg-accent/15 border-accent text-accent' : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'}`}
                    >
                        Sort Keys
                    </button>

                    <button onClick={handleMinify} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                        Minify
                    </button>

                    <button onClick={handleFormat} className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors">
                        Format
                    </button>

                    {result.output && (
                        <button onClick={() => copy(result.output)} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                            {copied ? '✓ Copied' : 'Copy Output'}
                        </button>
                    )}

                    <button onClick={() => setInput('')} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors ml-auto">
                        Clear
                    </button>
                </div>

                {/* Validation status */}
                {input.trim() && (
                    <div className={`flex items-center gap-2 text-xs font-medium ${result.valid ? 'text-success' : 'text-error'}`}>
                        <span className={`w-2 h-2 rounded-full ${result.valid ? 'bg-success' : 'bg-error'}`} />
                        {result.valid ? 'Valid JSON' : `Invalid: ${result.error}`}
                    </div>
                )}

                {/* Editor panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: '500px' }}>
                    {/* Input */}
                    <div className="flex flex-col rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Input</span>
                            <span className="text-[10px] text-text-muted font-mono">{input.length} chars</span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='Paste your JSON here...\n\nExample: {"name": "John", "age": 30}'
                            className="flex-1 w-full resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Output</span>
                            {result.output && <span className="text-[10px] text-text-muted font-mono">{result.output.split('\n').length} lines</span>}
                        </div>
                        <pre className="flex-1 w-full overflow-auto text-sm font-mono p-4 text-text-primary whitespace-pre m-0">
                            {result.output || <span className="text-text-muted/50">Formatted JSON will appear here...</span>}
                        </pre>
                    </div>
                </div>

                {/* History */}
                {history.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xs text-text-muted font-medium mb-2">Recent inputs</h3>
                        <div className="flex flex-wrap gap-2">
                            {history.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(item)}
                                    className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-mono truncate max-w-xs transition-colors"
                                >
                                    {item.slice(0, 50)}{item.length > 50 ? '...' : ''}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolPage>
    );
}
