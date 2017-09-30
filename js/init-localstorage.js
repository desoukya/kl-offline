let CURRENT_SESSION_INDEX = undefined;

const loadSessionCodeToEditor = function(sessionIndex) {
    const SESSIONS = JSON.parse(localStorage.getItem('SESSIONS')) || [];
    var session = SESSIONS[sessionIndex] || {};
    var code = session.code || '';
    editor.setValue(code, 1);
    localStorage.setItem('CURRENT_SESSION_INDEX', sessionIndex);
    CURRENT_SESSION_INDEX = sessionIndex;
    $('#session-title').text(session.name);
};


const deleteSession = function(sessionIndex) {
    let SESSIONS = JSON.parse(localStorage.getItem('SESSIONS')) || [];
    SESSIONS.splice(sessionIndex, 1);
    localStorage.setItem('SESSIONS', JSON.stringify(SESSIONS));
    if (CURRENT_SESSION_INDEX === undefined) {
        return true;
    }
    if (CURRENT_SESSION_INDEX === sessionIndex) {
        editor.setValue('', 1);
        localStorage.removeItem('CURRENT_SESSION_INDEX');
        CURRENT_SESSION_INDEX = undefined;
        $('#session-title').text('');
    } else if (CURRENT_SESSION_INDEX > sessionIndex) {
        CURRENT_SESSION_INDEX = CURRENT_SESSION_INDEX - 1;
        localStorage.setItem('CURRENT_SESSION_INDEX', CURRENT_SESSION_INDEX);
    }
    loadAllSessionsToModal();
};


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

const loadAllSessionsToModal = function(sessionIndex) {
    const SESSIONS = JSON.parse(localStorage.getItem('SESSIONS')) || [];
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
            loadSessionCodeToEditor(sessionIndex);
            $('#sessionsModal').modal('hide');
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

const generateNewSessionName = function() {
    return 'Session-' + moment().format('MMMM-D-Y-{HH:mm}');
}

const saveSession = function({
    sessionName,
    sessionIndex
}) {
    let SESSIONS = JSON.parse(localStorage.getItem('SESSIONS')) || [];
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
    loadSessionCodeToEditor(sessionIndex);
}

const handleSaveAction = function(sessionIndex) {
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

const newSession = function() {
    editor.setValue('', 1);
    localStorage.removeItem('CURRENT_SESSION_INDEX');
    CURRENT_SESSION_INDEX = undefined;
    $('#session-title').text('');
}

const handleNewAction = function() {
    if (CURRENT_SESSION_INDEX === undefined && editor.getValue().length === 0) {
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

const loadCurrentSessionIndex = function() {
    let index = localStorage.getItem('CURRENT_SESSION_INDEX');
    return index !== undefined && index !== null ? parseInt(index, 10) : undefined;
}

if (typeof(Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    CURRENT_SESSION_INDEX = loadCurrentSessionIndex();
    if (CURRENT_SESSION_INDEX >= 0) {
        loadSessionCodeToEditor(CURRENT_SESSION_INDEX);
    }
    
    window.saveSession = () => handleSaveAction(CURRENT_SESSION_INDEX);

    window.newSession = () => handleNewAction();

    window.loadAllSessionsToModal = () => loadAllSessionsToModal();

} else {
    // Sorry! No Web Storage support..
    swal({
        title: 'Sorry!',
        text: 'No Web Storage support..',
        icon: "warning",
        dangerMode: true,
    });
}