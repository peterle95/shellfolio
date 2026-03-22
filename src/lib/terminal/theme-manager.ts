import { ThemeTokens } from './types';
import { allThemes, modernDarkTheme } from './themes';

export class ThemeManager {
    private currentTheme: ThemeTokens = modernDarkTheme;

    constructor() {
        this.load();
    }

    public get current(): ThemeTokens {
        return this.currentTheme;
    }

    public setTheme(themeName: string): boolean {
        if (allThemes[themeName]) {
            this.currentTheme = allThemes[themeName];
            this.apply();
            this.save();
            return true;
        }
        return false;
    }

    public getAvailableThemes(): string[] {
        return Object.keys(allThemes);
    }

    public apply() {
        if (typeof document === 'undefined') return;
        
        const root = document.documentElement;
        Object.entries(this.currentTheme.cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        
        // Add phosphor special cases
        if (this.currentTheme.name === 'phosphor') {
            root.classList.add('theme-phosphor');
        } else {
            root.classList.remove('theme-phosphor');
        }
    }

    private load() {
        if (typeof window === 'undefined') return;
        try {
            const stored = localStorage.getItem('shellfolio_theme');
            if (stored && allThemes[stored]) {
                this.currentTheme = allThemes[stored];
            }
        } catch (e) {
            console.warn('Failed to load theme from localStorage', e);
        }
    }

    private save() {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem('shellfolio_theme', this.currentTheme.name);
        } catch (e) {
            console.warn('Failed to save theme to localStorage', e);
        }
    }
}
