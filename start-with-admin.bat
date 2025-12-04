@echo off
echo 🚀 Setting up Inesta Mode Application...
echo.

echo 📦 Starting backend server...
cd /d "C:\Users\pdmd\MINE\inesta-mode-backend"
start "Backend Server" cmd /c "npm run start:dev"

echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo 👤 Creating admin user...
cd /d "C:\Users\pdmd\MINE\inestaMode"
node scripts/create-admin.js

echo.
echo 🎉 Setup complete! Starting full application...
echo.
echo 📧 Admin Email: tandahmarcelle2@gmail.com
echo 🔐 Admin Password: marcelle1234  
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Admin Panel: http://localhost:5173/admin/login
echo.

npm run dev:fullstack

pause
