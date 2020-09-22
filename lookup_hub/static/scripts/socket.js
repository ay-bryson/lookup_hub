var socket;


function startSocket() {
    socket = io.connect("http://" + document.domain + ":" + location.port);

    socket.on("connect", () => {
        $("#socket-status").text("Connected").removeClass("disconnected").addClass("connected");
    })

    socket.on("disconnect", () => {
        $("#socket-status").text("Disconnected").removeClass("connected").addClass("disconnected");
    })

    socket.on("updated", data => {
        $("#" + data["id"]).text(data["value"]);
    })
}



function updateCell(key, target, text) {
    var data = {
        rowid: key,
        target: target,
        value: text,
    }

    socket.emit("update_cell", data);
}


startSocket();