import { redirect } from "../helpers.js";
let queuesocket = null;

export function enterQueue() {
  queuesocket = new WebSocket("ws://localhost:3000/queue");
  queuesocket.onopen = () => {
    console.log("connected to the queue server");
  };
  queuesocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "quee-entered") {
      window.location.href = "game.html";
    }
    // redirect(data.id);
  };
}

export function leaveQueue() {
  queuesocket.close();
  queuesocket = null;
}

export function toggleQueue() {
  if (queuesocket === null) {
    enterQueue();
    return true;
  }

  leaveQueue();
  return false;
}
