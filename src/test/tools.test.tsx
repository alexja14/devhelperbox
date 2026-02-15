import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';

// Import all tool pages
import HomePage from '../pages/HomePage';
import JsonFormatter from '../pages/JsonFormatter';
import Base64Tool from '../pages/Base64Tool';
import RegexTester from '../pages/RegexTester';
import JwtDecoder from '../pages/JwtDecoder';
import ColorConverter from '../pages/ColorConverter';
import HashGenerator from '../pages/HashGenerator';
import QrCodeGenerator from '../pages/QrCodeGenerator';
import PasswordGenerator from '../pages/PasswordGenerator';
import UrlEncoder from '../pages/UrlEncoder';
import UuidGenerator from '../pages/UuidGenerator';
import DiffChecker from '../pages/DiffChecker';
import TimestampConverter from '../pages/TimestampConverter';

// Helper: wrap component with required providers
function renderWithProviders(ui: React.ReactElement, route = '/') {
    return render(
        <HelmetProvider>
            <MemoryRouter initialEntries={[route]}>
                {ui}
            </MemoryRouter>
        </HelmetProvider>
    );
}

// ─── 1. HOMEPAGE ────────────────────────────────────────────────────────────────
describe('HomePage', () => {
    it('renders all 12 tool cards', () => {
        renderWithProviders(<HomePage />);
        expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
        expect(screen.getByText('Base64 Encoder')).toBeInTheDocument();
        expect(screen.getByText('Regex Tester')).toBeInTheDocument();
        expect(screen.getByText('JWT Decoder')).toBeInTheDocument();
        expect(screen.getByText('Color Converter')).toBeInTheDocument();
        expect(screen.getByText('Hash Generator')).toBeInTheDocument();
        expect(screen.getByText('QR Code Generator')).toBeInTheDocument();
        expect(screen.getByText('Password Generator')).toBeInTheDocument();
        expect(screen.getByText('URL Encoder')).toBeInTheDocument();
        expect(screen.getByText('UUID Generator')).toBeInTheDocument();
        expect(screen.getByText('Diff Checker')).toBeInTheDocument();
        expect(screen.getByText('Timestamp Converter')).toBeInTheDocument();
    });

    it('renders hero section', () => {
        renderWithProviders(<HomePage />);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
});

// ─── 2. JSON FORMATTER ─────────────────────────────────────────────────────────
describe('JsonFormatter', () => {
    it('renders with empty state', () => {
        renderWithProviders(<JsonFormatter />, '/json-formatter');
        expect(screen.getByPlaceholderText(/Paste your JSON/i)).toBeInTheDocument();
        expect(screen.getByText('Format')).toBeInTheDocument();
        expect(screen.getByText('Minify')).toBeInTheDocument();
    });

    it('validates correct JSON', async () => {
        renderWithProviders(<JsonFormatter />, '/json-formatter');
        const input = screen.getByPlaceholderText(/Paste your JSON/i);
        fireEvent.change(input, { target: { value: '{"name":"test"}' } });
        await waitFor(() => {
            expect(screen.getByText(/Valid JSON/i)).toBeInTheDocument();
        });
    });

    it('shows error on invalid JSON', async () => {
        renderWithProviders(<JsonFormatter />, '/json-formatter');
        const input = screen.getByPlaceholderText(/Paste your JSON/i);
        fireEvent.change(input, { target: { value: '{broken' } });
        await waitFor(() => {
            expect(screen.getByText(/Invalid/i)).toBeInTheDocument();
        });
    });
});

// ─── 3. BASE64 TOOL ─────────────────────────────────────────────────────────────
describe('Base64Tool', () => {
    it('renders encode/decode toggle', () => {
        renderWithProviders(<Base64Tool />, '/base64');
        expect(screen.getByText('Encode')).toBeInTheDocument();
        expect(screen.getByText('Decode')).toBeInTheDocument();
    });

    it('encodes text to base64', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Base64Tool />, '/base64');
        const input = screen.getByPlaceholderText(/text to encode/i);
        await user.clear(input);
        await user.type(input, 'Hello');
        await waitFor(() => {
            expect(screen.getByText('SGVsbG8=')).toBeInTheDocument();
        });
    });
});

