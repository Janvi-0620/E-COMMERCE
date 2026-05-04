// ============================================
// Server Entry Point
// ============================================
// Starts the Express server and connects to MongoDB

import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import logger from './utils/logger.js';

const PORT = env.server.port;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════════╗
║     🚀 E-Commerce API Server Started      ║
╠════════════════════════════════════════════╣
║ Environment: ${env.server.nodeEnv.toUpperCase().padEnd(30)}║
║ Port: ${PORT.toString().padEnd(38)}║
║ API URL: http://localhost:${PORT.toString().padEnd(24)}║
║ API Prefix: ${env.server.apiPrefix.padEnd(29)}║
╚════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      logger.info('🛑 Received shutdown signal, closing server gracefully...');

      server.close(() => {
        logger.info('✅ Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection at:', promise, 'Reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
