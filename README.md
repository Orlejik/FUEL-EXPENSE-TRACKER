# Fuel Expense Tracker

A full-stack application for tracking fuel expenses across multiple vehicles with user authentication, analytics, and reporting.

## Features

- **User Authentication**: Secure sign up and login with JWT tokens
- **Multi-Vehicle Support**: Add, edit, and remove vehicles
- **Expense Tracking**: Log fuel purchases with details (date, liters, cost)
- **Analytics & Reporting**: 
  - Total spent per vehicle
  - Average cost per liter
  - Charts and statistics
  - Monthly spending trends

## Tech Stack

- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Frontend**: React
- **Charts**: Recharts

## Prerequisites

- Docker and Docker Compose
- Python 3.9+
- Node.js 16+
- npm or yarn

## Setup Instructions

### Backend Setup

1. Start PostgreSQL with Docker:
```bash
docker-compose up -d
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Vehicles
- `POST /vehicles/` - Create vehicle
- `GET /vehicles/` - Get all vehicles
- `GET /vehicles/{id}` - Get vehicle
- `PUT /vehicles/{id}` - Update vehicle
- `DELETE /vehicles/{id}` - Delete vehicle

### Expenses
- `POST /expenses/` - Create expense
- `GET /expenses/` - Get expenses
- `GET /expenses/{id}` - Get expense
- `PUT /expenses/{id}` - Update expense
- `DELETE /expenses/{id}` - Delete expense
- `GET /expenses/stats/vehicle-stats` - Get vehicle statistics
- `GET /expenses/stats/total-spent` - Get total spent

## Database Schema

### Users
- id, email, password_hash, created_at

### Vehicles
- id, user_id, name, model, license_plate, created_at

### Expenses
- id, user_id, vehicle_id, liters, cost, date, created_at

## Environment Variables

Create `.env` file in the backend directory:
```
DATABASE_URL=postgresql://fuel_user:fuel_password@localhost:5432/fuel_tracker
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Create `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8000
```

## Default Credentials

- Database User: `fuel_user`
- Database Password: `fuel_password`
- Database Name: `fuel_tracker`

## License

MIT
