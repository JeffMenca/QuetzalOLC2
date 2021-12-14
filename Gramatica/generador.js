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
                let accionesWhile = actionWhile(element, entornoGlobal, ast);
                accionesWhile.forEach(function(element2) {
                    resultados.push(element2);
                });
                //IF
            } else if (name == "If") {
                let accionesIf = actionIf(element, entornoGlobal, ast);
                accionesIf.forEach(function(element2) {
                    resultados.push(element2);
                });
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

function actionWhile(element, ent, ast) {
    const entornoWhile = new Entorno.Entorno(ent);
    let resultados = [];
    while (element.condicion.getValorImplicito(entornoWhile, ast)) {
        let acciones = element.ejecutar(entornoWhile, ast);
        if (element.condicion.getValorImplicito(entornoWhile, ast)) {
            acciones.forEach(function(element2) {
                let name2 = element2.constructor.name;
                if (name2 === "If") {
                    let acciones = actionIf(element2, entornoWhile, ast);
                    acciones.forEach(function(element2) {
                        resultados.push(element2);
                    });
                } else if (name2 === "While") {
                    let acciones = actionWhile(element2, entornoWhile, ast);
                    acciones.forEach(function(element2) {
                        resultados.push(element2);
                    });
                } else {
                    let elementos = element2.ejecutar(entornoWhile, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            });
        } else {
            break;
        }
    }
    return resultados;
}

function actionIf(element, ent, ast) {
    const entornoIf = new Entorno.Entorno(ent);
    let resultados = [];
    let acciones = element.ejecutar(entornoIf, ast);
    if (element.condicion.getValorImplicito(entornoIf, ast)) {
        acciones.forEach(function(element2) {
            let name2 = element2.constructor.name;
            let elementos = element2.ejecutar(entornoIf, ast);
            if (name2 === "Print") {
                resultados.push(elementos);
            }
        });
    } else {
        const entornoElse = new Entorno.Entorno(ent);
        let acciones = element.ejecutar(entornoElse, ast);
        if (acciones != undefined) {
            acciones.forEach(function(element2) {
                let name2 = element2.constructor.name;
                let elementos = element2.ejecutar(entornoElse, ast);
                if (name2 === "Print") {
                    resultados.push(elementos);
                }
            });
        }
    }
    return resultados;
}