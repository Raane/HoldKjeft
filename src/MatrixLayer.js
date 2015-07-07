/**
 *  * @constructor
 *   */
function MatrixLayer(layer) {
  this.shaderPass = new THREE.ShaderPass(SHADERS.matrix);
  this.shaderPass.uniforms.width.value = 1.0;
  this.shaderPass.uniforms.height.value = 1.0;
  this.shaderPass.uniforms.onoff.value = 1.0;
}

MatrixLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

MatrixLayer.prototype.start = function() {
};

MatrixLayer.prototype.end = function() {
};

MatrixLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.width.value = 1.0;
  this.shaderPass.uniforms.height.value = 1.0;
  if(relativeFrame <= 26) {
    this.shaderPass.uniforms.onoff.value = 0.5+0.5*-(Math.cos(relativeFrame*Math.PI*3/26))
  } else {
    this.shaderPass.uniforms.onoff.value = Math.min(1,1+0.5*-(Math.cos(relativeFrame*Math.PI/25.7/4)));
    //this.shaderPass.uniforms.onoff.value = 0;
  }
};
