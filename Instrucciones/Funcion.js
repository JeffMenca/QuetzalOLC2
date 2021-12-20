"use strict";
exports.__esModule = true;
exports.Funcion = void 0;
var Entorno_1 = require("../AST/Entorno");
var Funcion = /** @class */ (function () {
    function Funcion(nombre, parametros, instrucciones, tipo, linea, columna, retorno) {
        if (retorno === void 0) { retorno = null; }
        this.entornoFuncion = new Entorno_1.Entorno(null);
        this.nombre = nombre;
        this.parametros = parametros;
        this.lista_instrucciones_funcion = instrucciones;
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
        this.retorno = retorno;
    }
    Funcion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Funcion.prototype.ejecutar = function (ent, arbol) {
        var _this = this;
        this.entornoFuncion = new Entorno_1.Entorno(ent);
        this.parametros.forEach(function (element) {
            element.ejecutar(_this.entornoFuncion, arbol);
        });
        arbol.addFuncion(this);
    };
    Funcion.prototype.obtenerInstrucciones = function (ent, arbol) {
        return this.lista_instrucciones_funcion;
    };
    Funcion.prototype.getNombre = function () {
        return this.nombre;
    };
    Funcion.prototype.getTipo = function () {
        return this.tipo;
    };
    return Funcion;
}());
exports.Funcion = Funcion;
