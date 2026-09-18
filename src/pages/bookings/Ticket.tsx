import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getBooking } from "../../api/bookingApi";
import { downloadTicket } from "../../api/ticketApi";

interface Booking {
  _id: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  ticketCode?: string;

  event?: {
    title: string;
    eventDate: string;
    startTime?: string;
    endTime?: string;
    location: string;
  };
}

const Ticket = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const bookingResponse = await getBooking(id);
        const bookingData =
          bookingResponse.data.booking || bookingResponse.data;

        setBooking(bookingData);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  const handleDownload = async () => {
    if (!id) return;

    try {
      setDownloading(true);
      setError("");

      const response = await downloadTicket(id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `ticket-${booking?.ticketCode || id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to download ticket");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Preparing your ticket...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
            !
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Ticket not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "We couldn't find this ticket."}
          </p>

          <Link
            to="/my-bookings"
            className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const isConfirmed = booking.bookingStatus === "confirmed";
  const isPaid = booking.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        {/* Navigation */}

        <div className="mb-5 flex items-center justify-between">
          <Link
            to="/my-bookings"
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            ← My Bookings
          </Link>

          <span className="text-sm font-medium text-slate-400">EforEvent</span>
        </div>

        {/* Ticket */}

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          {/* Ticket header */}

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-violet-700 px-7 py-9 text-white sm:px-10">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 font-bold ring-1 ring-white/20">
                    E
                  </div>

                  <span className="font-bold tracking-wide">EforEvent</span>
                </div>

                <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/20">
                  Event Ticket
                </span>
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                You're going to
              </p>

              <h1 className="mt-2 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                {booking.event?.title || "Event"}
              </h1>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
                  {isConfirmed ? "✓ Confirmed" : booking.bookingStatus}
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100 ring-1 ring-white/20">
                  {isPaid ? "✓ Paid" : booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Event information */}

          <div className="px-7 py-8 sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
              Event Details
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <TicketDetail
                label="Date"
                value={formatDate(booking.event?.eventDate)}
              />

              <TicketDetail
                label="Time"
                value={
                  booking.event?.startTime
                    ? `${formatTime(booking.event.startTime)}${
                        booking.event.endTime
                          ? ` – ${formatTime(booking.event.endTime)}`
                          : ""
                      }`
                    : "-"
                }
              />

              <TicketDetail
                label="Location"
                value={booking.event?.location || "-"}
              />
            </div>

            {/* Perforation effect */}

            <div className="relative my-8">
              <div className="border-t-2 border-dashed border-slate-200" />

              <div className="absolute -left-12 -top-4 h-8 w-8 rounded-full bg-slate-50" />
              <div className="absolute -right-12 -top-4 h-8 w-8 rounded-full bg-slate-50" />
            </div>

            {/* Admission details */}

            <div className="grid gap-6 sm:grid-cols-3">
              <TicketDetail label="Ticket Type" value={booking.ticketType} />

              <TicketDetail label="Tickets" value={`${booking.quantity}`} />

              <TicketDetail
                label="Amount"
                value={`₹${booking.totalAmount.toLocaleString("en-IN")}`}
              />
            </div>

            {/* Ticket code */}

            {booking.ticketCode && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/70">
                <div className="px-6 py-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
                    Ticket Code
                  </p>

                  <p className="mt-2 break-all font-mono text-xl font-black tracking-wider text-slate-900 sm:text-2xl">
                    {booking.ticketCode}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Keep this ticket code available when attending the event.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloading ? "Preparing PDF..." : "↓ Download PDF Ticket"}
              </button>

              <Link
                to="/my-bookings"
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                View My Bookings
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              This ticket is linked to your EforEvent booking. Please keep it
              available for event verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TicketDetailProps {
  label: string;
  value: string;
}

const TicketDetail = ({ label, value }: TicketDetailProps) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default Ticket;
