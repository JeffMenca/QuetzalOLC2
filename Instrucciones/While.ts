import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class While implements Instruccion {
    linea: number;
    columna: number;
    public condicion: Expresion;
    public lista_instrucciones_while: Array<Instruccion>;

    constructor(condicion: Expresion, lista_instrucciones_while: Array<Instruccion>, linea: number, columna: number) {
        this.condicion = condicion;
        this.lista_instrucciones_while = lista_instrucciones_while;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        return this.lista_instrucciones_while;
    }

}