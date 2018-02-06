precision mediump float;

// vertex attributes
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

// matrices
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// ambient lights
uniform int uAmbientLightCount;
uniform vec3 uAmbientLightColor[8];

// directional lights
uniform int uDirectionalLightCount;
uniform vec3 uDirectionalLightDirection[8];
uniform vec3 uDirectionalLightColor[8];
uniform vec3 uDirectionalLightSpecularColor[8];

// point lights
uniform int uPointLightCount;
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];
uniform vec3 uPointLightSpecularColor[8];

// light falloff
uniform float uConstantFalloff;
uniform float uLinearFalloff;
uniform float uQuadraticFalloff;

// material properties
uniform vec3 uEmissiveColor;
uniform vec3 uAmbientColor;
uniform vec4 uMaterialColor;
uniform vec3 uSpecularColor;
uniform float uSpecularPower;


//varying vec3 vVertexNormal;
varying highp vec2 vVertTexCoord;
varying vec4 vVertexColor;
varying vec3 vDiffuseLight;

void main(void){

  vec4 positionVec4 = vec4(aPosition, 1.0);
  vec4 viewModelPosition = uModelViewMatrix * positionVec4;

  V = normalize(viewModelPosition.xyz);
  N = normalize(vec3(uNormalMatrix * aNormal));


  vec3 totalAmbientLight = vec3(0.0);
  vec3 totalDiffuseLight = vec3(0.0);
  vec3 totalSpecularLight = vec3(0.0);

  for (int i = 0; i < 8; i++) {
    if (uAmbientLightCount == i) break;

    totalAmbientLight += uAmbientLightColor[i];
  }

  sumLights(totalDiffuseLight, totalSpecularLight, viewModelPosition, uSpecularPower);

  // fragment variables:

  gl_Position = uProjectionMatrix * viewModelPosition;

  vVertTexCoord = aTexCoord;
  vDiffuseLight = totalDiffuseLight;

  vVertexColor = vec4(totalAmbientLight * uAmbientColor, 0) + 
                 vec4(totalSpecularLight * uSpecularColor, 0) + 
                 vec4(uEmissiveColor.rgb, 0);
}
