import { useEffect, useState } from "react";

import {
  getPendingEvents,
  updateEventStatus,
} from "../../api/adminApi";

interface AdminEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;

  organizer?: {
    _id: string;
    name: string;
    email: string;
  };

  status: string;

  ticketTypes?: {
    name: string;
    price: number;
    quantity: number;
    availableQuantity: number;
  }[];
}

const AdminEvents = () => {
  const [events, setEvents] =
    useState<AdminEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getPendingEvents();

      const data =
        response.data.events ||
        response.data.data ||
        response.data;

      setEvents(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load pending events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleStatusUpdate = async (
    eventId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setProcessingId(eventId);
      setError("");

      await updateEventStatus(
        eventId,
        status
      );

      setEvents((previous) =>
        previous.filter(
          (event) =>
            event._id !== eventId
        )
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          `Failed to ${status} event`
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading pending events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Event Approval
          </h1>

          <p className="mt-2 text-slate-500">
            Review organizer events before
            publishing them to users.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="inline-block rounded-xl bg-white px-6 py-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending Events
            </p>

            <p className="mt-2 text-3xl font-bold">
              {events.length}
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm shadow-slate-200/60">

            <h2 className="text-xl font-semibold">
              No pending events
            </h2>

            <p className="mt-2 text-slate-500">
              All submitted events have been reviewed.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {events.map((event) => (

              <div
                key={event._id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60"
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                  {/* Event Details */}

                  <div className="flex-1">

                    <div className="mb-3 flex flex-wrap items-center gap-2">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {event.category}
                      </span>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                        Pending
                      </span>

                    </div>

                    <h2 className="text-2xl font-semibold">
                      {event.title}
                    </h2>

                    <p className="mt-3 max-w-3xl text-slate-600">
                      {event.description}
                    </p>

                    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">

                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          event.eventDate
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>Time:</strong>{" "}
                        {event.startTime} -{" "}
                        {event.endTime}
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        {event.location}
                      </p>

                      <p>
                        <strong>Organizer:</strong>{" "}
                        {event.organizer?.name || "-"}
                      </p>

                      {event.organizer?.email && (
                        <p>
                          <strong>Email:</strong>{" "}
                          {event.organizer.email}
                        </p>
                      )}

                    </div>

                    {/* Ticket Types */}

                    {event.ticketTypes &&
                      event.ticketTypes.length > 0 && (
                        <div className="mt-6">

                          <h3 className="mb-3 font-semibold">
                            Ticket Types
                          </h3>

                          <div className="flex flex-wrap gap-3">

                            {event.ticketTypes.map(
                              (ticket) => (
                                <div
                                  key={ticket.name}
                                  className="rounded-lg border px-4 py-3 text-sm"
                                >
                                  <p className="font-medium">
                                    {ticket.name}
                                  </p>

                                  <p className="mt-1 text-slate-500">
                                    ₹{ticket.price} ·{" "}
                                    {ticket.quantity} tickets
                                  </p>
                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                  </div>

                  {/* Actions */}

                  <div className="flex min-w-[180px] flex-row gap-3 lg:flex-col">

                    <button
                      type="button"
                      disabled={
                        processingId ===
                        event._id
                      }
                      onClick={() =>
                        handleStatusUpdate(
                          event._id,
                          "approved"
                        )
                      }
                      className="flex-1 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white disabled:opacity-50"
                    >
                      {processingId === event._id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        processingId ===
                        event._id
                      }
                      onClick={() =>
                        handleStatusUpdate(
                          event._id,
                          "rejected"
                        )
                      }
                      className="flex-1 rounded-lg border border-red-200 px-5 py-3 font-medium text-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminEvents;