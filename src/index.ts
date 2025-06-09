import { config } from "dotenv";
config();

import express from "express";
import categorizeRoutes from "./routes/routes";

const app = express();
app.use(express.json());

app.use("/", categorizeRoutes);

app.listen(3000, () => console.log("API running on port 3000"));
