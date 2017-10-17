const resetMain = function() {
    delete __BRYTHON__.bound.__main__;
    delete __BRYTHON__.imported.__main__;
}

window.writeResultsToConsole = function(executedCode) {
    window
        .setUserCodeExecutedThusFar({
            executedCode
        });
};

window.exec = function(code) {
    resetMain();
    const results = Brython_Debugger.run_to_end(code, true);
    if (results.error) {
        window
            .setUserCodeExecutedThusFar({
                executedCode: results.errorState.data,
                isError: true
            });
    } else {
        window
            .setUserCodeExecutedThusFar({
                executedCode: results.stdout,
            });
    }
};

window.lint = function(code) {
    resetMain();
    const results = Brython_Debugger.start_debugger(code, true);
    if (results.error) {
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