import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/static", express.static("public"));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

export default app;
