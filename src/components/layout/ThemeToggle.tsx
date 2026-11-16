import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => (
  <button
    type="button"
    role="switch"
    aria-checked={isDark}
    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    onClick={onToggle}
    className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'}`}
  >
    <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
      <Sun />
    </span>
    <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
      <Moon />
    </span>
    <span className="theme-toggle__thumb" aria-hidden="true" />
  </button>
);
