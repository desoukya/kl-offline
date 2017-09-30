let CURRENT_ACTIVE_SESSION_INDEX = undefined;
let EDITOR_FONT_SIZE = undefined;
let CONSOLE_FONT_SIZE = undefined;

const loadSession = function(sessionIndex) {
    const SESSIONS = loadSessionsArray();
    var session = SESSIONS[sessionIndex] || {};
    var code = session.code || '';
    editor.setValue(code, 1);
    localStorage.setItem('CURRENT_ACTIVE_SESSION_INDEX', sessionIndex);
    CURRENT_ACTIVE_SESSION_INDEX = sessionIndex;
    $('#session-title').text(session.name);
};


const deleteSession = function(sessionIndex) {
    let SESSIONS = loadSessionsArray();
    SESSIONS.splice(sessionIndex, 1);
    localStorage.setItem('SESSIONS', JSON.stringify(SESSIONS));
    if (CURRENT_ACTIVE_SESSION_INDEX === undefined) {
        return true;
    }
    if (CURRENT_ACTIVE_SESSION_INDEX === sessionIndex) {
        editor.setValue('', 1);
        localStorage.removeItem('CURRENT_ACTIVE_SESSION_INDEX');
        CURRENT_ACTIVE_SESSION_INDEX = undefined;
        $('#session-title').text('');
    } else if (CURRENT_ACTIVE_SESSION_INDEX > sessionIndex) {
        CURRENT_ACTIVE_SESSION_INDEX = CURRENT_ACTIVE_SESSION_INDEX - 1;
        localStorage.setItem('CURRENT_ACTIVE_SESSION_INDEX', CURRENT_ACTIVE_SESSION_INDEX);
    }
    loadAllSessionsToModal();
};

const loadAllSessionsToModal = function(sessionIndex) {
    const SESSIONS = loadSessionsArray();
    $('#sessions-container').empty();
    if (SESSIONS.length) {
        for (var index = 0; index < SESSIONS.length; index++) {
            $('#sessions-container').append(`<div class="card">
            <h4 data-action="load-session" data-id="${index}" class="card-title">${SESSIONS[index].name}</h4>
            <i data-action="delete-session" data-id="${index}" class="fa fa-trash card-icon"></i>
            </div>`);
        }

        $('[data-action="load-session"').click(function(event) {
            let sessionIndex = $(event.currentTarget).attr('data-id') || 0;
            sessionIndex = parseInt(sessionIndex, 10);
            handleLoadAction(sessionIndex);
        });

        $('[data-action="delete-session"').click(function(event) {
            let sessionIndex = $(event.currentTarget).attr('data-id') || 0;
            sessionIndex = parseInt(sessionIndex, 10);
            handleDeleteAction(sessionIndex);
        });

    } else {
        $('#sessions-container').append('<h4 class="text-center">There are no sessions to load!</h4>');
    }
}

const saveSession = function({
    sessionName,
    sessionIndex
}) {
    let SESSIONS = loadSessionsArray();
    const code = editor.getValue();
    if (sessionName) {
        SESSIONS.push({
            code,
            name: sessionName
        });
        sessionIndex = SESSIONS.length - 1;
    } else if (sessionIndex >= 0) {
        SESSIONS[sessionIndex].code = code;
        swal({
            title: "Your code has been saved to",
            text: SESSIONS[sessionIndex].name,
            type: "success",
            timer: 3000
        }).then(
            function() {
                return true;
            },
            function() {
                return false;
            });
    }
    localStorage.setItem('SESSIONS', JSON.stringify(SESSIONS));
    loadSession(sessionIndex);
}

const newSession = function() {
    editor.setValue('', 1);
    localStorage.removeItem('CURRENT_ACTIVE_SESSION_INDEX');
    CURRENT_ACTIVE_SESSION_INDEX = undefined;
    $('#session-title').text('');
}

// HANDLERS

const handleDeleteAction = function(sessionIndex) {
    swal({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#898b8e',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-danger',
        cancelButtonClass: 'btn btn-default',
        buttonsStyling: false
    }).then(function() {
        deleteSession(sessionIndex);
    }, function(dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        return false;
    });
}


