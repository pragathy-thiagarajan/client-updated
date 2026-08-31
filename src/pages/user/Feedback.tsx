import {
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  submitFeedback,
} from "../../api/feedbackApi";

const Feedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
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
      setError(
        error.response?.data?.message ||
          "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-xl">

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">

          <h1 className="text-2xl font-bold">
            Event Feedback
          </h1>

          <p className="mt-2 text-slate-500">
            Share your experience.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            <div>
              <label className="mb-2 block font-medium">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value={5}>
                  5 - Excellent
                </option>

                <option value={4}>
                  4 - Very Good
                </option>

                <option value={3}>
                  3 - Good
                </option>

                <option value={2}>
                  2 - Fair
                </option>

                <option value={1}>
                  1 - Poor
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Comments
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                rows={5}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Tell us about your experience"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 py-3 text-white disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : "Submit Feedback"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Feedback;