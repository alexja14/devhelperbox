import '@testing-library/jest-dom/vitest';

// Mock crypto.subtle for hash tests
if (!globalThis.crypto?.subtle) {
    Object.defineProperty(globalThis, 'crypto', {
        value: {
            ...globalThis.crypto,
            randomUUID: () => '550e8400-e29b-41d4-a716-446655440000',
            getRandomValues: (arr: Uint32Array) => {
                for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 4294967296);
                return arr;
            },
            subtle: {
                digest: async (algorithm: string, data: BufferSource) => {
                    // Simple mock: return a fixed-length buffer based on algorithm
                    const lengths: Record<string, number> = { 'SHA-1': 20, 'SHA-256': 32, 'SHA-512': 64 };
                    const len = lengths[algorithm] || 32;
                    const buf = new ArrayBuffer(len);
                    const view = new Uint8Array(buf);
                    const dataView = new Uint8Array(data instanceof ArrayBuffer ? data : (data as Uint8Array).buffer);
                    for (let i = 0; i < len; i++) view[i] = (dataView[i % dataView.length] || 0) ^ (i * 31);
                    return buf;
                },
            },
        },
    });
}

// Mock canvas
HTMLCanvasElement.prototype.getContext = (() => ({
    fillRect: () => { },
    clearRect: () => { },
    putImageData: () => { },
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    createLinearGradient: () => ({ addColorStop: () => { } }),
    drawImage: () => { },
    save: () => { },
    restore: () => { },
    beginPath: () => { },
    moveTo: () => { },
    lineTo: () => { },
    closePath: () => { },
    stroke: () => { },
    fill: () => { },
    arc: () => { },
    translate: () => { },
    scale: () => { },
    rotate: () => { },
    measureText: () => ({ width: 0 }),
    setTransform: () => { },
    resetTransform: () => { },
    canvas: { width: 256, height: 256 },
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;
