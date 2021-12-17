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
