# Calendar Categorizer API (TypeScript)

A simple Express + TypeScript API that uses OpenAI to categorize calendar events.

## Running locally - Getting Started

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
