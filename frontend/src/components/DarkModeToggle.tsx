import React, { useEffect, useState } from 'react';

export const DarkModeToggle: React.FC = () => {
  const getInitial = () => {
    const stored = localStorage.getItem('dark-mode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const [dark, setDark] = useState(getInitial);

  // Appliquer le mode dès le premier rendu (même sans interaction)
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', String(dark));
  }, [dark]);

  useEffect(() => {
    // Appliquer le mode dès le premier rendu (corrige le flash blanc)
    if (getInitial()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <button onClick={() => setDark((d) => !d)} className="dark-toggle-btn">
      {dark ? '🌙 Mode sombre' : '☀️ Mode clair'}
    </button>
  );
};
