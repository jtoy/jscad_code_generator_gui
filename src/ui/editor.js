// ui-editor.js
//
// == OpenJSCAD.org, Copyright (c) 2013-2016, Licensed under MIT License
//
// Editor Functionality
//
// History:
//   2016/06/27: 0.5.1: added local storage by Robert Starkey
//   2016/02/02: 0.4.0: GUI refactored, functionality split up into more files, mostly done by Z3 Dev

// --- Dependencies
// gProcessor var
// #editor element

// --- Global Variables
const ace = require('brace')
require('brace/mode/javascript')
require('brace/mode/scad')
require('brace/theme/chrome')
const { shapes } = require('./shapes')
const { baseCode } = require('./shapes')
const { paramsCode } = require('./shapes')
const GL = require('./viewer/lightgl')

const openscadOpenJscadParser = require('@jscad/openscad-openjscad-translator')

 var globalRun; 
// See http://ace.ajax.org/#nav=howto
function setUpEditor (divname, gProcessor) {
  var gEditor = null
  if (divname === undefined) { divname = 'editor' }
  if (document.getElementById(divname) === null) return

  //Setup shape
  function addNewShape(shape) {
    var currentCode = gEditor.getValue();
    if (currentCode.indexOf("main") >= 0) {
      //add params
      currentCode = currentCode.replace(paramsCode.base[1], ",\n" + paramsCode.getShapeParams(shape) + paramsCode.base[1])
        //add shape
      currentCode = currentCode.replace(baseCode[1], ",\n" + shapes.getShape(shape) + baseCode[1])

    } else {
      currentCode = paramsCode.base[0] + paramsCode.getShapeParams(shape) + paramsCode.base[1];
      currentCode = currentCode + baseCode[0] + shapes.getShape(shape) + baseCode[1];
    }
    gEditor.setValue(currentCode, -1);
    runExec(gEditor);
  }
  for (var shape in shapes) {
    if (document.getElementById(shape)) {
      document.getElementById(shape).addEventListener("click", function(event) {
        addNewShape(event.target.id);
      })

      //drag
      document.getElementById(shape).ondragstart = function(event) {
        event.dataTransfer.setData("shape", event.target.id);
        event.dataTransfer.setData("code", shapes[event.target.id]);
      }
    }
  }
  //Drag/drop

  document.getElementById('viewerContext').ondragover = function(evt) {
    evt.preventDefault();
  };
  document.getElementById('viewerContext').ondrop = function(ev) {
    ev.preventDefault();
    var shape = ev.dataTransfer.getData("shape");
    //var code = ev.dataTransfer.getData("code");
    addNewShape(shape);
  };

function runExec(editor) {
    var src = editor.getValue()
    if (src.match(/^\/\/\!OpenSCAD/i)) {
      editor.getSession().setMode('ace/mode/scad')
      // FIXME test for the global function first
      src = openscadOpenJscadParser.parse(src)
    } else {
      editor.getSession().setMode('ace/mode/javascript')
    }
    if (gProcessor !== null) {
      gProcessor.setJsCad(src);
    }
  }

  gEditor = ace.edit(divname)
  gEditor.$blockScrolling = Infinity
  gEditor.getSession().setMode('ace/mode/javascript')
  // gEditor.setTheme("ace/theme/ambiance")
  // gEditor.setTheme("ace/theme/chaos")
  gEditor.setTheme('ace/theme/chrome')
  // gEditor.setTheme("ace/theme/clouds")
  // gEditor.setTheme("ace/theme/cobalt")
  // gEditor.setTheme("ace/theme/dawn") // nice
  // gEditor.setTheme("ace/theme/dreamweaver")
  // gEditor.setTheme("ace/theme/eclipse")
  // gEditor.setTheme("ace/theme/github")
  // gEditor.setTheme("ace/theme/idle_fingers")
  // gEditor.setTheme("ace/theme/katzenmilch")
  // gEditor.setTheme("ace/theme/kr_theme")
  // gEditor.setTheme("ace/theme/kuroir")
  // gEditor.setTheme("ace/theme/merbivore")
  // gEditor.setTheme("ace/theme/mono_industrial")
  // gEditor.setTheme("ace/theme/monokai")
  // gEditor.setTheme("ace/theme/pastel_on_dark")
  // gEditor.setTheme("ace/theme/solarized_dark")
  // gEditor.setTheme("ace/theme/solarized_light")
  // gEditor.setTheme("ace/theme/terminal")
  // gEditor.setTheme("ace/theme/textmate")
  // gEditor.setTheme("ace/theme/tomorrow")
  // gEditor.setTheme("ace/theme/tomorrow_night")
  // gEditor.setTheme("ace/theme/tomorrow_night_blue")
  // gEditor.setTheme("ace/theme/tomorrow_night_bright")
  // gEditor.setTheme("ace/theme/tomorrow_night_eighties")
  // gEditor.setTheme("ace/theme/twilight")
  // gEditor.setTheme("ace/theme/vibrant_ink")
  // gEditor.setTheme("ace/theme/xcode")

  
  // enable special keystrokes
  gEditor.commands.addCommand({
    name: 'setJSCAD',
    bindKey: { win: 'F5|Shift-Return', mac: 'F5|Shift-Return' },
    exec: runExec
  })
  document.body.addEventListener('keydown', function(evt) {
    if (evt.key === 'F5') {
      evt.preventDefault()
      //console.log('no accidental reloading!')
      runExec(gEditor);
    }
  });
  gEditor.commands.addCommand({
    name: 'viewerReset',
    bindKey: { win: 'Ctrl-Return', mac: 'Command-Return' },
    exec: function (editor) {
      if (gProcessor !== null) {
        gProcessor.viewer.resetCamera()
      }
    }
  })
  gEditor.commands.addCommand({
    name: 'saveSource',
    bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
    exec: function (editor) {
      var src = editor.getValue()
      localStorage.editorContent = src
      gProcessor.setStatus('saved', 'Saved source to browser storage')
    }
  })
  gEditor.commands.addCommand({
    name: 'loadSource',
    bindKey: { win: 'Ctrl-L', mac: 'Command-L' },
    exec: function (editor) {
      var src = localStorage.editorContent
      src && src.length ? editor.setValue(src, 1) : null
      gEditor.commands.exec('setJSCAD', editor)
      gProcessor.setStatus('loaded', 'Loaded source from browser storage')
    }
  })
  gEditor.commands.addCommand({
    name: 'downloadSource',
    bindKey: { win: 'Ctrl-Shift-S', mac: 'Command-Shift-S' },
    exec: function (editor) {
      var src = editor.getValue()
      setTimeout(function () {
        var blob = new Blob([src], {type: 'text/plain'})
        var object_url = URL.createObjectURL(blob)
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        save_link.href = object_url
        save_link.download = 'MyDesign.jscad'

        var event = new MouseEvent('click')
        save_link.dispatchEvent(event)
      }, 0)
    }
  })

  gEditor.runExec = runExec;
  return gEditor
}

function putSourceInEditor (gEditor, src, fn) {
  if (gEditor !== null) {
    gEditor.setValue(src, -1)
    if (src.match(/^\/\/!OpenSCAD/i)) {
      gEditor.getSession().setMode('ace/mode/scad')
    } else {
      gEditor.getSession().setMode('ace/mode/javascript')
    }
  }
}

function getSourceFromEditor (gEditor) {
  if (gEditor !== null) {
    return gEditor.getValue()
  }
  return ''
}

 function pick(gProcessor, x, y) {
   var tracer = new GL.Raytracer();
   var ray = tracer.getRayForPixel(x, y);
   var intersects = [];
   for (var i = 0; i < gProcessor.viewer.meshes.length; i++) {
     var bbox = gProcessor.viewer.meshes[i].getAABB();
     var result = GL.Raytracer.hitTestBox(
       tracer.eye, ray, bbox.min, bbox.max);
     if (result) {
      result.index = i;
       intersects.push(result);
     }
   }
   //find closest
   intersects.sort(function(a,b){
    return a.t > b.t?1:-1;
   })
   return intersects.length?intersects[0].index:-1;
 }

module.exports = {
  setUpEditor,
  putSourceInEditor,
  getSourceFromEditor,
  pick
}

