'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Send, MessageSquare, Bot, User } from 'lucide-react';
import { ChatMessage } from '@/types';

const SUGGESTED = [
  "What is the biggest risk in this data?",
  "Should I invest in the foam machine?",
  "What should I do about the negative reviews?",
  "How do I improve my Google rating?",
];

export default function ChatPage() {
  const { currentResults } = useApp();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentResults) {
    return (
      <div style={{ padding: '48px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Run an analysis first to unlock the chat.</p>
        <button onClick={() => router.push('/input')} style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--accent-blue)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}>Go to Input →</button>
      </div>
    );
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: JSON.stringify(currentResults),
        }),
      });
      const json = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: json.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 0px)', padding: '0' }}>
      {/* Header */}
      <div style={{ padding: '32px 40px 20px', borderBottom: '1px solid var(--border)', animation: 'fadeInUp 0.5s ease both' }}>
        <h1 className="font-display" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-1px' }}>AI Chat</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Ask follow-up questions about your analysis.</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <div style={{ animation: 'fadeInUp 0.5s ease both' }}>
            <div className="glass" style={{ padding: '28px', textAlign: 'center', marginBottom: '24px' }}>
              <Bot size={32} color="var(--accent-blue)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Ask me anything about your data</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>I have full context of your analysis and can answer specific business questions.</p>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px' }}>SUGGESTED QUESTIONS</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {SUGGESTED.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '12px 16px', borderRadius: '10px', textAlign: 'left', fontSize: '13px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeInUp 0.3s ease both' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="white" />
              </div>
            )}
            <div style={{
              maxWidth: '72%', padding: '14px 18px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : 'var(--bg-card)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.7,
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color="var(--text-secondary)" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ padding: '14px 18px', borderRadius: '4px 16px 16px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-blue)', animation: `pulse-glow 1.2s ease ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 40px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Ask a follow-up question..."
            style={{
              flex: 1, padding: '14px 18px', borderRadius: '12px', background: '#0A0F1A',
              border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            style={{
              width: '48px', height: '48px', borderRadius: '12px', border: 'none',
              background: input.trim() ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : 'rgba(255,255,255,0.05)',
              color: 'white', cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
