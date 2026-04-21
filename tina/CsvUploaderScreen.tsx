import React, { useState, useRef, useCallback } from 'react';
import { useCMS } from 'tinacms';

const CLUB_ABBREVIATIONS = [
  'BER', 'CDR', 'CJCR', 'DER', 'DVTR', 'GMER', 'HMDR', 'IDR', 'MCI',
  'MMC', 'OCCR', 'PBER', 'RORR', 'RRMC', 'SJER', 'SPER', 'STER', 'TCSMC', 'VFTR',
];

const CURRENT_YEAR = new Date().getFullYear();

type Status = 'idle' | 'uploading' | 'success' | 'error';

interface Entry {
  id: string;
  file: File;
  club: string;
  series: string;
  year: number;
}

interface Props {
  close(): void;
}

export function CsvUploaderScreen({ close }: Props) {
  const cms = useCMS();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: File[]) => {
    const csvs = files.filter(f => f.name.endsWith('.csv'));
    if (csvs.length === 0) { setErrorMsg('Only .csv files are accepted.'); return; }
    setErrorMsg('');
    setEntries(prev => [
      ...prev,
      ...csvs.map(f => ({
        id: Math.random().toString(36).slice(2),
        file: f,
        club: '',
        series: 'Enduro',
        year: CURRENT_YEAR,
      })),
    ]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, []);

  const updateEntry = (id: string, patch: Partial<Entry>) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));

  const removeEntry = (id: string) =>
    setEntries(prev => prev.filter(e => e.id !== id));

  const handleSubmit = async () => {
    if (entries.length === 0) { setErrorMsg('Add at least one CSV file.'); return; }
    const missing = entries.find(e => !e.club);
    if (missing) { setErrorMsg('Please select a hosting club for every event.'); return; }

    setStatus('uploading');
    setErrorMsg('');

    try {
      const mediaFiles = entries.map(e => {
        const yy = String(e.year).slice(2);
        const seriesCode = e.series === 'Enduro' ? 'en' : 'hs';
        const filename = `${yy}-${seriesCode}-${e.club.toLowerCase()}.csv`;
        return { directory: 'uploads/team-results', file: new File([e.file], filename, { type: 'text/csv' }) };
      });
      await cms.media.persist(mediaFiles);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Upload failed — check your connection and try again.');
    }
  };

  // ── Success ───────────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <h2 style={headingStyle}>{entries.length === 1 ? 'Results uploaded' : `${entries.length} events uploaded`}</h2>
        <p style={subtextStyle}>GitHub is processing the files. Results pages will update in 2–3 minutes.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={() => { setStatus('idle'); setEntries([]); }} style={primaryBtn}>Upload more</button>
          <button onClick={close} style={secondaryBtn}>Close</button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Upload Team Results</h2>
      <p style={subtextStyle}>
        Drop one or more CSV files — one per event. Fill in the event details for each.
        The site updates automatically in 2–3 minutes.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          ...dropZoneStyle,
          borderColor: isDragging ? '#3b82f6' : '#d1d5db',
          background: isDragging ? '#eff6ff' : '#f9fafb',
          marginBottom: 20,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files) addFiles(Array.from(e.target.files)); }}
        />
        <span style={{ color: '#9ca3af', fontSize: 14 }}>
          Drop CSV files here or <span style={{ color: '#3b82f6' }}>browse</span>
        </span>
      </div>

      {/* Entry list */}
      {entries.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {entries.map((entry, i) => (
            <div key={entry.id} style={entryRow}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>📄 {entry.file.name}</span>
                <button onClick={() => removeEntry(entry.id)} style={removeBtn} title="Remove">✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 8 }}>
                <div>
                  <label style={labelStyle}>Hosting Club *</label>
                  <select value={entry.club} onChange={e => updateEntry(entry.id, { club: e.target.value })} style={selectStyle}>
                    <option value="">— select —</option>
                    {CLUB_ABBREVIATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Series *</label>
                  <select value={entry.series} onChange={e => updateEntry(entry.id, { series: e.target.value })} style={selectStyle}>
                    <option value="Enduro">Enduro</option>
                    <option value="Hare Scramble">Hare Scramble</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Year *</label>
                  <input
                    type="number"
                    value={entry.year}
                    onChange={e => updateEntry(entry.id, { year: parseInt(e.target.value, 10) })}
                    min={2020}
                    max={2099}
                    style={selectStyle}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {errorMsg && <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 12px' }}>{errorMsg}</p>}

      <button
        onClick={handleSubmit}
        disabled={status === 'uploading' || entries.length === 0}
        style={{ ...primaryBtn, opacity: (status === 'uploading' || entries.length === 0) ? 0.6 : 1 }}
      >
        {status === 'uploading'
          ? 'Uploading…'
          : entries.length === 0
            ? 'Upload Results'
            : entries.length === 1
              ? 'Upload 1 Event'
              : `Upload ${entries.length} Events`}
      </button>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = { padding: '32px 36px', maxWidth: 580 };

const headingStyle: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' };

const subtextStyle: React.CSSProperties = { fontSize: 14, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.5 };

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };

const selectStyle: React.CSSProperties = { display: 'block', width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, color: '#111827', background: '#fff', boxSizing: 'border-box' };

const dropZoneStyle: React.CSSProperties = { border: '2px dashed', borderRadius: 8, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' };

const entryRow: React.CSSProperties = { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 10 };

const primaryBtn: React.CSSProperties = { padding: '9px 22px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: '#2563eb', color: '#fff' };

const secondaryBtn: React.CSSProperties = { padding: '9px 22px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: '#fff', color: '#374151' };

const removeBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 14, padding: '0 2px', lineHeight: 1 };

// ── Upload icon ───────────────────────────────────────────────────────────────

export const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
