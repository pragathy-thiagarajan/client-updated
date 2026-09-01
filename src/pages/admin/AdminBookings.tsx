import { useEffect, useState } from "react";

import {
  getAdminBookings,
} from "../../api/adminApi";

interface Booking {
  _id: string;

  user: {
    _id: string;
    name: string;
    email: string;
  };

  event: {
    _id: string;
    title: string;
    eventDate: string;
    location: string;
    organizer: string;
  };

  ticketType: string;
  quantity: number;
  totalAmount: number;

  bookingStatus: string;
  paymentStatus: string;

  ticketCode: string;
  paymentId: string;

  createdAt: string;
  updatedAt: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminBookings();

        setBookings(
          response.data.bookings || []
        );
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const paidBookings =
    bookings.filter(
      (booking) =>
        booking.paymentStatus === "paid"
    );

  const failedBookings =
    bookings.filter(
      (booking) =>
        booking.paymentStatus === "failed"
    );

  const totalRevenue =
    paidBookings.reduce(
      (total, booking) =>
        total +
        Number(
          booking.totalAmount || 0
        ),
      0
    );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Transactions
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor ticket bookings and
            payment transactions.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}

        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Bookings"
            value={bookings.length}
          />

          <StatCard
            title="Paid"
            value={paidBookings.length}
          />

          <StatCard
            title="Failed"
            value={failedBookings.length}
          />

          <StatCard
            title="Revenue"
            value={`₹${totalRevenue.toLocaleString(
              "en-IN"
            )}`}
          />

        </div>

        {/* Table */}

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm shadow-slate-200/60">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="border-b bg-slate-50/70">

                  <tr>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Event
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Ticket
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Qty
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Booking
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Payment ID
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {bookings.map(
                    (booking) => (

                      <tr
                        key={booking._id}
                        className="border-b last:border-b-0"
                      >

                        <td className="px-5 py-4">

                          <p className="font-medium">
                            {booking.user.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {booking.user.email}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <p className="font-medium">
                            {booking.event.title}
                          </p>

                          <p className="text-sm text-slate-500">
                            {booking.event.location}
                          </p>

                        </td>

                        <td className="px-5 py-4">
                          {booking.ticketType}
                        </td>

                        <td className="px-5 py-4">
                          {booking.quantity}
                        </td>

                        <td className="px-5 py-4">
                          ₹
                          {Number(
                            booking.totalAmount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)
                            }
                          />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)
                            }
                          />
                        </td>
                        <td className="px-5 py-4 font-mono text-sm">
                          {booking.paymentId ||
                            "-"}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          {new Date(
                            booking.createdAt
                          ).toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
};

const StatusBadge = ({
  status,
}: {
  status: string;
}) => {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
      {status}
    </span>
  );
};

export default AdminBookings;