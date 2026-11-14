'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

export default function KalaMitraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: 'Hi, I am Kala Mitra! Ask me anything about artists, events, or booking talent on KalaSquare.',
    },
  ]);
  const [input, setInput] = useState('');

  const chips = [
    { label: 'Find a singer', prompt: 'Find me a verified singer for a corporate event.' },
    { label: 'Venues in Delhi', prompt: 'Show me entertainment venues in Delhi-NCR.' },
    { label: 'How booking works', prompt: 'How does artist booking work?' },
    { label: 'Talk to the team', prompt: 'I want to speak with the KalaSquare team.' },
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: Message = { from: 'user', text: q };
    let botReplyText =
      'Thanks for reaching out! You can explore verified creators under Top Creators or submit an enquiry on any artist profile to receive a custom quote within 24 hours.';

    const lower = q.toLowerCase();
    if (lower.includes('singer')) {
      botReplyText =
        'We have top singers like Ajay Hooda, Sahil Badal, and Ria Bally available for live shows, festivals, and weddings. Check the Singers category on the home page!';
    } else if (lower.includes('venue') || lower.includes('delhi')) {
      botReplyText =
        'Popular venues in Delhi-NCR include Comedy County (Noida), Studio & Productions (South Delhi), and Stage Five (Gurugram). Browse our Venues section!';
    } else if (lower.includes('how') || lower.includes('booking')) {
      botReplyText =
        'Booking is simple: Select an artist, click "Send enquiry", choose your event date and budget, and our team connects you directly with the artist.';
    } else if (lower.includes('team') || lower.includes('talk') || lower.includes('contact')) {
      botReplyText =
        'You can reach our team at support@kalasquare.com or submit a request through the Contact Us form.';
    }

    setMessages((prev) => [...prev, userMsg, { from: 'bot', text: botReplyText }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Popup Dialog */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-[#e6e6ea] overflow-hidden flex flex-col animate-scale-up">
          {/* Header */}
          <div className="bg-[#17171c] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="/mascot.jpg"
                  alt="Kala Mitra"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <b className="font-heading font-extrabold text-[15px] block leading-tight">
                  Kala Mitra
                </b>
                <small className="text-[11px] text-[#1a8a57] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a8a57]" />
                  AI guide · online
                </small>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold cursor-pointer"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-3.5 space-y-2.5 max-h-[280px] overflow-y-auto text-xs sm:text-[13px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                  m.from === 'user'
                    ? 'ml-auto bg-[#eb4e62] text-white font-medium rounded-br-xs'
                    : 'bg-[#f6f6f7] text-[#1b1b1f] rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-[#f6f6f7]/60 border-t border-[#e6e6ea] flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(c.prompt)}
                className="text-[11px] font-bold text-[#eb4e62] bg-[#fde6ea] hover:bg-[#eb4e62] hover:text-white px-2.5 py-1 rounded-full transition cursor-pointer"
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-[#e6e6ea] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about artists, venues, booking"
              className="flex-1 h-9 px-3 text-xs bg-[#f6f6f7] rounded-lg outline-none focus:bg-white focus:border focus:border-[#eb4e62]"
            />
            <button
              type="submit"
              className="h-9 px-3 rounded-lg bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold transition cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Mascot Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full p-0.5 bg-white border-2 border-[#eb4e62]/40 shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer overflow-visible group"
        aria-label="Chat with Kala Mitra"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src="/mascot.jpg"
            alt="Kala Mitra Mascot"
            fill
            className="object-cover"
          />
        </div>

        {/* Green Online Indicator Badge */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#1a8a57] border-2 border-white shadow-xs" />
      </button>
    </div>
  );
}

