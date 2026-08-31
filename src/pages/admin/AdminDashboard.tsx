import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminUsers,
  getAdminBookings,
} from "../../api/adminApi";

interface User {
  _id: string;
  name: string;
  email: string;
  status: "active" | "blocked";
  phone: string;
  role: "user" | "organizer" | "admin";
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

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

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          usersResponse,
          bookingsResponse,
        ] = await Promise.all([
          getAdminUsers(),
          getAdminBookings(),
        ]);

        console.log(
          "Admin users:",
          usersResponse.data
        );

        console.log(
          "Admin bookings:",
          bookingsResponse.data
        );

        const userData =
          usersResponse.data.users || [];

        const bookingData =
          bookingsResponse.data.bookings || [];

        setUsers(
          Array.isArray(userData)
            ? userData
            : []
        );

        setBookings(
          Array.isArray(bookingData)
            ? bookingData
            : []
        );
      } catch (error: any) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* =========================
     USER STATISTICS
  ========================= */

  const userCount = users.filter(
    (user) => user.role === "user"
  ).length;

  const organizerCount = users.filter(
    (user) => user.role === "organizer"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const activeUsers = users.filter(
    (user) => user.status === "active"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "blocked"
  ).length;

  /* =========================
     BOOKING STATISTICS
  ========================= */

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "confirmed"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "cancelled"
    ).length;

  const paidBookings =
    bookings.filter(
      (booking) =>
        booking.paymentStatus === "paid"
    ).length;

  const totalTickets = bookings.reduce(
    (total, booking) =>
      total +
      Number(booking.quantity || 0),
    0
  );

  /* =========================
     REVENUE
  ========================= */

  const totalRevenue = useMemo(() => {
    return bookings.reduce(
      (total, booking) => {
        if (
          booking.bookingStatus ===
          "cancelled"
        ) {
          return total;
        }

        if (
          booking.paymentStatus !== "paid"
        ) {
          return total;
        }

        return (
          total +
          Number(
            booking.totalAmount || 0
          )
        );
      },
      0
    );
  }, [bookings]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor users, events, bookings and
            transactions.
          </p>
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* =========================
            MAIN STATISTICS
        ========================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Users"
            value={users.length}
          />

          <StatCard
            title="Total Bookings"
            value={bookings.length}
          />

          <StatCard
            title="Tickets Sold"
            value={totalTickets}
          />

          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString(
              "en-IN"
            )}`}
          />

        </div>

        {/* =========================
            USER STATISTICS
        ========================= */}

        <div className="mt-6">

          <h2 className="mb-4 text-xl font-semibold">
            User Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            <StatCard
              title="Users"
              value={userCount}
            />

            <StatCard
              title="Organizers"
              value={organizerCount}
            />

            <StatCard
              title="Admins"
              value={adminCount}
            />

            <StatCard
              title="Active"
              value={activeUsers}
            />

            <StatCard
              title="Blocked"
              value={blockedUsers}
            />

          </div>

        </div>

        {/* =========================
            BOOKING STATISTICS
        ========================= */}

        <div className="mt-6">

          <h2 className="mb-4 text-xl font-semibold">
            Booking Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">

            <StatCard
              title="Confirmed"
              value={confirmedBookings}
            />

            <StatCard
              title="Cancelled"
              value={cancelledBookings}
            />

            <StatCard
              title="Paid"
              value={paidBookings}
            />

          </div>

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">

          <h2 className="mb-5 text-xl font-semibold">
            Admin Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Users */}

            <Link
              to="/admin/users"
              className="rounded-lg border p-5 transition hover:bg-slate-50/70"
            >
              <h3 className="font-semibold">
                User Management
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage users, roles and account
                status.
              </p>

              <p className="mt-4 text-sm font-medium">
                {users.length} users →
              </p>
            </Link>

            {/* Bookings */}

            <Link
              to="/admin/bookings"
              className="rounded-lg border p-5 transition hover:bg-slate-50/70"
            >
              <h3 className="font-semibold">
                Booking Management
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                View bookings and attendee
                transactions.
              </p>

              <p className="mt-4 text-sm font-medium">
                {bookings.length} bookings →
              </p>
            </Link>

            {/* Events */}

            <Link
              to="/admin/events"
              className="rounded-lg border p-5 transition hover:bg-slate-50/70"
            >
              <h3 className="font-semibold">
                Event Approval
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review and approve organizer
                events.
              </p>

              <p className="mt-4 text-sm font-medium">
                Manage Events →
              </p>
            </Link>

          </div>

        </div>

        {/* =========================
            RECENT BOOKINGS
        ========================= */}

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest booking activity on the
                platform.
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="text-sm font-medium underline"
            >
              View All
            </Link>

          </div>

          {bookings.length === 0 ? (

            <div className="rounded-lg border p-8 text-center">

              <p className="text-slate-500">
                No bookings found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="border-b bg-slate-50/70">

                  <tr>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      User
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Event
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Tickets
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Payment
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {bookings
                    .slice(0, 5)
                    .map((booking) => (

                      <tr
                        key={booking._id}
                        className="border-b last:border-b-0"
                      >

                        <td className="px-4 py-4">

                          <p className="font-medium">
                            {booking.user.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {booking.user.email}
                          </p>

                        </td>

                        <td className="px-4 py-4">
                          {booking.event.title}
                        </td>

                        <td className="px-4 py-4">
                          {booking.quantity}
                        </td>

                        <td className="px-4 py-4">
                          ₹
                          {Number(
                            booking.totalAmount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge
                            status={
                              booking.paymentStatus
                            }
                          />
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

/* =========================
   STAT CARD
========================= */

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard = ({
  title,
  value,
}: StatCardProps) => {
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

/* =========================
   STATUS BADGE
========================= */

const StatusBadge = ({
  status,
}: {
  status?: string;
}) => {
  if (!status) {
    return (
      <span className="text-slate-400">
        -
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
      {status}
    </span>
  );
};

export default AdminDashboard;