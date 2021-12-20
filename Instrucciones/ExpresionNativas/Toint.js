"use strict";
exports.__esModule = true;
exports.Toint = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Toint = /** @class */ (function () {
    function Toint(expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    Toint.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Toint.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Toint.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        var valorTipo = this.expresion.getTipo(ent, arbol);
        //PARSE INT
        if (valorTipo == Tipo_1.Tipo.INT || valorTipo == Tipo_1.Tipo.DOUBLE) {
            if (!isNaN(valor)) {
                return parseInt(valor);
            }
            else {
                console.error("error semantico en Toint La Funcion Parse cadena Erronea para Funcion Parse, solo permite numeros en linea " + this.linea + " y columna " + this.columna);
            }
        }
        else {
            console.error("error semantico en Toint La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Toint.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Toint;
}());
exports.Toint = Toint;
