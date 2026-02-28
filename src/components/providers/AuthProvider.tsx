'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    // We only enforce this strict redirection and guardrail on the root login page
                    // or global login events to prevent loops.
                    if (session.user.email?.endsWith('@charlotte.edu')) {
                        if (pathname === '/') {
                            router.push('/directory'); // Phase A Selection Hub
                        }
                    } else {
                        await supabase.auth.signOut();
                        setErrorMsg('Access Denied: Only @charlotte.edu emails are allowed.');
                        setTimeout(() => setErrorMsg(''), 5000);
                    }
                }
            }
        );
        return () => subscription.unsubscribe();
    }, [router, pathname]);

    return (
        <>
            {children}

            {/* Global Error Toast for Unauthorized Emails */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-red-500/10 border border-red-500/50 backdrop-blur-md text-red-100 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    >
                        <p className="text-sm font-semibold tracking-wide">{errorMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
