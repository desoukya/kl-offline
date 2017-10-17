const $B = __BRYTHON__;

const resetMain = function(step_limit = 4000) {
    delete __BRYTHON__.bound.__main__;
    delete __BRYTHON__.imported.__main__;
    Brython_Debugger.set_step_limit(step_limit);
}

const runToEnd = function() {
    const state = Brython_Debugger.get_current_state();
    if (Brython_Debugger.is_last_step()) {
        if (state.err) {
            window
                .setUserCodeExecutedThusFar({
                    executedCode: state.data,
                    isError: true
                });
        } else if (state.printout.length > 0) {
            window
                .setUserCodeExecutedThusFar({
                    executedCode: state.printout,
                });
        }
        Brython_Debugger.stop_debugger();
        return true;
    } else if (state.printout.length > 0) {
        window
            .setUserCodeExecutedThusFar({
                executedCode: state.printout,
                cb: () => {
                    Brython_Debugger.step_debugger();
                    runToEnd();
                }
            });
    } else {
        Brython_Debugger.step_debugger();
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

window.interpret = function(code) {
    try {
        const res = $B.builtins.exec(code);
        console.log(res);
    } catch (err) {
        for(var propName in err) {
            propValue = err[propName]
        
            console.log(propName,propValue);
        }        
        console.log(err.prototype);
    }
}

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