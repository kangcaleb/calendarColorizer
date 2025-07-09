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
        `Event ${event.eventId}:
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
  
  Return a JSON array of objects with "eventId" and "category" (using the no-whitespace key format), like so:
  
  [
    { "eventId": "1234567890", "category": "ChurchSchedule" },
    { "eventId": "1234567891", "category": "Travel" }
  ]
  
  Use the **no-whitespace** version of the category name (camel case, no spaces) in the JSON output, as shown below:
  
  Church Schedule → ChurchSchedule  
  Events to invite students to → EventsToInviteStudentsTo  
  Appointment with Friends → AppointmentWithFriends  
  Other appointments → OtherAppointments  
  Time-boxed To-do tasks → TimeBoxedToDoTasks`;

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
