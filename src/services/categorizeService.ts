import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CalendarEvent {
  eventId: string;
  title: string;
  description?: string;
}

export const getCategoriesForEvents = async (
  events: CalendarEvent[],
): Promise<string[]> => {
  const eventList = events
  .map(
    (event) =>
      `Event ${event.eventId}:\nTitle: ${event.title}\nDescription: ${event.description || ""}`
  )
  .join("\n\n");

  const prompt = `Categorize each calendar event into one of the following categories:

  - Church Schedule
  - Events to invite students to
  - Travel
  - Appointment with Friends
  - Other appointments
  - Time-boxed To-do tasks
  
  Use these human-readable category names to decide which category fits best.  
  However, in the JSON output, use the **no-whitespace camelCase version** of the category name, as shown below:
  
  Church Schedule → ChurchSchedule  
  Events to invite students to → EventsToInviteStudentsTo  
  Appointment with Friends → AppointmentWithFriends  
  Other appointments → OtherAppointments  
  Time-boxed To-do tasks → TimeBoxedToDoTasks  
  Travel → Travel
  
  Here are the events to categorize:
  
  ${eventList}
  
  Return only a JSON array of objects with this format:
  
  [
    { "eventId": "1234567890", "category": "ChurchSchedule" },
    { "eventId": "1234567891", "category": "EventsToInviteStudentsTo" }
  ]
  
  ⚠️ Do not include any explanation, headings, or repeat the input text.  
  ✅ Only return **valid JSON**.`;     

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
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
