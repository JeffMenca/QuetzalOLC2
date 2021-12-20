import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Case } from "./Case";
import { Asignacion } from "../Instrucciones/Asignacion.js";

export class Switch implements Instruccion {
    linea: number;
    columna: number;
    public expr: Expresion;
    public lista_cases: Array<Case>;
    public expr_default: Case;

    constructor(expr: Expresion, lista_cases: Array<Case>, expr_default: Case,  linea: number, columna: number) {
        this.expr=expr;
        this.lista_cases=lista_cases;
        this.expr_default=expr_default;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        //Validacion si el tipo resultante de la condicion es booleano
        let concatenacion: Array<Instruccion>=[];
        if (this.lista_cases.length>0){  
            for (let cases of this.lista_cases){
                let valor=cases.getValorImplicito(ent,arbol);
                if(valor==this.expr.getValorImplicito(ent,arbol)){
                    let instru =cases.getListaInstrucciones(ent,arbol);
                    concatenacion=concatenacion.concat(instru);
                    for(let ins of instru){
                        if(ins instanceof Asignacion){
                           ins.ejecutar(ent,arbol);
                        }
                    }
                }
            }
            if(this.expr_default!=undefined){
                    let instru =this.expr_default.getListaInstrucciones(ent,arbol);
                    concatenacion=concatenacion.concat(instru);       
            }
            return concatenacion;
        }else{
            console.error("error semantico en Switch no se permite un switch sin case en linea " + this.linea + " y columna " + this.columna);
        }
    }

}