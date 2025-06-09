import { Router } from "express";
import { categorizeEvents } from "../controllers/categorizeController";

const router = Router();

router.get("/", (_req, res) =>
  res.send("Calendar Categorizer API is running!"),
);
router.post("/categorize", categorizeEvents);

export default router;
