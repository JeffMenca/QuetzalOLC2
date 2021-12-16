import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class Main implements Instruccion {
    linea: number;
    columna: number;
    public lista_instrucciones_main: Array<Instruccion>;

    constructor(lista_instrucciones_main: Array<Instruccion>, linea: number, columna: number) {
        this.lista_instrucciones_main = lista_instrucciones_main;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        return this.lista_instrucciones_main;
    }

}