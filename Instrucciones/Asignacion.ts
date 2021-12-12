import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";
import { Simbolo } from "../AST/Simbolo";

export class Asignacion implements Instruccion {
    linea: number;
    columna: number;
    public expresion: Expresion;
    public identificador: string;

    constructor(identificador: string, exp:Expresion, tipo: Tipo, linea: number, columna: number) {
        this.identificador = identificador;
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
            if(ent.existe(this.identificador)){
                const simbolo: Simbolo = ent.getSimbolo(this.identificador);
                if(simbolo.getTipo(ent,arbol)==this.expresion.getTipo(ent,arbol)){
                    const valor = this.expresion.getValorImplicito(ent,arbol);
                    simbolo.valor =valor;
                    ent.reemplazar(this.identificador,simbolo);

                }else{
                    console.error("error semantico en asignacion no se puede asignar un valor diferente al de la varianble en linea "+ this.linea+ " y columna "+ this.columna);
                }
            }else{
                console.error("error semantico en asignacion no existe la variable en linea "+ this.linea+ " y columna "+ this.columna);
            }
    }

    

}