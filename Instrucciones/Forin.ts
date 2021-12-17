import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "./Declaracion.js";
import { Asignacion } from "./Asignacion.js";

export class Forin implements Instruccion {
    linea: number;
    columna: number;
    public lista_instrucciones_forin: Array<Instruccion>;
    public identificador: string;
    public identificador2: string;
    public isString: boolean;

    constructor(lista_instrucciones_forin: Array<Instruccion>, identificador: string, identificador2: string, isString: boolean, linea: number, columna: number) {
        this.lista_instrucciones_forin = lista_instrucciones_forin;
        this.identificador = identificador;
        this.identificador2 = identificador2;
        this.isString = isString;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        return this.lista_instrucciones_forin;
    }

    ejecutarDeclaracion(ent: Entorno, arbol: AST) {
        let declaracion = new Declaracion([this.identificador], Tipo.STRING, this.linea, this.columna);
        declaracion.ejecutar(ent, arbol);
    }
    ejecutarAsignacion(ent: Entorno, arbol: AST,expresionAsignacion: Expresion) {
        let asignacion = new Asignacion(this.identificador, expresionAsignacion, false, false, this.linea, this.columna);
        asignacion.ejecutar(ent, arbol);
    }

}