import http from "node:http";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// TODO: Implement the setupSocketServer function

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
