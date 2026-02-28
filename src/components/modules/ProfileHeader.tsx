'use client';

import { motion } from 'framer-motion';
import { BaseGlassCard } from '@/components/ui/BaseGlassCard';
import { useTheme } from '@/hooks/useTheme';

interface ProfileHeaderProps {
    name: string;
    course: string;
    imageUrl?: string;
}

export function ProfileHeader({ name, course, imageUrl }: ProfileHeaderProps) {
    const { themeColor, isActive } = useTheme();

    return (
        <BaseGlassCard className="flex items-center gap-6 p-8" delay={0.1}>
            <div className="relative">
                {/* Profile Output */}
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/20 bg-gray-800">
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/50">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Aura Pulse Effect for Active Status */}
                {isActive && (
                    <motion.div
                        className="absolute -inset-2 -z-10 rounded-full blur-xl"
                        style={{ backgroundColor: themeColor }}
                        initial={{ opacity: 0.4, scale: 0.8 }}
                        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.1, 0.8] }}
                        transition={{
                            duration: 3,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                    />
                )}
            </div>

            <div className="flex flex-col">
                <motion.h1
                    className="text-2xl font-semibold tracking-tight text-white"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                >
                    {name}
                </motion.h1>
                <motion.div
                    className="flex items-center gap-2 text-sm text-white/60"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
                >
                    <span>{course}</span>
                    {isActive && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-white/30" />
                            <span className="text-white font-medium">Available Now</span>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Bento abstract decoration */}
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20"
                style={{
                    background: `linear-gradient(to left, ${themeColor}, transparent)`,
                    maskImage: 'radial-gradient(ellipse at right, black, transparent)',
                    WebkitMaskImage: 'radial-gradient(ellipse at right, black, transparent)',
                }}
            />
        </BaseGlassCard>
    );
}
