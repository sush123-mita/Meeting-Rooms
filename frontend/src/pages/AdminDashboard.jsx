import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DJANGO_ADMIN_URL = "http://127.0.0.1:8000/admin/";

export default function AdminDashboard() {
  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Navbar
          title="Administration"
          description="Manage your MeetSpace workspace."
        />

        <section className="admin-welcome">
          <p className="eyebrow">ADMINISTRATOR WORKSPACE</p>
          <h2>Welcome to MeetSpace Admin.</h2>
          <p>
            Manage meeting rooms, review reservations and oversee
            employee accounts through your Django administration panel.
          </p>

          <a
            href={DJANGO_ADMIN_URL}
            target="_blank"
            rel="noreferrer"
            className="primary-button admin-link"
          >
            Open Django Admin →
          </a>
        </section>

        <section className="section-heading">
          <div>
            <p className="eyebrow">MANAGEMENT</p>
            <h2>Available controls</h2>
          </div>
        </section>

        <div className="admin-cards">
          <a
            href={`${DJANGO_ADMIN_URL}bookings/meetingroom/`}
            target="_blank"
            rel="noreferrer"
            className="admin-card"
          >
            <span className="admin-card-icon">✦</span>
            <h3>Meeting rooms</h3>
            <p>Add rooms, edit room details and change active status.</p>
            <span className="text-link">Manage rooms →</span>
          </a>

          <a
            href={`${DJANGO_ADMIN_URL}bookings/booking/`}
            target="_blank"
            rel="noreferrer"
            className="admin-card"
          >
            <span className="admin-card-icon">◷</span>
            <h3>All bookings</h3>
            <p>Review reservations and booking statuses.</p>
            <span className="text-link">View bookings →</span>
          </a>

          <a
            href={`${DJANGO_ADMIN_URL}auth/user/`}
            target="_blank"
            rel="noreferrer"
            className="admin-card"
          >
            <span className="admin-card-icon">♧</span>
            <h3>Employees</h3>
            <p>View registered users and manage their accounts.</p>
            <span className="text-link">View employees →</span>
          </a>
        </div>

        <div className="admin-note">
          <strong>Administrator access</strong>
          <p>
            Django will ask you to authenticate in its admin panel.
            Use your existing superuser credentials.
          </p>
        </div>
      </main>
    </div>
  );
}