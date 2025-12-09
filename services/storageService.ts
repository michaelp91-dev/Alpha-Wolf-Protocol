
import { ActivityLog, RoutineMap, WeekMode, ProtocolConfig } from '../types';
import { defaultRoutines, GOOGLE_SCRIPT_URL } from '../constants';

const KEYS = {
    HISTORY: 'wolf_history',
    ROUTINES: 'wolf_routines',
    WEEK_MODE: 'wolf_week_mode',
    PROTOCOL_CONFIG: 'wolf_protocol_config',
    DAILY_PROGRESS: 'wolf_daily_progress',
    DAILY_LOGGED_IDS: 'wolf_daily_logged_ids'
};

const defaultProtocolConfig: ProtocolConfig = {
    wakeUpRoutine: 'Wake Up',
    morningRoutine: 'Morning Workout',
    cooldownRoutine: 'Cooldown Flow',
    missionRoutine: 'Garage Games',
    missionLabel: 'Secondary Ops'
};

// Helper to get YYYY-MM-DD in local time
const getTodayKey = () => new Date().toLocaleDateString('en-CA');

export const storageService = {
    getHistory: (): ActivityLog[] => {
        try {
            const data = localStorage.getItem(KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch { return []; }
    },

    saveHistory: (history: ActivityLog[]) => {
        localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    },

    addLog: (log: ActivityLog) => {
        const history = storageService.getHistory();
        history.unshift(log); // Add to top
        storageService.saveHistory(history);
        
        // Fire and forget sync to Google Sheets
        storageService.syncLog(log);
    },

    syncLog: async (log: ActivityLog) => {
        if (!GOOGLE_SCRIPT_URL) return;
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Script Web Apps
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(log)
            });
            console.log('Synced Log to Cloud');
        } catch (e) {
            console.error('Log sync failed', e);
        }
    },

    syncHistory: async () => {
        if (!GOOGLE_SCRIPT_URL) return;
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL);
            const data = await response.json();
            
            if (data.history && Array.isArray(data.history)) {
                const cloudHistory = data.history.reverse(); 
                localStorage.setItem(KEYS.HISTORY, JSON.stringify(cloudHistory));
                console.log('History Synced from Sheet');
            }
        } catch (e) {
            console.error("History sync failed", e);
        }
    },

    getRoutines: (): RoutineMap => {
        try {
            const data = localStorage.getItem(KEYS.ROUTINES);
            return data ? JSON.parse(data) : defaultRoutines;
        } catch { return defaultRoutines; }
    },

    saveRoutines: (routines: RoutineMap) => {
        localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
    },

    syncRoutines: async () => {
        if (!GOOGLE_SCRIPT_URL) return;
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL);
            const data = await response.json();
            const routines = data.routines || data;
            
            if (routines) {
                const mappedRoutines = { ...defaultRoutines, ...routines };
                localStorage.setItem(KEYS.ROUTINES, JSON.stringify(mappedRoutines));
                console.log('Routines Synced from Sheet');
                return mappedRoutines;
            }
        } catch (e) {
            console.error("Routine sync failed", e);
        }
        return null;
    },

    getWeekMode: (): WeekMode => {
        return (localStorage.getItem(KEYS.WEEK_MODE) as WeekMode) || 'FAMILY';
    },

    saveWeekMode: (mode: WeekMode) => {
        localStorage.setItem(KEYS.WEEK_MODE, mode);
    },

    getProtocolConfig: (): ProtocolConfig => {
        try {
            const data = localStorage.getItem(KEYS.PROTOCOL_CONFIG);
            return data ? { ...defaultProtocolConfig, ...JSON.parse(data) } : defaultProtocolConfig;
        } catch { return defaultProtocolConfig; }
    },

    saveProtocolConfig: (config: ProtocolConfig) => {
        localStorage.setItem(KEYS.PROTOCOL_CONFIG, JSON.stringify(config));
    },

    // --- Daily Progress Persistence ---

    getDailyProgress: (): string[] => {
        try {
            const today = getTodayKey();
            const raw = localStorage.getItem(KEYS.DAILY_PROGRESS);
            if (!raw) return [];

            const data = JSON.parse(raw);
            // If the stored data is from a previous day, return empty (reset)
            if (data.date !== today) return [];
            
            return data.items || [];
        } catch { return []; }
    },

    saveDailyProgress: (items: string[]) => {
        const today = getTodayKey();
        const payload = { date: today, items };
        localStorage.setItem(KEYS.DAILY_PROGRESS, JSON.stringify(payload));
    },

    // --- Prevent Duplicate Logs ---
    
    // Check if a specific ID (e.g., 'wake_water') has already been sent to history TODAY
    hasLoggedToday: (itemId: string): boolean => {
        try {
            const today = getTodayKey();
            const raw = localStorage.getItem(KEYS.DAILY_LOGGED_IDS);
            if (!raw) return false;

            const data = JSON.parse(raw);
            if (data.date !== today) return false;

            return (data.ids || []).includes(itemId);
        } catch { return false; }
    },

    markLoggedToday: (itemId: string) => {
        const today = getTodayKey();
        let currentIds: string[] = [];
        
        try {
            const raw = localStorage.getItem(KEYS.DAILY_LOGGED_IDS);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.date === today) {
                    currentIds = data.ids || [];
                }
            }
        } catch {}

        if (!currentIds.includes(itemId)) {
            currentIds.push(itemId);
            localStorage.setItem(KEYS.DAILY_LOGGED_IDS, JSON.stringify({ date: today, ids: currentIds }));
        }
    }
};
