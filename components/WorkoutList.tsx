
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { ChevronRight } from 'lucide-react';

interface Props {
    onStart: (name: string) => void;
    onBack: () => void;
}

export const WorkoutList: React.FC<Props> = ({ onStart, onBack }) => {
    const [routines, setRoutines] = useState<string[]>([]);

    useEffect(() => {
        const data = storageService.getRoutines();
        // Filter out configuration keys or internal mappings if needed
        const keys = Object.keys(data).filter(k => 
            k !== 'apex_config' && 
            !k.includes('Protocol') // Optionally hide the mapped day names to keep list clean
        );
        setRoutines(keys);
    }, []);

    return (
        <div className="flex flex-col h-full bg-wolf-bg text-wolf-text">
            <div className="p-6 border-b border-wolf-border flex justify-between items-center bg-wolf-bg sticky top-0 z-10">
                <h2 className="font-heading text-2xl uppercase">Workouts</h2>
                <button onClick={onBack} className="text-xs font-bold uppercase text-wolf-muted px-3 py-1 border border-wolf-border rounded">
                    Back
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-3 pb-20">
                {routines.map(name => (
                    <button 
                        key={name}
                        onClick={() => onStart(name)}
                        className="w-full bg-wolf-surface border border-wolf-border p-4 rounded-lg flex justify-between items-center group active:scale-[0.98] transition-all"
                    >
                        <span className="font-bold text-lg uppercase group-hover:text-wolf-accent transition-colors text-left">{name}</span>
                        <ChevronRight className="text-wolf-muted group-hover:text-white" size={20} />
                    </button>
                ))}

                {routines.length === 0 && (
                    <div className="text-center text-wolf-muted mt-10">
                        Loading protocols...
                    </div>
                )}
            </div>
        </div>
    );
};
