// Initialize ace
const initAce = function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/python");
    editor.setOptions({
        fontSize: '18px'
    });
    editor.session.setUseWrapMode(true);
    window.editor = editor;
    editor.$blockScrolling = Infinity // To disable warning message
    function onResize() {
        var session = editor.session;
    
        editor.resize();
        if(session.getUseWrapMode()) {
            var characterWidth = editor.renderer.characterWidth;
            var contentWidth = editor.renderer.scroller.clientWidth;
    
            if(contentWidth > 0) {
                session.setWrapLimit(parseInt(contentWidth / characterWidth, 10));
            }
        }
    }
    window.onresize = onResize;
    onResize();
};

window.gotoLine = function(lineNumber, isError, text) {
    editor.gotoLine(lineNumber, 1000);
    editor.getSession().setAnnotations([{
        row: lineNumber - 1,
        column: 0,
        text,
        type: isError ? 'error' : 'pointer'
    }]);
}


initAce();