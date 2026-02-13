import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setStoredValue(prev => {
            const nextValue = value instanceof Function ? value(prev) : value;
            try {
                window.localStorage.setItem(key, JSON.stringify(nextValue));
            } catch { /* quota exceeded */ }
            return nextValue;
        });
    }, [key]);

    return [storedValue, setValue];
}

export function useInputHistory(toolKey: string, maxItems = 5) {
    const [history, setHistory] = useLocalStorage<string[]>(`devtools-history-${toolKey}`, []);

    const addToHistory = useCallback((input: string) => {
        if (!input.trim()) return;
        setHistory(prev => {
            const filtered = prev.filter(item => item !== input);
            return [input, ...filtered].slice(0, maxItems);
        });
    }, [setHistory, maxItems]);

    return { history, addToHistory };
}
