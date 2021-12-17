"use strict";
exports.__esModule = true;
exports.Acceso = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Acceso = /** @class */ (function () {
    function Acceso(identificador, valor, linea, columna) {
        this.identificador = identificador;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    Acceso.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Acceso.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        return Tipo_1.Tipo.NULL;
    };
    Acceso.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING) {
                var reultado = simbolo.valor.charAt(this.valor);
                return reultado;
            }
            else {
                console.error("error semantico en acceso no se puede imprimir la posicion de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
        }
    };
    return Acceso;
}());
exports.Acceso = Acceso;
