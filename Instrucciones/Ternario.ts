import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";

export class Ternario implements Expresion {
    linea: number;
    columna: number;
    public condicion: Expresion;
    public cierto: Expresion;
    public falso: Expresion;

    constructor(condicion: Expresion, cierto: Expresion, falso: Expresion, linea: number, columna: number) {
        this.condicion = condicion;
        this.cierto=cierto;
        this.falso=falso;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        //Validacion si el tipo resultante de la condicion es booleano
        if (this.condicion.getValorImplicito(ent, arbol)) {
            return this.cierto.getValorImplicito(ent, arbol);
        } else {
            return this.falso.getValorImplicito(ent, arbol);
        }
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        let valor;
        if (this.condicion.getValorImplicito(ent, arbol)) {
             valor = this.cierto.getValorImplicito(ent, arbol);
        } else {
             valor = this.falso.getValorImplicito(ent, arbol);
        }
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