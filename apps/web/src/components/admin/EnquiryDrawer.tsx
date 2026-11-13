'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Save,
  CheckCircle2,
  Tag,
  DollarSign,
  User,
} from 'lucide-react';
import { Enquiry } from '@/lib/types';

interface EnquiryDrawerProps {
  enquiry: Enquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: Enquiry['status']) => void;
  onSaveNote: (id: string, note: string) => void;
}

export default function EnquiryDrawer({
  enquiry,
  isOpen,
  onClose,
  onStatusChange,
  onSaveNote,
}: EnquiryDrawerProps) {
  const [noteText, setNoteText] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    if (enquiry) {
      setNoteText(enquiry.notes || '');
      setIsNoteSaved(false);
    }
  }, [enquiry]);

  if (!isOpen || !enquiry) return null;

  const handleSaveNoteClick = () => {
    onSaveNote(enquiry.id, noteText);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2500);
  };

  const getCleanPhone = (phone: string) => phone.replace(/[^\d+]/g, '');

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
            Booked &amp; Confirmed
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide Drawer Content */}
      <div className="w-full sm:w-[420px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left border-l border-[#e6e6ea]">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e6e6ea] flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Booking Enquiry Details
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="font-heading font-extrabold text-lg text-[#1b1b1f]">
                {enquiry.name}
              </h3>
              {getStatusBadge(enquiry.status)}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#f6f6f7] text-[#6b6b76] hover:text-[#1b1b1f] transition"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-[#1b1b1f]">
          {/* Quick Action Contact Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${getCleanPhone(enquiry.phone)}`}
              className="h-10 px-3 rounded-xl bg-[#1b1b1f] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <Phone className="h-3.5 w-3.5 text-[#eb4e62]" />
              <span>Call Client</span>
            </a>

            <a
              href={`https://wa.me/${getCleanPhone(enquiry.phone).replace('+', '')}?text=${encodeURIComponent(
                `Hi ${enquiry.name}, regarding your booking enquiry for ${enquiry.artistName} on KalaSquare...`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-3 rounded-xl bg-[#1a8a57] hover:bg-[#157348] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Requested Artist Card */}
          <div className="p-3.5 rounded-xl border border-[#e6e6ea] bg-[#f9f9fb] space-y-2">
            <span className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Requested Talent
            </span>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-[#e6e6ea]">
                  <Image
                    src={enquiry.artistPhotoUrl}
                    alt={enquiry.artistName}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1b1b1f]">
                    {enquiry.artistName}
                  </h4>
                  <span className="text-[11px] font-mono text-[#6b6b76]">
                    /{enquiry.artistSlug}
                  </span>
                </div>
              </div>

              <Link
                href={`/top-creators/${enquiry.artistSlug}`}
                target="_blank"
                className="p-2 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] text-[#eb4e62] transition shadow-xs"
                title="View Artist Profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Event & Client Details Grid */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Event Specification
            </span>

            <div className="space-y-2.5 rounded-xl border border-[#e6e6ea] p-4 bg-white divide-y divide-[#f6f6f7]">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[#6b6b76] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#eb4e62]" /> Event Type:
                </span>
                <strong className="text-[#1b1b1f]">{enquiry.eventType}</strong>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[#6b6b76] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#eb4e62]" /> Event Date:
                </span>
                <strong className="text-[#1b1b1f]">{enquiry.eventDate}</strong>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[#6b6b76] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#eb4e62]" /> Location:
                </span>
                <strong className="text-[#1b1b1f]">{enquiry.city}</strong>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[#6b6b76] flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-[#1a8a57]" /> Budget:
                </span>
                <strong className="text-[#1b1b1f]">{enquiry.budgetRange || 'Not Specified'}</strong>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#6b6b76] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#6b6b76]" /> Client Phone:
                </span>
                <strong className="text-[#1b1b1f]">{enquiry.phone}</strong>
              </div>
            </div>
          </div>

          {/* Customer Message */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Client Message
            </span>
            <div className="p-3.5 rounded-xl border border-[#e6e6ea] bg-[#f9f9fb] text-xs leading-relaxed text-[#1b1b1f]">
              {enquiry.message}
            </div>
          </div>

          {/* Internal Admin Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider">
                Internal Coordinator Notes
              </span>
              {isNoteSaved && (
                <span className="text-[11px] font-bold text-[#1a8a57] flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Note Saved!
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add manager notes regarding client call, artist fee quote, or contract rider status..."
              className="w-full p-3 rounded-xl border border-[#e6e6ea] bg-white text-xs text-[#1b1b1f] focus:border-[#eb4e62] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleSaveNoteClick}
              className="h-8 px-3.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 transition ml-auto"
            >
              <Save className="h-3 w-3" />
              <span>Save Note</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer Status Toggles */}
        <div className="p-4 border-t border-[#e6e6ea] bg-white flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onStatusChange(enquiry.id, 'contacted')}
            className={`flex-1 h-9 rounded-xl text-xs font-bold transition border ${
              enquiry.status === 'contacted'
                ? 'bg-[#e1effd] text-[#1469c4] border-[#1469c4]/30'
                : 'border-[#e6e6ea] hover:bg-[#f6f6f7] text-[#1b1b1f]'
            }`}
          >
            Mark Contacted
          </button>

          <button
            type="button"
            onClick={() => onStatusChange(enquiry.id, 'booked')}
            className={`flex-1 h-9 rounded-xl text-xs font-bold transition border ${
              enquiry.status === 'booked'
                ? 'bg-[#e1f5ea] text-[#1a8a57] border-[#1a8a57]/30'
                : 'border-[#e6e6ea] hover:bg-[#f6f6f7] text-[#1b1b1f]'
            }`}
          >
            Mark Booked
          </button>

          <button
            type="button"
            onClick={() => onStatusChange(enquiry.id, 'closed')}
            className={`h-9 px-3 rounded-xl text-xs font-bold transition border ${
              enquiry.status === 'closed'
                ? 'bg-neutral-200 text-neutral-700 border-neutral-300'
                : 'border-[#e6e6ea] hover:bg-[#f6f6f7] text-[#6b6b76]'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

