'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { ArrowRight, ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelection } from '@/hooks/useSelection';
import { supabase } from '@/lib/supabaseClient';

interface Course {
    id: string;
    name: string;
    course_number: string;
}

interface TA {
    id: string;
    name: string;
}

export default function DirectoryPage() {
    const router = useRouter();
    const { setCourseSelect, setTaSelect } = useSelection();

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [tas, setTas] = useState<TA[]>([]);

    // Step 1: Course Selection, Step 2: TA Selection
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/');
                    return;
                }

                // Fetch courses via enrollments
                const { data: enrollments, error } = await supabase
                    .from('course_enrollments')
                    .select(`
                        course_id,
                        courses (
                            id,
                            name,
                            course_number
                        )
                    `)
                    .eq('user_id', session.user.id);

                if (error) throw error;

                if (enrollments && enrollments.length > 0) {
                    const enrolledCourses = enrollments
                        .map((e: any) => e.courses)
                        .filter(Boolean);
                    setCourses(enrolledCourses);
                } else {
                    // No enrollments, suggest onboarding
                    setCourses([]);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [router]);

    const handleCourseSelect = async (course: Course) => {
        setCourseSelect(course.id, course.name);
        setSelectedCourse(course);
        setLoading(true);

        try {
            // Fetch TAs (including professors) for this course from course_enrollments
            // In this context, a "TA" is anyone with role 'ta' or 'professor'
            const { data: enrollments, error } = await supabase
                .from('course_enrollments')
                .select(`
                    user_id,
                    role
                `)
                .eq('course_id', course.id)
                .in('role', ['ta', 'professor']);

            if (error) throw error;

            // In a real app, we'd join with a profiles table to get names.
            // For now, let's assume we have names or mock them if profiles aren't ready.
            // Wait, let's try to get user meta or just show IDs if names aren't available.
            // Actually, let's try to join with 'profiles' (common Supabase pattern).

            const { data: taProfiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', enrollments?.map(e => e.user_id) || []);

            // Merge profile data with context from enrollments
            const combinedTas = enrollments?.map(e => {
                const profile = taProfiles?.find(p => p.id === e.user_id);
                return {
                    id: e.user_id,
                    name: profile?.full_name || `Staff Member (${e.role})`
                };
            }) || [];

            setTas(combinedTas);

            if (combinedTas.length === 1) {
                setTaSelect(combinedTas[0].id);
                router.push(`/portal/${combinedTas[0].id}`);
            } else {
                setStep(2);
            }
        } catch (err) {
            console.error('Error fetching TAs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTaSelect = (taId: string) => {
        setTaSelect(taId);
        router.push(`/portal/${taId}`);
    };

    if (loading && step === 1) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/50" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl pt-10 min-h-[60vh] relative overflow-hidden">

            {/* Back Navigation */}
            <div className="mb-4 z-10 relative">
                {step === 1 ? (
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Gateway
                    </Link>
                ) : (
                    <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Courses
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full"
                    >
                        <div className="mb-10 flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-white mb-2">Select Your Course</h1>
                                <p className="text-gray-400">Choose a course to find your assigned Teaching Assistant.</p>
                            </div>
                            <Link href="/onboarding">
                                <BaseGlassCard className="py-2 px-4 hover:bg-white hover:text-black transition-all border-white/10 flex items-center gap-2 group">
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Join/Create</span>
                                </BaseGlassCard>
                            </Link>
                        </div>

                        {courses.length === 0 ? (
                            <BaseGlassCard className="py-20 text-center border-dashed border-white/20">
                                <h3 className="text-xl font-bold text-white/70 mb-4">No Courses Found</h3>
                                <p className="text-gray-500 mb-8">You haven't enrolled in or created any courses yet.</p>
                                <Link href="/onboarding">
                                    <button className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors">
                                        Get Started
                                    </button>
                                </Link>
                            </BaseGlassCard>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course, index) => (
                                    <button
                                        onClick={() => handleCourseSelect(course)}
                                        key={course.id}
                                        className="text-left"
                                    >
                                        <BaseGlassCard
                                            delay={0.1 * index}
                                            className="group relative flex flex-col justify-between h-40 hover:scale-[1.02] cursor-pointer transition-transform border-white/20 hover:border-white/50 bg-black/40 hover:bg-white/10 overflow-hidden"
                                        >
                                            <div className="relative z-10">
                                                <div className="text-[10px] font-black tracking-widest text-white/30 mb-1 uppercase">{course.course_number}</div>
                                                <h2 className="text-xl font-bold text-white leading-tight min-h-[50px]">{course.name}</h2>
                                            </div>

                                            <div className="relative z-10 flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                                                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                                    View Staff
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                                            </div>

                                            <div className="absolute top-4 right-4 text-[10px] font-black tracking-tighter text-white/10 select-none">
                                                C.
                                            </div>
                                        </BaseGlassCard>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {step === 2 && selectedCourse && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full"
                    >
                        <div className="mb-10">
                            <h1 className="text-4xl font-black tracking-tight text-white mb-2">{selectedCourse.name}</h1>
                            <p className="text-gray-400">Select your Teaching Assistant or Professor to access their portal.</p>
                        </div>

                        {loading ? (
                            <div className="flex h-40 items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {tas.map((ta, index) => (
                                    <button
                                        onClick={() => handleTaSelect(ta.id)}
                                        key={ta.id}
                                        className="text-left focus:outline-none"
                                    >
                                        <BaseGlassCard
                                            delay={0.1 * index}
                                            className="group flex flex-col justify-between h-48 hover:scale-[1.02] cursor-pointer transition-transform border-white/20 hover:border-white/50 bg-black/40 hover:bg-white/10"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 rounded-full bg-[#222] border border-white/10 flex items-center justify-center shrink-0">
                                                    <span className="text-lg font-bold text-white/50">{ta.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-white">{ta.name}</h2>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
                                                <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">
                                                    Click to access Site
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                                            </div>
                                        </BaseGlassCard>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
