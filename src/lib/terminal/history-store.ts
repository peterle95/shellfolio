import { HistoryItem } from './types';

export class HistoryStore {
    private history: HistoryItem[] = [];
    private currentIndex: number = -1;
    private maxCapacity: number;

    constructor(maxCapacity: number = 200) {
        this.maxCapacity = maxCapacity;
        this.load();
    }

    private load() {
        if (typeof window === 'undefined') return;
        try {
            const stored = sessionStorage.getItem('terminal_history');
            if (stored) {
                // Parse commands only (not output React nodes)
                const parsed = JSON.parse(stored) as { id: number; command: string; timestamp: number }[];
                this.history = parsed.map(p => ({
                    ...p,
                    output: '' // React nodes can't be serialized to sessionStorage
                }));
            }
        } catch (e) {
            console.warn('Failed to load history from sessionStorage', e);
        }
    }

    private save() {
        if (typeof window === 'undefined') return;
        try {
            // Save only the serializable parts
            const serialized = this.history.map(item => ({
                id: item.id,
                command: item.command,
                timestamp: item.timestamp
            }));
            sessionStorage.setItem('terminal_history', JSON.stringify(serialized));
        } catch (e) {
            console.warn('Failed to save history to sessionStorage', e);
        }
    }

    push(entry: Omit<HistoryItem, 'id' | 'timestamp'>) {
        const newItem: HistoryItem = {
            ...entry,
            id: Date.now() + Math.random(),
            timestamp: Date.now()
        };

        this.history.push(newItem);
        if (this.history.length > this.maxCapacity) {
            this.history.shift();
        }
        
        // Reset navigation index
        this.currentIndex = this.history.length;
        this.save();
    }

    getAll(): HistoryItem[] {
        return [...this.history];
    }

    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.save();
    }

    prev(): string | null {
        if (this.history.length === 0) return null;
        
        // Use a separate array containing only executed commands (not outputs or empty entries)
        const commands = this.history.map(h => h.command).filter(c => c.trim().length > 0);
        if (commands.length === 0) return null;

        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
        return commands[this.currentIndex] || null;
    }

    next(): string | null {
        if (this.history.length === 0) return null;

        const commands = this.history.map(h => h.command).filter(c => c.trim().length > 0);
        
        if (this.currentIndex < commands.length - 1) {
            this.currentIndex++;
            return commands[this.currentIndex] || null;
        } else {
            this.currentIndex = commands.length;
            return '';
        }
    }

    resetNavigation() {
        const commands = this.history.map(h => h.command).filter(c => c.trim().length > 0);
        this.currentIndex = commands.length;
    }
}
