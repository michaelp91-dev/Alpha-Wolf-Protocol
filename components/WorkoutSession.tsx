import React, { useState, useEffect, useRef } from 'react';
import { Routine, RoutineStep } from '../types';
import { playBeep, initAudio } from '../utils/audio';
import { storageService } from '../services/storageService';

interface Props {
    routineName: string;
    routine: Routine;
    onExit: () => void;
}

export const WorkoutSession: React.FC<Props> = ({ routineName, routine, onExit }) => {
    const [stepIndex, setStepIndex] = useState(-1); // -1 = Prep/Countdown
    const [timeLeft, setTimeLeft] = useState(10);
    const [isPaused, setIsPaused] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    
    // AMRAP / Rep tracking
    const [manualRounds, setManualRounds] = useState(0);

    const intervalRef = useRef<number | null>(null);
    const totalTimeRef = useRef<number | null>(null);

    // Initial Start
    useEffect(() => {
        initAudio();
        startTimer();
        totalTimeRef.current = window.setInterval(() => {
            if (!isPaused && !isComplete) setTotalTime(t => t + 1);
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (totalTimeRef.current) clearInterval(totalTimeRef.current);
        };
    }, [isComplete, isPaused]);

    const activeStep: RoutineStep | null = stepIndex >= 0 ? routine.steps[stepIndex] : null;
    const nextStep: RoutineStep | null = stepIndex + 1 < routine.steps.length ? routine.steps[stepIndex + 1] : null;

    const startTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            if (isPaused) return;

            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleStepComplete();
                    return 0;
                }
                if (prev <= 4) playBeep('Low');
                return prev - 1;
            });
        }, 1000);
    };

    const handleStepComplete = () => {
        playBeep('High');
        if (stepIndex + 1 >= routine.steps.length) {
            finishWorkout();
        } else {
            const nextIdx = stepIndex + 1;
            setStepIndex(nextIdx);
            const nextStepData = routine.steps[nextIdx];
            // If it's rep work or amrap without fixed duration, stop timer, wait for manual
            if (nextStepData.type === 'rep_work' || (nextStepData.type === 'amrap' && !nextStepData.duration)) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setTimeLeft(0);
            } else {
                setTimeLeft(nextStepData.duration || 30);
                startTimer(); // Restart timer interval
            }
        }
    };

    const manualNext = () => {
        handleStepComplete();
    };

    const finishWorkout = () => {
        setIsComplete(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (totalTimeRef.current) clearInterval(totalTimeRef.current);
        
        // Log it
        const log = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
            type: routineName,
            duration: formatTime(totalTime),
            details: {
                notes: manualRounds > 0 ? `${manualRounds} Rounds` : undefined,
                amount: manualRounds > 0 ? manualRounds.toString() : formatTime(totalTime),
                unit: manualRounds > 0 ? 'Rounds' : 'Time'
            }
        };
        storageService.addLog(log);
    };

    const formatTime = (s: number) => {
        const min = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    if (isComplete) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-wolf-bg p-6 text-center">
                <h1 className="font-heading text-6xl text-wolf-accent mb-2">COMPLETE</h1>
                <p className="text-wolf-muted uppercase tracking-widest mb-12">Well Done</p>
                <div className="bg-wolf-surface border border-wolf-border p-8 w-full max-w-sm mb-10 rounded-xl">
                    <p className="text-wolf-muted text-[10px] uppercase tracking-widest mb-1">Total Time</p>
                    <p className="text-6xl text-white font-heading">{formatTime(totalTime)}</p>
                </div>
                <button onClick={onExit} className="w-full max-w-sm bg-wolf-accent text-white font-heading uppercase py-4 rounded-lg tracking-widest">
                    Return to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-wolf-bg relative">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
                <div>
                    <span className="text-wolf-muted text-[10px] uppercase tracking-widest block">Elapsed</span>
                    <span className="font-heading text-2xl text-wolf-text">{formatTime(totalTime)}</span>
                </div>
                <button onClick={onExit} className="text-wolf-muted hover:text-white text-xs font-bold uppercase tracking-widest border border-transparent hover:border-wolf-muted px-2 py-1 rounded">
                    Exit
                </button>
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-4 z-10 w-full max-w-4xl mx-auto mt-10 text-center">
                {/* Progress Bar */}
                <div className="w-full max-w-md bg-wolf-surface h-1.5 mb-12 rounded-full overflow-hidden">
                    <div 
                        className="bg-wolf-accent h-full transition-all duration-300 rounded-full" 
                        style={{ width: `${((stepIndex + 1) / routine.steps.length) * 100}%` }}
                    ></div>
                </div>

                <p className="font-heading text-3xl text-wolf-accent uppercase tracking-widest mb-2 animate-pulse">
                    {stepIndex === -1 ? 'GET READY' : activeStep?.type}
                </p>
                
                <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-none tracking-tight">
                    {stepIndex === -1 ? 'PREPARE' : activeStep?.name}
                    {activeStep?.round && <span className="block text-2xl text-wolf-muted mt-2">{activeStep.round}</span>}
                </h2>

                {/* Exercises List (if rep work) */}
                {activeStep?.exercises && (
                    <div className="text-left text-lg font-medium mb-10 space-y-3 bg-wolf-surface p-6 rounded-xl border border-wolf-border w-full max-w-md">
                        {activeStep.exercises.map((ex, i) => (
                            <div key={i} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-wolf-accent mr-3 rounded-full"></span>
                                <span className="text-white">{ex}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Timer Display */}
                {(stepIndex === -1 || (activeStep?.type !== 'rep_work' && activeStep?.type !== 'amrap') || (activeStep?.duration)) && (
                    <div className="font-heading text-[8rem] md:text-[12rem] text-white leading-none tabular-nums select-none">
                        {timeLeft > 59 ? formatTime(timeLeft) : timeLeft}
                    </div>
                )}

                {/* AMRAP Round Counter */}
                {(activeStep?.type === 'amrap') && (
                    <div className="flex flex-col items-center mb-8">
                        <div className="text-wolf-muted text-xs uppercase tracking-widest mb-2">Rounds Completed</div>
                        <div className="flex items-center gap-6">
                            <button onClick={() => setManualRounds(r => Math.max(0, r-1))} className="text-wolf-muted text-4xl">-</button>
                            <span className="font-heading text-6xl text-white">{manualRounds}</span>
                            <button onClick={() => setManualRounds(r => r+1)} className="text-wolf-accent text-4xl">+</button>
                        </div>
                    </div>
                )}

                {/* Manual Complete Button */}
                {(stepIndex === -1 || activeStep?.type === 'rep_work' || !activeStep?.duration) && (
                    <button onClick={manualNext} className="bg-wolf-accent text-white font-heading uppercase text-xl px-12 py-4 rounded shadow-lg shadow-orange-900/20 mt-8">
                        {stepIndex === -1 ? 'SKIP PREP' : 'COMPLETE'}
                    </button>
                )}

            </div>

            {/* Footer */}
            <div className="p-6 pb-10 text-center z-20">
                <span className="text-wolf-muted text-[10px] uppercase tracking-widest block mb-1">Up Next</span>
                <span className="text-wolf-text text-xl font-heading uppercase">
                    {nextStep ? nextStep.name : 'FINISH'}
                </span>
            </div>
        </div>
    );
};