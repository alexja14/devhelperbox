export interface ToolMeta {
    title: string;
    metaTitle: string;
    description: string;
    keywords: string;
    path: string;
    icon: string;
    color: string;
}

export const tools: ToolMeta[] = [
    {
        title: 'JSON Formatter',
        metaTitle: 'JSON Formatter & Validator Online - Free | DevHelperBox',
        description: 'Format, validate, and beautify JSON data online. Real-time syntax highlighting, error detection, and tree view. Free, no signup required.',
        keywords: 'json formatter, json validator, json beautifier, json online, format json, pretty print json',
        path: '/json-formatter',
        icon: '{ }',
        color: '#f59e0b',
    },
    {
        title: 'Base64 Encoder',
        metaTitle: 'Base64 Encode & Decode Online - Free | DevHelperBox',
        description: 'Encode and decode Base64 strings and files instantly. Supports text, images, and URL-safe Base64. Free online tool.',
        keywords: 'base64 encode, base64 decode, base64 online, base64 converter, base64 image',
        path: '/base64',
        icon: 'B64',
        color: '#8b5cf6',
    },
    {
        title: 'Regex Tester',
        metaTitle: 'Regex Tester Online - Free Regular Expression Tester | DevHelperBox',
        description: 'Test regular expressions in real-time with match highlighting, capture groups, and a built-in cheat sheet. Free regex tool.',
        keywords: 'regex tester, regex online, regular expression tester, regex debugger, regex validator',
        path: '/regex-tester',
        icon: '.*',
        color: '#22c55e',
    },
    {
        title: 'JWT Decoder',
        metaTitle: 'JWT Decoder Online - Free JSON Web Token Decoder | DevHelperBox',
        description: 'Decode and inspect JWT tokens instantly. View header, payload, and expiration status. Free, no data sent to any server.',
        keywords: 'jwt decoder, jwt debugger, json web token decoder, jwt online, decode jwt',
        path: '/jwt-decoder',
        icon: 'JWT',
        color: '#ec4899',
    },
    {
        title: 'Color Converter',
        metaTitle: 'Color Converter Online - HEX RGB HSL | DevHelperBox',
        description: 'Convert colors between HEX, RGB, HSL formats. Generate palettes, check WCAG contrast accessibility. Free color tool.',
        keywords: 'color converter, hex to rgb, rgb to hex, color picker, hsl converter, color palette generator',
        path: '/color-converter',
        icon: '🎨',
        color: '#06b6d4',
    },
    {
        title: 'Hash Generator',
        metaTitle: 'Hash Generator Online - MD5 SHA-256 SHA-512 | DevHelperBox',
        description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Uses Web Crypto API. Free, everything runs in your browser.',
        keywords: 'hash generator, md5 generator, sha256 online, sha512 hash, hash file online',
        path: '/hash-generator',
        icon: '#',
        color: '#f97316',
    },
    {
        title: 'QR Code Generator',
        metaTitle: 'QR Code Generator Online - Free | DevHelperBox',
        description: 'Generate QR codes from text, URLs, emails, and more. Download as PNG or SVG. Free QR code maker with customizable size and colors.',
        keywords: 'qr code generator, qr code maker, create qr code, qr code online free, generate qr code',
        path: '/qr-code',
        icon: '▣',
        color: '#10b981',
    },
    {
        title: 'Password Generator',
        metaTitle: 'Password Generator Online - Strong & Secure | DevHelperBox',
        description: 'Generate strong, secure random passwords instantly. Customize length, characters, symbols. Everything runs locally in your browser.',
        keywords: 'password generator, random password, strong password generator, secure password, password maker',
        path: '/password-generator',
        icon: '🔑',
        color: '#ef4444',
    },
    {
        title: 'URL Encoder',
        metaTitle: 'URL Encode & Decode Online - Free | DevHelperBox',
        description: 'Encode and decode URLs and query strings instantly. Supports encodeURIComponent and full URI encoding. Free online URL tool.',
        keywords: 'url encode, url decode, url encoder, urlencode online, percent encoding',
        path: '/url-encode',
        icon: '%',
        color: '#3b82f6',
    },
    {
        title: 'UUID Generator',
        metaTitle: 'UUID Generator Online - Free UUID v4 Generator | DevHelperBox',
        description: 'Generate random UUID v4 identifiers instantly. Bulk generation, copy to clipboard. Free, no signup required.',
        keywords: 'uuid generator, uuid online, generate uuid, uuid v4, random uuid, guid generator',
        path: '/uuid-generator',
        icon: 'ID',
        color: '#a855f7',
    },
    {
        title: 'Diff Checker',
        metaTitle: 'Diff Checker Online - Free Text Comparison | DevHelperBox',
        description: 'Compare two texts side by side and see the differences highlighted. Free online diff tool with line-by-line comparison.',
        keywords: 'diff checker, text compare, diff tool online, compare text, text difference',
        path: '/diff-checker',
        icon: '±',
        color: '#14b8a6',
    },
    {
        title: 'Timestamp Converter',
        metaTitle: 'Unix Timestamp Converter Online - Free | DevHelperBox',
        description: 'Convert between Unix timestamps and human-readable dates. Supports seconds and milliseconds. Shows current timestamp live.',
        keywords: 'timestamp converter, unix timestamp, epoch converter, timestamp to date, date to timestamp',
        path: '/timestamp',
        icon: '⏱',
        color: '#eab308',
    },
];
