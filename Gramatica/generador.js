let grammar = require("./grammar.js")
let AST = require("../AST/AST.js")
let Entorno = require("../AST/Entorno.js")
let Instruccion = require("../Interfaces/Instruccion.js")
let Print = require("../Instrucciones/Primitivas/Print.js")
let Primitivo = require("../Expresiones/Primitivo.js")
let Tipo = require("../AST/Tipo.js");

if (typeof window !== 'undefined') {
    window.parseGrammar = function(input) {
        const instrucciones = grammar.parse(input);
        const ast = new AST.AST(instrucciones);
        const entornoGlobal = new Entorno.Entorno(null);
        let acciones = [];
        let banderaMain = 0;
        let main;
        //Se realizan acciones de lo global
        for (let element of instrucciones) {
            if (element.constructor.name == "Main") {
                banderaMain = banderaMain + 1;
                main = element;
                continue;
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
        //Se realizan acciones del main
        if (banderaMain == 1) {
            let accionesSecundarias = actionGlobal(main, entornoGlobal, ast);
            accionesSecundarias.forEach(function(element2) {
                acciones.push(element2);
            });
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

                if (element2.expresion != null) {
                    if (name2 == "Print") {
                        for (let dato of element2.expresion) {
                            if (dato.getTipo(ent, ast) == 4) {
                                let entornoSecundario = element2.entornoFuncion;
                                let accionesVoid = dato.ejecutar(entornoSecundario, ast);
                                for (let element3 of accionesVoid) {
                                    let accionesSecundarias = actionGlobal(element3, ent, ast);
                                    accionesSecundarias.forEach(function(element4) {

                                        if (element4.constructor.name != "Return") {
                                            resultados.push(element4);
                                        }

                                    });
                                }
                            }
                        }
                    } else {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let entornoSecundario = element2.entornoFuncion;
                            let accionesVoid = element2.expresion.ejecutar(entornoSecundario, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {

                                    if (element4.constructor.name != "Return") {
                                        resultados.push(element4);
                                    }

                                });
                            }
                        }
                    }

                }

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
                if (name2 == "Return") {
                    resultados.push(element2);
                }
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
                    if (element2.expresion != null) {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let accionesVoid = element2.expresion.ejecutar(ent, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {
                                    if (element4.constructor.name != "Return") {
                                        resultados.push(element4);
                                    }
                                });
                            }
                        }
                    }
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
        if (element.condicion.getValorImplicito(ent, ast)) {
            accionesIf.forEach(function(element2) {
                let name2 = element2.constructor.name;
                if (name2 == "Break" || name2 == "Continue" || name2 == "Return") {
                    resultados.push(element2);
                } else if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoIf, ast);
                    acciones.forEach(function(element2) {
                        resultados.push(element2);
                    });
                } else {
                    let elementos = element2.ejecutar(entornoIf, ast);
                    if (element2.expresion != null) {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let accionesVoid = element2.expresion.ejecutar(ent, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {
                                    if (element4.constructor.name != "Return") {
                                        resultados.push(element4);
                                    }
                                });
                            }
                        }
                    }
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
                    if (name2 == "Break" || name2 == "Continue" || name2 == "Return") {
                        resultados.push(element2);
                    } else if (name2 !== "Print" && name2 !== "undefined") {
                        let acciones = actionGlobal(element2, entornoElse, ast);
                        acciones.forEach(function(element2) {
                            resultados.push(element2);
                        });
                    } else {
                        let elementos = element2.ejecutar(entornoElse, ast);
                        if (element2.expresion != null) {
                            if (element2.expresion.getTipo(ent, ast) == 4) {
                                let accionesVoid = element2.expresion.ejecutar(ent, ast);
                                for (let element3 of accionesVoid) {
                                    let accionesSecundarias = actionGlobal(element3, ent, ast);
                                    accionesSecundarias.forEach(function(element4) {
                                        if (element4.constructor.name != "Return") {
                                            resultados.push(element4);
                                        }
                                    });
                                }
                            }
                        }
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
                if (name2 == "Return") {
                    resultados.push(element2);
                }
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
                    if (element2.expresion != null) {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let accionesVoid = element2.expresion.ejecutar(ent, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {
                                    if (element4.constructor.name != "Return") {
                                        resultados.push(element4);
                                    }
                                });
                            }
                        }
                    }
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
                if (name2 == "Return") {
                    resultados.push(element2);
                }
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
                    if (element2.expresion != null) {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let accionesVoid = element2.expresion.ejecutar(ent, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {
                                    if (element4.constructor.name != "Return") {
                                        resultados.push(element4);
                                    }
                                });
                            }
                        }
                    }
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
    } else if (name == "Forin") {
        const entornoForin = new Entorno.Entorno(ent);
        let entornoForinAcciones = new Entorno.Entorno(entornoForin);
        element.ejecutarDeclaracion(entornoForin, ast);
        let cadena;
        if (element.isString == true) {
            cadena = element.identificador2;
        } else {
            if (entornoForin.existe(element.identificador2)) {
                let simbolo = entornoForin.getSimbolo(element.identificador2);
                cadena = simbolo.valor;
            }
        }
        for (let i = 0; i < cadena.length; i++) {
            entornoForinAcciones = new Entorno.Entorno(entornoForin);
            element.ejecutarAsignacion(entornoForin, ast, new Primitivo.Primitivo(cadena.charAt(i)));
            let accionesForin = element.ejecutar(entornoForinAcciones, ast);
            for (let element2 of accionesForin) {
                let name2 = element2.constructor.name;
                if (name2 == "Return") {
                    resultados.push(element2);
                }
                if (name2 == "Break") {
                    bandera = true;
                    break;
                }
                if (name2 == "Continue") {
                    banderaContinue = true;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoForinAcciones, ast);
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
                    let elementos = element2.ejecutar(entornoForinAcciones, ast);
                    if (element2.expresion != null) {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let accionesVoid = element2.expresion.ejecutar(ent, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {
                                    if (element4.constructor.name != "Return") {
                                        resultados.push(element4);
                                    }
                                });
                            }
                        }
                    }
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
        //SWITCH
    } else if (name == "Switch") {
        const entornoSwitch = new Entorno.Entorno(ent);
        let accionesSwitch = element.ejecutar(entornoSwitch, ast);
        console.log(accionesSwitch);
        if (accionesSwitch.length > 0) {
            for (let element2 of accionesSwitch) {
                let name2 = element2.constructor.name;
                if (name2 == "Return") {
                    resultados.push(element2);
                }
                if (name2 == "Break") {
                    break;
                }
                if (name2 == "Continue") {
                    resultados.push(element2);
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoSwitch, ast);
                    acciones.forEach(function(element2) {
                        resultados.push(element2);
                    });
                } else {
                    let elementos = element2.ejecutar(entornoSwitch, ast);
                    if (element2.expresion != null) {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let accionesVoid = element2.expresion.ejecutar(ent, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {
                                    if (element4.constructor.name != "Return") {
                                        resultados.push(element4);
                                    }
                                });
                            }
                        }
                    }
                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
        }

    } else if (name == "AccesoFuncion") {
        let accionesFuncion = element.ejecutar(ent, ast);
        let entornoFuncion = element.entornoFuncion;
        if (accionesFuncion != null) {
            for (let element2 of accionesFuncion) {
                let name2 = element2.constructor.name;
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, entornoFuncion, ast);
                    for (let element2 of acciones) {
                        resultados.push(element2);
                    }
                } else {
                    let elementos = element2.ejecutar(entornoFuncion, ast);
                    if (element2.expresion != null) {
                        if (element2.expresion.getTipo(ent, ast) == 4) {
                            let accionesVoid = element2.expresion.ejecutar(ent, ast);
                            for (let element3 of accionesVoid) {
                                let accionesSecundarias = actionGlobal(element3, ent, ast);
                                accionesSecundarias.forEach(function(element4) {
                                    if (element4.constructor.name == "Return") {
                                        if (element4.expresion != null) {
                                            element.retorno = element4.expresion;
                                        }
                                    } else {
                                        resultados.push(element4);
                                    }
                                });
                            }
                        }
                    }

                    if (name2 === "Print") {
                        resultados.push(elementos);
                    }
                }
            }
        }
        //FUNCION
    } else if (name == "Funcion") {
        element.ejecutar(ent, ast);
        let entornoFuncion = element.entornoFuncion;
        let accionesFuncion = element.lista_instrucciones_funcion;
        if (accionesFuncion != null) {
            for (let element2 of accionesFuncion) {
                let name2 = element2.constructor.name;
                if (name2 == "Return") {
                    element.retorno = element2.expresion;
                    break;
                }
                if (name2 !== "Print" && name2 !== "undefined") {
                    let acciones = actionGlobal(element2, ent, ast);
                    for (let element3 of acciones) {
                        if (element3.constructor.name == "Return") {
                            if (element3.expresion != null) {
                                element.retorno = element3.expresion;
                                break;
                            }
                        }
                    }
                }
            }
        }
        //PRINTS Y ELEMENTOS
    } else {
        let elementos = element.ejecutar(ent, ast);
        if (name != "Funcion" && name != "Print") {
            if (element.expresion != null) {
                if (element.expresion.getTipo(ent, ast) == 4) {
                    let accionesVoid = element.expresion.ejecutar(ent, ast);
                    for (let element3 of accionesVoid) {
                        let accionesSecundarias = actionGlobal(element3, ent, ast);
                        accionesSecundarias.forEach(function(element4) {
                            resultados.push(element4);
                        });
                    }
                }
            }
        }
        //PRINTS
        if (name === "Print") {
            resultados.push(elementos);
        }
    }
    return resultados;
}