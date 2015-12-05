define([], function(){
    
    var menuNode = $("div");
    
    var removeFunctions = {};

    return {
        setDomNode: function(domnode){
            menuNode = domnode;
        },

        addItem: function(fileName, bonds, particleGroup, addLinesToScene, atoms, createNewParticleGroup, scene){
            var button = $('<button type="button" class="btn btn-default">'+fileName+'</button>');
            button.click(function(){
                if (!button.hasClass("active")){
                    button.addClass("active");
                    removeFunctions[fileName] = addLinesToScene(bonds, particleGroup, {
                        color: 0x00cc00,
                        linewidth: 50
                    });
                    var newParticleGroup = createNewParticleGroup(atoms);
                    for(var i=0; i<newParticleGroup.attributes.size.value.length; i++){
                        newParticleGroup.attributes.size.value[i] = new THREE.Vector3(10,10,10);
                        newParticleGroup.attributes.colorStart.value[i] = new THREE.Color(0x00cc00);
                    }
                    scene.add(newParticleGroup.mesh);
                    removeFunctions[fileName+"2"] = function(){
                        scene.remove(newParticleGroup.mesh);
                    }
                } else {
                    button.removeClass("active");
                    removeFunctions[fileName]();
                    removeFunctions[fileName+"2"]();
                    
                }
            });
            var menuItem = $('<div></div>');
            menuItem.append(button);
            menuNode.append(menuItem);
            
        }
    }
})