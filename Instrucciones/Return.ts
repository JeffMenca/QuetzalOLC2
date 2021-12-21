import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Expresion } from "../Interfaces/Expresion";

export class Return implements Instruccion {
    public expresion: Expresion;
    linea: number;
    columna: number;

    constructor( exp: Expresion,linea: number, columna: number) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
           return this;
    }

    getExpresion(ent: Entorno, arbol: AST) {
        return this.expresion;
    }

}