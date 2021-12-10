const AST = require("../AST/AST.js");
const Entorno = require("../AST/Entorno.js");
const Instruccion = require("../Interfaces/Instruccion.js");
const grammar = require("../Gramatica/grammar.js")


if (typeof window !== 'undefined') {
    window.parseGrammar = function(input) {
        let resultados = [];
        const instrucciones = grammar.parse(input);
        const ast = new AST.AST(instrucciones);
        const entornoGlobal = new Entorno.Entorno(null);
        instrucciones.forEach(function(element) {
            resultados.push(element.ejecutar(entornoGlobal, ast));
        });
        return resultados;
    }
}