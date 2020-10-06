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
            $("#hub-table").append(entry.html);
        } else {
            // atID specified => insert before `atID`
            if (index === undefined) {
                var index = this.ids.indexOf(atID);
            }
            this.entries.splice(index, 0, entry);
            this.ids.splice(index, 0, entry.id);

            var nextID = this.ids[index + 1];
            var dictIDElems = findEntryElem(nextID);
            $(entry.html).insertBefore(dictIDElems.first().parent().parent());
        }

    }

    remove(entryID) {
        var index = this.ids.indexOf(entryID);

        this.ids.splice(index, 1);
        this.entries.splice(index, 1);

        $("[data-row-id='" + entryID + "']").remove();
    }

    replace(entry) {
        $(".hub-entry[data-row-id='" + entry.id + "']").remove();
        $(dictionaryElemsHTML(entry)).insertAfter($(".buttons-left[data-row-id='" + entry.id + "']"));
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
            onclick="removeRow('${ entry.id }');">
            <i class="fa fa-minus-square fa-lg"></i>
        </button>
    </td>
    <td class="buttons-left">
        <button
            class="pure-button dictionary-button"
            data-key="${ entry.id }"
            onclick="addRow('${ entry.id }');">
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