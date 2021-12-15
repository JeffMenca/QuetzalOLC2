import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "../Instrucciones/Declaracion.js";
import { Asignacion } from "../Instrucciones/Asignacion.js";

export class For implements Instruccion {
    linea: number;
    columna: number;
    public condicion: Expresion;
    public lista_instrucciones_for: Array<Instruccion>;
    public identificador: string;
    public identificador2: string;
    public tipo: Tipo;
    public expresionDeclaracion: Expresion;
    public expresionAsignacion: Expresion;

    constructor(condicion: Expresion, lista_instrucciones_for: Array<Instruccion>, identificador: string, tipo: Tipo, expresionDeclaracion: Expresion, expresionAsignacion: Expresion,identificador2: string, linea: number, columna: number) {
        this.condicion = condicion;
        this.lista_instrucciones_for = lista_instrucciones_for;
        this.identificador = identificador;
        this.tipo = tipo;
        this.expresionDeclaracion = expresionDeclaracion;
        this.expresionAsignacion = expresionAsignacion;
        this.identificador2 = identificador2;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        return this.lista_instrucciones_for;
    }

    ejecutarDeclaracion(ent: Entorno, arbol: AST) {
        let declaracion = new Declaracion([this.identificador], this.tipo, this.linea, this.columna, this.expresionDeclaracion);
        declaracion.ejecutar(ent, arbol);
    }
    ejecutarAsignacion(ent: Entorno, arbol: AST) {
        let asignacion = new Asignacion(this.identificador2, this.expresionAsignacion, this.linea, this.columna);
        asignacion.ejecutar(ent, arbol);
    }

}