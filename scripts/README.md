# Scripts Directory

This directory contains client-side scripts and tools that interact with the calendar-categorizer-ts backend API.

## Google Apps Script (`google-apps-script.js`)

A Google Apps Script that automatically categorizes and color-codes Google Calendar events by calling the backend API.

### Setup Instructions

1. **Copy the script to Google Apps Script:**
   - Go to [script.google.com](https://script.google.com)
   - Create a new project
   - Copy the contents of `google-apps-script.js` into the editor

2. **Enable required Google services:**
   - In the Google Apps Script editor, go to "Services" (+ icon)
   - Add "Calendar API" service

3. **Test the connection:**
   - Run the `colorCodeWithAI()` function to test categorization
   - Check the logs for any errors

4. **Set up automation (optional):**
   - Create a trigger to run `colorCodeWithAI()` automatically
   - Recommended: Run every 1-2 hours to catch new events

### Functions

- `colorCodeWithAI()` - Main function that categorizes recently modified events
- `wasEventRecentlyModified(event)` - Checks if an event was modified in the last 24 hours

### How it Works

1. **Event Detection:** Finds events that were created or modified in the last 24 hours
2. **API Call:** Sends event titles and descriptions to the backend API
3. **Color Coding:** Applies predefined colors based on the AI categorization:
   - **Purple:** Church Schedule
   - **Orange:** Events to invite students to
   - **Blue:** Travel
   - **Green:** Appointment with Friends
   - **Red:** Other appointments
   - **Yellow:** Time-boxed To-do tasks

### Usage

1. **Manual execution:** Run `colorCodeWithAI()` in the Google Apps Script editor
2. **Automated execution:** Set up a time-based trigger to run every few hours
3. **Event processing:** Only processes events modified in the last 24 hours

### Configuration

The script is configured to:
- Use the deployed API at `https://calendarcolorizer.onrender.com/categorize`
- Process events from the default calendar
- Only categorize events modified within the last 24 hours
- Apply specific colors for each category type

### Notes

- The script only processes recently modified events to avoid re-processing old events
- Color coding is applied based on the AI categorization response
- Error handling is included for API failures
- The script is designed to be safe to run multiple times 