const reset = function(step_limit = 4000) {
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
    reset();
    const results = Brython_Debugger.start_debugger(code, true);
    if (cb) {
        Brython_Debugger.on_debugging_end(cb);
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
            console.log(message);
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
    reset(100);
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