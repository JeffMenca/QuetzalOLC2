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
        var e = this;
        while (e != null) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
            e = e.anterior;
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
var AccesoVariable = /** @class */ (function() {
    function AccesoVariable(identificador, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.identificador = identificador;
    }
    AccesoVariable.prototype.traducir = function(ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoVariable.prototype.getTipo = function(ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            return simbolo.getTipo(ent, arbol);
        }
        return Tipo_1.Tipo.NULL;
    };
    AccesoVariable.prototype.getValorImplicito = function(ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            return simbolo.valor;
        } else {
            console.error("error semantico en Acceso, no existe la variable en linea " + this.linea + " y columna " + this.columna);
        }
    };
    AccesoVariable.prototype.isInt = function(n) {
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
        let banderaMain = 0;
        let acciones = [];
        for (let element of instrucciones) {
            if (element.constructor.name == "Main") {
                banderaMain = banderaMain + 1;
            }
            if (banderaMain <= 1) {
                let accionesSecundarias = actionGlobal(element, entornoGlobal, ast);
                accionesSecundarias.forEach(function(element2) {
                    acciones.push(element2);
                });
            } else {
                acciones.push("Error, existe mas de 1 metodo Main");
                break;
            }
        }
        return acciones;
    }
}

function actionGlobal(element, ent, ast) {
    let name = element.constructor.name;
    let resultados = [];
    let bandera = false;
    let banderaContinue = false;
    //MAIN
    if (name == "Main") {
        let entornoMain = new Entorno.Entorno(ent);
        let accionesMain = element.ejecutar(entornoMain, ast);
        for (let element2 of accionesMain) {
            let name2 = element2.constructor.name;
            if (name2 !== "Print" && name2 !== "undefined") {
                let acciones = actionGlobal(element2, entornoMain, ast);
                for (let element2 of acciones) {
                    resultados.push(element2);
                }
            } else {
                let elementos = element2.ejecutar(entornoMain, ast);
                if (name2 === "Print") {
                    resultados.push(elementos);
                }
            }
        }
        //WHILE
    } else if (name == "While") {
        let entornoWhile = new Entorno.Entorno(ent);
        while (element.condicion.getValorImplicito(entornoWhile, ast)) {
            entornoWhile = new Entorno.Entorno(ent);
            let accionesWhile = element.ejecutar(entornoWhile, ast);
            for (let element2 of accionesWhile) {
                let name2 = element2.constructor.name;
                if (name2 == "Break") {
                    bandera = true;
                    break;
                }
                if (name2 == "Continue") {
                    banderaContinue = true;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoWhile, ast);
                    for (let element2 of acciones) {
                        if (element2.constructor.name == "Break") {
                            bandera = true;
                            break;
                        } else if (element2.constructor.name == "Continue") {
                            banderaContinue = true;
                            break;
                        } else {
                            resultados.push(element2);
                        }
                    }
                    if (bandera == true || banderaContinue == true) {
                        break;
                    }
                } else {
                    let elementos = element2.ejecutar(entornoWhile, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
            if (bandera == true) {
                bandera = false;
                break;
            }
            if (banderaContinue == true) {
                banderaContinue = false;
                continue;
            }
        }
        //IF, ELSE Y ELSEIF
    } else if (name == "If") {
        const entornoIf = new Entorno.Entorno(ent);
        let accionesIf = element.ejecutar(entornoIf, ast);
        if (element.condicion.getValorImplicito(entornoIf, ast)) {
            accionesIf.forEach(function(element2) {
                let name2 = element2.constructor.name;
                if (name2 == "Break" || name2 == "Continue") {
                    resultados.push(element2);
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoIf, ast);
                    acciones.forEach(function(element2) {
                        resultados.push(element2);
                    });
                } else {
                    let elementos = element2.ejecutar(entornoIf, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            });
        } else {
            const entornoElse = new Entorno.Entorno(ent);
            let accionesElse = element.ejecutar(entornoElse, ast);
            if (accionesElse != undefined) {
                accionesElse.forEach(function(element2) {
                    let name2 = element2.constructor.name;
                    if (name2 == "Break" || name2 == "Continue") {
                        resultados.push(element2);
                    } else if (name2 !== "Print" && name2 !== "undefined") {
                        let acciones = actionGlobal(element2, entornoElse, ast);
                        acciones.forEach(function(element2) {
                            resultados.push(element2);
                        });
                    } else {
                        let elementos = element2.ejecutar(entornoElse, ast);
                        if (name2 === "Print") {
                            resultados.push(elementos);
                        }
                    }
                });
            }
        } //DO WHILE
    } else if (name == "Dowhile") {
        let entornoDowhile = new Entorno.Entorno(ent);
        do {
            entornoDowhile = new Entorno.Entorno(ent);
            let accionesDowhile = element.ejecutar(entornoDowhile, ast);
            for (let element2 of accionesDowhile) {
                let name2 = element2.constructor.name;
                if (name2 == "Break") {
                    bandera = true;
                    break;
                }
                if (name2 == "Continue") {
                    banderaContinue = true;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoDowhile, ast);
                    for (let element2 of acciones) {
                        if (element2.constructor.name == "Break") {
                            bandera = true;
                            break;
                        } else if (element2.constructor.name == "Continue") {
                            banderaContinue = true;
                            break;
                        } else {
                            resultados.push(element2);
                        }
                    }
                    if (bandera == true || banderaContinue == true) {
                        break;
                    }
                } else {
                    let elementos = element2.ejecutar(entornoDowhile, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
            if (bandera == true) {
                bandera = false;
                break;
            }
            if (banderaContinue == true) {
                banderaContinue = false;
                continue;
            }
        } while (element.condicion.getValorImplicito(entornoDowhile, ast));
        //FOR
    } else if (name == "For") {
        const entornoFor = new Entorno.Entorno(ent);
        let entornoForAcciones = new Entorno.Entorno(entornoFor);
        element.ejecutarDeclaracion(entornoFor, ast);
        while (element.condicion.getValorImplicito(entornoFor, ast)) {
            entornoForAcciones = new Entorno.Entorno(entornoFor);
            element.ejecutarAsignacion(entornoFor, ast);
            let accionesFor = element.ejecutar(entornoForAcciones, ast);
            for (let element2 of accionesFor) {
                let name2 = element2.constructor.name;
                if (name2 == "Break") {
                    bandera = true;
                    break;
                }
                if (name2 == "Continue") {
                    banderaContinue = true;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoForAcciones, ast);
                    for (let element2 of acciones) {
                        if (element2.constructor.name == "Break") {
                            bandera = true;
                            break;
                        } else if (element2.constructor.name == "Continue") {
                            banderaContinue = true;
                            break;
                        } else {
                            resultados.push(element2);
                        }
                    }
                    if (bandera == true || banderaContinue == true) {
                        break;
                    }
                } else {
                    let elementos = element2.ejecutar(entornoForAcciones, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
            if (bandera == true) {
                bandera = false;
                break;
            }
            if (banderaContinue == true) {
                banderaContinue = false;
                continue;
            }
        }
        //PRINTS Y ELEMENTOS
    } else {
        let elementos = element.ejecutar(ent, ast);
        //PRINTS
        if (name === "Print") {
            resultados.push(elementos);
        }
    }
    return resultados;
}
},{"../AST/AST.js":4,"../AST/Entorno.js":5,"../Instrucciones/Primitivas/Print.js":23,"../Interfaces/Instruccion.js":25,"./grammar.js":14}],14:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,8],$V2=[1,10],$V3=[1,11],$V4=[1,12],$V5=[1,13],$V6=[5,8,35,45,46,47,48],$V7=[1,20],$V8=[17,44],$V9=[1,38],$Va=[1,37],$Vb=[1,39],$Vc=[1,40],$Vd=[1,41],$Ve=[1,42],$Vf=[1,43],$Vg=[1,44],$Vh=[1,45],$Vi=[1,30],$Vj=[1,31],$Vk=[1,32],$Vl=[1,33],$Vm=[1,34],$Vn=[1,35],$Vo=[1,36],$Vp=[1,49],$Vq=[1,50],$Vr=[1,51],$Vs=[1,52],$Vt=[1,53],$Vu=[1,54],$Vv=[1,55],$Vw=[1,56],$Vx=[1,57],$Vy=[1,58],$Vz=[1,59],$VA=[1,60],$VB=[1,61],$VC=[11,17,44,53,54,55,56,57,63,64,65,66,67,68,69,70],$VD=[1,62],$VE=[1,63],$VF=[11,17,44,53,54,55,56,63,64,65,66,67,68,69,70],$VG=[11,17,44,53,54,63,64,65,66,67,68,69,70],$VH=[11,17,44,63,64,65,66,67,68,69,70],$VI=[1,113],$VJ=[1,114],$VK=[1,115],$VL=[1,116],$VM=[1,112],$VN=[1,117],$VO=[1,118],$VP=[1,110],$VQ=[1,111],$VR=[14,27,31,32,33,35,39,40,42,43,45,46,47,48];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"START":3,"GLOBAL":4,"EOF":5,"INSTRUCCIONGLOBAL":6,"MAIN":7,"void":8,"main":9,"lparen":10,"rparen":11,"lllave":12,"LISTA_INSTRUCCIONES":13,"rllave":14,"INSTRUCCION":15,"PRINT":16,"semicolon":17,"DECLARACION":18,"ASIGNACION":19,"IF":20,"WHILE":21,"DOWHILE":22,"FOR":23,"BREAK":24,"CONTINUE":25,"INCREMENTO":26,"if":27,"EXPR":28,"ELSE":29,"else":30,"while":31,"do":32,"for":33,"TIPO":34,"identifier":35,"asign":36,"plusdouble":37,"minusdouble":38,"break":39,"continue":40,"LISTA_ID":41,"print":42,"println":43,"coma":44,"int":45,"double":46,"boolean":47,"string":48,"PRIMITIVA":49,"OP_ARITMETICAS":50,"OP_RELACIONALES":51,"OP_LOGICAS":52,"plus":53,"minus":54,"multi":55,"div":56,"mod":57,"pow":58,"sqrt":59,"sin":60,"cos":61,"tan":62,"lt":63,"lte":64,"gt":65,"gte":66,"equal":67,"noequal":68,"and":69,"or":70,"not":71,"IntegerLiteral":72,"DoubleLiteral":73,"StringLiteral":74,"charliteral":75,"null":76,"true":77,"false":78,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"void",9:"main",10:"lparen",11:"rparen",12:"lllave",14:"rllave",17:"semicolon",27:"if",30:"else",31:"while",32:"do",33:"for",35:"identifier",36:"asign",37:"plusdouble",38:"minusdouble",39:"break",40:"continue",42:"print",43:"println",44:"coma",45:"int",46:"double",47:"boolean",48:"string",53:"plus",54:"minus",55:"multi",56:"div",57:"mod",58:"pow",59:"sqrt",60:"sin",61:"cos",62:"tan",63:"lt",64:"lte",65:"gt",66:"gte",67:"equal",68:"noequal",69:"and",70:"or",71:"not",72:"IntegerLiteral",73:"DoubleLiteral",74:"StringLiteral",75:"charliteral",76:"null",77:"true",78:"false"},
productions_: [0,[3,2],[4,2],[4,1],[7,7],[13,2],[13,1],[15,2],[15,2],[15,2],[15,1],[15,1],[15,2],[15,1],[15,2],[15,2],[15,2],[6,2],[6,2],[6,1],[20,7],[20,8],[20,9],[20,5],[29,4],[21,7],[22,8],[23,16],[23,15],[23,15],[24,1],[25,1],[19,3],[26,2],[26,2],[18,2],[18,4],[16,4],[16,4],[41,3],[41,1],[34,1],[34,1],[34,1],[34,1],[28,1],[28,1],[28,1],[28,1],[28,1],[50,3],[50,3],[50,3],[50,3],[50,3],[50,2],[50,6],[50,4],[50,4],[50,4],[50,4],[51,3],[51,3],[51,3],[51,3],[51,3],[51,3],[52,3],[52,3],[52,2],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return this.$; 
break;
case 2: case 5:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 3: case 6: case 40:
 this.$ = [$$[$0]]; 
break;
case 4:
 this.$ = new Main($$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 7: case 8: case 9: case 12: case 14: case 15: case 16: case 17: case 18:
 this.$ = $$[$0-1]; 
break;
case 10: case 11: case 13: case 19:
 this.$ = $$[$0]; 
break;
case 20:
 this.$ = new If($$[$0-4], $$[$0-1],[],[], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 21:
 this.$ = new If($$[$0-5], $$[$0-2], $$[$0],[], _$[$0-7].first_line, _$[$0-7].first_column); 
break;
case 22:
 this.$ = new If($$[$0-6], $$[$0-3],[],[$$[$0]], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 23:
 this.$ = new If($$[$0-2], [$$[$0]],[],[], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 24:
this.$ = $$[$0-1];
break;
case 25:
 this.$ = new While($$[$0-4], $$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 26:
 this.$ = new Dowhile($$[$0-1], $$[$0-5], _$[$0-7].first_line, _$[$0-7].first_column); 
break;
case 27:
 this.$ = new For($$[$0-8], $$[$0-1], $$[$0-12], $$[$0-13], $$[$0-10], $$[$0-4], $$[$0-6],false,false, _$[$0-15].first_line, _$[$0-15].first_column); 
break;
case 28:
 this.$ = new For($$[$0-7], $$[$0-1], $$[$0-11], $$[$0-12], $$[$0-9], $$[$0-5], $$[$0-5],true,false, _$[$0-14].first_line, _$[$0-14].first_column); 
break;
case 29:
 this.$ = new For($$[$0-7], $$[$0-1], $$[$0-11], $$[$0-12], $$[$0-9], $$[$0-5], $$[$0-5],false,true, _$[$0-14].first_line, _$[$0-14].first_column); 
break;
case 30:
 this.$ = new Break( _$[$0].first_line, _$[$0].first_column); 
break;
case 31:
 this.$ = new Continue( _$[$0].first_line, _$[$0].first_column); 
break;
case 32:
 this.$ = new Asignacion($$[$0-2], $$[$0],false,false, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 33:
 this.$ = new Asignacion($$[$0-1],$$[$0-1] ,true,false, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 34:
 this.$ = new Asignacion($$[$0-1],$$[$0-1] ,false,true, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 35:
 this.$ = new Declaracion($$[$0], $$[$0-1], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 36:
 this.$ = new Declaracion([$$[$0-2]],$$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column,$$[$0]); 
break;
case 37:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 38:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column,true); 
break;
case 39:
 $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 41:
 this.$ = Tipo.INT; 
break;
case 42:
 this.$  = Tipo.DOUBLE; 
break;
case 43:
 this.$  = Tipo.BOOL; 
break;
case 44:
 this.$  = Tipo.STRING; 
break;
case 45: case 46: case 47: case 48: case 49:
 this.$ = $$[$0] 
break;
case 50:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 51:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 52:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 53:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 54:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 55:
 this.$ = new Operacion($$[$0],$$[$0],Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 56:
 this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 57:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 58:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.SENO, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 59:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.COSENO, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 60:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 61:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 62:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUAL_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 63:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 64:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUAL_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 65:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 66:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 67:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 68:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 69:
 this.$ = new Operacion($$[$0],$$[$0],Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 70: case 71:
 this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column); 
break;
case 72:
 this.$ = new Primitivo($$[$0].replace(/['"]+/g, ''), _$[$0].first_line, _$[$0].first_column); 
break;
case 73:
 this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 74:
 this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); 
break;
case 75:
 this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column); 
break;
case 76:
 this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column); 
break;
case 77:
 this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 78:
 this.$ = $$[$0-1] 
break;
}
},
table: [{3:1,4:2,6:3,7:6,8:$V0,18:4,19:5,34:7,35:$V1,45:$V2,46:$V3,47:$V4,48:$V5},{1:[3]},{5:[1,14],6:15,7:6,8:$V0,18:4,19:5,34:7,35:$V1,45:$V2,46:$V3,47:$V4,48:$V5},o($V6,[2,3]),{17:[1,16]},{17:[1,17]},o($V6,[2,19]),{35:[1,19],41:18},{36:$V7},{9:[1,21]},{35:[2,41]},{35:[2,42]},{35:[2,43]},{35:[2,44]},{1:[2,1]},o($V6,[2,2]),o($V6,[2,17]),o($V6,[2,18]),{17:[2,35],44:[1,22]},o($V8,[2,40],{36:[1,23]}),{10:$V9,26:29,28:24,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:[1,46]},{35:[1,47]},{10:$V9,26:29,28:48,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{17:[2,32],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},o($VC,[2,45]),o($VC,[2,46]),o($VC,[2,47]),o($VC,[2,48]),o($VC,[2,49]),o($VC,[2,70]),o($VC,[2,71]),o($VC,[2,72]),o($VC,[2,73]),o($VC,[2,74]),o($VC,[2,75]),o($VC,[2,76]),o($VC,[2,77],{37:$VD,38:$VE}),{10:$V9,26:29,28:64,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:65,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:[1,66]},{10:[1,67]},{10:[1,68]},{10:[1,69]},{10:[1,70]},{10:$V9,26:29,28:71,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{11:[1,72]},o($V8,[2,39]),{17:[2,36],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{10:$V9,26:29,28:73,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:74,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:75,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:76,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:77,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:78,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:79,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:80,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:81,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:82,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:83,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:84,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:85,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},o($VC,[2,33]),o($VC,[2,34]),{11:[1,86],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},o($VC,[2,55]),{10:$V9,26:29,28:87,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:88,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:89,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:90,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:91,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},o($VF,[2,69],{57:$Vt}),{12:[1,92]},o($VG,[2,50],{55:$Vr,56:$Vs,57:$Vt}),o($VG,[2,51],{55:$Vr,56:$Vs,57:$Vt}),o($VF,[2,52],{57:$Vt}),o($VF,[2,53],{57:$Vt}),o($VF,[2,54],{57:$Vt}),o($VH,[2,61],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt}),o($VH,[2,62],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt}),o($VH,[2,63],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt}),o($VH,[2,64],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt}),o($VH,[2,65],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt}),o($VH,[2,66],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt}),o([11,17,44,69,70],[2,67],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz}),o([11,17,44,70],[2,68],{53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA}),o($VC,[2,78]),{44:[1,93],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{11:[1,94],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{11:[1,95],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{11:[1,96],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{11:[1,97],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{13:98,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{10:$V9,26:29,28:119,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},o($VC,[2,57]),o($VC,[2,58]),o($VC,[2,59]),o($VC,[2,60]),{14:[1,120],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},o($VR,[2,6]),{17:[1,122]},{17:[1,123]},{17:[1,124]},o($VR,[2,10]),o($VR,[2,11]),{17:[1,125]},o($VR,[2,13]),{17:[1,126]},{17:[1,127]},{17:[1,128]},{10:[1,129]},{10:[1,130]},{36:$V7,37:$VD,38:$VE},{10:[1,131]},{10:[1,132]},{12:[1,133]},{10:[1,134]},{17:[2,30]},{17:[2,31]},{11:[1,135],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},o($V6,[2,4]),o($VR,[2,5]),o($VR,[2,7]),o($VR,[2,8]),o($VR,[2,9]),o($VR,[2,12]),o($VR,[2,14]),o($VR,[2,15]),o($VR,[2,16]),{10:$V9,26:29,28:136,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:137,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:138,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{10:$V9,26:29,28:139,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{13:140,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{34:141,45:$V2,46:$V3,47:$V4,48:$V5},o($VC,[2,56]),{11:[1,142],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{11:[1,143],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{11:[1,144],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{11:[1,145],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{14:[1,146],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{35:[1,147]},{17:[2,37]},{17:[2,38]},{12:[1,148],15:149,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{12:[1,150]},{31:[1,151]},{36:[1,152]},{13:153,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},o($VR,[2,23]),{13:154,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{10:[1,155]},{10:$V9,26:29,28:156,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{14:[1,157],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{14:[1,158],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{10:$V9,26:29,28:159,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{17:[1,160],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},o($VR,[2,20],{29:161,30:[1,162]}),o($VR,[2,25]),{11:[1,163],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{10:$V9,26:29,28:164,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},o($VR,[2,21]),{12:[1,166],20:165,27:$VI},{17:[2,26]},{17:[1,167],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},o($VR,[2,22]),{13:168,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{35:[1,169]},{14:[1,170],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{36:[1,171],37:[1,172],38:[1,173]},o($VR,[2,24]),{10:$V9,26:29,28:174,35:$Va,49:25,50:26,51:27,52:28,54:$Vb,58:$Vc,59:$Vd,60:$Ve,61:$Vf,62:$Vg,71:$Vh,72:$Vi,73:$Vj,74:$Vk,75:$Vl,76:$Vm,77:$Vn,78:$Vo},{11:[1,175]},{11:[1,176]},{11:[1,177],53:$Vp,54:$Vq,55:$Vr,56:$Vs,57:$Vt,63:$Vu,64:$Vv,65:$Vw,66:$Vx,67:$Vy,68:$Vz,69:$VA,70:$VB},{12:[1,178]},{12:[1,179]},{12:[1,180]},{13:181,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{13:182,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{13:183,15:99,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{14:[1,184],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{14:[1,185],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},{14:[1,186],15:121,16:100,18:101,19:102,20:103,21:104,22:105,23:106,24:107,25:108,26:109,27:$VI,31:$VJ,32:$VK,33:$VL,34:7,35:$VM,39:$VN,40:$VO,42:$VP,43:$VQ,45:$V2,46:$V3,47:$V4,48:$V5},o($VR,[2,28]),o($VR,[2,29]),o($VR,[2,27])],
defaultActions: {10:[2,41],11:[2,42],12:[2,43],13:[2,44],14:[2,1],117:[2,30],118:[2,31],142:[2,37],143:[2,38],163:[2,26]},
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

    const {Main} = require("../Instrucciones/Main.js");
    const {Print} = require("../Instrucciones/Primitivas/Print.js");
    const {If} = require("../Instrucciones/If.js");
    const {While} = require("../Instrucciones/While.js");
    const {Dowhile} = require("../Instrucciones/Dowhile.js");
    const {For} = require("../Instrucciones/For.js");
    const {Break} = require("../Instrucciones/Break.js");
    const {Continue} = require("../Instrucciones/Continue.js");
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
case 0:return 76
break;
case 1:return 45
break;
case 2:return 46
break;
case 3:return 47
break;
case 4:return 'char'
break;
case 5:return 48
break;
case 6:return 'struct'
break;
case 7:return 58
break;
case 8:return 59
break;
case 9:return 60
break;
case 10:return 61
break;
case 11:return 62
break;
case 12:return 42
break;
case 13:return 43
break;
case 14:return 77
break;
case 15:return 78
break;
case 16:return 27
break;
case 17:return 30
break;
case 18:return 32
break;
case 19:return 31
break;
case 20:return 33
break;
case 21:return 39
break;
case 22:return 40
break;
case 23:return 8
break;
case 24:return 9
break;
case 25:/* Comentario multiple */
break;
case 26:/* Comentario simple */
break;
case 27:/* Ignora espacio y tabs */
break;
case 28:/* Ignora espacio */
break;
case 29:return 73;
break;
case 30:return 72;
break;
case 31:return 35;
break;
case 32:return 74
break;
case 33:return 'CharLiteral'
break;
case 34:return 55
break;
case 35:return 56
break;
case 36:return 37
break;
case 37:return 38
break;
case 38:return 54
break;
case 39:return 53
break;
case 40:return 'pot'
break;
case 41:return 57
break;
case 42:return 10
break;
case 43:return 11
break;
case 44:return 67
break;
case 45:return 36
break;
case 46:return 68
break;
case 47:return 71
break;
case 48:return 64
break;
case 49:return 66
break;
case 50:return 63
break;
case 51:return 65
break;
case 52:return 69
break;
case 53:return 70
break;
case 54:return 17
break;
case 55:return 'dosp'
break;
case 56:return 'quest'
break;
case 57:return 12
break;
case 58:return 14
break;
case 59:return 'amp'
break;
case 60:return 44
break;
case 61:return 'doll'
break;
case 62:console.error('Error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', y columna: ' + yy_.yylloc.first_column);
break;
case 63:return 5
break;
case 64:return 'INVALID'
break;
}
},
rules: [/^(?:null\b)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:string\b)/i,/^(?:struct\b)/i,/^(?:pow\b)/i,/^(?:sqrt\b)/i,/^(?:sin\b)/i,/^(?:cos\b)/i,/^(?:tan\b)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:do\b)/i,/^(?:while\b)/i,/^(?:for\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:void\b)/i,/^(?:main\b)/i,/^(?:[/][*][^]*[*][/])/i,/^(?:[/][/].*)/i,/^(?:[\t\n\r]+)/i,/^(?:\s+)/i,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i,/^(?:[0-9]+)/i,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/i,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:-)/i,/^(?:\+)/i,/^(?:\^)/i,/^(?:%)/i,/^(?:\()/i,/^(?:\))/i,/^(?:==)/i,/^(?:=)/i,/^(?:!=)/i,/^(?:!)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:;)/i,/^(?::)/i,/^(?:\?)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:&)/i,/^(?:,)/i,/^(?:\$)/i,/^(?:.)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64],"inclusive":true}}
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
},{"../AST/Tipo.js":7,"../Expresiones/AccesoVariable.js":8,"../Expresiones/Atributo.js":9,"../Expresiones/Objeto.js":10,"../Expresiones/Operacion.js":11,"../Expresiones/Primitivo.js":12,"../Instrucciones/Asignacion.js":15,"../Instrucciones/Break.js":16,"../Instrucciones/Continue.js":17,"../Instrucciones/Declaracion.js":18,"../Instrucciones/Dowhile.js":19,"../Instrucciones/For.js":20,"../Instrucciones/If.js":21,"../Instrucciones/Main.js":22,"../Instrucciones/Primitivas/Print.js":23,"../Instrucciones/While.js":24,"_process":3,"fs":1,"path":2}],15:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Asignacion = void 0;
var Tipo_1 = require("../AST/Tipo");
var Asignacion = /** @class */ (function () {
    function Asignacion(identificador, exp, incremento, decremento, linea, columna) {
        this.identificador = identificador;
        this.expresion = exp;
        this.incremento = incremento;
        this.decremento = decremento;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Asignacion.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if ((simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.INT && this.incremento == true) || (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.DOUBLE && this.incremento == true)) {
                simbolo.valor = simbolo.valor + 1;
                ent.reemplazar(this.identificador, simbolo);
                this.incremento = false;
                return simbolo.valor;
            }
            else if ((simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.INT && this.decremento == true) || (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.DOUBLE && this.decremento == true)) {
                simbolo.valor = simbolo.valor - 1;
                ent.reemplazar(this.identificador, simbolo);
                this.decremento = false;
                return simbolo.valor;
            }
            else if (simbolo.getTipo(ent, arbol) == this.expresion.getTipo(ent, arbol) || this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.NULL) {
                var valor = this.expresion.getValorImplicito(ent, arbol);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            }
            else if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.DOUBLE && this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.INT) {
                var valor = this.expresion.getValorImplicito(ent, arbol);
                valor.toFixed(1);
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
    Asignacion.prototype.getValorImplicito = function (ent, arbol) {
        if (this.incremento == true) {
            var simbolo = ent.getSimbolo(this.identificador);
            var anterior = simbolo.valor;
            simbolo.valor = simbolo.valor + 1;
            ent.reemplazar(this.identificador, simbolo);
            return anterior;
        }
        else if (this.decremento == true) {
            var simbolo = ent.getSimbolo(this.identificador);
            var anterior = simbolo.valor;
            simbolo.valor = simbolo.valor - 1;
            ent.reemplazar(this.identificador, simbolo);
            return anterior;
        }
    };
    Asignacion.prototype.getTipo = function (ent, arbol) {
        var simbolo = ent.getSimbolo(this.identificador);
        var valor = simbolo.valor;
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
    Asignacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{"../AST/Tipo":7}],16:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Break = void 0;
var Break = /** @class */ (function () {
    function Break(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Break.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Break.prototype.ejecutar = function (ent, arbol) {
        return this;
    };
    return Break;
}());
exports.Break = Break;

},{}],17:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Continue = void 0;
var Continue = /** @class */ (function () {
    function Continue(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Continue.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Continue.prototype.ejecutar = function (ent, arbol) {
        return this;
    };
    return Continue;
}());
exports.Continue = Continue;

},{}],18:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Declaracion = void 0;
var Tipo_1 = require("../AST/Tipo");
var Simbolo_1 = require("../AST/Simbolo");
var Declaracion = /** @class */ (function () {
    function Declaracion(identificadores, tipo, linea, columna, exp) {
        if (exp === void 0) { exp = null; }
        this.identificadores = identificadores;
        this.tipo = tipo;
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Declaracion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Declaracion.prototype.ejecutar = function (ent, arbol) {
        var _this = this;
        this.identificadores.forEach(function (id) {
            if (!ent.existe(id)) {
                if (_this.expresion !== null) {
                    if (_this.tipo == _this.expresion.getTipo(ent, arbol)) {
                        var valor = _this.expresion.getValorImplicito(ent, arbol);
                        var simbolo = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbolo);
                    }
                    else if (_this.tipo == Tipo_1.Tipo.DOUBLE && _this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.INT) {
                        var valor = _this.expresion.getValorImplicito(ent, arbol);
                        valor.toFixed(1);
                        var simbolo = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbolo);
                    }
                    else {
                        console.error("error semantico en declaracion no se permite asignar un valor diferente al declarado en linea " + _this.linea + " y columna " + _this.columna);
                    }
                }
                else {
                    var simbolo = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, null);
                    ent.agregar(id, simbolo);
                }
            }
            else {
                console.error("error semantico en declaracion no se permite declarar dos id con el mismo nombre en linea " + _this.linea + " y columna " + _this.columna);
            }
        });
    };
    return Declaracion;
}());
exports.Declaracion = Declaracion;

},{"../AST/Simbolo":6,"../AST/Tipo":7}],19:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Dowhile = void 0;
var Dowhile = /** @class */ (function () {
    function Dowhile(condicion, lista_instrucciones_dowhile, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones_dowhile = lista_instrucciones_dowhile;
        this.linea = linea;
        this.columna = columna;
    }
    Dowhile.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Dowhile.prototype.ejecutar = function (ent, arbol) {
        return this.lista_instrucciones_dowhile;
    };
    return Dowhile;
}());
exports.Dowhile = Dowhile;

},{}],20:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.For = void 0;
var Declaracion_js_1 = require("../Instrucciones/Declaracion.js");
var Asignacion_js_1 = require("../Instrucciones/Asignacion.js");
var For = /** @class */ (function () {
    function For(condicion, lista_instrucciones_for, identificador, tipo, expresionDeclaracion, expresionAsignacion, identificador2, incremento, decremento, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones_for = lista_instrucciones_for;
        this.identificador = identificador;
        this.tipo = tipo;
        this.expresionDeclaracion = expresionDeclaracion;
        this.expresionAsignacion = expresionAsignacion;
        this.identificador2 = identificador2;
        this.incremento = incremento;
        this.decremento = decremento;
        this.linea = linea;
        this.columna = columna;
    }
    For.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    For.prototype.ejecutar = function (ent, arbol) {
        return this.lista_instrucciones_for;
    };
    For.prototype.ejecutarDeclaracion = function (ent, arbol) {
        var declaracion = new Declaracion_js_1.Declaracion([this.identificador], this.tipo, this.linea, this.columna, this.expresionDeclaracion);
        declaracion.ejecutar(ent, arbol);
    };
    For.prototype.ejecutarAsignacion = function (ent, arbol) {
        var asignacion = new Asignacion_js_1.Asignacion(this.identificador2, this.expresionAsignacion, this.incremento, this.decremento, this.linea, this.columna);
        asignacion.ejecutar(ent, arbol);
    };
    return For;
}());
exports.For = For;

},{"../Instrucciones/Asignacion.js":15,"../Instrucciones/Declaracion.js":18}],21:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.If = void 0;
var If = /** @class */ (function () {
    function If(condicion, lista_instrucciones, lista_instrucciones_else, lista_instrucciones_elseif, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.lista_instrucciones_else = lista_instrucciones_else;
        this.lista_instrucciones_elseif = lista_instrucciones_elseif;
        this.linea = linea;
        this.columna = columna;
    }
    If.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    If.prototype.ejecutar = function (ent, arbol) {
        //Validacion si el tipo resultante de la condicion es booleano
        if (this.condicion.getValorImplicito(ent, arbol)) {
            return this.lista_instrucciones;
        }
        else {
            var accion_1;
            this.lista_instrucciones_elseif.forEach(function (element) {
                accion_1 = element.ejecutar(ent, arbol);
            });
            if (this.lista_instrucciones_else.length > 0) {
                return this.lista_instrucciones_else;
            }
            return accion_1;
        }
    };
    return If;
}());
exports.If = If;

},{}],22:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Main = void 0;
var Main = /** @class */ (function () {
    function Main(lista_instrucciones_main, linea, columna) {
        this.lista_instrucciones_main = lista_instrucciones_main;
        this.linea = linea;
        this.columna = columna;
    }
    Main.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Main.prototype.ejecutar = function (ent, arbol) {
        return this.lista_instrucciones_main;
    };
    return Main;
}());
exports.Main = Main;

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.While = void 0;
var While = /** @class */ (function () {
    function While(condicion, lista_instrucciones_while, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones_while = lista_instrucciones_while;
        this.linea = linea;
        this.columna = columna;
    }
    While.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    While.prototype.ejecutar = function (ent, arbol) {
        return this.lista_instrucciones_while;
    };
    return While;
}());
exports.While = While;

},{}],25:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}]},{},[13]);
