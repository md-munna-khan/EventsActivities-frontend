# EventsActivities Frontend

A modern, full-featured frontend application for managing events and activities, built with Next.js 16, TypeScript, and Tailwind CSS. This application provides role-based access control with separate dashboards for Administrators, Hosts, and Clients.

## 🚀 Features

### Authentication
- User registration and login
- Password reset functionality
- Forget password flow
- JWT-based authentication
- Secure token handling

### Role-Based Access Control
The application supports three distinct user roles:

#### 👤 **Client**
- View and manage appointments
- Book new appointments
- Access medical records and prescriptions
- View health records
- Profile management

#### 🎯 **Host**
- Create and manage events
- View all events and personal events
- Manage event participants
- Schedule management
- Event details management

#### 🔐 **Admin**
- User management (Admins, Doctors, Patients)
- Hospital management
- Appointment management
- Schedule management
- Specialities management

### UI/UX Features
- 🎨 Modern, responsive design with Tailwind CSS
- 🌓 Dark/Light theme support
- 📱 Mobile-responsive layout
- 🎭 Beautiful UI components from shadcn/ui
- ⚡ Fast and optimized performance
- 🔔 Toast notifications for user feedback
- 📊 Data tables with pagination and filtering

## 🛠️ Tech Stack

### Core
- **Next.js 16.0.0** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling

### UI Components
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Utilities
- **Zod 4.1.12** - Schema validation
- **date-fns 4.1.0** - Date formatting
- **jsonwebtoken** - JWT handling
- **next-themes** - Theme management
- **react-spinners** - Loading indicators

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EventsActivities-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Add your environment variables here
   # Example:
   # NEXT_PUBLIC_API_URL=your_api_url
   # JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (commonLayout)/    # Public pages with common layout
│   │   ├── (auth)/        # Authentication pages
│   │   └── page.tsx       # Home page
│   └── (dashboardLayout)/ # Protected dashboard pages
│       └── admin/         # Admin dashboard
├── components/            # React components
│   ├── modules/           # Feature-specific modules
│   │   └── Dashboard/     # Dashboard components
│   ├── shared/            # Reusable shared components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── auth-utils.ts      # Authentication utilities
│   ├── formatters.ts      # Data formatting
│   ├── jwtHanlders.ts     # JWT token handling
│   └── navItems.config.ts # Navigation configuration
├── services/              # API service functions
│   └── auth/              # Authentication services
├── types/                 # TypeScript type definitions
└── zod/                   # Zod validation schemas
```

## 🔐 Authentication Flow

1. **Registration**: Users can create an account with email and password
2. **Login**: Users authenticate with credentials and receive JWT tokens
3. **Token Management**: Tokens are securely stored and managed
4. **Protected Routes**: Dashboard routes require authentication
5. **Role-Based Routing**: Users are redirected to their role-specific dashboard

## 🎨 Theming

The application supports both light and dark themes:
- Theme preference is stored and persisted
- System theme detection is enabled
- Smooth theme transitions

## 🔧 Configuration

### Next.js Config
- Image optimization with Cloudinary support
- React Compiler support (optional)

### Navigation
Navigation items are configured in `src/lib/navItems.config.ts` and are dynamically generated based on user roles.

## 📝 Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Zod** for runtime validation
- Consistent code formatting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- Your Team Name

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful component library
- All open-source contributors whose packages made this project possible

---

**Note**: This is a frontend application. Make sure you have the corresponding backend API running and properly configured for full functionality.

