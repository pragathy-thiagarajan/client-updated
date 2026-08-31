import {
  useEffect,
  useState,
} from "react";

import {
  getAdminFeedbackReport,
} from "../../api/feedbackApi";

interface FeedbackItem {
  _id: string;

  user: {
    name: string;
    email: string;
  };

  event: {
    title: string;
  };

  rating: number;
  comment: string;
  createdAt: string;
}

interface Summary {
  totalFeedback: number;
  averageRating: number;

  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

const AdminFeedback = () => {
  const [feedback, setFeedback] =
    useState<FeedbackItem[]>([]);

  const [summary, setSummary] =
    useState<Summary | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadFeedback =
      async () => {
        try {
          const response =
            await getAdminFeedbackReport();

          setSummary(
            response.data.summary
          );

          setFeedback(
            response.data.feedback ||
              []
          );
        } catch (error: any) {
          setError(
            error.response?.data
              ?.message ||
              "Failed to load feedback"
          );
        } finally {
          setLoading(false);
        }
      };

    loadFeedback();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold">
          Attendee Feedback
        </h1>

        <p className="mt-2 text-slate-500">
          Review attendee ratings and comments.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
              <p className="text-sm text-slate-500">
                Total Feedback
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  summary.totalFeedback
                }
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
              <p className="text-sm text-slate-500">
                Average Rating
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  summary.averageRating
                }
                /5
              </p>
            </div>

          </div>
        )}

        <div className="mt-8 space-y-4">

          {feedback.map(
            (item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60"
              >

                <div className="flex flex-col justify-between gap-3 sm:flex-row">

                  <div>
                    <h2 className="font-semibold">
                      {
                        item.event.title
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {
                        item.user.name
                      }{" "}
                      ·{" "}
                      {
                        item.user.email
                      }
                    </p>
                  </div>

                  <div className="text-lg font-bold">
                    {item.rating}/5
                  </div>

                </div>

                {item.comment && (
                  <p className="mt-4 text-slate-600">
                    {item.comment}
                  </p>
                )}

              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminFeedback;