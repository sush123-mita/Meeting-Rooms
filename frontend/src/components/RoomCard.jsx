export default function RoomCard({ room, onBook }) {
  return (
    <article className="room-card">
      <div className="room-icon">✦</div>

      <div className="room-card-heading">
        <span className="status-dot">Active</span>
        <span className="room-number">{room.room_number}</span>
      </div>

      <h3>{room.room_name}</h3>
      <p className="muted">{room.location}</p>

      <div className="room-meta">
        <span>♧ {room.capacity} seats</span>
      </div>

      <button className="secondary-button" onClick={() => onBook(room)}>
        Book this room →
      </button>
    </article>
  );
}