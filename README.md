# Meeting Room Booking System

A web-based meeting room booking system built using Django REST Framework, PostgreSQL, and React. It allows employees to view meeting rooms, check their availability, create bookings, and manage their reservations. Administrators can manage rooms and bookings through the Django Admin panel.

<img width="1890" height="916" alt="image" src="https://github.com/user-attachments/assets/f371f634-56e5-46f2-ab29-edd950b4e225" />

<img width="1885" height="876" alt="image" src="https://github.com/user-attachments/assets/b665d17a-1511-4068-9d74-bc0b1c0da30d" />

<img width="1903" height="896" alt="image" src="https://github.com/user-attachments/assets/989e8619-6f59-4be7-aa03-2c0fd18a32c3" />



The main focus of this project is backend functionality, API development, authentication, and preventing conflicting room reservations.

## Tech Stack

**Backend**
- Python
- Django
- Django REST Framework
- PostgreSQL
- Token-based Authentication

**Frontend**
- React.js
- Vite
- Axios
- React Router
- CSS

## Features

### Employee
- Register and log in using credentials.
- View available and active meeting rooms.
- Check room availability for a selected time slot.
- Book a meeting room by providing meeting details and time.
- View personal booking history.
- Cancel existing bookings.
- Prevent overlapping bookings for the same room.

### Administrator
- Access the admin dashboard.
- Add, update, and manage meeting rooms.
- View and manage booking records.
- Manage registered users through Django Admin.

### Backend and API
- RESTful API structure.
- Token-based authentication using Django REST Framework.
- Protected endpoints for authenticated users.
- Validation for booking start and end times.
- Server-side validation to prevent double booking.
- Separate handling of employee and administrator access.

## Project Structure

```text
meeting-rooms/
│
├── bookings/
│   ├── migrations/
│   ├── admin.py
│   ├── admin_views.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── manage.py
├── requirements.txt
└── .gitignore
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sush123-mita/Meeting-Rooms.git
cd Meeting-Rooms
```

### 2. Set up the backend

Create and activate a virtual environment.

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure PostgreSQL

Make sure PostgreSQL is installed and running.

Create a database:

```sql
CREATE DATABASE meeting_room_db;
```

Configure your database credentials in Django settings using environment variables or your local development configuration.

Also configure Django's `SECRET_KEY` and other environment-specific settings. Do not commit actual credentials or secret keys to GitHub.

### 4. Apply migrations

From the project root, run:

```bash
python manage.py migrate
```

### 5. Create an administrator account

```bash
python manage.py createsuperuser
```

Follow the prompts to create your administrator account.

### 6. Start the Django server

```bash
python manage.py runserver
```

Backend will be available at:

`http://127.0.0.1:8000/`

Django Admin:

`http://127.0.0.1:8000/admin/`

### 7. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the React development server:

```bash
npm run dev
```

Frontend will be available at:

`http://localhost:5173/`

## API Endpoints

All API endpoints are prefixed with `/api/`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register/` | Register a new employee |
| POST | `/auth/token/` | Obtain authentication token |
| GET | `/rooms/` | List active meeting rooms |
| GET | `/rooms/available/` | Check room availability |
| POST | `/bookings/` | Create a booking |
| GET | `/bookings/my/` | View personal bookings |
| DELETE | `/bookings/<id>/cancel/` | Cancel a booking |

### Authentication

The application uses token-based authentication.

After logging in, include the returned token in the request header for protected endpoints:

```http
Authorization: Token <your-auth-token>
```

## Development Assumptions and Booking Rules

The following assumptions were made while implementing the system:

1. **User roles:** Employees can register themselves. Administrator accounts are created separately using Django's superuser functionality.

2. **Room availability:** Only active meeting rooms are displayed for booking. Inactive rooms cannot be booked.

3. **Booking conflicts:** A room cannot have two confirmed bookings that overlap in time.

4. **Time validation:** The booking end time must always be later than the start time.

5. **Adjacent bookings:** Back-to-back bookings are allowed. For example, a booking ending at 11:00 AM does not conflict with another starting at 11:00 AM.

6. **Cancellation:** Employees can cancel only their own bookings. Cancelling a booking changes its status to `CANCELLED` instead of deleting the record.

7. **Booking history:** Employees can view only their own bookings.

8. **Authentication:** Protected API endpoints require a valid authentication token.

9. **Database:** PostgreSQL is used for persistent storage.

10. **Frontend scope:** The frontend provides the necessary screens to demonstrate the main workflows. The primary development focus was on backend logic, API integration, validation, and booking conflict handling rather than elaborate UI design.

## Running Tests

To run the Django test suite:

```bash
python manage.py test bookings
```

The tests cover important booking scenarios, including successful bookings, overlapping time slots, adjacent bookings, invalid time ranges, inactive rooms, cancellation, and access restrictions.

## Future Improvements

- Automated email notifications for bookings.
- Calendar integration.
- Improved role-based permission handling.
- Booking modification and rescheduling.
- Deployment with production-ready environment configuration.

---

**Author:** Sushmita Singh

**GitHub:** [sush123-mita](https://github.com/sush123-mita)
