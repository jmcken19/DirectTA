/**
 * Helper to ensure the contrast ratio of text/background is accessible (WCAG compliant)
 */
export function getLuminance(hex: string) {
    const parse = (str: string) => parseInt(str, 16);
    let r = parse(hex.substring(1, 3)) / 255;
    let g = parse(hex.substring(3, 5)) / 255;
    let b = parse(hex.substring(5, 7)) / 255;

    const lum = (val: number) => {
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
}

export function passesContrastRatio(colorHex: string, mode: 'light' | 'dark' = 'dark') {
    const bgLuminance = getLuminance(colorHex);
    const fgLuminance = mode === 'dark' ? 1 : 0; // Assuming white text on dark mode, black text on light
    const lighter = Math.max(bgLuminance, fgLuminance);
    const darker = Math.min(bgLuminance, fgLuminance);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return ratio >= 4.5; // WCAG AA standard for normal text
}

/**
 * Fallback AI Anonymization wrapper for public FAQ posts.
 */
export function anonymizeStudentDetails(content: string) {
    return content.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[Student Name Redacted]');
}
