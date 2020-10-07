var dictionary;


class Dictionary {
    constructor() {
        this.entries = [];
        this.ids = [];
    }

    initialise(data) {
        for (data of dictionaryJSONL) {
            var entry = new Entry(data);
            this.appendRow(entry);
        }
    }

    appendRow(entry) {
        this.entries.push(entry);
        this.ids.push(entry.id);

        $("#hub-table").append(entry.html);
    }

    insertDataByID(id, entry) {
        var index = this.ids.indexOf(id);
        this.insertDataByIndex(index, entry);

        this.displayRowByID(id, entry);
    }

    insertDataByIndex(index, entry) {
        this.entries.splice(index, 0, entry);
        this.ids.splice(index, 0, entry.id);
    }

    displayRowByID(id, entry) {
        $(entry.html).insertBefore($("[data-row-id='" + id + "']")[0]);
    }

    displayRowByIndex(entry, index) {
        var id = this.ids[index];
        this.displayRowByID(entry, id);
    }

    remove(entryID) {
        var index = this.ids.indexOf(entryID);
        pushToSession("lastDeleted", this.entries[index].pureJSON);
        pushToSession("lastDeleteNeighbourIDs", this.ids[index + 1]);

        this.ids.splice(index, 1);
        this.entries.splice(index, 1);

        $("[data-row-id='" + entryID + "']").remove();
        $("#undo-button").prop("disabled", false);
    }

    undo() {
        if (
            lastDeleteNeighbourIDs().length > 0 &&
            lastDeleted().length > 0 &&
            lastDeleteNeighbourIDs().length == lastDeleted().length
        ) {
            sockAddRowID(popFromSession("lastDeleteNeighbourIDs"), popFromSession("lastDeleted"));
        }

        if (
            lastDeleteNeighbourIDs().length == 0 &
            lastDeleted().length == 0
        ) {
            $("#undo-button").prop("disabled", true);
        }
    }

    replace(entry) {
        $(".hub-entry[data-row-id='" + entry.id + "']").remove();
        $(dictionaryElemsHTML(entry)).insertAfter($("tr[data-row-id='" + entry.id + "']").children()[1]);
    }
}


class Entry {
    constructor(data) {
        this.id = data["id"];
        this.pureJSON = data;

        this.textEN = emptyIfNull(data["en"]["text"]);
        this.textDE = emptyIfNull(data["de"]["text"]);
        this.textNL = emptyIfNull(data["nl"]["text"]);

        this.comments = {
            en: data["en"]["comment"],
            de: data["de"]["comment"],
            nl: data["nl"]["comment"],
        }

    }

    get html() {
        return entryHTML(this);
    }

    commentHTML(language) {
        var comment = this.comments[language];
        if ([undefined, null, ""].indexOf(comment) == -1) {
            return `
                <span>
                    <i class="entry-comment fa fa-sticky-note fa-lg" title="${ escapeHTML(comment) }"></i>
                </span>
            `
        } else {
            return ``
        }
    }
}


dictionary = new Dictionary();


function emptyIfNull(string) {
    if (string === null) {
        return "";
    } else {
        return String(string);
    }
}


var escape = document.createElement('textarea');
function escapeHTML(html) {
    escape.textContent = html;
    return escape.innerHTML;
}


const leftButtonsHTML = (entry) => `
    <td class="buttons-left">
        <button
            class="pure-button dictionary-button"
            data-key="${ entry.id }"
            onclick="sockRemoveRow('${ entry.id }');">
            <i class="fa fa-minus-square fa-lg"></i>
        </button>
    </td>
    <td class="buttons-left">
        <button
            class="pure-button dictionary-button"
            data-key="${ entry.id }"
            onclick="sockAddRowID('${ entry.id }');">
            <i class="fa fa-plus-square fa-lg"></i>
        </button>
    </td>
`


const dictionaryElemsHTML = (entry) => `
    <td class="hub-entry de"
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-de"
            data-key="${ entry.id }"
            data-target-language="de">
            ${ escapeHTML(entry.textDE) }
        </div>
        ` + entry.commentHTML("de") + `
    </td>
    <td class="hub-entry en"
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-en"
            data-key="${ entry.id }"
            data-target-language="en">
            ${ escapeHTML(entry.textEN) }
        </div>
        ` + entry.commentHTML("en") + `
    </td>
    <td class="hub-entry nl"
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-nl"
            data-key="${ entry.id }"
            data-target-language="nl">
            ${ escapeHTML(entry.textNL) }
        </div>
        ` + entry.commentHTML("nl") + `
    </td>
    `


const rightButtonsHTML = (entry) => `
    <td class="buttons-right"
        data-row-id="${ entry.id }">
        <button
            class="pure-button dictionary-button"
            data-key="${ entry.id }"
            onclick="getEntry('${ entry.id }');">
            <i class="fa fa-pencil-square fa-lg"></i>
        </button>
    </td>
    `

const entryHTML = (entry) => `<tr data-row-id="${ entry.id }">` +
        leftButtonsHTML(entry) +
        dictionaryElemsHTML(entry) +
        rightButtonsHTML(entry) +
    `</tr>`;


function initSession() {
    window.sessionStorage.lastDeleteNeighbourIDs = "[]";
    window.sessionStorage.lastDeleted = "[]";
}


function pushToSession(key, value) {
    var sessArray = JSON.parse(window.sessionStorage.getItem(key));
    sessArray.push(value);
    window.sessionStorage.setItem(key, JSON.stringify(sessArray));
}


function popFromSession(key) {
    var sessArray = JSON.parse(window.sessionStorage.getItem(key));
    var value = sessArray.pop();
    window.sessionStorage.setItem(key, JSON.stringify(sessArray));
    return value;
}


function lastDeleted() {
    return JSON.parse(window.sessionStorage.lastDeleted);
}


function lastDeleteNeighbourIDs() {
    return JSON.parse(window.sessionStorage.lastDeleteNeighbourIDs);
}


$(document).keydown(function(event) {
    // Close all inputs on escape key
    if (event.keyCode == 27) {
        $("#popup-container").hide();
    } else if (event.keyCode == 90 && event.ctrlKey && $("#undo-button").prop("disabled")) {
        dictionary.undo();
    }
});


$(document).ready( function() {

    dictionary.initialise();

    if (window.sessionStorage.getItem("lastDeleted") === undefined) {
        initSession();
        $("#undo-button").prop("disabled", true);
    }

    $("#popup-container").on("click", function(event) {
        if (event.target == $("#popup-container")[0]) {
            $("#popup-container").hide();
        }
    })

    $("#submit-entry-button").on("click", function() {
        submitChanges();
        $("#popup-container").hide();
    })

    $(".edit-entry-row > input").on("keyup", function(event) {
        if (event.keyCode == 13) {
            $("#submit-entry-button").click();
        }
    })


    if (
        lastDeleteNeighbourIDs.length > 0 &&
        lastDeleted.length > 0 &&
        lastDeleteNeighbourIDs.length == lastDeleted.length
    ) {
        $("#undo-button").prop("disabled", false);
    }

})