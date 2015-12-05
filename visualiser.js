define(["./CPK", "./menu"], function (CPK, menu) {

	var sceneWidth = window.innerWidth;
	var sceneHeight = window.innerHeight;

	var capitalize = function( text ) {
		return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
	};

	Visualiser = function(){
        $("body").on("NEW_FILE", this._processFile.bind(this));
        this.execute();
    };
    
    Visualiser.prototype = {
		camera: null,
		renderer: null,

		execute: function(){
			this._startCamera();
			this._startRenderer();
			this._startScene(this.camera);
			this.controls = new THREE.OrbitControls( this.camera );
			this.controls.damping = 0.2;

			this.camera.position.z = 30;

			this.resize();
			this.render();

			document.body.appendChild(this.renderer.domElement);
		},

		resize: function(){
			this.renderer.setSize(sceneWidth, sceneHeight);
		},


		render: function(){
			this.renderer.render(this.scene, this.camera);
			this.controls.update();
			requestAnimationFrame(this.render.bind(this));
		},

		_startCamera: function(){
			var viewAngle = 45;
			var aspect = sceneWidth/sceneHeight;
			var near = 0.01;
			var far = 10000;
			this.camera =  new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
		},

		_startRenderer: function(){
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setClearColor( 0xeeeeee );
		},

		_startScene: function(camera){
			this.scene = new THREE.Scene();
			this.scene.add(camera);
			var light = new THREE.AmbientLight( 0x404040 ); // soft white light
			this.scene.add( light );
		},
        
        createNewParticleGroup: function(atoms, imagePath){
            var particleGroup = new SPE.Group({
				// Give the particles in this group a texture
				texture: THREE.ImageUtils.loadTexture(imagePath || "images/ball.png"),
				depthWrite: true,
				transparency: true,
				blending: THREE.NormalBlending

			});
			var emitter = new SPE.Emitter({
				sizeStart: 1.5,
				colorStart: new THREE.Color(0xFFFFFF),
				opacityStart: 1,
				isStatic: 1,
				particleCount: atoms.length
			});

			particleGroup.addEmitter(emitter);

			for(var i=0; i<particleGroup.geometry.vertices.length; i++){
				atom = atoms[i];
				particleGroup.geometry.vertices[i] = new THREE.Vector3(atom[0],atom[1],atom[2]);
				particleGroup.attributes.colorStart.value[i] = new THREE.Color("rgb(" + atom[3][0] + "," +atom[3][1] + "," + atom[3][2] + ")");
			}
			return particleGroup;
        },
        
        addLinesToScene: function(bonds, particleGroup, lineOptions){
            var lineMaterial;
			var line;
            var lines = [];
            var threeLine;
            for(var i = 0; i<bonds.length; i++){
				lineMaterial = new THREE.LineBasicMaterial( lineOptions || { color: 0x666666});
				line = new THREE.Line3(particleGroup.geometry.vertices[bonds[i][0]].clone(), particleGroup.geometry.vertices[bonds[i][1]].clone());
				line = new THREE.Geometry();
				line.vertices.push(
					particleGroup.geometry.vertices[bonds[i][0]].clone(),
					particleGroup.geometry.vertices[bonds[i][1]].clone()
				);
                threeLine = new THREE.Line(line, lineMaterial);
                lines.push(threeLine);
				this.scene.add(threeLine);
			}
            var removingFunction = function(){
                for (var i = 0; i < lines.length; i++){
                    this.scene.remove(lines[i]);
                }
            };
            return removingFunction.bind(this);
        },

		_processFile: function(event, xmlString, fileName){
			var cml = this._parseCML(xmlString);
			var atom;

			var atoms = cml.atoms;
			var particleGroup = this.createNewParticleGroup(atoms);
			this.scene.add(particleGroup.mesh);

			var bonds = cml.bonds;
            
            this.addLinesToScene(bonds, particleGroup);
            menu.addItem(fileName, bonds, particleGroup, this.addLinesToScene.bind(this), atoms, this.createNewParticleGroup, this.scene);
		},

		_parseCML: function ( text ) {
			
			var atoms = [];
			var bonds = [];

			var atomMap = {};

			var domParser = new DOMParser();
			var molecules = domParser.parseFromString(text, "application/xml");
			var atomArray = molecules.getElementsByTagName("atom");
			var bondArray = molecules.getElementsByTagName("bond");
			var pos = {};

			var x, y, z, e;
			var atomN = atomArray.length;
			for (var i = 0; i < atomN; i++){
				attr = atomArray[i].attributes;
				x = Number(attr.x3.value);
				y = Number(attr.y3.value);
				z = Number(attr.z3.value);
				var e = attr.elementType.value.toLowerCase();
				atoms.push( [x, y, z, CPK[e], capitalize(e) ] );
				atomMap[atomArray[i].id] = i;
			}
			var bondN = bondArray.length;
			for (var j = 0; j<bondN; j++){
				bAttr = bondArray[j].attributes;
				var linked = bAttr.atomRefs2.value.split(" ");
				start = linked[0];
				end = linked[1];
				bonds.push([atomMap[start], atomMap[end]]);
			}

			domParser = null;

			return {
				"atoms": atoms, // atoms = [ [x, y, z, [C,P,K], "name"], ...]
				"bonds": bonds  // bond = [ [startAtom,endAtom], ...]
			};
		}
	};
    
    return new Visualiser();
});
