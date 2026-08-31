import {
  useEffect,
  useState,
} from "react";

import {
  getAdminSupportInquiries,
  updateSupportInquiry,
} from "../../api/supportApi";

interface Inquiry {
  _id: string;

  user: {
    name: string;
    email: string;
  };

  subject: string;
  message: string;
  status: string;
  adminResponse: string;
}

const AdminSupport = () => {
  const [inquiries, setInquiries] =
    useState<Inquiry[]>([]);

  const [error, setError] =
    useState("");

  const loadInquiries = async () => {
    try {
      const response =
        await getAdminSupportInquiries();

      setInquiries(
        response.data.inquiries || []
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load support inquiries"
      );
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleResolve = async (
    inquiry: Inquiry
  ) => {
    const response =
      window.prompt(
        "Enter response:",
        inquiry.adminResponse || ""
      );

    if (response === null) {
      return;
    }

    try {
      await updateSupportInquiry(
        inquiry._id,
        {
          status: "resolved",
          adminResponse: response,
        }
      );

      loadInquiries();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to update inquiry"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold">
          Support Inquiries
        </h1>

        <p className="mt-2 text-slate-500">
          Review and respond to user support requests.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">

          {inquiries.map(
            (inquiry) => (
              <div
                key={inquiry._id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <div className="flex flex-col gap-4 md:flex-row md:justify-between">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {
                        inquiry.subject
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {
                        inquiry.user
                          .name
                      }{" "}
                      ·{" "}
                      {
                        inquiry.user
                          .email
                      }
                    </p>

                    <p className="mt-4 text-slate-600">
                      {
                        inquiry.message
                      }
                    </p>

                    {inquiry.adminResponse && (
                      <p className="mt-3 text-sm">
                        <strong>
                          Response:
                        </strong>{" "}
                        {
                          inquiry.adminResponse
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    {inquiry.status !==
                    "resolved" ? (
                      <button
                        onClick={() =>
                          handleResolve(
                            inquiry
                          )
                        }
                        className="rounded-xl bg-violet-600 px-4 py-2 text-white"
                      >
                        Respond & Resolve
                      </button>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                        Resolved
                      </span>
                    )}
                  </div>

                </div>
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminSupport;