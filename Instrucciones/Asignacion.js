"use strict";
exports.__esModule = true;
exports.Asignacion = void 0;
var Tipo_1 = require("../AST/Tipo");
var Asignacion = /** @class */ (function () {
    function Asignacion(identificador, exp, incremento, decremento, linea, columna) {
        this.identificador = identificador;
        this.expresion = exp;
        this.incremento = incremento;
        this.decremento = decremento;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Asignacion.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.identificador)) {
            var simbolo = ent.getSimbolo(this.identificador);
            if ((simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.INT && this.incremento == true) || (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.DOUBLE && this.incremento == true)) {
                simbolo.valor = simbolo.valor + 1;
                ent.reemplazar(this.identificador, simbolo);
                return simbolo.valor;
            }
            else if ((simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.INT && this.decremento == true) || (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.DOUBLE && this.decremento == true)) {
                simbolo.valor = simbolo.valor - 1;
                ent.reemplazar(this.identificador, simbolo);
                return simbolo.valor;
            }
            else if (simbolo.getTipo(ent, arbol) == this.expresion.getTipo(ent, arbol) || this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.NULL) {
                var valor = this.expresion.getValorImplicito(ent, arbol);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            }
            else if (this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.VOID) {
                if (simbolo.getTipo(ent, arbol) == this.getTipoExpresion(ent, arbol)) {
                    var valor = this.expresion.getValorImplicito(ent, arbol);
                    simbolo.valor = valor;
                    ent.reemplazar(this.identificador, simbolo);
                }
                else {
                    console.error("error semantico en asignacion no se puede asignar un valor diferente al de la varianble en linea " + this.linea + " y columna " + this.columna);
                }
            }
            else if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.DOUBLE && this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.INT) {
                var valor = this.expresion.getValorImplicito(ent, arbol);
                valor.toFixed(1);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            }
            else if (simbolo.getTipo(ent, arbol) == Tipo_1.Tipo.STRING && this.expresion.getTipo(ent, arbol) == Tipo_1.Tipo.CHAR) {
                var valor = this.expresion.getValorImplicito(ent, arbol);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            }
            else {
                console.error("error semantico en asignacion no se puede asignar un valor diferente al de la varianble en linea " + this.linea + " y columna " + this.columna);
            }
        }
        else {
            console.error("error semantico en asignacion no existe la variable en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Asignacion.prototype.getValorImplicito = function (ent, arbol) {
        if (this.incremento == true) {
            var simbolo = ent.getSimbolo(this.identificador);
            var anterior = simbolo.valor;
            simbolo.valor = simbolo.valor + 1;
            ent.reemplazar(this.identificador, simbolo);
            return anterior;
        }
        else if (this.decremento == true) {
            var simbolo = ent.getSimbolo(this.identificador);
            var anterior = simbolo.valor;
            simbolo.valor = simbolo.valor - 1;
            ent.reemplazar(this.identificador, simbolo);
            return anterior;
        }
    };
    Asignacion.prototype.getTipo = function (ent, arbol) {
        var simbolo = ent.getSimbolo(this.identificador);
        var valor = simbolo.valor;
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            if (this.isChar(valor)) {
                return Tipo_1.Tipo.CHAR;
            }
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
    Asignacion.prototype.getTipoExpresion = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            if (valor.length == 1) {
                return Tipo_1.Tipo.CHAR;
            }
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
    Asignacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    Asignacion.prototype.isChar = function (cadena) {
        return cadena.length == 3 && cadena.charAt(0) === "'" && cadena.charAt(cadena.length - 1) === "'";
    };
    Asignacion.prototype.removeQuotes = function (valor, ent, arbol) {
        if (typeof (valor) === 'string' && (valor.charAt(0) == '"' || valor.charAt(0) == "'")) {
            valor = valor.substring(1, valor.length - 1);
        }
        return valor;
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;
