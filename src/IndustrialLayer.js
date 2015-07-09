/*
 * @constructor
 */

function IndustrialLayer(layer) {
    Math.seedrandom("run");
    this.layer = layer;
    this.scene = new THREE.Scene();
    //this.camera = new THREE.PerspectiveCamera(45, 16 / 9, .01, 1000);

    this.cameraController = new CameraController(layer.type);
    this.camera = this.cameraController.camera;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 40;
    this.camera.lookAt(new THREE.Vector3(6,4,0));
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.fontLoaded = false;

    this.scene.fog = new THREE.Fog(0x7B665A, 0, 200);

    loader = new THREE.JSONLoader();
    
    this.initLights();
    this.initNinjadev();
}

IndustrialLayer.prototype.initLights= function() {

    this.ambientLight = new THREE.AmbientLight(0x555555);
    this.light1 = new THREE.PointLight(0x992222, 20.0, 100);
    this.light2 = new THREE.PointLight(0x992222, 20.0, 100);
    this.light3 = new THREE.PointLight(0x992222, 20.0, 100);
    this.light4 = new THREE.PointLight(0x992222, 20.0, 100);
    //this.light5 = new THREE.PointLight(0xFFEAC3, .3);
    this.WATER_CENTER_X = 0;
    this.WATER_CENTER_Z = 10;
    this.directionalLight = new THREE.DirectionalLight( 0x999999, 3 );
    this.light1.position.set(-47.54,69.36,-87.07);
    this.light2.position.set(40.17,70.56,90);
    this.light3.position.set(45.2,70.95,-86.78);
    this.light4.position.set(-41.53,70.77,90);
    this.directionalLight.position = new THREE.Vector3(0,0,70);
    this.scene.add(this.ambientLight);
    this.scene.add(this.light1);
    this.scene.add(this.light2);
    this.scene.add(this.light3);
    this.scene.add(this.light4);
    //this.scene.add(this.light5);
    this.scene.add(this.directionalLight);
}

IndustrialLayer.prototype.initNinjadev = function() {
    this.shoutouts;
    this.concrete;
    var that = this;
    var shoutoutsMaterial = new THREE.MeshPhongMaterial({
        color: 0x5e1a07,
        side: THREE.DoubleSide,
        metal: true
    });
    var concreteMaterial = new THREE.MeshLambertMaterial({
        color: 0x555555,
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
            addObjects();
        });
    };

    var addObjects2 = function() {

        var shoutouts = group2.clone();
        shoutouts.position.x = 0;
        shoutouts.position.y = 0;
        shoutouts.position.z = 1;
        shoutouts.rotation.y = 0;
        shoutouts.scale.set(6,6,6);
        that.concrete = shoutouts;
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
            addObjects2();
        });
    };
    var prefix = 'res/objects/';
    loadObject(prefix + 'industrial-scene-rust.obj', shoutoutsMaterial);
    loadObject2(prefix + 'industrial-scene-concrete.obj', concreteMaterial);
    Loader.start(function(){}, function(text) {console.log(text);});
};

IndustrialLayer.prototype.update = function(frame, relativeFrame) {

    this.cameraController.updateCamera(relativeFrame);

    var shout1 = 161;
    var shout2 = 371;
    var shout3 = 581;
    var shout4 = 791;
    var shout5 = 1001;
    var shout6 = 1211;

    var intensity = 20*(0.5+0.5*Math.cos(relativeFrame*Math.PI/25.7/4));
    this.light1.intensity = intensity;
    this.light2.intensity = intensity;
    this.light3.intensity = intensity;
    this.light4.intensity = intensity;
/*
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
    */
}

IndustrialLayer.prototype.getEffectComposerPass = function() {
    return this.renderPass;
};
