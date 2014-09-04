/**
 * @module Data
 * @submodule Output
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  window.URL = window.URL || window.webkitURL;

  // private array of p5.PrintWriter objects
  p5.prototype._pWriters = [];

  p5.prototype.beginRaw = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.beginRecord = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.createOutput = function() {
    // TODO

    throw 'not yet implemented';
  };

  p5.prototype.createWriter  = function(name, extension) {
    var newPW;
    // check that it doesn't already exist
    for (var i in p5.prototype._pWriters) {
      if (p5.prototype._pWriters[i].name === name) {
        // if a p5.PrintWriter w/ this name already exists...
        // return p5.prototype._pWriters[i]; // return it w/ contents intact.
        // or, could return a new, empty one with a unique name:
        newPW = new p5.PrintWriter(name + window.millis(), extension);
        p5.prototype._pWriters.push( newPW );
        return newPW;
      }
    }
    newPW = new p5.PrintWriter(name, extension);
    p5.prototype._pWriters.push( newPW );
    return newPW;
  };

  p5.prototype.endRaw = function() {
    // TODO

    throw 'not yet implemented';
  };

  p5.prototype.endRecord  = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.escape = function(content) {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      // .replace(/\//g), '&apos;')
      .replace(/'/g, '&#039;');
  };

  p5.PrintWriter = function(filename, extension) {
    var self = this;
    this.name = filename;
    this.content = '';
    this.print = function(data) { this.content += data; };
    this.println = function(data) { this.content += data + '\n'; };
    this.flush = function() { this.content = ''; };
    this.close = function() {
      // convert String to Array for the writeFile Blob
      var arr = [];
      arr.push(this.content);
      p5.prototype.writeFile(arr, filename, extension);
      // remove from _pWriters array and delete self
      for (var i in p5.prototype._pWriters) {
        if (p5.prototype._pWriters[i].name === this.name) {
          // remove from _pWriters array
          p5.prototype._pWriters.splice(i, 1);
        }
      }
      self.flush();
      self = {};
    };
  };

  p5.prototype.saveBytes = function() {
    // TODO
    throw 'not yet implemented';

  };

  /**
   *  Writes the contents of an Array or a JSON object to a .json file.
   *  The file saving process and location of the saved file will
   *  vary between web browsers.
   *
   *  @method  saveJSON  
   *  @param  {Array|Object} json
   *  @param  {String} filename
   *  @param  {Boolean} [optimize]   If true, removes line breaks
   *                                 and spaces from the output
   *                                 file to optimize filesize
   *                                 (but not readability).
   *  @example
   *  <div><code>
   *  var json;
   *
   *  function setup() {
   *  
   *    json = {}; // new JSON Object
   *    
   *    json.id = 0;
   *    json.species = 'Panthera leo';
   *    json.name = 'Lion';
   *    
   *  // To save, un-comment the line below, then click 'run'
   *  // saveJSONObject(json, 'lion.json');
   *  }
   *  
   *  // Saves the following to a file called "lion.json":
   *  // {
   *  //   "id": 0,
   *  //   "species": "Panthera leo",
   *  //   "name": "Lion"
   *  // }
   *  </div></code>
   */
  p5.prototype.saveJSON = function(json, filename, opt) {
    var stringify;
    if (opt){
      stringify = JSON.stringify( json );
    } else {
      stringify = JSON.stringify( json, undefined, 2);
    }
    this.saveStrings(stringify.split('\n'), filename, 'json');
  };

  p5.prototype.saveJSONObject = p5.prototype.saveJSON;
  p5.prototype.saveJSONArray = p5.prototype.saveJSON;

  p5.prototype.saveStream = function() {
    // TODO
    throw 'not yet implemented';

  };

  /**
   *  Writes an array of Strings to a text file, one line per String.
   *  The file saving process and location of the saved file will
   *  vary between web browsers.
   *
   *  @method  saveStrings
   *  @param  {Array} list      string array to be written
   *  @param  {String} filename filename for output
   *  @example
   *  <div><code>
   *  var words = 'apple bear cat dog';
   *  
   *  // .split() outputs an Array
   *  var list = split(words, ' ');
   *  
   *  // To save the file, un-comment next line and click 'run'
   *  // saveStrings(list, 'nouns.txt');
   *
   *  // Saves the following to a file called 'nouns.txt':
   *  //
   *  // apple
   *  // bear
   *  // cat
   *  // dog
   *  </code></div>
   */
  p5.prototype.saveStrings = function(list, filename, extension) {
    var ext = extension || 'txt';
    var pWriter = this.createWriter(filename, ext);
    for (var i in list) {
      if (i < list.length - 1) {
        pWriter.println(list[i]);
      } else {
        pWriter.print(list[i]);
      }
    }
    pWriter.close();
    pWriter.flush();
  };

  p5.prototype.saveXML = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.selectOutput = function() {
    // TODO
    throw 'not yet implemented';

  };

  /**
   *  Writes the contents of a Table object to a file. Defaults to a
   *  text file with comma-separated-values ('csv') but can also
   *  use tab separation ('tsv'), or generate an HTML table ('html').
   *  The file saving process and location of the saved file will
   *  vary between web browsers.
   *  
   *  @method saveTable
   *  @param  {p5.Table} Table  the Table object to save to a file
   *  @param  {String} filename the filename to which the Table should be saved
   *  @param  {[String]} options  can be one of "tsv", "csv", or "html"
   *  @example
   *  <div><code>
   *  var table;
   *  
   *  function setup() {
   *    table = new p5.Table();
   *    
   *    table.addColumn('id');
   *    table.addColumn('species');
   *    table.addColumn('name');
   *    
   *    var newRow = table.addRow();
   *    newRow.setNum('id', table.getRowCount() - 1);
   *    newRow.setString('species', 'Panthera leo');
   *    newRow.setString('name', 'Lion');
   *
   *    // To save, un-comment next line then click 'run'
   *    // saveTable(table, 'new.csv');
   *    }
   *    
   *    // Saves the following to a file called 'new.csv':
   *    // id,species,name
   *    // 0,Panthera leo,Lion
   *  </code></div>
   */
  p5.prototype.saveTable = function(table, filename, options) {
    var pWriter = this.createWriter(filename, options);

    var header = table.columns;

    var sep = ','; // default to CSV
    if (options === 'tsv') {
      sep = '\t';
    }
    if (options !== 'html') {
      // make header if it has values
      if (header[0] !== '0') {
        for (var h = 0; h < header.length; h++ ) {
          if (h < header.length - 1){
            pWriter.print(header[h] + sep);
          } else {
            pWriter.println(header[h]);
          }
        }
      }

      // make rows
      for (var i = 0; i < table.rows.length; i++ ) {
        var j;
        for (j = 0; j < table.rows[i].arr.length; j++) {
          if (j < table.rows[i].arr.length - 1) {
            pWriter.print(table.rows[i].arr[j] + sep);
          }
          else if (i < table.rows.length - 1) {
            pWriter.println(table.rows[i].arr[j]);
          } else {
            pWriter.print(table.rows[i].arr[j]); // no line break
          }
        }
      }
    }

    // otherwise, make HTML
    else {
      pWriter.println('<html>');
      pWriter.println('<head>');
      var str = '  <meta http-equiv=\"content-type\" content';
      str += '=\"text/html;charset=utf-8\" />';
      pWriter.println(str);
      pWriter.println('</head>');

      pWriter.println('<body>');
      pWriter.println('  <table>');
      
      // make header if it has values
      if (header[0] !== '0') {
        pWriter.println('    <tr>');
        for (var k = 0; k < header.length; k++ ) {
          var e = p5.prototype.escape(header[k]);
          pWriter.println('      <td>' +e);
          pWriter.println('      </td>');
        }
        pWriter.println('    </tr>');
      }
      
      // make rows
      for (var row = 0; row < table.rows.length; row++) {
        pWriter.println('    <tr>');
        for (var col = 0; col < table.columns.length; col++) {
          var entry = table.rows[row].getString(col);
          var htmlEntry = p5.prototype.escape(entry);
          pWriter.println('      <td>' +htmlEntry);
          pWriter.println('      </td>');
        }
        pWriter.println('    </tr>');
      }
      pWriter.println('  </table>');
      pWriter.println('</body>');
      pWriter.print('</html>');
    }
    // close and flush the pWriter
    pWriter.close();
    pWriter.flush();
  }; // end saveTable()

  // ================
  // DOWNLOAD HELPERS
  // ================

  /**
   *  Generate a file and force download.
   *  Accepts an array of data, a filename, and an extension (optional).
   *  This is a private function because it does not do any formatting,
   *  but it is used by saveStrings, saveJSON, saveTable etc.
   *
   *  @param  {Array} dataToDownload
   *  @param  {String} filename
   *  @param  {[String]} extension
   *  @private
   */
  p5.prototype.writeFile = function(dataToDownload, filename, extension) {
    var ext = '';
    var a = document.createElement('a');
    var type = 'application\/octet-stream';
    if ( _isSafari() ) {
      type = 'text\/plain';
    }

    // make sure the file will have a name, see if filename needs extension
    if (filename) {
      ext = _checkFileExtension(filename);
    } else {
      filename = 'untitled';
    }
    // append extension if it doesn't exist
    if (extension) {
      if (ext !== extension) {
        ext = extension;
        filename = filename + '.' + ext;
      }
    }

    var blob = new Blob(dataToDownload, {'type': type});
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;

    // Firefox requires the link to be added to the DOM before click()
    a.onclick = destroyClickedElement;
    a.style.display = 'none';
    document.body.appendChild(a);

    // Safari will open this file in the same page as a confusing Blob.
    if ( _isSafari() ) {
      var aText = 'Hello, Safari user! To download this file...\n';
      aText += '1. Go to File --> Save As.\n';
      aText += '2. Choose "Page Source" as the Format.\n';
      aText += '3. Name it with this extension: .\"' + ext+'\"';
      alert(aText);
    }
    a.click();
    blob = null;
  };

  /**
   *  Returns a file extension, or another string
   *  if the provided parameter has no extension.
   *  
   *  @param   {String} filename
   *  @return  {String}          File Extension
   *  @private
   */
  function _checkFileExtension(filename) {
    return filename.split('.').pop();
  }

  /**
   *  Returns true if the browser is Safari, false if not.
   *  Safari makes trouble for downloading files.
   *  
   *  @return  {Boolean} [description]
   *  @private
   */
  function _isSafari() {
    var x = Object.prototype.toString.call(window.HTMLElement);
    return x.indexOf('Constructor') > 0;
  }

  /**
   *  Helper function, a callback for download that deletes
   *  an invisible anchor element from the DOM once the file
   *  has been automatically downloaded.
   *  
   *  @private
   */
  function destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }

  return p5;

});
