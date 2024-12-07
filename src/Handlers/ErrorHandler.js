const fs = require('fs');
const path = require('path');

// Function to log errors to a file (optional)
function logToFile(errorType, errorDetails) {
    const logFilePath = path.join(__dirname, '../../logs/error.log');
    const logMessage = `[${new Date().toISOString()}] [${errorType}] ${errorDetails}\n\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
}

// Improved Anti-Crash Handler
module.exports = async (bot) => {
    // Common error handling function
    function handleError(type, error, origin) {
        const errorMessage = `[antiCrash] ⚠️ ${type}\nError: ${error}\nOrigin: ${origin}\nStack: ${error?.stack || 'N/A'}`;

        // Log to console with detailed information
        console.error(errorMessage);

        // Optional: Log to file
        logToFile(type, errorMessage);

        // Optional: Graceful shutdown if needed
        // process.exit(1); // Uncomment if you want to exit on critical errors
    }

    // Unhandled Rejection
    process.on("unhandledRejection", (reason, promise) => {
        handleError('Unhandled Rejection/Catch', reason, promise);
    });

    // Uncaught Exception
    process.on("uncaughtException", (error, origin) => {
        handleError('Uncaught Exception/Catch', error, origin);
    });

    // Uncaught Exception (Monitor)
    process.on("uncaughtExceptionMonitor", (error, origin) => {
        handleError('Uncaught Exception/Catch (Monitor)', error, origin);
    });

    // Multiple Promise Resolves
    process.on("multipleResolves", (type, promise, reason) => {
        const warningMessage = `[antiCrash] ⚠️ Multiple Resolves Detected\nType: ${type}\nPromise: ${promise}\nReason: ${reason}`;
        console.warn(warningMessage);

        // Optional: Log to file
        logToFile('Multiple Resolves', warningMessage);
    });
};
