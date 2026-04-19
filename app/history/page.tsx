'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Clock, FileText, Upload, Trash2, RotateCcw } from 'lucide-react';

export default function HistoryPage() {
  const { history, clearHistory, setCurrentResults, setCurrentInput } = useApp();
  const router = useRouter();

  function loadEntry(id: string) {
    const entry = history.find(h => h.id === id);
    if (!entry) return;
    setCurrentResults(entry.results);
    setCurrentInput(entry.inputPreview);
    router.push('/insights');
  }

  return (
    <div style={{ padding: '48px 40px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', animation: 'fadeInUp 0.5s ease both', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Analysis History</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{history.length} saved {history.length === 1 ? 'analysis' : 'analyses'}</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--accent-red)', fontSize: '13px', cursor: 'pointer' }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass" style={{ padding: '48px', textAlign: 'center' }}>
          <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No analyses saved yet.</p>
          <button onClick={() => router.push('/input')} style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--accent-blue)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}>
            Run your first analysis →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
          {history.map((entry, i) => (
            <div key={entry.id} className="glass" style={{ padding: '20px 24px', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {entry.source === 'csv'
                        ? <Upload size={13} color="var(--accent-green)" />
                        : <FileText size={13} color="var(--accent-blue)" />
                      }
                      <span style={{ fontSize: '11px', fontWeight: 700, color: entry.source === 'csv' ? 'var(--accent-green)' : 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {entry.source === 'csv' ? 'CSV' : 'Text'}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{entry.date}</span>
                    {i === 0 && (
                      <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)', padding: '2px 7px', borderRadius: '10px' }}>LATEST</span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {entry.results.topSignal}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{entry.inputPreview}</p>
                </div>
                <button
                  onClick={() => loadEntry(entry.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                >
                  <RotateCcw size={13} /> Load
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
