'use client';

import { useState, useEffect } from 'react';

interface SelectionState {
    courseId: string | null;
    courseName: string | null;
    taId: string | null;
    timestamp: number;
}

const CACHE_KEY = 'ta_direct_selection';
// 12 hours in milliseconds for same-day caching
const CACHE_DURATION = 12 * 60 * 60 * 1000;

export function useSelection() {
    const [selection, setSelection] = useState<SelectionState>({
        courseId: null,
        courseName: null,
        taId: null,
        timestamp: 0,
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from cache on mount
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed: SelectionState = JSON.parse(cached);
                const now = new Date().getTime();

                // If it's valid within the 12 hour window, restore it
                if (now - parsed.timestamp < CACHE_DURATION) {
                    setSelection(parsed);
                } else {
                    // Expired, clear it out
                    sessionStorage.removeItem(CACHE_KEY);
                }
            } catch (e) {
                console.error("Failed to parse selection cache", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const setCourseSelect = (courseId: string, courseName: string) => {
        const newState = {
            ...selection,
            courseId,
            courseName,
            timestamp: new Date().getTime()
        };
        setSelection(newState);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(newState));
    };

    const setTaSelect = (taId: string) => {
        const newState = {
            ...selection,
            taId,
            timestamp: new Date().getTime()
        };
        setSelection(newState);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(newState));
    };

    const clearSelection = () => {
        const newState = {
            courseId: null,
            courseName: null,
            taId: null,
            timestamp: 0
        };
        setSelection(newState);
        sessionStorage.removeItem(CACHE_KEY);
    };

    return {
        ...selection,
        isLoaded,
        setCourseSelect,
        setTaSelect,
        clearSelection
    };
}
