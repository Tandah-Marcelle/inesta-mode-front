import fetch from 'node-fetch';

const createAdmin = async () => {
  const adminData = {
    firstName: "Marcelle",
    lastName: "Tandam", 
    email: "tandahmarcelle2@gmail.com",
    password: "marcelle1234"
  };

  try {
    console.log('🔧 Creating admin user...');
    
    const response = await fetch('http://localhost:3000/auth/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to create admin:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔐 Password:', adminData.password);
    console.log('🎯 You can now login at: http://localhost:5173/admin/login');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend server is not running. Please start the backend first.');
      console.log('💡 Run: npm run dev:backend');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  }
};

createAdmin();
