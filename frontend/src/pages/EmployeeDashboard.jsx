import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getRooms } from "../services/roomServices";
import { getMyBookings } from "../services/bookingServices";
import RoomCard from "../components/RoomCard";

export default function EmployeeDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [roomData, bookingData] = await Promise.all([
          getRooms(),
          getMyBookings(),
        ]);

        setRooms(roomData);
        setBookings(bookingData);
      } catch (err) {
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const upcoming = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED" &&
      new Date(booking.start_datetime) >= new Date()
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Your workspace"
          description="A little more room for great ideas."
        />

        {error && <div className="alert error">{error}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <span>Available rooms</span>
            <strong>{loading ? "—" : rooms.length}</strong>
            <small>Active spaces</small>
          </div>

          <div className="stat-card">
            <span>My bookings</span>
            <strong>{loading ? "—" : bookings.length}</strong>
            <small>All booking records</small>
          </div>

          <div className="stat-card">
            <span>Upcoming meetings</span>
            <strong>{loading ? "—" : upcoming.length}</strong>
            <small>Confirmed meetings</small>
          </div>
        </section>

        <section className="section-heading">
          <div>
            <p className="eyebrow">DISCOVER YOUR SPACE</p>
            <h2>Find a room</h2>
          </div>
          <Link to="/rooms" className="text-link">View all rooms →</Link>
        </section>

        {loading ? (
          <p className="muted">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <div className="empty-state">No active rooms are available.</div>
        ) : (
          <div className="room-grid">
            {rooms.slice(0, 3).map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBook={() => {
                  window.location.href = "/rooms";
                }}
              />
            ))}
          </div>
        )}

        <section className="section-heading">
          <div>
            <p className="eyebrow">YOUR SCHEDULE</p>
            <h2>Upcoming meetings</h2>
          </div>
          <Link to="/my-bookings" className="text-link">
            All bookings →
          </Link>
        </section>

        <div className="booking-list">
          {upcoming.slice(0, 4).map((booking) => (
            <div className="booking-row" key={booking.id}>
              <div>
                <strong>{booking.meeting_title}</strong>
                <p className="muted">
                  {booking.room_name} · {booking.room_number}
                </p>
              </div>

              <span>
                {new Date(booking.start_datetime).toLocaleString()}
              </span>
            </div>
          ))}

          {!loading && upcoming.length === 0 && (
            <div className="empty-state">
              No upcoming meetings. Book a room to get started.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}