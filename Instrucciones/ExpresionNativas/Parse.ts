import { AST } from "../../AST/AST";
import { Entorno } from "../../AST/Entorno";
import { Tipo } from "../../AST/Tipo";
import { Expresion } from "../../Interfaces/Expresion";



export class Parse implements Expresion {
    linea: number;
    columna: number;
    expresion: Expresion;
    parseTipo: Tipo;


    constructor(parseTipo: Tipo, expresion: Expresion, linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
        this.parseTipo = parseTipo;
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
            let valor = this.expresion.getValorImplicito(ent, arbol);
            let valorTipo = this.expresion.getTipo(ent, arbol);
            //PARSE INT
            if (valorTipo == Tipo.STRING || valorTipo == Tipo.CHAR) 
            {
                if(!isNaN(valor))
                {
                    if (this.parseTipo === Tipo.INT) {
                        return parseInt(valor);
                    } else if (this.parseTipo === Tipo.DOUBLE) {
                        return parseFloat(valor);
                    } else if (this.parseTipo === Tipo.BOOL) {
                        if(valor == "1"){
                            return true;
                        } else if (valor == "0"){
                            return false;
                        } else
                        {
                            console.error("error semantico en Parse No es posible convertir a Boolean la cadena ingresada en linea " + this.linea + " y columna " + this.columna);
                        }
                    } else {
                        console.error("error semantico en Parse La Funcion Parse no existe para este tipo de dato en linea " + this.linea + " y columna " + this.columna);
                    }
                } else {
                    console.error("error semantico en Parse La Funcion Parse cadena Erronea para Funcion Parse, solo permite numeros en linea " + this.linea + " y columna " + this.columna);
                }
            } else {
                console.error("error semantico en Parse La Funcion Parse Tipo de Dato Erroneo para Funcion Parse, la Expresion no es de Tipo String en linea " + this.linea + " y columna " + this.columna);

                
            }

    }


    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

}