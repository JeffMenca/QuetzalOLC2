"use strict";
exports.__esModule = true;
exports.Switch = void 0;
var Asignacion_js_1 = require("../Instrucciones/Asignacion.js");
var Switch = /** @class */ (function () {
    function Switch(expr, lista_cases, expr_default, linea, columna) {
        this.expr = expr;
        this.lista_cases = lista_cases;
        this.expr_default = expr_default;
        this.linea = linea;
        this.columna = columna;
    }
    Switch.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Switch.prototype.ejecutar = function (ent, arbol) {
        //Validacion si el tipo resultante de la condicion es booleano
        var concatenacion = [];
        if (this.lista_cases.length > 0) {
            for (var _i = 0, _a = this.lista_cases; _i < _a.length; _i++) {
                var cases = _a[_i];
                var valor = cases.getValorImplicito(ent, arbol);
                if (valor == this.expr.getValorImplicito(ent, arbol)) {
                    var instru = cases.getListaInstrucciones(ent, arbol);
                    concatenacion = concatenacion.concat(instru);
                    for (var _b = 0, instru_1 = instru; _b < instru_1.length; _b++) {
                        var ins = instru_1[_b];
                        if (ins instanceof Asignacion_js_1.Asignacion) {
                            ins.ejecutar(ent, arbol);
                        }
                    }
                }
            }
            if (this.expr_default != undefined) {
                var instru = this.expr_default.getListaInstrucciones(ent, arbol);
                concatenacion = concatenacion.concat(instru);
            }
            return concatenacion;
        }
        else {
            console.error("error semantico en Switch no se permite un switch sin case en linea " + this.linea + " y columna " + this.columna);
        }
    };
    return Switch;
}());
exports.Switch = Switch;
