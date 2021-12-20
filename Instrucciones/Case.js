"use strict";
exports.__esModule = true;
exports.Case = void 0;
var Tipo_1 = require("../AST/Tipo");
var Case = /** @class */ (function () {
    function Case(expr, lista_instrucciones, linea, columna) {
        this.expr = expr;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    Case.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Case.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expr.getValorImplicito(ent, arbol);
        return valor;
    };
    Case.prototype.getListaInstrucciones = function (ent, arbol) {
        return this.lista_instrucciones;
    };
    Case.prototype.getTipo = function (ent, arbol) {
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
    Case.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Case;
}());
exports.Case = Case;
