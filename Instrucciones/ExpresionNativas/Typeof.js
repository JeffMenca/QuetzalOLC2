"use strict";
exports.__esModule = true;
exports.Typeof = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Typeof = /** @class */ (function () {
    function Typeof(expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    Typeof.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Typeof.prototype.getTipo = function (ent, arbol) {
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
    Typeof.prototype.getValorImplicito = function (ent, arbol) {
        var valorTipo = this.expresion.getTipo(ent, arbol);
        switch (valorTipo) {
            case 0: return "STRING";
            case 1: return "INT";
            case 2: return "DOUBLE";
            case 3: return "BOOL";
            case 4: return "VOID";
            case 5: return "STRUCT";
            case 6: return "NULL";
            case 7: return "ATRIBUTO";
            case 8: return "CHAR";
            case 9: return "ARRAY";
        }
    };
    Typeof.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Typeof;
}());
exports.Typeof = Typeof;
