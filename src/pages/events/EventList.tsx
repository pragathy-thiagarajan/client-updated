import { useEffect, useState } from "react";
import EventCard from "../../components/events/EventCard";
import { getEvents } from "../../api/eventApi";
import type { Event } from "../../types/events";

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getEvents({
        search: search || undefined,
        category: category || undefined,
        location: location || undefined,
      });
      setEvents(response.data.events || response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [search, category, location]);

  return (
    <main className="min-h-screen bg-slate-50/70">
      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="soft-badge">Explore what’s happening</span>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl">Discover events</h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-500">Find experiences that match your interests, schedule and location.</p>
            </div>
            {!loading && !error && (
              <p className="text-sm font-semibold text-slate-500">
                <span className="text-violet-700">{events.length}</span> event{events.length === 1 ? "" : "s"} found
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-3 shadow-inner sm:grid-cols-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border bg-white py-3 pl-10 pr-4"
              />
            </div>
            <input
              type="text"
              placeholder="Category e.g. Technology"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-3"
            />
            <input
              type="text"
              placeholder="Location e.g. Chennai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-3"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
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
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="surface-card py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl">⌕</div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">No events found</h2>
            <p className="mt-2 text-slate-500">Try changing your search, category or location.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
        )}
      </div>
    </main>
  );
};

export default EventList;
