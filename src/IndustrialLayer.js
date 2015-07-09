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

function IndustrialLayer(layer) {
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
    for(i=0;i<1000;i++) {
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 5, 5), new THREE.MeshNormalMaterial());
        sphere.position.set(
                rand.rand()*120-5,
                rand.rand()*100-5,
                rand.rand()*120-5
                );
        sphere.overdraw = true;
        this.scene.add(sphere);
    }
    this.initNinjadev();
}

IndustrialLayer.prototype.initNinjadev = function() {
    this.shoutouts;
    var that = this;
    var shoutoutsMaterial = new THREE.MeshNormalMaterial({
        color: 0x105107,
        side: THREE.DoubleSide
    });
    var holdkjeftMaterial= new THREE.MeshNormalMaterial({
        color: 0xff3322,
        side: THREE.DoubleSide
    });

    var numComponents = 1;
    var loadedCounter = 0;
    var group = new THREE.Object3D();
    var group2 = new THREE.Object3D();

    var addObjects = function() {

        var shoutouts = group.clone();
        shoutouts.position.x = 0;
        shoutouts.position.y = 0;
        shoutouts.position.z = 1;
        shoutouts.rotation.y = 0;
        shoutouts.scale.set(6,6,6);
        that.shoutouts = shoutouts;
        that.scene.add(shoutouts);
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
            }
        });
    };
    var addObjects2 = function() {

        var shoutouts = group2.clone();
        shoutouts.position.x = 300;
        shoutouts.position.y = 58;
        shoutouts.position.z = 96;
        shoutouts.rotation.x = Math.PI/2;
        shoutouts.rotation.y = 0;
        shoutouts.rotation.z = -Math.PI/2;
        shoutouts.scale.set(6,6,6);
        that.shoutouts = shoutouts;
        that.scene.add(shoutouts);
    };

    var loadObject2 = function (objPath, material) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
            var object = objLoader.parse(text);
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            group2.add(object);
            loadedCounter++;
            if (loadedCounter >= numComponents) {
                addObjects2(object);
            }
        });
    };
    var prefix = 'res/objects/';
    loadObject(prefix + 'shoutouts.obj', shoutoutsMaterial);
    loadObject2(prefix + 'holdkjeft.obj', holdkjeftMaterial);
    Loader.start(function(){}, function(text) {console.log(text);});
};

IndustrialLayer.prototype.update = function(frame, relativeFrame) {
    // CAMERA MOVEMENT
    var shout1 = 161;
    var shout2 = 371;
    var shout3 = 581;
    var shout4 = 791;
    var shout5 = 1001;
    var shout6 = 1211;
    var current_x = lerp(10,50,relativeFrame/shout4) + lerp(0,50,(relativeFrame-(shout5-120))/(shout6-shout5)) + lerp(0,1115,(relativeFrame-(shout5+60))/(shout6-shout5));
    this.camera.position.x = current_x;
    this.camera.position.y = 30 + lerp(-10,0,relativeFrame/100);
    this.camera.position.z = lerp(0,75,relativeFrame/shout5) + lerp(0,20,(relativeFrame-shout4)/(shout6-shout4));
    if(relativeFrame>0 && relativeFrame < shout1) {
        //smoothstep(start, stop, progress);
        this.camera.lookAt(new THREE.Vector3(
                    current_x/1.3,
                    0,
                    smoothstep(-15,0,(relativeFrame-0)/(shout1-0))
        ));
    } else if(relativeFrame < shout2) {
        this.camera.lookAt(new THREE.Vector3(
                    current_x/1.3,
                    0,
                    smoothstep(0,15,(relativeFrame-shout1)/(shout3-shout2))
        ));
    } else if(relativeFrame < shout3) {
        this.camera.lookAt(new THREE.Vector3(
                    current_x/1.3,
                    0,
                    smoothstep(15,30,(relativeFrame-shout2)/(shout4-shout3))
        ));
    } else if(relativeFrame < shout4) {
        this.camera.lookAt(new THREE.Vector3(
                    current_x/1.3,
                    0,
                    smoothstep(30,50,(relativeFrame-shout3)/(shout5-shout4))
        ));
    } else {
        this.camera.lookAt(new THREE.Vector3(
                    current_x/1.3 + smoothstep(0,11,(relativeFrame-shout4)/(shout6-shout5)),
                    0,
                    smoothstep(50,80,(relativeFrame-shout4)/(shout6-shout5))
        ));
        this.camera.position.y = smoothstep(30,60,(relativeFrame-shout4)/(shout6-shout5))
    }

    if(relativeFrame > 1103) {
        this.camera.position.set(323, 60, 90);
    }
}

IndustrialLayer.prototype.getEffectComposerPass = function() {
    return this.renderPass;
};
