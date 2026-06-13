import React from 'react';

// =============================================================================
// Date Picker Field
// =============================================================================

/**
 * Native HTML date picker — replaces TinaCMS's datetime field which always
 * pre-fills with today and has no clear button. This starts empty, shows a
 * calendar on click, and can be cleared natively.
 *
 * The schema type stays 'datetime' (ISO string) for TinaCloud compatibility.
 * This component converts: ISO datetime ↔ YYYY-MM-DD for the picker display.
 */
export const DatePickerField = ({
  input,
  field,
}: {
  input: { name: string; value: string; onChange: (v: string) => void };
  field: { label: string; description?: string; required?: boolean };
}) => (
  <div style={{ marginBottom: 16 }}>
    <label
      htmlFor={input.name}
      style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}
    >
      {field.label}
      {field.required && <span style={{ color: '#dc2626' }}> *</span>}
    </label>
    <input
      id={input.name}
      type="date"
      value={input.value ? input.value.slice(0, 10) : ''}
      onChange={(e) => input.onChange(e.target.value ? e.target.value + 'T00:00:00.000Z' : '')}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 14,
        color: '#111827',
        background: '#fff',
        boxSizing: 'border-box',
      }}
    />
    {field.description && (
      <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{field.description}</p>
    )}
  </div>
);

// =============================================================================
// Time Picker Field
// =============================================================================

/**
 * Native HTML time picker — replaces free-text time entry with a browser
 * time picker. Stores values as "H:MM AM/PM" to match the existing format.
 * Converts to/from 24-hour HH:MM for the <input type="time"> value.
 */
function to24h(val: string): string {
  if (!val) return '';
  const m = val.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return '';
  let h = parseInt(m[1], 10);
  const min = m[2];
  const period = m[3].toUpperCase();
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${min}`;
}

function to12h(val: string): string {
  if (!val) return '';
  const [hStr, min] = val.split(':');
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  if (h > 12) h -= 12;
  return `${h}:${min} ${period}`;
}

export const TimePickerField = ({
  input,
  field,
}: {
  input: { name: string; value: string; onChange: (v: string) => void };
  field: { label: string; description?: string; required?: boolean };
}) => (
  <div style={{ marginBottom: 16 }}>
    <label
      htmlFor={input.name}
      style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}
    >
      {field.label}
      {field.required && <span style={{ color: '#dc2626' }}> *</span>}
    </label>
    <input
      id={input.name}
      type="time"
      value={to24h(input.value)}
      onChange={(e) => input.onChange(e.target.value ? to12h(e.target.value) : '')}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 14,
        color: '#111827',
        background: '#fff',
        boxSizing: 'border-box',
      }}
    />
    {field.description && (
      <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{field.description}</p>
    )}
  </div>
);

// =============================================================================
// Enduro-Only Toggle
// =============================================================================

/**
 * Returns a boolean toggle that only renders when the current event's
 * eventType is 'Enduro'. Used for closedCourse and gasAway.
 */
export function endurosOnlyToggle(label: string, description: string) {
  return function EndurosOnlyField({
    input,
    form,
  }: {
    input: { name: string; value: boolean; onChange: (v: boolean) => void };
    form: any;
  }) {
    const eventType = form?.getState?.()?.values?.eventType;
    if (eventType !== 'Enduro') return null;
    return (
      <div style={{ margin: '8px 0' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            name={input.name}
            checked={!!input.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => input.onChange(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        </label>
        {description && (
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4, marginLeft: 24 }}>{description}</p>
        )}
      </div>
    );
  };
}
