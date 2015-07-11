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
    this.initSmokeColumns();
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

IndustrialLayer.prototype.initSmokeColumns = function() {
    this.smokeColumns = new Array();
    this.smokeBirthTimes = new Array();
    /*new THREE.MeshBasicMaterial({
     *       map: Loader.loadTexture(imagePrefix + directions[i] + imageSuffix),
     *             side: THREE.BackSide,
     *                   transparent: true
     *                       }));*/
    this.particleTexture = Loader.loadTexture( 'res/smokeparticle.png' );
    if(!window.FILES) {
        Loader.start( function(){}, function(){});
    }
    this.spriteMaterial = new THREE.SpriteMaterial({
        map: this.particleTexture,
        useScreenCoordinates: false,
        color: 0xffffff,
        sizeAttenuation: true
    });
};

IndustrialLayer.prototype.addSmokeColumn = function(x,y,z,frame,imgScale,radiusRange,totalParticles) {

    this.smokeColumns.push( new THREE.Object3D() );
    var smokeColumn = this.smokeColumns[this.smokeColumns.length-1];

    smokeColumn.particleAttributes = { startSize: [], startPosition: [], randomness: [] };

    var totalParticles = 4;
    var radiusRange = 90;
    for(var i=0; i < totalParticles; i++) {
        smokeColumn.add(new THREE.Sprite(this.spriteMaterial));
        smokeColumn.children[i].scale.set(imgScale, imgScale, 1.0); // imageWidth, imageHeight
        smokeColumn.children[i].position.set(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
                );
        smokeColumn.children[i].position.setLength(
                radiusRange * (Math.random() * 0.1 + 0.9)
                );
        smokeColumn.children[i].material.color.setHSL(120, 0, 1); 
        smokeColumn.children[i].material.blending = THREE.AlphaBlending; // "glowing" particles
        smokeColumn.particleAttributes.startPosition.push(smokeColumn.children[i].position.clone());
        smokeColumn.particleAttributes.randomness.push(Math.random());
    }

    smokeColumn.position.set(x,y,z);
    this.scene.add(smokeColumn);
    this.smokeBirthTimes.push(frame);
};

IndustrialLayer.prototype.updateSmoke = function(frame) {
    for(var i=0;i<this.smokeColumns.length; i++) {
        if(frame-this.smokeBirthTimes[i]>340 || frame-this.smokeBirthTimes[i]<-1) {
            this.scene.remove(this.smokeColumns[i]);
            delete this.smokeColumns[i];
            this.smokeColumns.splice(i,1);
            this.smokeBirthTimes.splice(i,1);
        }
    }
    for(var i=0;i<this.smokeColumns.length; i++) {
        this.updateSmokeColumn(this.smokeColumns[i], i, frame);
    }
};
IndustrialLayer.prototype.updateSmokeColumn = function(updateParticleGroup, age, frame){

    for (var c=0; c < updateParticleGroup.children.length; c++) {
        var particle = updateParticleGroup.children[c];
        var attributes = updateParticleGroup.particleAttributes;
        var a = attributes.randomness[c] + 1;
        var pulseFactor = Math.sin(a * 0.01 * frame * 1000 / 60) * 0.1 + 0.9;
        pulseFactor/=100;
        var downscaling = 1 -  (frame - this.smokeBirthTimes[age] + 1) / 200;
        particle.position.x = attributes.startPosition[c].x * pulseFactor * downscaling;
        particle.position.y = attributes.startPosition[c].y * pulseFactor + (frame - this.smokeBirthTimes[age])/50;
        particle.position.z = attributes.startPosition[c].z * pulseFactor * downscaling;
    }
}

IndustrialLayer.prototype.update = function(frame, relativeFrame) {

    this.cameraController.updateCamera(relativeFrame);

    var shout1 = 161;
    var shout2 = 371;
    var shout3 = 581;
    var shout4 = 791;
    var shout5 = 1001;
    var shout6 = 1211;

    var intensity = 20*(0.5+0.5*Math.cos(relativeFrame*Math.PI/25.7/4));
    if(relativeFrame>2070) {
        intensity = 100*(0.5+0.5*Math.cos(relativeFrame*Math.PI/25.7));
    }
    this.light1.intensity = intensity;
    this.light2.intensity = intensity;
    this.light3.intensity = intensity;
    this.light4.intensity = intensity;

    this.updateSmoke(frame, relativeFrame);
    if(relativeFrame > 2077 && relativeFrame < 4585 && relativeFrame%25==0) {
        this.addSmokeColumn( 
                2.97,-6.42,2.04,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -8.3,-3.65,5.05,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -21.89,28.13,-92.29,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -48.85,17.82,-89.71,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -92.68,32.89,-79.12,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                37.62,56.25,-20.83,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                94.78,53.26,-18.1,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                37.08,25.97,-3.12,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -35.52,-1.47,-4.57,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -37.86,-1.89,7.58,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                5.25,-7.69,79.62,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                34.76,9.77,80.71,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                65.29,7.5,82.23,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                0.89,-7.28,-76.53,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                11.79,4.66,-78.08,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -92.62,28.02,-37.56,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                -89.98,31.63,70.55,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                50.43,47.47,78.71,
                frame,
                16,
                10,
                1
                );
        this.addSmokeColumn( 
                50.78,48.45,79.26,
                frame,
                16,
                10,
                1
                );
    }
    if(relativeFrame > 3718 && relativeFrame < 4200  && relativeFrame%25==0) {
        this.addSmokeColumn( 
                50.78,48.45,79.26,
                frame,
                256,
                4000,
                1
                );
    }
}

IndustrialLayer.prototype.getEffectComposerPass = function() {
    return this.renderPass;
};
