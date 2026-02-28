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
        <div className="w-full h-screen overflow-hidden px-4 md:px-8 pt-4 pb-6 flex flex-col">

            {/* Header / Brand Bar */}
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors border-r border-white/10 pr-4">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <h2 className="text-sm md:text-md font-bold tracking-tight text-white hidden sm:block mr-4">CS101: Intro to Computer Science</h2>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors border ${isActive ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-gray-500 hover:text-white'}`}
                    >
                        <BellRing className={`h-3 w-3 ${isActive ? 'text-white' : ''}`} />
                        {isActive ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Full-Width 12-Column Bento Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12 flex-1">

                {/* LEFT PANEL: Identity (Span 3) */}
                <div className="md:col-span-3 flex flex-col gap-4 md:gap-6">
                    <BaseGlassCard delay={0.1} className="flex flex-col items-center justify-center p-6 text-center shrink-0">
                        <div className="relative mb-6 mt-4">
                            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/20 bg-[#111]">
                                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white/50">
                                    A
                                </div>
                            </div>
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
                        <p className="mt-1 text-sm text-gray-400">Teaching Assistant</p>
                    </BaseGlassCard>

                    <BaseGlassCard delay={0.2} className="flex flex-col flex-1 min-h-0">
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 shrink-0">Connect</h3>
                        <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                            <a href="#" className="group flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 min-h-[50px] transition-all hover:bg-white/10 hover:border-white/20 shrink-0">
                                <span className="font-medium text-white text-sm">Personal Website</span>
                                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="group flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 min-h-[50px] transition-all hover:bg-white/10 hover:border-white/20 shrink-0">
                                <span className="font-medium text-white text-sm">GitHub</span>
                                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="group flex w-full flex-col justify-center rounded-lg border border-white/5 bg-white/5 p-3 min-h-[60px] transition-all hover:bg-white/10 hover:border-white/20 shrink-0">
                                <div className="flex justify-between items-center w-full mb-1">
                                    <span className="font-medium text-white text-sm">Email</span>
                                    <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-white" />
                                </div>
                                <span className="text-xs text-gray-400 truncate">alex@charlotte.edu</span>
                            </a>
                        </div>
                    </BaseGlassCard>
                </div>

                {/* CENTER PANEL: Weighted Center Stack (Span 6) */}
                <div className="md:col-span-6 flex flex-col gap-4 md:gap-6">

                    {/* Top Module: Calendar (40% height) */}
                    <BaseGlassCard delay={0.3} className="flex flex-col h-[40%] min-h-0 shrink-0">
                        <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3 shrink-0">
                            <div className="rounded-full bg-white/10 p-2"><CalendarIcon className="h-4 w-4 text-white" /></div>
                            <h3 className="text-lg font-bold text-white">Office Hours Calendar</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2">
                            <ManualCalendar />
                        </div>
                    </BaseGlassCard>

                    {/* Bottom Module: AI FAQ */}
                    <BaseGlassCard delay={0.5} className="flex flex-col h-auto">
                        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <FileQuestion className="h-4 w-4 text-white" />
                                <h3 className="text-sm font-bold text-white">AI Summarized FAQ</h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pb-2 pt-1 h-auto">
                            {FAQS.map((faq) => (
                                <div key={faq.id} className="grid grid-cols-2 gap-4 rounded-lg border border-white/10 bg-black/40 p-4 transition-colors hover:bg-white/5 shrink-0 items-start">
                                    <div className="flex flex-col gap-1 pr-4 border-r border-white/10">
                                        <span className="text-[10px] uppercase tracking-wider text-[#8A2BE2] font-semibold opacity-80">Issue</span>
                                        <h4 className="text-sm font-semibold text-white leading-snug">
                                            {faq.question}
                                        </h4>
                                    </div>
                                    <div className="flex flex-col gap-1 pl-2">
                                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold opacity-80">Fix</span>
                                        <p className="text-[11px] leading-relaxed text-gray-400">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BaseGlassCard>
                </div>

                {/* RIGHT PANEL: Live Chat (Span 3) */}
                <div className="md:col-span-3 flex flex-col">

                    {/* Live Chat Full Height */}
                    <BaseGlassCard delay={0.4} className="flex flex-col h-full min-h-0">
                        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-white" />
                                <h3 className="text-sm font-bold text-white">Live Chat</h3>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Auto-Delete</span>
                        </div>

                        <div className="flex-1 rounded-lg border border-white/5 bg-black/40 p-3 flex flex-col justify-end min-h-0 mb-3 overflow-hidden">
                            <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-2">
                                <div className="self-end rounded-xl rounded-tr-sm bg-white/10 p-3 max-w-[85%] shrink-0">
                                    <p className="text-xs text-white">Hi Alex, stuck on the segfault in lab 4.</p>
                                </div>
                                <div className="self-start rounded-xl rounded-tl-sm bg-[#222] border border-white/10 p-3 max-w-[85%] shrink-0">
                                    <p className="text-xs text-white">Hey! Are you initializing the pointers? Check line 42.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <input
                                type="text"
                                placeholder="Message..."
                                className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-white/30 focus:outline-none"
                            />
                            <button className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-gray-200">
                                Send
                            </button>
                        </div>
                    </BaseGlassCard>
                </div>
            </div>
        </div>
    );
}
