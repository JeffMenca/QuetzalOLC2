let grammar = require("./grammar.js")
let AST = require("../AST/AST.js")
let Entorno = require("../AST/Entorno.js")
let Instruccion = require("../Interfaces/Instruccion.js")
let Print = require("../Instrucciones/Primitivas/Print.js")

if (typeof window !== 'undefined') {
    window.parseGrammar = function(input) {
        const instrucciones = grammar.parse(input);
        const ast = new AST.AST(instrucciones);
        const entornoGlobal = new Entorno.Entorno(null);
        let resultados = [];
        instrucciones.forEach(function(element) {
            let name = element.constructor.name;
            //WHILE
            if (name == "While") {
                const entornoWhile = new Entorno.Entorno(entornoGlobal);
                let acciones = element.ejecutar(entornoWhile, ast);
                if (element.condicion.getValorImplicito(entornoWhile, ast)) {
                    acciones.forEach(function(element2) {
                        let elementos = element2.ejecutar(entornoWhile, ast);
                        let name2 = element2.constructor.name;
                        if (name2 === "Print") {
                            resultados.push(elementos);
                        }
                    });
                }
            } else if (name == "If") {
                const entornoIf = new Entorno.Entorno(entornoGlobal);
                let acciones = element.ejecutar(entornoIf, ast);
                console.log(acciones);
                if (element.condicion.getValorImplicito(entornoIf, ast)) {
                    acciones.forEach(function(element2) {
                        let elementos = element2.ejecutar(entornoIf, ast);
                        let name2 = element2.constructor.name;
                        if (name2 === "Print") {
                            resultados.push(elementos);
                        }
                    });
                } else {
                    const entornoElse = new Entorno.Entorno(entornoGlobal);
                    let acciones = element.ejecutar(entornoElse, ast);
                    console.log(acciones);
                    acciones.forEach(function(element2) {
                        let elementos = element2.ejecutar(entornoElse, ast);
                        let name2 = element2.constructor.name;
                        if (name2 === "Print") {
                            resultados.push(elementos);
                        }
                    });
                }
            } else {
                let elementos = element.ejecutar(entornoGlobal, ast);
                //PRINTS
                if (name === "Print") {
                    resultados.push(elementos);
                }
            }
        });
        return resultados;
    }
}