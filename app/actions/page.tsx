'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, Zap, Clock, Download } from 'lucide-react';

export default function ActionsPage() {
  const { currentResults } = useApp();
  const router = useRouter();
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  if (!currentResults) {
    return (
      <div style={{ padding: '48px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No analysis yet.</p>
        <button onClick={() => router.push('/input')} style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--accent-blue)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}>Go to Input →</button>
      </div>
    );
  }

  const results = currentResults;

  const toggle = (i: number) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
  const doneCount = checked.filter(Boolean).length;

  function exportActions() {
    const lines = [
      'ACTION PLAN — AI Entrepreneur Copilot',
      '======================================',
      '',
      ...results.actions.map((a, i) => [
        `${checked[i] ? '✅' : '⬜'} Action ${i + 1}: ${a.action}`,
        `   Why: ${a.why}`,
        `   When: ${a.timeframe}`,
        '',
      ].join('\n')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'action-plan.txt';
    a.click();
  }

  const timeframeColor = (tf: string) => {
    if (tf.toLowerCase().includes('today') || tf.toLowerCase().includes('immediate')) return 'var(--accent-red)';
    if (tf.toLowerCase().includes('week')) return 'var(--accent-amber)';
    return 'var(--accent-green)';
  };

  return (
    <div style={{ padding: '48px 40px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', animation: 'fadeInUp 0.5s ease both', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Action Tracker</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Your AI-recommended next steps. Check them off as you go.</p>
        </div>
        <button onClick={exportActions} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
          <Download size={14} /> Export Plan
        </button>
      </div>

      {/* Progress bar */}
      <div className="glass" style={{ padding: '20px 24px', marginBottom: '28px', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Progress</span>
          <span className="font-display" style={{ fontSize: '14px', fontWeight: 700, color: doneCount === checked.length ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
            {doneCount}/{checked.length} done
          </span>
        </div>
        <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '4px',
            background: doneCount === checked.length ? 'var(--accent-green)' : 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            width: `${(doneCount / checked.length) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
        {doneCount === checked.length && (
          <p style={{ fontSize: '13px', color: 'var(--accent-green)', marginTop: '10px', fontWeight: 600 }}>
            🎉 All actions completed! Run a new analysis for the next batch.
          </p>
        )}
      </div>

      {/* Action cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeInUp 0.5s ease 0.15s both' }}>
        {currentResults.actions.map((action, i) => (
          <div
            key={i}
            className="glass"
            style={{
              padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start',
              opacity: checked[i] ? 0.55 : 1, transition: 'all 0.3s ease',
              borderLeft: `3px solid ${checked[i] ? 'var(--accent-green)' : 'rgba(59,130,246,0.4)'}`,
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0, marginTop: '2px' }}
            >
              {checked[i]
                ? <CheckCircle size={22} color="var(--accent-green)" />
                : <Circle size={22} color="var(--text-muted)" />
              }
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <p style={{
                  fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)',
                  textDecoration: checked[i] ? 'line-through' : 'none',
                }}>
                  {action.action}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <Clock size={12} color={timeframeColor(action.timeframe)} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: timeframeColor(action.timeframe) }}>{action.timeframe}</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Why: </span>{action.why}
              </p>
            </div>
            <span className="font-display" style={{ fontSize: '28px', fontWeight: 800, color: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
