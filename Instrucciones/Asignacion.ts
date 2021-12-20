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
    incremento: boolean;
    decremento: boolean;

    constructor(identificador: string, exp: Expresion, incremento: boolean, decremento: boolean, linea: number, columna: number) {
        this.identificador = identificador;
        this.expresion = exp;
        this.incremento = incremento;
        this.decremento = decremento;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        if (ent.existe(this.identificador)) {
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            if ((simbolo.getTipo(ent, arbol) == Tipo.INT && this.incremento == true) || (simbolo.getTipo(ent, arbol) == Tipo.DOUBLE && this.incremento == true)) {
                simbolo.valor = simbolo.valor + 1;
                ent.reemplazar(this.identificador, simbolo);
                return simbolo.valor;
            } else if ((simbolo.getTipo(ent, arbol) == Tipo.INT && this.decremento == true) || (simbolo.getTipo(ent, arbol) == Tipo.DOUBLE && this.decremento == true)) {
                simbolo.valor = simbolo.valor - 1;
                ent.reemplazar(this.identificador, simbolo);
                return simbolo.valor;
            } else if (simbolo.getTipo(ent, arbol) == this.expresion.getTipo(ent, arbol) || this.expresion.getTipo(ent, arbol) == Tipo.NULL) {
                const valor = this.expresion.getValorImplicito(ent, arbol);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            } else if (this.expresion.getTipo(ent, arbol) == Tipo.VOID) {  
                if (simbolo.getTipo(ent, arbol) == this.getTipoExpresion(ent, arbol)) {
                    const valor = this.expresion.getValorImplicito(ent, arbol);
                    simbolo.valor = valor;
                    ent.reemplazar(this.identificador, simbolo);
                }else{
                    console.error("error semantico en asignacion no se puede asignar un valor diferente al de la varianble en linea " + this.linea + " y columna " + this.columna);
                }
            } else if (simbolo.getTipo(ent, arbol) == Tipo.DOUBLE && this.expresion.getTipo(ent, arbol) == Tipo.INT) {
                const valor = this.expresion.getValorImplicito(ent, arbol);
                valor.toFixed(1);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            } else if (simbolo.getTipo(ent, arbol) == Tipo.STRING && this.expresion.getTipo(ent, arbol) == Tipo.CHAR) {
                const valor = this.expresion.getValorImplicito(ent, arbol);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo);
            } else {
                console.error("error semantico en asignacion no se puede asignar un valor diferente al de la varianble en linea " + this.linea + " y columna " + this.columna);
            }
        } else {
            console.error("error semantico en asignacion no existe la variable en linea " + this.linea + " y columna " + this.columna);
        }
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        if (this.incremento == true) {
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            let anterior = simbolo.valor;
            simbolo.valor = simbolo.valor + 1;
            ent.reemplazar(this.identificador, simbolo);
            return anterior;
        } else if (this.decremento == true) {
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            let anterior = simbolo.valor;
            simbolo.valor = simbolo.valor - 1;
            ent.reemplazar(this.identificador, simbolo);
            return anterior;
        }


    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        const simbolo: Simbolo = ent.getSimbolo(this.identificador);
        const valor = simbolo.valor;
        if (typeof (valor) === 'boolean') {
            return Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            if (this.isChar(valor)) {
                return Tipo.CHAR;
            }
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

    getTipoExpresion(ent: Entorno, arbol: AST): Tipo {
        const valor = this.expresion.getValorImplicito(ent, arbol);

        if (typeof (valor) === 'boolean') {
            return Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            if (valor.length == 1) {
                return Tipo.CHAR;
            }
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


    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    isChar(cadena: string) {
        return cadena.length == 3 && cadena.charAt(0) === "'" && cadena.charAt(cadena.length - 1) === "'";
    }

    removeQuotes(valor: any, ent: Entorno, arbol: AST) {
        if (typeof (valor) === 'string' && (valor.charAt(0) == '"' || valor.charAt(0) == "'")) {
            valor = valor.substring(1, valor.length - 1);
        }
        return valor;
    }
}