import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Wheat, ShoppingBasket, ChefHat, Croissant, Store, ClipboardPen,
  ReceiptText, HeartHandshake, Truck, UsersRound, HandCoins, Coins, ChartPie, SlidersHorizontal, LogOut, X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLanguage } from '@/hooks/useLanguage';
import { usePermissions } from '@/hooks/usePermissions';
import { useSettingsStore } from '@/store/settingsStore';
import { LogoBadge } from '@/components/shared/LogoBadge';
import { sidebarItemVariants } from '@/lib/animations';
import type { PermissionModule } from '@/types';
import type { TranslationKey } from '@/lib/i18n';

interface NavItem {
  to: string;
  key: TranslationKey;
  module: PermissionModule;
  icon: typeof LayoutDashboard;
}

interface NavSection {
  label: { fr: string; ar: string };
  items: NavItem[];
}

// Navigation grouped by pâtisserie workflow: atelier → vitrine/vente → relations → gestion.
const navSections: NavSection[] = [
  {
    label: { fr: 'Accueil', ar: 'الرئيسية' },
    items: [{ to: '/dashboard', key: 'dashboard', module: 'dashboard', icon: LayoutDashboard }],
  },
  {
    label: { fr: 'Atelier', ar: 'الورشة' },
    items: [
      { to: '/stock', key: 'stock', module: 'stock', icon: Wheat },
      { to: '/purchase', key: 'purchase', module: 'purchase', icon: ShoppingBasket },
      { to: '/production', key: 'production', module: 'production', icon: ChefHat },
    ],
  },
  {
    label: { fr: 'Vitrine & Ventes', ar: 'الواجهة والمبيعات' },
    items: [
      { to: '/comptoir', key: 'comptoir', module: 'comptoir', icon: Croissant },
      { to: '/pos', key: 'pos', module: 'pos', icon: Store },
      { to: '/commands', key: 'commands', module: 'commands', icon: ClipboardPen },
      { to: '/sales', key: 'sales', module: 'sales', icon: ReceiptText },
      { to: '/caisse', key: 'caisse', module: 'caisse', icon: Coins },
    ],
  },
  {
    label: { fr: 'Relations', ar: 'العلاقات' },
    items: [
      { to: '/clients', key: 'clients', module: 'clients', icon: HeartHandshake },
      { to: '/suppliers', key: 'suppliers', module: 'suppliers', icon: Truck },
    ],
  },
  {
    label: { fr: 'Gestion', ar: 'الإدارة' },
    items: [
      { to: '/workers', key: 'workers', module: 'workers', icon: UsersRound },
      { to: '/expenses', key: 'expenses', module: 'expenses', icon: HandCoins },
      { to: '/reports', key: 'reports', module: 'reports', icon: ChartPie },
      { to: '/settings', key: 'settings', module: 'settings', icon: SlidersHorizontal },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { t, isRTL, language } = useLanguage();
  const { canView } = usePermissions();
  const store = useSettingsStore((s) => s.settings);

  const visibleSections = navSections
    .map((section) => ({ ...section, items: section.items.filter((item) => canView(item.module)) }))
    .filter((section) => section.items.length > 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        initial={false}
        className={`fixed lg:sticky top-0 z-40 h-screen w-[260px] bg-gradient-sidebar flex flex-col shrink-0 transition-transform duration-300 ${
          isRTL ? 'right-0 border-l border-white/5' : 'left-0 border-r border-white/5'
        } ${open ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="flex items-center gap-3">
            <LogoBadge size={44} icon={24} />
            <div className="min-w-0">
              <h2 className="font-display text-base font-bold text-rose-50 leading-tight truncate">{store.name}</h2>
              <p className="text-[11px] text-pink-200/60 truncate">{store.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-pink-200/50 hover:text-rose-50">
            <X size={20} />
          </button>
        </div>

        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent mb-2" />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {(() => {
            let idx = 0;
            return visibleSections.map((section) => (
              <div key={section.label.fr} className="mb-3 last:mb-0">
                <p className="px-3.5 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-pink-300/45">
                  {language === 'ar' ? section.label.ar : section.label.fr}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const i = idx++;
                    return (
                      <motion.div key={item.to} custom={i} variants={sidebarItemVariants} initial="hidden" animate="visible">
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-gradient-button text-white shadow-gold'
                                : 'text-pink-100/75 hover:bg-white/[0.07] hover:text-rose-50'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-colors ${
                                  isActive ? 'bg-white/20' : 'bg-white/[0.05] group-hover:bg-gold/25'
                                }`}
                              >
                                <Icon size={17} />
                              </span>
                              <span className="truncate">{t(item.key)}</span>
                            </>
                          )}
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-pink-300/60 hover:bg-red-900/20 hover:text-red-300 transition-all"
          >
            <LogOut size={19} />
            {t('logout')}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
