import React, { useState, useRef, useCallback } from 'react';
import { useCMS } from 'tinacms';

const CLUB_ABBREVIATIONS = [
  'BER', 'CDR', 'CJCR', 'DER', 'DVTR', 'GMER', 'HMDR', 'IDR', 'MCI',
  'MMC', 'OCCR', 'PBER', 'RORR', 'RRMC', 'SJER', 'SPER', 'STER', 'TCSMC', 'VFTR',
];

type Status = 'idle' | 'uploading' | 'success' | 'error';

interface Props {
  close(): void;
}

export function CsvUploaderScreen({ close }: Props) {
  const cms = useCMS();
  const [club, setClub] = useState('');
  const [series, setSeries] = useState('Enduro');
  const [year, setYear] = useState(new Date().getFullYear());
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      setErrorMsg('File must be a .csv');
      setFile(null);
      return;
    }
    setFile(f);
    setErrorMsg('');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = async () => {
    if (!club) { setErrorMsg('Please select a hosting club.'); return; }
    if (!file) { setErrorMsg('Please upload a CSV file.'); return; }

    // Build filename: YY-{en|hs}-{club}.csv  e.g. 26-en-sjer.csv
    const yy = String(year).slice(2);
    const seriesCode = series === 'Enduro' ? 'en' : 'hs';
    const filename = `${yy}-${seriesCode}-${club.toLowerCase()}.csv`;

    // Rename file to the convention the GitHub Action expects
    const renamedFile = new File([file], filename, { type: 'text/csv' });

    setStatus('uploading');
    setErrorMsg('');

    try {
      await cms.media.persist([{ directory: 'uploads/team-results', file: renamedFile }]);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Upload failed — check your connection and try again.');
    }
  };

  // ── Success state ────────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <h2 style={headingStyle}>Results uploaded</h2>
        <p style={subtextStyle}>
          GitHub is processing the file. The results page will update in 2–3 minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={() => { setStatus('idle'); setFile(null); setClub(''); }}
            style={primaryBtn}
          >
            Upload another
          </button>
          <button onClick={close} style={secondaryBtn}>Close</button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Upload Team Results</h2>
      <p style={subtextStyle}>
        Export a CSV from your scoring software and fill in the event details below.
        The site updates automatically — no technical steps required.
      </p>

      {/* Hosting Club */}
      <div style={fieldWrap}>
        <label style={labelStyle}>Hosting Club *</label>
        <select value={club} onChange={e => setClub(e.target.value)} style={selectStyle}>
          <option value="">— select —</option>
          {CLUB_ABBREVIATIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Series */}
      <div style={fieldWrap}>
        <label style={labelStyle}>Series *</label>
        <select value={series} onChange={e => setSeries(e.target.value)} style={selectStyle}>
          <option value="Enduro">Enduro</option>
          <option value="Hare Scramble">Hare Scramble</option>
        </select>
      </div>

      {/* Year */}
      <div style={fieldWrap}>
        <label style={labelStyle}>Year *</label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(parseInt(e.target.value, 10))}
          min={2020}
          max={2099}
          style={selectStyle}
        />
      </div>

      {/* CSV drop zone */}
      <div style={fieldWrap}>
        <label style={labelStyle}>Results CSV *</label>
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            ...dropZoneStyle,
            borderColor: isDragging ? '#3b82f6' : file ? '#22c55e' : '#d1d5db',
            background: isDragging ? '#eff6ff' : file ? '#f0fdf4' : '#f9fafb',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {file ? (
            <span style={{ color: '#15803d', fontWeight: 600, fontSize: 14 }}>
              📄 {file.name}
            </span>
          ) : (
            <span style={{ color: '#9ca3af', fontSize: 14 }}>
              Drop CSV here or <span style={{ color: '#3b82f6' }}>browse</span>
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
          Rows in finishing order (1st place first). Leave out host club teams and DNF/DQ.
          Columns: <code>team</code>, <code>club</code>, <code>epoints</code> (opt), <code>riders</code> (opt, semicolons).
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 12px' }}>{errorMsg}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={status === 'uploading'}
        style={{ ...primaryBtn, opacity: status === 'uploading' ? 0.6 : 1 }}
      >
        {status === 'uploading' ? 'Uploading…' : 'Upload Results'}
      </button>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  padding: '32px 36px',
  maxWidth: 520,
};

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: '#111827',
  margin: '0 0 8px',
};

const subtextStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
  margin: '0 0 24px',
  lineHeight: 1.5,
};

const fieldWrap: React.CSSProperties = {
  marginBottom: 18,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
};

const selectStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  color: '#111827',
  background: '#fff',
  boxSizing: 'border-box',
};

const dropZoneStyle: React.CSSProperties = {
  border: '2px dashed',
  borderRadius: 8,
  padding: '28px 16px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.15s, background 0.15s',
};

const primaryBtn: React.CSSProperties = {
  padding: '9px 22px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
  background: '#2563eb',
  color: '#fff',
};

const secondaryBtn: React.CSSProperties = {
  padding: '9px 22px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
  background: '#fff',
  color: '#374151',
};

// ── Upload icon (inline SVG for the screen plugin nav) ────────────────────────

export const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
