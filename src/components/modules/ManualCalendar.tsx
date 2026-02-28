'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchedule, OfficeHourSlot } from '@/hooks/useSchedule';
import { useTheme } from '@/hooks/useTheme';
import { MapPin, Link as LinkIcon, X } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function ManualCalendar() {
    const { slots, isLoaded } = useSchedule();
    const { themeColor } = useTheme();
    const [selectedSlot, setSelectedSlot] = useState<OfficeHourSlot | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute for the "Live" aura effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (!isLoaded) return <div className="h-64 w-full animate-pulse rounded-xl border border-white/10 bg-white/5"></div>;

    const isLive = (slot: OfficeHourSlot) => {
        const todayIndex = currentTime.getDay(); // 0 is Sunday
        const currentDayStr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todayIndex];
        if (slot.dayOfWeek !== currentDayStr) return false;

        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);

        const nowH = currentTime.getHours();
        const nowM = currentTime.getMinutes();

        const currentMins = nowH * 60 + nowM;
        const startMins = startH * 60 + startM;
        const endMins = endH * 60 + endM;

        return currentMins >= startMins && currentMins <= endMins;
    };

    const formatTime = (time: string) => {
        const [h, m] = time.split(':');
        const hours = parseInt(h, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    };

    const isUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-5 gap-2 md:gap-4">
                {DAYS.map(day => (
                    <div key={day} className="flex flex-col gap-3">
                        <h4 className="border-b border-white/10 pb-2 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                            {day.slice(0, 3)}
                        </h4>
                        <div className="flex min-h-[100px] flex-col gap-2">
                            {slots
                                .filter(s => s.dayOfWeek === day)
                                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                .map(slot => {
                                    const live = isLive(slot);
                                    return (
                                        <motion.button
                                            key={slot.id}
                                            onClick={() => setSelectedSlot(slot)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative w-full overflow-hidden rounded-lg border p-2 text-left backdrop-blur-md transition-colors ${live
                                                    ? 'border-transparent bg-white/10 text-white shadow-lg'
                                                    : 'border-white/10 bg-black/40 text-gray-300 hover:bg-white/5'
                                                }`}
                                        >
                                            {/* Aura effect matches the custom TA theme color */}
                                            {live && (
                                                <motion.div
                                                    className="absolute inset-0 -z-10 opacity-50 blur-xl"
                                                    style={{ backgroundColor: themeColor }}
                                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                                />
                                            )}
                                            <div className="text-xs font-semibold">{formatTime(slot.startTime)}</div>
                                            <div className="text-[10px] text-gray-400">{formatTime(slot.endTime)}</div>
                                        </motion.button>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Spring Modal for Selection */}
            <AnimatePresence>
                {selectedSlot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                        onClick={() => setSelectedSlot(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="mb-2 text-xl font-bold text-white">Office Hours</h3>
                            <p className="mb-6 text-gray-400">
                                {selectedSlot.dayOfWeek}, {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                            </p>

                            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                {isUrl(selectedSlot.locationOrLink) ? (
                                    <>
                                        <div className="rounded-full bg-white/10 p-2">
                                            <LinkIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {selectedSlot.locationOrLink}
                                            </p>
                                            <a
                                                href={selectedSlot.locationOrLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-[#8A2BE2] hover:underline"
                                                style={{ color: themeColor }}
                                            >
                                                Join Virtual Meeting
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="rounded-full bg-white/10 p-2">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                                                Location
                                            </p>
                                            <p className="text-sm font-semibold text-white">
                                                {selectedSlot.locationOrLink}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
