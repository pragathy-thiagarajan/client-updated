import { useEffect, useState } from "react";

import {
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "../../api/adminApi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "organizer" | "admin";
  status: "active" | "blocked";
  phone?: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers();

      setUsers(response.data.users || []);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    role: "user" | "organizer" | "admin"
  ) => {
    try {
      setError("");

      await updateUserRole(userId, role);

      setUsers((previous) =>
        previous.map((user) =>
          user._id === userId
            ? {
                ...user,
                role,
              }
            : user
        )
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to update role"
      );
    }
  };

  const handleStatusChange = async (
    userId: string,
    status: "active" | "blocked"
  ) => {
    try {
      setError("");

      await updateUserStatus(
        userId,
        status
      );

      setUsers((previous) =>
        previous.map((user) =>
          user._id === userId
            ? {
                ...user,
                status,
              }
            : user
        )
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    }
  };

  const handleDelete = async (
    userId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteUser(userId);

      setUsers((previous) =>
        previous.filter(
          (user) => user._id !== userId
        )
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage user roles and account status.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <StatCard
            title="Total Users"
            value={users.length}
          />

          <StatCard
            title="Active"
            value={
              users.filter(
                (user) =>
                  user.status === "active"
              ).length
            }
          />

          <StatCard
            title="Blocked"
            value={
              users.filter(
                (user) =>
                  user.status === "blocked"
              ).length
            }
          />

        </div>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm shadow-slate-200/60">
            No users found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="border-b bg-slate-50/70">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr
                      key={user._id}
                      className="border-b last:border-b-0"
                    >

                      <td className="px-6 py-4">

                        <p className="font-medium">
                          {user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value as
                                | "user"
                                | "organizer"
                                | "admin"
                            )
                          }
                          className="rounded-lg border px-3 py-2"
                        >
                          <option value="user">
                            User
                          </option>

                          <option value="organizer">
                            Organizer
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>

                      </td>

                      <td className="px-6 py-4">

                        <StatusBadge
                          status={user.status}
                        />

                      </td>

                      <td className="px-6 py-4 text-sm">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex flex-wrap gap-2">

                          {user.status ===
                          "active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  user._id,
                                  "blocked"
                                )
                              }
                              className="rounded-lg border px-3 py-2 text-sm"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  user._id,
                                  "active"
                                )
                              }
                              className="rounded-lg border px-3 py-2 text-sm"
                            >
                              Activate
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                user._id
                              )
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

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
  value: number;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
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
    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
      {status}
    </span>
  );
};

export default AdminUsers;