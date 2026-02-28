'use client';

import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { useTheme } from '@/hooks/useTheme';
import { useSchedule } from '@/hooks/useSchedule';
import { Settings, Link as LinkIcon, Calendar, CheckCircle2, ShieldAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';

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

    return (
        <div className="w-full max-w-5xl pt-10 pb-20">

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

            <div className="grid gap-8 lg:grid-cols-2">

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
                <BaseGlassCard delay={0.3} className="lg:col-span-2 flex flex-col gap-6">
                    <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                        <ShieldAlert className="h-5 w-5 text-gray-400" />
                        <h2 className="text-xl font-bold text-white">AI FAQ Moderation Queue</h2>
                        <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black">1 Pending</span>
                    </div>

                    <div className="rounded-xl border border-white/20 bg-black p-6">
                        <div className="mb-4">
                            <h3 className="font-bold text-white text-lg">Auto-Summarized: Segmentation Faults in Lab 4</h3>
                            <p className="text-sm text-gray-400 mt-1">Generated from 3 identical student queries</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                            <div className="rounded border border-white/10 bg-white/5 p-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Issue</span>
                                <p className="text-sm text-white">Students are getting segfaults because they are assigning values to uninitialized pointers in the Graph traversal step.</p>
                            </div>
                            <div className="rounded border border-white/10 bg-white/5 p-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">AI Fix Summary</span>
                                <p className="text-sm text-white">Ensure pointers are initialized (e.g., `Node* p = malloc(sizeof(Node));`) before attempting to set `p-&gt;value`.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 border-t border-white/10 pt-4">
                            <button className="flex items-center gap-2 rounded-lg bg-white px-6 py-2 font-bold text-black transition-colors hover:bg-gray-200">
                                <CheckCircle2 className="h-5 w-5" />
                                Approve to Post
                            </button>
                            <button className="rounded-lg border border-white/20 bg-transparent px-6 py-2 font-bold text-white transition-colors hover:bg-white/10">
                                Dismiss
                            </button>
                        </div>
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
        </div>
    );
}
