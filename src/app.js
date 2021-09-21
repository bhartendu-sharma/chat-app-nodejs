const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { msg_info, loc_info } = require("./helper/msg_loc_info");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./helper/users_info");
const path = require("path");
const hbs = require("hbs");

const socketio = require("socket.io");
const io = socketio(server);
const port = process.env.PORT || 8000;

// *********************create  path
const staticPath = path.join(__dirname, "../public");
// const templatePath = path.join(__dirname, "../templates/views"); // views path
// const partialsPath = path.join(__dirname, "../templates/partials");

// ********************* register path And router
app.use(express.static(staticPath));
// app.set("view engine", "hbs");
// app.set("views", templatePath);
// hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index");
});

io.on("connection", (s_socket) => {
  // set up listener
  s_socket.on("joinChat", (options, callback) => {
    //options is { username, room }

    //  const {err,user}=addUser({id:s_socket.id,username,room});
    const { err, user } = addUser({ id: s_socket.id, ...options });

    if (err) {
      console.log(err);
      return callback(err);
    }
    // console.log(user);
    // console.log(user.room);

    s_socket.join(user.room);

    s_socket.emit("displayMsg", msg_info("Admin", "welcome!"));

    s_socket.broadcast.emit(
      "displayMsg",
      msg_info(`${user.username} has joined! the chat.`)
    );

    callback();
  });

  s_socket.on("sendInputMsg", (msg, callbackAck) => {
    const user = getUser(s_socket.id);
    io.emit("displayMsg", msg_info(user.username, msg));
    callbackAck();
  });

  s_socket.on("sendLoc", (loc, callbackAck) => {
    const user = getUser(s_socket.id);
    const loc_url = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
    io.emit("displayLoc", loc_info(user.username, loc_url));
    callbackAck();
  });

  s_socket.on("disconnect", () => {
    // const user = removeUser(s_socket.id);
    const user = getUser(s_socket.id);
    if (user) {
      io.emit("displayMsg", msg_info("Admin", `${user.username} has left!`));
    }
  });
});

server.listen(port, () => console.log(`server created at ${port}`));
