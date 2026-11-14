import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Send, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { GoldDivider } from '../ui/TraditionalBorders';

interface PlantBlessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlessingSubmitted?: () => void;
}

export const PlantBlessingModal: React.FC<PlantBlessingModalProps> = ({
  isOpen,
  onClose,
  onBlessingSubmitted,
}) => {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = guestName.trim();
    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }

    const trimmedMsg = message.trim();
    if (!trimmedMsg) {
      setError('Please write a heartfelt blessing or message for the couple.');
      return;
    }

    if (trimmedMsg.length > 500) {
      setError('Blessing message cannot exceed 500 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/blessings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: trimmedName,
          message: trimmedMsg,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit blessing. Please try again.');
      }

      // Celebrate submission
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#C49A58', '#98502F', '#FFFDF9', '#E5D8C4'],
      });

      setSuccess(true);
      if (onBlessingSubmitted) {
        onBlessingSubmitted();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to connect to the blessing server. Please check your connection.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setMessage('');
    setGuestName('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#45352A]/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] border-2 border-[#C49A58] rounded-3xl p-4 sm:p-8 shadow-2xl text-[#45352A] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-[#766B60] hover:text-[#98502F] rounded-full hover:bg-[#FAF5EC] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAF5EC] border-2 border-[#C49A58] flex items-center justify-center text-[#98502F]">
              <Sparkles className="w-8 h-8 text-[#C49A58]" />
            </div>

            <h3 className="font-serif-royal text-2xl font-bold text-[#45352A] mb-2">
              Blessing Received with Joy!
            </h3>

            <p className="font-cormorant text-lg text-[#766B60] max-w-md mx-auto mb-5 leading-relaxed">
              Thank you for showering your heartfelt love on Vignesh &amp; Pavithra. Your blessing is now live on the Sacred Blessings Wall.
            </p>

            <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E5D8C4] text-xs text-[#766B60] flex items-center justify-center space-x-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-[#C49A58]" />
              <span>Your blessing is saved and visible to everyone.</span>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-gradient-to-r from-[#98502F] to-[#C49A58] text-white font-serif-royal text-xs font-semibold rounded-full shadow-md hover:brightness-105 transition-all"
            >
              Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-5">
              <span className="text-[11px] font-serif-royal uppercase tracking-widest text-[#98502F]">
                An Auspicious Offering
              </span>
              <h3 className="font-serif-royal text-2xl font-bold text-[#45352A] mt-1">
                Post Your Blessings
              </h3>
              <p className="text-xs text-[#766B60] mt-1 font-cormorant text-base">
                Add your heartfelt wishes to Vignesh &amp; Pavithra&apos;s digital wedding keepsake.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Guest Name */}
            <div className="mb-4">
              <div className="mb-1">
                <label htmlFor="guest-name" className="text-xs font-serif-royal font-semibold text-[#45352A]">
                  Your Name *
                </label>
              </div>
              <input
                id="guest-name"
                type="text"
                required
                placeholder="e.g. Ramesh Uncle / Anita from Ooty"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                maxLength={80}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8C4] bg-[#FAF5EC] text-xs text-[#45352A] placeholder-[#766B60]/60 focus:outline-none focus:ring-2 focus:ring-[#C49A58]"
              />
            </div>

            {/* Blessing Message */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="blessing-message" className="text-xs font-serif-royal font-semibold text-[#45352A]">
                  Your Blessing Message *
                </label>
                <span className={`text-[11px] ${message.length > 480 ? 'text-amber-600 font-semibold' : 'text-[#766B60]'}`}>
                  {message.length}/500
                </span>
              </div>
              <textarea
                id="blessing-message"
                rows={4}
                required
                maxLength={500}
                placeholder="Write a blessing, a wish, a prayer or a little piece of advice for the couple…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8C4] bg-[#FAF5EC] text-xs sm:text-sm text-[#45352A] placeholder-[#766B60]/60 focus:outline-none focus:ring-2 focus:ring-[#C49A58] resize-none"
              />
            </div>

            <div className="text-[11px] text-[#766B60] mb-5 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C49A58] shrink-0" />
              <span>Your blessing appears on the wall as soon as it is posted.</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#98502F] via-[#B87333] to-[#C49A58] hover:brightness-105 active:scale-98 text-white rounded-xl font-serif-royal text-sm font-semibold shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Posting Your Blessing...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#FFF1B8]" />
                  <span>Post My Blessing</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
