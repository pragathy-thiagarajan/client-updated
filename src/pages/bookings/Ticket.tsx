import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBooking } from "../../api/bookingApi";
import {
  getTicketQR,
  downloadTicket,
} from "../../api/ticketApi";

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

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [qrCode, setQrCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const bookingResponse =
          await getBooking(id);

        const bookingData =
          bookingResponse.data.booking ||
          bookingResponse.data;

        setBooking(bookingData);

        const qrResponse =
          await getTicketQR(id);

        /*
         * Depending on your backend response,
         * QR may be returned as:
         *
         * qrCode
         * data.qrCode
         * qr
         */
        const qr =
          qrResponse.data.qrCode ||
          qrResponse.data.data?.qrCode ||
          qrResponse.data.qr;

        setQrCode(qr);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load ticket"
        );
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

      const response =
        await downloadTicket(id);

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = `ticket-${id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to download ticket"
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading ticket...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Ticket not found
        </h1>

        <p className="mt-2 text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Header */}

          <div className="bg-violet-600 px-6 py-8 text-white">
            <p className="text-sm uppercase tracking-widest opacity-70">
              Event Ticket
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {booking.event?.title}
            </h1>
          </div>

          {/* Ticket content */}

          <div className="p-6">

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  Date
                </p>

                <p className="font-semibold">
                  {booking.event?.eventDate
                    ? new Date(
                        booking.event.eventDate
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Location
                </p>

                <p className="font-semibold">
                  {booking.event?.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Ticket Type
                </p>

                <p className="font-semibold">
                  {booking.ticketType}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Quantity
                </p>

                <p className="font-semibold">
                  {booking.quantity}
                </p>
              </div>

            </div>

            <div className="my-8 border-t" />

            {/* QR */}

            <div className="text-center">

              <p className="mb-4 text-sm text-slate-500">
                Scan this QR code at the event
              </p>

              {qrCode ? (
                <img
                  src={qrCode}
                  alt="Ticket QR Code"
                  className="mx-auto h-48 w-48"
                />
              ) : (
                <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
                  QR unavailable
                </div>
              )}

            </div>

            {/* Ticket code */}

            {booking.ticketCode && (
              <div className="mt-8 rounded-lg bg-slate-50/70 p-4 text-center">
                <p className="text-sm text-slate-500">
                  Ticket Code
                </p>

                <p className="mt-1 font-mono text-lg font-bold">
                  {booking.ticketCode}
                </p>
              </div>
            )}

            {/* Download */}

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-8 w-full rounded-xl bg-violet-600 py-3 font-medium text-white disabled:opacity-50"
            >
              {downloading
                ? "Downloading..."
                : "Download PDF Ticket"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;