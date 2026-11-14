'use client';

import React, { useState } from 'react';
import { ReviewItem } from '@/lib/types';

interface ReviewsSectionProps {
    rating: number;
    reviewsCount: number;
    reviews: ReviewItem[];
}

export default function ReviewsSection({ rating, reviewsCount, reviews }: ReviewsSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [starRating, setStarRating] = useState(5);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [submittedToast, setSubmittedToast] = useState(false);
    const [localReviews, setLocalReviews] = useState<ReviewItem[]>(reviews || []);

    const totalCount = localReviews.length > 0 ? localReviews.length : (reviewsCount || 0);
    const avgScore = localReviews.length > 0
        ? localReviews.reduce((sum, r) => sum + r.rating, 0) / localReviews.length
        : (totalCount > 0 ? rating : 0);
    const ratingVal = avgScore > 0 ? avgScore.toFixed(1) : '0.0';

    const renderStars = (score: number) => {
        return (
            <span className="pp-stars" aria-label={`${score.toFixed(1)} out of 5`}>
                {[1, 2, 3, 4, 5].map((i) => {
                    const on = i <= Math.round(score);
                    return (
                        <svg
                            key={i}
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z"
                                fill={on ? '#f5a300' : 'none'}
                                stroke={on ? '#f5a300' : '#d0d0d8'}
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                            />
                        </svg>
                    );
                })}
            </span>
        );
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newReview: ReviewItem = {
            id: `rev-${Date.now()}`,
            authorName: name.trim(),
            date: 'Just now',
            rating: starRating,
            comment: comment.trim() || 'Great artist and performance!',
        };

        setLocalReviews([newReview, ...localReviews]);
        setIsModalOpen(false);
        setName('');
        setComment('');
        setSubmittedToast(true);
        setTimeout(() => setSubmittedToast(false), 4000);
    };

    return (
        <section className="pp-s rv in" id="pp-reviews">
            <div className="pp-sh">
                <h2>Reviews</h2>
            </div>

            {submittedToast && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: '12px 16px',
                        background: '#e4f7ea',
                        color: '#14803c',
                        borderRadius: 14,
                        fontWeight: 600,
                        fontSize: 14,
                    }}
                >
                    Thank you! Your review has been submitted successfully.
                </div>
            )}

            <div className="pp-rs">
                {/* Left: Overall Rating Box */}
                <div className="pp-sum">
                    <b>{ratingVal}</b>
                    {renderStars(avgScore)}
                    <small>
                        {totalCount} review{totalCount === 1 ? '' : 's'}
                    </small>
                </div>

                {/* Right: Reviews List + Rate Callout */}
                <div className="pp-rcol">
                    {localReviews.length > 0 ? (
                        <ul className="pp-rv">
                            {localReviews.map((x) => (
                                <li key={x.id}>
                                    <div className="pp-rh">
                                        <span className="pp-av">
                                            {x.authorName.charAt(0).toUpperCase()}
                                        </span>
                                        <div>
                                            <b>{x.authorName}</b>
                                            <small>{x.date}</small>
                                        </div>
                                        {renderStars(x.rating)}
                                    </div>
                                    {x.comment && <p>{x.comment}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="pp-em">
                            {renderStars(0)}
                            <b>No reviews yet</b>
                            <span>Be the first to share your experience.</span>
                        </div>
                    )}

                    {/* Rate this artist banner */}
                    <div className="pp-rc">
                        <div>
                            <h3>Rate this artist</h3>
                            <p>Tell others what you think about this artist</p>
                        </div>
                        <button
                            type="button"
                            className="btn fill"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Write a review
                        </button>
                    </div>
                </div>
            </div>

            {/* Write a Review Modal */}
            {isModalOpen && (
                <div
                    className="pp-mo"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Write a review"
                    onClick={() => setIsModalOpen(false)}
                >
                    <form
                        className="pp-mc"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleFormSubmit}
                    >
                        <button
                            type="button"
                            className="mx"
                            onClick={() => setIsModalOpen(false)}
                            aria-label="Close"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <h3>Write a review</h3>

                        <div className="pp-pick" role="radiogroup" aria-label="Your rating">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    className={n <= starRating ? 'on' : ''}
                                    onClick={() => setStarRating(n)}
                                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                                >
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        <label>
                            Full name
                            <input
                                name="name"
                                placeholder="Enter full name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>

                        <label>
                            We&apos;d love to hear more from you (optional)
                            <textarea
                                name="text"
                                rows={4}
                                placeholder="Enter your message"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </label>

                        <div className="mb">
                            <button
                                type="button"
                                className="btn line"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn fill" type="submit">
                                Submit review
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
