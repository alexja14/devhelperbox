import { Helmet } from 'react-helmet-async';

export default function SupportPage() {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto p-6">
            <Helmet>
                <title>Support DevHelperBox — Donate & Contribute</title>
                <meta name="description" content="Support DevHelperBox development. Donate via Buy Me a Coffee or star us on GitHub. Help keep free developer tools online." />
                <link rel="canonical" href="https://devhelperbox.dev/support" />
            </Helmet>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Support DevHelperBox</h1>

            <div className="bg-bg-card border border-border rounded-xl p-8 mb-8">
                <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                    DevHelperBox is a free, privacy-first set of developer tools.
                    We believe in keeping your data safe by running everything locally in your browser.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-bg-tertiary rounded-lg border border-border/50">
                        <h3 className="text-xl font-semibold text-text-primary mb-3">☕ Buy us a coffee</h3>
                        <p className="text-text-muted mb-4">
                            Server costs and domain renewals aren't free. Help us keep the lights on!
                        </p>
                        <a
                            href="https://buymeacoffee.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#FFDD00] text-black font-bold rounded-lg hover:opacity-90 transition-opacity w-full"
                        >
                            Donate via Buy Me a Coffee
                        </a>
                    </div>

                    <div className="p-6 bg-bg-tertiary rounded-lg border border-border/50">
                        <h3 className="text-xl font-semibold text-text-primary mb-3">⭐ Star on GitHub</h3>
                        <p className="text-text-muted mb-4">
                            Show your support by starring the project. It helps others find us!
                        </p>
                        <a
                            href="https://github.com/alexja14/devhelperbox"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-text-primary text-bg-primary font-bold rounded-lg hover:opacity-90 transition-opacity w-full"
                        >
                            Star Repository
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Why Support Us?</h2>
                <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span><strong>Privacy First:</strong> No data is sent to our servers. Your secrets stay yours.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span><strong>Free Forever:</strong> We don't hide features behind paywalls.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span><strong>Open Source:</strong> Transparent code you can potential audit and trust.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
