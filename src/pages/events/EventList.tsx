import { useEffect, useState } from "react";

import EventCard from "../../components/events/EventCard";
import { getEvents } from "../../api/eventApi";
import type { Event } from "../../types/events";

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    date: "",
    minPrice: "",
    maxPrice: "",
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEvents({
        search: filters.search || undefined,
        category: filters.category || undefined,
        location: filters.location || undefined,
        date: filters.date || undefined,

        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,

        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      });

      setEvents(response.data.events || []);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    loadEvents();
  };

  const handleClearFilters = async () => {
    const clearedFilters = {
      search: "",
      category: "",
      location: "",
      date: "",
      minPrice: "",
      maxPrice: "",
    };

    setFilters(clearedFilters);

    try {
      setLoading(true);
      setError("");

      const response = await getEvents();

      setEvents(response.data.events || []);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/70">
      {/* Header */}

      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="soft-badge">Explore what’s happening</span>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Discover events
              </h1>

              <p className="mt-3 max-w-2xl text-lg text-slate-500">
                Find experiences that match your interests, schedule and
                location.
              </p>
            </div>

            {!loading && !error && (
              <p className="text-sm font-semibold text-slate-500">
                <span className="text-violet-700">{events.length}</span> event
                {events.length === 1 ? "" : "s"} found
              </p>
            )}
          </div>

          {/* Filters */}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Search */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search events..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Location */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g. Chennai"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500"
                >
                  <option value="">All Categories</option>

                  <option value="conference">Conference</option>

                  <option value="workshop">Workshop</option>

                  <option value="concert">Concert</option>

                  <option value="sports">Sports</option>

                  <option value="festival">Festival</option>

                  <option value="other">Other</option>
                </select>
              </div>

              {/* Date */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Min Price */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Minimum Price
                </label>

                <input
                  type="number"
                  name="minPrice"
                  min="0"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="₹0"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Max Price */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Maximum Price
                </label>

                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="₹5000"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>
            </div>

            {/* Filter buttons */}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApplyFilters}
                disabled={loading}
                className="rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-52 bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-slate-200" />

                  <div className="h-4 w-full rounded bg-slate-100" />

                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="surface-card py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
              ⌕
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No events found
            </h2>

            <p className="mt-2 text-slate-500">
              Try changing your search, category, location, date or price range.
            </p>

            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default EventList;
