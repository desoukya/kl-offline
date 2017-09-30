jQuery.hotkeys.options.filterInputAcceptingElements = false;

// EDITOR EVENTS

$('[data-action="run"]').click(function() {
    window.exec(editor.getValue());
});

// SESSIONS EVENTS 

$('[data-action="save"]').click(function() {
    window.saveSession();
});
$('[data-action="new"]').click(function() {
    window.newSession();
});
$('[data-action="load-sessions-to-modal"').click(function() {
    window.loadAllSessionsToModal();
    $('#sessionsModal').modal('show');
});

$(window).bind('keydown', 'ctrl+s', function(event) {
    event.preventDefault();
    window.saveSession();
});

// CONSOLE EVENTS

$('[data-action="clear-console"]').click(function() {
    window.clearConsole();
});

$('#console').bind('keydown', 'ctrl+l', function(event) {
    event.preventDefault();
    window.clearConsole();
});

// SETTINGS EVENTS

$('.dropdown.keep-open').on({
    "shown.bs.dropdown": function() { this.closable = false; },
    "click":             function() { this.closable = true; },
    "hide.bs.dropdown":  function() { return this.closable; }
});

$('[data-toggle="tooltip"]').tooltip(); 
