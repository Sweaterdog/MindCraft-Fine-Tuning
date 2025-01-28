import { writeFileSync, mkdirSync, existsSync, appendFileSync } from 'fs';
import { join } from 'path';

// --- Configuration ---
const LOGS_DIR = './logs';

// --- Log File Paths ---
const REASONING_LOG_FILE = join(LOGS_DIR, 'reasoning_logs.csv'); // Logs for reasoning
const NORMAL_LOG_FILE = join(LOGS_DIR, 'normal_logs.csv'); // Regular logs
const VISION_LOG_FILE = join(LOGS_DIR, 'vision_logs.csv'); // Logs for vision (future logic)

// --- Helper Functions ---
function ensureDirectoryExistence(dirPath, logFile) {
    if (!existsSync(dirPath)) {
        try {
            mkdirSync(dirPath, { recursive: true });
            console.log(`[Logger] Created directory: ${dirPath}`);
        } catch (error) {
            console.error(`[Logger] Error creating directory ${dirPath}:`, error);
        }
    }

    if (!existsSync(logFile)) {
        try {
            writeFileSync(logFile, 'input,output\n'); // Write CSV header if the file is newly created
        } catch (error) {
            console.error(`[Logger] Error creating log file ${logFile}:`, error);
        }
    }
}

// --- Auto-Detection for Log Type ---
function determineLogFile(response) {
    if (response.includes('<think>') && response.includes('</think>')) {
        return REASONING_LOG_FILE; // Reasoning log if output contains <think> tags
    }

    // Placeholder for vision testing logic
    // if (/* Vision-specific condition */) {
    //     return VISION_LOG_FILE; // Vision log if vision condition is met
    // }

    return NORMAL_LOG_FILE; // Default to normal logs
}

// --- Main Logging Function ---
export function log(prompt, response) {
    // Trim inputs to remove leading/trailing whitespace
    const trimmedPrompt = prompt ? prompt.trim() : "";
    const trimmedResponse = response ? response.trim() : "";

    // Skip logging if both are empty or if they are identical
    if (!trimmedPrompt && !trimmedResponse || trimmedPrompt === trimmedResponse) {
        return;
    }

    // Determine the correct log file
    const logFile = determineLogFile(trimmedResponse);

    // Ensure the directory and log file exist
    ensureDirectoryExistence(LOGS_DIR, logFile);

    // Prepare the CSV entry
    const csvEntry = `"${trimmedPrompt.replace(/"/g, '""')}","${trimmedResponse.replace(/"/g, '""')}"\n`;

    // Append the entry to the correct log file
    try {
        appendFileSync(logFile, csvEntry);
    } catch (error) {
        console.error(`[Logger] Error writing to CSV log file ${logFile}:`, error);
    }
}
