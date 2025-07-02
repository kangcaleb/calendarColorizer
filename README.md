# Calendar Categorizer API (TypeScript)

A simple Express + TypeScript API that uses OpenAI to categorize calendar events.

## Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file:

   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Run the server:
   ```
   npm run dev
   ```

POST to `/categorize` with:

```json
{
  "events": [
    { "title": "Lunch with Tom", "description": "Noon at Chipotle" },
    { "title": "Church Service", "description": "10am Sunday" }
  ]
}
```

## Deployment
Calendar Categorizer is accessible at https://calendarcolorizer.onrender.com.

## Client Scripts

The `scripts/` directory contains client-side tools and scripts:

- **Google Apps Script** (`scripts/google-apps-script.js`) - Automatically categorizes Google Calendar events by calling this API
- See `scripts/README.md` for detailed setup and usage instructions
