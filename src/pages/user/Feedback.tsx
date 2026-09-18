import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { submitFeedback } from "../../api/feedbackApi";

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const Feedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId) {
      setError("Event ID is missing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await submitFeedback({
        eventId,
        rating,
        comment,
      });

      navigate("/my-bookings");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const displayedRating = hoverRating || rating;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/my-bookings"
          className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
        >
          ← Back to My Bookings
        </Link>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {/* Header */}

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-violet-700 px-7 py-9 text-white sm:px-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/20">
                Eventora Reviews
              </span>

              <h1 className="mt-5 text-3xl font-black tracking-tight">
                How was your experience?
              </h1>

              <p className="mt-2 max-w-lg leading-6 text-violet-100/80">
                Your feedback helps us understand your event experience.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-7 sm:p-10">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Rating */}

            <div>
              <p className="text-sm font-bold text-slate-800">
                Rate your experience
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Select between 1 and 5 stars.
              </p>

              <div className="mt-5 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star rating`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-4xl leading-none transition hover:scale-110 focus:outline-none"
                  >
                    <span
                      className={
                        star <= displayedRating
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                {rating}/5 · {ratingLabels[rating]}
              </div>
            </div>

            {/* Divider */}

            <div className="my-8 border-t border-slate-100" />

            {/* Comment */}

            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="feedback-comment"
                  className="text-sm font-bold text-slate-800"
                >
                  Tell us more
                </label>

                <span className="text-xs text-slate-400">
                  {comment.length}/500
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                What did you enjoy about the event?
              </p>

              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={6}
                maxLength={500}
                className="mt-4 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                placeholder="Share your event experience..."
              />
            </div>

            {/* Actions */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <Link
                to="/my-bookings"
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
