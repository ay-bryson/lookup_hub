function createInput(elem) {
    var key = $(elem).attr("data-key");
    var targetLang = $(elem).attr("data-target-language");
    var text = $(elem).text();

    var newInput = $("<input class='cell-input'></input>");
    newInput.attr("data-key", key);
    newInput.attr("data-target-language", targetLang);

    newInput.keyup( function(event) {
        if (event.which == 13) {
            updateCell(key, targetLang, event.target.value);
            closeInputs();
        }
    })

    newInput.val(text.trim());
    $(elem).parent().append(newInput);
    $(elem).hide();
    newInput.focus();
}


function closeInputs() {
    $($(".hub-entry > input").siblings()).show();
    $(".hub-entry > input").remove();
}


// Close all inputs on escape key
$(document).keydown(function(event) {
    if (event.keyCode == 27) {
        closeInputs();
    }
});