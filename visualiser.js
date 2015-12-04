define([], function () {

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

		_processFile: function(event, xmlString, fileName){
			var cml = this._parseCML(xmlString);
			var atom;

			var atoms = cml.atoms;
			var particleGroup = new SPE.Group({
				// Give the particles in this group a texture
				texture: THREE.ImageUtils.loadTexture("images/ball.png"),
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
			this.scene.add(particleGroup.mesh);

			var bonds = cml.bonds;
			var lineMaterial;
			var line;
			for(var i = 0; i<bonds.length; i++){
				lineMaterial = new THREE.LineBasicMaterial( { color: 0x666666});
				line = new THREE.Line3(particleGroup.geometry.vertices[bonds[i][0]].clone(), particleGroup.geometry.vertices[bonds[i][1]].clone());
				line = new THREE.Geometry();
				line.vertices.push(
					particleGroup.geometry.vertices[bonds[i][0]].clone(),
					particleGroup.geometry.vertices[bonds[i][1]].clone()
				);
				this.scene.add(new THREE.Line( line, lineMaterial));

			}
		},


		_parseCML: function ( text ) {
            console.log(text);

			var CPK = {"h":[255,255,255],"he":[217,255,255],"li":[204,128,255],"be":[194,255,0],"b":[255,181,181],"c":[144,144,144],"n":[48,80,248],"o":[255,13,13],"f":[144,224,80],"ne":[179,227,245],"na":[171,92,242],"mg":[138,255,0],"al":[191,166,166],"si":[240,200,160],"p":[255,128,0],"s":[255,255,48],"cl":[31,240,31],"ar":[128,209,227],"k":[143,64,212],"ca":[61,255,0],"sc":[230,230,230],"ti":[191,194,199],"v":[166,166,171],"cr":[138,153,199],"mn":[156,122,199],"fe":[224,102,51],"co":[240,144,160],"ni":[80,208,80],"cu":[200,128,51],"zn":[125,128,176],"ga":[194,143,143],"ge":[102,143,143],"as":[189,128,227],"se":[255,161,0],"br":[166,41,41],"kr":[92,184,209],"rb":[112,46,176],"sr":[0,255,0],"y":[148,255,255],"zr":[148,224,224],"nb":[115,194,201],"mo":[84,181,181],"tc":[59,158,158],"ru":[36,143,143],"rh":[10,125,140],"pd":[0,105,133],"ag":[192,192,192],"cd":[255,217,143],"in":[166,117,115],"sn":[102,128,128],"sb":[158,99,181],"te":[212,122,0],"i":[148,0,148],"xe":[66,158,176],"cs":[87,23,143],"ba":[0,201,0],"la":[112,212,255],"ce":[255,255,199],"pr":[217,255,199],"nd":[199,255,199],"pm":[163,255,199],"sm":[143,255,199],"eu":[97,255,199],"gd":[69,255,199],"tb":[48,255,199],"dy":[31,255,199],"ho":[0,255,156],"er":[0,230,117],"tm":[0,212,82],"yb":[0,191,56],"lu":[0,171,36],"hf":[77,194,255],"ta":[77,166,255],"w":[33,148,214],"re":[38,125,171],"os":[38,102,150],"ir":[23,84,135],"pt":[208,208,224],"au":[255,209,35],"hg":[184,184,208],"tl":[166,84,77],"pb":[87,89,97],"bi":[158,79,181],"po":[171,92,0],"at":[117,79,69],"rn":[66,130,150],"fr":[66,0,102],"ra":[0,125,0],"ac":[112,171,250],"th":[0,186,255],"pa":[0,161,255],"u":[0,143,255],"np":[0,128,255],"pu":[0,107,255],"am":[84,92,242],"cm":[120,92,227],"bk":[138,79,227],"cf":[161,54,212],"es":[179,31,212],"fm":[179,31,186],"md":[179,13,166],"no":[189,13,135],"lr":[199,0,102],"rf":[204,0,89],"db":[209,0,79],"sg":[217,0,69],"bh":[224,0,56],"hs":[230,0,46],"mt":[235,0,38],
				   "ds":[235,0,38],"rg":[235,0,38],"cn":[235,0,38],"uut":[235,0,38],"uuq":[235,0,38],"uup":[235,0,38],"uuh":[235,0,38],"uus":[235,0,38],"uuo":[235,0,38]};

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
