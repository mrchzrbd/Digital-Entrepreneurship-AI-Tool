'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Upload, Lightbulb, Target,
  Zap, Clock, MessageSquare, Zap as Logo
} from 'lucide-react';

const navItems = [
  { href: '/',          icon: LayoutDashboard, label: 'Dashboard'   },
  { href: '/input',     icon: Upload,          label: 'Input Data'  },
  { href: '/insights',  icon: Lightbulb,       label: 'Insights'    },
  { href: '/priorities',icon: Target,          label: 'Priorities'  },
  { href: '/actions',   icon: Zap,             label: 'Actions'     },
  { href: '/history',   icon: Clock,           label: 'History'     },
  { href: '/chat',      icon: MessageSquare,   label: 'AI Chat'     },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentResults, history } = useApp();

  return (
    <aside style={{
      width: '220px', minHeight: '100vh', flexShrink: 0,
      background: 'rgba(8,12,20,0.95)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Logo size={18} color="white" fill="white" />
          </div>
          <span className="font-display" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Copilot
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          const needsData = ['/insights', '/priorities', '/actions', '/chat'].includes(href);
          const disabled = needsData && !currentResults;
          return (
            <Link
              key={href}
              href={disabled ? '#' : href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
                background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                border: active ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                color: active ? 'var(--accent-blue-bright)' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
                fontSize: '14px', fontWeight: active ? 600 : 400,
                transition: 'all 0.15s ease',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!disabled && !active) (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
            >
              <Icon size={16} />
              {label}
              {label === 'History' && history.length > 0 && (
                <span style={{
                  marginLeft: 'auto', fontSize: '11px', fontWeight: 700,
                  background: 'rgba(59,130,246,0.2)', color: 'var(--accent-blue)',
                  padding: '1px 7px', borderRadius: '10px',
                }}>{history.length}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          padding: '10px 12px', borderRadius: '10px',
          background: currentResults ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${currentResults ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: currentResults ? 'var(--accent-green)' : 'var(--text-muted)',
            }} />
            <span style={{ fontSize: '12px', color: currentResults ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 500 }}>
              {currentResults ? 'Analysis ready' : 'No data yet'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
