import { NavLink } from 'react-router-dom';
import { tools } from '../utils/seo';
import { useState } from 'react';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Mobile overlay */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-bg-card border border-border hover:border-border-hover transition-colors"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle menu"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {collapsed ? (
                        <path d="M4 4L16 16M16 4L4 16" />
                    ) : (
                        <>
                            <path d="M3 5h14M3 10h14M3 15h14" />
                        </>
                    )}
                </svg>
            </button>

            <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen
        w-64 bg-bg-secondary border-r border-border
        flex flex-col
        transition-transform duration-200
        ${collapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-3 px-5 py-5 border-b border-border hover:bg-bg-hover transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
                        D
                    </div>
                    <div>
                        <div className="font-semibold text-sm text-text-primary">DevHelperBox</div>
                        <div className="text-[10px] text-text-muted tracking-wider uppercase">Developer Tools</div>
                    </div>
                </NavLink>

                {/* Tool Links */}
                <nav className="flex-1 py-3 overflow-y-auto">
                    <div className="px-4 pb-2 pt-1">
                        <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Tools</span>
                    </div>
                    {tools.map((tool) => (
                        <NavLink
                            key={tool.path}
                            to={tool.path}
                            onClick={() => setCollapsed(false)}
                            className={({ isActive }) => `
                flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg text-sm
                transition-all duration-150
                ${isActive
                                    ? 'bg-accent/10 text-accent-hover font-medium'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'}
              `}
                        >
                            <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold font-mono shrink-0"
                                style={{ background: `${tool.color}15`, color: tool.color }}
                            >
                                {tool.icon}
                            </span>
                            <span className="truncate">{tool.title}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-border">
                    <div className="text-[10px] text-text-muted">
                        100% Client-Side · No Data Sent
                    </div>
                </div>
            </aside>

            {/* Mobile backdrop */}
            {collapsed && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setCollapsed(false)}
                />
            )}
        </>
    );
}
