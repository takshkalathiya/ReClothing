const dotenv = require('dotenv');
// Load environment variables before anything else
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5001;

// Connect to MongoDB and start HTTP server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[SERVER] ReWear API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[SERVER] Health check available at http://localhost:${PORT}/api/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[UNHANDLED REJECTION] ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(`[UNCAUGHT EXCEPTION] ${err.message}`);
      process.exit(1);
    });
  } catch (error) {
    console.error(`[FATAL] Server initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
