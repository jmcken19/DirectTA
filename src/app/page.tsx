'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { supabase } from '@/lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyUser = async (user: any) => {
      if (user?.email && user.email.endsWith('@charlotte.edu')) {
        router.push('/directory');
      } else {
        await supabase.auth.signOut();
        setErrorMsg('Access Denied: Only @charlotte.edu emails are allowed.');
        // Auto-dismiss toast after 5 seconds
        setTimeout(() => setErrorMsg(''), 5000);
      }
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        verifyUser(session.user);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          verifyUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setErrorMsg('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center pt-10 relative">

      <BaseGlassCard delay={0.2} className="flex w-full max-w-md flex-col items-center gap-8 p-10 text-center">
        {/* Welcome */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome to TA Direct</h2>
          <p className="text-sm text-gray-400">Secure communication portal</p>
        </div>

        {/* Login Action */}
        <button
          onClick={handleLogin}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/5 px-6 py-4 transition-all duration-300 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <span className="font-semibold tracking-wide">Login with your school account</span>
        </button>
      </BaseGlassCard>

      {/* Footer */}
      <footer className="absolute bottom-8 flex w-full justify-center gap-8 text-sm text-gray-500">
        <button className="hover:text-white transition-colors duration-200">Need help logging in?</button>
        <button className="hover:text-white transition-colors duration-200">Student Quick Links</button>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-24 bg-red-500/10 border border-red-500/50 backdrop-blur-md text-red-100 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <p className="text-sm font-semibold tracking-wide">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
