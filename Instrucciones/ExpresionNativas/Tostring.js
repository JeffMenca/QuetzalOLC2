"use strict";
exports.__esModule = true;
exports.Tostring = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Tostring = /** @class */ (function () {
    function Tostring(expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    Tostring.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Tostring.prototype.getTipo = function (ent, arbol) {
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
    Tostring.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        var valorTipo = this.expresion.getTipo(ent, arbol);
        //PARSE INT
        if (valorTipo != Tipo_1.Tipo.NULL) {
            return valor.toString();
        }
        else {
            console.error("error semantico en Toint La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Tostring.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Tostring;
}());
exports.Tostring = Tostring;
