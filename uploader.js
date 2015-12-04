define([
	"text!./menu.html",
    "./menu"
], function(template, menu){
    
    $("body").append(template);
    var modalPopup = $("#modalPopup");
    var uploader = $("#uploader");
    var menuNode = $("#menu");
    menu.setDomNode(menuNode);
    
    var filesRequested = 0;
    var filesContributed = 0;
    
    function announceFile(event, name){
        var xmlString = event.target.result;
        $("body").trigger("NEW_FILE", [xmlString, name]);
        filesContributed++;

        if (filesContributed === filesRequested){
            modalPopup.modal({
                show: false
            });
            filesContributed = 0;
            filesRequested = 0;
        }
    }
    
    function readFile(file){
        // Allow the FileReader to interpret the binaries.
        // Emits a 'load' event on completion.
        var reader = new window.FileReader();
        reader.onload = function(fileEvent){
            announceFile(fileEvent, file.name);
            reader = null;
        };
        reader.readAsText(file);
    }
    
    function processFile(fileEvent){
        var files = fileEvent.target.files;
        var file = null;
        var i = files.length;
        filesRequested = i;
        
        while (i--) {
            file = files[i];
            readFile(file);
        }
    }
    
    uploader.on("change", processFile);

});
