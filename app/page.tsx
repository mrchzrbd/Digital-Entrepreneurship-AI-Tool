'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Upload, Lightbulb, Target, Zap, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { currentResults, history } = useApp();
  const router = useRouter();

  const stats = [
    {
      label: 'Analyses Run',
      value: history.length,
      icon: <TrendingUp size={18} />,
      color: 'var(--accent-blue)',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Insights Found',
      value: currentResults ? currentResults.insights.length : '—',
      icon: <Lightbulb size={18} />,
      color: 'var(--accent-amber)',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'High Priority Items',
      value: currentResults ? currentResults.priorities.filter(p => p.urgency === 'high').length : '—',
      icon: <AlertTriangle size={18} />,
      color: 'var(--accent-red)',
      bg: 'rgba(239,68,68,0.1)',
    },
    {
      label: 'Actions Generated',
      value: currentResults ? currentResults.actions.length : '—',
      icon: <CheckCircle size={18} />,
      color: 'var(--accent-green)',
      bg: 'rgba(16,185,129,0.1)',
    },
  ];

  const quickLinks = [
    { href: '/input',      icon: <Upload size={20} />,     label: 'Upload Data',     desc: 'Paste text or upload a CSV file',        color: '#3B82F6' },
    { href: '/insights',   icon: <Lightbulb size={20} />,  label: 'View Insights',   desc: 'Patterns and signals from your data',    color: '#F59E0B' },
    { href: '/priorities', icon: <Target size={20} />,     label: 'Priorities',      desc: 'What to focus on, ranked by impact',     color: '#8B5CF6' },
    { href: '/actions',    icon: <Zap size={20} />,        label: 'Action Tracker',  desc: 'Next steps with completion tracking',    color: '#10B981' },
    { href: '/history',    icon: <Clock size={20} />,      label: 'History',         desc: 'All your past analyses saved',           color: '#6366F1' },
    { href: '/chat',       icon: <Zap size={20} />,        label: 'AI Chat',         desc: 'Ask follow-up questions about your data', color: '#EC4899' },
  ];

  return (
    <div style={{ padding: '48px 40px', maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px', animation: 'fadeInUp 0.5s ease both' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 12px', borderRadius: '20px', marginBottom: '16px',
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'var(--accent-blue)' }}>
            ENTREPRENEUR COPILOT
          </span>
        </div>
        <h1 className="font-display" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>
          {currentResults ? 'Welcome back 👋' : 'Get started →'}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
          {currentResults
            ? 'Your latest analysis is ready. Explore the sections below.'
            : 'Upload your first dataset to unlock all features.'}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div className="font-display" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Current top signal */}
      {currentResults && (
        <div className="glass glow-border" style={{ padding: '24px 28px', marginBottom: '40px', animation: 'fadeInUp 0.5s ease 0.15s both' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: 'var(--accent-blue)', marginBottom: '8px' }}>LATEST TOP SIGNAL</p>
          <p className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentResults.topSignal}
          </p>
        </div>
      )}

      {/* Quick links */}
      <div style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>
        <h2 className="font-display" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Navigate
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {quickLinks.map((link, i) => (
            <div
              key={i}
              onClick={() => router.push(link.href)}
              className="glass"
              style={{
                padding: '20px', borderRadius: '14px', cursor: 'pointer',
                transition: 'all 0.2s ease', borderLeft: `3px solid ${link.color}`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ color: link.color, marginBottom: '10px' }}>{link.icon}</div>
              <div className="font-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{link.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{link.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
