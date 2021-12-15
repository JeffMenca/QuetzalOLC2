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
