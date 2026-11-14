import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Shield,
  RefreshCw,
  AlertCircle,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { Blessing } from '../../data/weddingConfig';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlessingsModified?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onBlessingsModified,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin blessings once authenticated
  const fetchAdminBlessings = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blessings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch admin data.');
      }
      setBlessings(data.blessings || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching blessings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Incorrect passcode.');
      }

      setIsAuthenticated(true);
      setAuthToken(data.token);
      await fetchAdminBlessings(data.token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!authToken) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/blessings/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to approve');
      }
      // Update local state
      setBlessings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'approved' } : b))
      );
      if (onBlessingsModified) onBlessingsModified();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error approving blessing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!authToken) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/blessings/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reject');
      }
      setBlessings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'rejected' } : b))
      );
      if (onBlessingsModified) onBlessingsModified();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error rejecting blessing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!authToken) return;
    if (!confirm('Are you sure you want to permanently delete this blessing?')) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/blessings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete');
      }
      setBlessings((prev) => prev.filter((b) => b.id !== id));
      if (onBlessingsModified) onBlessingsModified();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting blessing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExportCsv = async () => {
    if (!authToken) return;
    setError(null);
    try {
      const response = await fetch('/api/admin/blessings/export', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        throw new Error(`Failed to export blessings (${response.status}).`);
      }
      const downloadUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'vignesh-pavithra-blessings.csv';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to export blessings.');
    }
  };

  if (!isOpen) return null;

  const pendingList = blessings.filter((b) => b.status === 'pending');
  const approvedList = blessings.filter((b) => b.status === 'approved');
  const rejectedList = blessings.filter((b) => b.status === 'rejected');

  const activeList =
    activeTab === 'pending'
      ? pendingList
      : activeTab === 'approved'
      ? approvedList
      : rejectedList;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#45352A]/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FFFDF9] border-2 border-[#C49A58] rounded-3xl p-4 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col text-[#45352A]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5D8C4]">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#98502F]" />
            <h3 className="font-serif-royal text-lg sm:text-xl font-bold text-[#45352A]">
              Family Blessings Moderation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#766B60] hover:text-[#98502F] rounded-full hover:bg-[#FAF5EC]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="py-8 max-w-sm mx-auto text-center w-full">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FAF5EC] border border-[#E5D8C4] flex items-center justify-center text-[#98502F]">
              <Lock className="w-6 h-6 text-[#C49A58]" />
            </div>

            <h4 className="font-serif-royal text-base font-bold mb-1">
              Admin &amp; Family Passcode
            </h4>
            <p className="text-xs text-[#766B60] mb-4">
              Enter the ceremony passcode to manage and approve guest blessings.
            </p>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <input
              type="password"
              placeholder="Enter admin passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5D8C4] bg-[#FAF5EC] text-xs text-center font-mono focus:ring-2 focus:ring-[#C49A58] focus:outline-none mb-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#98502F] text-white rounded-xl font-serif-royal text-xs font-semibold hover:bg-[#7d3f23] transition-colors"
            >
              {loading ? 'Verifying...' : 'Unlock Moderation Panel'}
            </button>
          </form>
        ) : (
          /* Moderation Workspace */
          <div className="flex-1 flex flex-col overflow-hidden pt-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              {/* Tab Pills with counts */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'pending'
                      ? 'bg-[#98502F] text-white shadow-xs'
                      : 'bg-[#FAF5EC] text-[#766B60] hover:text-[#45352A] border border-[#E5D8C4]'
                  }`}
                >
                  Pending ({pendingList.length})
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'approved'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-[#FAF5EC] text-[#766B60] hover:text-[#45352A] border border-[#E5D8C4]'
                  }`}
                >
                  Approved ({approvedList.length})
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'rejected'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-[#FAF5EC] text-[#766B60] hover:text-[#45352A] border border-[#E5D8C4]'
                  }`}
                >
                  Rejected ({rejectedList.length})
                </button>
              </div>

              {/* Actions: Refresh & CSV Export */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => authToken && fetchAdminBlessings(authToken)}
                  className="p-1.5 bg-[#FAF5EC] border border-[#E5D8C4] rounded-lg text-[#766B60] hover:text-[#45352A]"
                  title="Refresh List"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleExportCsv}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF5EC] hover:bg-[#F3EBE0] border border-[#E5D8C4] rounded-lg text-xs font-medium text-[#45352A]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#C49A58]" />
                  <span>Export CSV Keepsake</span>
                </button>
              </div>
            </div>

            {/* Blessings List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {activeList.length === 0 ? (
                <div className="text-center py-12 text-[#766B60] text-xs">
                  No {activeTab} blessings in the queue.
                </div>
              ) : (
                activeList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FAF5EC] border border-[#E5D8C4] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="font-serif-royal font-semibold text-xs text-[#98502F]">
                          {item.guestName}
                        </span>
                        <span className="text-[10px] text-[#766B60]">
                          {new Date(item.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <p className="font-cormorant text-base text-[#45352A] leading-snug">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {item.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={actionLoadingId === item.id}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={actionLoadingId === item.id}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={actionLoadingId === item.id}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-200 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
