let Debugger = window.Brython_Debugger;

const doc = function(id) {
    return document.getElementById(id);
};

const gotoLine = function(lineNumber, isError, text) {
    editor.gotoLine(lineNumber, 1000);
    editor.getSession().setAnnotations([{
        row: lineNumber - 1,
        column: 0,
        text,
        type: isError ? 'error' : 'pointer'
    }]);
}

function start_debugger() {
    window.jqconsole.Clear();
    window.jqconsole.Disable();
    editor.getSession().setAnnotations([]);    
    var src = editor.getValue();
    try {
        Debugger.on_debugging_started(debug_started);
        Debugger.on_debugging_end(debug_stoped);
        Debugger.on_debugging_error(debug_error);
        Debugger.on_step_update(debug_step);        
        var hist = Debugger.start_debugger(src, true);
    } finally {
    }
    if (hist.error) {
        var state = hist.errorState;
        stop_debugger();
        window
        .setUserCodeExecutedThusFar({
            executedCode: state.data,
            isError: true
        });
    }
}

function stop_debugger() {
    Debugger.stop_debugger();
}

function step_debugger() {
    if (!Debugger.is_debugging()) {
        start_debugger();
    } else {
        Debugger.step_debugger()
    }
}

function step_back_debugger() {
    Debugger.step_back_debugger()
}

function debug_started() {
    $('#start-debugger').tooltip('hide');
    $('.console-container').addClass('show-debugging-controls');       
    doc('run').disabled = true
    doc('start-debugger').disabled = true
    doc('step-debugger').disabled = false
    doc('stop-debugger').disabled = false
    if (Debugger.is_recorded()) {
        if (Debugger.get_recorded_states().length > 0) {
            gotoLine(Debugger.get_recorded_states()[0].next_line_no);
        } else {
            Debugger.stop_debugger();
        }
    } else {
        Debugger.step_debugger()
    }
}

function debug_stoped() {
    $('.console-container').removeClass('show-debugging-controls');       
    doc('start-debugger').disabled = false;
    doc('run').disabled = false;
    doc('step-debugger').disabled = true;
    doc('back-debugger').disabled = true;
    doc('stop-debugger').disabled = true;
    window.clearConsole(); 
    window.jqconsole.Enable();
    editor.getSession().setAnnotations([]);        
}   

function debug_step(state) {
    if (state.err) {
        window
        .setUserCodeExecutedThusFar({
            executedCode: state.data,
            isError: true
        });
    } else {
        window.jqconsole.Clear();
        window
        .setUserCodeExecutedThusFar({
            executedCode: String(state.stdout)
        });    
    }
    if (state.err) {
        gotoLine(state.next_line_no, true, `${state.name}: ${state.message}`);
    } else {
        gotoLine(state.next_line_no);        
    }

    if (Debugger.is_last_step()) {
        doc('step-debugger').disabled = true;
    } else {
        doc('step-debugger').disabled = false;
    }
    if (Debugger.is_first_step()) {
        doc('back-debugger').disabled = true;
    } else {
        doc('back-debugger').disabled = false;
    }

}


function debug_error(err, Debugger) {}

doc('start-debugger').addEventListener('click', start_debugger);
doc('step-debugger').addEventListener('click', step_debugger);
doc('back-debugger').addEventListener('click', step_back_debugger);
doc('stop-debugger').addEventListener('click', stop_debugger);