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
