import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Declaracion } from "./Declaracion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Asignacion } from "../Instrucciones/Asignacion.js";

export class AccesoFuncion implements Expresion {
    public nombre: string;
    public parametros: Array<Expresion>;
    linea: number;
    columna: number;
    public entornoFuncion = new Entorno(null);
    public retorno: Expresion;

    constructor(nombre: string, parametros: Array<Expresion>, linea: number, columna: number, retorno: any = null) {
        this.nombre = nombre;
        this.parametros = parametros;
        this.linea = linea;
        this.columna = columna;
        this.retorno = retorno;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        let instrucciones;
        let parametros;
        let funcion = arbol.getFuncion(this.nombre);
        if (funcion != null) {
            instrucciones = funcion.obtenerInstrucciones(ent, arbol);
            this.entornoFuncion = funcion.entornoFuncion;
            parametros = funcion.parametros;
            if (this.parametros.length == parametros.length) {
                for (let i = 0; i < this.parametros.length; i++) {
                    let id = parametros[i].identificadores[0];
                    let asignacion = new Asignacion(id, this.parametros[i], false, false, this.linea, this.columna);
                    asignacion.ejecutar(this.entornoFuncion, arbol);
                }
            } else {
                console.log("Error, faltan parametros en la funcion " + this.nombre + " en la linea " + this.linea + " y columna " + this.columna);
                instrucciones = null;
            }
            if (funcion.retorno != null) {
                this.retorno = funcion.retorno;
            }
        } else {
            console.log("Error, no existe la funcion " + this.nombre + " en la linea " + this.linea + " y columna " + this.columna);
            instrucciones = null;
        }
        
        return instrucciones;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        this.ejecutar(ent, arbol);
        let funcion = arbol.getFuncion(this.nombre);
        if (funcion != null) {
            if (funcion.retorno != null) {
                let retorno2 = this.retorno.getValorImplicito(ent, arbol);
                return retorno2;
            }
        }
        return null;;
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        return Tipo.VOID;
    }
}