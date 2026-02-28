'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type OfficeHourSlot = {
    id: string;
    ta_id?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    locationOrLink: string;
};

export function useSchedule(taId?: string) {
    const [slots, setSlots] = useState<OfficeHourSlot[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            setIsPending(true);
            try {
                let query = supabase.from('office_hours').select('*');
                if (taId) {
                    query = query.eq('ta_id', taId);
                }
                const { data, error } = await query;
                if (!error && data) {
                    // Map snake_case to camelCase if necessary, assuming table columns match type props exactly
                    setSlots(data);
                }
            } catch (err) {
                console.error('Failed to fetch schedule:', err);
            } finally {
                setIsLoaded(true);
                setIsPending(false);
            }
        };

        fetchSchedule();
    }, [taId]);

    const addSlot = async (slot: Omit<OfficeHourSlot, 'id'>) => {
        setIsPending(true);
        // Default ta_id if not passed
        const payload = { ...slot, ta_id: slot.ta_id || taId || 'ta-123' };
        const { data, error } = await supabase.from('office_hours').insert([payload]).select();
        if (!error && data) {
            setSlots(prev => [...prev, data[0]]);
        }
        setIsPending(false);
        return { error };
    };

    const removeSlot = async (id: string) => {
        setIsPending(true);
        const { error } = await supabase.from('office_hours').delete().eq('id', id);
        if (!error) {
            setSlots(prev => prev.filter(s => s.id !== id));
        }
        setIsPending(false);
        return { error };
    };

    return { slots, addSlot, removeSlot, isLoaded, isPending };
}
