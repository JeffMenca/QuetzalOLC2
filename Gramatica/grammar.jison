
/* lexical grammar */
%lex
%options case-insensitive
escapechar                          [\'\"\\bfnrtv]
escape                              \\{escapechar}
acceptedcharsdouble                 [^\"\\]+
stringdouble                        {escape}|{acceptedcharsdouble}
stringliteral                       \"{stringdouble}*\"
acceptedcharssingle                 [^\'\\]
stringsingle                        {escape}|{acceptedcharssingle}
charliteral                         \'{stringsingle}\'
BSL                                 "\\".
%s                                  comment
%%

/* PALABRAS RESERVADAS */
"null"                return 'null'
"int"                 return 'int'
"double"              return 'double'
"boolean"             return 'boolean'
"char"                return 'char'
"string"              return 'string'
"struct"              return 'struct'
"pow"                 return 'pow'
"sqrt"                return 'sqrt'
"sin"                 return 'sin'
"cos"                 return 'cos'
"tan"                 return 'tan'
"print"               return 'print'
"println"             return 'println'
"true"                return 'true'
"false"               return 'false'
"if"                  return 'if'
"else"                return 'else'
"do"                  return 'do'
"while"               return 'while'
"for"                 return 'for'
"break"               return 'break'
"continue"            return 'continue'
"void"                return 'void'
"main"                return 'main'
"caracterOfPosition"  return 'cop'
"subString"           return 'substring'
"length"              return 'length'
"toUpperCase"         return 'mayus'
"toLowerCase"         return 'lower'
"in"                  return 'in'
"parse"               return 'parse'
"toInt"               return 'toint'
"toDouble"            return 'todouble'
"typeOf"              return 'typeof'
"switch"              return 'switch'
"case"                return 'case'
"default"             return 'default'
"return"              return 'return'


/* COMENTARIOS Y ESPACIOS */
[/][*][^]*[*][/]      /* Comentario multiple */
[/][/].*              /* Comentario simple */
[\t\n\r]+             /* Ignora espacio y tabs */
\s+                   /* Ignora espacio */

/* NUMEROS LITERALES */
(([0-9]+"."[0-9]*)|("."[0-9]+))     return 'DoubleLiteral';
[0-9]+                              return 'IntegerLiteral';

/* CADENAS LITERALES */
[a-zA-Z_][a-zA-Z0-9_ñÑ]*            return 'identifier';
{stringliteral}                     return 'StringLiteral'
{charliteral}                       return 'CharLiteral'

/* OPERADORES, LOGICAS Y RELACIONALES  */
"*"                   return 'multi'
"/"                   return 'div'
"++"                  return 'plusdouble'
"--"                  return 'minusdouble'
"-"                   return 'minus'
"+"                   return 'plus'
"^"                   return 'pot'
"%"                   return 'mod'
"("                   return 'lparen'
")"                   return 'rparen'
"=="                  return 'equal'
"="                   return 'asign'
"!="                  return 'noequal'
"!"                   return 'not'
"<="                  return 'lte'
">="                  return 'gte'
"<"                   return 'lt'
">"                   return 'gt'
"&&"                  return 'and'
"||"                  return 'or'
";"                   return 'semicolon'
":"                   return 'dosp'
"?"                   return 'quest'
"."                   return 'dot'
"{"                   return 'lllave'
"}"                   return 'rllave'
"&"                   return 'amp'
","                   return 'coma'
"$"                   return 'doll'

/* ERROR LEXICO  */
.                     {console.error('Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', y columna: ' + yylloc.first_column);}
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* IMPORTS  */
%{
    const {Main} = require("../Instrucciones/Main.js");
    const {Print} = require("../Instrucciones/Primitivas/Print.js");
    const {Acceso} = require("../Instrucciones/CadenaNativas/Acceso.js");
    const {AccesoPorcion} = require("../Instrucciones/CadenaNativas/AccesoPorcion.js");
    const {Length} = require("../Instrucciones/CadenaNativas/Length.js");
    const {Mayuscula} = require("../Instrucciones/CadenaNativas/Mayuscula.js");
    const {Minuscula} = require("../Instrucciones/CadenaNativas/Minuscula.js");
    const {Parse} = require("../Instrucciones/ExpresionNativas/Parse.js");
    const {Toint} = require("../Instrucciones/ExpresionNativas/Toint.js");
    const {Todouble} = require("../Instrucciones/ExpresionNativas/Todouble.js");
    const {Tostring} = require("../Instrucciones/ExpresionNativas/Tostring.js");
    const {Typeof} = require("../Instrucciones/ExpresionNativas/Typeof.js");
    const {If} = require("../Instrucciones/If.js");
    const {Switch} = require("../Instrucciones/Switch.js");
    const {Case} = require("../Instrucciones/Case.js");
    const {Ternario} = require("../Instrucciones/Ternario.js");
    const {While} = require("../Instrucciones/While.js");
    const {Dowhile} = require("../Instrucciones/Dowhile.js");
    const {For} = require("../Instrucciones/For.js");
    const {Break} = require("../Instrucciones/Break.js");
    const {Return} = require("../Instrucciones/Return.js");
    const {Continue} = require("../Instrucciones/Continue.js");
    const {Declaracion} = require("../Instrucciones/Declaracion.js");
    const {Asignacion} = require("../Instrucciones/Asignacion.js");
    const {Tipo} = require("../AST/Tipo.js");
    const {Primitivo} = require("../Expresiones/Primitivo.js");
    const {Operacion, Operador} = require("../Expresiones/Operacion.js");
    const {Objeto} = require("../Expresiones/Objeto.js");
    const {Atributo} = require("../Expresiones/Atributo.js");
    const {AccesoVariable} = require("../Expresiones/AccesoVariable.js");
    const {Forin} = require("../Instrucciones/Forin.js");
    const {Funcion} = require("../Instrucciones/Funcion.js");
    const {AccesoFuncion} = require("../Instrucciones/AccesoFuncion.js");
%}

/* PRECEDENCIA */
%right 'quest'
%left 'or'
%left 'and'
%left 'dif'
%left 'equal' 'noequal' 'lte' 'lt' 'gte' 'gt'
%left 'amp'
%left 'plus' 'minus'
%left 'multi' 'div'
%left 'pot'
%right 'not'
%right 'mod'
%left UMINUS

%start START

%% /* GRAMATICA*/

START : GLOBAL EOF         { $$ = $1; return $$; }
    ;
 
GLOBAL: 
    GLOBAL INSTRUCCIONGLOBAL { $1.push($2); $$ = $1; }
    | INSTRUCCIONGLOBAL { $$ = [$1]; } 
;

MAIN:
    void main lparen rparen lllave LISTA_INSTRUCCIONES rllave { $$ = new Main($6, @1.first_line, @1.first_column); } 
;

LISTA_INSTRUCCIONES: 
    LISTA_INSTRUCCIONES INSTRUCCION { $1.push($2); $$ = $1; }
    | INSTRUCCION { $$ = [$1]; } ;

INSTRUCCION:
    PRINT semicolon           { $$ = $1; }
    | DECLARACION semicolon   { $$ = $1; }
    | ASIGNACION semicolon    { $$ = $1; }
    | IF                      { $$ = $1; }
    | WHILE                   { $$ = $1; }
    | DOWHILE semicolon       { $$ = $1; }
    | FOR                     { $$ = $1; }
    | BREAK semicolon         { $$ = $1; }
    | CONTINUE semicolon      { $$ = $1; }
    | RETURN semicolon        { $$ = $1; }
    | INCREMENTO semicolon    { $$ = $1; }
    | SWITCH                  { $$ = $1; }
    | ACCESOFUNCION semicolon { $$ = $1; }
;

INSTRUCCIONGLOBAL:
    DECLARACION semicolon    { $$ = $1; }
    | ASIGNACION semicolon   { $$ = $1; }
    | MAIN                   { $$ = $1; }
    | FUNCION                { $$ = $1; }
;

IF:
    if lparen EXPR rparen lllave LISTA_INSTRUCCIONES rllave             { $$ = new If($3, $6,[],[], @1.first_line, @1.first_column); } 
    | if lparen EXPR rparen lllave LISTA_INSTRUCCIONES rllave ELSE      { $$ = new If($3, $6, $8,[], @1.first_line, @1.first_column); } 
    | if lparen EXPR rparen lllave LISTA_INSTRUCCIONES rllave else IF   { $$ = new If($3, $6,[],[$9], @1.first_line, @1.first_column); } 
    | if lparen EXPR rparen INSTRUCCION                                 { $$ = new If($3, [$5],[],[], @1.first_line, @1.first_column); } 
;

ELSE:
    else lllave LISTA_INSTRUCCIONES rllave                              {$$ = $3;}
;

TERNARIO:
    EXPR quest EXPR dosp EXPR                                           {$$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column);} 
;

WHILE:
    while lparen EXPR rparen lllave LISTA_INSTRUCCIONES rllave { $$ = new While($3, $6, @1.first_line, @1.first_column); } 
;

DOWHILE:
    do lllave LISTA_INSTRUCCIONES rllave while lparen EXPR rparen { $$ = new Dowhile($7, $3, @1.first_line, @1.first_column); } 
;

FOR:
    for lparen TIPO identifier asign EXPR semicolon EXPR semicolon identifier asign EXPR rparen lllave LISTA_INSTRUCCIONES rllave { $$ = new For($8, $15, $4, $3, $6, $12, $10,false,false, @1.first_line, @1.first_column); }
    | for lparen TIPO identifier asign EXPR semicolon EXPR semicolon identifier plusdouble rparen lllave LISTA_INSTRUCCIONES rllave { $$ = new For($8, $14, $4, $3, $6, $10, $10,true,false, @1.first_line, @1.first_column); }
    | for lparen TIPO identifier asign EXPR semicolon EXPR semicolon identifier minusdouble rparen lllave LISTA_INSTRUCCIONES rllave { $$ = new For($8, $14, $4, $3, $6, $10, $10,false,true, @1.first_line, @1.first_column); }
    | for identifier in StringLiteral lllave LISTA_INSTRUCCIONES rllave  { $$ = new Forin($6, $2, $4.replace(/['"]+/g, ''), true, @1.first_line, @1.first_column); }
    | for identifier in identifier lllave LISTA_INSTRUCCIONES rllave    { $$ = new Forin($6, $2, $4, false, @1.first_line, @1.first_column); }
;

BREAK:
    break                               { $$ = new Break( @1.first_line, @1.first_column); }     
;

CONTINUE:
    continue                            { $$ = new Continue( @1.first_line, @1.first_column); }     
;

RETURN:
    return EXPR                         { $$ = new Return($2, @1.first_line, @1.first_column); } 
;

CADENAS:
    EXPR amp EXPR                                                                   { $$ = new Operacion($1,$3,Operador.CONCAT, @1.first_line, @1.first_column); }
    | EXPR pot EXPR                                                                 { $$ = new Operacion($1,$3,Operador.POT, @1.first_line, @1.first_column); }
    | identifier dot cop lparen IntegerLiteral rparen                               { $$ = new Acceso($1, Number($5), @1.first_line, @1.first_column); }
    | identifier dot substring lparen IntegerLiteral coma IntegerLiteral rparen     { $$ = new AccesoPorcion($1, Number($5),Number($7), @1.first_line, @1.first_column); }
    | identifier dot length lparen rparen                                           { $$ = new Length($1, @1.first_line, @1.first_column); }
    | identifier dot mayus lparen rparen                                            { $$ = new Mayuscula($1, @1.first_line, @1.first_column); }
    | identifier dot lower lparen rparen                                            { $$ = new Minuscula($1, @1.first_line, @1.first_column); }
;

ASIGNACION:
    identifier asign EXPR               { $$ = new Asignacion($1, $3,false,false, @1.first_line, @1.first_column); }
;

INCREMENTO:
    identifier plusdouble               { $$ = new Asignacion($1,$1 ,true,false, @1.first_line, @1.first_column); }
    | identifier minusdouble            { $$ = new Asignacion($1,$1 ,false,true, @1.first_line, @1.first_column); }
;

DECLARACION:
        TIPO LISTA_ID                   { $$ = new Declaracion($2, $1, @1.first_line, @1.first_column); } 
    | TIPO identifier asign EXPR        { $$ = new Declaracion([$2],$1, @1.first_line, @1.first_column,$4); } 
;

PRINT:
    print lparen EXPRS rparen            { $$ = new Print($3, @1.first_line, @1.first_column); } 
    | println lparen EXPRS rparen        { $$ = new Print($3, @1.first_line, @1.first_column,true); }
;

EXPRS:
    EXPRS coma EXPR    { $1.push($3); $$ = $1;} 
    | EXPR             { $$ = [$1]; }
;

LISTA_ID: LISTA_ID coma identifier      { $1.push($3); $$ = $1; } 
        | identifier                    { $$ = [$1]; } 
;

NATIVAS:
    TIPO dot parse lparen EXPR rparen   {$$ = new Parse($1,$5,@1.first_line, @1.first_column);}
    | toint lparen EXPR rparen          {$$ = new Toint($3,@1.first_line, @1.first_column);}
    | todouble lparen EXPR rparen       {$$ = new Todouble($3,@1.first_line, @1.first_column);}
    | string lparen EXPR rparen         {$$ = new Tostring($3,@1.first_line, @1.first_column);}
    | typeof lparen EXPR rparen         {$$ = new Typeof($3,@1.first_line, @1.first_column);}
;

SWITCH:
    switch lparen EXPR rparen lllave CASES rllave           { $$ = new Switch($3,$6,null,@1.first_line, @1.first_column); }
    | switch lparen EXPR rparen lllave CASES DEFAULT rllave { $$ = new Switch($3,$6,$7,@1.first_line, @1.first_column); }
    | switch lparen EXPR rparen lllave DEFAULT rllave       { $$ = new Switch($3,null,$7,@1.first_line, @1.first_column); }
;

CASES:
    CASES CASE { $1.push($2); $$ = $1;}
    | CASE {$$ = [$1]; }
;

CASE: 
    case EXPR dosp LISTA_INSTRUCCIONES { $$ = new Case($2,$4,@1.first_line, @1.first_column); }
;

DEFAULT:
    default dosp LISTA_INSTRUCCIONES { $$ = new Case($1,$3,@1.first_line, @1.first_column); }
;

FUNCION:
    void identifier lparen rparen lllave LISTA_INSTRUCCIONES rllave { $$ = new Funcion($2, [],$6,Tipo.VOID, @1.first_line, @1.first_column); } 
    | void identifier lparen LISTA_PARAMETROS rparen lllave LISTA_INSTRUCCIONES rllave { $$ = new Funcion($2, $4,$7,Tipo.VOID, @1.first_line, @1.first_column); } 
    | TIPO identifier lparen LISTA_PARAMETROS rparen lllave LISTA_INSTRUCCIONES  rllave { $$ = new Funcion($2, $4,$7,$1, @1.first_line, @1.first_column); } 
    | TIPO identifier lparen rparen lllave LISTA_INSTRUCCIONES  rllave { $$ = new Funcion($2, [],$6,$1, @1.first_line, @1.first_column); } 
;

LISTA_PARAMETROS: LISTA_PARAMETROS coma PARAMETRO    { $1.push($3); $$ = $1; } 
        | PARAMETRO { $$ = [$1]; } 
;

PARAMETRO:
    TIPO identifier { $$ = new Declaracion([$2],$1, @1.first_line, @1.first_column); }
;

ACCESOFUNCION:
     identifier lparen rparen { $$ = new AccesoFuncion($1, [],@1.first_line, @1.first_column); } 
     | identifier lparen LISTA_PARAMETROS_ACCESO rparen { $$ = new AccesoFuncion($1, $3,@1.first_line, @1.first_column); }
;

LISTA_PARAMETROS_ACCESO: LISTA_PARAMETROS_ACCESO coma PARAMETRO_ACCESO    { $1.push($3); $$ = $1; } 
        | PARAMETRO_ACCESO { $$ = [$1]; } 
;

PARAMETRO_ACCESO:
    EXPR  { $$ = $1; }
;

TIPO:
    int                 { $$ = Tipo.INT; }
    | double            { $$  = Tipo.DOUBLE; }
    | boolean           { $$  = Tipo.BOOL; }
    | string            { $$  = Tipo.STRING; }
    | char              { $$  = Tipo.CHAR; }
;

EXPR:
      
    PRIMITIVA                           { $$ = $1; }
    | OP_ARITMETICAS                    { $$ = $1; }
    | OP_RELACIONALES                   { $$ = $1; }
    | OP_LOGICAS                        { $$ = $1; }
    | INCREMENTO                        { $$ = $1; }
    | CADENAS                           { $$ = $1; }
    | TERNARIO                          { $$ = $1; }
    | NATIVAS                           { $$ = $1; }
    | ACCESOFUNCION                     { $$ = $1; }
;

OP_ARITMETICAS:
    EXPR plus EXPR                      { $$ = new Operacion($1,$3,Operador.SUMA, @1.first_line, @1.first_column); }
    | EXPR minus EXPR                   { $$ = new Operacion($1,$3,Operador.RESTA, @1.first_line, @1.first_column); }
    | EXPR multi EXPR                   { $$ = new Operacion($1,$3,Operador.MULTIPLICACION, @1.first_line, @1.first_column); }
    | EXPR div EXPR                     { $$ = new Operacion($1,$3,Operador.DIVISION, @1.first_line, @1.first_column); }
    | EXPR mod EXPR                     { $$ = new Operacion($1,$3,Operador.MODULO, @1.first_line, @1.first_column); }
    | minus EXPR %prec UMINUS           { $$ = new Operacion($2,$2,Operador.MENOS_UNARIO, @1.first_line, @1.first_column); }
    | pow lparen EXPR coma EXPR rparen  { $$ = new Operacion($3,$5,Operador.POW, @1.first_line, @1.first_column); }
    | sqrt lparen EXPR rparen           { $$ = new Operacion($3,$3,Operador.SQRT, @1.first_line, @1.first_column); }
    | sin lparen EXPR rparen            { $$ = new Operacion($3,$3,Operador.SENO, @1.first_line, @1.first_column); }
    | cos lparen EXPR rparen            { $$ = new Operacion($3,$3,Operador.COSENO, @1.first_line, @1.first_column); }
    | tan lparen EXPR rparen            { $$ = new Operacion($3,$3,Operador.TAN, @1.first_line, @1.first_column); }
;

OP_RELACIONALES:
    EXPR lt EXPR                      { $$ = new Operacion($1,$3,Operador.MENOR_QUE, @1.first_line, @1.first_column); }
    | EXPR lte EXPR                   { $$ = new Operacion($1,$3,Operador.MENOR_IGUAL_QUE, @1.first_line, @1.first_column); }
    | EXPR gt EXPR                    { $$ = new Operacion($1,$3,Operador.MAYOR_QUE, @1.first_line, @1.first_column); }
    | EXPR gte EXPR                   { $$ = new Operacion($1,$3,Operador.MAYOR_IGUAL_QUE, @1.first_line, @1.first_column); }
    | EXPR equal EXPR                 { $$ = new Operacion($1,$3,Operador.IGUAL_IGUAL, @1.first_line, @1.first_column); }
    | EXPR noequal EXPR               { $$ = new Operacion($1,$3,Operador.DIFERENTE_QUE, @1.first_line, @1.first_column); }
;

OP_LOGICAS:
    EXPR and EXPR                    { $$ = new Operacion($1,$3,Operador.AND, @1.first_line, @1.first_column); }
    | EXPR or EXPR                   { $$ = new Operacion($1,$3,Operador.OR, @1.first_line, @1.first_column); }
    | not EXPR                       { $$ = new Operacion($2,$2,Operador.NOT, @1.first_line, @1.first_column); }
;

PRIMITIVA:
    IntegerLiteral                      { $$ = new Primitivo(Number($1), @1.first_line, @1.first_column); }
    | DoubleLiteral                     { $$ = new Primitivo(Number($1), @1.first_line, @1.first_column); }
    | StringLiteral                     { $$ = new Primitivo($1.replace(/['"]+/g, ''), @1.first_line, @1.first_column); }
    | CharLiteral                       { $$ = new Primitivo($1, @1.first_line, @1.first_column); }
    | null                              { $$ = new Primitivo(null, @1.first_line, @1.first_column); }
    | true                              { $$ = new Primitivo(true, @1.first_line, @1.first_column); }
    | false                             { $$ = new Primitivo(false, @1.first_line, @1.first_column); } 
    | identifier                        { $$ = new AccesoVariable($1, @1.first_line, @1.first_column);}
    | lparen EXPR rparen                { $$ = $2 }
;