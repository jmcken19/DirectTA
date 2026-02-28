'use client';

import { useState, useEffect } from 'react';

export type OfficeHourSlot = {
    id: string;
    dayOfWeek: string; // 'Monday', 'Tuesday', ...
    startTime: string; // '14:00'
    endTime: string;   // '16:00'
    locationOrLink: string;
};

const DEFAULT_SLOTS: OfficeHourSlot[] = [
    { id: '1', dayOfWeek: 'Monday', startTime: '10:00', endTime: '12:00', locationOrLink: 'zoom.us/j/12345' },
    { id: '2', dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '16:00', locationOrLink: 'Woodward Hall 332' },
    { id: '3', dayOfWeek: 'Thursday', startTime: '13:00', endTime: '15:00', locationOrLink: 'meet.google.com/abc' },
];

export function useSchedule() {
    const [slots, setSlots] = useState<OfficeHourSlot[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('ta_office_hours');
        if (saved && saved !== '[]') {
            try {
                setSlots(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse schedule', e);
                setSlots(DEFAULT_SLOTS);
            }
        } else if (!saved) {
            setSlots(DEFAULT_SLOTS);
            localStorage.setItem('ta_office_hours', JSON.stringify(DEFAULT_SLOTS));
        }
        setIsLoaded(true);
    }, []);

    const addSlot = (slot: Omit<OfficeHourSlot, 'id'>) => {
        const newSlot = { ...slot, id: crypto.randomUUID() };
        const updated = [...slots, newSlot];
        setSlots(updated);
        localStorage.setItem('ta_office_hours', JSON.stringify(updated));
    };

    const removeSlot = (id: string) => {
        const updated = slots.filter(s => s.id !== id);
        setSlots(updated);
        localStorage.setItem('ta_office_hours', JSON.stringify(updated));
    };

    return { slots, addSlot, removeSlot, isLoaded };
}
