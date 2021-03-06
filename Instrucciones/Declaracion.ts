import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";
import { Simbolo } from "../AST/Simbolo";

export class Declaracion implements Instruccion {
    linea: number;
    columna: number;
    public expresion: Expresion;
    public identificadores: Array<string>;
    public tipo: Tipo;

    constructor(identificadores: Array<string>, tipo: Tipo, linea: number, columna: number, exp: any = null) {
        this.identificadores = identificadores;
        this.tipo = tipo;
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        this.identificadores.forEach((id) => {
            if (!ent.existe(id)) {
                if (this.expresion !== null) {

                    if (this.tipo == this.expresion.getTipo(ent, arbol)) {
                        const valor = this.expresion.getValorImplicito(ent, arbol);
                        const simbolo: Simbolo = new Simbolo(this.tipo, id, this.linea, this.columna, valor);
                        ent.agregar(id, simbolo);
                    } else if (this.tipo == Tipo.DOUBLE && this.expresion.getTipo(ent, arbol) == Tipo.INT) {
                        const valor = this.expresion.getValorImplicito(ent, arbol);
                        valor.toFixed(1);
                        const simbolo: Simbolo = new Simbolo(this.tipo, id, this.linea, this.columna, valor);
                        ent.agregar(id, simbolo);
                    } else if (this.expresion.getTipo(ent, arbol) == Tipo.VOID) {
                        if (this.tipo == this.getTipo(ent, arbol)) {
                            const valor = this.expresion.getValorImplicito(ent, arbol);
                            const simbolo: Simbolo = new Simbolo(this.tipo, id, this.linea, this.columna, valor);
                            ent.agregar(id, simbolo);
                        }else{
                            console.error("error semantico en declaracion no se permite asignar un valor diferente al declarado en linea " + this.linea + " y columna " + this.columna);
                        }
                    } else if (this.tipo == Tipo.DOUBLE && this.expresion.getTipo(ent, arbol) == Tipo.INT) {
                        const valor = this.expresion.getValorImplicito(ent, arbol);
                        valor.toFixed(1);
                        const simbolo: Simbolo = new Simbolo(this.tipo, id, this.linea, this.columna, valor);
                        ent.agregar(id, simbolo);
                    }
                    else {
                        console.error("error semantico en declaracion no se permite asignar un valor diferente al declarado en linea " + this.linea + " y columna " + this.columna);
                    }
                } else {
                    const simbolo: Simbolo = new Simbolo(this.tipo, id, this.linea, this.columna, null);
                    ent.agregar(id, simbolo);
                }
            } else {
                console.error("error semantico en declaracion no se permite declarar dos id con el mismo nombre en linea " + this.linea + " y columna " + this.columna);
            }
        });
    }


    getTipo(ent: Entorno, arbol: AST): Tipo {
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

}