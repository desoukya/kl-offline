$('[data-action="run"]').click(function() {
    window.exec(editor.getValue());
});

$('[data-action="clear-console"]').click(function() {
    window.clearConsole();
});



// JQUERY UI

var container = $(".wrapper");
var numberOfCol = 2;
$(".resizable").css('width', 100 / numberOfCol + '%');

var sibTotalWidth;
$(".resizable").resizable({
    handles: 'e',
    create: function() {
        $('.ui-resizable-e').append('<div class="inner"></div>');
    },
    start: function(event, ui) {
        sibTotalWidth = ui.originalSize.width + ui.originalElement.next().outerWidth();
    },
    stop: function(event, ui) {
        var cellPercentWidth = 100 * ui.originalElement.outerWidth() / container.innerWidth();
        ui.originalElement.css('width', cellPercentWidth + '%');
        var nextCell = ui.originalElement.next();
        var nextPercentWidth = 100 * nextCell.outerWidth() / container.innerWidth();
        nextCell.css('width', nextPercentWidth + '%');
        editor.resize();
    },
    resize: function(event, ui) {
        ui.originalElement.next().width(sibTotalWidth - ui.size.width);
    }
});

$('#console *').css({
    fontSize: 14
});

const updateConsoleFontSize = function(value) {
    $('#console *').css({
        fontSize: value
    });
    $('.jqconsole-cursor').css({
        height: value + 1,
        width: parseInt(value * 2 / 3, 10) - 1
    });
    $('.jqconsole-btn').css({
        width: parseInt((value * 100) / 14, 10),
        height: parseInt((value * 29) / 14, 10)
    });
};

const updateEditorFontSize = function(value) {
    editor.setOptions({
        fontSize: `${value}px`
    });
    const controlsHeight = parseInt((value * 40) / 18, 10); 
    $('.editor-controls').css({
        height: controlsHeight
    });
    $('#editor').css('height', '100%');
    $('#editor').css('height', `-=${controlsHeight}px`);   
    editor.resize();    
    $('.editor-btn').css({
        width: parseInt((value * 118) / 18, 10),
        height: parseInt((value * 29) / 18, 10),
        fontSize: value - 4
    });
}

$("#consoleFont").slider({
    step: 1,
    min: 14,
    max: 30,
    slide: function(event, ui) {
        updateConsoleFontSize(ui.value);
    }
});

$("#editorFont").slider({
    step: 1,
    min: 18,
    max: 30,
    slide: function(event, ui) {
        updateEditorFontSize(ui.value);
    }
});