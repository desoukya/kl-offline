// Initialize ace
const initAce = function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/python");
    editor.setOptions({
        fontSize: '18px'
    });
};

initAce();