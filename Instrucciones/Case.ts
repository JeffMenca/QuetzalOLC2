import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";

export class Case implements Expresion {
    linea: number;
    columna: number;
    public expr: Expresion;
    public lista_instrucciones: Array<Instruccion>;

    constructor(expr: Expresion, lista_instrucciones: Array<Instruccion>,  linea: number, columna: number) {
        this.expr=expr;
        this.lista_instrucciones=lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }


    getValorImplicito(ent: Entorno, arbol: AST) {
        let valor= this.expr.getValorImplicito(ent,arbol);
       return valor;
    }

    getListaInstrucciones(ent: Entorno, arbol: AST){
        return this.lista_instrucciones;
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        const valor = this.getValorImplicito(ent, arbol);
        if (typeof(valor) === 'boolean')
        {
            return Tipo.BOOL;
        }
        else if (typeof(valor) === 'string')
        {
            return Tipo.STRING;
        }
        else if (typeof(valor) === 'number')
        {
            if(this.isInt(Number(valor))){
                return Tipo.INT;
            }
           return Tipo.DOUBLE;
        }
        else if(valor === null){
            return Tipo.NULL;
        }
            
        return Tipo.VOID;
    }
    
    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }

}