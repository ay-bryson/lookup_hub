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
            $($(event.target).siblings()[0]).show();
            $(event.target).remove();
        } else if (event.which == 27) {
            $($(event.target).siblings()[0]).show();
            $(event.target).remove();
        }
    })

    newInput.val(text.trim());
    $(elem).parent().append(newInput);
    $(elem).hide();
    newInput.focus();
}
