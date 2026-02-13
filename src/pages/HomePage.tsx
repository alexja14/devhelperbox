import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { tools } from '../utils/seo';

export default function HomePage() {
    return (
        <>
            <Helmet>
                <title>DevHelperBox — Free Online Developer Tools</title>
                <meta
                    name="description"
                    content="Free online developer tools: JSON formatter, Base64 encoder, regex tester, JWT decoder, QR code generator, password generator, and more. 100% client-side, no data sent to servers."
                />
                <meta name="keywords" content="developer tools online free, json formatter, base64 encode, regex tester, jwt decoder, qr code generator, password generator, url encoder, uuid generator" />
                <meta property="og:title" content="DevHelperBox — Free Online Developer Tools" />
                <meta property="og:description" content="Swiss Army Knife for developers. 12 essential tools, 100% in your browser." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://devhelperbox.dev" />
                <link rel="canonical" href="https://devhelperbox.dev" />
            </Helmet>

            <div className="animate-fade-in max-w-5xl">
                {/* Hero */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        100% Client-Side · Privacy First
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight">
                        Developer Tools<br />
                        <span className="text-text-muted">that respect your data.</span>
                    </h1>
                    <p className="text-text-secondary text-lg max-w-xl">
                        12 essential tools for your daily workflow. Everything runs in your browser —
                        no data is ever sent to any server.
                    </p>
                </div>

                {/* Tool Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="group relative p-6 rounded-xl bg-bg-card border border-border hover:border-border-hover transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
                        >
                            {/* Glow effect on hover */}
                            <div
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color}08, transparent 70%)` }}
                            />

                            <div className="relative">
                                <div
                                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-base font-bold font-mono mb-4"
                                    style={{ background: `${tool.color}15`, color: tool.color }}
                                >
                                    {tool.icon}
                                </div>
                                <h2 className="text-base font-semibold text-text-primary mb-1.5 group-hover:text-accent-hover transition-colors">
                                    {tool.title}
                                </h2>
                                <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                                    {tool.description}
                                </p>

                                {/* Arrow */}
                                <div className="mt-4 text-text-muted group-hover:text-accent-hover transition-all group-hover:translate-x-1">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 8h10M9 4l4 4-4 4" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-12 text-center text-text-muted text-xs">
                    Built with ❤️ using React + Vite · No tracking · No cookies · No accounts
                </div>
            </div>
        </>
    );
}
