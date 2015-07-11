/*
 * @constructor
 */

function IntroLayer(layer) {
    Math.seedrandom("run");
    this.layer = layer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 16 / 9, .01, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 37;
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.fontLoaded = false;

    this.toruses = [];
    this.bars = [];
    for(var i=0;i<18;i++) this.add_torus();
    this.add_run_bar(1,3,-3,0);
    this.add_run_bar(3,1,-2,1);
    this.add_run_bar(1,3,-1,0);
    this.add_run_bar(3,1,-0,-1);
    this.add_run_bar(1,3,1,0);
    this.add_run_bar(3,1,2,1);
    this.add_run_bar(1,3,3,0);
    this.add_run_bar(1,3,1000,0);

    this.initHoldKjeft();
}

IntroLayer.prototype.add_torus = function() {
    var geometry = new THREE.TorusGeometry( 10, 2, 6, 30 );
    var material = new THREE.MeshBasicMaterial( { color: 0x52403E } );
    var torus = new THREE.Mesh( geometry, material );
    this.scene.add( torus );
    this.toruses.push(torus);
}

IntroLayer.prototype.add_run_bar = function(x,y,dx,dy) {
    var geometry = new THREE.BoxGeometry( x, y, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x931D19 } );
    var torus = new THREE.Mesh( geometry, material );
    torus.position.set(dx,dy,0);
    this.scene.add( torus );
    this.bars.push(torus);
}

IntroLayer.prototype.initHoldKjeft = function() {
    this.shoutouts;
    var that = this;
    var holdkjeftMaterial= new THREE.MeshLambertMaterial({
        color: 0x931D19,
        side: THREE.DoubleSide
    });

    var numComponents = 1;
    var loadedCounter = 0;
    var group = new THREE.Object3D();

    var addObjects = function() {

        var shoutouts = group.clone();
        shoutouts.position.x = -12.2;
        shoutouts.position.y = -24;
        shoutouts.position.z = 0;
        shoutouts.rotation.x = Math.PI/2;
        shoutouts.rotation.y = 0;
        shoutouts.rotation.z = 0;
        shoutouts.scale.set(9,9,9);
        that.shoutouts = shoutouts;
        that.scene.add(shoutouts);

        var light1 = new THREE.PointLight(0x931D19, 20.0, 100);
        light1.position.set(20,-24,40);
        that.scene.add(light1);
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
                addObjects(object);
            }
        });
    };
    var prefix = 'res/objects/';
    loadObject(prefix + 'holdkjeft.obj', holdkjeftMaterial);
    Loader.start(function(){}, function(text) {console.log(text);});
}

IntroLayer.prototype.update = function(frame, relativeFrame) {
    for(var i=0;i<this.toruses.length;i++) {
        this.toruses[i].position.z = (relativeFrame-i*2*25.7)/5;
    }
    for(var i=0;i<this.bars.length;i++) {
        this.bars[i].position.z = Math.min(29,(relativeFrame-i*4*25.7)/5);
    }
    this.bars[0].position.x = smoothstep(-3,-4.5,(relativeFrame-877)/100);
    this.bars[1].position.x = smoothstep(-2,-3.5,(relativeFrame-877)/100);
    this.bars[7].position.x = relativeFrame>877?1:1000;
    this.bars[4].position.x = smoothstep(1,2.5,(relativeFrame-877)/100);
    this.bars[5].position.x = smoothstep(2,3.5,(relativeFrame-877)/100);
    this.bars[6].position.x = smoothstep(3,4.5,(relativeFrame-877)/100);


    this.camera.position.y = smoothstep(0,-24,(relativeFrame-1153)/12) + smoothstep(0,-35,(relativeFrame-1290)/12) ;
}

IntroLayer.prototype.getEffectComposerPass = function() {
    return this.renderPass;
};
