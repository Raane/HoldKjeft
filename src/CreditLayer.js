/*
 * @constructor
 */

function pseudorand() {
    var max = Math.pow(2, 32),
        seed;
    return {
        setSeed : function(val) {
            seed = val || Math.round(Math.random() * max);
          },
        getSeed : function() {
                      return seed;
                  },
        rand : function() {
                   //creates randomness...somehow...
                       seed += (seed * seed) | 5;
                   // Shift off bits, discarding the sign. Discarding the sign is
                   // important because OR w/ 5 can give us + or - numbers.
                   return (seed >>> 32) / max;
       }
    };
};

function CreditLayer(layer) {
    Math.seedrandom("run");
    this.layer = layer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 16 / 9, .01, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 40;
    this.camera.lookAt(new THREE.Vector3(6,4,0));
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.fontLoaded = false;

    this.scene.fog = new THREE.Fog(0xedc9af, 50, 90);

    loader = new THREE.JSONLoader();

    var rand = pseudorand();
    rand.setSeed();
    for(i=0;i<170;i++) {
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 5, 5), new THREE.MeshNormalMaterial());
        sphere.position.set(
                rand.rand()*50-25,
                rand.rand()*50-25,
                rand.rand()*50-25
                );
        sphere.overdraw = true;
        this.scene.add(sphere);
    }
    this.initNinjadev();
}

CreditLayer.prototype.initNinjadev = function() {
    this.ninjadev;
    var that = this;
    var ninjadevMaterial = new THREE.MeshNormalMaterial({
        color: 0x105107,
        side: THREE.DoubleSide
    });

    var numComponents = 1;
    var loadedCounter = 0;
    var group = new THREE.Object3D();

    var addObjects = function() {

        Math.seedrandom('solskogen');
        var ninjadev = group.clone();
        ninjadev.position.x = 0;
        ninjadev.position.y = 0;
        ninjadev.position.z = 1;
        ninjadev.rotation.y = 0;
        that.ninjadev = ninjadev;
    };

    var loadObject = function (objPath, material) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
            var object = objLoader.parse(text);
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            group.add(object);
            loadedCounter++;
            if (loadedCounter >= numComponents) {
                addObjects();
                console.log("ninjadev loaded");
            }
        });
        console.log(Loader);
        Loader.start(function(){}, function(text) {console.log(text);});
    };

    console.log("loading ninjadev");
    var prefix = 'res/objects/';
    loadObject(prefix + 'ninjadev.obj', ninjadevMaterial);
};

CreditLayer.prototype.update = function(frame, relativeFrame) {
    // CAMERA MOVEMENT
    if(relativeFrame>0 && relativeFrame < 2000) {
        var timer = (relativeFrame-500)/(2000-500);
        this.camera.position.x = 6 + (1-Math.cos(timer*Math.PI*2))/2 * 8;
        this.camera.position.y = 4 + (1-Math.cos(timer*Math.PI*2))/2 * 16;
        this.camera.position.z = 40 - (1-Math.cos(timer*Math.PI))/2 * 60;
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    }
};

CreditLayer.prototype.getEffectComposerPass = function() {
    return this.renderPass;
};
