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
        print(data["id"])
        print(data["value"])
        $("#" + data["id"]).text(data["value"]);
    })
}


function testUpdate(id, targetLang, value) {
    socket.emit("update_cell", {
        id: id,
        target_language: targetLang,
        new_value: value,
    });
}



function updateCell(key, targetLang, text) {
    var data = {
        key: key,
        target_language: targetLang,
        value: text,
    }

    socket.emit("update_cell", data);
}


startSocket();