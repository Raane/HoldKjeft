function MainLayer(layer) {
    Math.seedrandom("run");
    this.layer = layer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 16 / 9, .01, 1000);
    this.camera.position.set(6,4,40);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);

    loader = new THREE.JSONLoader();

    var sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshNormalMaterial());
    sphere.position.set(0,0,-20);
    sphere.overdraw = true;
    this.scene.add(sphere);

    this.initializeRTT();

    //var screen = new THREE.Mesh(new THREE.PlaneGeometry(16,9), this.material);
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(16,9), new THREE.MeshNormalMaterial());
    screen.position.set(0,0,0);
    screen.overdraw = true;
    this.scene.add(screen);
    
}

MainLayer.prototype.initializeRTT = function() {
    this.cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    this.cameraRTT.position.z = 100;

    this.sceneRTT = new THREE.Scene();

    this.rtTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );

    this.material = new THREE.ShaderMaterial( {
        uniforms: SHADERS.screenShader.uniforms, //,
        vertexShader: SHADERS.screenShader.vertexShader,
        fragmentShader: SHADERS.screenShader.fragmentShader
    } );

    this.screenRenderer = new THREE.WebGLRenderer();
    //this.screenRenderer.setPixelRatio( window.devicePixelRatio );
    this.screenRenderer.setSize( window.innerWidth, window.innerHeight );
    this.screenRenderer.autoClear = false;

}

MainLayer.prototype.renderScreen = function(relativeFrame) {
    this.material.uniforms.time.value += relativeFrame; 

    this.screenRenderer.render(this.sceneRTT, this.cameraRTT);

}

MainLayer.prototype.update = function(frame, relativeFrame) {

    this.renderScreen();
};

MainLayer.prototype.getEffectComposerPass = function() {
    return this.renderPass;
};
