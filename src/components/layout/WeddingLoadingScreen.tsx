import React, { useEffect, useState } from 'react';

interface WeddingLoadingScreenProps {
  onComplete: () => void;
}

const WELCOME_MESSAGES = [
  'Welcome the divine.',
  'A celebration blessed with love.',
  'May joy and blessings fill this day.',
];

export const WeddingLoadingScreen: React.FC<WeddingLoadingScreenProps> = ({ onComplete }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setIsLeaving(true), 1700);
    const completeTimer = window.setTimeout(onComplete, 2250);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % WELCOME_MESSAGES.length);
    }, 750);

    return () => window.clearInterval(messageTimer);
  }, []);

  return (
    <div
      className={`wedding-loading-screen${isLeaving ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="wedding-loading-screen__ornaments" aria-hidden="true">
        <span className="wedding-loading-screen__petal wedding-loading-screen__petal--one">✦</span>
        <span className="wedding-loading-screen__petal wedding-loading-screen__petal--two">✧</span>
        <span className="wedding-loading-screen__petal wedding-loading-screen__petal--three">✦</span>
        <span className="wedding-loading-screen__petal wedding-loading-screen__petal--four">✧</span>
      </div>
      <div className="wedding-loading-screen__content">
        <span className="wedding-loading-screen__om" aria-hidden="true">ॐ</span>
        <p className="wedding-loading-screen__eyebrow">You are warmly invited</p>
        <span className="wedding-loading-screen__divider" aria-hidden="true">✦</span>
        <h1 className="wedding-loading-screen__names">
          <span>C. Vignesh</span> <span className="wedding-loading-screen__amp">&amp;</span>{' '}
          <span>S. Pavithra</span>
        </h1>
        <p className="wedding-loading-screen__subtitle">VIVAHA MAHOTSAVAM</p>
        <p className="wedding-loading-screen__date">14 December 2026 <span>•</span> Ooty &amp; Madurai</p>
        <p key={messageIndex} className="wedding-loading-screen__message" aria-live="off">
          {WELCOME_MESSAGES[messageIndex]}
        </p>
        <div className="wedding-loading-screen__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
};
