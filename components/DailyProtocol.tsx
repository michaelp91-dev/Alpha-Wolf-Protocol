
import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Scale, Settings, X } from 'lucide-react';
import { WeekMode, ProtocolConfig } from '../types';
import { storageService } from '../services/storageService';

interface Props {
    weekMode: WeekMode;
    availableRoutines: string[]; // List of routine names for the dropdown
    onStartRoutine: (routineName: string) => void;
    onExit: () => void;
}

export const DailyProtocol: React.FC<Props> = ({ weekMode, availableRoutines, onStartRoutine, onExit }) => {
    const [day] = useState<number>(new Date().getDay()); // 0=Sun, 1=Mon...
    const [completedItems, setCompletedItems] = useState<string[]>([]);
    const [config, setConfig] = useState<ProtocolConfig>(storageService.getProtocolConfig());
    const [showConfigModal, setShowConfigModal] = useState(false);
    
    // Morning Ops Stats
    const [opsStats, setOpsStats] = useState({
        pushups: '', squats: '', burpees: '', climbers: ''
    });
    const [weight, setWeight] = useState('');

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const currentDayName = days[day];
    
    // Logic flags
    const isWeekend = day === 0 || day === 6;
    const isMonOrFri = day === 1 || day === 5; // For Weight
    
    // Reveille Logic: FAMILY Mode: Mon(1)-Thu(4) | FOCUS Mode: Fri(5) only
    const isReveilleDay = (weekMode === 'FAMILY' && day >= 1 && day <= 4) || (weekMode === 'FOCUS' && day === 5);

    // Initialize state from storage on mount
    useEffect(() => {
        const savedProgress = storageService.getDailyProgress();
        setCompletedItems(savedProgress);
    }, []);

    const toggleItem = (id: string, logLabel: string, note?: string) => {
        let newItems: string[];

        if (completedItems.includes(id)) {
            // Uncheck: remove from UI state
            newItems = completedItems.filter(item => item !== id);
        } else {
            // Check: add to UI state
            newItems = [...completedItems, id];
            
            // Only Log if NOT already logged today
            if (!storageService.hasLoggedToday(id)) {
                storageService.addLog({
                    id: new Date().toISOString(),
                    date: new Date().toISOString(),
                    type: logLabel, // Use the specific task name as the Title
                    duration: '---',
                    details: {
                        notes: note
                    }
                });
                storageService.markLoggedToday(id);
            }
        }
        
        // Persist UI state (checked/unchecked)
        setCompletedItems(newItems);
        storageService.saveDailyProgress(newItems);
    };

    const handleMorningWorkoutCheck = () => {
        const stats = `Push: ${opsStats.pushups || 0}, Sq: ${opsStats.squats || 0}, Burp: ${opsStats.burpees || 0}, Mtn: ${opsStats.climbers || 0}`;
        toggleItem('morning_workout_check', `Morning Ops (${currentDayName})`, stats);
    };

    const handleWeightLog = () => {
        if (!weight) return;
        
        // Weight is unique, we treat it like a checkbox item for persistence
        if (!completedItems.includes('weight_log')) {
            const newItems = [...completedItems, 'weight_log'];
            setCompletedItems(newItems);
            storageService.saveDailyProgress(newItems);

            // Log if not already logged (prevents duplicate data entry)
            if (!storageService.hasLoggedToday('weight_log')) {
                storageService.addLog({
                    id: new Date().toISOString(),
                    date: new Date().toISOString(),
                    type: "Weight Check-In",
                    duration: '---',
                    details: {
                        weight: weight,
                        unit: 'lbs'
                    }
                });
                storageService.markLoggedToday('weight_log');
            }
        }
    };

    const saveConfig = (newConfig: ProtocolConfig) => {
        setConfig(newConfig);
        storageService.saveProtocolConfig(newConfig);
    };

    return (
        <div className="flex flex-col h-full bg-wolf-bg text-wolf-text overflow-y-auto no-scrollbar relative">
            {/* Header */}
            <div className="p-6 border-b-4 border-black bg-wolf-bg sticky top-0 z-10">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] text-wolf-muted uppercase mb-1">
                            PACK OPS // {weekMode}
                        </div>
                        <h1 className="font-heading text-4xl leading-none uppercase">
                            {currentDayName}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowConfigModal(true)} className="p-2 border border-wolf-border rounded hover:bg-wolf-surface text-wolf-muted">
                            <Settings size={16} />
                        </button>
                        <button onClick={onExit} className="text-xs font-bold uppercase tracking-widest border border-wolf-border px-3 py-1 rounded hover:bg-wolf-surface">
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6 pb-20">
                {/* 1. RISE & PRIME */}
                <Section title={isWeekend ? "RISE & PRIME" : "// RISE & PRIME //"}>
                    <TaskRow 
                        id="wake_water" 
                        label="Wake / 10oz Water" 
                        isDone={completedItems.includes('wake_water')} 
                        onCheck={() => toggleItem('wake_water', 'Wake Up')} 
                    />
                    <TaskRow 
                        id="make_bed" 
                        label="Make Bed" 
                        isDone={completedItems.includes('make_bed')} 
                        onCheck={() => toggleItem('make_bed', 'Make Bed')} 
                    />
                    <TaskRow 
                        id="teeth" 
                        label="Teeth / Bathroom" 
                        isDone={completedItems.includes('teeth')} 
                        onCheck={() => toggleItem('teeth', 'Hygiene')} 
                    />
                </Section>

                {/* 2. MORNING OPS / WORKOUT */}
                <Section title={isWeekend ? "MORNING OPS" : "// WORKOUT //"}>
                    <TaskRow 
                        id="stretch" 
                        label="Wake Up Stretches" 
                        isDone={completedItems.includes('stretch')} 
                        onCheck={() => toggleItem('stretch', 'Stretches')}
                        goAction={() => onStartRoutine(config.wakeUpRoutine)}
                    />
                    
                    <div className="py-2 border-b border-wolf-border border-dashed">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <CheckBox 
                                    checked={completedItems.includes('morning_workout_check')} 
                                    onChange={handleMorningWorkoutCheck}
                                />
                                <span className="font-bold text-sm uppercase">Morning Workout</span>
                            </div>
                            <button 
                                onClick={() => onStartRoutine(config.morningRoutine)}
                                className="bg-wolf-accent text-white text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1 uppercase tracking-wider"
                            >
                                GO <ChevronRight size={10} />
                            </button>
                        </div>
                        
                        {/* Stats Inputs */}
                        <div className="grid grid-cols-4 gap-2 ml-7 mt-2">
                            {['Push', 'Squat', 'Burp', 'Climb'].map((lbl, i) => {
                                const keys = ['pushups', 'squats', 'burpees', 'climbers'];
                                return (
                                    <div key={lbl} className="flex flex-col">
                                        <span className="text-[8px] uppercase text-wolf-muted mb-1">{lbl}</span>
                                        <input 
                                            type="number" 
                                            className="bg-wolf-surface border-b border-wolf-border text-center text-xs p-1 outline-none focus:border-wolf-accent text-white"
                                            value={(opsStats as any)[keys[i]]}
                                            onChange={(e) => setOpsStats(p => ({...p, [keys[i]]: e.target.value}))}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <TaskRow 
                        id="cool" 
                        label="Cooldown Flow" 
                        isDone={completedItems.includes('cool')} 
                        onCheck={() => toggleItem('cool', 'Cooldown')}
                        goAction={() => onStartRoutine(config.cooldownRoutine)}
                    />
                </Section>

                {/* 3. CONTEXTUAL (Weekend vs Weekday) */}
                {day === 6 && (
                     <Section title="HOME OPS" bg="bg-stone-900">
                        <TaskRow id="fam_time" label="Family Time" isDone={completedItems.includes('fam_time')} onCheck={() => toggleItem('fam_time', 'Family Time')} />
                        <TaskRow id="house_proj" label="House Projects" isDone={completedItems.includes('house_proj')} onCheck={() => toggleItem('house_proj', 'Projects')} />
                        <TaskRow id="recov" label="Relax / Recovery" isDone={completedItems.includes('recov')} onCheck={() => toggleItem('recov', 'Recovery')} />
                     </Section>
                )}
                {day === 0 && (
                     <Section title="THE LORD'S DAY" bg="bg-amber-900/20">
                        <TaskRow id="dress" label="Get Dressed" isDone={completedItems.includes('dress')} onCheck={() => toggleItem('dress', 'Dressed')} />
                        <TaskRow id="pack" label="Pack Bags/Bible" isDone={completedItems.includes('pack')} onCheck={() => toggleItem('pack', 'Packed')} />
                        <TaskRow id="service" label="Attend Service" isDone={completedItems.includes('service')} onCheck={() => toggleItem('service', 'Church')} />
                     </Section>
                )}
                {!isWeekend && (
                    <Section title="DEPLOYMENT PREP">
                         <TaskRow id="dress_wk" label="Get Dressed" isDone={completedItems.includes('dress_wk')} onCheck={() => toggleItem('dress_wk', 'Dressed')} />
                         <TaskRow id="hair" label="Do Hair" isDone={completedItems.includes('hair')} onCheck={() => toggleItem('hair', 'Hair')} />
                         <TaskRow id="devo" label="Devotional" isDone={completedItems.includes('devo')} onCheck={() => toggleItem('devo', 'Devotional')} />
                    </Section>
                )}

                {/* 4. MISSION PROTOCOL (Focus Only) */}
                {!isWeekend && weekMode === 'FOCUS' && (
                    <Section title="MISSION // PROTOCOL" bg="bg-stone-900">
                         <div className="py-2 border-b border-wolf-border border-dashed">
                             <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-3">
                                     <CheckBox checked={completedItems.includes('mission_chk')} onChange={() => toggleItem('mission_chk', config.missionLabel)} />
                                     <div>
                                         <span className="font-bold text-sm uppercase block">{config.missionLabel}</span>
                                         <span className="text-[10px] text-wolf-muted uppercase">Linked: {config.missionRoutine}</span>
                                     </div>
                                 </div>
                                 <button onClick={() => onStartRoutine(config.missionRoutine)} className="bg-wolf-accent text-white text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1 uppercase tracking-wider">
                                     GO <ChevronRight size={10} />
                                 </button>
                             </div>
                         </div>
                    </Section>
                )}

                {/* 5. REVEILLE */}
                {isReveilleDay && (
                    <Section title="// REVEILLE //">
                        <div className="flex items-center gap-3 py-2">
                             <CheckBox checked={completedItems.includes('wake_kids')} onChange={() => toggleItem('wake_kids', 'Wake Kids')} />
                             <span className="font-bold text-sm uppercase text-red-500 tracking-wider">WAKE UP KIDS</span>
                        </div>
                    </Section>
                )}

                {/* 6. WEIGHT CHECK (Mon/Fri) */}
                {isMonOrFri && (
                    <Section title="PHYSICAL CHECK">
                        <div className="flex justify-between items-center py-2">
                             <div className="flex items-center gap-2">
                                <Scale size={16} className="text-wolf-muted" />
                                <span className="font-bold text-sm uppercase">Weight</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="000.0"
                                    className="bg-wolf-bg border-b border-wolf-muted w-20 text-center text-white focus:border-wolf-accent outline-none"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                                <button onClick={handleWeightLog} disabled={completedItems.includes('weight_log')} className="text-xs uppercase font-bold text-wolf-accent disabled:opacity-50">
                                    {completedItems.includes('weight_log') ? 'SAVED' : 'LOG'}
                                </button>
                             </div>
                        </div>
                    </Section>
                )}
            </div>

            {/* CONFIG MODAL */}
            {showConfigModal && (
                <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-wolf-surface border border-wolf-border p-6 w-full max-w-sm rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-heading text-2xl text-wolf-text">CONFIGURE</h2>
                            <button onClick={() => setShowConfigModal(false)}><X className="text-wolf-muted" /></button>
                        </div>
                        
                        <div className="space-y-6">
                            
                            {/* Standard Routines */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase text-wolf-muted font-bold mb-1">Wake Up Routine</label>
                                    <select 
                                        value={config.wakeUpRoutine} 
                                        onChange={(e) => saveConfig({...config, wakeUpRoutine: e.target.value})}
                                        className="w-full bg-wolf-bg border border-wolf-border text-white p-2 rounded text-sm outline-none"
                                    >
                                        {availableRoutines.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase text-wolf-muted font-bold mb-1">Morning Workout Routine</label>
                                    <select 
                                        value={config.morningRoutine} 
                                        onChange={(e) => saveConfig({...config, morningRoutine: e.target.value})}
                                        className="w-full bg-wolf-bg border border-wolf-border text-white p-2 rounded text-sm outline-none"
                                    >
                                        {availableRoutines.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase text-wolf-muted font-bold mb-1">Cooldown Routine</label>
                                    <select 
                                        value={config.cooldownRoutine} 
                                        onChange={(e) => saveConfig({...config, cooldownRoutine: e.target.value})}
                                        className="w-full bg-wolf-bg border border-wolf-border text-white p-2 rounded text-sm outline-none"
                                    >
                                        {availableRoutines.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Mission Config */}
                            <div className="border-t border-wolf-border pt-4">
                                <label className="block text-[10px] uppercase text-wolf-accent font-bold mb-2">Mission Protocol (Focus Only)</label>
                                
                                <label className="block text-[10px] uppercase text-wolf-muted font-bold mb-1">Display Label</label>
                                <input 
                                    type="text" 
                                    value={config.missionLabel}
                                    onChange={(e) => saveConfig({...config, missionLabel: e.target.value})}
                                    className="w-full bg-wolf-bg border border-wolf-border text-white p-2 rounded text-sm outline-none mb-3"
                                />

                                <label className="block text-[10px] uppercase text-wolf-muted font-bold mb-1">Linked Routine</label>
                                <select 
                                    value={config.missionRoutine} 
                                    onChange={(e) => saveConfig({...config, missionRoutine: e.target.value})}
                                    className="w-full bg-wolf-bg border border-wolf-border text-white p-2 rounded text-sm outline-none"
                                >
                                    {availableRoutines.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <button onClick={() => setShowConfigModal(false)} className="w-full bg-wolf-accent text-white font-bold uppercase py-3 rounded mt-6">
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components for cleaner code
const Section: React.FC<{title: string, children: React.ReactNode, bg?: string}> = ({title, children, bg}) => (
    <div className={`border border-black flex flex-col ${bg || 'bg-transparent'}`}>
        <div className="bg-stone-200 text-black px-2 py-1 border-b-2 border-black">
            <h3 className="font-heading font-bold text-sm">{title}</h3>
        </div>
        <div className="p-3 bg-white/5">
            {children}
        </div>
    </div>
);

const TaskRow: React.FC<{id: string, label: string, isDone: boolean, onCheck: () => void, goAction?: () => void}> = ({ label, isDone, onCheck, goAction }) => (
    <div className="py-2 border-b border-wolf-border border-dashed flex justify-between items-center">
        <div className="flex items-center gap-3">
            <CheckBox checked={isDone} onChange={onCheck} />
            <span className={`font-bold text-sm uppercase ${isDone ? 'line-through text-wolf-muted' : ''}`}>{label}</span>
        </div>
        {goAction && (
             <button onClick={goAction} className="bg-wolf-accent text-white text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1 uppercase tracking-wider">
                GO <ChevronRight size={10} />
            </button>
        )}
    </div>
);

const CheckBox: React.FC<{checked: boolean, onChange: () => void}> = ({checked, onChange}) => (
    <div 
        onClick={onChange}
        className={`w-4 h-4 border-2 border-wolf-text cursor-pointer flex items-center justify-center bg-white ${checked ? 'bg-wolf-accent border-wolf-accent' : ''}`}
    >
        {checked && <Check size={12} className="text-white" />}
    </div>
);
