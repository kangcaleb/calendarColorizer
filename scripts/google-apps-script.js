const COLOR_MAP = {
    "Church Schedule": CalendarApp.EventColor.PURPLE,
    "Events to invite students to": CalendarApp.EventColor.ORANGE,
    "Travel": CalendarApp.EventColor.BLUE,
    "Appointment with Friends": CalendarApp.EventColor.GREEN,
    "Other appointments": CalendarApp.EventColor.RED,
    "Time-boxed To-do tasks": CalendarApp.EventColor.YELLOW,
  };
  
  function colorCodeWithAI() {
    const calendar = CalendarApp.getDefaultCalendar();
    const recentlyCreatedEvents = calendar.getEvents(
      new Date(),
      new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
    ).filter(event => wasEventRecentlyModified(event));
  
    if (recentlyCreatedEvents.length == 0) {
      console.log("No events to categorize today, returning...")
      return
    }
  
  
    // Send all event titles/descriptions at once
    const payload = recentlyCreatedEvents.map(event => ({
      title: event.getTitle(),
      description: event.getDescription()
    }));
  
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
  
    const response = UrlFetchApp.fetch("http://calendarcolorizer.onrender.com/categorize", options);
    const result = JSON.parse(response.getContentText());
  
    if (result.error) {
      console.log(result.error)
      throw new Error(result.error)
    }
  
    const categorizedEvents = result.categories;
  
    categorizedEvents.forEach(categorized => {
      const { title, category } = categorized;
      const color = COLOR_MAP[category];
      
      if (color) {
        // Find and update the first event with matching title
        const matchingEvent = recentlyCreatedEvents.find(event => event.getTitle() === title);
        if (matchingEvent) {
          matchingEvent.setColor(color);
        }
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
  