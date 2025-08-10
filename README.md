# CHEAP & BEST - Excel Data Management System

A professional web application for managing Excel sheet data with secure admin authentication, file upload/paste functionality, and cross-platform download support.

## 🚀 Features

### User Features
- **Bold "CHEAP & BEST" Title** - Professional branding with perfect typography
- **Month Selection** - Dropdown with all 12 months (January through December)
- **Year Input** - Manual year entry for flexible date ranges
- **Excel Data Paste** - Copy from Excel and paste directly, automatically recreates sheet appearance
- **File Upload** - Upload .xlsx, .xls, .csv files with drag-and-drop interface
- **Data Preview** - Real-time preview showing how data will appear
- **Send to Admin** - Secure data transmission to admin dashboard

### Admin Features
- **Secure Login** - Authentication via Replit Auth system
- **Welcome Dashboard** - Professional admin interface with statistics
- **Data Management** - View, download, and delete data entries
- **Download Options** - Individual file downloads or bulk download all files
- **Cross-Platform Downloads** - Works on PC and Android devices
- **Data Statistics** - Total files, records, and monthly summaries
- **Database Backups** - Automated daily backups with manual backup creation

## 🏗️ Technical Architecture

### Frontend
- **React + TypeScript** - Modern, type-safe frontend development
- **Vite** - Fast development and optimized production builds
- **Tailwind CSS + Shadcn/UI** - Beautiful, responsive design system
- **TanStack Query** - Efficient server state management
- **Wouter** - Lightweight client-side routing

### Backend
- **Express.js** - Robust REST API server
- **TypeScript** - Full-stack type safety
- **Drizzle ORM** - Type-safe database operations
- **Passport.js** - Secure authentication middleware
- **Multer** - File upload handling
- **XLSX** - Excel file processing library

### Database & Storage
- **PostgreSQL (Neon)** - Production-grade, permanent database storage
- **Automated Backups** - Daily automatic backups with manual backup options
- **Session Storage** - PostgreSQL-backed user sessions
- **Data Persistence** - All data permanently stored (not temporary)

### Authentication
- **Replit Auth** - Secure OpenID Connect authentication
- **Session Management** - Persistent login sessions
- **Admin Protection** - Route-level authentication for admin features

## 📁 Database Storage

**IMPORTANT**: This application uses **permanent PostgreSQL storage**, not temporary storage:

- **Database Type**: Neon PostgreSQL (Production-grade)
- **Storage Location**: Persistent cloud database
- **Backup System**: Automated daily backups + manual backup creation
- **Data Retention**: All data is permanently stored and retrievable
- **GitHub Deployment**: Database remains persistent across deployments

### Backup Features
- Automatic daily database backups
- Manual backup creation via admin dashboard
- Backup files stored in `/backups` directory
- JSON format for easy data portability

## 🚀 Deployment

### Local Development (Manual Setup)

**Prerequisites:**
- Node.js (version 18 or higher)
- Git

**Step 1: Download and Setup**
```cmd
# Clone or download the repository from GitHub
git clone https://github.com/YOUR_USERNAME/CHEAP-BEST-Excel-Manager.git
cd CHEAP-BEST-Excel-Manager

# Install dependencies
npm install
```

**Step 2: Environment Variables**
Create a `.env` file in the project root with these variables:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_random_secret_key_here
REPL_ID=your_replit_app_id
REPLIT_DOMAINS=localhost:5000,127.0.0.1:5000
```

**Step 3: Database Setup**
```cmd
# Push database schema (creates tables)
npm run db:push
```

**Step 4: Start the Application**
```cmd
# Start the development server
npm run dev
```

**Step 5: Access the Application**
- Open your browser and go to: `http://localhost:5000`
- The application will be running on port 5000

**Alternative: Production Build**
```cmd
# Build for production
npm run build

# Start production server (if available)
npm start
```

### GitHub Deployment
1. Push code to GitHub repository
2. Deploy to Replit or other hosting platform
3. Configure environment variables in production
4. Database will persist across deployments (using Neon PostgreSQL)

## 🔐 Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPL_ID` - Replit application ID
- `REPLIT_DOMAINS` - Allowed domains for authentication

## 📝 Usage

### For Users
1. Visit the main page
2. Select month and enter year
3. Either paste Excel data or upload a file
4. Preview your data
5. Click "Send to Admin" to submit

### For Administrators
1. Click "Access Admin Panel" to log in
2. View dashboard with data statistics
3. Manage uploaded data (view, download, delete)
4. Create manual backups as needed
5. Download individual files or all files at once

## 🛠️ Technical Details

### File Support
- **.xlsx** - Excel 2007+ format
- **.xls** - Legacy Excel format
- **.csv** - Comma-separated values

### Data Processing
- Automatic Excel parsing using XLSX library
- Tab-separated paste data parsing
- JSON storage format for database efficiency
- Real-time data preview generation

### Security Features
- Authentication required for admin access
- Session-based security
- File upload validation
- SQL injection protection via Drizzle ORM

## 📊 Admin Dashboard Features

The admin dashboard provides comprehensive data management:

- **Statistics Overview**: Total files, records, and monthly counts
- **Data Table**: Sortable table with all uploaded data entries
- **Action Buttons**: View, download, and delete for each entry
- **Bulk Operations**: Download all files, refresh data, create backups
- **Professional UI**: Clean, modern interface with responsive design

## 🔄 Data Flow

1. **User Submission**: Data pasted/uploaded from main page
2. **Processing**: Excel files parsed, data validated
3. **Storage**: Data stored in PostgreSQL database
4. **Admin Access**: Admins can view and manage all submissions
5. **Download**: Data can be downloaded back to Excel format
6. **Backup**: Regular backups ensure data safety

This application provides a complete solution for Excel data management with professional-grade features and permanent data storage.