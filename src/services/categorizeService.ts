import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CalendarEvent {
  title: string;
  description?: string;
}

export const getCategoriesForEvents = async (
  events: CalendarEvent[],
): Promise<string[]> => {
  const eventList = events
    .map(
      (event, i) =>
        `Event ${i + 1}:
        Title: "${event.title}"
        Description: "${event.description || ""}"`,
    )
    .join("\n\n");

  const prompt = `Categorize each calendar event into one of the following categories:
          - Church Schedule
          - Events to invite students to
          - Travel
          - Appointment with Friends
          - Other appointments
          - Time-boxed To-do tasks

      ${eventList}

      Return a JSON array of objects with "title" and "category" for each event, like so:
[
  { "title": "Event Title", "category": "Church Schedule" },
  { "title": "Another Event", "category": "Travel" }
]`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that classifies calendar events.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 200,
    temperature: 0,
  });

  const output = response.choices[0].message.content?.trim() || "[]";
  const parsed = JSON.parse(output);

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid response format.");
  }

  return parsed;
};
