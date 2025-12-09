
import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { DailyProtocol } from './components/DailyProtocol';
import { WorkoutSession } from './components/WorkoutSession';
import { Tools } from './components/Tools';
import { WorkoutList } from './components/WorkoutList';
import { HistoryList } from './components/HistoryList';
import { storageService } from './services/storageService';
import { WeekMode, ScreenName, Routine } from './types';
import { defaultRoutines } from './constants';

export default function App() {
    const [screen, setScreen] = useState<ScreenName>('MENU');
    const [weekMode, setWeekMode] = useState<WeekMode>('FAMILY');
    const [activeRoutine, setActiveRoutine] = useState<{name: string, data: Routine} | null>(null);

    useEffect(() => {
        // Load settings on mount
        setWeekMode(storageService.getWeekMode());
        
        // Trigger background sync for routines and history
        const initSync = async () => {
            await storageService.syncRoutines();
            await storageService.syncHistory();
        };
        initSync();
    }, []);

    const toggleWeekMode = () => {
        const newMode = weekMode === 'FAMILY' ? 'FOCUS' : 'FAMILY';
        setWeekMode(newMode);
        storageService.saveWeekMode(newMode);
    };

    const startRoutine = (routineName: string) => {
        const allRoutines = storageService.getRoutines();
        // If routine exists in DB use it, else fallback to constants
        const rData = allRoutines[routineName] || defaultRoutines[routineName];
        
        if (rData) {
            // Convert simple Step[] from storage to full Routine object if necessary
            // The storage might store it as just an array of steps
            const routineObj: Routine = Array.isArray(rData) ? { steps: rData } : rData as Routine;
            
            setActiveRoutine({ name: routineName, data: routineObj });
            setScreen('WORKOUT');
        } else {
            alert(`Protocol "${routineName}" not found. Syncing data...`);
            storageService.syncRoutines().then(() => {
                alert("Please try again.");
            });
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden bg-wolf-bg text-wolf-text font-body">
            {screen === 'MENU' && (
                <MainMenu 
                    weekMode={weekMode} 
                    toggleWeekMode={toggleWeekMode} 
                    navigate={setScreen} 
                />
            )}

            {screen === 'DAILY' && (
                <DailyProtocol 
                    weekMode={weekMode}
                    availableRoutines={Object.keys(storageService.getRoutines())}
                    onStartRoutine={startRoutine}
                    onExit={() => setScreen('MENU')}
                />
            )}

            {screen === 'WORKOUT' && activeRoutine && (
                <WorkoutSession 
                    routineName={activeRoutine.name}
                    routine={activeRoutine.data}
                    onExit={() => setScreen('MENU')}
                />
            )}

            {screen === 'LIST' && (
                <WorkoutList 
                    onStart={startRoutine}
                    onBack={() => setScreen('MENU')}
                />
            )}

            {screen === 'HISTORY' && (
                <HistoryList 
                    onBack={() => setScreen('MENU')}
                />
            )}

            {screen === 'TOOLS' && (
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-wolf-border flex justify-between items-center bg-wolf-bg">
                        <h2 className="font-heading text-2xl">TOOLS</h2>
                        <button onClick={() => setScreen('MENU')} className="text-xs font-bold uppercase text-wolf-muted border border-wolf-border px-2 py-1 rounded">Exit</button>
                    </div>
                    <Tools />
                </div>
            )}
            
            {screen === 'EDITOR' && (
                 <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-wolf-muted uppercase mb-4">Use Google Sheets to Edit Protocols</p>
                    <button onClick={() => setScreen('MENU')} className="px-4 py-2 border border-wolf-border rounded text-sm uppercase">Back</button>
                 </div>
            )}
        </div>
    );
}
