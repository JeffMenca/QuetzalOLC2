"use strict";
exports.__esModule = true;
exports.Return = void 0;
var Return = /** @class */ (function () {
    function Return(exp, linea, columna) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Return.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Return.prototype.ejecutar = function (ent, arbol) {
        return this;
    };
    Return.prototype.getExpresion = function (ent, arbol) {
        return this.expresion;
    };
    return Return;
}());
exports.Return = Return;
