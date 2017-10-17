const date = new Date(Date.now());
const options = {
    year: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
};
const dateToString = date.toLocaleTimeString('en-US', options);
const header = 'Powered by Kodinglab\n' + `[Python 3.5.2] - ${dateToString}\n\n`;

// on console input call back
const onInputCallBack = function(stdin) {
    setTimeout(() => {
        if (stdin.length === 0) {
            return false;
        }
        const stdinModified = stdin.replace(new RegExp('\'', 'g'), '"');
        window.interpret(stdin);
    }, 0);
    return false;
};

// config
const config = function(jqconsole) {
    jqconsole.RegisterMatching('{', '}', 'brace');
    jqconsole.RegisterMatching('(', ')', 'paran');
    jqconsole.RegisterMatching('[', ']', 'bracket');
}

// Initialize jqconsole
const initJqConsole = function() {
    this.jqconsole = $(`#console`).jqconsole(header, ' >  ');
    config(this.jqconsole);

    // Handle a command.
    var handler = stdin => {
        this
            .jqconsole
            .Prompt(false, handler, onInputCallBack);
    };
    // Initiate the first prompt.
    handler();
};

window.setUserCodeExecutedThusFar = function({
    executedCode,
    isError,
    cb
}) {
    var className = isError ?
        'jqconsole-error' :
        'jqconsole-results';
    if (executedCode.length > 0 && executedCode.slice(-1) !== '\n') {
        executedCode += '\n';
    }
    this
        .jqconsole
        .Write(executedCode, className);
    this
        .jqconsole
        .Focus();
    if (cb) {
        setTimeout(function(){
          cb();
       }, 0);
    }
};

window.focus = function() {
    this
        .jqconsole
        .Focus();
};

window.clearConsole = function() {
    this
        .jqconsole
        .Clear();
    this
        .jqconsole
        .Write(header, 'jqconsole-header');
    this
        .jqconsole
        .Focus();

};

initJqConsole();