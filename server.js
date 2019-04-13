let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io").listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server Started");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/main.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
});

io.sockets.on("connection", socket => {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    //Disconnect
    socket.on("disconnect", data => {
        users.splice(users.indexOf(socket.username), 1);
        updateusernames;
        connections.splice(connections.indexOf(socket), 1);
        console.log("disconnected: %s sockets connected", connections.length);
    });

    //Send Message
    socket.on("send message", data => {
        io.sockets.emit("new message", { msg: data, user: socket.username });
    });

    //New user
    socket.on("new user", (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateusernames();
    });

    function updateusernames() {
        io.sockets.emit("get users", users);
    }
});
