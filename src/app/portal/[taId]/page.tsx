'use client';

import { useState } from 'react';

import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { useTheme } from '@/hooks/useTheme';
import { ManualCalendar } from '@/components/modules/ManualCalendar';
import { BellRing, ExternalLink, MessageSquare, Calendar as CalendarIcon, FileQuestion, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PortalDashboard() {
    const { themeColor, isActive, setIsActive } = useTheme();
    const [openFaqId, setOpenFaqId] = useState<number | null>(0);

    const FAQS = [
        {
            id: 0,
            question: "How do I submit Assignment 3?",
            answer: "Zip your project files and upload them to Canvas under module 4. Ensure your filename includes your student ID."
        },
        {
            id: 1,
            question: "What is the late policy?",
            answer: "10% deduction per day late, up to a maximum of 3 days. After 72 hours, submissions are not accepted. Medical emergencies require documentation to waive this."
        },
        {
            id: 2,
            question: "I'm getting a Segmentation Fault in Lab 4.",
            answer: "Ensure your pointers are initialized (e.g., `Node* p = malloc(sizeof(Node));`) before attempting to set `p->value` in the Graph traversal step. See slide 14 from Tuesday's lecture."
        },
        {
            id: 3,
            question: "Can we work in pairs for the final project?",
            answer: "Yes, teams of up to 2 are allowed. Both members must independently submit the final report, but only one needs to upload the codebase codebase on Canvas."
        }
    ];

    return (
        <div className="w-full max-w-6xl pt-4 pb-10">

            {/* Back Button */}
            <div className="mb-4">
                <Link href="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Directory
                </Link>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${isActive ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-gray-500 hover:text-white'}`}
                >
                    <BellRing className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                    Notifications {isActive ? 'ON' : 'OFF'}
                </button>
                <div className="text-right">
                    <h2 className="text-xl font-bold tracking-tight text-white">CS101: Intro to Computer Science</h2>
                </div>
            </div>

            {/* 3-Column Bento Grid */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Profile Column (Left) */}
                <BaseGlassCard delay={0.1} className="md:col-span-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                    <div className="relative mb-6">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-white/20 bg-[#111]">
                            <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-white/50">
                                A
                            </div>
                        </div>
                        {/* Aura Pulse Effect */}
                        {isActive && (
                            <motion.div
                                className="absolute -inset-4 -z-10 rounded-full blur-2xl"
                                style={{ backgroundColor: themeColor }}
                                initial={{ opacity: 0.2, scale: 0.8 }}
                                animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.1, 0.8] }}
                                transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                            />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Alex Mercer</h1>
                    <p className="mt-2 text-sm text-gray-400">Teaching Assistant</p>
                </BaseGlassCard>

                {/* Links Column (Right Side of Top Row, takes up 2 cols or 1 col depending on design, user asked for 3-col Bento grid so left = 1, middle = something?, right = 1. Let's make Profile 1 col, Links 1 col, maybe 3-col total means they share row 1) */}
                {/* Actually, 3-column Bento grid: Profile (Left) = col 1. Links (Right) = col 3? Let's make Profile span 2 cols and Links span 1, or just 1 and 2. Let's do Profile (1 col), Links (1 col), and an empty/info card (1 col) OR Profile fits 2 cols. */}
                {/* "Profile Column (Left)... Links Column (Right)... Full-Width Widgets (Lower)" indicates top row is split Left / Right. So 2 columns on top row is fine. */}
                <div className="md:col-span-2 grid gap-6 grid-cols-1 sm:grid-cols-2">

                    <BaseGlassCard delay={0.2} className="flex flex-col justify-center sm:col-span-2">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Connect & Links</h3>
                        <div className="flex flex-col gap-3">
                            <a href="#" className="group flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20">
                                <span className="font-medium text-white">Personal Website</span>
                                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="group flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20">
                                <span className="font-medium text-white">GitHub Profile</span>
                                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="group flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20">
                                <span className="font-medium text-white">Best Email (alex@charlotte.edu)</span>
                                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
                            </a>
                        </div>
                    </BaseGlassCard>

                </div>

                {/* Full-Width Widgets (Lower) */}

                {/* 1. AI Summarized FAQ */}
                <BaseGlassCard delay={0.3} className="md:col-span-3">
                    <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="rounded-full bg-white/10 p-2"><FileQuestion className="h-5 w-5 text-white" /></div>
                        <h3 className="text-xl font-bold text-white">AI Summarized FAQ</h3>
                        <span className="ml-auto text-xs text-gray-400 italic">Auto-generated from recent student queries</span>
                    </div>

                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {FAQS.map((faq) => {
                            const isOpen = openFaqId === faq.id;
                            return (
                                <div key={faq.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-colors hover:bg-white/5 shrink-0">
                                    <button
                                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                                        className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
                                    >
                                        <h4 className={`font-semibold transition-colors ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                                            Q: {faq.question}
                                        </h4>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        >
                                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </motion.div>
                                    </button>

                                    <motion.div
                                        initial={false}
                                        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-white/5 p-5 pt-0 mt-2 text-sm text-gray-400">
                                            A: {faq.answer}
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </BaseGlassCard>

                {/* 2. Office Hours Calendar */}
                <BaseGlassCard delay={0.4} className="md:col-span-3">
                    <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="rounded-full bg-white/10 p-2"><CalendarIcon className="h-5 w-5 text-white" /></div>
                        <h3 className="text-xl font-bold text-white">Office Hours Calendar</h3>
                    </div>
                    <ManualCalendar />
                </BaseGlassCard>

                {/* 3. Live Chat Module */}
                <BaseGlassCard delay={0.5} className="md:col-span-3 min-h-[400px] flex flex-col">
                    <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="rounded-full bg-white/10 p-2"><MessageSquare className="h-5 w-5 text-white" /></div>
                        <h3 className="text-xl font-bold text-white">Live Chat (Private & Ephemeral)</h3>
                        <span className="ml-auto text-xs font-semibold text-gray-500 uppercase tracking-wider">Messages Auto-Delete on Resolution</span>
                    </div>

                    <div className="flex-1 rounded-xl border border-white/10 bg-black/40 p-6 flex flex-col justify-end">
                        {/* Mock Chat UI */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="self-end rounded-2xl rounded-tr-sm bg-white/10 p-4 max-w-[80%]">
                                <p className="text-sm text-white">Hi Alex, I'm stuck on fixing the segmentation fault in lab 4.</p>
                            </div>
                            <div className="self-start rounded-2xl rounded-tl-sm bg-[#222] border border-white/10 p-4 max-w-[80%]">
                                <p className="text-sm text-white">Hey! Are you initializing the pointers before you assign values to them? Check line 42.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                            />
                            <button className="rounded-lg bg-white px-6 font-semibold text-black transition-colors hover:bg-gray-200">
                                Send
                            </button>
                        </div>
                    </div>
                </BaseGlassCard>

            </div>
        </div>
    );
}
