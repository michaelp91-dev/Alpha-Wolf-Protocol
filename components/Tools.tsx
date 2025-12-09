
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Plus } from 'lucide-react';
import { playBeep } from '../utils/audio';

type ToolType = 'STOPWATCH' | 'TIMER' | 'TABATA';

export const Tools: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ToolType>('STOPWATCH');
    const [isRunning, setIsRunning] = useState(false);
    const [isPrep, setIsPrep] = useState(false); // For 10s countdown
    const [prepTime, setPrepTime] = useState(10);
    
    // Global Display Time
    const [displayTime, setDisplayTime] = useState(0); 
    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    // --- STOPWATCH STATE ---
    const [swElapsed, setSwElapsed] = useState(0);
    const [swLastLapTime, setSwLastLapTime] = useState(0);
    const [laps, setLaps] = useState<{split: number, total: number}[]>([]);
    const [swCountdown, setSwCountdown] = useState(false);

    // --- TIMER STATE ---
    const [tmInput, setTmInput] = useState({ h: 0, m: 0, s: 0 });
    const [tmTotalTime, setTmTotalTime] = useState(0); // The target duration
    const [tmCurrent, setTmCurrent] = useState(0); // Current counting down
    const [tmRoundsCheck, setTmRoundsCheck] = useState(false);
    const [tmRoundCount, setTmRoundCount] = useState(0);
    const [tmCountdown, setTmCountdown] = useState(false);

    // --- TABATA STATE ---
    const [tbConfig, setTbConfig] = useState({ work: 20, rest: 10, rounds: 8 });
    const [tbState, setTbState] = useState({ round: 1, isWork: false, timeLeft: 0 }); // isWork initially false for setup logic
    const [tbCountdown, setTbCountdown] = useState(true);

    // Cleanup on unmount
    useEffect(() => { return () => stopInterval(); }, []);

    const stopInterval = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // --- ACTIONS ---

    const handleStartStop = () => {
        if (isRunning || isPrep) {
            // STOP
            stopInterval();
            setIsRunning(false);
            setIsPrep(false);
        } else {
            // START
            if (activeTool === 'STOPWATCH') {
                if (swCountdown && swElapsed === 0) startPrep(() => startStopwatch());
                else startStopwatch();
            } else if (activeTool === 'TIMER') {
                // If timer finished or new, init
                let startVal = tmCurrent;
                if (startVal <= 0) {
                     startVal = (tmInput.h * 3600) + (tmInput.m * 60) + tmInput.s;
                     if (startVal <= 0) return;
                     setTmTotalTime(startVal);
                     setTmCurrent(startVal);
                     setDisplayTime(startVal);
                }
                
                if (tmCountdown && tmCurrent <= 0) startPrep(() => startTimer(startVal));
                else startTimer(startVal);

            } else if (activeTool === 'TABATA') {
                if (tbCountdown) {
                    startPrep(() => {
                        setTbState({ round: 1, isWork: true, timeLeft: tbConfig.work });
                        startTabata(tbConfig.work, true);
                    });
                } else {
                    setTbState({ round: 1, isWork: true, timeLeft: tbConfig.work });
                    startTabata(tbConfig.work, true);
                }
            }
        }
    };

    const startPrep = (onComplete: () => void) => {
        setIsPrep(true);
        setPrepTime(10);
        
        intervalRef.current = window.setInterval(() => {
            setPrepTime(prev => {
                const next = prev - 1;
                if (next <= 3 && next > 0) playBeep('Low');
                if (next < 0) {
                    stopInterval();
                    playBeep('High');
                    setIsPrep(false);
                    setIsRunning(true);
                    onComplete();
                    return 0;
                }
                return next;
            });
        }, 1000);
    };

    const startStopwatch = () => {
        setIsRunning(true);
        const start = Date.now() - swElapsed;
        intervalRef.current = window.setInterval(() => {
            const now = Date.now();
            const elapsed = now - start;
            setSwElapsed(elapsed);
            setDisplayTime(elapsed);
        }, 30);
    };

    const startTimer = (duration: number) => {
        setIsRunning(true);
        let current = duration;
        intervalRef.current = window.setInterval(() => {
            current--;
            setTmCurrent(current);
            setDisplayTime(current);
            if (current <= 3 && current > 0) playBeep('Low');
            if (current <= 0) {
                stopInterval();
                playBeep('High');
                setIsRunning(false);
                setTmCurrent(0);
                // Log logic could go here if needed
            }
        }, 1000);
    };

    const startTabata = (initialTime: number, isWork: boolean) => {
        setIsRunning(true);
        let time = initialTime;
        // Need to capture state in closure or refs for intervals, using simple recursion here roughly
        // Better to use a unified ticker for React
        
        // Re-implementing specific Tabata ticker to avoid closure staleness
        // using refs for state tracking inside interval
        const stateRef = { time: initialTime, isWork: isWork, round: 1 };
        // Sync ref with current state if we are resuming? 
        // For simplicity, Tabata resets on stop in this version or fully restarts logic
        
        // Let's rely on functional updates strictly
        intervalRef.current = window.setInterval(() => {
            setTbState(prev => {
                let nextTime = prev.timeLeft - 1;
                
                if (nextTime < 0) {
                    // Transition
                    if (prev.isWork) {
                        playBeep('Mid');
                        if (prev.round >= tbConfig.rounds) {
                            stopInterval();
                            setIsRunning(false);
                            alert("TABATA COMPLETE");
                            return prev; // End
                        }
                        return { ...prev, isWork: false, timeLeft: tbConfig.rest };
                    } else {
                        playBeep('High');
                        return { round: prev.round + 1, isWork: true, timeLeft: tbConfig.work };
                    }
                }

                if (nextTime <= 3) playBeep('Low');
                return { ...prev, timeLeft: nextTime };
            });
        }, 1000);
    };

    const handleReset = () => {
        stopInterval();
        setIsRunning(false);
        setIsPrep(false);
        setDisplayTime(0);
        
        if (activeTool === 'STOPWATCH') {
            setSwElapsed(0);
            setSwLastLapTime(0);
            setLaps([]);
        } else if (activeTool === 'TIMER') {
            setTmCurrent(0);
            setTmRoundCount(0);
        } else if (activeTool === 'TABATA') {
            setTbState({ round: 1, isWork: false, timeLeft: 0 });
        }
    };

    const handleLap = () => {
        if (activeTool === 'STOPWATCH' && isRunning) {
            const split = swElapsed - swLastLapTime;
            setLaps(prev => [{split, total: swElapsed}, ...prev]);
            setSwLastLapTime(swElapsed);
        }
    };

    const formatMs = (ms: number) => {
        const m = Math.floor(ms / 60000).toString().padStart(2, '0');
        const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
        const ds = Math.floor((ms % 1000) / 100);
        return `${m}:${s}.${ds}`;
    };

    const formatSec = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
    };

    // Derived Display Logic
    let mainDisplay = "";
    if (isPrep) mainDisplay = formatSec(prepTime);
    else if (activeTool === 'STOPWATCH') mainDisplay = formatMs(swElapsed);
    else if (activeTool === 'TIMER') mainDisplay = formatSec(tmCurrent > 0 ? tmCurrent : (tmInput.h * 3600 + tmInput.m * 60 + tmInput.s));
    else if (activeTool === 'TABATA') mainDisplay = isRunning ? formatSec(tbState.timeLeft) : formatSec(tbConfig.work);

    return (
        <div className="flex flex-col h-full bg-wolf-bg p-4 overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 shrink-0">
                {(['STOPWATCH', 'TIMER', 'TABATA'] as ToolType[]).map(t => (
                    <button
                        key={t}
                        onClick={() => { setActiveTool(t); handleReset(); }}
                        className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase rounded transition-colors ${activeTool === t ? 'bg-wolf-accent text-white' : 'bg-wolf-surface text-wolf-muted'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center pt-4">
                
                {/* Status Message */}
                <div className={`font-heading text-2xl uppercase tracking-widest mb-2 animate-pulse ${isPrep ? 'text-wolf-accent' : 'hidden'}`}>
                    GET READY
                </div>
                {activeTool === 'TABATA' && isRunning && !isPrep && (
                    <div className={`font-heading text-3xl uppercase tracking-widest mb-2 ${tbState.isWork ? 'text-wolf-accent' : 'text-green-500'}`}>
                        {tbState.isWork ? 'WORK' : 'REST'}
                    </div>
                )}

                {/* Main Display */}
                <div className={`font-heading text-white mb-6 tabular-nums leading-none ${activeTool === 'STOPWATCH' ? 'text-6xl md:text-8xl' : 'text-8xl md:text-9xl'}`}>
                    {mainDisplay}
                </div>

                {/* --- TIMER CONFIG --- */}
                {activeTool === 'TIMER' && !isRunning && !isPrep && tmCurrent === 0 && (
                    <div className="flex flex-col items-center animate-in fade-in">
                        <div className="flex gap-4 items-center mb-8">
                            <div className="flex flex-col items-center">
                                <label className="text-[10px] uppercase text-wolf-muted font-bold tracking-widest">Hours</label>
                                <input type="number" value={tmInput.h} onChange={e => setTmInput(p=>({...p, h: parseInt(e.target.value)||0}))} className="w-20 bg-transparent border-2 border-wolf-border rounded text-center text-4xl text-white p-2 focus:border-wolf-accent outline-none font-heading"/>
                            </div>
                            <span className="text-2xl text-wolf-muted mt-4">:</span>
                            <div className="flex flex-col items-center">
                                <label className="text-[10px] uppercase text-wolf-muted font-bold tracking-widest">Mins</label>
                                <input type="number" value={tmInput.m} onChange={e => setTmInput(p=>({...p, m: parseInt(e.target.value)||0}))} className="w-20 bg-transparent border-2 border-wolf-border rounded text-center text-4xl text-white p-2 focus:border-wolf-accent outline-none font-heading"/>
                            </div>
                            <span className="text-2xl text-wolf-muted mt-4">:</span>
                            <div className="flex flex-col items-center">
                                <label className="text-[10px] uppercase text-wolf-muted font-bold tracking-widest">Secs</label>
                                <input type="number" value={tmInput.s} onChange={e => setTmInput(p=>({...p, s: parseInt(e.target.value)||0}))} className="w-20 bg-transparent border-2 border-wolf-border rounded text-center text-4xl text-white p-2 focus:border-wolf-accent outline-none font-heading"/>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-6 bg-wolf-surface px-4 py-2 rounded-lg border border-wolf-border">
                             <input type="checkbox" checked={tmRoundsCheck} onChange={e => setTmRoundsCheck(e.target.checked)} className="w-5 h-5 accent-wolf-accent cursor-pointer" />
                             <label className="text-sm uppercase font-bold text-wolf-muted">Track Rounds</label>
                        </div>
                    </div>
                )}

                {/* --- TIMER ROUNDS UI --- */}
                {activeTool === 'TIMER' && tmRoundsCheck && (
                    <div className="mb-6 flex flex-col items-center">
                        <p className="text-wolf-muted uppercase text-[10px] tracking-widest mb-2">Round Counter</p>
                        <div className="flex items-center gap-6">
                            <span className="font-heading text-5xl text-white">{tmRoundCount}</span>
                            <button onClick={() => setTmRoundCount(p => p + 1)} className="border border-wolf-accent text-wolf-accent hover:bg-wolf-accent hover:text-white px-4 py-2 rounded text-sm font-bold uppercase transition">
                                + Round
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TABATA CONFIG --- */}
                {activeTool === 'TABATA' && !isRunning && !isPrep && (
                    <div className="w-full max-w-xs space-y-4 mb-8">
                        {['work', 'rest', 'rounds'].map(field => (
                            <div key={field} className="flex justify-between items-center">
                                <label className="text-wolf-muted uppercase text-sm font-bold">{field} {field !== 'rounds' ? '(Sec)' : ''}</label>
                                <input 
                                    type="number" 
                                    value={tbConfig[field as keyof typeof tbConfig]} 
                                    onChange={e => setTbConfig(p => ({...p, [field]: parseInt(e.target.value)||0}))}
                                    className="bg-transparent border-2 border-wolf-border rounded text-center text-2xl text-white w-24 p-1 focus:border-wolf-accent outline-none font-heading"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* --- TABATA STATUS --- */}
                {activeTool === 'TABATA' && (isRunning || isPrep) && (
                     <p className="text-wolf-muted uppercase tracking-widest text-xl font-bold mb-8">
                         Round {tbState.round} / {tbConfig.rounds}
                     </p>
                )}

                {/* CONTROLS */}
                <div className="flex gap-4 w-full max-w-md mb-6">
                    <button 
                        onClick={handleStartStop} 
                        className={`flex-1 py-4 rounded-lg flex items-center justify-center gap-2 font-heading text-xl uppercase tracking-wider shadow-lg ${isRunning || isPrep ? 'bg-red-900 text-white' : 'bg-wolf-accent text-white'}`}
                    >
                        {isRunning || isPrep ? (isPrep ? 'WAIT...' : 'STOP') : 'START'}
                    </button>
                    
                    {activeTool === 'STOPWATCH' ? (
                        <button onClick={handleLap} disabled={!isRunning || isPrep} className="flex-1 bg-wolf-surface border border-wolf-border text-wolf-muted hover:text-white rounded-lg flex items-center justify-center gap-2 font-heading text-xl uppercase tracking-wider disabled:opacity-50">
                            LAP
                        </button>
                    ) : (
                        <button onClick={handleReset} className="flex-1 bg-wolf-surface border border-wolf-border text-wolf-muted hover:text-white rounded-lg flex items-center justify-center gap-2 font-heading text-xl uppercase tracking-wider">
                            RESET
                        </button>
                    )}
                </div>

                {activeTool === 'STOPWATCH' && (
                     <button onClick={handleReset} className="text-wolf-muted text-xs uppercase tracking-widest hover:text-white mb-6">Reset All</button>
                )}

                {/* COUNTDOWN TOGGLES */}
                <div className="flex items-center gap-2 mb-8">
                    <input 
                        type="checkbox" 
                        id="cd-check"
                        className="w-5 h-5 accent-wolf-accent cursor-pointer"
                        checked={activeTool === 'STOPWATCH' ? swCountdown : (activeTool === 'TIMER' ? tmCountdown : tbCountdown)}
                        onChange={(e) => {
                            if(activeTool === 'STOPWATCH') setSwCountdown(e.target.checked);
                            else if(activeTool === 'TIMER') setTmCountdown(e.target.checked);
                            else setTbCountdown(e.target.checked);
                        }}
                    />
                    <label htmlFor="cd-check" className="text-xs uppercase text-wolf-muted font-bold cursor-pointer">10 Sec Countdown</label>
                </div>

                {/* STOPWATCH LAPS LIST */}
                {activeTool === 'STOPWATCH' && laps.length > 0 && (
                    <div className="w-full max-w-md h-40 overflow-y-auto bg-wolf-surface border border-wolf-border rounded-lg p-2 text-sm space-y-1">
                        {laps.map((l, i) => (
                            <div key={i} className="flex justify-between border-b border-wolf-border/50 py-2 px-2">
                                <span className="text-wolf-muted font-bold">Lap {laps.length - i}</span>
                                <span className="text-white font-mono">{formatMs(l.split)} / {formatMs(l.total)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
