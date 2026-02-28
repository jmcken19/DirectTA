'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelection } from '@/hooks/useSelection';

// Mock DB for Courses
const COURSES = [
    { id: 'cs101', name: 'CS101: Intro to Computer Science' },
    { id: 'itsc3155', name: 'ITSC 3155: Software Engineering' },
    { id: 'cs202', name: 'CS202: Data Structures' },
    { id: 'cs412', name: 'CS412: Web Development' }
];

// Mock DB for TAs
const TAS = [
    { id: '1', name: 'Alex Mercer', courseId: 'cs101' },
    { id: '2', name: 'Sarah Chen', courseId: 'cs202' },
    { id: '3', name: 'Marcus Johnson', courseId: 'itsc3155' },
    { id: '5', name: 'David Kim', courseId: 'itsc3155' }, // 3155 has 2 TAs
    { id: '4', name: 'Elena Rodriguez', courseId: 'cs412' },
];

export default function DirectoryPage() {
    const router = useRouter();
    const { setCourseSelect, setTaSelect } = useSelection();

    // Step 1: Course Selection, Step 2: TA Selection
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedCourse, setSelectedCourse] = useState<{ id: string, name: string } | null>(null);

    const handleCourseSelect = (courseId: string, courseName: string) => {
        // Save course selection to cache
        setCourseSelect(courseId, courseName);
        setSelectedCourse({ id: courseId, name: courseName });

        // Filter TAs for this course
        const availableTAs = TAS.filter(ta => ta.courseId === courseId);

        if (availableTAs.length === 1) {
            // Auto-Route if only 1 TA exists
            const ta = availableTAs[0];
            setTaSelect(ta.id);
            router.push(`/portal/${ta.id}`);
        } else {
            // Move to Step 2 (TA Selection Hub)
            setStep(2);
        }
    };

    const handleTaSelect = (taId: string) => {
        setTaSelect(taId);
        router.push(`/portal/${taId}`);
    };

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
                        <div className="mb-10">
                            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Select Your Course</h1>
                            <p className="text-gray-400">Choose a course to find your assigned Teaching Assistant.</p>
                        </div>

                        {/* Phase 1: Course Grid */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {COURSES.map((course, index) => (
                                <button
                                    onClick={() => handleCourseSelect(course.id, course.name)}
                                    key={course.id}
                                    className="text-left"
                                >
                                    <BaseGlassCard
                                        delay={0.1 * index}
                                        className="group relative flex flex-col justify-between h-40 hover:scale-[1.02] cursor-pointer transition-transform border-white/20 hover:border-white/50 bg-black/40 hover:bg-white/10 overflow-hidden"
                                    >
                                        <div className="relative z-10">
                                            <h2 className="text-xl font-bold text-white leading-tight min-h-[50px]">{course.name}</h2>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                                View TAs
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                                        </div>

                                        {/* Subtle Azura C Charlotte Logo Maker */}
                                        <div className="absolute top-4 right-4 text-[10px] font-black tracking-tighter text-white/10 select-none">
                                            C.
                                        </div>
                                    </BaseGlassCard>
                                </button>
                            ))}
                        </div>
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
                            <p className="text-gray-400">Select your Teaching Assistant to access their portal.</p>
                        </div>

                        {/* Phase 2: TA Selection Hub */}
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {TAS.filter(ta => ta.courseId === selectedCourse.id).map((ta, index) => (
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
                                                <h2 className="text-lg font-bold text-white">TA: {ta.name}</h2>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
                                            <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">
                                                Click to access TA Site
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                                        </div>
                                    </BaseGlassCard>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
