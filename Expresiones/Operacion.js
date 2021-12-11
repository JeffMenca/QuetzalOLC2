"use strict";
exports.__esModule = true;
exports.Operacion = exports.Operador = void 0;
var Tipo_1 = require("../AST/Tipo");
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operador[Operador["DIVISION"] = 3] = "DIVISION";
    Operador[Operador["MODULO"] = 4] = "MODULO";
    Operador[Operador["MENOS_UNARIO"] = 5] = "MENOS_UNARIO";
    Operador[Operador["MAYOR_QUE"] = 6] = "MAYOR_QUE";
    Operador[Operador["MENOR_QUE"] = 7] = "MENOR_QUE";
    Operador[Operador["IGUAL_IGUAL"] = 8] = "IGUAL_IGUAL";
    Operador[Operador["DIFERENTE_QUE"] = 9] = "DIFERENTE_QUE";
    Operador[Operador["OR"] = 10] = "OR";
    Operador[Operador["AND"] = 11] = "AND";
    Operador[Operador["NOT"] = 12] = "NOT";
    Operador[Operador["MAYOR_IGUAL_QUE"] = 13] = "MAYOR_IGUAL_QUE";
    Operador[Operador["MENOR_IGUAL_QUE"] = 14] = "MENOR_IGUAL_QUE";
    Operador[Operador["DESCONOCIDO"] = 15] = "DESCONOCIDO";
})(Operador = exports.Operador || (exports.Operador = {}));
var Operacion = /** @class */ (function () {
    function Operacion(op_izquierda, op_derecha, operacion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.op_izquierda = op_izquierda;
        this.op_derecha = op_derecha;
        this.operador = operacion;
    }
    Operacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Operacion.prototype.getTipo = function (ent, arbol) {
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
    Operacion.prototype.getValorImplicito = function (ent, arbol) {
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT) {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            var op2 = this.op_derecha.getValorImplicito(ent, arbol);
            //suma
            if (this.operador == Operador.SUMA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 + op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //resta
            else if (this.operador == Operador.RESTA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 - op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una resta");
                    return null;
                }
            }
            //multiplicación
            else if (this.operador == Operador.MULTIPLICACION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 * op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una multiplicacion");
                    return null;
                }
            }
            //division
            else if (this.operador == Operador.DIVISION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        return null;
                    }
                    return op1 / op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una division");
                    return null;
                }
            }
            //modulo
            else if (this.operador == Operador.MODULO) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        return null;
                    }
                    return op1 % op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando un modulo");
                    return null;
                }
            }
            //Menor que
            else if (this.operador == Operador.MENOR_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 < op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Mayor que
            else if (this.operador == Operador.MAYOR_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 > op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Menor igual que
            else if (this.operador == Operador.MENOR_IGUAL_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 <= op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Mayor igual que
            else if (this.operador == Operador.MAYOR_IGUAL_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 >= op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Igual que
            else if (this.operador == Operador.IGUAL_IGUAL) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 == op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //Diferente que
            else if (this.operador == Operador.DIFERENTE_QUE) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 != op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion");
                    return null;
                }
            }
            //And
            else if (this.operador == Operador.AND) {
                if (typeof (op1 === "boolean") && typeof (op2 === "boolean")) {
                    return op1 && op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion and");
                    return null;
                }
            }
            //Or
            else if (this.operador == Operador.OR) {
                if (typeof (op1 === "boolean") && typeof (op2 === "boolean")) {
                    return op1 || op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion or");
                    return null;
                }
            }
        }
        else {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            if (this.operador == Operador.MENOS_UNARIO) {
                if (typeof (op1 === "number")) {
                    return -1 * op1;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una operación unaria");
                    return null;
                }
            }
            else if (this.operador == Operador.NOT) {
                if (typeof (op1 === "boolean")) {
                    return !op1;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una comparacion not");
                    return null;
                }
            }
        }
        return null;
    };
    Operacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Operacion;
}());
exports.Operacion = Operacion;