// ─── 4. REGEX TESTER ────────────────────────────────────────────────────────────
describe('RegexTester', () => {
    it('renders pattern and test string inputs', () => {
        renderWithProviders(<RegexTester />, '/regex-tester');
        expect(screen.getByPlaceholderText(/regex pattern/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/test string/i)).toBeInTheDocument();
    });

    it('shows match count for valid regex', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RegexTester />, '/regex-tester');
        const pattern = screen.getByPlaceholderText(/regex pattern/i);
        const testStr = screen.getByPlaceholderText(/test string/i);
        await user.type(pattern, '\\d+');
        await user.type(testStr, 'abc123def456');
        await waitFor(() => {
            expect(screen.getByText(/2 match/i)).toBeInTheDocument();
        });
    });
});

// ─── 5. JWT DECODER ─────────────────────────────────────────────────────────────
describe('JwtDecoder', () => {
    const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    it('renders JWT input', () => {
        renderWithProviders(<JwtDecoder />, '/jwt-decoder');
        expect(screen.getByPlaceholderText(/Paste your JWT/i)).toBeInTheDocument();
    });

    it('decodes a valid JWT token', async () => {
        const user = userEvent.setup();
        renderWithProviders(<JwtDecoder />, '/jwt-decoder');
        const input = screen.getByPlaceholderText(/Paste your JWT/i);
        await user.type(input, sampleJwt);
        await waitFor(() => {
            expect(screen.getByText(/"alg"/i)).toBeInTheDocument();
            expect(screen.getByText(/"sub"/i)).toBeInTheDocument();
        });
    });
});

// ─── 6. COLOR CONVERTER ────────────────────────────────────────────────────────
describe('ColorConverter', () => {
    it('renders with default color', () => {
        renderWithProviders(<ColorConverter />, '/color-converter');
        // Should show color format labels
        expect(screen.getAllByText(/HEX/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/RGB/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/HSL/i).length).toBeGreaterThan(0);
    });

    it('shows palette sections', () => {
        renderWithProviders(<ColorConverter />, '/color-converter');
        expect(screen.getByText(/Complementary/i)).toBeInTheDocument();
    });
});

// ─── 7. HASH GENERATOR ─────────────────────────────────────────────────────────
describe('HashGenerator', () => {
    it('renders input and algorithm labels', () => {
        renderWithProviders(<HashGenerator />, '/hash-generator');
        expect(screen.getByPlaceholderText(/text to hash/i)).toBeInTheDocument();
    });

    it('generates hashes for text input', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HashGenerator />, '/hash-generator');
        const input = screen.getByPlaceholderText(/text to hash/i);
        await user.type(input, 'test');
        await waitFor(() => {
            expect(screen.getByText('MD5')).toBeInTheDocument();
            expect(screen.getByText('SHA-1')).toBeInTheDocument();
            expect(screen.getByText('SHA-256')).toBeInTheDocument();
            expect(screen.getByText('SHA-512')).toBeInTheDocument();
        });
    });
});

// ─── 8. QR CODE GENERATOR ──────────────────────────────────────────────────────
describe('QrCodeGenerator', () => {
    it('renders with default URL', () => {
        renderWithProviders(<QrCodeGenerator />, '/qr-code');
        const textarea = screen.getByPlaceholderText(/text, URL/i);
        expect(textarea).toBeInTheDocument();
        expect((textarea as HTMLTextAreaElement).value).toContain('devhelperbox');
    });

    it('shows download and copy buttons', () => {
        renderWithProviders(<QrCodeGenerator />, '/qr-code');
        expect(screen.getByText(/Download PNG/i)).toBeInTheDocument();
        expect(screen.getByText(/Copy as SVG/i)).toBeInTheDocument();
    });
});

// ─── 9. PASSWORD GENERATOR ─────────────────────────────────────────────────────
describe('PasswordGenerator', () => {
    it('renders with a generated password', () => {
        renderWithProviders(<PasswordGenerator />, '/password-generator');
        expect(screen.getByText('Copy')).toBeInTheDocument();
        // Strength label should be present
        expect(screen.getByText(/Weak|Medium|Strong/)).toBeInTheDocument();
    });

    it('shows character set toggles', () => {
        renderWithProviders(<PasswordGenerator />, '/password-generator');
        // Check checkboxes exist for each charset
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBe(4);
    });

    it('generates bulk passwords', async () => {
        const user = userEvent.setup();
        renderWithProviders(<PasswordGenerator />, '/password-generator');
        const bulkBtn = screen.getByText(/Generate 10/i);
        await user.click(bulkBtn);
        // Should now show numbered list
        await waitFor(() => {
            const items = screen.getAllByText('Copy');
            expect(items.length).toBeGreaterThanOrEqual(10);
        });
    });
});

