'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Wait for the initial session check before redirecting
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                if (pathname === '/') {
                    router.push('/directory'); // Phase A Selection Hub
                }
            }

            if (mounted) setIsChecking(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    if (pathname === '/') {
                        router.push('/directory');
                    }
                } else if (event === 'SIGNED_OUT') {
                    if (pathname !== '/') router.push('/');
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [router, pathname]);

    if (isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black mesh-bg text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                    className="text-2xl font-black tracking-widest text-white/50 border border-white/10 px-8 py-4 rounded-2xl glass-card backdrop-blur-md"
                >
                    C CHARLOTTE
                </motion.div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}
