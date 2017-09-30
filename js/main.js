$('[data-action="run"]').click(function() {
    window.exec(editor.getValue());
});

$('[data-action="clear-console"]').click(function() {
    window.clearConsole();
});

$('#console').bind('keydown', 'ctrl+l', function() {
    window.clearConsole();
});

jQuery.hotkeys.options.filterInputAcceptingElements = false;
