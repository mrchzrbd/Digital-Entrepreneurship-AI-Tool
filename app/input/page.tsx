'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Sparkles, X } from 'lucide-react';

const SAMPLE_DATA = `WhatsApp messages this week:
- Client 1: "When is my bouncy castle available for Aug 3? Need to confirm by tomorrow"
- Client 2: "The setup was late last Saturday, really affected our event start"
- Client 3: "Do you have something new for kids parties? Same options as last year"
- Client 4: "Can you do a discount if I book 3 dates?"
- Client 5: "Late again this week. Starting to reconsider."

Bookings this month: 14 total, 3 cancellations (2 cited timing issues)
Most booked: Classic bouncy castle (x8), Obstacle course (x4)
Revenue: €3,200. Top expense: fuel €480
Pending: buy a foam machine (€1,800 cost, 6 clients already asked)`;

export default function InputPage() {
  const { setCurrentResults, setCurrentInput, setIsAnalyzing, addToHistory } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<'text' | 'csv'>('text');
  const [text, setText] = useState('');
  const [csvData, setCsvData] = useState<string>('');
  const [csvFileName, setCsvFileName] = useState('');
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setCsvFileName(file.name);
    Papa.parse(file, {
      complete: (results) => {
        const rows = results.data as string[][];
        setCsvPreview(rows.slice(0, 6));
        const csvText = rows.map(r => r.join(', ')).join('\n');
        setCsvData(csvText);
      },
      skipEmptyLines: true,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'text/csv': ['.csv'] }, multiple: false,
  });

  async function handleAnalyze() {
    const inputToUse = tab === 'text' ? text : csvData;
    if (inputToUse.trim().length < 20) {
      setError('Please provide more data for a meaningful analysis.');
      return;
    }
    setError('');
    setIsLoading(true);
    setIsAnalyzing(true);
    setCurrentInput(inputToUse);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: inputToUse }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');

      setCurrentResults(json);
      addToHistory({
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        inputPreview: inputToUse.slice(0, 120) + '...',
        results: json,
        source: tab,
      });
      router.push('/insights');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  }

  const tabStyle = (active: boolean) => ({
    padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: active ? 600 : 400, transition: 'all 0.2s ease',
    background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
    color: active ? 'var(--accent-blue-bright)' : 'var(--text-secondary)',
    borderBottom: active ? '2px solid var(--accent-blue)' : '2px solid transparent',
  });

  return (
    <div style={{ padding: '48px 40px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease both' }}>
        <h1 className="font-display" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>
          Input Data
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Paste text or upload a CSV — the AI handles both.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        <button style={tabStyle(tab === 'text')} onClick={() => setTab('text')}>
          <FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Text / Messages
        </button>
        <button style={tabStyle(tab === 'csv')} onClick={() => setTab('csv')}>
          <Upload size={14} style={{ display: 'inline', marginRight: '6px' }} />
          CSV File
        </button>
      </div>

      {/* Text tab */}
      {tab === 'text' && (
        <div className="glass" style={{ padding: '28px', marginBottom: '20px', animation: 'fadeInUp 0.3s ease both' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={"Paste anything — WhatsApp messages, customer feedback, booking logs, emails, meeting notes...\n\nThe more context you provide, the sharper the insights."}
            style={{
              width: '100%', minHeight: '260px', padding: '16px',
              background: '#0A0F1A', border: '1px solid var(--border)',
              borderRadius: '12px', color: 'var(--text-primary)',
              fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.7, resize: 'vertical', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{text.length} characters</span>
              <button
                onClick={() => setText(SAMPLE_DATA)}
                style={{ fontSize: '12px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Try sample data
              </button>
            </div>
            {text && (
              <button onClick={() => setText('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSV tab */}
      {tab === 'csv' && (
        <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
          <div
            {...getRootProps()}
            className="glass"
            style={{
              padding: '48px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px',
              border: isDragActive ? '2px dashed var(--accent-blue)' : '2px dashed var(--border)',
              borderRadius: '16px', background: isDragActive ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)',
              transition: 'all 0.2s ease',
            }}
          >
            <input {...getInputProps()} />
            <Upload size={32} color={isDragActive ? 'var(--accent-blue)' : 'var(--text-muted)'} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', fontWeight: 600, color: isDragActive ? 'var(--accent-blue)' : 'var(--text-primary)', marginBottom: '6px' }}>
              {isDragActive ? 'Drop it here!' : 'Drag & drop your CSV'}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>or click to browse — .csv files only</p>
          </div>

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <div className="glass" style={{ padding: '20px', overflow: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <FileText size={16} color="var(--accent-green)" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-green)' }}>{csvFileName}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>Preview (first 5 rows)</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <tbody>
                  {csvPreview.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid var(--border)' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: '7px 10px', color: ri === 0 ? 'var(--accent-blue)' : 'var(--text-secondary)',
                          fontWeight: ri === 0 ? 600 : 400, whiteSpace: 'nowrap', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '13px', color: 'var(--accent-red)', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '16px 32px', borderRadius: '12px', border: 'none',
          background: isLoading ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #3B82F6, #6366F1)',
          color: 'white', fontSize: '16px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 20px rgba(59,130,246,0.3)', transition: 'all 0.2s ease',
        }}
      >
        <Sparkles size={18} />
        {isLoading ? 'Analyzing...' : 'Analyze with AI →'}
      </button>
    </div>
  );
}
