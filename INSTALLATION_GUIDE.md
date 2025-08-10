# 💻 Manual Installation Guide for CHEAP & BEST

## Prerequisites
Before running this application on your computer, you need:
- **Node.js** (version 18 or higher) - Download from https://nodejs.org/
- **Git** (optional) - For downloading from GitHub

## Quick Start Commands

### Step 1: Download the Project
```cmd
# If you have Git installed:
git clone https://github.com/YOUR_USERNAME/CHEAP-BEST-Excel-Manager.git
cd CHEAP-BEST-Excel-Manager

# Or download ZIP from GitHub and extract it
# Then open Command Prompt in the extracted folder
```

### Step 2: Install Dependencies
```cmd
npm install
```
*This downloads all required packages (may take 2-3 minutes)*

### Step 3: Start the Application
```cmd
npm run dev
```
*This starts the server*

### Step 4: Open in Browser
- Open your web browser
- Go to: **http://localhost:5000**
- Your CHEAP & BEST application is now running!

## ⚠️ Important Notes

### Database Storage
The application will work immediately but with **temporary storage** (data is lost when you close the app).

For **permanent storage** like the deployed version, you need:
1. PostgreSQL database (free options: Supabase, Neon, Heroku Postgres)
2. Add these environment variables in a `.env` file:

```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=any_random_text_here_for_security
```

### Port Configuration
- Default port: **5000**
- If port 5000 is busy, the system will show an error
- To use a different port, set environment variable: `PORT=3000`

## Troubleshooting

### Common Issues:

**"command not found: npm"**
- Install Node.js from https://nodejs.org/
- Restart Command Prompt after installation

**"Port 5000 is already in use"**
- Close other applications using port 5000
- Or set a different port: `set PORT=3000` (Windows) or `export PORT=3000` (Mac/Linux)

**"Permission denied" errors**
- Run Command Prompt as Administrator (Windows)
- Use `sudo` prefix on Mac/Linux

**Dependencies installation fails**
- Try: `npm install --force`
- Or: `npm cache clean --force` then `npm install`

## Production Deployment

### For Basic Use (Development Mode):
```cmd
npm run dev
```

### For Production Use:
```cmd
# Build the application
npm run build

# Start production server
npm start
```

## Features Available Offline
✅ Excel file uploads and processing
✅ Data paste functionality  
✅ Month/year selection
✅ File downloads
✅ Admin interface (with temporary login)

❌ Permanent data storage (requires database setup)
❌ Automatic backups (requires database setup)

## Complete Setup with Database

For full functionality like the deployed version:

1. **Get a free PostgreSQL database:**
   - Supabase: https://supabase.com/
   - Neon: https://neon.tech/
   - Heroku Postgres: https://www.heroku.com/postgres

2. **Create `.env` file in project folder:**
```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your_secret_key_here
REPLIT_DOMAINS=localhost:5000
```

3. **Setup database tables:**
```cmd
npm run db:push
```

4. **Start with full functionality:**
```cmd
npm run dev
```

Now you have the complete CHEAP & BEST system with permanent storage!

## System Requirements
- **RAM**: Minimum 4GB recommended
- **Storage**: 500MB for application + dependencies
- **Internet**: Required for initial setup and dependency downloads
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18+)

## Getting Help
- Check console/terminal for error messages
- Ensure all dependencies installed correctly with `npm install`
- Verify Node.js version with `node --version`
- Check if port 5000 is available