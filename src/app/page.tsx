import Link from 'next/link';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';

export default function Home() {
  return (
    <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center pt-10">



      <BaseGlassCard delay={0.2} className="flex w-full max-w-md flex-col items-center gap-8 p-10 text-center">
        {/* Welcome */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome to TA Direct</h2>
          <p className="text-sm text-gray-400">Secure communication portal</p>
        </div>

        {/* Login Action */}
        <Link
          href="/directory"
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/5 px-6 py-4 transition-all duration-300 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <span className="font-semibold tracking-wide">Login with your school account</span>
        </Link>
      </BaseGlassCard>

      {/* Footer */}
      <footer className="absolute bottom-8 flex w-full justify-center gap-8 text-sm text-gray-500">
        <button className="hover:text-white transition-colors duration-200">Need help logging in?</button>
        <button className="hover:text-white transition-colors duration-200">Student Quick Links</button>
      </footer>

    </div>
  );
}
