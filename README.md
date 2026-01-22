# Events & Activities Platform — Frontend

**Live Client:** [https://events-activities-frontend-chi.vercel.app](https://events-activities-frontend-chi.vercel.app)
**Live Server:** [https://events-activities-backend.vercel.app](https://events-activities-backend.vercel.app)

**GitHub Repositories:**

* **Frontend:** [https://github.com/md-munna-khan/EventsActivities-frontend](https://github.com/md-munna-khan/EventsActivities-frontend)
* **Backend:** [https://github.com/md-munna-khan/EventsActivities-backend](https://github.com/md-munna-khan/EventsActivities-backend)

**Video Walkthrough:** [https://drive.google.com/file/d/1IrgrVmQaY6CqQvTg5ChHipD2k1jyZXRN/view?usp=sharing](https://drive.google.com/file/d/1IrgrVmQaY6CqQvTg5ChHipD2k1jyZXRN/view?usp=sharing)

---
# Readme Confict Fixed
## 📌 Project Overview

Events & Activities is a role-based event management platform where users can **discover**, **join**, **create**, and **manage** real-life activities such as trips, concerts, workshops, meetups, sports events, and hobby gatherings.

The platform includes three user roles:

* **Client** – Browse and join events.
* **Host** – Create and manage events.
* **Admin** – Approve hosts, moderate the platform, and manage events & users.

This repository contains the **Frontend (Next.js App Router)** that communicates with the Backend API.

---

## 🛠️ Tech Stack

### **Frontend**

* Next.js (App Router)
* React.js
* TypeScript
* Tailwind CSS
* Cloudinary (images)
* JWT Authentication (httpOnly cookies)

### **Backend**

* Node.js / Express
* PostgreSQL + Prisma ORM
* Cloudinary
* JWT Auth

### **Deployment**

* **Frontend:** Vercel
* **Backend:** Vercel

---

## 🚀 Core Features

### 🔐 Authentication & Roles

* Login / Registration with JWT
* Role-based access control (Client, Host, Admin)
* Secure httpOnly cookies

### 👥 Client Features

* Browse all events
* Search, filter, and sort events
* Join and leave events
* View booked events dashboard
* Profile update
* Review hosts after event completion

### 🎤 Host Features

* Create, edit, and delete events
* Manage event participants
* Mark events as "Completed"
* Host dashboard with analytics
* Profile customization

### 🛡️ Admin Features

* Approve/reject host applications
* Approve events
* Manage users & hosts
* Platform-wide analytics
* Payment management

### ⭐ Additional Capabilities

* Image uploads to Cloudinary
* Pagination, sorting, filtering tools
* Responsive UI with mobile support
* SEO metadata for all public pages
* Review & Rating system for completed events

---

## 🔐 Test Credentials

### **Admin**

* Email: **[munnamia0200@gmail.com](mailto:munnamia0200@gmail.com)**
* Password: **Admin@12345**

### **Host**

* Email: **[host@gmail.com](mailto:host@gmail.com)**
* Password: **123456**

### **Client**

* Email: **[user@gmail.com](mailto:user@gmail.com)**
* Password: **123456**

> **Note:** For testing "Mark as Complete" and "Add Review" features, use the host & client accounts above.

---

## 🔧 Local Development (Frontend)

### **1. Clone the frontend repo**

```bash
git clone https://github.com/md-munna-khan/EventsActivities-frontend.git
cd EventsActivities-frontend
npm install
```

### **2. Create `.env.local` file**

```env
NEXT_PUBLIC_API_BASE_URL=https://events-activities-backend.vercel.app
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
```

### **3. Run locally**

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

---

## 🔧 Local Development (Backend)

Clone & install backend:

```bash
git clone https://github.com/md-munna-khan/EventsActivities-backend.git
cd EventsActivities-backend
npm install
```

### Add `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/events_db
JWT_SECRET=secret_key_here
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Run backend

```bash
npx prisma migrate dev
npm run dev
```

---

## 🗃️ Database: Prisma + PostgreSQL

* Fully typed schema
* Migrations included
* Cloudinary file storage supported

---

## 🧪 Testing Flow

1. Register/Login
2. Apply as host → Admin approval
3. Create event (Host)
4. Approve event (Admin)
5. Join event (Client)
6. After completion → Add Review

---

## 🔍 Troubleshooting

* For Next/Image using `fill`, always add a `sizes` prop.
* Rename the asset `public/evenzo .png` to `evenzo.png` to prevent build errors.
* For server actions redirect issues, return `{ redirectTo: '/path' }` instead of using `redirect()` directly.

---

##  Support / Contact

If you want help polishing the project, adding CI/CD, or improving the code quality, feel free to reach out.

**Developer:** Munna 

---


