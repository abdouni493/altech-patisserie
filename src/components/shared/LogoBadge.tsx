import { motion } from 'framer-motion';
import { CakeSlice } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

interface LogoBadgeProps {
  size?: number;
  icon?: number;
  className?: string;
}

// Store logo wrapped in an animated, color-rotating gradient frame.
// Falls back to the croissant mark when no logo is configured.
export function LogoBadge({ size = 44, icon = 24, className = '' }: LogoBadgeProps) {
  const logo = useSettingsStore((s) => s.settings.logo);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* Rotating conic-gradient frame — raspberry, butter & chocolate tones */}
      <motion.div
        aria-hidden
        className="absolute -inset-[3px] rounded-2xl"
        style={{ background: 'conic-gradient(from 0deg, #D6457F, #F2C77E, #9B7FD6, #B02E66, #D6457F)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      {/* Soft glow pulse */}
      <motion.div
        aria-hidden
        className="absolute -inset-[3px] rounded-2xl blur-md opacity-60"
        style={{ background: 'conic-gradient(from 180deg, #D6457F, #F2C77E, #9B7FD6, #B02E66, #D6457F)' }}
        animate={{ rotate: -360, opacity: [0.35, 0.7, 0.35] }}
        transition={{ rotate: { duration: 9, repeat: Infinity, ease: 'linear' }, opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
      />
      {/* Inner content */}
      <div className="absolute inset-0 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
        {logo ? (
          <img src={logo} alt="logo" className="h-full w-full object-cover rounded-2xl" />
        ) : (
          <div className="h-full w-full bg-gradient-button flex items-center justify-center rounded-2xl">
            <CakeSlice size={icon} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
