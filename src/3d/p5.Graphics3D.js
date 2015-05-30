define(function(require) {

  var p5 = require('core');
  var shaders = require('shaders');
  require('p5.Graphics');
  var mat4 = require('mat4');
  var gl,
    shaderProgram;
  var mvMatrix;
  var pMatrix;
  var mvMatrixStack = [];

  //@TODO should probably implement an override for these attributes
  var attributes = {
    alpha: false,
    depth: true,
    stencil: true,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false
  };
  /**
   * 3D graphics class.  Can also be used as an off-screen graphics buffer.
   * A p5.Graphics3D object can be constructed
   *
   */
  p5.Graphics3D = function(elt, pInst, isMainCanvas) {
    p5.Graphics.call(this, elt, pInst, isMainCanvas);

    try {
      this.drawingContext = this.canvas.getContext('webgl', attributes) ||
        this.canvas.getContext('experimental-webgl', attributes);
      if (this.drawingContext === null) {
        throw 'Error creating webgl context';
      } else {
        console.log('p5.Graphics3d: enabled webgl context');
      }
    } catch (er) {
      console.error(er);
    }

    this._pInst._setProperty('_graphics', this);
    this.isP3D = true; //lets us know we're in 3d mode
    gl = this.drawingContext;
    gl.clearColor(1.0, 1.0, 1.0, 1.0); //background is initialized white
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.width * this._pInst.pixelDensity,
      this.height * this._pInst.pixelDensity);
    this.initShaders(); //initialize our default shaders
    this.initMatrix(); //initialize default pmatrix and mvatrix
    return this;
  };

  /**
   * [prototype description]
   * @type {[type]}
   */
  p5.Graphics3D.prototype = Object.create(p5.Graphics.prototype);

  /**
   * [initShaders description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.initShaders = function() {
    //set up our default shaders by:
    // 1. create the shader, 2. load the shader source,
    // 3. compile the shader
    var _vertShader = gl.createShader(gl.VERTEX_SHADER);
    //load in our default vertex shader
    gl.shaderSource(_vertShader, shaders.defaultVertShader);
    gl.compileShader(_vertShader);
    // if our vertex shader failed compilation?
    if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
      alert('Yikes! An error occurred compiling the shaders:' +
        gl.getShaderInfoLog(_vertShader));
      return null;
    }

    var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    //load in our material frag shader
    gl.shaderSource(_fragShader, shaders.defaultMatFragShader);
    gl.compileShader(_fragShader);
    // if our frag shader failed compilation?
    if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
      alert('Darn! An error occurred compiling the shaders:' +
        gl.getShaderInfoLog(_fragShader));
      return null;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, _vertShader);
    gl.attachShader(shaderProgram, _fragShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Snap! Error linking shader program');
    }
    gl.useProgram(shaderProgram);
    //END SHADERS SETUP

    // var vertexResolution =
      // gl.getUniformLocation(shaderProgram, 'u_resolution');
    // @TODO replace 4th argument with far plane once we implement
    // a view frustrum

    //vertex position Attribute
    shaderProgram.vertexPositionAttribute =
      gl.getAttribLocation(shaderProgram, 'a_VertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    //projection Matrix uniform
    shaderProgram.pMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'uPMatrix');
    //model view Matrix uniform
    shaderProgram.mvMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'uMVMatrix');

    //material color uniform
    //@TODO: remove hard coded white rgba 
    shaderProgram.uMaterialColorLoc = gl.getUniformLocation(shaderProgram,
      'u_MaterialColor');
    // Set material uniform
    gl.uniform4f(shaderProgram.uMaterialColorLoc, 1.0, 1.0, 1.0, 1.0);

  };

  /**
   * [initMatrix description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.initMatrix = function() {
    // Create a projection / perspective matrix
    mvMatrix = mat4.create();
    pMatrix = mat4.create();
    mat4.perspective(
      pMatrix, 60 / 180 * Math.PI,
      this.width / this.height, 0.1, 100);
  };

  /**
   * [resetMatrix description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.resetMatrix = function() {
    mat4.identity(mvMatrix);
  };

  //////////////////////////////////////////////
  // COLOR | Setting
  //////////////////////////////////////////////

  p5.Graphics3D.prototype.background = function() {
    var _col = this._pInst.color.apply(this._pInst, arguments);
    // gl.clearColor(0.0,0.0,0.0,1.0);
    var _r = (_col.color_array[0]) / 255;
    var _g = (_col.color_array[1]) / 255;
    var _b = (_col.color_array[2]) / 255;
    var _a = (_col.color_array[3]) / 255;
    gl.clearColor(_r, _g, _b, _a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //this.resetMatrix();
  };

  // p5.Graphics3D.prototype.clear = function() {
  //@TODO
  // };

  // p5.Graphics3D.prototype.fill = function() {
  //@TODO
  // };

  p5.Graphics3D.prototype.stroke = function() {
    this._stroke = this._pInst.color.apply(this._pInst, arguments);
  };

  /**
   * draw geometry with given vertices array
   * @param  {Array} vertices generated vertices
   * @return {[type]}          [description]
   */
  p5.Graphics3D.prototype.drawGeometry = function(vertices) {
    var geomVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geomVertexPositionBuffer);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    // console.log(vertices);
    _setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

    return this;
  };
  

  /**
   * [translate description]
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  p5.Graphics3D.prototype.translate = function(x, y, z) {
    mat4.translate(mvMatrix, mvMatrix, [x, y, z]);
    return this;
  };

  /**
   * [scale description]
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  p5.Graphics3D.prototype.scale = function(x, y, z) {
    mat4.scale(mvMatrix, mvMatrix, [x, y, z]);
    return this;
  };

  /**
   * [rotateX description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Graphics3D.prototype.rotateX = function(rad) {
    mat4.rotateX(mvMatrix, mvMatrix, rad);
    return this;
  };

  /**
   * [rotateY description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Graphics3D.prototype.rotateY = function(rad) {
    mat4.rotateY(mvMatrix, mvMatrix, rad);
    return this;
  };

  /**
   * [rotateZ description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Graphics3D.prototype.rotateZ = function(rad) {
    mat4.rotateZ(mvMatrix, mvMatrix, rad);
    return this;
  };

  p5.Graphics3D.prototype.push = function() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
  };

  /**
   * [pop description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.pop = function() {
    if (mvMatrixStack.length === 0) {
      throw 'Invalid popMatrix!';
    }
    mvMatrix = mvMatrixStack.pop();
  };

  /**
   * [_setMatrixUniforms description]
   */
  function _setMatrixUniforms() {
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }
    /**
     * PRIVATE
     */
    // matrix methods adapted from:
    // https://developer.mozilla.org/en-US/docs/Web/WebGL/
    // gluPerspective
    //
    // function _makePerspective(fovy, aspect, znear, zfar){
    //    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    //    var ymin = -ymax;
    //    var xmin = ymin * aspect;
    //    var xmax = ymax * aspect;
    //    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
    //  }

  ////
  //// glFrustum
  ////
  //function _makeFrustum(left, right, bottom, top, znear, zfar){
  //  var X = 2*znear/(right-left);
  //  var Y = 2*znear/(top-bottom);
  //  var A = (right+left)/(right-left);
  //  var B = (top+bottom)/(top-bottom);
  //  var C = -(zfar+znear)/(zfar-znear);
  //  var D = -2*zfar*znear/(zfar-znear);
  //  var frustrumMatrix =[
  //  X, 0, A, 0,
  //  0, Y, B, 0,
  //  0, 0, C, D,
  //  0, 0, -1, 0
  //];
  //return frustrumMatrix;
  // }

  // function _setMVPMatrices(){
  ////an identity matrix
  ////@TODO use the p5.Matrix class to abstract away our MV matrices and
  ///other math
  //var _mvMatrix =
  //[
  //  1.0,0.0,0.0,0.0,
  //  0.0,1.0,0.0,0.0,
  //  0.0,0.0,1.0,0.0,
  //  0.0,0.0,0.0,1.0
  //];

  //// create a perspective matrix with
  //// fovy, aspect, znear, zfar
  //var _pMatrix = _makePerspective(45,
  //  gl.drawingBufferWidth/gl.drawingBufferHeight,
  //  0.1, 1000.0);

  //var _pMatrixUniform =
  //  gl.getUniformLocation(shaderProgram, 'uPMatrix');

  //var _mvMatrixUniform =
  //  gl.getUniformLocation(shaderProgram, 'uMVMatrix');

  //gl.uniformMatrix4fv(_mvMatrixUniform,
  //  false, new Float32Array(_mvMatrix));
  //gl.uniformMatrix4fv(_pMatrixUniform,
  //  false, new Float32Array(_pMatrix));
  // }

  return p5.Graphics3D;
});