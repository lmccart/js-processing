/**
 * @module Font
 * @submodule Font
 * @requires core
 * @requires constants
 */
define(function(require) {

  /**
   * Issues
   * -- require opentype.js (awaiting dev-ops) **
   * -- var fonts = loadFont([]); **
   * -- example exposing opentype font object **
   * -- PFont functions:
   *    textBounds() exists
   *    glyphPaths -> object or array?
   *    PFont.list()
   * -- Integrating p5.dom (later)
   * -- alignment: justified
   * -- kerning
   * -- truncation
   * -- drop-caps
   */

  /**
   * This module defines the p5.Font class and P5 methods for
   * drawing text to the main display canvas.
   */

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  p5.Font = function(p) {

    this.parent = p;
    this.font = undefined;
  };

  p5.Font.prototype.renderPath = function(line, x, y, fontSize, options) {

    var path, p = this.parent,
      textWidth, textHeight, textAscent, textDescent;

    fontSize = fontSize || p._textSize;
    options = options || {};

    textWidth = p.textWidth(line);
    textAscent = p.textAscent();
    textDescent = p.textDescent();
    textHeight = textAscent + textDescent;

    if (p.drawingContext.textAlign === constants.CENTER) {
      x -= textWidth / 2;
    } else if (p.drawingContext.textAlign === constants.RIGHT) {
      x -= textWidth;
    }

    if (p.drawingContext.textBaseline === constants.TOP) {
      y += textHeight;
    } else if (p.drawingContext.textBaseline === constants._CTX_MIDDLE) {
      y += textHeight / 2 - textDescent;
    } else if (p.drawingContext.textBaseline === constants.BOTTOM) {
      y -= textDescent;
    }

    path = this.font.getPath(line, x, y, fontSize, options);

    // no stroke unless specified by user
    if (p._doStroke && p._strokeSet) {

      path.strokeWidth = p.drawingContext.lineWidth;
      path.stroke = p.drawingContext.strokeStyle;
    }

    // if fill hasn't been set by user, use default text fill
    if (p._doFill) {

      path.fill = p._fillSet ? p.drawingContext.fillStyle :
        constants._DEFAULT_TEXT_FILL;
    }

    path.draw(p.drawingContext);
  };

  p5.Font.prototype.textBounds = function(str, x, y, fontSize) {

    //console.log('textBounds::',str, x, y, fontSize);

    if (!this.parent._isOpenType()) {
      throw Error('not supported for system fonts');
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize || this.parent._textSize;

    var xCoords = [],
      yCoords = [],
      scale = 1 / this.font.unitsPerEm * fontSize;

    this.font.forEachGlyph(str, x, y, fontSize, {},
      function(glyph, gX, gY) {

        if (glyph.name !== 'space') {

          gX = gX !== undefined ? gX : 0;
          gY = gY !== undefined ? gY : 0;

          var gm = glyph.getMetrics();
          var x1 = gX + (gm.xMin * scale);
          var y1 = gY + (-gm.yMin * scale);
          var x2 = gX + (gm.xMax * scale);
          var y2 = gY + (-gm.yMax * scale);

          xCoords.push(x1);
          yCoords.push(y1);
          xCoords.push(x2);
          yCoords.push(y2);
        }
      });

    var minX = Math.min.apply(null, xCoords);
    var minY = Math.min.apply(null, yCoords);
    var maxX = Math.max.apply(null, xCoords);
    var maxY = Math.max.apply(null, yCoords);

    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    };
  };

  p5.Font.prototype.list = function() {

    // TODO
    throw 'not yet implemented';
  };

  return p5.Font;
});
