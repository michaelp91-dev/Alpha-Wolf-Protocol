
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { ActivityLog } from '../types';
import { Calendar, Clock, BarChart2 } from 'lucide-react';

interface Props {
    onBack: () => void;
}

export const HistoryList: React.FC<Props> = ({ onBack }) => {
    const [history, setHistory] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load local immediately
        const localData = storageService.getHistory();
        setHistory(localData);
        setLoading(false);
        
        // Try to fetch fresh from cloud
        storageService.syncHistory().then(() => {
            const freshData = storageService.getHistory();
            setHistory(freshData);
        });
    }, []);

    const formatDate = (isoStr: string) => {
        try {
            const d = new Date(isoStr);
            return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch { return isoStr; }
    };

    return (
        <div className="flex flex-col h-full bg-wolf-bg text-wolf-text">
            <div className="p-6 border-b border-wolf-border flex justify-between items-center bg-wolf-bg sticky top-0 z-10">
                <h2 className="font-heading text-2xl uppercase">History</h2>
                <button onClick={onBack} className="text-xs font-bold uppercase text-wolf-muted px-3 py-1 border border-wolf-border rounded">
                    Back
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-3 pb-20">
                {history.map((log, idx) => (
                    <div key={idx} className="bg-wolf-surface border-l-4 border-wolf-accent p-4 rounded-r shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-white uppercase text-sm tracking-wide">{log.type}</h3>
                                <div className="flex items-center gap-1 text-wolf-muted text-[10px] uppercase mt-1">
                                    <Calendar size={10} />
                                    <span>{formatDate(log.date)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-heading text-xl text-wolf-text">{log.duration}</div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        {(log.details?.notes || log.details?.weight) && (
                            <div className="mt-2 pt-2 border-t border-wolf-border/50 text-xs text-wolf-muted grid grid-cols-2 gap-2">
                                {log.details.weight && (
                                    <div className="col-span-2 text-white font-bold flex items-center gap-1">
                                        <BarChart2 size={12} /> Weight: {log.details.weight} {log.details.unit}
                                    </div>
                                )}
                                {log.details.notes && (
                                    <div className="col-span-2 italic text-gray-400">
                                        "{log.details.notes}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {!loading && history.length === 0 && (
                    <div className="text-center text-wolf-muted mt-10 text-sm uppercase tracking-widest">
                        No logs found.
                    </div>
                )}
            </div>
        </div>
    );
};
