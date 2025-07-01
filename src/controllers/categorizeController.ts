import { Request, Response } from "express";
import { getCategoriesForEvents } from "../services/categorizeService";

export const categorizeEvents = async (req: Request, res: Response) => {
  const events = req.body;

  if (!Array.isArray(events)) {
    const expectedArrayOfEventsMessage = "Expected an array of events.";

    console.error("❌ AI categorization failed:", expectedArrayOfEventsMessage);
    return res.status(400).json({ error: expectedArrayOfEventsMessage })
  }

  try {
    const categories = await getCategoriesForEvents(events);
    res.json({ categories });
  } catch (error: any) {
    console.error("❌ AI categorization failed:", error.message);
    res.status(500).json({ error: "AI categorization failed: " + error.message });
  }
};
