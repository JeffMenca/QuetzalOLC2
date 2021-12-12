"use strict";
exports.__esModule = true;
exports.AccesoVariable = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable = /** @class */ (function () {
    function AccesoVariable(identificador, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.identificador = identificador;
    }
    AccesoVariable.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoVariable.prototype.getTipo = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            return simbolo.getTipo(ent, arbol);
        }
        return Tipo_1.Tipo.NULL;
    };
    AccesoVariable.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            return simbolo.valor;
        }
        else {
            console.error("error semantico en Acceso, no existe la variable" + this.linea + " y columna " + this.columna);
        }
    };
    AccesoVariable.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return AccesoVariable;
}());
exports.AccesoVariable = AccesoVariable;
