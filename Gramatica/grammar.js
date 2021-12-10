/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var grammar = (function() {
    var o = function(k, v, o, l) { for (o = o || {}, l = k.length; l--; o[k[l]] = v); return o },
        $V0 = [1, 7],
        $V1 = [1, 6],
        $V2 = [5, 10, 21],
        $V3 = [1, 12],
        $V4 = [1, 18],
        $V5 = [1, 24],
        $V6 = [1, 23],
        $V7 = [1, 16],
        $V8 = [1, 17],
        $V9 = [1, 19],
        $Va = [1, 20],
        $Vb = [1, 21],
        $Vc = [1, 22],
        $Vd = [13, 15],
        $Ve = [1, 28],
        $Vf = [1, 33],
        $Vg = [1, 30],
        $Vh = [1, 31],
        $Vi = [1, 32],
        $Vj = [1, 34],
        $Vk = [15, 24, 27, 28, 29, 30],
        $Vl = [11, 13, 15],
        $Vm = [24, 27, 28],
        $Vn = [15, 24, 27, 28, 29],
        $Vo = [10, 11];
    var parser = {
        trace: function trace() {},
        yy: {},
        symbols_: { "error": 2, "START": 3, "RAICES": 4, "EOF": 5, "RAIZ": 6, "PRINT": 7, "semicolon": 8, "OBJETO": 9, "lt": 10, "identifier": 11, "LATRIBUTOS": 12, "gt": 13, "OBJETOS": 14, "div": 15, "LISTA_ID_OBJETO": 16, "ATRIBUTOS": 17, "ATRIBUTO": 18, "asig": 19, "StringLiteral": 20, "print": 21, "lparen": 22, "EXPR": 23, "rparen": 24, "PRIMITIVA": 25, "OP_ARITMETICAS": 26, "plus": 27, "minus": 28, "multi": 29, "mod": 30, "IntegerLiteral": 31, "DoubleLiteral": 32, "charliteral": 33, "null": 34, "true": 35, "false": 36, "$accept": 0, "$end": 1 },
        terminals_: { 2: "error", 5: "EOF", 8: "semicolon", 10: "lt", 11: "identifier", 13: "gt", 15: "div", 19: "asig", 20: "StringLiteral", 21: "print", 22: "lparen", 24: "rparen", 27: "plus", 28: "minus", 29: "multi", 30: "mod", 31: "IntegerLiteral", 32: "DoubleLiteral", 33: "charliteral", 34: "null", 35: "true", 36: "false" },
        productions_: [0, [3, 2],
            [4, 2],
            [4, 1],
            [6, 2],
            [6, 1],
            [9, 9],
            [9, 9],
            [9, 5],
            [12, 1],
            [12, 0],
            [17, 2],
            [17, 1],
            [18, 3],
            [16, 2],
            [16, 1],
            [14, 2],
            [14, 1],
            [7, 4],
            [23, 1],
            [23, 1],
            [26, 3],
            [26, 3],
            [26, 3],
            [26, 3],
            [26, 3],
            [26, 2],
            [26, 3],
            [25, 1],
            [25, 1],
            [25, 1],
            [25, 1],
            [25, 1],
            [25, 1],
            [25, 1]
        ],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */ , $$ /* vstack */ , _$ /* lstack */ ) {
            /* this == yyval */

            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:
                    this.$ = $$[$0 - 1];
                    return this.$;
                    break;
                case 2:
                case 11:
                case 16:
                    $$[$0 - 1].push($$[$0]);
                    this.$ = $$[$0 - 1];
                    break;
                case 3:
                case 12:
                case 17:
                    this.$ = [$$[$0]];
                    break;
                case 4:
                case 27:
                    this.$ = $$[$0 - 1]
                    break;
                case 5:
                case 15:
                case 19:
                case 20:
                    this.$ = $$[$0]
                    break;
                case 6:
                    this.$ = new Objeto($$[$0 - 7], '', _$[$0 - 8].first_line, _$[$0 - 8].first_column, $$[$0 - 6], $$[$0 - 4]);
                    break;
                case 7:
                    this.$ = new Objeto($$[$0 - 7], $$[$0 - 4], _$[$0 - 8].first_line, _$[$0 - 8].first_column, $$[$0 - 6], []);
                    break;
                case 8:
                    this.$ = new Objeto($$[$0 - 3], '', _$[$0 - 4].first_line, _$[$0 - 4].first_column, $$[$0 - 2], []);
                    break;
                case 9:
                    this.$ = $$[$0];
                    break;
                case 10:
                    this.$ = [];
                    break;
                case 13:
                    this.$ = new Atributo($$[$0 - 2], $$[$0], _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 14:
                    $$[$0 - 1] = $$[$0 - 1] + ' ' + $$[$0];
                    this.$ = $$[$0 - 1];
                    break;
                case 18:
                    this.$ = new Print($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    break;
                case 21:
                    this.$ = new Operacion($$[$0 - 2], $$[$0], Operador.SUMA, _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 22:
                    this.$ = new Operacion($$[$0 - 2], $$[$0], Operador.RESTA, _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 23:
                    this.$ = new Operacion($$[$0 - 2], $$[$0], Operador.MULTIPLICACION, _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 24:
                    this.$ = new Operacion($$[$0 - 2], $$[$0], Operador.DIVISION, _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 25:
                    this.$ = new Operacion($$[$0 - 2], $$[$0], Operador.MODULO, _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 26:
                    this.$ = new Operacion($$[$0], $$[$0], Operador.MENOS_UNARIO, _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    break;
                case 28:
                case 29:
                    this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
                    break;
                case 30:
                case 31:
                    this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
                    break;
                case 32:
                    this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column);
                    break;
                case 33:
                    this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
                    break;
                case 34:
                    this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
                    break;
            }
        },
        table: [{ 3: 1, 4: 2, 6: 3, 7: 4, 9: 5, 10: $V0, 21: $V1 }, { 1: [3] }, { 5: [1, 8], 6: 9, 7: 4, 9: 5, 10: $V0, 21: $V1 }, o($V2, [2, 3]), { 8: [1, 10] }, o($V2, [2, 5]), { 22: [1, 11] }, { 11: $V3 }, { 1: [2, 1] }, o($V2, [2, 2]), o($V2, [2, 4]), { 20: $V4, 22: $V5, 23: 13, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, o($Vd, [2, 10], { 12: 25, 17: 26, 18: 27, 11: $Ve }), { 15: $Vf, 24: [1, 29], 27: $Vg, 28: $Vh, 29: $Vi, 30: $Vj }, o($Vk, [2, 19]), o($Vk, [2, 20]), o($Vk, [2, 28]), o($Vk, [2, 29]), o($Vk, [2, 30]), o($Vk, [2, 31]), o($Vk, [2, 32]), o($Vk, [2, 33]), o($Vk, [2, 34]), { 20: $V4, 22: $V5, 23: 35, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, { 20: $V4, 22: $V5, 23: 36, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, { 13: [1, 37], 15: [1, 38] }, o($Vd, [2, 9], { 18: 39, 11: $Ve }), o($Vl, [2, 12]), { 19: [1, 40] }, { 8: [2, 18] }, { 20: $V4, 22: $V5, 23: 41, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, { 20: $V4, 22: $V5, 23: 42, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, { 20: $V4, 22: $V5, 23: 43, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, { 20: $V4, 22: $V5, 23: 44, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, { 20: $V4, 22: $V5, 23: 45, 25: 14, 26: 15, 28: $V6, 31: $V7, 32: $V8, 33: $V9, 34: $Va, 35: $Vb, 36: $Vc }, o($Vk, [2, 26]), { 15: $Vf, 24: [1, 46], 27: $Vg, 28: $Vh, 29: $Vi, 30: $Vj }, { 9: 49, 10: $V0, 11: [1, 50], 14: 47, 16: 48 }, { 13: [1, 51] }, o($Vl, [2, 11]), { 20: [1, 52] }, o($Vm, [2, 21], { 15: $Vf, 29: $Vi, 30: $Vj }), o($Vm, [2, 22], { 15: $Vf, 29: $Vi, 30: $Vj }), o($Vn, [2, 23], { 30: $Vj }), o($Vn, [2, 24], { 30: $Vj }), o($Vn, [2, 25], { 30: $Vj }), o($Vk, [2, 27]), { 9: 54, 10: [1, 53] }, { 10: [1, 55], 11: [1, 56] }, { 10: [2, 17] }, o($Vo, [2, 15]), o($V2, [2, 8]), o($Vl, [2, 13]), { 11: $V3, 15: [1, 57] }, { 10: [2, 16] }, { 15: [1, 58] }, o($Vo, [2, 14]), { 11: [1, 59] }, { 11: [1, 60] }, { 13: [1, 61] }, { 13: [1, 62] }, o($V2, [2, 6]), o($V2, [2, 7])],
        defaultActions: { 8: [2, 1], 29: [2, 18], 49: [2, 17], 54: [2, 16] },
        parseError: function parseError(str, hash) {
            if (hash.recoverable) {
                this.trace(str);
            } else {
                var error = new Error(str);
                error.hash = hash;
                throw error;
            }
        },
        parse: function parse(input) {
            var self = this,
                stack = [0],
                tstack = [],
                vstack = [null],
                lstack = [],
                table = this.table,
                yytext = '',
                yylineno = 0,
                yyleng = 0,
                recovering = 0,
                TERROR = 2,
                EOF = 1;
            var args = lstack.slice.call(arguments, 1);
            var lexer = Object.create(this.lexer);
            var sharedState = { yy: {} };
            for (var k in this.yy) {
                if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                    sharedState.yy[k] = this.yy[k];
                }
            }
            lexer.setInput(input, sharedState.yy);
            sharedState.yy.lexer = lexer;
            sharedState.yy.parser = this;
            if (typeof lexer.yylloc == 'undefined') {
                lexer.yylloc = {};
            }
            var yyloc = lexer.yylloc;
            lstack.push(yyloc);
            var ranges = lexer.options && lexer.options.ranges;
            if (typeof sharedState.yy.parseError === 'function') {
                this.parseError = sharedState.yy.parseError;
            } else {
                this.parseError = Object.getPrototypeOf(this).parseError;
            }

            function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n;
            }
            _token_stack:
                var lex = function() {
                    var token;
                    token = lexer.lex() || EOF;
                    if (typeof token !== 'number') {
                        token = self.symbols_[token] || token;
                    }
                    return token;
                };
            var symbol, preErrorSymbol, state, action, a, r, yyval = {},
                p, len, newState, expected;
            while (true) {
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state];
                } else {
                    if (symbol === null || typeof symbol == 'undefined') {
                        symbol = lex();
                    }
                    action = table[state] && table[state][symbol];
                }
                if (typeof action === 'undefined' || !action.length || !action[0]) {
                    var errStr = '';
                    expected = [];
                    for (p in table[state]) {
                        if (this.terminals_[p] && p > TERROR) {
                            expected.push('\'' + this.terminals_[p] + '\'');
                        }
                    }
                    if (lexer.showPosition) {
                        errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                    } else {
                        errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                    }
                    this.parseError(errStr, {
                        text: lexer.match,
                        token: this.terminals_[symbol] || symbol,
                        line: lexer.yylineno,
                        loc: yyloc,
                        expected: expected
                    });
                }
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
                }
                switch (action[0]) {
                    case 1:
                        stack.push(symbol);
                        vstack.push(lexer.yytext);
                        lstack.push(lexer.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = lexer.yyleng;
                            yytext = lexer.yytext;
                            yylineno = lexer.yylineno;
                            yyloc = lexer.yylloc;
                            if (recovering > 0) {
                                recovering--;
                            }
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [
                                lstack[lstack.length - (len || 1)].range[0],
                                lstack[lstack.length - 1].range[1]
                            ];
                        }
                        r = this.performAction.apply(yyval, [
                            yytext,
                            yyleng,
                            yylineno,
                            sharedState.yy,
                            action[1],
                            vstack,
                            lstack
                        ].concat(args));
                        if (typeof r !== 'undefined') {
                            return r;
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true;
                }
            }
            return true;
        }
    };

    const { Print } = require("../Instrucciones/Primitivas/Print.js");
    const { Primitivo } = require("../Expresiones/Primitivo.js");
    const { Operacion, Operador } = require("../Expresiones/Operacion.js");
    const { Objeto } = require("../Expresiones/Objeto.js");
    const { Atributo } = require("../Expresiones/Atributo.js");
    /* generated by jison-lex 0.3.4 */
    var lexer = (function() {
        var lexer = ({

            EOF: 1,

            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },

            // resets the lexer, sets new input
            setInput: function(input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
            },

            // consumes and returns one char from the input
            input: function() {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }

                this._input = this._input.slice(1);
                return ch;
            },

            // unshifts one char (or a string) into the input
            unput: function(ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;

                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ?
                        (lines.length === oldLines.length ? this.yylloc.first_column : 0) +
                        oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },

            // When called from action, caches matched text and appends it on next action
            more: function() {
                this._more = true;
                return this;
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function() {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });

                }
                return this;
            },

            // retain first n characters of the match
            less: function(n) {
                this.unput(this.match.slice(n));
            },

            // displays already matched input, i.e. for error messages
            pastInput: function() {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput: function() {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function() {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function(match, indexed_rule) {
                var token,
                    lines,
                    backup;

                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }

                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ?
                        lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    // recover context
                    for (var k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },

            // return next match in input
            next: function() {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }

                var token,
                    match,
                    tempMatch,
                    index;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            } else if (this._backtrack) {
                                match = false;
                                continue; // rule action called reject() implying a rule MISmatch.
                            } else {
                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                return false;
                            }
                        } else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },

            // return next match that has a token
            lex: function lex() {
                var r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },

            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions["INITIAL"].rules;
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return "INITIAL";
                }
            },

            // alias for begin(condition)
            pushState: function pushState(condition) {
                this.begin(condition);
            },

            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
            },
            options: { "case-insensitive": true },
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:
                        return 34
                        break;
                    case 1:
                        return 'int'
                        break;
                    case 2:
                        return 'double'
                        break;
                    case 3:
                        return 'boolean'
                        break;
                    case 4:
                        return 'char'
                        break;
                    case 5:
                        return 'string'
                        break;
                    case 6:
                        return 'struct'
                        break;
                    case 7:
                        return 'pow'
                        break;
                    case 8:
                        return 'sqrt'
                        break;
                    case 9:
                        return 'sin'
                        break;
                    case 10:
                        return 'cos'
                        break;
                    case 11:
                        return 'tan'
                        break;
                    case 12:
                        return 21
                        break;
                    case 13:
                        return 'println'
                        break;
                    case 14:
                        return 35
                        break;
                    case 15:
                        return 36
                        break;
                    case 16:
                        /* Comentario multiple */
                        break;
                    case 17:
                        /* Comentario simple */
                        break;
                    case 18:
                        /* Ignora espacio y tabs */
                        break;
                    case 19:
                        /* Ignora espacio */
                        break;
                    case 20:
                        return 32;
                        break;
                    case 21:
                        return 31;
                        break;
                    case 22:
                        return 11;
                        break;
                    case 23:
                        return 20
                        break;
                    case 24:
                        return 'CharLiteral'
                        break;
                    case 25:
                        return 29
                        break;
                    case 26:
                        return 15
                        break;
                    case 27:
                        return 28
                        break;
                    case 28:
                        return 27
                        break;
                    case 29:
                        return 'pot'
                        break;
                    case 30:
                        return 'dif'
                        break;
                    case 31:
                        return 30
                        break;
                    case 32:
                        return 22
                        break;
                    case 33:
                        return 24
                        break;
                    case 34:
                        return 10
                        break;
                    case 35:
                        return 13
                        break;
                    case 36:
                        return 19
                        break;
                    case 37:
                        return 'equal'
                        break;
                    case 38:
                        return 'nequal'
                        break;
                    case 39:
                        return 'lge'
                        break;
                    case 40:
                        return 'gte'
                        break;
                    case 41:
                        return 'and'
                        break;
                    case 42:
                        return 'or'
                        break;
                    case 43:
                        return 8
                        break;
                    case 44:
                        return 'dosp'
                        break;
                    case 45:
                        return 'quest'
                        break;
                    case 46:
                        return 'amp'
                        break;
                    case 47:
                        return 'doll'
                        break;
                    case 48:
                        console.error('Errorléxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', y columna: ' + yy_.yylloc.first_column);
                        break;
                    case 49:
                        return 5
                        break;
                    case 50:
                        return 'INVALID'
                        break;
                }
            },
            rules: [/^(?:null\b)/i, /^(?:int\b)/i, /^(?:double\b)/i, /^(?:boolean\b)/i, /^(?:char\b)/i, /^(?:string\b)/i, /^(?:struct\b)/i, /^(?:pow\b)/i, /^(?:sqrt\b)/i, /^(?:sin\b)/i, /^(?:cos\b)/i, /^(?:tan\b)/i, /^(?:print\b)/i, /^(?:println\b)/i, /^(?:true\b)/i, /^(?:false\b)/i, /^(?:[/][*][^]*[*][/])/i, /^(?:[/][/].*)/i, /^(?:[\t\n\r]+)/i, /^(?:\s+)/i, /^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i, /^(?:[0-9]+)/i, /^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/i, /^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i, /^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/i, /^(?:\*)/i, /^(?:\/)/i, /^(?:-)/i, /^(?:\+)/i, /^(?:\^)/i, /^(?:!)/i, /^(?:%)/i, /^(?:\()/i, /^(?:\))/i, /^(?:<)/i, /^(?:>)/i, /^(?:=)/i, /^(?:==)/i, /^(?:!=)/i, /^(?:<=)/i, /^(?:>=)/i, /^(?:&&)/i, /^(?:\|\|)/i, /^(?:;)/i, /^(?::)/i, /^(?:\?)/i, /^(?:&)/i, /^(?:\$)/i, /^(?:.)/i, /^(?:$)/i, /^(?:.)/i],
            conditions: { "comment": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], "inclusive": true }, "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], "inclusive": true } }
        });
        return lexer;
    })();
    parser.lexer = lexer;

    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser;
    parser.Parser = Parser;
    return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = grammar;
    exports.Parser = grammar.Parser;
    exports.parse = function() { return grammar.parse.apply(grammar, arguments); };
    exports.main = function commonjsMain(args) {
        if (!args[1]) {
            console.log('Usage: ' + args[0] + ' FILE');
            process.exit(1);
        }
        var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
        return exports.parser.parse(source);
    };
    if (typeof module !== 'undefined' && require.main === module) {
        exports.main(process.argv.slice(1));
    }
}