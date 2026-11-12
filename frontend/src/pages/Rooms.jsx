import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";

import {
  getRooms,
  checkRoomAvailability,
} from "../services/roomServices";

import { createBooking } from "../services/bookingServices";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [form, setForm] = useState({
    meeting_title: "",
    start_datetime: "",
    end_datetime: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(() => {
        setMessage("Unable to load rooms.");
        setMessageType("error");
      })
      .finally(() => setLoading(false));
  }, []);

  const toISO = (value) => new Date(value).toISOString();

  const validateForm = () => {
    if (
      !form.meeting_title.trim() ||
      !form.start_datetime ||
      !form.end_datetime
    ) {
      throw new Error("Please fill in all booking details.");
    }

    if (
      new Date(form.end_datetime) <=
      new Date(form.start_datetime)
    ) {
      throw new Error("End time must be later than start time.");
    }

    if (new Date(form.start_datetime) <= new Date()) {
      throw new Error("Please select a future meeting time.");
    }
  };

  const handleAvailability = async () => {
    try {
      validateForm();
      setChecking(true);
      setMessage("");

      const result = await checkRoomAvailability(
        selectedRoom.id,
        toISO(form.start_datetime),
        toISO(form.end_datetime)
      );

      setMessage(
        result.available
          ? "Great! This room is available."
          : result.message || "This room is not available."
      );

      setMessageType(result.available ? "success" : "error");
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        err.message ||
        "Unable to check availability."
      );
      setMessageType("error");
    } finally {
      setChecking(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      validateForm();

      const result = await createBooking({
        meeting_room: selectedRoom.id,
        meeting_title: form.meeting_title.trim(),
        start_datetime: toISO(form.start_datetime),
        end_datetime: toISO(form.end_datetime),
      });

      setMessage(
        `Booking confirmed! Your booking ID is ${result.id}.`
      );
      setMessageType("success");

      setSelectedRoom(null);
      setForm({
        meeting_title: "",
        start_datetime: "",
        end_datetime: "",
      });
    } catch (err) {
      const data = err.response?.data;

      setMessage(
        data?.error ||
        (data ? Object.values(data).flat().join(" ") : err.message) ||
        "Booking failed."
      );

      setMessageType("error");
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Find your space"
          description="Choose a room that works for your team."
        />

        {message && (
          <div className={`alert ${messageType}`}>
            {message}
          </div>
        )}

        {loading ? (
          <p>Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <div className="empty-state">No active rooms available.</div>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBook={(selected) => {
                  setSelectedRoom(selected);
                  setMessage("");
                }}
              />
            ))}
          </div>
        )}

        {selectedRoom && (
          <div className="modal-backdrop">
            <div className="booking-modal">
              <button
                className="modal-close"
                onClick={() => setSelectedRoom(null)}
              >
                ×
              </button>

              <p className="eyebrow">NEW RESERVATION</p>
              <h2>{selectedRoom.room_name}</h2>
              <p className="muted">
                {selectedRoom.room_number} · {selectedRoom.location}
                · {selectedRoom.capacity} seats
              </p>

              <form onSubmit={handleBooking}>
                <label>Meeting title</label>
                <input
                  value={form.meeting_title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      meeting_title: e.target.value,
                    })
                  }
                  placeholder="e.g. Project discussion"
                  required
                />

                <label>Start date and time</label>
                <input
                  type="datetime-local"
                  value={form.start_datetime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      start_datetime: e.target.value,
                    })
                  }
                  required
                />

                <label>End date and time</label>
                <input
                  type="datetime-local"
                  value={form.end_datetime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      end_datetime: e.target.value,
                    })
                  }
                  required
                />

                <button
                  type="button"
                  className="secondary-button full-width"
                  onClick={handleAvailability}
                  disabled={checking}
                >
                  {checking ? "Checking..." : "Check availability"}
                </button>

                <button className="primary-button" type="submit">
                  Confirm booking →
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}