Basic Description:

The TrackerTestLog.js script utilizes Puppeteer to automate a Chrome or Chromium browser. It performs the following functions:

Log Configuration:

Creates directories to store screenshots (screenshots) and logs (logs).
Clears any previous data in these directories to start with a clean structure.
Environment Selection:

Enter a custom URL.
Sets the application and network filter URLs based on the user's choice.
Puppeteer Setup:

Initializes the Puppeteer browser with specific settings, such as starting maximized and disabling certain automation features.
Navigates to the URL specified by the user.
Log Capturing:

Console Logs: Records all console messages from the browser in real-time.
Network Logs: Records all network requests and responses that match the user's specified filter, ignoring OPTIONS type requests.
Screenshot Capturing:

Takes screenshots of the page at intervals defined by the user (default is 2 seconds).
Saves the screenshots in the screenshots folder with a timestamp in the filename.
Log Rotation:

Monitors the size of the network log file and creates new log files when the size exceeds 200 KB to prevent logs from becoming excessively large.
Browser Monitoring:

Monitors the browser's closure and properly terminates the script, ensuring all logs are saved before exiting.
Requirements:

Dependency Installation:
Run npm install in the project directory to install all necessary dependencies defined in the package.json.
Chromium/Chrome Installation:
Ensure that Google Chrome or Chromium is installed on the computer. Puppeteer will use the specified executable (C:\Program Files\Google\Chrome\Application\chrome.exe). If using a different path, update the executablePath in Puppeteer's settings accordingly.