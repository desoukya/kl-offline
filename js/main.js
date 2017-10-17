jQuery.hotkeys.options.filterInputAcceptingElements = false;

// EDITOR EVENTS

$('[data-action="run"]').click(function() {
    $('#run>.fa-circle').removeClass('hidden');
    $('#run>.fa-play').addClass('hidden');
    setTimeout(() => {
        window.exec(editor.getValue());
        $('#run>.fa-play').removeClass('hidden');
        $('#run>.fa-circle').addClass('hidden');    
    }, 200);
});

editor.on('input', (change) => {
    const syntaxError = window.lint(editor.getValue());
    if(syntaxError) {
      this.editor.getSession().setAnnotations([
        {
          row: syntaxError.row,
          column: syntaxError.col,
          text: syntaxError.message,
          type: 'error'
        }
      ]);
    } else {
      this.editor.getSession().setAnnotations([]);
    }
});

// SESSIONS EVENTS 

$('[data-action="save"]').click(function() {
    if (window.saveSession) {
        window.saveSession();
    }
});
$('[data-action="new"]').click(function() {
    if (window.newSession) {
        window.newSession();
    }
});
$('[data-action="load-sessions-to-modal"').click(function() {
    if (window.loadAllSessionsToModal) {
        window.loadAllSessionsToModal();
        $('#sessionsModal').modal('show');
    }
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

// BOOTSTRAP

// Prevent dropdown from closing on click inside
$(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
});


$('[data-toggle="tooltip"]').tooltip();