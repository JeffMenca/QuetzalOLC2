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
