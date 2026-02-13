import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';

interface MatchResult {
    match: string;
    index: number;
    groups: string[];
}

const CHEAT_SHEET = [
    { cat: 'Characters', items: ['.  Any character', '\\d  Digit [0-9]', '\\w  Word [a-zA-Z0-9_]', '\\s  Whitespace', '\\b  Word boundary'] },
    { cat: 'Quantifiers', items: ['*  0 or more', '+  1 or more', '?  0 or 1', '{n}  Exactly n', '{n,m}  Between n and m'] },
    { cat: 'Groups', items: ['(abc)  Capture group', '(?:abc)  Non-capture', '(?=abc)  Lookahead', '(?!abc)  Neg lookahead'] },
    { cat: 'Anchors', items: ['^  Start of string', '$  End of string', '\\b  Word boundary'] },
    { cat: 'Classes', items: ['[abc]  a, b, or c', '[^abc]  Not a, b, c', '[a-z]  Range a to z'] },
];

export default function RegexTester() {
    const [pattern, setPattern] = useState('');
    const [testString, setTestString] = useState('');
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
    const [showCheatSheet, setShowCheatSheet] = useState(false);

    const flagString = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');

    const { matches, error, highlighted } = useMemo(() => {
        if (!pattern || !testString) return { matches: [] as MatchResult[], error: null as string | null, highlighted: testString };
        try {
            const regex = new RegExp(pattern, flagString);
            const results: MatchResult[] = [];
            let match;

            if (flags.g) {
                while ((match = regex.exec(testString)) !== null) {
                    results.push({ match: match[0], index: match.index, groups: match.slice(1) });
                    if (match[0].length === 0) regex.lastIndex++;
                }
            } else {
                match = regex.exec(testString);
                if (match) results.push({ match: match[0], index: match.index, groups: match.slice(1) });
            }

            // Build highlighted string
            let hl = '';
            let lastIndex = 0;
            for (const r of results) {
                hl += escapeHtml(testString.slice(lastIndex, r.index));
                hl += `<mark class="bg-accent/30 text-accent-hover rounded px-0.5">${escapeHtml(r.match)}</mark>`;
                lastIndex = r.index + r.match.length;
            }
            hl += escapeHtml(testString.slice(lastIndex));

            return { matches: results, error: null, highlighted: hl };
        } catch (e) {
            return { matches: [] as MatchResult[], error: e instanceof Error ? e.message : 'Invalid regex', highlighted: escapeHtml(testString) };
        }
    }, [pattern, testString, flagString, flags.g]);

    return (
        <ToolPage toolIndex={2}>
            <div className="flex flex-col gap-4 max-w-5xl">
                {/* Pattern input */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px] flex items-center bg-bg-card rounded-xl border border-border overflow-hidden">
                        <span className="text-text-muted px-3 text-sm font-mono">/</span>
                        <input
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="Enter regex pattern..."
                            className="flex-1 bg-transparent text-text-primary text-sm font-mono py-2.5 outline-none placeholder:text-text-muted/50"
                            spellCheck={false}
                        />
                        <span className="text-text-muted px-1 text-sm font-mono">/</span>
                        <span className="text-accent text-sm font-mono pr-3">{flagString}</span>
                    </div>

                    {/* Flags */}
                    <div className="flex items-center gap-1">
                        {Object.entries(flags).map(([flag, active]) => (
                            <button
                                key={flag}
                                onClick={() => setFlags(f => ({ ...f, [flag]: !f[flag as keyof typeof f] }))}
                                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-colors ${active ? 'bg-accent text-white' : 'bg-bg-card border border-border text-text-muted hover:text-text-primary'}`}
                            >
                                {flag}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowCheatSheet(!showCheatSheet)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${showCheatSheet ? 'bg-accent/15 border-accent text-accent' : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'}`}
                    >
                        📖 Cheat Sheet
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-xs font-medium text-error">
                        <span className="w-2 h-2 rounded-full bg-error" />
                        {error}
                    </div>
                )}

                {/* Match count */}
                {pattern && !error && (
                    <div className="flex items-center gap-2 text-xs font-medium text-success">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '400px' }}>
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Test string */}
                        <div className="flex-1 rounded-xl bg-bg-card border border-border overflow-hidden flex flex-col">
                            <div className="px-4 py-2 border-b border-border">
                                <span className="text-xs text-text-muted font-medium">Test String</span>
                            </div>
                            <textarea
                                value={testString}
                                onChange={(e) => setTestString(e.target.value)}
                                placeholder="Enter test string to match against..."
                                className="flex-1 w-full resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50 min-h-[120px]"
                                spellCheck={false}
                            />
                        </div>

                        {/* Highlighted preview */}
                        {testString && pattern && !error && (
                            <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                                <div className="px-4 py-2 border-b border-border">
                                    <span className="text-xs text-text-muted font-medium">Match Highlight</span>
                                </div>
                                <div
                                    className="p-4 text-sm font-mono text-text-primary whitespace-pre-wrap break-all"
                                    dangerouslySetInnerHTML={{ __html: highlighted }}
                                />
                            </div>
                        )}

                        {/* Capture groups */}
                        {matches.some(m => m.groups.length > 0) && (
                            <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                                <div className="px-4 py-2 border-b border-border">
                                    <span className="text-xs text-text-muted font-medium">Capture Groups</span>
                                </div>
                                <div className="p-4 overflow-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="text-text-muted border-b border-border">
                                                <th className="text-left py-2 pr-4">#</th>
                                                <th className="text-left py-2 pr-4">Match</th>
                                                <th className="text-left py-2 pr-4">Index</th>
                                                <th className="text-left py-2">Groups</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {matches.map((m, i) => (
                                                <tr key={i} className="border-b border-border/50">
                                                    <td className="py-2 pr-4 text-text-muted">{i + 1}</td>
                                                    <td className="py-2 pr-4 font-mono text-accent">{m.match}</td>
                                                    <td className="py-2 pr-4 text-text-muted">{m.index}</td>
                                                    <td className="py-2 font-mono text-text-secondary">{m.groups.join(', ') || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cheat Sheet */}
                    {showCheatSheet && (
                        <div className="rounded-xl bg-bg-card border border-border overflow-auto">
                            <div className="px-4 py-2 border-b border-border">
                                <span className="text-xs text-text-muted font-medium">Regex Cheat Sheet</span>
                            </div>
                            <div className="p-4 space-y-4">
                                {CHEAT_SHEET.map(section => (
                                    <div key={section.cat}>
                                        <h4 className="text-xs font-semibold text-text-secondary mb-1.5">{section.cat}</h4>
                                        <div className="space-y-1">
                                            {section.items.map(item => (
                                                <div key={item} className="text-xs font-mono text-text-muted leading-relaxed">{item}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolPage>
    );
}

function escapeHtml(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
