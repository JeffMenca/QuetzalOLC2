
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
"&"                   return 'amp'
"$"                   return 'doll'

/* ERROR LEXICO  */
.                     {console.error('Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', y columna: ' + yylloc.first_column);}
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* IMPORTS  */
%{
    const {Print} = require("../Instrucciones/Primitivas/Print.js");
    const {Primitivo} = require("../Expresiones/Primitivo.js");
    const {Operacion, Operador} = require("../Expresiones/Operacion.js");
    const {Objeto} = require("../Expresiones/Objeto.js");
    const {Atributo} = require("../Expresiones/Atributo.js");
%}

/* PRECEDENCIA */
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

START : RAICES EOF         { $$ = $1; return $$; }
    ;

RAICES:
    RAICES RAIZ           { $1.push($2); $$ = $1;}
	| RAIZ                { $$ = [$1]; } ;

RAIZ:
    PRINT semicolon       { $$ = $1 };

PRINT:
    print lparen EXPR rparen            { $$ = new Print($3, @1.first_line, @1.first_column); } 
    | println lparen EXPR rparen        { $$ = new Print($3, @1.first_line, @1.first_column,true); } ;

EXPR:
    PRIMITIVA                           { $$ = $1 }
    | OP_ARITMETICAS                    { $$ = $1 }
    | OP_RELACIONALES                   { $$ = $1 }
    | OP_LOGICAS                { $$ = $1 }
;


OP_ARITMETICAS:
    EXPR plus EXPR                      { $$ = new Operacion($1,$3,Operador.SUMA, @1.first_line, @1.first_column); }
    | EXPR minus EXPR                   { $$ = new Operacion($1,$3,Operador.RESTA, @1.first_line, @1.first_column); }
    | EXPR multi EXPR                   { $$ = new Operacion($1,$3,Operador.MULTIPLICACION, @1.first_line, @1.first_column); }
    | EXPR div EXPR                     { $$ = new Operacion($1,$3,Operador.DIVISION, @1.first_line, @1.first_column); }
    | EXPR mod EXPR                     { $$ = new Operacion($1,$3,Operador.MODULO, @1.first_line, @1.first_column); }
    | minus EXPR %prec UMINUS           { $$ = new Operacion($2,$2,Operador.MENOS_UNARIO, @1.first_line, @1.first_column); }
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
    | charliteral                       { $$ = new Primitivo($1, @1.first_line, @1.first_column); }
    | null                              { $$ = new Primitivo(null, @1.first_line, @1.first_column); }
    | true                              { $$ = new Primitivo(true, @1.first_line, @1.first_column); }
    | false                             { $$ = new Primitivo(false, @1.first_line, @1.first_column); } 
    | lparen EXPR rparen                { $$ = $2 }
;