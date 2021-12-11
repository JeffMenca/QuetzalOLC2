import { AST } from "../../AST/AST";
import { Entorno } from "../../AST/Entorno";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";


export class Print implements Instruccion {
    linea: number;
    columna: number;
    public expresion: Expresion;
    saltoLinea: boolean;

    constructor(exp: Expresion, linea: number, columna: number, saltoLinea: boolean=false) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.saltoLinea = saltoLinea;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        const valor = this.expresion.getValorImplicito(ent, arbol);
        if (valor !== null) {
            if (this.saltoLinea) {
                return valor+"\n";
            } else {
                return valor;
            }
        } else {
            console.log('>> Error, no se pueden imprimir valores nulos');
            return "Error, no se pueden imprimir valores nulos";
        }
    }

}