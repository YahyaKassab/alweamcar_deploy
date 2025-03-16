const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { swaggerUi, swaggerDocs } = require('./config/swagger');
const { createRootAdmin } = require('./adminSeeder');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const carRoutes = require('./routes/car');
const seasonalOfferRoutes = require('./routes/seasonalOffer');
const whatWeDoRoutes = require('./routes/whatWeDo');
const newsRoutes = require('./routes/news');
const feedbackRoutes = require('./routes/feedback');
const makeRoutes = require('./routes/make');
const sendEmail = require('./utils/sendEmail');
const { seedData } = require('./dataSeeder');

const app = express();

// Create root admin upon startup
(async () => {
    await createRootAdmin();
  })();
  
// (async () => {
//     await seedData();
//   })();
  

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//     req.language = req.headers['accept-language'] === 'ar' ? 'ar' : 'en';
//     next();
// });

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Mount Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/seasonal-offers', seasonalOfferRoutes);
app.use('/api/what-we-do', whatWeDoRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/makes', makeRoutes);

// app.get('/send-test-email', async (req, res) => {
//     try {
//         await sendEmail({
//             email: 'ya7yakassab@gmail.com',
//             subject: 'Test Email',
//             message: 'This is a test email from your Node.js app!',
//         });

//         res.status(200).json({ success: true, message: 'Email sent successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Failed to send email' });
//     }
// });
// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
