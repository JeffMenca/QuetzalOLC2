"use strict";
exports.__esModule = true;
exports.AST = void 0;
var AST = /** @class */ (function () {
    function AST(instrucciones) {
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }
    AST.prototype.addFuncion = function (funcion) {
        this.funciones.push(funcion);
    };
    AST.prototype.getFuncion = function (name) {
        for (var i in this.funciones) {
            var funcion = this.funciones[i];
            if (funcion.getNombre() === name) {
                return funcion;
            }
        }
        return null;
    };
    return AST;
}());
exports.AST = AST;
