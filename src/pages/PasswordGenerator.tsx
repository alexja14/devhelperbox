import { useState, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const CHARSETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length: number, options: Record<string, boolean>): string {
    let chars = '';
    if (options.uppercase) chars += CHARSETS.uppercase;
    if (options.lowercase) chars += CHARSETS.lowercase;
    if (options.numbers) chars += CHARSETS.numbers;
    if (options.symbols) chars += CHARSETS.symbols;
    if (!chars) chars = CHARSETS.lowercase;

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (n) => chars[n % chars.length]).join('');
}

function getStrength(password: string): { label: string; color: string; score: number } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: '#ef4444', score };
    if (score <= 4) return { label: 'Medium', color: '#f59e0b', score };
    return { label: 'Strong', color: '#22c55e', score };
}

export default function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
    const [passwords, setPasswords] = useState<string[]>(() => [generatePassword(16, { uppercase: true, lowercase: true, numbers: true, symbols: true })]);
    const { copied, copy } = useCopyToClipboard();

    const regenerate = useCallback(() => {
        setPasswords([generatePassword(length, options)]);
    }, [length, options]);

    const generateBulk = useCallback(() => {
        setPasswords(Array.from({ length: 10 }, () => generatePassword(length, options)));
    }, [length, options]);

    const handleLengthChange = useCallback((newLength: number) => {
        setLength(newLength);
        setPasswords([generatePassword(newLength, options)]);
    }, [options]);

    const handleOptionChange = useCallback((key: string) => {
        const newOptions = { ...options, [key]: !options[key as keyof typeof options] };
        setOptions(newOptions);
        setPasswords([generatePassword(length, newOptions)]);
    }, [options, length]);

    const strength = getStrength(passwords[0]);

    return (
        <ToolPage toolIndex={7}>
            <div className="flex flex-col gap-6 max-w-3xl">
                {/* Main password display */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">Generated Password</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: strength.color }}>{strength.label}</span>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <code className="flex-1 text-lg font-mono text-text-primary break-all select-all leading-relaxed tracking-wide">
                            {passwords[0]}
                        </code>
                        <button onClick={() => copy(passwords[0])} className="shrink-0 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors">
                            {copied ? '✓' : 'Copy'}
                        </button>
                        <button onClick={regenerate} className="shrink-0 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-colors">
                            ↻
                        </button>
                    </div>
                    {/* Strength bar */}
                    <div className="px-4 pb-3">
                        <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(strength.score / 6) * 100}%`, backgroundColor: strength.color }} />
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-4">
                    {/* Length slider */}
                    <div className="flex-1 min-w-[200px] bg-bg-card rounded-xl border border-border p-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs text-text-muted font-medium">Length</label>
                            <span className="text-sm font-mono font-bold text-text-primary">{length}</span>
                        </div>
                        <input type="range" min="4" max="64" value={length} onChange={e => handleLengthChange(+e.target.value)} className="w-full accent-accent" />
                        <div className="flex justify-between text-[10px] text-text-muted mt-1">
                            <span>4</span><span>64</span>
                        </div>
                    </div>

                    {/* Character sets */}
                    <div className="bg-bg-card rounded-xl border border-border p-4">
                        <span className="text-xs text-text-muted font-medium block mb-3">Characters</span>
                        <div className="flex flex-col gap-2">
                            {Object.entries(CHARSETS).map(([key, sample]) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={options[key as keyof typeof options]}
                                        onChange={() => handleOptionChange(key)}
                                        className="accent-accent w-4 h-4 rounded"
                                    />
                                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors capitalize">{key}</span>
                                    <span className="text-xs text-text-muted font-mono ml-auto">{sample.slice(0, 8)}...</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bulk generate */}
                <div>
                    <button onClick={generateBulk} className="px-4 py-2 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
                        Generate 10 passwords
                    </button>
                    {passwords.length > 1 && (
                        <div className="mt-3 rounded-xl bg-bg-card border border-border overflow-hidden">
                            {passwords.map((pw, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-2 border-b border-border/50 last:border-0 hover:bg-bg-hover transition-colors">
                                    <span className="text-[10px] text-text-muted w-5">{i + 1}</span>
                                    <code className="flex-1 text-sm font-mono text-text-primary break-all">{pw}</code>
                                    <button onClick={() => copy(pw)} className="text-xs text-accent hover:text-accent-hover transition-colors shrink-0">Copy</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-xs text-text-muted bg-bg-card/50 rounded-lg p-3 border border-border/50">
                    🔒 Passwords are generated using the Web Crypto API (crypto.getRandomValues). Nothing leaves your browser.
                </div>
            </div>
        </ToolPage>
    );
}
