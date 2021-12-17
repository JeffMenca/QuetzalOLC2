"use strict";
exports.__esModule = true;
exports.Mayuscula = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Mayuscula = /** @class */ (function () {
    function Mayuscula(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    Mayuscula.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Mayuscula.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        return Tipo_1.Tipo.NULL;
    };
    Mayuscula.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING) {
                var reultado = simbolo.valor.toUpperCase();
                return reultado;
            }
            else {
                console.error("error semantico en length no se puede imprimir la longitud de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
        }
    };
    return Mayuscula;
}());
exports.Mayuscula = Mayuscula;
