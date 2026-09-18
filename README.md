# EforEvent – Event Management System

EforEvent is a full-stack Event Management System designed to simplify the process of discovering, organizing, booking, and managing events.

The application provides separate functionality for **Attendees, Organizers, and Administrators**. Attendees can discover and book events, organizers can create and manage events, and administrators can manage users, events, bookings, feedback, and support requests.

The application is built using the MERN stack with TypeScript on the frontend.

---

## Features

### Attendee

- Register and login securely
- Browse approved events
- Search and filter events
- View detailed event information
- View ticket types and prices
- Book tickets
- View booking history
- Download event tickets
- Cancel bookings
- Transfer tickets
- Submit event feedback/reviews
- Submit support inquiries
- Receive booking confirmation emails
- Receive notifications about event schedule changes

### Organizer

- Register as an Event Organizer
- Login to the organizer account
- Create new events
- Edit and manage events
- Configure multiple ticket types and prices
- Add event schedules, sessions, speakers and timings
- View attendees registered for an event
- Export attendee information
- Manage event schedules
- View organizer analytics including ticket sales, attendance and revenue

Newly created events are subject to administrator approval before they become publicly available.

### Administrator

- Secure administrator login
- Manage registered users
- Manage user roles and account status
- Approve or reject events
- Monitor bookings and payment transactions
- View attendee feedback
- Manage support inquiries
- Monitor application activity through the admin dashboard

---

## Event Discovery

Users can browse approved events and filter them using:

- Search keyword
- Category
- Location
- Event date
- Minimum ticket price
- Maximum ticket price

Each event page provides event details, location, date and time, ticket information, event media and schedule information.

---

## Booking and Ticket Management

Attendees can select a ticket type and quantity before booking an event.

After a successful booking, the system stores the booking and payment information and generates a unique ticket code. Users can access their bookings from the **My Bookings** section and download their ticket.

The system also supports booking cancellation and ticket transfer.

---

## Event Schedule Management

Organizers can create schedules for their events containing:

- Session title
- Date
- Start time
- End time
- Speaker
- Session description

Registered attendees can be notified when event schedule information changes.

---

## Feedback and Support

Attendees can submit feedback for events they have attended.

The application also contains a support inquiry system where users can raise queries or issues. Administrators can view and manage these inquiries from the admin dashboard.

---

## Email Notifications

Email notifications are integrated using Nodemailer.

Notifications are used for:

- Ticket booking confirmation
- Event schedule updates for registered attendees

Email credentials are securely maintained using backend environment variables and are not stored in the source repository.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Nodemailer

### Deployment

- Frontend – Netlify
- Backend – Render
- Database – MongoDB Atlas
- Source Control – GitHub

---

## User Roles

EforEvent supports three application roles.

| Role | Description |
|------|-------------|
| Attendee | Discovers events, books tickets and manages bookings |
| Organizer | Creates events and manages schedules, attendees and analytics |
| Admin | Manages users, events, bookings, feedback and support inquiries |

Public registration is available for **Attendees and Organizers**.

Administrator accounts are not available through public registration.

---

## Demo Credentials

The following accounts can be used to evaluate the different application roles.

### Admin
Email: eventmanagementadmin@yopmail.com
Password: 123456

### Organizer
Email: eventmanagementorg@yopmail.com
Password: 123456

### Attendee / User
Email: eventmanagementuser@yopmail.com
Password: 123456

> These credentials are provided only for project demonstration and evaluation.

---

## Application Workflow

### Attendee Flow

Register → Login → Browse Events → Select Event → Book Ticket → View Booking → Download Ticket → Submit Feedback

### Organizer Flow

Register as Organizer → Login → Create Event → Wait for Admin Approval → Manage Event → Manage Schedule → View Attendees → View Analytics

### Admin Flow

Login → Manage Users → Review Events → Approve/Reject Events → Monitor Bookings → Review Feedback → Manage Support Requests

---

## Installation

Clone the repository:

```bash
git clone <repository-url>