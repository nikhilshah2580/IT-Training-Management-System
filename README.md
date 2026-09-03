# IT Project - Online Learning & Course Management Platform

A full-stack web application for managing online courses, student enrollments, and payments with integrated eSewa and Khalti payment gateways.

---

##  Project Overview

This is a comprehensive MERN stack project that enables:
- **Course Management**: Create, edit, and manage online courses
- **Student Enrollment**: Students can enroll in courses with payment integration
- **Payment Processing**: Dual payment gateway support (eSewa and Khalti)
- **Real-time Features**: Socket.io integration for notifications
- **Admin Dashboard**: Manage users, courses, payments, and audit logs
- **Instructor Portal**: Create assignments, manage submissions, track student progress
- **Student Dashboard**: View courses, track progress, submit assignments

---

##  Tech Stack

### Backend
- **Runtime**: Node.js (ES modules)
- **Framework**: Express.js 5.2
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Google OAuth
- **Security**: Helmet, CORS, Rate limiting, bcryptjs
- **File Upload**: Cloudinary + Multer
- **Email**: Nodemailer
- **Real-time**: Socket.io
- **PDF Generation**: PDFKit
- **Payment Gateways**: eSewa, Khalti
- **Code Quality**: Prettier, ESLint

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4.3
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Real-time**: Socket.io Client
- **Code Quality**: ESLint, Prettier

---

##  Key Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Google OAuth integration
- Role-based access control (Student, Instructor, Admin)
- Email verification and password reset

### Course Management
- Create, edit, and publish courses
- Course categorization and skill levels
- Enrollment deadlines
- Course resources and materials
- Progress tracking

### Payment Integration
- **Dual Payment Gateways**:
  - eSewa integration (test credentials: EPAYTEST)
  - Khalti integration (with NPR to paisa conversion)
- Secure payment verification
- Invoice generation (PDF)
- Payment history and reports

### Student Features
- Browse and enroll in courses
- View enrolled courses and progress
- Submit assignments
- Track attendance
- View certificates
- Write course reviews
- Real-time notifications

### Instructor Features
- Create and manage courses
- Create assignments with deadlines
- Grade student submissions
- View class statistics
- Manage profile and specializations

### Admin Features
- User management (Create, edit, delete)
- Course approval workflow
- Payment management and reports
- Audit logs for all actions
- System analytics and statistics

### Advanced Features
- Real-time notifications via Socket.io
- Rate limiting on API endpoints
- Comprehensive audit logging
- File uploads to Cloudinary
- Email notifications
- Light and dark theme toggle with saved user preference
- Floating WhatsApp contact button with prefilled support message
- Responsive design (mobile-first)

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or local)
- Cloudinary account (for file uploads)
- eSewa and Khalti merchant accounts
- Gmail app password (for email notifications)

### Backend Setup

1. **Clone & Install**
   ```bash
   cd backend
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:9100`

### Frontend Setup

1. **Install & Configure**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables** (`.env`)
   ```env
   # API Backend
   VITE_API_URL=http://localhost:9100/api
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

---

## Available Scripts

### Backend
```bash
npm run dev          # Start with nodemon (development)
npm start            # Start production server
npm run format       # Format code with Prettier
npm run format:check # Check Prettier formatting
npm test             # Run tests (if configured)
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check Prettier formatting
npm run preview      # Preview production build
```

---

## Payment Integration Flow

### Enrollment → Payment → Activation

1. **Student clicks "Enroll Now"** on course details
2. **Payment method selection modal** appears (eSewa or Khalti)
3. **Enrollment created in "Pending" state** with unpaid status
4. **Redirect to payment gateway** (eSewa/Khalti hosted checkout)
5. **Student completes payment** on gateway
6. **Callback to success page** with verification parameters
7. **Backend verifies payment** with gateway API
8. **Payment marked as "Paid"** → Enrollment activated
9. **Student gains course access** and sees in My Courses



## UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Light and dark modes with automatic system preference detection
- **WhatsApp Support**: Floating WhatsApp contact button using +977-9851344071
- **Animations**: Smooth transitions with Framer Motion
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for user actions
- **Form Validation**: Real-time validation with Zod
- **Charts & Analytics**: Recharts for data visualization

---

##  Code Quality

- **Linting**: ESLint with React hooks rules
- **Formatting**: Prettier with consistent style
- **Validation**: Zod schemas for all forms
- **Error Handling**: Global error middleware
- **Security**: Helmet, CORS, JWT, Rate limiting

## Author & Contact

**Name**: Nikhil Raj Sah  
**Email**: [nikhilkshah98198@gmail.com](mailto:nikhilkshah98198@gmail.com)  
**Project**: IT Project - Online Learning & Course Management Platform

For inquiries, support, or collaboration, feel free to reach out via email.

---

