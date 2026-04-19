'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Target, Filter } from 'lucide-react';

const urgencyConfig = {
  high:   { color: 'var(--accent-red)',   bg: 'rgba(239,68,68,0.1)',   label: 'High'   },
  medium: { color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)', label: 'Medium' },
  low:    { color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)', label: 'Low'    },
};

export default function PrioritiesPage() {
  const { currentResults } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  if (!currentResults) {
    return (
      <div style={{ padding: '48px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No analysis yet.</p>
        <button onClick={() => router.push('/input')} style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--accent-blue)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}>Go to Input →</button>
      </div>
    );
  }

  const filtered = currentResults.priorities.filter(p => filter === 'all' || p.urgency === filter);
  const counts = {
    high:   currentResults.priorities.filter(p => p.urgency === 'high').length,
    medium: currentResults.priorities.filter(p => p.urgency === 'medium').length,
    low:    currentResults.priorities.filter(p => p.urgency === 'low').length,
  };

  const filterBtn = (val: typeof filter, label: string, color: string, count: number) => (
    <button
      onClick={() => setFilter(val)}
      style={{
        padding: '8px 16px', borderRadius: '8px', border: `1px solid ${filter === val ? color : 'var(--border)'}`,
        background: filter === val ? `${color}18` : 'transparent',
        color: filter === val ? color : 'var(--text-muted)',
        fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}
    >
      {label}
      <span style={{ fontSize: '11px', background: filter === val ? `${color}30` : 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '10px' }}>
        {count}
      </span>
    </button>
  );

  return (
    <div style={{ padding: '48px 40px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease both' }}>
        <h1 className="font-display" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Priority Ranking</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>What to focus on, ranked by urgency and business impact.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', alignItems: 'center', animation: 'fadeInUp 0.5s ease 0.1s both', flexWrap: 'wrap' }}>
        <Filter size={14} color="var(--text-muted)" />
        {filterBtn('all', 'All', 'var(--accent-blue)', currentResults.priorities.length)}
        {filterBtn('high', 'High', 'var(--accent-red)', counts.high)}
        {filterBtn('medium', 'Medium', 'var(--accent-amber)', counts.medium)}
        {filterBtn('low', 'Low', 'var(--accent-green)', counts.low)}
      </div>

      {/* Priority cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeInUp 0.5s ease 0.15s both' }}>
        {filtered.map((p, i) => {
          const cfg = urgencyConfig[p.urgency];
          return (
            <div
              key={i}
              className="glass"
              style={{
                padding: '24px 28px', display: 'flex', gap: '20px', alignItems: 'flex-start',
                borderLeft: `4px solid ${cfg.color}`, transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)'; }}
            >
              <div className="font-display" style={{ fontSize: '40px', fontWeight: 800, color: cfg.color, lineHeight: 1, minWidth: '48px', opacity: 0.7 }}>
                {p.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.item}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                    color: cfg.color, background: cfg.bg, padding: '3px 8px', borderRadius: '6px',
                  }}>
                    {cfg.label} Urgency
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.impact}</p>
              </div>
              <Target size={18} color={cfg.color} style={{ flexShrink: 0, opacity: 0.6, marginTop: '4px' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
