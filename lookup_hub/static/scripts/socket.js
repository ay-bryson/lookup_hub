var socket;
var currentEntry;


function startSocket() {
    socket = io.connect("http://" + document.domain + ":" + location.port);

    socket.on("pong", () => {
        $("#socket-status").text("Connected").removeClass("disconnected").addClass("connected");
    })

    socket.on("disconnect", () => {
        $("#socket-status").text("Disconnected").removeClass("connected").addClass("disconnected");
    })

    socket.on("got_entry", data => {
        currentEntry = data["entry_id"];
        showEditWindow(data);
    })

    socket.on("updated_entry", (data) => {
        var entry = new Entry(data["new_entry"])

        dictionary.replace(entry)
    })

    socket.on("inserted_row", (data) => {
        var atID = data["entry_id"];
        var entry = new Entry(data["new_entry"]);
        dictionary.addRow(entry, atID);
    })

    socket.on("removed_row", (data) => {
        var atID = data["entry_id"];
        dictionary.remove(atID);
    })
}


function updateDictionary(entryID, data) {
    findEntryElem(entryID, "de").text(data["new_entry"]["de"]["text"]);
    findEntryElem(entryID, "en").text(data["new_entry"]["en"]["text"]);
    findEntryElem(entryID, "nl").text(data["new_entry"]["nl"]["text"]);
}



function findEntryElem(entryID, targLang) {
    var allMatches = $("[data-key='" + entryID + "']");

    if (targLang === undefined) {
        return allMatches;
    } else {
        return allMatches.filter( function() {
            return $(this).attr('data-target-language') == targLang;
        });
    }
}


function getEntry(entryID) {
    var data = {
        entry_id: entryID,
    };

    socket.emit("get_entry", data);
}


function showEditWindow(data) {
    $("#popup-container").show();
    $("#edit-entry-grid").css("display", "grid");
    for (lang of ["en", "de", "nl"]) {
        for (item of ["text", "comment"]) {
            try {
                $("#" + item + "-" + lang).val(data["entry"][lang][item]);
            } catch(error) {
                print(error)
            }
        }
    }
}


function nullIfEmpty(string) {
    if (string == "") {
        return null;
    } else {
        return String(string);
    }
}


function submitChanges() {
    newEntry = {
        en: {
            text: $("#text-en").val(),
            comment: nullIfEmpty($("#comment-en").val()),
        },
        de: {
            text: $("#text-de").val(),
            comment: nullIfEmpty($("#comment-de").val()),
        },
        nl: {
            text: $("#text-nl").val(),
            comment: nullIfEmpty($("#comment-nl").val()),
        },
    }

    var data = {
        entry_id: currentEntry,
        new_entry: newEntry,
    }

    socket.emit("update_entry", data);
}


function removeRow(elemID) {
    var data = {
        entry_id: elemID,
    }

    socket.emit("remove_row", data);
}


function addRow(elemID) {
    var data = {
        entry_id: elemID,
    }

    socket.emit("new_row", data);
}


startSocket();
