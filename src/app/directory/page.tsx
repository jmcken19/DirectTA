import Link from 'next/link';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const MOCK_TAS = [
    { id: '1', name: 'Alex Mercer', course: 'CS101: Intro to Computer Science' },
    { id: '2', name: 'Sarah Chen', course: 'CS202: Data Structures' },
    { id: '3', name: 'Marcus Johnson', course: 'CS304: Algorithms' },
    { id: '4', name: 'Elena Rodriguez', course: 'CS412: Web Development' },
];

export default function DirectoryPage() {
    return (
        <div className="w-full max-w-4xl pt-10">

            {/* Back Button */}
            <div className="mb-4">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Gateway
                </Link>
            </div>

            {/* Header */}
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">TA Directory</h1>
                    <p className="text-gray-400">Select your Teaching Assistant to access their portal.</p>
                </div>
                <div className="hidden md:block">
                    <span className="text-sm font-semibold tracking-widest text-[#8A2BE2] opacity-80 uppercase">C Charlotte</span>
                </div>
            </div>

            {/* List View Grid */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {MOCK_TAS.map((ta, index) => (
                    <Link href={`/portal/${ta.id}`} key={ta.id}>
                        <BaseGlassCard
                            delay={0.1 * index}
                            className="group flex flex-col justify-between h-40 hover:scale-[1.02] cursor-pointer transition-transform border-white/20 hover:border-white/50 bg-black/40 hover:bg-white/10"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-white">TA: {ta.name}</h2>
                                <p className="text-sm text-gray-400 mt-1">{ta.course}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                    Click to access TA Site
                                </span>
                                <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                            </div>
                        </BaseGlassCard>
                    </Link>
                ))}
            </div>

        </div>
    );
}
