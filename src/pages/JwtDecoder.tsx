import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface DecodedJwt {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
    expired: boolean | null;
    expiresAt: string | null;
    issuedAt: string | null;
}

function decodeJwt(token: string): DecodedJwt | null {
    try {
        const parts = token.trim().split('.');
        if (parts.length !== 3) return null;

        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        let expired: boolean | null = null;
        let expiresAt: string | null = null;
        let issuedAt: string | null = null;

        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            expired = expDate < new Date();
            expiresAt = expDate.toLocaleString();
        }
        if (payload.iat) {
            issuedAt = new Date(payload.iat * 1000).toLocaleString();
        }

        return { header, payload, signature: parts[2], expired, expiresAt, issuedAt };
    } catch {
        return null;
    }
}

function Section({ title, data, color }: { title: string; data: string; color: string }) {
    const { copied, copy } = useCopyToClipboard();
    return (
        <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-xs font-medium" style={{ color }}>{title}</span>
                <button onClick={() => copy(data)} className="text-xs text-accent hover:text-accent-hover transition-colors">
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm font-mono text-text-primary overflow-auto whitespace-pre-wrap m-0">{data}</pre>
        </div>
    );
}

export default function JwtDecoder() {
    const [token, setToken] = useState('');

    const decoded = useMemo(() => {
        if (!token.trim()) return null;
        return decodeJwt(token);
    }, [token]);

    return (
        <ToolPage toolIndex={3}>
            <div className="flex flex-col gap-4 max-w-4xl">
                {/* Token input */}
                <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                        <span className="text-xs text-text-muted font-medium">JWT Token</span>
                        <button onClick={() => setToken('')} className="text-xs text-text-muted hover:text-text-primary transition-colors">
                            Clear
                        </button>
                    </div>
                    <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your JWT token here (eyJhbGci...)..."
                        className="w-full h-32 resize-none bg-transparent text-text-primary text-sm font-mono p-4 outline-none placeholder:text-text-muted/50 break-all"
                        spellCheck={false}
                    />
                </div>

                {token.trim() && !decoded && (
                    <div className="flex items-center gap-2 text-xs font-medium text-error">
                        <span className="w-2 h-2 rounded-full bg-error" />
                        Invalid JWT token. A valid JWT has 3 parts separated by dots.
                    </div>
                )}

                {decoded && (
                    <>
                        {/* Expiry status */}
                        <div className="flex flex-wrap items-center gap-4">
                            {decoded.expired !== null && (
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${decoded.expired ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                                    <span className={`w-2.5 h-2.5 rounded-full ${decoded.expired ? 'bg-error' : 'bg-success animate-pulse'}`} />
                                    {decoded.expired ? 'Token Expired' : 'Token Valid'}
                                </div>
                            )}
                            {decoded.expiresAt && (
                                <span className="text-xs text-text-muted">
                                    Expires: <span className="text-text-secondary font-mono">{decoded.expiresAt}</span>
                                </span>
                            )}
                            {decoded.issuedAt && (
                                <span className="text-xs text-text-muted">
                                    Issued: <span className="text-text-secondary font-mono">{decoded.issuedAt}</span>
                                </span>
                            )}
                        </div>

                        {/* Decoded sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Section
                                title="HEADER"
                                data={JSON.stringify(decoded.header, null, 2)}
                                color="#ec4899"
                            />
                            <Section
                                title="PAYLOAD"
                                data={JSON.stringify(decoded.payload, null, 2)}
                                color="#8b5cf6"
                            />
                        </div>

                        <Section
                            title="SIGNATURE"
                            data={decoded.signature}
                            color="#f59e0b"
                        />

                        {/* Privacy notice */}
                        <div className="text-xs text-text-muted bg-bg-card/50 rounded-lg p-3 border border-border/50">
                            🔒 Everything is decoded locally in your browser. No data is sent to any server.
                        </div>
                    </>
                )}
            </div>
        </ToolPage>
    );
}
