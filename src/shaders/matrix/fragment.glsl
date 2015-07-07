uniform sampler2D tDiffuse;
uniform float width;
uniform float height;
uniform float onoff;

varying vec2 vUv;

#define distortFocus .3
#define lenX 96.
#define lenY 54.
#define sharpness 8.

float dist(vec2 uv, vec2 point) {
  return sqrt(pow(abs(uv.x*width/height-point.x*width/height),2.)+ pow(abs(uv.y-point.y),2.));
}

void main(void) {
  vec2 gridSize = vec2(1./lenX, 1./lenY);
  vec2 uv = vec2(vUv);
  vec2 gridCoor = vec2(floor(uv.x*lenX),floor(uv.y*lenY));
  vec2 colorSampleCoor = vec2(gridCoor.x*gridSize.x+gridSize.x/2., (gridCoor.y*gridSize.y+gridSize.y/2.));
  vec4 colorSample = texture2D(tDiffuse, colorSampleCoor);
  float blackAndWhite = (colorSample.r+colorSample.g+colorSample.b)/3.;
  vec4 blackAndWhiteColor = vec4(blackAndWhite,blackAndWhite,blackAndWhite,1.);
  float starCenterDist = dist(uv, vec2(gridCoor.x*gridSize.x+gridSize.x/2.,gridCoor.y*gridSize.y+gridSize.y/2.));
  float starColor = max(0.,blackAndWhite-pow(starCenterDist,.7)*pow(sharpness,1./.7));
  vec4 starColorSample = vec4(starColor,starColor,starColor,1.);
  gl_FragColor = starColorSample*onoff+(1.-onoff)*texture2D(tDiffuse, uv);
}

