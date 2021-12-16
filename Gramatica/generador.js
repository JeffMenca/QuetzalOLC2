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
        let banderaMain = 0;
        let acciones = [];
        for (let element of instrucciones) {
            if (element.constructor.name == "Main") {
                banderaMain = banderaMain + 1;
            }
            if (banderaMain <= 1) {
                let accionesSecundarias = actionGlobal(element, entornoGlobal, ast);
                accionesSecundarias.forEach(function(element2) {
                    acciones.push(element2);
                });
            } else {
                acciones.push("Error, existe mas de 1 metodo Main");
                break;
            }
        }
        return acciones;
    }
}

function actionGlobal(element, ent, ast) {
    let name = element.constructor.name;
    let resultados = [];
    let bandera = false;
    let banderaContinue = false;
    //MAIN
    if (name == "Main") {
        let entornoMain = new Entorno.Entorno(ent);
        let accionesMain = element.ejecutar(entornoMain, ast);
        for (let element2 of accionesMain) {
            let name2 = element2.constructor.name;
            if (name2 !== "Print" && name2 !== "undefined") {
                let acciones = actionGlobal(element2, entornoMain, ast);
                for (let element2 of acciones) {
                    resultados.push(element2);
                }
            } else {
                let elementos = element2.ejecutar(entornoMain, ast);
                if (name2 === "Print") {
                    resultados.push(elementos);
                }
            }
        }
        //WHILE
    } else if (name == "While") {
        let entornoWhile = new Entorno.Entorno(ent);
        while (element.condicion.getValorImplicito(entornoWhile, ast)) {
            entornoWhile = new Entorno.Entorno(ent);
            let accionesWhile = element.ejecutar(entornoWhile, ast);
            for (let element2 of accionesWhile) {
                let name2 = element2.constructor.name;
                if (name2 == "Break") {
                    bandera = true;
                    break;
                }
                if (name2 == "Continue") {
                    banderaContinue = true;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoWhile, ast);
                    for (let element2 of acciones) {
                        if (element2.constructor.name == "Break") {
                            bandera = true;
                            break;
                        } else if (element2.constructor.name == "Continue") {
                            banderaContinue = true;
                            break;
                        } else {
                            resultados.push(element2);
                        }
                    }
                    if (bandera == true || banderaContinue == true) {
                        break;
                    }
                } else {
                    let elementos = element2.ejecutar(entornoWhile, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
            if (bandera == true) {
                bandera = false;
                break;
            }
            if (banderaContinue == true) {
                banderaContinue = false;
                continue;
            }
        }
        //IF, ELSE Y ELSEIF
    } else if (name == "If") {
        const entornoIf = new Entorno.Entorno(ent);
        let accionesIf = element.ejecutar(entornoIf, ast);
        if (element.condicion.getValorImplicito(entornoIf, ast)) {
            accionesIf.forEach(function(element2) {
                let name2 = element2.constructor.name;
                if (name2 == "Break" || name2 == "Continue") {
                    resultados.push(element2);
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoIf, ast);
                    acciones.forEach(function(element2) {
                        resultados.push(element2);
                    });
                } else {
                    let elementos = element2.ejecutar(entornoIf, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            });
        } else {
            const entornoElse = new Entorno.Entorno(ent);
            let accionesElse = element.ejecutar(entornoElse, ast);
            if (accionesElse != undefined) {
                accionesElse.forEach(function(element2) {
                    let name2 = element2.constructor.name;
                    if (name2 == "Break" || name2 == "Continue") {
                        resultados.push(element2);
                    } else if (name2 !== "Print" && name2 !== "undefined") {
                        let acciones = actionGlobal(element2, entornoElse, ast);
                        acciones.forEach(function(element2) {
                            resultados.push(element2);
                        });
                    } else {
                        let elementos = element2.ejecutar(entornoElse, ast);
                        if (name2 === "Print") {
                            resultados.push(elementos);
                        }
                    }
                });
            }
        } //DO WHILE
    } else if (name == "Dowhile") {
        let entornoDowhile = new Entorno.Entorno(ent);
        do {
            entornoDowhile = new Entorno.Entorno(ent);
            let accionesDowhile = element.ejecutar(entornoDowhile, ast);
            for (let element2 of accionesDowhile) {
                let name2 = element2.constructor.name;
                if (name2 == "Break") {
                    bandera = true;
                    break;
                }
                if (name2 == "Continue") {
                    banderaContinue = true;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoDowhile, ast);
                    for (let element2 of acciones) {
                        if (element2.constructor.name == "Break") {
                            bandera = true;
                            break;
                        } else if (element2.constructor.name == "Continue") {
                            banderaContinue = true;
                            break;
                        } else {
                            resultados.push(element2);
                        }
                    }
                    if (bandera == true || banderaContinue == true) {
                        break;
                    }
                } else {
                    let elementos = element2.ejecutar(entornoDowhile, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
            if (bandera == true) {
                bandera = false;
                break;
            }
            if (banderaContinue == true) {
                banderaContinue = false;
                continue;
            }
        } while (element.condicion.getValorImplicito(entornoDowhile, ast));
        //FOR
    } else if (name == "For") {
        const entornoFor = new Entorno.Entorno(ent);
        let entornoForAcciones = new Entorno.Entorno(entornoFor);
        element.ejecutarDeclaracion(entornoFor, ast);
        while (element.condicion.getValorImplicito(entornoFor, ast)) {
            entornoForAcciones = new Entorno.Entorno(entornoFor);
            element.ejecutarAsignacion(entornoFor, ast);
            let accionesFor = element.ejecutar(entornoForAcciones, ast);
            for (let element2 of accionesFor) {
                let name2 = element2.constructor.name;
                if (name2 == "Break") {
                    bandera = true;
                    break;
                }
                if (name2 == "Continue") {
                    banderaContinue = true;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoForAcciones, ast);
                    for (let element2 of acciones) {
                        if (element2.constructor.name == "Break") {
                            bandera = true;
                            break;
                        } else if (element2.constructor.name == "Continue") {
                            banderaContinue = true;
                            break;
                        } else {
                            resultados.push(element2);
                        }
                    }
                    if (bandera == true || banderaContinue == true) {
                        break;
                    }
                } else {
                    let elementos = element2.ejecutar(entornoForAcciones, ast);
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
            if (bandera == true) {
                bandera = false;
                break;
            }
            if (banderaContinue == true) {
                banderaContinue = false;
                continue;
            }
        }
        //PRINTS Y ELEMENTOS
    } else {
        let elementos = element.ejecutar(ent, ast);
        //PRINTS
        if (name === "Print") {
            resultados.push(elementos);
        }
    }
    return resultados;
}