'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  CheckCircle2,
  Phone,
  MessageSquare,
  Calendar,
  ExternalLink,
  Trash2,
  Eye,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { mockEnquiries } from '@/lib/mock-data';
import { Enquiry } from '@/lib/types';
import EnquiryDrawer from './EnquiryDrawer';
import ConfirmModal from './ConfirmModal';

const STATUS_FILTERS: { label: string; value: 'all' | Enquiry['status'] }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Booked', value: 'booked' },
  { label: 'Closed', value: 'closed' },
];

export default function EnquiriesTable() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | Enquiry['status']>('all');

  // Drawer & Modal State
  const [activeDrawerEnquiry, setActiveDrawerEnquiry] = useState<Enquiry | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load: Merge mockEnquiries with localStorage
  useEffect(() => {
    let list: Enquiry[] = [...mockEnquiries];

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('kalasquare_enquiries');
        if (raw) {
          const saved: Enquiry[] = JSON.parse(raw);
          if (Array.isArray(saved)) {
            saved.forEach((item) => {
              const idx = list.findIndex((e) => e.id === item.id);
              if (idx >= 0) {
                list[idx] = item;
              } else {
                list.unshift(item);
              }
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse enquiries from localStorage', e);
      }
    }

    setEnquiries(list);
  }, []);

  const persistEnquiries = (updated: Enquiry[]) => {
    setEnquiries(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalasquare_enquiries', JSON.stringify(updated));
    }
  };

  // Status Change handler
  const handleStatusChange = (id: string, newStatus: Enquiry['status']) => {
    const updated = enquiries.map((enq) =>
      enq.id === id ? { ...enq, status: newStatus } : enq
    );
    persistEnquiries(updated);
    if (activeDrawerEnquiry && activeDrawerEnquiry.id === id) {
      setActiveDrawerEnquiry({ ...activeDrawerEnquiry, status: newStatus });
    }
    showToast(`Enquiry marked as ${newStatus.toUpperCase()}`);
  };

  // Save Note handler
  const handleSaveNote = (id: string, note: string) => {
    const updated = enquiries.map((enq) =>
      enq.id === id ? { ...enq, notes: note } : enq
    );
    persistEnquiries(updated);
    if (activeDrawerEnquiry && activeDrawerEnquiry.id === id) {
      setActiveDrawerEnquiry({ ...activeDrawerEnquiry, notes: note });
    }
    showToast('Internal note saved.');
  };

  // Delete Enquiry
  const handleDeleteEnquiry = () => {
    if (!deleteTargetId) return;
    const updated = enquiries.filter((e) => e.id !== deleteTargetId);
    persistEnquiries(updated);
    if (activeDrawerEnquiry?.id === deleteTargetId) {
      setActiveDrawerEnquiry(null);
    }
    setDeleteTargetId(null);
    showToast('Enquiry removed.');
  };

  // Filter & Search
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      // Status filter
      if (activeFilter !== 'all' && enq.status !== activeFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          enq.name.toLowerCase().includes(q) ||
          enq.artistName.toLowerCase().includes(q) ||
          enq.phone.includes(q) ||
          enq.city.toLowerCase().includes(q) ||
          enq.eventType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enquiries, activeFilter, searchQuery]);

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fde6ea] text-[#eb4e62]">
            New Lead
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e1effd] text-[#1469c4]">
            Contacted
          </span>
        );
      case 'booked':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e1f5ea] text-[#1a8a57]">
            Booked
          </span>
        );
      case 'closed':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f6f6f7] text-[#6b6b76]">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b1b1f] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in border border-white/10">
          <CheckCircle2 className="h-4 w-4 text-[#eb4e62]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
              Talent Booking Enquiries
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#fde6ea] text-[#eb4e62]">
              {enquiries.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">
            Incoming booking requests from event organizers, corporates, and wedding planners.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] self-start sm:self-auto overflow-x-auto">
          {STATUS_FILTERS.map((tab) => {
            const count =
              tab.value === 'all'
                ? enquiries.length
                : enquiries.filter((e) => e.status === tab.value).length;
            const isActive = activeFilter === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#eb4e62] shadow-xs'
                    : 'text-[#6b6b76] hover:text-[#1b1b1f]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-[#6b6b76]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e6e6ea] shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b76]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, artist, phone, or event city..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] text-sm text-[#1b1b1f] placeholder:text-[#6b6b76] focus:bg-white focus:border-[#eb4e62] focus:outline-hidden transition"
          />
        </div>
      </div>

      {/* Enquiries Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-[#e6e6ea] shadow-xs overflow-hidden">
        {filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto" />
            <h3 className="font-heading font-extrabold text-base text-[#1b1b1f]">
              No enquiries yet
            </h3>
            <p className="text-xs text-[#6b6b76] max-w-sm mx-auto">
              No customer booking requests match your current search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e6e6ea] bg-[#f9f9fb] text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider">
                    <th className="p-4 pl-5">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Requested Artist</th>
                    <th className="p-4">Event Date</th>
                    <th className="p-4">Event Type</th>
                    <th className="p-4">Message Preview</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e6ea] text-xs font-medium text-[#1b1b1f]">
                  {filteredEnquiries.map((enq) => (
                    <tr
                      key={enq.id}
                      onClick={() => setActiveDrawerEnquiry(enq)}
                      className="hover:bg-[#f9f9fb] transition cursor-pointer"
                    >
                      {/* Date */}
                      <td className="p-4 pl-5 text-[#6b6b76] text-[11px] whitespace-nowrap">
                        {enq.createdAt.split('T')[0]}
                      </td>

                      {/* Customer Name + Phone */}
                      <td className="p-4">
                        <div>
                          <strong className="font-heading font-bold text-sm text-[#1b1b1f] block truncate">
                            {enq.name}
                          </strong>
                          <span className="text-[11px] text-[#6b6b76] block">
                            {enq.phone}
                          </span>
                        </div>
                      </td>

                      {/* Artist */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/top-creators/${enq.artistSlug}`}
                          target="_blank"
                          className="flex items-center gap-2 text-xs font-bold text-[#1b1b1f] hover:text-[#eb4e62] transition"
                        >
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-neutral-100">
                            <Image
                              src={enq.artistPhotoUrl}
                              alt={enq.artistName}
                              fill
                              className="object-cover"
                              sizes="28px"
                            />
                          </div>
                          <span>{enq.artistName}</span>
                        </Link>
                      </td>

                      {/* Event Date */}
                      <td className="p-4 whitespace-nowrap text-[#1b1b1f] font-semibold">
                        {enq.eventDate}
                      </td>

                      {/* Event Type */}
                      <td className="p-4 whitespace-nowrap text-[#6b6b76]">
                        {enq.eventType}
                      </td>

                      {/* Message Preview (truncated 80 chars) */}
                      <td className="p-4 max-w-[220px]">
                        <p className="text-xs text-[#6b6b76] truncate line-clamp-1">
                          {enq.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        {getStatusBadge(enq.status)}
                      </td>

                      {/* Actions */}
                      <td
                        className="p-4 pr-5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Drawer */}
                          <button
                            type="button"
                            onClick={() => setActiveDrawerEnquiry(enq)}
                            className="p-1.5 rounded-lg border border-[#e6e6ea] hover:border-[#eb4e62] text-[#6b6b76] hover:text-[#eb4e62] transition"
                            title="View Full Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Quick Mark Contacted */}
                          {enq.status === 'new' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(enq.id, 'contacted')}
                              className="px-2 py-1 rounded-lg border border-[#1469c4]/30 bg-[#e1effd] text-[#1469c4] text-[11px] font-bold"
                              title="Mark as Contacted"
                            >
                              Contacted
                            </button>
                          )}

                          {/* Quick Mark Booked */}
                          {enq.status !== 'booked' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(enq.id, 'booked')}
                              className="px-2 py-1 rounded-lg border border-[#1a8a57]/30 bg-[#e1f5ea] text-[#1a8a57] text-[11px] font-bold"
                              title="Mark as Booked"
                            >
                              Booked
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(enq.id)}
                            className="p-1.5 rounded-lg border border-[#e6e6ea] hover:border-[#eb4e62] hover:bg-[#fde6ea] text-[#6b6b76] hover:text-[#eb4e62] transition"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden divide-y divide-[#e6e6ea]">
              {filteredEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => setActiveDrawerEnquiry(enq)}
                  className="p-4 space-y-3 cursor-pointer hover:bg-[#f9f9fb] transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#1b1b1f]">
                        {enq.name}
                      </h4>
                      <span className="text-xs text-[#6b6b76]">{enq.phone}</span>
                    </div>
                    {getStatusBadge(enq.status)}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#1b1b1f] font-semibold">
                    <span>Artist:</span>
                    <strong className="text-[#eb4e62]">{enq.artistName}</strong>
                    <span className="text-neutral-300">·</span>
                    <span className="text-[#6b6b76]">{enq.eventDate}</span>
                  </div>

                  <p className="text-xs text-[#6b6b76] line-clamp-2 leading-relaxed">
                    {enq.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f6f6f7] text-xs">
                    <span className="text-[11px] text-[#6b6b76]">{enq.eventType} · {enq.city}</span>
                    <span className="font-bold text-[#eb4e62] flex items-center gap-0.5">
                      <span>View</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Slide-out Detail Drawer */}
      <EnquiryDrawer
        enquiry={activeDrawerEnquiry}
        isOpen={Boolean(activeDrawerEnquiry)}
        onClose={() => setActiveDrawerEnquiry(null)}
        onStatusChange={handleStatusChange}
        onSaveNote={handleSaveNote}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Booking Enquiry?"
        description="Are you sure you want to remove this enquiry? All customer message history and internal notes for this enquiry will be deleted."
        confirmLabel="Delete Enquiry"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteEnquiry}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

