window.writeResultsToConsole = function(executedCode) {
    window
        .setUserCodeExecutedThusFar({
            executedCode
        });
};

window.exec = function(code) {
    try {
        window._exec(code);
    } catch (e) {
        window
            .setUserCodeExecutedThusFar({
                executedCode: e.toString(),
                isError: true
            });
    }
};