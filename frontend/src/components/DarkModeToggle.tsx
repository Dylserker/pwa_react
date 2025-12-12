import React, { useEffect, useState } from 'react';

export const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('dark-mode');
    if (stored !== null) return stored === 'true';
    // Préférence système
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', String(dark));
  }, [dark]);

  return (
    <button onClick={() => setDark((d) => !d)} className="dark-toggle-btn">
      {dark ? '🌙 Mode sombre' : '☀️ Mode clair'}
    </button>
  );
};
