export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function closeSocketWithErrorResponse(socket, code, message) {
  socket.write(`HTTP/1.1 ${code} ${message}\r\n\r\n`);
  socket.destroy();
}

export function sendMessage(socket, type, object) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type,
        ...object,
      }),
    );
  }
}

export function broadcastMessage(sockets, type, object) {
  sockets.forEach((socket) => {
    sendMessage(socket, type, object);
  });
}

export function parseSocketQueryParams(request) {
  const url = new URL(request.url, `ws://${request.headers.host}`);
  const queryParams = {};
  for (const [key, value] of url.searchParams.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
}
