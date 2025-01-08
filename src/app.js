import express from "express";
import dotenv from "dotenv";
import gameRoute from "./routes/gameRoute.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use("/static", express.static("public"));

app.use("/game", gameRoute);

export default app;
