"use strict";
exports.__esModule = true;
exports.Main = void 0;
var Main = /** @class */ (function () {
    function Main(lista_instrucciones_main, linea, columna) {
        this.lista_instrucciones_main = lista_instrucciones_main;
        this.linea = linea;
        this.columna = columna;
    }
    Main.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Main.prototype.ejecutar = function (ent, arbol) {
        return this.lista_instrucciones_main;
    };
    return Main;
}());
exports.Main = Main;
