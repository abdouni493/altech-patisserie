import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cardVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

type Accent = 'gold' | 'rose' | 'pistachio' | 'caramel' | 'lavender' | 'none';

interface CardProps {
  children: ReactNode;
  className?: string;
  index?: number;
  hoverable?: boolean;
  onClick?: () => void;
  /** Thin gradient strip along the top edge for a premium, color-coded feel. */
  accent?: Accent;
}

const accentStrip: Record<Exclude<Accent, 'none'>, string> = {
  gold: 'from-[#F4A6C2] to-[#B02E66]',
  rose: 'from-[#F58BA0] to-[#9F1239]',
  pistachio: 'from-[#B5DDA4] to-[#5E9E5A]',
  caramel: 'from-[#F3D29A] to-[#C68B3E]',
  lavender: 'from-[#C9B6EC] to-[#7A5CC0]',
};

export function Card({ children, className, index = 0, hoverable = false, onClick, accent = 'none' }: CardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? 'hover' : undefined}
      onClick={onClick}
      className={cn(
        'group relative rounded-2xl bg-gradient-card border border-black/[0.06] shadow-card p-5 overflow-hidden',
        'transition-all duration-200 hover:shadow-hover hover:border-gold/25',
        hoverable && 'cursor-pointer',
        className
      )}
    >
      {accent !== 'none' && (
        <span
          aria-hidden
          className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', accentStrip[accent])}
        />
      )}
      {children}
    </motion.div>
  );
}
