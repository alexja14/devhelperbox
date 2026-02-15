// Stub for Node's fs module — not available in the browser.
// The @prettier/plugin-php standalone bundle tries to use fs.existsSync
// to find composer.json for auto-detecting phpVersion. We stub it out
// and set phpVersion explicitly instead.
export function existsSync() {
    return false;
}
export function readFileSync() {
    return '';
}
export default { existsSync, readFileSync };
