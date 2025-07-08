const COLOR_MAP = {
  "Church Schedule": CalendarApp.EventColor.PURPLE,
  "Events to invite students to": CalendarApp.EventColor.ORANGE,
  "Travel": CalendarApp.EventColor.BLUE,
  "Appointment with Friends": CalendarApp.EventColor.GREEN,
  "Other appointments": CalendarApp.EventColor.RED,
  "Time-boxed To-do tasks": CalendarApp.EventColor.YELLOW,
};

function colorCodeWithAI() {
  const recentlyCreatedEvents = getRecentlyCreatedEvents()
  const payload = getPayload(recentlyCreatedEvents)

  if (payload == null || payload.length === 0) {
    console.log("No events today. Returning")
    return
  }

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  console.log("payload ", payload)
  const response = UrlFetchApp.fetch("http://calendarcolorizer.onrender.com/categorize", options);

  let result;
  try {
    result = JSON.parse(response.getContentText());
  } catch (e) {
    console.error('Failed to parse JSON:', e, response.getContentText());
    throw new Error('Failed to parse server response as JSON.');
  } 

  if (result.error) {
    console.error(result.error)
    throw new Error(result.error)
  }

  const categorizedEvents = result.categories;
  console.log("API categorization success", categorizedEvents)

  const idEventMap = Object.fromEntries(
    recentlyCreatedEvents.map((event, index) => [
      event.getId(),
      event
    ])
  );


  categorizedEvents.forEach(categorized => {
    const { eventId, category } = categorized;
    const color = COLOR_MAP[category];
    
    if (color) {
      const matchingEvent = idEventMap[eventId]
      if (matchingEvent) {
        matchingEvent.setColor(color); // TODO
      } else {
        console.error("Event categorized couldn't be matched to a event sent via payload")
      }
    } else {
      console.error("no color found for category")
    }
  });

}

function wasEventRecentlyModified(event) {
  const created = new Date(event.getDateCreated()).getTime();
  const updated = new Date(event.getLastUpdated?.() ?? created).getTime(); // fallback if no update method
  const mostRecent = Math.max(created, updated);

  const now = Date.now();
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

  return now - mostRecent <= twentyFourHoursInMilliseconds;
}

function getRecentlyCreatedEvents() {
  const calendar = CalendarApp.getDefaultCalendar();
  return calendar.getEvents(
    new Date(),
    new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
  ).filter(event => wasEventRecentlyModified(event));
}

function getPayload(recentlyCreatedEvents) {
  return recentlyCreatedEvents.map(event => ({
    eventId: event.getId(),
    title: event.getTitle(),
    description: event.getDescription()
  }));
}
