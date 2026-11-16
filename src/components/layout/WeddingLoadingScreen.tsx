import React, { useEffect, useState } from 'react';

interface WeddingLoadingScreenProps {
  onComplete: () => void;
}

export const WeddingLoadingScreen: React.FC<WeddingLoadingScreenProps> = ({ onComplete }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setIsLeaving(true), 1700);
    const completeTimer = window.setTimeout(onComplete, 2250);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`wedding-loading-screen${isLeaving ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="wedding-loading-screen__content">
        <span className="wedding-loading-screen__om" aria-hidden="true">ॐ</span>
        <span className="wedding-loading-screen__divider" aria-hidden="true">✦</span>
        <h1 className="wedding-loading-screen__names">C. Vignesh <span>&amp;</span> S. Pavithra</h1>
        <p className="wedding-loading-screen__subtitle">VIVAHA MAHOTSAVAM</p>
        <div className="wedding-loading-screen__lamp" aria-hidden="true">
          <span />
        </div>
        <p className="wedding-loading-screen__message">Lighting the lamps…</p>
      </div>
    </div>
  );
};
