import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/auth/login";
import EventList from "./pages/events/EventList";
import EventDetails from "./pages/events/EventDetails";
import Navbar from "./components/layouts/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateBooking from "./pages/bookings/CreateBooking";
import BookingDetails from "./pages/bookings/BookingDetails";
import Payment from "./pages/bookings/Payment";
import Ticket from "./pages/bookings/Ticket";
import MyBookings from "./pages/bookings/MyBookings";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import RoleRoute from "./routes/RoleRoute";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import Attendees from "./pages/organizer/Attendees";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrganizerAnalytics from "./pages/organizer/OrganizerAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBookings from "./pages/admin/AdminBookings";
import Support from "./pages/user/Support";
import AdminSupport from "./pages/admin/AdminSupport";
import Feedback from "./pages/user/Feedback";
import AdminFeedback from "./pages/admin/AdminFeedback";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/events/:id/book" element={<CreateBooking />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/bookings/:id/payment" element={<Payment />} />
          <Route path="/bookings/:id/ticket" element={<Ticket />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
        <Route element={<RoleRoute allowedRoles={["organizer"]} />}>
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/events" element={<AdminEvents />} />{" "}
          <Route path="/organizer/events" element={<OrganizerEvents />} />
          <Route path="/organizer/events/create" element={<CreateEvent />} />
          <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
          <Route
            path="/organizer/events/:eventId/attendees"
            element={<Attendees />}
          />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/events/:eventId/feedback" element={<Feedback />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
