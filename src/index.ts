import { config } from "dotenv";
config();

import express, { Request, Response, NextFunction } from "express";
import categorizeRoutes from "./routes/routes";

const app = express();
app.use(express.json({ limit: '50mb' }));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large. Please reduce the size of your request below 50mb' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.use("/", categorizeRoutes);

app.listen(3000, () => console.log("API running on port 3000"));
