let ioInstance = null;

/**
 * Thin wrapper around the Socket.IO server instance so any controller
 * can emit real-time events (e.g. "application:updated", "internship:new")
 * without passing `io` through every function call.
 */
const initSocket = (io) => {
  ioInstance = io;
  io.on("connection", (socket) => {
    // Clients join a room based on role so we can target broadcasts,
    // e.g. only placement_admin dashboards get every event.
    socket.on("join", (room) => socket.join(room));
  });
};

const emitEvent = (event, payload, room = null) => {
  if (!ioInstance) return;
  if (room) {
    ioInstance.to(room).emit(event, payload);
  } else {
    ioInstance.emit(event, payload);
  }
};

module.exports = { initSocket, emitEvent };
