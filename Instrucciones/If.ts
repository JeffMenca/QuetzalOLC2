import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";
import { Simbolo } from "../AST/Simbolo";

export class If implements Instruccion {
    linea: number;
    columna: number;
    public condicion: Expresion;
    public lista_instrucciones: Array<Instruccion>;
    public lista_instrucciones_else: Array<Instruccion>;
    public lista_instrucciones_elseif: Array<If>;

    constructor(condicion: Expresion, lista_instrucciones: Array<Instruccion>,lista_instrucciones_else: Array<Instruccion>,lista_instrucciones_elseif: Array<If>, linea: number, columna: number) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.lista_instrucciones_else=lista_instrucciones_else;
        this.lista_instrucciones_elseif= lista_instrucciones_elseif;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        //Validacion si el tipo resultante de la condicion es booleano
        if(this.condicion.getValorImplicito(ent, arbol)){
                return this.lista_instrucciones;
        }else{
                return this.lista_instrucciones_else;
                
        }
    }

}