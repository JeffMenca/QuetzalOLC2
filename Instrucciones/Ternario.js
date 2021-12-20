"use strict";
exports.__esModule = true;
exports.Ternario = void 0;
var Tipo_1 = require("../AST/Tipo");
var Ternario = /** @class */ (function () {
    function Ternario(condicion, cierto, falso, linea, columna) {
        this.condicion = condicion;
        this.cierto = cierto;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }
    Ternario.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Ternario.prototype.getValorImplicito = function (ent, arbol) {
        //Validacion si el tipo resultante de la condicion es booleano
        if (this.condicion.getValorImplicito(ent, arbol)) {
            return this.cierto.getValorImplicito(ent, arbol);
        }
        else {
            return this.falso.getValorImplicito(ent, arbol);
        }
    };
    Ternario.prototype.getTipo = function (ent, arbol) {
        var valor;
        if (this.condicion.getValorImplicito(ent, arbol)) {
            valor = this.cierto.getValorImplicito(ent, arbol);
        }
        else {
            valor = this.falso.getValorImplicito(ent, arbol);
        }
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
    Ternario.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Ternario;
}());
exports.Ternario = Ternario;
