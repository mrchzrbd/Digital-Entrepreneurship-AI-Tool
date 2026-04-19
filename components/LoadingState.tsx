'use client';

import { useEffect, useState } from 'react';

const steps = [
  { emoji: '📥', label: 'Aggregating data sources' },
  { emoji: '🔍', label: 'Extracting patterns & signals' },
  { emoji: '⚡', label: 'Ranking by priority & impact' },
  { emoji: '🎯', label: 'Generating action recommendations' },
];

export default function LoadingState() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= steps.length) { clearInterval(stepTimer); return prev; }
        return prev + 1;
      });
    }, 900);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) { clearInterval(progressTimer); return prev; }
        return prev + 2;
      });
    }, 80);

    return () => { clearInterval(stepTimer); clearInterval(progressTimer); };
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <div
        className="glass"
        style={{ padding: '48px 40px', textAlign: 'center' }}
      >
        {/* Pulsing orb */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            margin: '0 auto 28px',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />

        <h3
          className="font-display"
          style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}
        >
          Analyzing your data...
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '36px' }}>
          The AI is processing your inputs
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: i < visibleSteps ? 'rgba(59,130,246,0.08)' : 'transparent',
                border: i < visibleSteps ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                opacity: i < visibleSteps ? 1 : 0.3,
                transition: 'all 0.4s ease',
              }}
            >
              <span style={{ fontSize: '18px' }}>{step.emoji}</span>
              <span style={{ fontSize: '14px', color: i < visibleSteps ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {step.label}
              </span>
              {i < visibleSteps && (
                <span style={{ marginLeft: 'auto', color: 'var(--accent-green)', fontSize: '16px' }}>✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '4px',
            borderRadius: '2px',
            background: 'var(--border)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
              width: `${progress}%`,
              transition: 'width 0.08s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
