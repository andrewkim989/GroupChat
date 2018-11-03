var express = require("express");
var path = require("path");
var app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

const server = app.listen(9000, function() {
    console.log("Listening on port 9000");
});
const io = require('socket.io')(server);

var username;
var users = {};
var chat = [];

app.get('/', function(req, res) {
    res.render("chat", {chat: chat, users: users});
});

io.on('connection', function (socket) {
    socket.emit("showmessages", chat);

    socket.on("createuser", function (name) {
        username = name["name"];
        console.log(name["name"]);
        users[socket.id] = username;
        socket.emit("newuser", {
            username: username
        });
    });

    socket.on("postmessage", function (message) {
        console.log(message["message"]);
        var name = users[socket.id];
        chat.push(name + ": " + message["message"]);
        io.emit("messageboard", {
            chat: chat[chat.length - 1]
        });
    });
});