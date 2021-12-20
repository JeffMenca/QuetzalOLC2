"use strict";
exports.__esModule = true;
exports.Parse = void 0;
var Tipo_1 = require("../../AST/Tipo");
var Parse = /** @class */ (function () {
    function Parse(parseTipo, expresion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.parseTipo = parseTipo;
        this.expresion = expresion;
    }
    Parse.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Parse.prototype.getTipo = function (ent, arbol) {
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
    Parse.prototype.getValorImplicito = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        var valorTipo = this.expresion.getTipo(ent, arbol);
        //PARSE INT
        if (valorTipo == Tipo_1.Tipo.STRING || valorTipo == Tipo_1.Tipo.CHAR) {
            if (!isNaN(valor)) {
                if (this.parseTipo === Tipo_1.Tipo.INT) {
                    return parseInt(valor);
                }
                else if (this.parseTipo === Tipo_1.Tipo.DOUBLE) {
                    return parseFloat(valor);
                }
                else if (this.parseTipo === Tipo_1.Tipo.BOOL) {
                    if (valor == "1") {
                        return true;
                    }
                    else if (valor == "0") {
                        return false;
                    }
                    else {
                        console.error("error semantico en Parse No es posible convertir a Boolean la cadena ingresada en linea " + this.linea + " y columna " + this.columna);
                    }
                }
                else {
                    console.error("error semantico en Parse La Funcion Parse no existe para este tipo de dato en linea " + this.linea + " y columna " + this.columna);
                }
            }
            else {
                console.error("error semantico en Parse La Funcion Parse cadena Erronea para Funcion Parse, solo permite numeros en linea " + this.linea + " y columna " + this.columna);
            }
        }
        else {
            console.error("error semantico en Parse La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);
        }
    };
    Parse.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Parse;
}());
exports.Parse = Parse;
