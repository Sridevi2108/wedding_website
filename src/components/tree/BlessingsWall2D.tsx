import React, { useState, useMemo } from 'react';
import { Blessing } from '../../data/weddingConfig';
import { Search, MessageCircle } from 'lucide-react';

interface BlessingsWall2DProps {
  blessings: Blessing[];
  onPlantClick: () => void;
}

export const BlessingsWall2D: React.FC<BlessingsWall2DProps> = ({
  blessings,
  onPlantClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    return blessings.filter((b) => {
      const matchSearch =
        !searchQuery ||
        b.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [blessings, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="bg-[#FFFDF9] border border-[#E5D8C4] rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#766B60] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search blessings or well-wishers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EC] border border-[#E5D8C4] rounded-full text-xs text-[#45352A] placeholder-[#766B60]/60 focus:outline-none focus:ring-2 focus:ring-[#C49A58]"
          />
        </div>

      </div>

      {/* Grid of blessing cards */}
      {paginatedItems.length === 0 ? (
        <div className="text-center py-12 bg-[#FAF5EC]/50 rounded-2xl border border-dashed border-[#E5D8C4]">
          <MessageCircle className="w-10 h-10 mx-auto text-[#C49A58] mb-2 opacity-60" />
          <p className="font-serif-royal text-sm font-semibold text-[#45352A]">
            No blessings found
          </p>
          <p className="text-xs text-[#766B60] mt-1 mb-4">
            Be the first to bestow auspicious wishes!
          </p>
          <button
            onClick={onPlantClick}
            className="px-4 py-2 bg-[#98502F] text-white text-xs font-semibold rounded-full hover:bg-[#7d3f23] transition-colors"
          >
            Plant a Blessing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.map((b) => (
            <div
              key={b.id}
              className="bg-[#FAF5EC]/60 hover:bg-[#FAF5EC] border border-[#E5D8C4] hover:border-[#C49A58] p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md group"
            >
              <div className="flex flex-col">
                <span className="font-serif-royal font-semibold text-sm text-[#98502F] mb-2">
                  {b.guestName}
                </span>
                <blockquote className="font-cormorant italic text-base text-[#45352A] leading-relaxed">
                  &ldquo;{b.message}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-[#E5D8C4]/60">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#FAF5EC] hover:bg-[#F3EBE0] border border-[#E5D8C4] rounded-lg text-xs font-medium text-[#45352A] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-[#766B60] px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#FAF5EC] hover:bg-[#F3EBE0] border border-[#E5D8C4] rounded-lg text-xs font-medium text-[#45352A] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
