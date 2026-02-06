const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("nueva_cita", (data) => {
    console.log("Nueva cita recibida:", data);

    io.emit("notificacion", {
      mensaje: "Se ha agendado una nueva cita",
      cita: data,
    });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.listen(4000, () => {
  console.log("Servicio de notificaciones en http://localhost:4000");
});
