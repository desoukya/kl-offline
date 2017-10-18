const reset = function(step_limit = 4000) {
    delete __BRYTHON__.bound.__main__;
    delete __BRYTHON__.imported.__main__;
    Brython_Debugger.set_step_limit(step_limit);
    Debugger.on_debugging_started(() => {});
    Debugger.on_debugging_error(() => {});
    Debugger.on_step_update(() => {});
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
            gotoLine(state.next_line_no, true, `${state.name}: ${state.message}`);
        } else if (state.printout.length > 0) {
            window
                .setUserCodeExecutedThusFar({
                    executedCode: state.printout,
                });
        }
        reset();
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

window.exec = function(code, cb) {
    if (Brython_Debugger.is_debugging()) {
        return;
    }
    reset();
    const results = Brython_Debugger.start_debugger(code, true);
    if (cb) {
        Brython_Debugger.on_debugging_end(cb);
    } else {
        Brython_Debugger.on_debugging_end(() => {});
    }
    if (results.error) {
        window
            .setUserCodeExecutedThusFar({
                executedCode: results.errorState.data,
                isError: true
            });
        Brython_Debugger.stop_debugger();
    } else {
        runToEnd();
    }
};

window.interpret = function(code) {
    if (Brython_Debugger.is_debugging()) {
        return;
    }
    try {
        const old = __BRYTHON__.stdout.write;
        __BRYTHON__.stdout.write = function(message) {
            window
                .setUserCodeExecutedThusFar({
                    executedCode: message,
                });
        };
        const res = __BRYTHON__.builtins.exec(code, __BRYTHON__.builtins.dict());
        window
            .setUserCodeExecutedThusFar({
                executedCode: String(res),
            });
        __BRYTHON__.stdout.write = old;
    } catch (err) {
        if (err.__name__ && err.args) {
            const message = `${err.__name__}: ${err.args[0]}`;
            window
                .setUserCodeExecutedThusFar({
                    executedCode: message,
                    isError: true
                });
        } else {
            console.log(err);
        }
    }
}

window.lint = function(code) {
    if (Brython_Debugger.is_debugging()) {
        return;
    }
    reset(100);
    code = code.replace(new RegExp('input', 'g'), 'print');
    Brython_Debugger.on_debugging_end(() => {});
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