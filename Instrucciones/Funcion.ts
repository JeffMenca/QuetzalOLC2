import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Declaracion } from "./Declaracion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";

export class Funcion implements Instruccion {
    nombre: string;
    public parametros: Array<Declaracion>;
    public lista_instrucciones_funcion: Array<Instruccion>;
    tipo: Tipo;
    linea: number;
    columna: number;    
    public retorno: Expresion;
    public entornoFuncion=new Entorno(null);

    constructor(nombre: string, parametros: Array<Declaracion>, instrucciones: Array<Instruccion>, tipo: Tipo, linea: number, columna: number,retorno: any = null) {
        this.nombre = nombre;
        this.parametros = parametros;
        this.lista_instrucciones_funcion = instrucciones;
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
        this.retorno=retorno;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        this.entornoFuncion = new Entorno(ent);
        this.parametros.forEach((element) => {
            element.ejecutar(ent, arbol);
        });
        arbol.addFuncion(this);
    }

    obtenerInstrucciones(ent: Entorno, arbol: AST) {
        return this.lista_instrucciones_funcion;
    }

    getNombre(): string {
        return this.nombre;
    }
    getTipo(): Tipo {
        return this.tipo;
    }

}