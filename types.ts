
export type WeekMode = 'FOCUS' | 'FAMILY';

export type ScreenName = 'MENU' | 'DAILY' | 'WORKOUT' | 'HISTORY' | 'TOOLS' | 'EDITOR' | 'LIST';

export type StepType = 'work' | 'rest' | 'rep_work' | 'cooldown' | 'amrap' | 'countdown';

export interface RoutineStep {
    type: StepType;
    name: string;
    duration?: number; // Seconds
    exercises?: string[]; // For rep_work or amrap
    round?: string;
}

export interface Routine {
    steps: RoutineStep[];
    details?: {
        maxReps?: number;
        weight?: string;
    };
}

export interface ProtocolConfig {
    wakeUpRoutine: string;
    morningRoutine: string;
    cooldownRoutine: string;
    missionRoutine: string;
    missionLabel: string;
}

export interface ActivityLog {
    id: string; // ISO Date
    date: string;
    type: string;
    duration: string;
    details: {
        rating?: 'Positive' | 'Negative' | 'Neutral';
        focus?: 'High' | 'Medium' | 'Low' | 'None';
        notes?: string;
        amount?: string;
        unit?: string;
        weight?: string;
    };
}

export interface RoutineMap {
    [key: string]: RoutineStep[];
}
