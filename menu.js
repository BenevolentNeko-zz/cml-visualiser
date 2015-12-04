define([], function(){
    
    var menuNode = $("div");
    
    var removeFunctions = {};

    return {
        setDomNode: function(domnode){
            menuNode = domnode;
        },

        addItem: function(fileName, bonds, particleGroup, addLinesToScene){
            var button = $('<button type="button" class="btn btn-default">'+fileName+'</button>');
            button.click(function(){
                if (!button.hasClass("active")){
                    button.addClass("active");
                    removeFunctions[fileName] = addLinesToScene(bonds, particleGroup, {
                        color: 0xFFFF00, 
                        linewidth: 10
                    });
                } else {
                    button.removeClass("active");
                    removeFunctions[fileName]();
                }
            });
            var menuItem = $('<div></div>');
            menuItem.append(button);
            menuNode.append(menuItem);
            
        }
    }
})