import { writeFileSync, mkdirSync, existsSync, appendFileSync } from 'fs';
import { join } from 'path';

// --- Configuration ---
const LOGS_DIR = './logs';

// --- LOGGING TYPE ---

const CSV_LOG_FILE = join(LOGS_DIR, 'reasoning_logs.csv'); // Logs for adding reasoning
// const CSV_LOG_FILE = join(LOGS_DIR, 'normal_logs.csv'); // Regular logs
// const CSV_LOG_FILE = join(LOGS_DIR, 'vision_logs.csv'); // Logs for adding vision

// --------------------

// --- Helper Functions ---
function ensureDirectoryExistence(dirPath) {
    if (!existsSync(dirPath)) {
        try {
            mkdirSync(dirPath, { recursive: true });
            console.log(`[Logger] Created directory: ${dirPath}`);
            if (!existsSync(CSV_LOG_FILE)) {
                // Write CSV header if the file is newly created
                writeFileSync(CSV_LOG_FILE, 'input,output\n');
            }
        } catch (error) {
            console.error(`[Logger] Error creating directory ${dirPath}:`, error);
        }
    }
}

// --- Main Logging Function ---
export function log(prompt, response) {
  // Trim to remove any leading/trailing whitespace for both the prompt and response
    const trimmedPrompt = prompt ? prompt.trim() : "";
    const trimmedResponse = response ? response.trim() : "";
    // Check if either is empty or if they are equal (for some reason)
    if (!trimmedPrompt && !trimmedResponse || trimmedPrompt === trimmedResponse) {
      return; // Skip logging if both are empty
    }
    const csvEntry = `"${trimmedPrompt.replace(/"/g, '""')}","${trimmedResponse.replace(/"/g, '""')}"\n`;

    // 1. Log to CSV File
    try {
        ensureDirectoryExistence(LOGS_DIR); // Ensure directory exists before writing
        appendFileSync(CSV_LOG_FILE, csvEntry);
    } catch (error) {
        console.error(`[Logger] Error writing to CSV log file ${CSV_LOG_FILE}:`, error);
    }
}