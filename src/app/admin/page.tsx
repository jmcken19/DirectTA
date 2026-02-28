'use client';

import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { useTheme } from '@/hooks/useTheme';
import { useSchedule } from '@/hooks/useSchedule';
import { Settings, Link as LinkIcon, Calendar, CheckCircle2, ShieldAlert, Trash2, ArrowLeft, MessageSquare, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminControlPage() {
    const { themeColor, setThemeColor, isActive, setIsActive } = useTheme();
    const { slots, addSlot, removeSlot, isLoaded } = useSchedule();

    // Example State for Link Toggles
    const [links, setLinks] = useState({
        github: true,
        linkedin: false,
        website: true,
    });

    const [newSlot, setNewSlot] = useState({
        dayOfWeek: 'Monday',
        startTime: '13:00',
        endTime: '15:00',
        locationOrLink: ''
    });

    const handleAddSlot = () => {
        if (newSlot.endTime <= newSlot.startTime) {
            alert("End time must be after start time.");
            return;
        }
        if (!newSlot.locationOrLink.trim()) {
            alert("Please provide a location or meeting link.");
            return;
        }
        addSlot(newSlot);
        setNewSlot({ ...newSlot, locationOrLink: '' });
    };

    // Phase 8: Active Task Management System mocks
    const [activeChats, setActiveChats] = useState([
        { id: 'c1', student: 'Alex Mercer', waitTime: '4m', lastActor: 'student', preview: "I'm confused about the recursive step..." },
        { id: 'c2', student: 'Sarah Chen', waitTime: '12m', lastActor: 'student', preview: "Where do we submit the extra credit?" },
        { id: 'c3', student: 'Marcus J.', waitTime: '1m', lastActor: 'ta', preview: "Yes, you can use a dictionary for that." }
    ]);

    const [pendingFaqs, setPendingFaqs] = useState([
        { id: 'f1', issue: "Students are getting segfaults because they are assigning values to uninitialized pointers in the Graph traversal step.", fix: "Ensure pointers are initialized (e.g., `Node* p = malloc(sizeof(Node));`) before attempting to set `p->value`.", count: 6, date: "Feb 27" },
        { id: 'f2', issue: "Are we allowed to work in pairs and do both members need to submit the codebase?", fix: "Yes, teams of up to 2 are allowed. Both members must submit the report, but only one uploads the codebase.", count: 4, date: "Feb 25" }
    ]);

    // Initial total used to calculate the progress bar correctly instead of moving the goal posts
    const [initialTotals] = useState({ chats: 3, faqs: 2 });

    // Derived state
    const resolvedChatsCount = initialTotals.chats - activeChats.length;
    const resolvedFaqsCount = initialTotals.faqs - pendingFaqs.length;
    const totalResolved = resolvedChatsCount + resolvedFaqsCount;
    const totalTasks = initialTotals.chats + initialTotals.faqs;
    const progressPercentage = (totalResolved / totalTasks) * 100;

    const isAllClear = activeChats.length === 0 && pendingFaqs.length === 0;

    const handleResolveChat = (id: string) => {
        setActiveChats(prev => prev.filter(c => c.id !== id));
    };

    const handleApproveFaq = (id: string) => {
        setPendingFaqs(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className={`w-full min-h-screen relative transition-colors duration-1000 ${isAllClear ? 'bg-gradient-to-br from-[#0f172a] via-[#064e3b] to-black' : ''}`}>
            {/* Glowing Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
                <motion.div
                    className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />
            </div>

            <div className="w-full max-w-7xl mx-auto pt-10 pb-20 px-4">

                {/* Back Button */}
                <div className="mb-6 z-10 relative">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Gateway
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
                            <Settings className="h-8 w-8 text-[#8A2BE2]" />
                            TA Logic Engine
                        </h1>
                        <p className="text-gray-400">Control panel & administration</p>
                    </div>
                </div>

                {isAllClear ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                    >
                        <div className="w-24 h-24 mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                        </div>
                        <h2 className="text-5xl font-black tracking-widest text-white mb-4">NOTHING LEFT TO DO.</h2>
                        <p className="text-xl text-emerald-400/80 font-medium">Your students are all set.</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* 1. Main Content Left (Links, Calendar, FAQ) */}
                        <div className="lg:col-span-8 flex flex-col gap-8">

                            {/* Link Selector */}
                            <BaseGlassCard delay={0.1} className="flex flex-col gap-6">
                                <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                                    <LinkIcon className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-xl font-bold text-white">Link Selector</h2>
                                </div>
                                <p className="text-sm text-gray-400">Toggle which professional links are visible on your portal.</p>

                                <div className="flex flex-col gap-3">
                                    {Object.entries(links).map(([key, active]) => (
                                        <div key={key} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 p-4">
                                            <span className="font-semibold text-white capitalize">{key}</span>
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={active}
                                                    onChange={() => setLinks(prev => ({ ...prev, [key]: !active }))}
                                                />
                                                <div className="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </BaseGlassCard>

                            {/* Global Settings */}
                            <BaseGlassCard delay={0.2} className="flex flex-col gap-6">
                                <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                                    <Settings className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-xl font-bold text-white">Global Settings</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white">Notification Pings (Aura Status)</label>
                                        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 p-4">
                                            <span className="text-sm text-gray-300">Accepting messages (Pulse Active)</span>
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                                                <div className="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white">Custom Accent Color</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="color"
                                                value={themeColor}
                                                onChange={(e) => setThemeColor(e.target.value)}
                                                className="h-10 w-20 cursor-pointer rounded border border-white/20 bg-transparent p-1"
                                            />
                                            <span className="font-mono text-sm text-gray-400">{themeColor}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">Updates aura pulse and specific mesh gradients.</p>
                                    </div>
                                </div>
                            </BaseGlassCard>

                            {/* AI FAQ Workflow */}
                            <BaseGlassCard delay={0.3} className="lg:col-span-12 flex flex-col gap-6">
                                <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                                    <ShieldAlert className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-xl font-bold text-white">AI FAQ Moderation Queue</h2>
                                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${pendingFaqs.length > 0 ? 'bg-white text-black' : 'bg-white/10 text-white/50'}`}>
                                        {pendingFaqs.length} Pending
                                    </span>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <AnimatePresence>
                                        {pendingFaqs.map((faq) => (
                                            <motion.div
                                                key={faq.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                className="rounded-xl border border-white/20 bg-black p-6 flex flex-col"
                                            >
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-white text-lg line-clamp-1">AI Draft: {faq.issue}</h3>
                                                    <p className="text-sm text-gray-400 mt-1">Generated from {faq.count} identical student queries</p>
                                                </div>

                                                <div className="grid gap-4 lg:grid-cols-2 mb-6 flex-1">
                                                    <div className="rounded border border-white/10 bg-white/5 p-4 flex flex-col">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Issue</span>
                                                            <span className="text-[10px] text-gray-500 font-medium">{faq.date}</span>
                                                        </div>
                                                        <p className="text-sm text-white line-clamp-3">{faq.issue}</p>
                                                    </div>
                                                    <div className="rounded border border-white/10 bg-white/5 p-4 flex flex-col">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80 mb-2 block">AI Fix Summary</span>
                                                        <p className="text-sm text-white line-clamp-3">{faq.fix}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 border-t border-white/10 pt-4 mt-auto">
                                                    <button
                                                        onClick={() => handleApproveFaq(faq.id)}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-6 py-2 font-bold text-black transition-colors hover:bg-gray-200"
                                                    >
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        Approve to Post
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveFaq(faq.id)} // Mock dismiss
                                                        className="rounded-lg border border-white/20 bg-transparent px-6 py-2 font-bold text-white transition-colors hover:bg-white/10"
                                                    >
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {pendingFaqs.length === 0 && (
                                            <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl">
                                                <CheckCircle2 className="h-8 w-8 text-white/20 mb-3" />
                                                <p className="text-white/40 font-medium">No pending FAQs to moderate.</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </BaseGlassCard>

                            {/* Office Hours Input */}
                            <BaseGlassCard delay={0.4} className="lg:col-span-2 flex flex-col gap-6">
                                <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-xl font-bold text-white">Office Hours Management</h2>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Add New Block</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="mb-1 block text-xs font-semibold text-white">Day of Week</label>
                                                <select
                                                    value={newSlot.dayOfWeek}
                                                    onChange={e => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-white/50 focus:outline-none appearance-none"
                                                >
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-white">Start Time</label>
                                                <input type="time" value={newSlot.startTime} onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white [color-scheme:dark]" />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-white">End Time</label>
                                                <input type="time" value={newSlot.endTime} onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white [color-scheme:dark]" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="mb-1 block text-xs font-semibold text-white">Location / Link</label>
                                                <input type="text" placeholder="Room 302 or zoom.us/j/..." value={newSlot.locationOrLink} onChange={e => setNewSlot({ ...newSlot, locationOrLink: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                                            </div>
                                        </div>
                                        <button onClick={handleAddSlot} className="w-full rounded-lg bg-white/10 py-2.5 font-bold text-white transition-colors hover:bg-white hover:text-black">
                                            Add Slot
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Current Schedule</h3>
                                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                                            {!isLoaded ? (
                                                <div className="animate-pulse h-12 bg-white/5 rounded-lg border border-white/10"></div>
                                            ) : slots.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic border border-dashed border-white/10 rounded-lg p-4 text-center">No office hours scheduled yet.</p>
                                            ) : (
                                                slots.sort((a, b) => a.dayOfWeek.localeCompare(b.dayOfWeek)).map(slot => (
                                                    <div key={slot.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{slot.dayOfWeek}</p>
                                                            <p className="text-xs text-gray-400">{slot.startTime} - {slot.endTime}</p>
                                                        </div>
                                                        <button onClick={() => removeSlot(slot.id)} className="text-red-400/70 hover:text-red-400 p-2 transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </BaseGlassCard>

                        </div>

                        {/* 2. Main Content Right (Active Task Sidebar) */}
                        <div className="lg:col-span-4">
                            <BaseGlassCard delay={0.2} className="flex flex-col h-[calc(100vh-10rem)] sticky top-20 overflow-hidden">
                                <div className="border-b border-white/10 pb-4 flex items-center gap-3 shrink-0">
                                    <MessageSquare className="h-5 w-5 text-[#8A2BE2]" />
                                    <h2 className="text-xl font-bold text-white">Pending Queue</h2>
                                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${activeChats.length > 0 ? 'bg-white text-black' : 'bg-white/10 text-white/50'}`}>
                                        {activeChats.length} Active
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-3 pr-2">
                                    <AnimatePresence>
                                        {activeChats.map((chat) => (
                                            <motion.div
                                                key={chat.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${chat.lastActor === 'student'
                                                    ? 'bg-black/60 border-white/30 shadow-[0_0_15px_rgba(138,43,226,0.15)]' // Aura glow for student pending
                                                    : 'bg-white/5 border-white/10' // Normal wait state
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-[#222] border border-white/10 flex items-center justify-center shrink-0">
                                                            <span className="text-xs font-bold text-white/50">{chat.student.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white">{chat.student}</h4>
                                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{chat.waitTime} wait</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {chat.lastActor === 'student' ? (
                                                        <span className="text-[10px] font-black tracking-wider uppercase bg-[#8A2BE2]/20 text-[#8A2BE2] px-2 py-1 rounded">Pending</span>
                                                    ) : (
                                                        <span className="text-[10px] font-black tracking-wider uppercase bg-white/10 text-white/50 px-2 py-1 rounded">Waiting</span>
                                                    )}
                                                </div>

                                                <div className="bg-white/5 rounded p-3 text-xs text-gray-300 italic line-clamp-2">
                                                    "{chat.preview}"
                                                </div>

                                                <div className="flex gap-2 mt-1">
                                                    <button className="flex-1 bg-white hover:bg-gray-200 text-black text-xs font-bold py-2 rounded transition-colors">
                                                        Open Chat
                                                    </button>
                                                    <button
                                                        onClick={() => handleResolveChat(chat.id)}
                                                        className="bg-transparent border border-white/20 hover:bg-white/10 text-white text-xs font-bold py-2 px-3 rounded transition-colors"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {activeChats.length === 0 && (
                                            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 text-center mt-4">
                                                <CheckCircle2 className="h-8 w-8 text-white/20 mb-3" />
                                                <p className="text-white/40 font-medium text-sm">No active chats.</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </BaseGlassCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
