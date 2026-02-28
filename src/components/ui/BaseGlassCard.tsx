'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BaseGlassCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
    delay?: number;
}

export function BaseGlassCard({ children, className, innerClassName, delay = 0, ...props }: BaseGlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: delay,
            }}
            className={cn(
                'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-white/10',
                className
            )}
            {...props}
        >
            {/* Optional internal gradient noise or borders can be added here */}
            <div className={cn("relative z-10", innerClassName)}>{children}</div>
        </motion.div>
    );
}
