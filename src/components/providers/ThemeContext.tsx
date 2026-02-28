'use client';

import React, { createContext, useState, useEffect } from 'react';

type ThemeContextType = {
    themeColor: string;
    setThemeColor: (color: string) => void;
    isActive: boolean;
    setIsActive: (active: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Default TA accent color (Black and White Theme)
    const [themeColor, setThemeColor] = useState('#ffffff');
    const [isActive, setIsActive] = useState(true);

    // Apply the theme color to CSS variables for dynamic mesh gradients
    useEffect(() => {
        document.documentElement.style.setProperty('--ta-theme-color', themeColor);
    }, [themeColor]);

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor, isActive, setIsActive }}>
            {children}
        </ThemeContext.Provider>
    );
}
