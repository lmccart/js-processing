suite('p5.Shader', function() {
  let myp5;

  if (!window.Modernizr.webgl) {
    //assert(false, 'could not run gl tests');
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        p.pointLight(250, 250, 250, 100, 100, 0);
        p.ambientMaterial(250);
      };
    });
  });

  const testUniforms = function(shaderName, uniforms, expectedUniforms) {
    // assert(expectedUniforms.length === Object.keys(uniforms).length,
    //   shaderName + ' expected ' + expectedUniforms.length + ' uniforms but has ' +
    //   Object.keys(uniforms).length);

    // test each one
    for (let i = 0; i < expectedUniforms.length; i++) {
      const uniform = uniforms[expectedUniforms[i]];
      assert(
        uniform !== undefined,
        shaderName + ' missing expectedUniform: ' + expectedUniforms[i]
      );
    }
  };

  const testAttributes = function(shaderName, attributes, expectedAttributes) {
    // assert(expectedAttributes.length === Object.keys(attributes).length,
    //   shaderName + ' expected ' + expectedAttributes.length +
    //   ' attributes but has ' + Object.keys(attributes).length);

    // test each one
    for (let i = 0; i < expectedAttributes.length; i++) {
      const attribute = attributes[expectedAttributes[i]];
      assert(
        attribute !== undefined,
        shaderName + ' missing expected attribute: ' + expectedAttributes[i]
      );
    }
  };

  const testShader = function(
    shaderName,
    shaderObj,
    expectedAttributes,
    expectedUniforms
  ) {
    myp5.shader(shaderObj);
    const s = myp5._renderer.curFillShader;

    assert(
      s !== null && s === shaderObj,
      shaderName + ' was returned from p5.RendererGL.shader'
    );

    assert(
      myp5._renderer.curFillShader !== null &&
        myp5._renderer.curFillShader === shaderObj,
      shaderName + " was not set as renderer's curFillShader in shader()"
    );

    testAttributes(shaderName, s.attributes, expectedAttributes);
    testUniforms(shaderName, s.uniforms, expectedUniforms);
  };

  teardown(function() {
    myp5.remove();
  });

  suite('Shader', function() {
    test('Shader Cache', function() {
      /*
      //exists doesn't seem to work?
      assert.exists(myp5._renderer.curFillShader,
        'Shader is in use');
      */
      assert(
        myp5._renderer.curFillShader !== null &&
          myp5._renderer.curFillShader !== undefined,
        'Shader is not in use or has not been cached'
      );
    });
    test('Uniform Cache', function() {
      const uniforms = myp5._renderer.curFillShader.uniforms;
      assert(
        uniforms !== null && uniforms !== undefined,
        'Shader uniforms have not been cached'
      );

      assert(
        Object.keys(uniforms).length > 0,
        'Shader uniforms have not been cached'
      );
    });
    test('Light Shader', function() {
      const expectedAttributes = ['aPosition', 'aNormal', 'aTexCoord'];

      const expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        'uNormalMatrix',
        'uAmbientLightCount',
        'uDirectionalLightCount',
        'uPointLightCount',
        'uAmbientColor',
        'uLightingDirection',
        'uDirectionalColor',
        'uPointLightLocation',
        'uPointLightColor',
        'uSpecular',
        'uMaterialColor',
        'uSampler',
        'isTexture'
      ];

      testShader(
        'Light Shader',
        myp5._renderer._getLightShader(),
        expectedAttributes,
        expectedUniforms
      );
    });
    test('Color Shader definition', function() {
      const expectedAttributes = ['aPosition'];

      const expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        'uMaterialColor'
      ];

      testShader(
        'Color Shader',
        myp5._renderer._getColorShader(),
        expectedAttributes,
        expectedUniforms
      );
    });
    test('Immediate Mode Shader definition', function() {
      const expectedAttributes = ['aPosition', 'aVertexColor'];

      const expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        /*'uResolution',*/
        'uPointSize'
      ];

      testShader(
        'Immediate Mode Shader',
        myp5._renderer._getImmediateModeShader(),
        expectedAttributes,
        expectedUniforms
      );
    });
    test('Normal Shader definition', function() {
      const expectedAttributes = ['aPosition', 'aNormal'];

      const expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        'uNormalMatrix'
      ];

      testShader(
        'Normal Shader',
        myp5._renderer._getNormalShader(),
        expectedAttributes,
        expectedUniforms
      );
    });
    test('Normal Shader is set after normalMaterial()', function() {
      myp5.normalMaterial();
      const normalShader = myp5._renderer._getNormalShader();
      assert(
        normalShader === myp5._renderer.curFillShader,
        "_renderer's curFillShader was not normal shader"
      );
    });
    test('Color Shader is set after fill()', function() {
      myp5.fill(0);
      const colorShader = myp5._renderer._getColorShader();
      assert(
        colorShader === myp5._renderer.curFillShader,
        "_renderer's curFillShader was not color shader after fill"
      );
    });
    test('Shader switch between retain and immedate mode', function() {
      myp5.fill(0);
      myp5.box(70, 70, 70);
      const retainShader = myp5._renderer._getColorShader();
      assert(
        retainShader === myp5._renderer.curFillShader,
        "_renderer's curFillShader was not color shader after fill() and box()"
      );

      myp5.beginShape(myp5.TRIANGLES);
      myp5.vertex(0, 25, 0);
      myp5.vertex(-25, -25, 0);
      myp5.vertex(25, -25, 0);
      myp5.endShape();
      const immediateShader = myp5._renderer._getImmediateModeShader();
      assert(
        immediateShader === myp5._renderer.curFillShader,
        "_renderer's curFillShader was not immediate mode shader " +
          'after begin/endShape()'
      );

      myp5.box(70, 70, 70);
      assert(
        retainShader === myp5._renderer.curFillShader,
        "_renderer's curFillShader did not switch back to retain shader " +
          ' to draw box() after immediate mode'
      );
    });
    test('Light shader set after ambientMaterial()', function() {
      const lightShader = myp5._renderer._getLightShader();

      myp5.ambientMaterial(128);
      assert(
        lightShader === myp5._renderer.curFillShader,
        "_renderer's curFillShader did not get set to light shader " +
          'after call to ambientMaterial()'
      );
    });
    test('Light shader set after specularMaterial()', function() {
      const lightShader = myp5._renderer._getLightShader();

      myp5.specularMaterial(128);
      assert(
        lightShader === myp5._renderer.curFillShader,
        "_renderer's curFillShader did not get set to light shader " +
          'after call to specularMaterial()'
      );
    });

    test('Able to setUniform empty arrays', function() {
      myp5.shader(myp5._renderer._getLightShader());
      const s = myp5._renderer.curFillShader;

      s.setUniform('uMaterialColor', []);
      s.setUniform('uLightingDirection', []);
    });
  });
});
