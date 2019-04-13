$(() => {
    let socket = io.connect();
    let messageForm = $("#messageForm");
    let messageArea = $("#messageArea");
    let message = $("#message");
    let chat = $("#chat");
    let usernameForm = $("#usernameForm");
    let usernameArea = $("#usernameArea");
    let users = $("#users");
    let username = $("#username");

    messageForm.submit(e => {
        e.preventDefault();
        socket.emit("send message", message.val());
        message.val("");
    });

    message.keypress(e => {
        if (e.originalEvent.keyCode == 13) {
            e.preventDefault();
            socket.emit("send message", message.val());
            message.val("");
        }
    });

    socket.on("new message", data => {
        console.log(data);
        chat.append(
            '<div class="well"><strong>' +
                data.user +
                ":</strong> " +
                data.msg +
                "</div>"
        );
    });

    usernameForm.submit(e => {
        e.preventDefault();
        socket.emit("new user", username.val(), data => {
            if (data) {
                console.log(data);
                usernameArea.hide();
                messageArea.show();
            }
        });
        username.val("");
    });
    socket.on("get users", data => {
        let template = "";
        for (i = 0; i < data.length; i++) {
            template += '<li class="list-group-item">' + data[i] + "</li>";
        }
        users.html(template);
    });
});
