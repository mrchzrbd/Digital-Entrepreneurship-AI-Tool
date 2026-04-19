'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Lightbulb, Radio, TrendingUp } from 'lucide-react';

const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export default function InsightsPage() {
  const { currentResults } = useApp();
  const router = useRouter();

  if (!currentResults) {
    return (
      <div style={{ padding: '48px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No analysis yet.</p>
        <button onClick={() => router.push('/input')} style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--accent-blue)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}>
          Go to Input →
        </button>
      </div>
    );
  }

  const barData = currentResults.insights.map((ins, i) => ({
    name: ins.title.length > 18 ? ins.title.slice(0, 18) + '…' : ins.title,
    mentions: parseInt(ins.frequency.match(/\d+/)?.[0] || String(currentResults.insights.length - i)),
    full: ins.title,
  }));

  const pieData = currentResults.priorities.map((p, i) => ({
    name: p.item.length > 20 ? p.item.slice(0, 20) + '…' : p.item,
    value: currentResults.priorities.length - p.rank + 1,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { full?: string; name?: string }; value?: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#0F1623', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{payload[0].payload.full || payload[0].payload.name}</p>
          <p style={{ fontSize: '12px', color: 'var(--accent-blue)' }}>Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '48px 40px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '36px', animation: 'fadeInUp 0.5s ease both' }}>
        <h1 className="font-display" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>
          Insights
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Patterns and signals extracted from your data.</p>
      </div>

      {/* Top Signal */}
      <div className="glass glow-border" style={{ padding: '24px 28px', marginBottom: '28px', animation: 'fadeInUp 0.5s ease 0.05s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Radio size={20} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'var(--accent-blue)', marginBottom: '4px' }}>TOP SIGNAL</p>
            <p className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentResults.topSignal}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="glass" style={{ padding: '24px', marginBottom: '28px', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{currentResults.summary}</p>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px', animation: 'fadeInUp 0.5s ease 0.15s both' }}>

        {/* Bar chart */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp size={16} color="var(--accent-blue)" />
            <span className="font-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Insight Frequency</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mentions" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Lightbulb size={16} color="var(--accent-amber)" />
            <span className="font-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Priority Distribution</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeInUp 0.5s ease 0.2s both' }}>
        <h2 className="font-display" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>All Insights</h2>
        {currentResults.insights.map((insight, i) => (
          <div key={i} className="glass" style={{ padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${CHART_COLORS[i % CHART_COLORS.length]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="font-display" style={{ fontSize: '14px', fontWeight: 800, color: CHART_COLORS[i % CHART_COLORS.length] }}>{i + 1}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{insight.title}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.6 }}>{insight.detail}</p>
              <span style={{ fontSize: '11px', fontWeight: 600, color: CHART_COLORS[i % CHART_COLORS.length], background: `${CHART_COLORS[i % CHART_COLORS.length]}18`, padding: '2px 8px', borderRadius: '10px' }}>
                {insight.frequency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
