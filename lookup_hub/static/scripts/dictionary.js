var dictionary;


class Dictionary {
    constructor() {
        this.entries = [];
        this.ids = [];
    }

    initialise(data) {
        for (data of dictionaryJSONL) {
            var entry = new Entry(data);
            this.addRow(entry);
        }
    }

    addRow(entry, atID) {
        this.push(entry);
        this.insert(entry, atID);
    }


    push(entry) {
        this.entries.push(entry);
        this.ids.push(entry.id);
    }

    insert(entry, atID, index) {
        if (atID === undefined) {
            // Only here when initiating dictionary
            $("#hub-grid").append(entry.html);
        } else {
            // atID specified => insert before `atID`
            if (index === undefined) {
                var index = this.ids.indexOf(atID);
            }
            this.entries.splice(index, 0, entry);
            this.ids.splice(index, 0, entry.id);

            var nextID = this.ids[index + 1];
            var dictIDElems = findEntryElem(nextID);
            $(entry.html).insertBefore(dictIDElems.first().parent());
        }

    }

    remove(entryID) {
        var index = this.ids.indexOf(entryID);

        this.ids.splice(index, 1);
        this.entries.splice(index, 1);

        $("[data-row-id='" + entryID + "']").remove();
    }

    replace(entry) {
        var index = this.ids.indexOf(entry.id);
        this.remove(entry.id);
        this.insert(entry, entry.id, index);
    }
}


class Entry {
    constructor(data) {
        this.id = data["id"];

        this.textEN = emptyIfNull(data["en"]["text"]);
        this.textDE = emptyIfNull(data["de"]["text"]);
        this.textNL = emptyIfNull(data["nl"]["text"]);

        this.comments = {
            "en": data["en"]["comment"],
            "de": data["de"]["comment"],
            "nl": data["nl"]["comment"],
        }

    }

    get html() {
        return entryHTML(this);
    }

    commentHTML(language) {
        var comment = this.comments[language];
        if ([undefined, null, ""].indexOf(comment) == -1) {
            return `
                <div class="entry-comment" title="${ comment }">
                    <i class="fas fa-comment-alt fa-lg"></i>
                </div>
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


const entryHTML = (entry) => `
    <div class="grid-elem buttons-left"
        data-row-id="${ entry.id }">
        <button
            class="dictionary-button"
            data-key="${ entry.id }"
            onclick="removeRow('${ entry.id }');">
            <i class="fas fa-minus-square fa-lg"></i>
        </button>
        <button
            class="dictionary-button"
            data-key="${ entry.id }"
            onclick="appendRow('${ entry.id }');">
            <i class="fas fa-plus-square fa-lg"></i>
        </button>
    </div>

    <div class="grid-elem hub-entry de"
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-de"
            data-key="${ entry.id }"
            data-target-language="de">
            ${ escapeHTML(entry.textDE) }
        </div>
        ` + entry.commentHTML("de") + `
    </div>
    <div class="grid-elem hub-entry en"
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-en"
            data-key="${ entry.id }"
            data-target-language="en">
            ${ escapeHTML(entry.textEN) }
        </div>
        ` + entry.commentHTML("en") + `
    </div>
    <div class="grid-elem hub-entry nl"
        data-row-id="${ entry.id }">
        <div class="hub-entry-text"
            id="${ entry.id }-nl"
            data-key="${ entry.id }"
            data-target-language="nl">
            ${ escapeHTML(entry.textNL) }
        </div>
        ` + entry.commentHTML("nl") + `
    </div>

    <div class="grid-elem buttons-right"
        data-row-id="${ entry.id }">
        <button
            data-key="${ entry.id }"
            class="dictionary-button"
            onclick="getEntry('${ entry.id }');">
            <i class="fas fa-pen-square fa-lg"></i>
        </button>
    </div>`


// Close all inputs on escape key
$(document).keydown(function(event) {
    if (event.keyCode == 27) {
        $("#popup-container").hide();
    }
});


$(document).ready( function() {

    dictionary.initialise();

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
})