import { Instruccion } from "../Interfaces/Instruccion";
import { Funcion } from "../Instrucciones/Funcion.js";

export class AST{
    
    public instrucciones:Array<Instruccion>
    public structs: Array<any>
    public funciones: Array<any>

    constructor(instrucciones:Array<Instruccion>){
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }

    addFuncion(funcion: Funcion) {
        this.funciones.push(funcion);
    }

    getFuncion(name: string) {
        for (let i in this.funciones) {
            let funcion: Funcion = this.funciones[i];
            if (funcion.getNombre() === name) {
                return funcion;
            }
        }
        return null;
    }

}