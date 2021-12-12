import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";

export class AccesoVariable implements Expresion {
    linea: number;
    columna: number;
    identificador: any;

    constructor(identificador:any, linea:number, columna:number){
        this.linea = linea;
        this.columna = columna;
        this.identificador = identificador;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        if(ent.existe(this.identificador)){
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            return simbolo.getTipo(ent, arbol);
        }
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        if(ent.existe(this.identificador)){
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            return simbolo.valor;
        }else{
            console.error("error semantico en Acceso, no existe la variable" + this.linea + " y columna " + this.columna);
        }
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }
    
}