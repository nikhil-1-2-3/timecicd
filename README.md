# ⏱️ TimeCheck - Full-Stack Web Application

TimeCheck is a modern full-stack web application designed for seamless schedule slot booking, automated validation, and instant time confirmation. Built with a clean React (Vite) frontend, an Express.js & MongoDB Atlas REST API backend, and secured with JWT authentication and bcrypt password hashing.

---

## 🏗️ Project Architecture

```
time-check-app/
├── frontend/                     # React + Vite Client
│   ├── src/
│   │   ├── components/           # Navbar, ProtectedRoute, UI widgets
│   │   ├── context/              # AuthContext (state, JWT management)
│   │   ├── pages/                # Home, Register, Login, TimeForm, TimeResult, Dashboard
│   │   ├── services/             # Centralized API service (api.js)
│   │   ├── App.jsx               # Route definitions & layout
│   │   ├── main.jsx              # React DOM bootstrap
│   │   └── index.css             # Responsive custom design system
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                      # Express.js REST API
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   └── formController.js     # Form submission & user records
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token protection
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, createdAt)
│   │   └── Submission.js         # Submission schema (userId, slot details, confirmedTime)
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints router
│   │   └── formRoutes.js         # Protected form endpoints router
│   ├── services/
│   │   └── timeService.js        # Isolated time generation & confirmation logic
│   ├── server.js                 # Express application entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Application Flow

1. **Landing Page (`/`)**: Discover TimeCheck features with direct Login/Register actions.
2. **Registration (`/register`)**: Create an account with name, email, and password validation (stored securely using `bcryptjs` hashing).
3. **Login (`/login`)**: Authenticate credentials, receive a signed JWT token stored on the client, and automatically redirect to the Form page.
4. **Time Slot Form (`/form`)**: Authenticated users submit their name, email, desired date, preferred time slot, and meeting purpose.
5. **Confirmation Result (`/result`)**: Displays the celebratory confirmation card with confirmed date, preferred time, and confirmed allocated slot.
6. **Dashboard (`/dashboard`)**: View all historical submissions, confirmed schedule times, metrics summary, and instant logout.

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/timecheck?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

### Frontend Configuration (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Note**: Never commit real `.env` files with secret keys or MongoDB passwords to Git.

---

## 🍃 MongoDB Atlas Configuration

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (or select an existing one).
3. Under **Database Access**, create a database user with Read/Write privileges.
4. Under **Network Access**, whitelist your IP address (or `0.0.0.0/0` for initial cloud development).
5. Under **Database** -> **Connect** -> **Connect your application**, copy your MongoDB connection string (SRV URI) and paste it into `backend/.env` under `MONGODB_URI`.

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT secret
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend development server will launch at `http://localhost:5173`.

---

## 📡 REST API Reference

### Health Check
- `GET /api/health`
  - **Access**: Public
  - **Response**: `{ status: "ok", service: "TimeCheck Backend API", timestamp: "..." }`

### Authentication Endpoints
- `POST /api/auth/register`
  - **Access**: Public
  - **Body**: `{ name, email, password, confirmPassword }`
  - **Response**: `{ success: true, token, user: { id, name, email } }`
- `POST /api/auth/login`
  - **Access**: Public
  - **Body**: `{ email, password }`
  - **Response**: `{ success: true, token, user: { id, name, email } }`
- `GET /api/auth/me`
  - **Access**: Protected (`Bearer <JWT>`)
  - **Response**: `{ success: true, user: { id, name, email, createdAt } }`

### Form & Time Endpoints
- `POST /api/forms`
  - **Access**: Protected (`Bearer <JWT>`)
  - **Body**: `{ name, email, date, preferredTime, purpose }`
  - **Response**: `{ success: true, message: "...", data: { id, name, email, date, formattedDate, preferredTime, confirmedTime, purpose, confirmationMessage } }`
- `GET /api/forms/my`
  - **Access**: Protected (`Bearer <JWT>`)
  - **Response**: `{ success: true, count, data: [ ...submissions ] }`
- `GET /api/forms/:id`
  - **Access**: Protected (`Bearer <JWT>`)
  - **Response**: `{ success: true, data: { ...submission } }`

---

## 🔒 Security Practices Implemented

- **Password Encryption**: All user passwords hashed using `bcryptjs` before storage.
- **Data Protection**: Passwords explicitly excluded from API responses.
- **JWT Protection**: Protected routes validated by JWT verification middleware.
- **Error Shielding**: Database error details and stack traces masked in production mode.
- **Input Sanitization**: Mongoose schemas and strict field validations reject malformed data.

---

## 🐳 Docker & Docker Compose Setup

Run the entire application (Backend + Frontend) in isolated production containers with a single command:

### 1. Build and start containers:
```bash
docker compose up --build -d
```

### 2. Check container status:
```bash
docker compose ps
```

### 3. View live logs:
```bash
docker compose logs -f
```

### 4. Stop containers:
```bash
docker compose down
```

- **Frontend Container**: Accessible at `http://localhost:5173` or `http://localhost:80`
- **Backend API Container**: Accessible at `http://localhost:5000/api`

---

## 🛣️ Future Roadmap (DevOps & Cloud Ready)

- 🐳 **Dockerization**: Completed (Multi-stage builds with Alpine & Nginx).
- ☁️ **AWS Terraform**: Infrastructure as Code (IaC) provisioning on AWS ECS / Fargate, ALB, and VPC.
- 🔄 **GitHub Actions CI/CD**: Automated testing, linting, Docker image build & push to AWS ECR, and deployment trigger on `git push`.