// ─── 10. URL ENCODER ───────────────────────────────────────────────────────────
describe('UrlEncoder', () => {
    it('renders encode/decode toggle', () => {
        renderWithProviders(<UrlEncoder />, '/url-encode');
        expect(screen.getByText('Encode')).toBeInTheDocument();
        expect(screen.getByText('Decode')).toBeInTheDocument();
    });

    it('encodes URL with special characters', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UrlEncoder />, '/url-encode');
        const input = screen.getByPlaceholderText(/example.com/i);
        await user.type(input, 'hello world');
        await waitFor(() => {
            expect(screen.getByText(/hello%20world/)).toBeInTheDocument();
        });
    });

    it('shows encodeURIComponent vs encodeURI toggle', () => {
        renderWithProviders(<UrlEncoder />, '/url-encode');
        expect(screen.getByText('encodeURIComponent')).toBeInTheDocument();
        expect(screen.getByText('encodeURI')).toBeInTheDocument();
    });
});

// ─── 11. UUID GENERATOR ────────────────────────────────────────────────────────
describe('UuidGenerator', () => {
    it('renders with a UUID displayed', () => {
        renderWithProviders(<UuidGenerator />, '/uuid-generator');
        // UUID v4 should be visible as a code element
        const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const codeElements = screen.getAllByText(uuidPattern);
        expect(codeElements.length).toBeGreaterThan(0);
    });

    it('has generate button', () => {
        renderWithProviders(<UuidGenerator />, '/uuid-generator');
        expect(screen.getByRole('button', { name: /Generate/ })).toBeInTheDocument();
    });

    it('has formatting options', () => {
        renderWithProviders(<UuidGenerator />, '/uuid-generator');
        expect(screen.getByText('UPPERCASE')).toBeInTheDocument();
        expect(screen.getByText('No dashes')).toBeInTheDocument();
    });
});

// ─── 12. DIFF CHECKER ──────────────────────────────────────────────────────────
describe('DiffChecker', () => {
    it('renders original and modified panels', () => {
        renderWithProviders(<DiffChecker />, '/diff-checker');
        expect(screen.getByPlaceholderText(/original text/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/modified text/i)).toBeInTheDocument();
    });

    it('shows diff when texts differ', async () => {
        const user = userEvent.setup();
        renderWithProviders(<DiffChecker />, '/diff-checker');
        const original = screen.getByPlaceholderText(/original text/i);
        const modified = screen.getByPlaceholderText(/modified text/i);
        await user.type(original, 'hello');
        await user.type(modified, 'world');
        await waitFor(() => {
            expect(screen.getByText(/added/i)).toBeInTheDocument();
            expect(screen.getByText(/removed/i)).toBeInTheDocument();
        });
    });
});

// ─── 13. TIMESTAMP CONVERTER ────────────────────────────────────────────────────
describe('TimestampConverter', () => {
    it('shows live clock', () => {
        renderWithProviders(<TimestampConverter />, '/timestamp');
        expect(screen.getByText(/Current Unix Timestamp/i)).toBeInTheDocument();
    });

    it('has mode toggle', () => {
        renderWithProviders(<TimestampConverter />, '/timestamp');
        expect(screen.getByText(/Timestamp → Date/i)).toBeInTheDocument();
        expect(screen.getByText(/Date → Timestamp/i)).toBeInTheDocument();
    });

    it('converts timestamp to date', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TimestampConverter />, '/timestamp');
        const input = screen.getByPlaceholderText(/1700000000/i);
        await user.type(input, '1700000000');
        await waitFor(() => {
            expect(screen.getByText(/Result/i)).toBeInTheDocument();
        });
    });
});

// ─── 14. PHP FORMATTER ────────────────────────────────────────────────────────
import PhpFormatter from '../pages/PhpFormatter';

describe('PhpFormatter', () => {
    it('renders input and output areas', () => {
        renderWithProviders(<PhpFormatter />, '/php-formatter');
        expect(screen.getByPlaceholderText(/<\?php/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Formatted code will appear here/i)).toBeInTheDocument();
    });

    it('has beautify button', () => {
        renderWithProviders(<PhpFormatter />, '/php-formatter');
        expect(screen.getByText('Beautify PHP')).toBeInTheDocument();
    });

    it('shows indentation options', () => {
        renderWithProviders(<PhpFormatter />, '/php-formatter');
        expect(screen.getByText('2 spaces')).toBeInTheDocument();
        expect(screen.getByText('4 spaces')).toBeInTheDocument();
    });
});
