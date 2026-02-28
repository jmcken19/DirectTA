'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { supabase } from '@/lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email?.endsWith('@charlotte.edu')) {
        router.push('/directory'); // Phase A Selection Hub
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async () => {
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

    </div>
  );
}
