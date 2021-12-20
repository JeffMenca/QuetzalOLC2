import { AST } from "../../AST/AST";
import { Entorno } from "../../AST/Entorno";
import { Simbolo } from "../../AST/Simbolo";
import { Tipo } from "../../AST/Tipo";
import { Expresion } from "../../Interfaces/Expresion";



export class Typeof implements Expresion {
    linea: number;
    columna: number;
    expresion: Expresion;


    constructor(expresion: Expresion, linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        const valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            
            return Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo.INT;
            }
            return Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo.NULL;
        }

        return Tipo.VOID;
    }


    getValorImplicito(ent: Entorno, arbol: AST) {
            let valorTipo = this.expresion.getTipo(ent, arbol);  
            switch (valorTipo){
                case 0: return "STRING";
                case 1: return "INT";
                case 2: return "DOUBLE";
                case 3: return "BOOL";
                case 4: return "VOID";
                case 5: return "STRUCT";
                case 6: return "NULL";
                case 7: return "ATRIBUTO";
                case 8: return "CHAR";
                case 9: return "ARRAY";
            }  
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

}