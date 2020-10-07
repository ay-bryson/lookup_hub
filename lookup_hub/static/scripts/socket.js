var socket;
var currentEntry;

var dummyPage = window.location.pathname == "/sandbox";
if (dummyPage) {
    $("#dl-dict-button").attr("title", "This only works in the actual hub.");
    $("#dl-dict-button").prop("disabled", true);
}


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

    socket.on("new_row", (data) => {
        var atID = data["entry_id"];
        var entry = new Entry(data["new_entry"]);
        if (atID == null) {
            dictionary.appendRow(entry);
        } else {
            dictionary.insertDataByID(atID, entry);
        }
    })

    socket.on("new_row_append", (data) => {
        var entry = new Entry(data["new_entry"]);
        dictionary.appendRow(entry);
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
        dummy: dummyPage,
        entry_id: entryID,
    };

    socket.emit("get_entry", data);
}


function showEditWindow(data) {
    $("#popup-container").show();
    $("#edit-entry-grid").css("display", "grid");
    for (lang of ["en", "de", "nl"]) {
        for (item of ["text", "comment", "colour"]) {
            try {
                if (item == "colour" && data["entry"][lang][item] === undefined) {
                    $("#" + item + "-" + lang).val("#FFFFFF");
                } else {
                    $("#" + item + "-" + lang).val(data["entry"][lang][item]);
                }
            } catch(error) {
                print(error);
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
    entryData = {
        en: {
            text: $("#text-en").val(),
            comment: nullIfEmpty($("#comment-en").val()),
            colour: $("#colour-en").val(),
        },
        de: {
            text: $("#text-de").val(),
            comment: nullIfEmpty($("#comment-de").val()),
            colour: $("#colour-de").val(),
        },
        nl: {
            text: $("#text-nl").val(),
            comment: nullIfEmpty($("#comment-nl").val()),
            colour: $("#colour-nl").val(),
        },
    }

    sockEditEntry(entryData, currentEntry);
}


function sockEditEntry(entryData, entryID) {

    var data = {
        dummy: dummyPage,
        entry_id: entryID,
        new_entry: entryData,
    }

    socket.emit("update_entry", data);
}


function sockRemoveRow(elemID) {
    var data = {
        dummy: dummyPage,
        entry_id: elemID,
    }

    socket.emit("remove_row", data);
}


function sockAddRowID(elemID, contents) {
    var data = {
        dummy: dummyPage,
        at_id: elemID,
        contents: contents,
    }

    socket.emit("new_row_by_id", data);
}


function sockAddRowIndex(elemIndex, contents) {
    var data = {
        dummy: dummyPage,
        at_index: elemIndex,
        contents: contents,
    }

    socket.emit("new_row_by_index", data);
}


startSocket();
