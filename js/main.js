window.writeResultsToConsole = function (executedCode) {
    window
        .streamsApi
        .setUserCodeExecutedThusFar({executedCode});
}

window.exec = function (code) {
    try {
        window._exec(code);
    } catch (e) {
        window
            .streamsApi
            .setUserCodeExecutedThusFar({
                executedCode: e.toString(),
                isError: true
            });
    }
}

// Initialize ace
var editor = ace.edit("editor");
editor.setTheme("ace/theme/xcode");
editor.getSession().setMode("ace/mode/python");
editor.setOptions({
    fontSize: '18px'
});
