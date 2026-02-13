import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { tools } from '../utils/seo';

interface ToolPageProps {
    toolIndex: number;
    children: React.ReactNode;
}

export default function ToolPage({ toolIndex, children }: ToolPageProps) {
    const tool = tools[toolIndex];
    const location = useLocation();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.title,
        url: `https://devhelperbox.dev${tool.path}`,
        description: tool.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    };

    return (
        <>
            <Helmet>
                <title>{tool.metaTitle}</title>
                <meta name="description" content={tool.description} />
                <meta name="keywords" content={tool.keywords} />
                <meta property="og:title" content={tool.metaTitle} />
                <meta property="og:description" content={tool.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://devhelperbox.dev${location.pathname}`} />
                <link rel="canonical" href={`https://devhelperbox.dev${location.pathname}`} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>

            <div className="animate-fade-in">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
                    <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-text-secondary">{tool.title}</span>
                </nav>

                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-text-primary mb-2 flex items-center gap-3">
                        <span
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold font-mono"
                            style={{ background: `${tool.color}20`, color: tool.color }}
                        >
                            {tool.icon}
                        </span>
                        {tool.title}
                    </h1>
                    <p className="text-text-secondary text-sm max-w-2xl">{tool.description}</p>
                </div>

                {children}
            </div>
        </>
    );
}
