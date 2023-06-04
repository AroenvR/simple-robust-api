const fs = require('fs-extra');
const path = require('path');

/* 
    Simple node script to delete all testing logs.
    
    Execute with: 
    node scripts/clear_test_logs.js
*/

const logsDirectory = './src/__tests__/logs';

async function deleteTestingLogs() {
    try {
        // Read the contents of the logs directory
        const files = await fs.readdir(logsDirectory);

        // Filter out testing log files.
        const testLogFiles = files.filter(file => file.endsWith('.test.log'));

        // Delete each testing log file
        for (const testLogFile of testLogFiles) {
            const filePath = path.join(logsDirectory, testLogFile);
            await fs.unlink(filePath);
            console.log(`Deleted: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting testing logs: ${error.message}`);
    }
}
deleteTestingLogs();