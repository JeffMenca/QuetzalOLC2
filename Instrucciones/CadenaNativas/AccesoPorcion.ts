import { AST } from "../../AST/AST";
import { Entorno } from "../../AST/Entorno";
import { Tipo } from "../../AST/Tipo";
import { Expresion } from "../../Interfaces/Expresion";
import { Simbolo } from "../../AST/Simbolo";

export class AccesoPorcion implements Expresion {
    linea: number;
    columna: number;
    public identificador: string;
    valor: any;
    valor2: any;

    constructor(identificador: string,valor: any, valor2: any, linea: number, columna: number) {
        this.identificador=identificador;
        this.valor = valor;
        this.valor2 = valor2;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        const valor = this.getValorImplicito(ent, arbol);
         if (typeof(valor) === 'string')
        {
            return Tipo.STRING;
        }
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        if(ent.existe(this.identificador)){
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol) == Tipo.STRING){
                let reultado =simbolo.valor.substring(this.valor,this.valor2);
                return reultado;
            }else{
                console.error("error semantico en acceso a porcion no se puede imprimir la posicion de un tipo que no sea string en linea " + this.linea + " y columna " + this.columna);
            }
            
        }
    }

    

}