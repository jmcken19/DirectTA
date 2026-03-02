'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Create Course State
    const [courseName, setCourseName] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);

    // Join Course State
    const [joinCode, setJoinCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [joinSuccess, setJoinSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/');
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const generateJoinCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseName || !courseNumber || !user) return;

        setIsCreating(true);
        setError(null);

        const newJoinCode = generateJoinCode();

        try {
            // 1. Insert Course
            const { data: course, error: courseError } = await supabase
                .from('courses')
                .insert([
                    {
                        name: courseName,
                        course_number: courseNumber,
                        join_code: newJoinCode,
                    }
                ])
                .select()
                .single();

            if (courseError) throw courseError;

            // 2. Enroll User as Professor
            const { error: enrollError } = await supabase
                .from('course_enrollments')
                .insert([
                    {
                        user_id: user.id,
                        course_id: course.id,
                        role: 'professor'
                    }
                ]);

            if (enrollError) throw enrollError;

            setGeneratedCode(newJoinCode);
        } catch (err: any) {
            console.error('Error creating course:', err);
            setError(err.message || 'Failed to create course');
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (joinCode.length !== 6 || !user) return;

        setIsJoining(true);
        setError(null);

        try {
            // 1. Find Course by Code
            const { data: course, error: courseError } = await supabase
                .from('courses')
                .select('id')
                .eq('join_code', joinCode.toUpperCase())
                .single();

            if (courseError || !course) {
                throw new Error('Invalid Join Code');
            }

            // 2. Enroll User as Student
            const { error: enrollError } = await supabase
                .from('course_enrollments')
                .insert([
                    {
                        user_id: user.id,
                        course_id: course.id,
                        role: 'student'
                    }
                ]);

            if (enrollError) {
                if (enrollError.code === '23505') { // Unique constraint
                    throw new Error('You are already enrolled in this course');
                }
                throw enrollError;
            }

            setJoinSuccess(true);
            setTimeout(() => {
                router.push('/directory');
            }, 2000);
        } catch (err: any) {
            console.error('Error joining course:', err);
            setError(err.message || 'Failed to join course');
        } finally {
            setIsJoining(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto pt-10 px-4 pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl font-black tracking-tight text-white mb-4">Course Onboarding</h1>
                <p className="text-xl text-gray-400 font-medium">Create a new workspace or join an existing community.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Create Course Section */}
                <div className="flex flex-col h-full">
                    <AnimatePresence mode="wait">
                        {!generatedCode ? (
                            <BaseGlassCard key="create-form" className="flex-1 flex flex-col p-8 border-white/10 hover:border-white/20 bg-white/[0.02]">
                                <div className="mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                        <Plus className="text-white w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Create a Course</h2>
                                    <p className="text-gray-400 text-sm">For Professors and Teaching Assistants.</p>
                                </div>

                                <form onSubmit={handleCreateCourse} className="space-y-6 flex-1 flex flex-col">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Course Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Software Engineering"
                                                value={courseName}
                                                onChange={(e) => setCourseName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Course Number</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. ITSC 3155"
                                                value={courseNumber}
                                                onChange={(e) => setCourseNumber(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && !isJoining && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="mt-auto w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        {isCreating ? <Loader2 className="animate-spin" /> : <>Create Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                                    </button>
                                </form>
                            </BaseGlassCard>
                        ) : (
                            <BaseGlassCard key="success-create" className="flex-1 flex flex-col items-center justify-center p-12 text-center border-white/30 bg-white/10">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                                >
                                    <Check className="text-green-500 w-10 h-10" />
                                </motion.div>
                                <h2 className="text-3xl font-black text-white mb-2">Course Created!</h2>
                                <p className="text-gray-400 mb-8">Share this join code with your students.</p>

                                <div className="w-full max-w-xs relative group">
                                    <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-6 mb-4 font-mono text-4xl font-bold tracking-[0.2em] text-white">
                                        {generatedCode}
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-2 overflow-hidden relative"
                                    >
                                        <AnimatePresence mode="wait">
                                            {copied ? (
                                                <motion.span key="copied" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2 text-green-400">
                                                    <Check className="w-4 h-4" /> Copied!
                                                </motion.span>
                                            ) : (
                                                <motion.span key="copy" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2">
                                                    <Copy className="w-4 h-4" /> Copy Code
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </div>

                                <button
                                    onClick={() => router.push('/directory')}
                                    className="mt-8 text-sm font-bold text-white/50 hover:text-white transition-colors underline underline-offset-4"
                                >
                                    Go to Directory
                                </button>
                            </BaseGlassCard>
                        )}
                    </AnimatePresence>
                </div>

                {/* Join Course Section */}
                <div className="flex flex-col h-full">
                    <AnimatePresence mode="wait">
                        {!joinSuccess ? (
                            <BaseGlassCard key="join-form" className="flex-1 flex flex-col p-8 border-white/10 hover:border-white/20 bg-white/[0.02]">
                                <div className="mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                        <Users className="text-white w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Join a Course</h2>
                                    <p className="text-gray-400 text-sm">For Students with a join code.</p>
                                </div>

                                <form onSubmit={handleJoinCourse} className="space-y-8 flex-1 flex flex-col">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">6-Digit Join Code</label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="ABCDEF"
                                                value={joinCode}
                                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-6 text-center text-4xl font-mono font-bold tracking-[0.3em] text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 transition-colors uppercase"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && isJoining && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isJoining || joinCode.length !== 6}
                                        className="mt-auto w-full py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white"
                                    >
                                        {isJoining ? <Loader2 className="animate-spin" /> : <>Join Course <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                                    </button>
                                </form>
                            </BaseGlassCard>
                        ) : (
                            <BaseGlassCard key="success-join" className="flex-1 flex flex-col items-center justify-center p-12 text-center border-green-500/30 bg-green-500/5">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.2, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20
                                    }}
                                    className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]"
                                >
                                    <Check className="text-white w-12 h-12" strokeWidth={3} />
                                </motion.div>
                                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tight">ENROLLED!</h2>
                                <p className="text-green-400 font-medium">Transitioning to Selection Grid...</p>
                            </BaseGlassCard>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={() => router.push('/directory')}
                    className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                >
                    Already enrolled? Skip to Directory
                </button>
            </div>
        </div>
    );
}
