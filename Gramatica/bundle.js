(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.AST = void 0;
var AST = /** @class */ (function () {
    function AST(instrucciones) {
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }
    return AST;
}());
exports.AST = AST;

},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Entorno = void 0;
var Entorno = /** @class */ (function () {
    function Entorno(anterior) {
        this.tabla = {};
        this.anterior = anterior;
    }
    Entorno.prototype.agregar = function (id, simbolo) {
        id = id.toLowerCase();
        simbolo.indentificador = simbolo.indentificador.toLowerCase();
        this.tabla[id] = simbolo;
    };
    Entorno.prototype.eliminar = function (id) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                delete e.tabla[id];
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existe = function (id) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existeEnActual = function (id) {
        id = id.toLowerCase();
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    };
    Entorno.prototype.getSimbolo = function (id) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    };
    Entorno.prototype.reemplazar = function (id, nuevoValor) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                e.tabla[id] = nuevoValor;
            }
        }
    };
    return Entorno;
}());
exports.Entorno = Entorno;

},{}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Simbolo = void 0;
var Simbolo = /** @class */ (function () {
    function Simbolo(tipo, id, linea, columna, valor) {
        this.indentificador = id;
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.valor = valor;
    }
    Simbolo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Simbolo.prototype.getTipo = function (ent, arbol) {
        return this.tipo;
    };
    Simbolo.prototype.getValorImplicito = function (ent, arbol) {
        return this.valor;
    };
    return Simbolo;
}());
exports.Simbolo = Simbolo;

},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Tipo = void 0;
var Tipo;
(function (Tipo) {
    Tipo[Tipo["STRING"] = 0] = "STRING";
    Tipo[Tipo["INT"] = 1] = "INT";
    Tipo[Tipo["DOUBLE"] = 2] = "DOUBLE";
    Tipo[Tipo["BOOL"] = 3] = "BOOL";
    Tipo[Tipo["VOID"] = 4] = "VOID";
    Tipo[Tipo["STRUCT"] = 5] = "STRUCT";
    Tipo[Tipo["NULL"] = 6] = "NULL";
    Tipo[Tipo["ATRIBUTO"] = 7] = "ATRIBUTO";
    Tipo[Tipo["ARRAY"] = 8] = "ARRAY";
})(Tipo = exports.Tipo || (exports.Tipo = {}));

},{}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.AccesoVariable = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable = /** @class */ (function () {
    function AccesoVariable(identificador, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.identificador = identificador;
    }
    AccesoVariable.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoVariable.prototype.getTipo = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            return simbolo.getTipo(ent, arbol);
        }
        return Tipo_1.Tipo.NULL;
    };
    AccesoVariable.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            return simbolo.valor;
        }
        else {
            console.error("error semantico en Acceso, no existe la variable" + this.linea + " y columna " + this.columna);
        }
    };
    AccesoVariable.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return AccesoVariable;
}());
exports.AccesoVariable = AccesoVariable;

},{"../AST/Tipo":7}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Atributo = void 0;
var Atributo = /** @class */ (function () {
    function Atributo(id, valor, linea, columna) {
        this.identificador = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    return Atributo;
}());
exports.Atributo = Atributo;

},{}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Objeto = void 0;
var Entorno_1 = require("../AST/Entorno");
var Objeto = /** @class */ (function () {
    function Objeto(id, texto, linea, columna, listaAtributos, listaO) {
        this.identificador = id;
        this.texto = texto;
        this.linea = linea;
        this.columna = columna;
        this.listaAtributos = listaAtributos;
        this.listaObjetos = listaO;
        this.entorno = new Entorno_1.Entorno(null);
    }
    return Objeto;
}());
exports.Objeto = Objeto;

},{"../AST/Entorno":5}],11:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Operacion = exports.Operador = void 0;
var Tipo_1 = require("../AST/Tipo");
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operador[Operador["DIVISION"] = 3] = "DIVISION";
    Operador[Operador["MODULO"] = 4] = "MODULO";
    Operador[Operador["MENOS_UNARIO"] = 5] = "MENOS_UNARIO";
    Operador[Operador["MAYOR_QUE"] = 6] = "MAYOR_QUE";
    Operador[Operador["MENOR_QUE"] = 7] = "MENOR_QUE";
    Operador[Operador["IGUAL_IGUAL"] = 8] = "IGUAL_IGUAL";
    Operador[Operador["DIFERENTE_QUE"] = 9] = "DIFERENTE_QUE";
    Operador[Operador["OR"] = 10] = "OR";
    Operador[Operador["AND"] = 11] = "AND";
    Operador[Operador["NOT"] = 12] = "NOT";
    Operador[Operador["MAYOR_IGUAL_QUE"] = 13] = "MAYOR_IGUAL_QUE";
    Operador[Operador["MENOR_IGUAL_QUE"] = 14] = "MENOR_IGUAL_QUE";
    Operador[Operador["POW"] = 15] = "POW";
    Operador[Operador["SQRT"] = 16] = "SQRT";
    Operador[Operador["SENO"] = 17] = "SENO";
    Operador[Operador["COSENO"] = 18] = "COSENO";
    Operador[Operador["TAN"] = 19] = "TAN";
    Operador[Operador["DESCONOCIDO"] = 20] = "DESCONOCIDO";
})(Operador = exports.Operador || (exports.Operador = {}));
var Operacion = /** @class */ (function () {
    function Operacion(op_izquierda, op_derecha, operacion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.op_izquierda = op_izquierda;
        this.op_derecha = op_derecha;
        this.operador = operacion;
    }
    Operacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Operacion.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Operacion.prototype.getValorImplicito = function (ent, arbol) {
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT) {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            var op2 = this.op_derecha.getValorImplicito(ent, arbol);
            //suma
            if (this.operador == Operador.SUMA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 + op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //resta
            else if (this.operador == Operador.RESTA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 - op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una resta");
                    return null;
                }
            }
            //multiplicación
            else if (this.operador == Operador.MULTIPLICACION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 * op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una multiplicacion");
                    return null;
                }
            }
            //division
            else if (this.operador == Operador.DIVISION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        return null;
                    }
                    return op1 / op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una division");
                    return null;
                }
            }
            //modulo
            else if (this.operador == Operador.MODULO) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        return null;
                    }
                    return op1 % op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando un modulo");
                    return null;
                }
            }
            //Menor que
            else if (this.operador == Operador.MENOR_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 < op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Mayor que
            else if (this.operador == Operador.MAYOR_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 > op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Menor igual que
            else if (this.operador == Operador.MENOR_IGUAL_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 <= op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Mayor igual que
            else if (this.operador == Operador.MAYOR_IGUAL_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 >= op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Igual que
            else if (this.operador == Operador.IGUAL_IGUAL) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 == op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Diferente que
            else if (this.operador == Operador.DIFERENTE_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 != op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //And
            else if (this.operador == Operador.AND) {
                if (typeof (op1 === "boolean") && typeof (op2 === "boolean")) {
                    return op1 && op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion and");
                    return null;
                }
            }
            //Or
            else if (this.operador == Operador.OR) {
                if (typeof (op1 === "boolean") && typeof (op2 === "boolean")) {
                    return op1 || op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion or");
                    return null;
                }
            }
            //POW
            else if (this.operador == Operador.POW) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return Math.pow(op1, op2);
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una potencia");
                    return null;
                }
            }
            //SQRT
            else if (this.operador == Operador.SQRT) {
                if (typeof (op1 === "number")) {
                    return Math.sqrt(op1);
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una raiz");
                    return null;
                }
            }
            //SENO
            else if (this.operador == Operador.SENO) {
                if (typeof (op1 === "number")) {
                    return Math.sin(op1);
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando seno");
                    return null;
                }
            }
            //COSENO
            else if (this.operador == Operador.COSENO) {
                if (typeof (op1 === "number")) {
                    return Math.cos(op1);
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando coseno");
                    return null;
                }
            }
            //TANGENTE
            else if (this.operador == Operador.TAN) {
                if (typeof (op1 === "number")) {
                    return Math.tan(op1);
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando tangente");
                    return null;
                }
            }
        }
        else {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            if (this.operador == Operador.MENOS_UNARIO) {
                if (typeof (op1 === "number")) {
                    return -1 * op1;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una operación unaria");
                    return null;
                }
            }
            else if (this.operador == Operador.NOT) {
                if (typeof (op1 === "boolean")) {
                    return !op1;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion not");
                    return null;
                }
            }
        }
        return null;
    };
    Operacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Operacion;
}());
exports.Operacion = Operacion;

},{"../AST/Tipo":7}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Primitivo = void 0;
var Tipo_1 = require("../AST/Tipo");
var Primitivo = /** @class */ (function () {
    function Primitivo(valor, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }
    Primitivo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Primitivo.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Primitivo.prototype.getValorImplicito = function (ent, arbol) {
        return this.valor;
    };
    Primitivo.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Primitivo;
}());
exports.Primitivo = Primitivo;

},{"../AST/Tipo":7}],13:[function(require,module,exports){
let grammar = require("./grammar.js")
let AST = require("../AST/AST.js")
let Entorno = require("../AST/Entorno.js")
let Instruccion = require("../Interfaces/Instruccion.js")
let Print = require("../Instrucciones/Primitivas/Print.js")

if (typeof window !== 'undefined') {
    window.parseGrammar = function(input) {
        const instrucciones = grammar.parse(input);
        const ast = new AST.AST(instrucciones);
        const entornoGlobal = new Entorno.Entorno(null);
        let resultados = [];
        instrucciones.forEach(function(element) {
            let elementos = element.ejecutar(entornoGlobal, ast);
            let name = element.constructor.name;
            if (name === "Print") {
                resultados.push(elementos);
            }
        });
        return resultados;
    }
}
},{"../AST/AST.js":4,"../AST/Entorno.js":5,"../Instrucciones/Primitivas/Print.js":17,"../Interfaces/Instruccion.js":18,"./grammar.js":14}],14:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var grammar = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,10],$V1=[1,7],$V2=[1,8],$V3=[1,11],$V4=[1,12],$V5=[1,13],$V6=[1,14],$V7=[5,11,16,19,21,22,23,24],$V8=[1,37],$V9=[1,38],$Va=[1,39],$Vb=[1,40],$Vc=[1,41],$Vd=[1,42],$Ve=[1,43],$Vf=[1,44],$Vg=[1,45],$Vh=[1,30],$Vi=[1,31],$Vj=[1,32],$Vk=[1,33],$Vl=[1,34],$Vm=[1,35],$Vn=[1,36],$Vo=[8,20],$Vp=[1,51],$Vq=[1,52],$Vr=[1,53],$Vs=[1,54],$Vt=[1,55],$Vu=[1,56],$Vv=[1,57],$Vw=[1,58],$Vx=[1,59],$Vy=[1,60],$Vz=[1,61],$VA=[1,62],$VB=[1,63],$VC=[8,18,20,29,30,31,32,33,39,40,41,42,43,44,45,46],$VD=[8,18,20,29,30,31,32,39,40,41,42,43,44,45,46],$VE=[8,18,20,29,30,39,40,41,42,43,44,45,46],$VF=[8,18,20,39,40,41,42,43,44,45,46];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"START":3,"RAICES":4,"EOF":5,"RAIZ":6,"PRINT":7,"semicolon":8,"DECLARACION":9,"ASIGNACION":10,"identifier":11,"asign":12,"EXPR":13,"TIPO":14,"LISTA_ID":15,"print":16,"lparen":17,"rparen":18,"println":19,"coma":20,"int":21,"double":22,"boolean":23,"string":24,"PRIMITIVA":25,"OP_ARITMETICAS":26,"OP_RELACIONALES":27,"OP_LOGICAS":28,"plus":29,"minus":30,"multi":31,"div":32,"mod":33,"pow":34,"sqrt":35,"sin":36,"cos":37,"tan":38,"lt":39,"lte":40,"gt":41,"gte":42,"equal":43,"noequal":44,"and":45,"or":46,"not":47,"IntegerLiteral":48,"DoubleLiteral":49,"StringLiteral":50,"charliteral":51,"null":52,"true":53,"false":54,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"semicolon",11:"identifier",12:"asign",16:"print",17:"lparen",18:"rparen",19:"println",20:"coma",21:"int",22:"double",23:"boolean",24:"string",29:"plus",30:"minus",31:"multi",32:"div",33:"mod",34:"pow",35:"sqrt",36:"sin",37:"cos",38:"tan",39:"lt",40:"lte",41:"gt",42:"gte",43:"equal",44:"noequal",45:"and",46:"or",47:"not",48:"IntegerLiteral",49:"DoubleLiteral",50:"StringLiteral",51:"charliteral",52:"null",53:"true",54:"false"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,2],[10,3],[9,2],[9,4],[7,4],[7,4],[15,3],[15,1],[14,1],[14,1],[14,1],[14,1],[13,1],[13,1],[13,1],[13,1],[26,3],[26,3],[26,3],[26,3],[26,3],[26,2],[26,6],[26,4],[26,4],[26,4],[26,4],[27,3],[27,3],[27,3],[27,3],[27,3],[27,3],[28,3],[28,3],[28,2],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[25,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return this.$; 
break;
case 2:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 3: case 13:
 this.$ = [$$[$0]]; 
break;
case 4: case 5: case 6: case 50:
 this.$ = $$[$0-1] 
break;
case 7:
 this.$ = new Asignacion($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 8:
 this.$ = new Declaracion($$[$0], $$[$0-1], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 9:
 this.$ = new Declaracion([$$[$0-2]],$$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column,$$[$0]); 
break;
case 10:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 11:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column,true); 
break;
case 12:
 $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 14:
 this.$ = Tipo.INT; 
break;
case 15:
 this.$  = Tipo.DOUBLE; 
break;
case 16:
 this.$  = Tipo.BOOL; 
break;
case 17:
 this.$  = Tipo.STRING; 
break;
case 18: case 19: case 20: case 21:
 this.$ = $$[$0] 
break;
case 22:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 23:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 24:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 25:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 26:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 27:
 this.$ = new Operacion($$[$0],$$[$0],Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 28:
 this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 29:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 30:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.SENO, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 31:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.COSENO, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 32:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 33:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 34:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUAL_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 35:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 36:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUAL_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 37:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 38:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 39:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 40:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 41:
 this.$ = new Operacion($$[$0],$$[$0],Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 42: case 43:
 this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column); 
break;
case 44:
 this.$ = new Primitivo($$[$0].replace(/['"]+/g, ''), _$[$0].first_line, _$[$0].first_column); 
break;
case 45:
 this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 46:
 this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); 
break;
case 47:
 this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column); 
break;
case 48:
 this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column); 
break;
case 49:
 this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
}
},
table: [{3:1,4:2,6:3,7:4,9:5,10:6,11:$V0,14:9,16:$V1,19:$V2,21:$V3,22:$V4,23:$V5,24:$V6},{1:[3]},{5:[1,15],6:16,7:4,9:5,10:6,11:$V0,14:9,16:$V1,19:$V2,21:$V3,22:$V4,23:$V5,24:$V6},o($V7,[2,3]),{8:[1,17]},{8:[1,18]},{8:[1,19]},{17:[1,20]},{17:[1,21]},{11:[1,23],15:22},{12:[1,24]},{11:[2,14]},{11:[2,15]},{11:[2,16]},{11:[2,17]},{1:[2,1]},o($V7,[2,2]),o($V7,[2,4]),o($V7,[2,5]),o($V7,[2,6]),{11:$V8,13:25,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:46,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{8:[2,8],20:[1,47]},o($Vo,[2,13],{12:[1,48]}),{11:$V8,13:49,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{18:[1,50],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},o($VC,[2,18]),o($VC,[2,19]),o($VC,[2,20]),o($VC,[2,21]),o($VC,[2,42]),o($VC,[2,43]),o($VC,[2,44]),o($VC,[2,45]),o($VC,[2,46]),o($VC,[2,47]),o($VC,[2,48]),o($VC,[2,49]),{11:$V8,13:64,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:65,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{17:[1,66]},{17:[1,67]},{17:[1,68]},{17:[1,69]},{17:[1,70]},{11:$V8,13:71,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{18:[1,72],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},{11:[1,73]},{11:$V8,13:74,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{8:[2,7],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},{8:[2,10]},{11:$V8,13:75,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:76,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:77,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:78,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:79,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:80,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:81,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:82,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:83,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:84,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:85,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:86,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:87,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{18:[1,88],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},o($VC,[2,27]),{11:$V8,13:89,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:90,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:91,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:92,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},{11:$V8,13:93,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},o($VD,[2,41],{33:$Vt}),{8:[2,11]},o($Vo,[2,12]),{8:[2,9],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},o($VE,[2,22],{31:$Vr,32:$Vs,33:$Vt}),o($VE,[2,23],{31:$Vr,32:$Vs,33:$Vt}),o($VD,[2,24],{33:$Vt}),o($VD,[2,25],{33:$Vt}),o($VD,[2,26],{33:$Vt}),o($VF,[2,33],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt}),o($VF,[2,34],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt}),o($VF,[2,35],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt}),o($VF,[2,36],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt}),o($VF,[2,37],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt}),o($VF,[2,38],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt}),o([8,18,20,45,46],[2,39],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz}),o([8,18,20,46],[2,40],{29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VC,[2,50]),{20:[1,94],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},{18:[1,95],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},{18:[1,96],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},{18:[1,97],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},{18:[1,98],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},{11:$V8,13:99,17:$V9,25:26,26:27,27:28,28:29,30:$Va,34:$Vb,35:$Vc,36:$Vd,37:$Ve,38:$Vf,47:$Vg,48:$Vh,49:$Vi,50:$Vj,51:$Vk,52:$Vl,53:$Vm,54:$Vn},o($VC,[2,29]),o($VC,[2,30]),o($VC,[2,31]),o($VC,[2,32]),{18:[1,100],29:$Vp,30:$Vq,31:$Vr,32:$Vs,33:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA,46:$VB},o($VC,[2,28])],
defaultActions: {11:[2,14],12:[2,15],13:[2,16],14:[2,17],15:[2,1],50:[2,10],72:[2,11]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    const {Print} = require("../Instrucciones/Primitivas/Print.js");
    const {Declaracion} = require("../Instrucciones/Declaracion.js");
    const {Asignacion} = require("../Instrucciones/Asignacion.js");
    const {Tipo} = require("../AST/Tipo.js");
    const {Primitivo} = require("../Expresiones/Primitivo.js");
    const {Operacion, Operador} = require("../Expresiones/Operacion.js");
    const {Objeto} = require("../Expresiones/Objeto.js");
    const {Atributo} = require("../Expresiones/Atributo.js");
    const {AccesoVariable} = require("../Expresiones/AccesoVariable.js");
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 52
break;
case 1:return 21
break;
case 2:return 22
break;
case 3:return 23
break;
case 4:return 'char'
break;
case 5:return 24
break;
case 6:return 'struct'
break;
case 7:return 34
break;
case 8:return 35
break;
case 9:return 36
break;
case 10:return 37
break;
case 11:return 38
break;
case 12:return 16
break;
case 13:return 19
break;
case 14:return 53
break;
case 15:return 54
break;
case 16:/* Comentario multiple */
break;
case 17:/* Comentario simple */
break;
case 18:/* Ignora espacio y tabs */
break;
case 19:/* Ignora espacio */
break;
case 20:return 49;
break;
case 21:return 48;
break;
case 22:return 11;
break;
case 23:return 50
break;
case 24:return 'CharLiteral'
break;
case 25:return 31
break;
case 26:return 32
break;
case 27:return 30
break;
case 28:return 29
break;
case 29:return 'pot'
break;
case 30:return 33
break;
case 31:return 17
break;
case 32:return 18
break;
case 33:return 43
break;
case 34:return 12
break;
case 35:return 44
break;
case 36:return 47
break;
case 37:return 40
break;
case 38:return 42
break;
case 39:return 39
break;
case 40:return 41
break;
case 41:return 45
break;
case 42:return 46
break;
case 43:return 8
break;
case 44:return 'dosp'
break;
case 45:return 'quest'
break;
case 46:return 'amp'
break;
case 47:return 20
break;
case 48:return 'doll'
break;
case 49:console.error('Error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', y columna: ' + yy_.yylloc.first_column);
break;
case 50:return 5
break;
case 51:return 'INVALID'
break;
}
},
rules: [/^(?:null\b)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:string\b)/i,/^(?:struct\b)/i,/^(?:pow\b)/i,/^(?:sqrt\b)/i,/^(?:sin\b)/i,/^(?:cos\b)/i,/^(?:tan\b)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:[/][*][^]*[*][/])/i,/^(?:[/][/].*)/i,/^(?:[\t\n\r]+)/i,/^(?:\s+)/i,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i,/^(?:[0-9]+)/i,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/i,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:-)/i,/^(?:\+)/i,/^(?:\^)/i,/^(?:%)/i,/^(?:\()/i,/^(?:\))/i,/^(?:==)/i,/^(?:=)/i,/^(?:!=)/i,/^(?:!)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:;)/i,/^(?::)/i,/^(?:\?)/i,/^(?:&)/i,/^(?:,)/i,/^(?:\$)/i,/^(?:.)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = grammar;
exports.Parser = grammar.Parser;
exports.parse = function () { return grammar.parse.apply(grammar, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../AST/Tipo.js":7,"../Expresiones/AccesoVariable.js":8,"../Expresiones/Atributo.js":9,"../Expresiones/Objeto.js":10,"../Expresiones/Operacion.js":11,"../Expresiones/Primitivo.js":12,"../Instrucciones/Asignacion.js":15,"../Instrucciones/Declaracion.js":16,"../Instrucciones/Primitivas/Print.js":17,"_process":3,"fs":1,"path":2}],15:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Asignacion = void 0;
var Asignacion = /** @class */ (function () {
    function Asignacion(identificador, exp, tipo, linea, columna) {
        this.identificador = identificador;
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Asignacion.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == this.expresion.getTipo(ent, arbol)) {
                var valor = this.expresion.getValorImplicito(ent, arbol);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            }
            else {
                console.error("error semantico en asignacion no se puede asignar un valor diferente al de la varianble en linea " + this.linea + " y columna " + this.columna);
            }
        }
        else {
            console.error("error semantico en asignacion no existe la variable en linea " + this.linea + " y columna " + this.columna);
        }
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{}],16:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Declaracion = void 0;
var Tipo_1 = require("../AST/Tipo");
var Simbolo_1 = require("../AST/Simbolo");
var Declaracion = /** @class */ (function() {
    function Declaracion(identificadores, tipo, linea, columna, exp) {
        if (exp === void 0) { exp = null; }
        this.identificadores = identificadores;
        this.tipo = tipo;
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Declaracion.prototype.traducir = function(ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Declaracion.prototype.ejecutar = function(ent, arbol) {
        var _this = this;
        this.identificadores.forEach(function(id) {
            if (!ent.existe(id)) {
                if (_this.expresion !== null) {
                    if (_this.tipo == _this.expresion.getTipo(ent, arbol)) {
                        var valor = _this.expresion.getValorImplicito(ent, arbol);
                        var simbolo = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbolo);
                    } else {
                        console.error("error semantico en declaracion no se permite asignar un valor diferente al declarado " + _this.linea + " y columna " + _this.columna);
                    }
                } else {
                    var simbolo = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.getValorDefault());
                    ent.agregar(id, simbolo);
                }
            } else {
                console.error("error semantico en declaracion no se permite declarar dos id con el mismo nombre en linea " + _this.linea + " y columna " + _this.columna);
            }
        });
    };
    Declaracion.prototype.getValorDefault = function() {
        if (this.tipo == Tipo_1.Tipo.INT) {
            return 0;
        } else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
            return 0.0;
        } else if (this.tipo == Tipo_1.Tipo.BOOL) {
            return false;
        } else if (this.tipo == Tipo_1.Tipo.STRING) {
            return "";
        } else {
            return null;
        }
    };
    return Declaracion;
}());
exports.Declaracion = Declaracion;
},{"../AST/Simbolo":6,"../AST/Tipo":7}],17:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Print = void 0;
var Print = /** @class */ (function () {
    function Print(exp, linea, columna, saltoLinea) {
        if (saltoLinea === void 0) { saltoLinea = false; }
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.saltoLinea = saltoLinea;
    }
    Print.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Print.prototype.ejecutar = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        if (valor !== null) {
            if (this.saltoLinea) {
                return valor + "\n";
            }
            else {
                return valor;
            }
        }
        else {
            console.log('>> Error, no se pueden imprimir valores nulos');
            return "Error, no se pueden imprimir valores nulos";
        }
    };
    return Print;
}());
exports.Print = Print;

},{}],18:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}]},{},[13]);
