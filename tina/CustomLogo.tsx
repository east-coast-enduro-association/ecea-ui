import React from 'react';

/**
 * Custom ECEA Logo component for TinaCMS admin sidebar
 */
export const CustomLogo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
    }}>
      <img
        src="/images/ecea-logo.jpg"
        alt="ECEA Logo"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.2',
      }}>
        <span style={{
          fontWeight: 700,
          fontSize: '14px',
          color: '#1f2937',
        }}>
          ECEA
        </span>
        <span style={{
          fontSize: '11px',
          color: '#6b7280',
        }}>
          Content Manager
        </span>
      </div>
    </div>
  );
};

export default CustomLogo;
