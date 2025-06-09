import { Request, Response } from "express";
import { getCategoriesForEvents } from "../services/categorizeService";

export const categorizeEvents = async (req: Request, res: Response) => {
  const events = req.body;

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "Expected an array of events." });
  }

  try {
    const categories = await getCategoriesForEvents(events);
    res.json({ categories });
  } catch (error: any) {
    console.error("❌ AI categorization failed:", error.message);
    res.status(500).json({ error: "AI categorization failed." });
  }
};
