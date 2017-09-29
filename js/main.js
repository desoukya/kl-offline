$('[data-action="run"]').click(function(){
    window.exec(editor.getValue());
});

$('[data-action="clear-console"]').click(function(){
    window.clearConsole();
});

var container = $(".wrapper");
var numberOfCol = 2;
$(".resizable").css('width', 100/numberOfCol +'%');

var sibTotalWidth;
$(".resizable").resizable({
    handles: 'e',
    start: function(event, ui){
        sibTotalWidth = ui.originalSize.width + ui.originalElement.next().outerWidth();
    },
    stop: function(event, ui){     
        var cellPercentWidth=100 * ui.originalElement.outerWidth()/ container.innerWidth();
        ui.originalElement.css('width', cellPercentWidth + '%');  
        var nextCell = ui.originalElement.next();
        var nextPercentWidth=100 * nextCell.outerWidth()/container.innerWidth();
        nextCell.css('width', nextPercentWidth + '%');
        editor.resize();        
    },
    resize: function(event, ui){ 
        ui.originalElement.next().width(sibTotalWidth - ui.size.width); 
    }
});