const handleSaveAction = function() {
    const sessionIndex = loadCurrentSessionIndex();
    if (sessionIndex >= 0) {
        saveSession({
            sessionIndex
        });
    } else {
        swal({
            title: 'Save',
            text: 'Enter File Name:',
            showCancelButton: true,
            input: 'text',
            inputValue: generateNewSessionName(),
            confirmButtonText: 'Save',
            confirmButtonColor: '#4aa0f1',
            cancelButtonColor: '#898b8e',
        }).then(function(sessionName) {
            saveSession({
                sessionName
            });
        }, function(dismiss) {
            // dismiss can be 'cancel', 'overlay',
            // 'close', and 'timer'
            return false;
        });
    }
}

const handleNewAction = function() {
    if (CURRENT_ACTIVE_SESSION_INDEX === undefined && editor.getValue().length === 0) {
        newSession();
    } else {
        swal({
            title: 'Are you sure?',
            text: 'Please make sure you saved the current session.',
            showCancelButton: true,
            confirmButtonText: 'Continue',
            confirmButtonColor: '#4aa0f1',
            cancelButtonColor: '#898b8e',
        }).then(function(sessionName) {
            newSession();
        }, function(dismiss) {
            return false;
        });
    }

}

const handleLoadAction = function(index) {
    if (CURRENT_ACTIVE_SESSION_INDEX === index || (CURRENT_ACTIVE_SESSION_INDEX === undefined && editor.getValue().length === 0)) {
        loadSession(index);
        $('#sessionsModal').modal('hide');        
    } else {
        swal({
            title: 'Are you sure?',
            text: 'Please make sure you saved the current session.',
            showCancelButton: true,
            confirmButtonText: 'Continue',
            confirmButtonColor: '#4aa0f1',
            cancelButtonColor: '#898b8e',
        }).then(function(sessionName) {
            loadSession(index);
            $('#sessionsModal').modal('hide');
        }, function(dismiss) {
            return false;
        });
    }
}

// HELPERS

const loadCurrentSessionIndex = function() {
    let index = localStorage.getItem('CURRENT_ACTIVE_SESSION_INDEX');
    return index !== undefined && index !== null ? parseInt(index, 10) : undefined;
}

const loadEditorFontSize = function() {
    let fontSize = localStorage.getItem('EDITOR_FONT_SIZE');
    return fontSize !== undefined && fontSize !== null ? parseInt(fontSize, 10) : undefined;
}

const loadConsoleFontSize = function() {
    let fontSize = localStorage.getItem('CONSOLE_FONT_SIZE');
    return fontSize !== undefined && fontSize !== null ? parseInt(fontSize, 10) : undefined;
}

const saveEditorFontSize = function(value) {
    localStorage.setItem('EDITOR_FONT_SIZE', value);    
}

const saveConsoleFontSize = function(value) {
    localStorage.setItem('CONSOLE_FONT_SIZE', value);    
}

const loadSessionsArray = function() {
    const sessionsString = localStorage.getItem('SESSIONS');
    if (sessionsString) {
        return JSON.parse(sessionsString);
    }
    return [];
}

const generateNewSessionName = function() {
    return 'Session-' + moment().format('MMMM-D-Y-{HH:mm}');
}


// MAIN

if (typeof(Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    
    CURRENT_ACTIVE_SESSION_INDEX = loadCurrentSessionIndex();
    if (CURRENT_ACTIVE_SESSION_INDEX >= 0) {
        loadSession(CURRENT_ACTIVE_SESSION_INDEX);
    }

    EDITOR_FONT_SIZE = loadEditorFontSize();
    if (EDITOR_FONT_SIZE >= 0) {
        window.updateEditorFontSize(EDITOR_FONT_SIZE);
    }

    CONSOLE_FONT_SIZE = loadConsoleFontSize();
    if (CONSOLE_FONT_SIZE >= 0) {
        window.updateConsoleFontSize(CONSOLE_FONT_SIZE);
    }    

    window.loadSession = index => handleLoadAction(index);

    window.saveSession = () => handleSaveAction();

    window.newSession = () => handleNewAction();

    window.loadAllSessionsToModal = () => loadAllSessionsToModal();

    window.saveEditorFontSize = value => saveEditorFontSize(value);

    window.saveConsoleFontSize = value => saveConsoleFontSize(value);
    
} else {
    // Sorry! No Web Storage support..
    swal({
        title: 'Sorry!',
        text: 'No Web Storage support..',
        icon: "warning",
        dangerMode: true,
    });
    $('.session-btn').hide();
}