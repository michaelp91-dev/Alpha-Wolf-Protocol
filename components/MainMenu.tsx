
import React from 'react';
import { WeekMode, ScreenName } from '../types';
import { BarChart2, List, Clock, CheckSquare } from 'lucide-react';

interface Props {
    weekMode: WeekMode;
    toggleWeekMode: () => void;
    navigate: (screen: ScreenName) => void;
}

export const MainMenu: React.FC<Props> = ({ weekMode, toggleWeekMode, navigate }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 relative bg-wolf-bg">
            
            {/* Logo */}
            <div className="z-10 text-center w-full max-w-sm flex flex-col items-center mb-10">
                <h1 className="font-heading text-6xl text-wolf-text tracking-tight mb-2">
                    WOLF<span className="text-wolf-accent">ALPHA</span>
                </h1>
                <p className="text-wolf-muted text-sm uppercase tracking-[0.3em]">
                    Conquer Your Day
                </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-4 mb-8 bg-wolf-surface p-2 rounded-full border border-wolf-border cursor-pointer" onClick={toggleWeekMode}>
                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${weekMode === 'FAMILY' ? 'text-white' : 'text-wolf-muted'}`}>Family</span>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${weekMode === 'FOCUS' ? 'bg-wolf-accent' : 'bg-stone-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 absolute top-1 ${weekMode === 'FOCUS' ? 'left-7' : 'left-1'}`}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${weekMode === 'FOCUS' ? 'text-white' : 'text-wolf-muted'}`}>Focus</span>
            </div>

            {/* Primary Action */}
            <button 
                onClick={() => navigate('DAILY')}
                className="w-full max-w-sm bg-wolf-accent text-white font-heading uppercase text-2xl py-6 rounded-lg shadow-lg shadow-orange-900/20 mb-6 flex items-center justify-center gap-3 transform active:scale-95 transition-all"
            >
                <CheckSquare size={28} />
                Daily Protocol
            </button>

            {/* Secondary Actions */}
            <div className="w-full max-w-sm space-y-3">
                <button 
                    onClick={() => navigate('LIST')}
                    className="w-full bg-wolf-surface text-wolf-text border border-wolf-border font-heading uppercase text-lg py-4 rounded-lg hover:border-wolf-accent transition-colors flex items-center justify-center gap-2"
                >
                    <List size={20} /> Workouts
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate('TOOLS')} className="bg-wolf-surface text-wolf-muted hover:text-white border border-wolf-border py-4 rounded-lg flex flex-col items-center gap-1 uppercase text-xs font-bold tracking-widest">
                        <Clock size={20} /> Tools
                    </button>
                    <button onClick={() => navigate('HISTORY')} className="bg-wolf-surface text-wolf-muted hover:text-white border border-wolf-border py-4 rounded-lg flex flex-col items-center gap-1 uppercase text-xs font-bold tracking-widest">
                        <BarChart2 size={20} /> History
                    </button>
                </div>
            </div>

            <div className="mt-8 text-[10px] text-wolf-muted uppercase tracking-widest opacity-50">
                System Active // v2.1
            </div>
        </div>
    );
};
