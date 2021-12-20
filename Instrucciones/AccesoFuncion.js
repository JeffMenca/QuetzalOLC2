"use strict";
exports.__esModule = true;
exports.AccesoFuncion = void 0;
var Entorno_1 = require("../AST/Entorno");
var Tipo_1 = require("../AST/Tipo");
var Asignacion_js_1 = require("../Instrucciones/Asignacion.js");
var AccesoFuncion = /** @class */ (function () {
    function AccesoFuncion(nombre, parametros, linea, columna, retorno) {
        if (retorno === void 0) { retorno = null; }
        this.entornoFuncion = new Entorno_1.Entorno(null);
        this.nombre = nombre;
        this.parametros = parametros;
        this.linea = linea;
        this.columna = columna;
        this.retorno = retorno;
    }
    AccesoFuncion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoFuncion.prototype.ejecutar = function (ent, arbol) {
        var instrucciones;
        var parametros;
        var funcion = arbol.getFuncion(this.nombre);
        if (funcion != null) {
            instrucciones = funcion.obtenerInstrucciones(ent, arbol);
            this.entornoFuncion = funcion.entornoFuncion;
            parametros = funcion.parametros;
            if (funcion.retorno != null) {
                this.retorno = funcion.retorno;
            }
            if (this.parametros.length == parametros.length) {
                for (var i = 0; i < this.parametros.length; i++) {
                    var id = parametros[i].identificadores[0];
                    var asignacion = new Asignacion_js_1.Asignacion(id, this.parametros[i], false, false, this.linea, this.columna);
                    asignacion.ejecutar(this.entornoFuncion, arbol);
                }
            }
            else {
                console.log("Error, faltan parametros en la funcion " + this.nombre + " en la linea " + this.linea + " y columna " + this.columna);
                instrucciones = null;
            }
        }
        else {
            console.log("Error, no existe la funcion " + this.nombre + " en la linea " + this.linea + " y columna " + this.columna);
            instrucciones = null;
        }
        return instrucciones;
    };
    AccesoFuncion.prototype.getValorImplicito = function (ent, arbol) {
        this.ejecutar(ent, arbol);
        var retorno2 = this.retorno.getValorImplicito(ent, arbol);
        return retorno2;
    };
    AccesoFuncion.prototype.getTipo = function (ent, arbol) {
        return Tipo_1.Tipo.VOID;
    };
    return AccesoFuncion;
}());
exports.AccesoFuncion = AccesoFuncion;
