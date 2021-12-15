"use strict";
exports.__esModule = true;
exports.For = void 0;
var Declaracion_js_1 = require("../Instrucciones/Declaracion.js");
var Asignacion_js_1 = require("../Instrucciones/Asignacion.js");
var For = /** @class */ (function () {
    function For(condicion, lista_instrucciones_for, identificador, tipo, expresionDeclaracion, expresionAsignacion, identificador2, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones_for = lista_instrucciones_for;
        this.identificador = identificador;
        this.tipo = tipo;
        this.expresionDeclaracion = expresionDeclaracion;
        this.expresionAsignacion = expresionAsignacion;
        this.identificador2 = identificador2;
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
        var asignacion = new Asignacion_js_1.Asignacion(this.identificador2, this.expresionAsignacion, this.linea, this.columna);
        asignacion.ejecutar(ent, arbol);
    };
    return For;
}());
exports.For = For;
