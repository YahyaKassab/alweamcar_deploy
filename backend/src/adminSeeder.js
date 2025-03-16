// Create in a new file: seeder.js
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Create root admin function
const createRootAdmin = async () => {
  try {
    console.log('Checking for existing root admin...');
    
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      console.log('No admin found. Creating root admin...');
      
      // Root admin details - should be stored in environment variables in production
      const rootAdmin = {
        name: process.env.ROOT_ADMIN_NAME || 'Root Administrator',
        email: process.env.ROOT_ADMIN_EMAIL || 'admin@example.com',
        mobile: process.env.ROOT_ADMIN_MOBILE || '1234567890',
        password: process.env.ROOT_ADMIN_PASSWORD || 'password123',
      };
      
      // Create the root admin
      await Admin.create(rootAdmin);
      console.log('Root admin created successfully');
    } else {
      console.log('Admin already exists. Skipping root admin creation.');
    }
  } catch (err) {
    console.error('Error creating root admin:', err);
  }
};

// Export the function for use in server.js
module.exports = { createRootAdmin };
