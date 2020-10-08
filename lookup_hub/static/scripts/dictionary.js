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
        this.appendLastRow();
    }

    appendRow(entry) {
        this.entries.push(entry);
        this.ids.push(entry.id);

        $("#hub-table").append(entry.html);
    }

    appendLastRow() {
        var addRowOnlyHTML = `<td></td>
        <td class="buttons-left">
            <button
                class="pure-button dictionary-button"
                data-row-key="-1"
                title="Insert new row here"
                onclick="sockAddRowIndex(-1);">
                <i class="fa fa-plus-square fa-lg"></i>
            </button>
        </td>`
        $("#hub-table").append(addRowOnlyHTML);
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

        this.ids.splice(index, 1);
        this.entries.splice(index, 1);

        $("[data-row-id='" + entryID + "']").remove();
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
        var index = this.ids.indexOf(entry.id);
        this.entries[index] = entry;

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

        this.colours = {
            en: data["en"]["colour"],
            de: data["de"]["colour"],
            nl: data["nl"]["colour"],
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

    colourHTML(language) {
        var colour = this.colours[language];
        if ([undefined, null, ""].indexOf(colour) == -1) {
            if (colour.toLowerCase() != "#ffffff") {
                return `
                    style="border: 10px; border-color: ${ colour }; border-style: none solid none none;"
                `
            }
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
            title="Delete this row"
            data-key="${ entry.id }"
            onclick="sockRemoveRow('${ entry.id }');">
            <i class="fa fa-minus-square fa-lg"></i>
        </button>
    </td>
    <td class="buttons-left">
        <button
            class="pure-button dictionary-button"
            title="Insert new row here"
            data-key="${ entry.id }"
            onclick="sockAddRowID('${ entry.id }');">
            <i class="fa fa-plus-square fa-lg"></i>
        </button>
    </td>
`


const dictionaryElemsHTML = (entry) => `
    <td class="hub-entry text-cell de"
        ` + entry.colourHTML("de") + `
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-de"
            data-key="${ entry.id }"
            data-target-language="de">
            ${ escapeHTML(entry.textDE) }
        </div>
        ` + entry.commentHTML("de") + `
    </td>
    <td class="hub-entry text-cell en"
        ` + entry.colourHTML("en") + `
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-en"
            data-key="${ entry.id }"
            data-target-language="en">
            ${ escapeHTML(entry.textEN) }
        </div>
        ` + entry.commentHTML("en") + `
    </td>
    <td class="hub-entry text-cell nl"
        ` + entry.colourHTML("nl") + `
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
            title="Edit this row"
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
    } else if (event.keyCode == 90 && event.ctrlKey && !$("#undo-button").prop("disabled")) {
        dictionary.undo();
    }
});


$(document).ready( function() {

    dictionary.initialise();

    initSession();
    $("#undo-button").prop("disabled", true);

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

    $("#dl-dict-button").click( function(event) {
        event.preventDefault();
        window.location.href = "/download_dict";
    })

    if (
        lastDeleteNeighbourIDs().length > 0 &&
        lastDeleted().length > 0 &&
        lastDeleteNeighbourIDs().length == lastDeleted().length
    ) {
        $("#undo-button").prop("disabled", false);
    }

    if (dummyPage) {
        $("#dl-dict-button").attr("title", "This only works in the actual hub.");
        $("#dl-dict-button").prop("disabled", true);
    }
})