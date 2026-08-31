import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEventById } from "../../api/eventApi";
import { createBooking } from "../../api/bookingApi";

import type { Event, TicketType } from "../../types/events";

const CreateBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;

      try {
        const response = await getEventById(id);

        const data = response.data.event || response.data;

        setEvent(data);

        if (data.ticketTypes?.length > 0) {
          setSelectedTicket(data.ticketTypes[0]);
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load event"
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!event || !selectedTicket) {
      setError("Please select a ticket");
      return;
    }

    if (
      quantity > selectedTicket.availableQuantity
    ) {
      setError("Not enough tickets available");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      const response = await createBooking({
        eventId: event._id,
        ticketType: selectedTicket.name,
        quantity,
      });

      const booking =
        response.data.booking || response.data;

      navigate(`/bookings/${booking._id}`);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-10 text-center">
        Event not found
      </div>
    );
  }

  const total =
    (selectedTicket?.price || 0) * quantity;

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-2 text-3xl font-bold">
          Book Tickets
        </h1>

        <p className="mb-8 text-slate-500">
          {event.title}
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">

          {/* Ticket selection */}

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">

            <h2 className="mb-5 text-xl font-semibold">
              Select Ticket
            </h2>

            <div className="space-y-4">
              {event.ticketTypes?.map((ticket) => (
                <button
                  key={ticket.name}
                  type="button"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setQuantity(1);
                    setError("");
                  }}
                  className={`w-full rounded-xl border p-5 text-left transition ${
                    selectedTicket?.name === ticket.name
                      ? "border-black bg-slate-50/70"
                      : "hover:border-gray-400"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {ticket.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {ticket.availableQuantity}{" "}
                        tickets available
                      </p>
                    </div>

                    <span className="text-lg font-bold">
                      ₹{ticket.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {selectedTicket && (
              <div className="mt-8">
                <label className="mb-2 block font-medium">
                  Quantity
                </label>

                <select
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Number(e.target.value)
                    )
                  }
                  className="rounded-lg border px-4 py-3"
                >
                  {Array.from(
                    {
                      length: Math.min(
                        selectedTicket.availableQuantity,
                        10
                      ),
                    },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Summary */}

          <div className="h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">

            <h2 className="mb-5 text-xl font-semibold">
              Booking Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Event
                </span>

                <span className="max-w-[180px] text-right font-medium">
                  {event.title}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Ticket
                </span>

                <span>
                  {selectedTicket?.name || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Quantity
                </span>

                <span>{quantity}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={
                bookingLoading ||
                !selectedTicket ||
                selectedTicket.availableQuantity === 0
              }
              className="mt-6 w-full rounded-xl bg-violet-600 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bookingLoading
                ? "Creating booking..."
                : "Continue to Payment"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;