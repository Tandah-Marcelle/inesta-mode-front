import { spawn } from 'child_process';
import fetch from 'node-fetch';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const setupAdmin = async () => {
  console.log('🚀 Setting up Inesta Mode Application...\n');
  
  // Start backend
  console.log('📦 Starting backend server...');
  const backend = spawn('npm', ['run', 'dev:backend'], {
    cwd: process.cwd(),
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let backendReady = false;
  
  backend.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Nest application successfully started')) {
      backendReady = true;
    }
  });

  // Wait for backend to be ready
  console.log('⏳ Waiting for backend to start...');
  let attempts = 0;
  while (!backendReady && attempts < 30) {
    await sleep(1000);
    attempts++;
    if (attempts % 5 === 0) {
      console.log(`   Still waiting... (${attempts}/30)`);
    }
  }

  if (!backendReady) {
    console.log('❌ Backend failed to start within 30 seconds');
    backend.kill();
    return;
  }

  console.log('✅ Backend is ready!\n');

  // Create admin user
  const adminData = {
    firstName: "Marcelle",
    lastName: "Tandam", 
    email: "tandahmarcelle2@gmail.com",
    password: "marcelle1234"
  };

  try {
    console.log('👤 Creating admin user...');
    
    const response = await fetch('http://localhost:3000/auth/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    if (response.ok) {
      console.log('✅ Admin user created successfully!\n');
      console.log('🎉 Setup Complete!');
      console.log('='.repeat(50));
      console.log('📧 Admin Email: tandahmarcelle2@gmail.com');
      console.log('🔐 Admin Password: marcelle1234');  
      console.log('🌐 Frontend: http://localhost:5173');
      console.log('🔧 Admin Panel: http://localhost:5173/admin/login');
      console.log('='.repeat(50));
      console.log('\n💡 To start the application:');
      console.log('   npm run dev:fullstack');
    } else {
      const errorText = await response.text();
      console.log('⚠️ Admin user may already exist or there was an error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }

  // Kill backend
  backend.kill();
  console.log('\n✨ Setup completed! Backend stopped.');
  console.log('You can now run: npm run dev:fullstack');
};

setupAdmin();
