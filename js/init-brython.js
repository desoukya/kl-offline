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

window.lint = function(code) {
    // try {
    //     __BRYTHON__.py2js(code, '', '$');
    //     return false;
    // } catch (e) {
    //     let position = e.$linterPosition;
    //     let message = e.$linterMessage;
    //     let row = e.$linterRow;
    //     let col = e.$linterCol;

    //     message = message.charAt(0).toUpperCase() + message.slice(1); // Capitalize first letter
    //     message = message + ", col " + col;

    //     return {
    //         message,
    //         row,
    //         col
    //     };
    // }
};