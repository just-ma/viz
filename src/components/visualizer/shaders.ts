export const vertexShader = /* glsl */ `
uniform sampler2D uTexture;
uniform vec2 uAmpPos;
uniform float uMaxAmp;
uniform float uAmpRadius;
uniform bool uFlipped;

varying vec2 vUv;
varying float vAmpVal;
varying float vLuma;
varying vec3 vColor;
varying float vBeat;

void main() {
  if (uFlipped) {
    vUv = vec2(1. - uv.x, uv.y);
  } else {
    vUv = uv;
  }

  float ampRadiusBalance = uAmpRadius * .3 + .7;
  float ampValX = exp((.2 - ampRadiusBalance) * pow(uAmpPos.x - position.x, 2.));
  float ampValY = exp((.2 - ampRadiusBalance) * pow(uAmpPos.y - position.y, 2.));
  vBeat = exp((-.2) * pow(uAmpPos.x, 2.)) * exp(-pow(position.y, 2.)) * exp(-pow(position.x, 2.));
  vAmpVal = ampValX * ampValY * ampRadiusBalance;

  vColor = texture2D(uTexture, vUv).xyz;
  vLuma = dot(vColor, vec3(.333));

  float sphereZVal = sqrt(1. - pow(position.x, 2.) -  pow(position.y, 2.));
  vec3 spherePos = position + vec3(0, 0, sphereZVal);

  vec3 newPos = spherePos + vec3(0,0, uMaxAmp * (vLuma - 0.5) * sphereZVal * vAmpVal - .3);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0 );
}`;

export const fragmentShader = /* glsl */ `
precision mediump float;

uniform float uThreshold;
uniform float uSaturation;

varying vec2 vUv;
varying float vAmpVal;
varying float vLuma;
varying vec3 vColor;
varying float vBeat;

void main() {
  vec2 uv = vUv * 100.;

  if (fract(uv.x) < 0.1 && fract(uv.y) < 0.1) {
    if (uThreshold > 1.0) {
      gl_FragColor = vec4(vec3(1.0 - uThreshold * 0.5), 0.1);
    } else {
      gl_FragColor = vec4(vec3(1), 1);
    }
  } else {
    vec3 color = mix(vec3(0.7 -  (vLuma - 0.5) * (vAmpVal * 0.9 + 0.1)), vColor, uSaturation);
    float luma = vLuma - vBeat * uThreshold;

    if (luma <= 0.0) {
      gl_FragColor =  vec4(0);
    } else {
      gl_FragColor =  vec4(color / (luma * 0.2 + 0.8), 1);
    }
  }
}`;
