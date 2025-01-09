import http from "node:http";
import app from "./app.js";
import socketUpgradeHandler from "./sockets/socketUpgradeHandler.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

socketUpgradeHandler(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
