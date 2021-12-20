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
    Tipo[Tipo["CHAR"] = 8] = "CHAR";
    Tipo[Tipo["ARRAY"] = 9] = "ARRAY";
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
    Operador[Operador["CONCAT"] = 20] = "CONCAT";
    Operador[Operador["POT"] = 21] = "POT";
    Operador[Operador["DESCONOCIDO"] = 22] = "DESCONOCIDO";
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
            //CONCATENAR
            else if (this.operador == Operador.CONCAT) {
                if (typeof (op1 === "string") && typeof (op2 === "string")) {
                    return op1 + op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando concatenacion");
                    return null;
                }
            }
            //REPEAT
            else if (this.operador == Operador.POT) {
                if (typeof (op1 === "string") && typeof (op2 === "number")) {
                    return op1.repeat(op2);
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando concatenacion");
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
            if (valor.length == 1) {
                return Tipo_1.Tipo.CHAR;
            }
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
        this.valor = this.removeQuotes(this.valor, ent, arbol);
        return this.valor;
    };
    Primitivo.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    Primitivo.prototype.removeQuotes = function (valor, ent, arbol) {
        if (typeof (valor) === 'string' && (valor.charAt(0) == '"' || valor.charAt(0) == "'")) {
            valor = valor.substring(1, valor.length - 1);
        }
        return valor;
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
let Primitivo = require("../Expresiones/Primitivo.js")

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
    } else if (name == "Forin") {
        const entornoForin = new Entorno.Entorno(ent);
        let entornoForinAcciones = new Entorno.Entorno(entornoForin);
        element.ejecutarDeclaracion(entornoForin, ast);
        let cadena;
        if (element.isString == true) {
            cadena = element.identificador2;
        } else {
            if (entornoForin.existe(element.identificador2)) {
                let simbolo = entornoForin.getSimbolo(element.identificador2);
                cadena = simbolo.valor;
            }
        }
        for (let i = 0; i < cadena.length; i++) {
            entornoForinAcciones = new Entorno.Entorno(entornoForin);
            element.ejecutarAsignacion(entornoForin, ast, new Primitivo.Primitivo(cadena.charAt(i)));
            let accionesForin = element.ejecutar(entornoForinAcciones, ast);
            for (let element2 of accionesForin) {
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
                    let acciones = actionGlobal(element2, entornoForinAcciones, ast);
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
                    let elementos = element2.ejecutar(entornoForinAcciones, ast);
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
    } else if (name == "Switch") {
        const entornoSwitch = new Entorno.Entorno(ent);
        let accionesSwitch = element.ejecutar(entornoSwitch, ast);
        console.log(accionesSwitch);
        if (accionesSwitch.length > 0) {
            for (let element2 of accionesSwitch) {
                let name2 = element2.constructor.name;
                if (name2 == "Break") {
                    break;
                }
                if (name2 == "Continue") {
                    resultados.push(element2);
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoSwitch, ast);
                    acciones.forEach(function(element2) {
                        resultados.push(element2);
                    });
                } else {
                    let elementos = element2.ejecutar(entornoSwitch, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
        }

    } else {
        let elementos = element.ejecutar(ent, ast);
        //PRINTS
        if (name === "Print") {
            resultados.push(elementos);
        }
    }
    return resultados;
}
},{"../AST/AST.js":4,"../AST/Entorno.js":5,"../Expresiones/Primitivo.js":12,"../Instrucciones/Primitivas/Print.js":35,"../Interfaces/Instruccion.js":39,"./grammar.js":14}],14:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,8],$V2=[1,13],$V3=[1,10],$V4=[1,11],$V5=[1,12],$V6=[1,14],$V7=[5,8,39,65,73,74,75,76],$V8=[1,21],$V9=[39,50],$Va=[2,67],$Vb=[17,54],$Vc=[1,42],$Vd=[1,41],$Ve=[1,36],$Vf=[1,34],$Vg=[1,51],$Vh=[1,52],$Vi=[1,53],$Vj=[1,54],$Vk=[1,43],$Vl=[1,44],$Vm=[1,45],$Vn=[1,46],$Vo=[1,47],$Vp=[1,48],$Vq=[1,49],$Vr=[1,35],$Vs=[1,37],$Vt=[1,38],$Vu=[1,39],$Vv=[1,40],$Vw=[1,73],$Vx=[1,71],$Vy=[1,72],$Vz=[1,58],$VA=[1,59],$VB=[1,60],$VC=[1,61],$VD=[1,62],$VE=[1,63],$VF=[1,64],$VG=[1,65],$VH=[1,66],$VI=[1,67],$VJ=[1,68],$VK=[1,69],$VL=[1,70],$VM=[11,17,33,34,48,49,54,81,82,83,84,85,91,92,93,94,95,96,97,98],$VN=[1,74],$VO=[1,75],$VP=[11,17,33,34,48,49,54,81,82,83,84,91,92,93,94,95,96,97,98],$VQ=[11,17,33,34,48,54,81,82,91,92,93,94,95,96,97,98],$VR=[11,17,33,34,48,54,81,82,83,84,91,92,93,94,95,96,97,98],$VS=[11,17,33,34,54,91,92,93,94,95,96,97,98],$VT=[1,156],$VU=[1,157],$VV=[1,158],$VW=[1,159],$VX=[1,155],$VY=[1,160],$VZ=[1,161],$V_=[1,153],$V$=[1,154],$V01=[1,162],$V11=[14,28,35,36,37,39,45,46,59,60,65,67,71,72,73,74,75,76],$V21=[1,229],$V31=[1,228],$V41=[14,71,72];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"START":3,"GLOBAL":4,"EOF":5,"INSTRUCCIONGLOBAL":6,"MAIN":7,"void":8,"main":9,"lparen":10,"rparen":11,"lllave":12,"LISTA_INSTRUCCIONES":13,"rllave":14,"INSTRUCCION":15,"PRINT":16,"semicolon":17,"DECLARACION":18,"ASIGNACION":19,"IF":20,"WHILE":21,"DOWHILE":22,"FOR":23,"BREAK":24,"CONTINUE":25,"INCREMENTO":26,"SWITCH":27,"if":28,"EXPR":29,"ELSE":30,"else":31,"TERNARIO":32,"quest":33,"dosp":34,"while":35,"do":36,"for":37,"TIPO":38,"identifier":39,"asign":40,"plusdouble":41,"minusdouble":42,"in":43,"StringLiteral":44,"break":45,"continue":46,"CADENAS":47,"amp":48,"pot":49,"dot":50,"cop":51,"IntegerLiteral":52,"substring":53,"coma":54,"length":55,"mayus":56,"lower":57,"LISTA_ID":58,"print":59,"println":60,"NATIVAS":61,"parse":62,"toint":63,"todouble":64,"string":65,"typeof":66,"switch":67,"CASES":68,"DEFAULT":69,"CASE":70,"case":71,"default":72,"int":73,"double":74,"boolean":75,"char":76,"PRIMITIVA":77,"OP_ARITMETICAS":78,"OP_RELACIONALES":79,"OP_LOGICAS":80,"plus":81,"minus":82,"multi":83,"div":84,"mod":85,"pow":86,"sqrt":87,"sin":88,"cos":89,"tan":90,"lt":91,"lte":92,"gt":93,"gte":94,"equal":95,"noequal":96,"and":97,"or":98,"not":99,"DoubleLiteral":100,"CharLiteral":101,"null":102,"true":103,"false":104,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"void",9:"main",10:"lparen",11:"rparen",12:"lllave",14:"rllave",17:"semicolon",28:"if",31:"else",33:"quest",34:"dosp",35:"while",36:"do",37:"for",39:"identifier",40:"asign",41:"plusdouble",42:"minusdouble",43:"in",44:"StringLiteral",45:"break",46:"continue",48:"amp",49:"pot",50:"dot",51:"cop",52:"IntegerLiteral",53:"substring",54:"coma",55:"length",56:"mayus",57:"lower",59:"print",60:"println",62:"parse",63:"toint",64:"todouble",65:"string",66:"typeof",67:"switch",71:"case",72:"default",73:"int",74:"double",75:"boolean",76:"char",81:"plus",82:"minus",83:"multi",84:"div",85:"mod",86:"pow",87:"sqrt",88:"sin",89:"cos",90:"tan",91:"lt",92:"lte",93:"gt",94:"gte",95:"equal",96:"noequal",97:"and",98:"or",99:"not",100:"DoubleLiteral",101:"CharLiteral",102:"null",103:"true",104:"false"},
productions_: [0,[3,2],[4,2],[4,1],[7,7],[13,2],[13,1],[15,2],[15,2],[15,2],[15,1],[15,1],[15,2],[15,1],[15,2],[15,2],[15,2],[15,1],[6,2],[6,2],[6,1],[20,7],[20,8],[20,9],[20,5],[30,4],[32,5],[21,7],[22,8],[23,16],[23,15],[23,15],[23,7],[23,7],[24,1],[25,1],[47,3],[47,3],[47,6],[47,8],[47,5],[47,5],[47,5],[19,3],[26,2],[26,2],[18,2],[18,4],[16,4],[16,4],[58,3],[58,1],[61,6],[61,4],[61,4],[61,4],[61,4],[27,7],[27,8],[27,7],[68,2],[68,1],[70,4],[69,3],[38,1],[38,1],[38,1],[38,1],[38,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[78,3],[78,3],[78,3],[78,3],[78,3],[78,2],[78,6],[78,4],[78,4],[78,4],[78,4],[79,3],[79,3],[79,3],[79,3],[79,3],[79,3],[80,3],[80,3],[80,2],[77,1],[77,1],[77,1],[77,1],[77,1],[77,1],[77,1],[77,1],[77,3]],
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
case 3: case 6: case 51:
 this.$ = [$$[$0]]; 
break;
case 4:
 this.$ = new Main($$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 7: case 8: case 9: case 12: case 14: case 15: case 16: case 18: case 19:
 this.$ = $$[$0-1]; 
break;
case 10: case 11: case 13: case 17: case 20:
 this.$ = $$[$0]; 
break;
case 21:
 this.$ = new If($$[$0-4], $$[$0-1],[],[], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 22:
 this.$ = new If($$[$0-5], $$[$0-2], $$[$0],[], _$[$0-7].first_line, _$[$0-7].first_column); 
break;
case 23:
 this.$ = new If($$[$0-6], $$[$0-3],[],[$$[$0]], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 24:
 this.$ = new If($$[$0-2], [$$[$0]],[],[], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 25:
this.$ = $$[$0-1];
break;
case 26:
this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
break;
case 27:
 this.$ = new While($$[$0-4], $$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 28:
 this.$ = new Dowhile($$[$0-1], $$[$0-5], _$[$0-7].first_line, _$[$0-7].first_column); 
break;
case 29:
 this.$ = new For($$[$0-8], $$[$0-1], $$[$0-12], $$[$0-13], $$[$0-10], $$[$0-4], $$[$0-6],false,false, _$[$0-15].first_line, _$[$0-15].first_column); 
break;
case 30:
 this.$ = new For($$[$0-7], $$[$0-1], $$[$0-11], $$[$0-12], $$[$0-9], $$[$0-5], $$[$0-5],true,false, _$[$0-14].first_line, _$[$0-14].first_column); 
break;
case 31:
 this.$ = new For($$[$0-7], $$[$0-1], $$[$0-11], $$[$0-12], $$[$0-9], $$[$0-5], $$[$0-5],false,true, _$[$0-14].first_line, _$[$0-14].first_column); 
break;
case 32:
 this.$ = new Forin($$[$0-1], $$[$0-5], $$[$0-3].replace(/['"]+/g, ''), true, _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 33:
 this.$ = new Forin($$[$0-1], $$[$0-5], $$[$0-3], false, _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 34:
 this.$ = new Break( _$[$0].first_line, _$[$0].first_column); 
break;
case 35:
 this.$ = new Continue( _$[$0].first_line, _$[$0].first_column); 
break;
case 36:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.CONCAT, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 37:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.POT, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 38:
 this.$ = new Acceso($$[$0-5], Number($$[$0-1]), _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 39:
 this.$ = new AccesoPorcion($$[$0-7], Number($$[$0-3]),Number($$[$0-1]), _$[$0-7].first_line, _$[$0-7].first_column); 
break;
case 40:
 this.$ = new Length($$[$0-4], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 41:
 this.$ = new Mayuscula($$[$0-4], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 42:
 this.$ = new Minuscula($$[$0-4], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 43:
 this.$ = new Asignacion($$[$0-2], $$[$0],false,false, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 44:
 this.$ = new Asignacion($$[$0-1],$$[$0-1] ,true,false, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 45:
 this.$ = new Asignacion($$[$0-1],$$[$0-1] ,false,true, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 46:
 this.$ = new Declaracion($$[$0], $$[$0-1], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 47:
 this.$ = new Declaracion([$$[$0-2]],$$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column,$$[$0]); 
break;
case 48:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 49:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column,true); 
break;
case 50:
 $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 52:
this.$ = new Parse($$[$0-5],$$[$0-1],_$[$0-5].first_line, _$[$0-5].first_column);
break;
case 53:
this.$ = new Toint($$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 54:
this.$ = new Todouble($$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 55:
this.$ = new Tostring($$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 56:
this.$ = new Typeof($$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 57:
 this.$ = new Switch($$[$0-4],$$[$0-1],null,_$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 58:
 this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1],_$[$0-7].first_line, _$[$0-7].first_column); 
break;
case 59:
 this.$ = new Switch($$[$0-4],null,$$[$0],_$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 60:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 61:
this.$ = [$$[$0]]; 
break;
case 62:
 this.$ = new Case($$[$0-2],$$[$0],_$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 63:
 this.$ = new Case($$[$0-2],$$[$0],_$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 64:
 this.$ = Tipo.INT; 
break;
case 65:
 this.$  = Tipo.DOUBLE; 
break;
case 66:
 this.$  = Tipo.BOOL; 
break;
case 67:
 this.$  = Tipo.STRING; 
break;
case 68:
 this.$  = Tipo.CHAR; 
break;
case 69: case 70: case 71: case 72: case 73: case 74: case 75: case 76:
 this.$ = $$[$0] 
break;
case 77:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 78:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 79:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 80:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 81:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 82:
 this.$ = new Operacion($$[$0],$$[$0],Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 83:
 this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 84:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 85:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.SENO, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 86:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.COSENO, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 87:
 this.$ = new Operacion($$[$0-1],$$[$0-1],Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 88:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 89:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUAL_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 90:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 91:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUAL_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 92:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 93:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 94:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 95:
 this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 96:
 this.$ = new Operacion($$[$0],$$[$0],Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 97: case 98:
 this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column); 
break;
case 99:
 this.$ = new Primitivo($$[$0].replace(/['"]+/g, ''), _$[$0].first_line, _$[$0].first_column); 
break;
case 100:
 this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 101:
 this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); 
break;
case 102:
 this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column); 
break;
case 103:
 this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column); 
break;
case 104:
 this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 105:
 this.$ = $$[$0-1] 
break;
}
},
table: [{3:1,4:2,6:3,7:6,8:$V0,18:4,19:5,38:7,39:$V1,65:$V2,73:$V3,74:$V4,75:$V5,76:$V6},{1:[3]},{5:[1,15],6:16,7:6,8:$V0,18:4,19:5,38:7,39:$V1,65:$V2,73:$V3,74:$V4,75:$V5,76:$V6},o($V7,[2,3]),{17:[1,17]},{17:[1,18]},o($V7,[2,20]),{39:[1,20],58:19},{40:$V8},{9:[1,22]},o($V9,[2,64]),o($V9,[2,65]),o($V9,[2,66]),{39:$Va},o($V9,[2,68]),{1:[2,1]},o($V7,[2,2]),o($V7,[2,18]),o($V7,[2,19]),{17:[2,46],54:[1,23]},o($Vb,[2,51],{40:[1,24]}),{10:$Vc,26:30,29:25,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:[1,55]},{39:[1,56]},{10:$Vc,26:30,29:57,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{17:[2,43],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},o($VM,[2,69]),o($VM,[2,70]),o($VM,[2,71]),o($VM,[2,72]),o($VM,[2,73]),o($VM,[2,74]),o($VM,[2,75]),o($VM,[2,76]),o($VM,[2,97]),o($VM,[2,98]),o($VM,[2,99]),o($VM,[2,100]),o($VM,[2,101]),o($VM,[2,102]),o($VM,[2,103]),o($VM,[2,104],{41:$VN,42:$VO,50:[1,76]}),{10:$Vc,26:30,29:77,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:78,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:[1,79]},{10:[1,80]},{10:[1,81]},{10:[1,82]},{10:[1,83]},{10:$Vc,26:30,29:84,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{50:[1,85]},{10:[1,86]},{10:[1,87]},{10:[1,88],50:$Va},{10:[1,89]},{11:[1,90]},o($Vb,[2,50]),{17:[2,47],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{10:$Vc,26:30,29:91,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:92,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:93,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:94,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:95,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:96,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:97,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:98,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:99,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:100,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:101,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:102,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:103,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:104,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:105,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:106,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},o($VM,[2,44]),o($VM,[2,45]),{51:[1,107],53:[1,108],55:[1,109],56:[1,110],57:[1,111]},{11:[1,112],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},o($VM,[2,82]),{10:$Vc,26:30,29:113,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:114,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:115,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:116,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:117,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},o($VP,[2,96],{85:$VD}),{62:[1,118]},{10:$Vc,26:30,29:119,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:120,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:121,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:122,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{12:[1,123]},o($VQ,[2,77],{49:$Vy,83:$VB,84:$VC,85:$VD}),o($VQ,[2,78],{49:$Vy,83:$VB,84:$VC,85:$VD}),o($VR,[2,79],{49:$Vy,85:$VD}),o($VR,[2,80],{49:$Vy,85:$VD}),o($VP,[2,81],{85:$VD}),o($VS,[2,88],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD}),o($VS,[2,89],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD}),o($VS,[2,90],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD}),o($VS,[2,91],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD}),o($VS,[2,92],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD}),o($VS,[2,93],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD}),o([11,17,33,34,54,97,98],[2,94],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ}),o([11,17,33,34,54,98],[2,95],{48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK}),o([11,17,33,34,48,54,91,92,93,94,95,96,97,98],[2,36],{49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD}),o($VP,[2,37],{85:$VD}),{33:$Vw,34:[1,124],48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{10:[1,125]},{10:[1,126]},{10:[1,127]},{10:[1,128]},{10:[1,129]},o($VM,[2,105]),{33:$Vw,48:$Vx,49:$Vy,54:[1,130],81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,131],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,132],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,133],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,134],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{10:[1,135]},{11:[1,136],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,137],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,138],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,139],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{13:140,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{10:$Vc,26:30,29:163,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{52:[1,164]},{52:[1,165]},{11:[1,166]},{11:[1,167]},{11:[1,168]},{10:$Vc,26:30,29:169,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},o($VM,[2,84]),o($VM,[2,85]),o($VM,[2,86]),o($VM,[2,87]),{10:$Vc,26:30,29:170,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},o($VM,[2,53]),o($VM,[2,54]),o($VM,[2,55]),o($VM,[2,56]),{14:[1,171],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},o($V11,[2,6]),{17:[1,173]},{17:[1,174]},{17:[1,175]},o($V11,[2,10]),o($V11,[2,11]),{17:[1,176]},o($V11,[2,13]),{17:[1,177]},{17:[1,178]},{17:[1,179]},o($V11,[2,17]),{10:[1,180]},{10:[1,181]},{40:$V8,41:$VN,42:$VO},{10:[1,182]},{10:[1,183]},{12:[1,184]},{10:[1,185],39:[1,186]},{17:[2,34]},{17:[2,35]},{10:[1,187]},o([11,17,34,54],[2,26],{33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL}),{11:[1,188]},{54:[1,189]},o($VM,[2,40]),o($VM,[2,41]),o($VM,[2,42]),{11:[1,190],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,191],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},o($V7,[2,4]),o($V11,[2,5]),o($V11,[2,7]),o($V11,[2,8]),o($V11,[2,9]),o($V11,[2,12]),o($V11,[2,14]),o($V11,[2,15]),o($V11,[2,16]),{10:$Vc,26:30,29:192,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:193,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:194,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{10:$Vc,26:30,29:195,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{13:196,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{38:197,65:$V2,73:$V3,74:$V4,75:$V5,76:$V6},{43:[1,198]},{10:$Vc,26:30,29:199,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},o($VM,[2,38]),{52:[1,200]},o($VM,[2,83]),o($VM,[2,52]),{11:[1,201],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,202],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,203],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,204],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{14:[1,205],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{39:[1,206]},{39:[1,208],44:[1,207]},{11:[1,209],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{11:[1,210]},{17:[2,48]},{17:[2,49]},{12:[1,211],15:212,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{12:[1,213]},{35:[1,214]},{40:[1,215]},{12:[1,216]},{12:[1,217]},{12:[1,218]},o($VM,[2,39]),{13:219,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},o($V11,[2,24]),{13:220,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{10:[1,221]},{10:$Vc,26:30,29:222,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{13:223,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{13:224,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{68:225,69:226,70:227,71:$V21,72:$V31},{14:[1,230],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{14:[1,231],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{10:$Vc,26:30,29:232,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{17:[1,233],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{14:[1,234],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{14:[1,235],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{14:[1,236],69:237,70:238,71:$V21,72:$V31},{14:[1,239]},o($V41,[2,61]),{34:[1,240]},{10:$Vc,26:30,29:241,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},o($V11,[2,21],{30:242,31:[1,243]}),o($V11,[2,27]),{11:[1,244],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{10:$Vc,26:30,29:245,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},o($V11,[2,32]),o($V11,[2,33]),o($V11,[2,57]),{14:[1,246]},o($V41,[2,60]),o($V11,[2,59]),{13:247,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{33:$Vw,34:[1,248],48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},o($V11,[2,22]),{12:[1,250],20:249,28:$VT},{17:[2,28]},{17:[1,251],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},o($V11,[2,58]),{14:[2,63],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{13:252,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},o($V11,[2,23]),{13:253,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{39:[1,254]},o($V41,[2,62],{38:7,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,15:172,28:$VT,35:$VU,36:$VV,37:$VW,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6}),{14:[1,255],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{40:[1,256],41:[1,257],42:[1,258]},o($V11,[2,25]),{10:$Vc,26:30,29:259,32:32,38:50,39:$Vd,44:$Ve,47:31,52:$Vf,61:33,63:$Vg,64:$Vh,65:$Vi,66:$Vj,73:$V3,74:$V4,75:$V5,76:$V6,77:26,78:27,79:28,80:29,82:$Vk,86:$Vl,87:$Vm,88:$Vn,89:$Vo,90:$Vp,99:$Vq,100:$Vr,101:$Vs,102:$Vt,103:$Vu,104:$Vv},{11:[1,260]},{11:[1,261]},{11:[1,262],33:$Vw,48:$Vx,49:$Vy,81:$Vz,82:$VA,83:$VB,84:$VC,85:$VD,91:$VE,92:$VF,93:$VG,94:$VH,95:$VI,96:$VJ,97:$VK,98:$VL},{12:[1,263]},{12:[1,264]},{12:[1,265]},{13:266,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{13:267,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{13:268,15:141,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{14:[1,269],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{14:[1,270],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},{14:[1,271],15:172,16:142,18:143,19:144,20:145,21:146,22:147,23:148,24:149,25:150,26:151,27:152,28:$VT,35:$VU,36:$VV,37:$VW,38:7,39:$VX,45:$VY,46:$VZ,59:$V_,60:$V$,65:$V2,67:$V01,73:$V3,74:$V4,75:$V5,76:$V6},o($V11,[2,30]),o($V11,[2,31]),o($V11,[2,29])],
defaultActions: {13:[2,67],15:[2,1],160:[2,34],161:[2,35],201:[2,48],202:[2,49],244:[2,28]},
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
    const {Acceso} = require("../Instrucciones/CadenaNativas/Acceso.js");
    const {AccesoPorcion} = require("../Instrucciones/CadenaNativas/AccesoPorcion.js");
    const {Length} = require("../Instrucciones/CadenaNativas/Length.js");
    const {Mayuscula} = require("../Instrucciones/CadenaNativas/Mayuscula.js");
    const {Minuscula} = require("../Instrucciones/CadenaNativas/Minuscula.js");
    const {Parse} = require("../Instrucciones/ExpresionNativas/Parse.js");
    const {Toint} = require("../Instrucciones/ExpresionNativas/Toint.js");
    const {Todouble} = require("../Instrucciones/ExpresionNativas/Todouble.js");
    const {Tostring} = require("../Instrucciones/ExpresionNativas/Tostring.js");
    const {Typeof} = require("../Instrucciones/ExpresionNativas/Typeof.js");
    const {If} = require("../Instrucciones/If.js");
    const {Switch} = require("../Instrucciones/Switch.js");
    const {Case} = require("../Instrucciones/Case.js");
    const {Ternario} = require("../Instrucciones/Ternario.js");
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
    const {Forin} = require("../Instrucciones/Forin.js");
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
case 0:return 102
break;
case 1:return 73
break;
case 2:return 74
break;
case 3:return 75
break;
case 4:return 76
break;
case 5:return 65
break;
case 6:return 'struct'
break;
case 7:return 86
break;
case 8:return 87
break;
case 9:return 88
break;
case 10:return 89
break;
case 11:return 90
break;
case 12:return 59
break;
case 13:return 60
break;
case 14:return 103
break;
case 15:return 104
break;
case 16:return 28
break;
case 17:return 31
break;
case 18:return 36
break;
case 19:return 35
break;
case 20:return 37
break;
case 21:return 45
break;
case 22:return 46
break;
case 23:return 8
break;
case 24:return 9
break;
case 25:return 51
break;
case 26:return 53
break;
case 27:return 55
break;
case 28:return 56
break;
case 29:return 57
break;
case 30:return 43
break;
case 31:return 62
break;
case 32:return 63
break;
case 33:return 64
break;
case 34:return 66
break;
case 35:return 67
break;
case 36:return 71
break;
case 37:return 72
break;
case 38:/* Comentario multiple */
break;
case 39:/* Comentario simple */
break;
case 40:/* Ignora espacio y tabs */
break;
case 41:/* Ignora espacio */
break;
case 42:return 100;
break;
case 43:return 52;
break;
case 44:return 39;
break;
case 45:return 44
break;
case 46:return 101
break;
case 47:return 83
break;
case 48:return 84
break;
case 49:return 41
break;
case 50:return 42
break;
case 51:return 82
break;
case 52:return 81
break;
case 53:return 49
break;
case 54:return 85
break;
case 55:return 10
break;
case 56:return 11
break;
case 57:return 95
break;
case 58:return 40
break;
case 59:return 96
break;
case 60:return 99
break;
case 61:return 92
break;
case 62:return 94
break;
case 63:return 91
break;
case 64:return 93
break;
case 65:return 97
break;
case 66:return 98
break;
case 67:return 17
break;
case 68:return 34
break;
case 69:return 33
break;
case 70:return 50
break;
case 71:return 12
break;
case 72:return 14
break;
case 73:return 48
break;
case 74:return 54
break;
case 75:return 'doll'
break;
case 76:console.error('Error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', y columna: ' + yy_.yylloc.first_column);
break;
case 77:return 5
break;
case 78:return 'INVALID'
break;
}
},
rules: [/^(?:null\b)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:string\b)/i,/^(?:struct\b)/i,/^(?:pow\b)/i,/^(?:sqrt\b)/i,/^(?:sin\b)/i,/^(?:cos\b)/i,/^(?:tan\b)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:do\b)/i,/^(?:while\b)/i,/^(?:for\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:void\b)/i,/^(?:main\b)/i,/^(?:caracterOfPosition\b)/i,/^(?:subString\b)/i,/^(?:length\b)/i,/^(?:toUpperCase\b)/i,/^(?:toLowerCase\b)/i,/^(?:in\b)/i,/^(?:parse\b)/i,/^(?:toInt\b)/i,/^(?:toDouble\b)/i,/^(?:typeOf\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:[/][*][^]*[*][/])/i,/^(?:[/][/].*)/i,/^(?:[\t\n\r]+)/i,/^(?:\s+)/i,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i,/^(?:[0-9]+)/i,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/i,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:-)/i,/^(?:\+)/i,/^(?:\^)/i,/^(?:%)/i,/^(?:\()/i,/^(?:\))/i,/^(?:==)/i,/^(?:=)/i,/^(?:!=)/i,/^(?:!)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:;)/i,/^(?::)/i,/^(?:\?)/i,/^(?:\.)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:&)/i,/^(?:,)/i,/^(?:\$)/i,/^(?:.)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78],"inclusive":true}}
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
},{"../AST/Tipo.js":7,"../Expresiones/AccesoVariable.js":8,"../Expresiones/Atributo.js":9,"../Expresiones/Objeto.js":10,"../Expresiones/Operacion.js":11,"../Expresiones/Primitivo.js":12,"../Instrucciones/Asignacion.js":15,"../Instrucciones/Break.js":16,"../Instrucciones/CadenaNativas/Acceso.js":17,"../Instrucciones/CadenaNativas/AccesoPorcion.js":18,"../Instrucciones/CadenaNativas/Length.js":19,"../Instrucciones/CadenaNativas/Mayuscula.js":20,"../Instrucciones/CadenaNativas/Minuscula.js":21,"../Instrucciones/Case.js":22,"../Instrucciones/Continue.js":23,"../Instrucciones/Declaracion.js":24,"../Instrucciones/Dowhile.js":25,"../Instrucciones/ExpresionNativas/Parse.js":26,"../Instrucciones/ExpresionNativas/Todouble.js":27,"../Instrucciones/ExpresionNativas/Toint.js":28,"../Instrucciones/ExpresionNativas/Tostring.js":29,"../Instrucciones/ExpresionNativas/Typeof.js":30,"../Instrucciones/For.js":31,"../Instrucciones/Forin.js":32,"../Instrucciones/If.js":33,"../Instrucciones/Main.js":34,"../Instrucciones/Primitivas/Print.js":35,"../Instrucciones/Switch.js":36,"../Instrucciones/Ternario.js":37,"../Instrucciones/While.js":38,"_process":3,"fs":1,"path":2}],15:[function(require,module,exports){
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
            else if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING && this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.CHAR) {
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
            if (this.isChar(valor)) {
                return Tipo_1.Tipo.CHAR;
            }
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
    Asignacion.prototype.isChar = function (cadena) {
        return cadena.length == 3 && cadena.charAt(0) === "'" && cadena.charAt(cadena.length - 1) === "'";
    };
    Asignacion.prototype.removeQuotes = function (valor, ent, arbol) {
        if (typeof (valor) === 'string' && (valor.charAt(0) == '"' || valor.charAt(0) == "'")) {
            valor = valor.substring(1, valor.length - 1);
        }
        return valor;
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
exports.Acceso = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Acceso = /** @class */ (function () {
    function Acceso(identificador, valor, linea, columna) {
        this.identificador = identificador;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    Acceso.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Acceso.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        return Tipo_1.Tipo.NULL;
    };
    Acceso.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING) {
                var reultado = simbolo.valor.charAt(this.valor);
                return reultado;
            }
            else {
                console.error("error semantico en acceso no se puede imprimir la posicion de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
        }
    };
    return Acceso;
}());
exports.Acceso = Acceso;

},{"../../AST/Tipo":7}],18:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.AccesoPorcion = void 0;
var Tipo_1 = require("../../AST/Tipo");
var AccesoPorcion = /** @class */ (function () {
    function AccesoPorcion(identificador, valor, valor2, linea, columna) {
        this.identificador = identificador;
        this.valor = valor;
        this.valor2 = valor2;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoPorcion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoPorcion.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        return Tipo_1.Tipo.NULL;
    };
    AccesoPorcion.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING) {
                var reultado = simbolo.valor.substring(this.valor, this.valor2);
                return reultado;
            }
            else {
                console.error("error semantico en acceso a porcion no se puede imprimir la posicion de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
        }
    };
    return AccesoPorcion;
}());
exports.AccesoPorcion = AccesoPorcion;

},{"../../AST/Tipo":7}],19:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Length = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Length = /** @class */ (function () {
    function Length(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    Length.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Length.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        return Tipo_1.Tipo.NULL;
    };
    Length.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING) {
                var reultado = simbolo.valor.length;
                return reultado;
            }
            else {
                console.error("error semantico en length no se puede imprimir la longitud de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
        }
    };
    return Length;
}());
exports.Length = Length;

},{"../../AST/Tipo":7}],20:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Mayuscula = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Mayuscula = /** @class */ (function () {
    function Mayuscula(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    Mayuscula.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Mayuscula.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        return Tipo_1.Tipo.NULL;
    };
    Mayuscula.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING) {
                var reultado = simbolo.valor.toUpperCase();
                return reultado;
            }
            else {
                console.error("error semantico en length no se puede imprimir la longitud de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
        }
    };
    return Mayuscula;
}());
exports.Mayuscula = Mayuscula;

},{"../../AST/Tipo":7}],21:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Minuscula = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Minuscula = /** @class */ (function () {
    function Minuscula(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    Minuscula.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Minuscula.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        return Tipo_1.Tipo.NULL;
    };
    Minuscula.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING) {
                var reultado = simbolo.valor.toLowerCase();
                return reultado;
            }
            else {
                console.error("error semantico en length no se puede imprimir la longitud de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
        }
    };
    return Minuscula;
}());
exports.Minuscula = Minuscula;

},{"../../AST/Tipo":7}],22:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Case = void 0;
var Tipo_1 = require("../AST/Tipo");
var Case = /** @class */ (function () {
    function Case(expr, lista_instrucciones, linea, columna) {
        this.expr = expr;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    Case.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Case.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expr.getValorImplicito(ent, arbol);
        return valor;
    };
    Case.prototype.getListaInstrucciones = function (ent, arbol) {
        return this.lista_instrucciones;
    };
    Case.prototype.getTipo = function (ent, arbol) {
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
    Case.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Case;
}());
exports.Case = Case;

},{"../AST/Tipo":7}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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
                    else if (_this.tipo == Tipo_1.Tipo.STRING && _this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.CHAR) {
                        var valor = _this.expresion.getValorImplicito(ent, arbol);
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

},{"../AST/Simbolo":6,"../AST/Tipo":7}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Parse = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Parse = /** @class */ (function () {
    function Parse(parseTipo, expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.parseTipo = parseTipo;
        this.expresion = expresion;
    }
    Parse.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Parse.prototype.getTipo = function (ent, arbol) {
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
    Parse.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        var valorTipo = this.expresion.getTipo(ent, arbol);
        //PARSE INT
        if (valorTipo == Tipo_1.Tipo.STRING || valorTipo == Tipo_1.Tipo.CHAR) {
            if (!isNaN(valor)) {
                if (this.parseTipo === Tipo_1.Tipo.INT) {
                    return parseInt(valor);
                }
                else if (this.parseTipo === Tipo_1.Tipo.DOUBLE) {
                    return parseFloat(valor);
                }
                else if (this.parseTipo === Tipo_1.Tipo.BOOL) {
                    if (valor == "1") {
                        return true;
                    }
                    else if (valor == "0") {
                        return false;
                    }
                    else {
                        console.error("error semantico en Parse No es posible convertir a Boolean la cadena ingresada en linea " + this.linea + " y columna " + this.columna);
                    }
                }
                else {
                    console.error("error semantico en Parse La Funcion Parse no existe para este tipo de dato en linea " + this.linea + " y columna " + this.columna);
                }
            }
            else {
                console.error("error semantico en Parse La Funcion Parse cadena Erronea para Funcion Parse, solo permite numeros en linea " + this.linea + " y columna " + this.columna);
            }
        }
        else {
            console.error("error semantico en Parse La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Parse.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Parse;
}());
exports.Parse = Parse;

},{"../../AST/Tipo":7}],27:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Todouble = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Todouble = /** @class */ (function () {
    function Todouble(expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    Todouble.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Todouble.prototype.getTipo = function (ent, arbol) {
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
    Todouble.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        var valorTipo = this.expresion.getTipo(ent, arbol);
        //PARSE INT
        if (valorTipo == Tipo_1.Tipo.INT || valorTipo == Tipo_1.Tipo.DOUBLE) {
            if (!isNaN(valor)) {
                return parseFloat(valor);
            }
            else {
                console.error("error semantico en Todouble La Funcion Parse cadena Erronea para Funcion Parse, solo permite numeros en linea " + this.linea + " y columna " + this.columna);
            }
        }
        else {
            console.error("error semantico en Todouble La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Todouble.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Todouble;
}());
exports.Todouble = Todouble;

},{"../../AST/Tipo":7}],28:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Toint = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Toint = /** @class */ (function () {
    function Toint(expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    Toint.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Toint.prototype.getTipo = function (ent, arbol) {
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
    Toint.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        var valorTipo = this.expresion.getTipo(ent, arbol);
        //PARSE INT
        if (valorTipo == Tipo_1.Tipo.INT || valorTipo == Tipo_1.Tipo.DOUBLE) {
            if (!isNaN(valor)) {
                return parseInt(valor);
            }
            else {
                console.error("error semantico en Toint La Funcion Parse cadena Erronea para Funcion Parse, solo permite numeros en linea " + this.linea + " y columna " + this.columna);
            }
        }
        else {
            console.error("error semantico en Toint La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Toint.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Toint;
}());
exports.Toint = Toint;

},{"../../AST/Tipo":7}],29:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Tostring = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Tostring = /** @class */ (function () {
    function Tostring(expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    Tostring.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Tostring.prototype.getTipo = function (ent, arbol) {
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
    Tostring.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        var valorTipo = this.expresion.getTipo(ent, arbol);
        //PARSE INT
        if (valorTipo != Tipo_1.Tipo.NULL) {
            return valor.toString();
        }
        else {
            console.error("error semantico en Toint La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Tostring.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Tostring;
}());
exports.Tostring = Tostring;

},{"../../AST/Tipo":7}],30:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Typeof = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Typeof = /** @class */ (function () {
    function Typeof(expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    Typeof.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Typeof.prototype.getTipo = function (ent, arbol) {
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
    Typeof.prototype.getValorImplicito = function (ent, arbol) {
        var valorTipo = this.expresion.getTipo(ent, arbol);
        switch (valorTipo) {
            case 0: return "STRING";
            case 1: return "INT";
            case 2: return "DOUBLE";
            case 3: return "BOOL";
            case 4: return "VOID";
            case 5: return "STRUCT";
            case 6: return "NULL";
            case 7: return "ATRIBUTO";
            case 8: return "CHAR";
            case 9: return "ARRAY";
        }
    };
    Typeof.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Typeof;
}());
exports.Typeof = Typeof;

},{"../../AST/Tipo":7}],31:[function(require,module,exports){
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

},{"../Instrucciones/Asignacion.js":15,"../Instrucciones/Declaracion.js":24}],32:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Forin = void 0;
var Tipo_1 = require("../AST/Tipo");
var Declaracion_js_1 = require("./Declaracion.js");
var Asignacion_js_1 = require("./Asignacion.js");
var Forin = /** @class */ (function () {
    function Forin(lista_instrucciones_forin, identificador, identificador2, isString, linea, columna) {
        this.lista_instrucciones_forin = lista_instrucciones_forin;
        this.identificador = identificador;
        this.identificador2 = identificador2;
        this.isString = isString;
        this.linea = linea;
        this.columna = columna;
    }
    Forin.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Forin.prototype.ejecutar = function (ent, arbol) {
        return this.lista_instrucciones_forin;
    };
    Forin.prototype.ejecutarDeclaracion = function (ent, arbol) {
        var declaracion = new Declaracion_js_1.Declaracion([this.identificador], Tipo_1.Tipo.STRING, this.linea, this.columna);
        declaracion.ejecutar(ent, arbol);
    };
    Forin.prototype.ejecutarAsignacion = function (ent, arbol, expresionAsignacion) {
        var asignacion = new Asignacion_js_1.Asignacion(this.identificador, expresionAsignacion, false, false, this.linea, this.columna);
        asignacion.ejecutar(ent, arbol);
    };
    return Forin;
}());
exports.Forin = Forin;

},{"../AST/Tipo":7,"./Asignacion.js":15,"./Declaracion.js":24}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Switch = void 0;
var Asignacion_js_1 = require("../Instrucciones/Asignacion.js");
var Switch = /** @class */ (function () {
    function Switch(expr, lista_cases, expr_default, linea, columna) {
        this.expr = expr;
        this.lista_cases = lista_cases;
        this.expr_default = expr_default;
        this.linea = linea;
        this.columna = columna;
    }
    Switch.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Switch.prototype.ejecutar = function (ent, arbol) {
        //Validacion si el tipo resultante de la condicion es booleano
        var concatenacion = [];
        if (this.lista_cases.length > 0) {
            for (var _i = 0, _a = this.lista_cases; _i < _a.length; _i++) {
                var cases = _a[_i];
                var valor = cases.getValorImplicito(ent, arbol);
                if (valor == this.expr.getValorImplicito(ent, arbol)) {
                    var instru = cases.getListaInstrucciones(ent, arbol);
                    concatenacion = concatenacion.concat(instru);
                    for (var _b = 0, instru_1 = instru; _b < instru_1.length; _b++) {
                        var ins = instru_1[_b];
                        if (ins instanceof Asignacion_js_1.Asignacion) {
                            ins.ejecutar(ent, arbol);
                        }
                    }
                }
            }
            if (this.expr_default != undefined) {
                var instru = this.expr_default.getListaInstrucciones(ent, arbol);
                concatenacion = concatenacion.concat(instru);
            }
            return concatenacion;
        }
        else {
            console.error("error semantico en Switch no se permite un switch sin case en linea " + this.linea + " y columna " + this.columna);
        }
    };
    return Switch;
}());
exports.Switch = Switch;

},{"../Instrucciones/Asignacion.js":15}],37:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Ternario = void 0;
var Tipo_1 = require("../AST/Tipo");
var Ternario = /** @class */ (function () {
    function Ternario(condicion, cierto, falso, linea, columna) {
        this.condicion = condicion;
        this.cierto = cierto;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }
    Ternario.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Ternario.prototype.getValorImplicito = function (ent, arbol) {
        //Validacion si el tipo resultante de la condicion es booleano
        if (this.condicion.getValorImplicito(ent, arbol)) {
            return this.cierto.getValorImplicito(ent, arbol);
        }
        else {
            return this.falso.getValorImplicito(ent, arbol);
        }
    };
    Ternario.prototype.getTipo = function (ent, arbol) {
        var valor;
        if (this.condicion.getValorImplicito(ent, arbol)) {
            valor = this.cierto.getValorImplicito(ent, arbol);
        }
        else {
            valor = this.falso.getValorImplicito(ent, arbol);
        }
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
    Ternario.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Ternario;
}());
exports.Ternario = Ternario;

},{"../AST/Tipo":7}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}]},{},[13]);
