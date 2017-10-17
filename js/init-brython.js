const $B = __BRYTHON__;

const resetMain = function(step_limit = 1500) {
    delete __BRYTHON__.bound.__main__;
    delete __BRYTHON__.imported.__main__;
    Brython_Debugger.set_step_limit(step_limit);
}

const runToEnd = function() {
    Brython_Debugger.step_debugger();
    const state = Brython_Debugger.get_current_state();
    if (Brython_Debugger.is_last_step()) {
        if (state.err) {
            window
                .setUserCodeExecutedThusFar({
                    executedCode: state.data,
                    isError: true
                });
        }
        Brython_Debugger.stop_debugger();
        return true;
    }
    if (state.printout.length > 0) {
        window
            .setUserCodeExecutedThusFar({
                executedCode: state.printout,
                cb: runToEnd
            });
    } else {
        return runToEnd();
    }
};

window.exec = function(code) {
    resetMain();
    const results = Brython_Debugger.start_debugger(code, true);
    if (results.error) {
        window
            .setUserCodeExecutedThusFar({
                executedCode: results.errorState.data,
                isError: true
            });
    } else {
        runToEnd();
    }
};

window.lint = function(code) {
    resetMain(100);
    code = code.replace(new RegExp('input', 'g'), 'print');
    const results = Brython_Debugger.start_debugger(code, true);
    Brython_Debugger.stop_debugger();
    if (results.error && results.errorState.name !== 'StepLimitExceededError') {
        const errorState = results.errorState;
        return {
            message: `${errorState.name}: ${errorState.message}`,
            row: errorState.line_no - 1,
            col: errorState.column_no_start
        };
    } else {
        return false;
    }
};