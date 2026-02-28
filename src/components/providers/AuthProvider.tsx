'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [errorMsg, setErrorMsg] = useState('');

    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Wait for the initial session check before redirecting
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                if (!session.user.email?.endsWith('@charlotte.edu')) {
                    await supabase.auth.signOut();
                    document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                            .replace(/^ +/, "")
                            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    setErrorMsg('Access Denied: Only @charlotte.edu emails are allowed.');
                    setTimeout(() => setErrorMsg(''), 5000);
                    router.push('/');
                } else if (pathname === '/') {
                    router.push('/directory'); // Phase A Selection Hub
                }
            }

            if (mounted) setIsChecking(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    if (!session.user.email?.endsWith('@charlotte.edu')) {
                        await supabase.auth.signOut();
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        setErrorMsg('Access Denied: Only @charlotte.edu emails are allowed.');
                        setTimeout(() => setErrorMsg(''), 5000);
                        router.push('/');
                    } else if (pathname === '/') {
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
