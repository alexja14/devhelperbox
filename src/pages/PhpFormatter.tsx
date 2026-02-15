import { useState, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import { useInputHistory } from '../hooks/useLocalStorage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import prettier from 'prettier/standalone';
import * as phpPluginRaw from '@prettier/plugin-php/standalone';

// Strip the circular 'default' property that Vite's ESM interop adds to UMD modules
// — prettier iterates all plugin properties and chokes on it
const { default: _, ...phpPlugin } = phpPluginRaw as any;

export default function PhpFormatter() {
    const [input, setInput] = useState('');
    const [indent, setIndent] = useState(4);
    const { history, addToHistory } = useInputHistory('php');
    const { copied, copy } = useCopyToClipboard();
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleFormat = useCallback(async () => {
        if (!input.trim()) return;
        try {
            const formatted = await prettier.format(input, {
                parser: 'php',
                plugins: [phpPlugin],
                tabWidth: indent,
                printWidth: 80,
                phpVersion: '8.3',
            } as any);
            setOutput(formatted);
            setError(null);
            addToHistory(input);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Invalid PHP code';
            setError(message);
            setOutput('');
        }
    }, [input, indent, addToHistory]);

    return (
        <ToolPage toolIndex={12}>
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
                                {n} spaces
                            </button>
                        ))}
                    </div>

                    <button onClick={handleFormat} className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors">
                        Beautify PHP
                    </button>

                    {output && (
                        <button onClick={() => copy(output)} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                            {copied ? '✓ Copied' : 'Copy Output'}
                        </button>
                    )}

                    <button onClick={() => { setInput(''); setOutput(''); setError(null); }} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors ml-auto">
                        Clear
                    </button>
                </div>

                {/* Validation status */}
                {error && (
                    <div className="flex items-center gap-2 text-xs font-medium text-error">
                        <span className="w-2 h-2 rounded-full bg-error" />
                        Status: {error}
                    </div>
                )}
                {!error && output && (
                    <div className="flex items-center gap-2 text-xs font-medium text-success">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        Status: Formatted successfully
                    </div>
                )}

                {/* Editor panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: '500px' }}>
                    {/* Input */}
                    <div className="flex flex-col rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Input (PHP)</span>
                            <span className="text-[10px] text-text-muted font-mono">{input.length} chars</span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Mio Primo Script PHP</title>
</head>
<body>
    <h1>Benvenuto</h1>
    <?php
        // Questo è un commento in PHP
        $nome = "Utente";
        echo "<p>Ciao, " . $nome . "! Oggi è il " . date('d/m/Y') . ".</p>";
    ?>
</body>
</html>`}
                            className="flex-1 w-full resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col rounded-xl bg-bg-card border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                            <span className="text-xs text-text-muted font-medium">Output</span>
                            {output && <span className="text-[10px] text-text-muted font-mono">{output.split('\n').length} lines</span>}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            placeholder="Formatted code will appear here..."
                            className="flex-1 w-full resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50"
                            spellCheck={false}
                        />
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
