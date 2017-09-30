$('[data-action="run"]').click(function() {
    window.exec(editor.getValue());
});

$('[data-action="clear-console"]').click(function() {
    window.clearConsole();
});
