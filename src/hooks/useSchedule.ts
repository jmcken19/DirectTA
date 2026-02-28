'use client';

import { useState, useEffect } from 'react';

export type OfficeHourSlot = {
    id: string;
    dayOfWeek: string; // 'Monday', 'Tuesday', ...
    startTime: string; // '14:00'
    endTime: string;   // '16:00'
    locationOrLink: string;
};

export function useSchedule() {
    const [slots, setSlots] = useState<OfficeHourSlot[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('ta_office_hours');
        if (saved) {
            try {
                setSlots(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse schedule', e);
            }
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
