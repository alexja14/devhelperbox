import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import JsonFormatter from './pages/JsonFormatter';
import Base64Tool from './pages/Base64Tool';
import RegexTester from './pages/RegexTester';
import JwtDecoder from './pages/JwtDecoder';
import ColorConverter from './pages/ColorConverter';
import HashGenerator from './pages/HashGenerator';
import QrCodeGenerator from './pages/QrCodeGenerator';
import PasswordGenerator from './pages/PasswordGenerator';
import UrlEncoder from './pages/UrlEncoder';
import UuidGenerator from './pages/UuidGenerator';
import DiffChecker from './pages/DiffChecker';
import TimestampConverter from './pages/TimestampConverter';
import PhpFormatter from './pages/PhpFormatter';
import SupportPage from './pages/SupportPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/json-formatter" element={<JsonFormatter />} />
        <Route path="/base64" element={<Base64Tool />} />
        <Route path="/regex-tester" element={<RegexTester />} />
        <Route path="/jwt-decoder" element={<JwtDecoder />} />
        <Route path="/color-converter" element={<ColorConverter />} />
        <Route path="/hash-generator" element={<HashGenerator />} />
        <Route path="/qr-code" element={<QrCodeGenerator />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/url-encode" element={<UrlEncoder />} />
        <Route path="/uuid-generator" element={<UuidGenerator />} />
        <Route path="/diff-checker" element={<DiffChecker />} />
        <Route path="/timestamp" element={<TimestampConverter />} />
        <Route path="/php-formatter" element={<PhpFormatter />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
    </Routes>
  );
}
