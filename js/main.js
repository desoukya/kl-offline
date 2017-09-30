// EDITOR EVENTS
$('[data-action="run"]').click(function() {
    window.exec(editor.getValue());
});

// SESSIONS 

$('[data-action="save"]').click(function() {
    window.saveSession();
});
$('[data-action="new"]').click(function() {
    window.newSession();
});
$('[data-action="load-sessions-to-modal"').click(function() {
    window.loadAllSessionsToModal();
});

// CONSOLE EVENTS

$('[data-action="clear-console"]').click(function() {
    window.clearConsole();
});

$('#console').bind('keydown', 'ctrl+l', function(event) {
    event.preventDefault();
    window.clearConsole();
});

$('.dropdown.keep-open').on({
    "shown.bs.dropdown": function() { this.closable = false; },
    "click":             function() { this.closable = true; },
    "hide.bs.dropdown":  function() { return this.closable; }
});

jQuery.hotkeys.options.filterInputAcceptingElements = false;