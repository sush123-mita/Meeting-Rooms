import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  getMyBookings,
  cancelBooking,
} from "../services/bookingServices";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      setError("Unable to fetch your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await cancelBooking(id);
      setMessage("Booking cancelled successfully.");
      setError("");

      await loadBookings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to cancel this booking."
      );
      setMessage("");
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="My bookings"
          description="Keep track of your meeting schedule."
        />

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <p>Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            You haven't made any bookings yet.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Meeting</th>
                  <th>Room</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.meeting_title}</td>

                    <td>
                      {booking.room_name}
                      <small className="table-sub">
                        {booking.room_number}
                      </small>
                    </td>

                    <td>
                      {new Date(
                        booking.start_datetime
                      ).toLocaleString()}
                    </td>

                    <td>
                      {new Date(
                        booking.end_datetime
                      ).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={
                          booking.status === "CONFIRMED"
                            ? "status confirmed"
                            : "status cancelled"
                        }
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      {booking.status === "CONFIRMED" ? (
                        <button
                          className="danger-button"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}