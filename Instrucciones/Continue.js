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
