var grammar = require("./grammar.js")

if (typeof window !== 'undefined') {
    window.parseGrammar = function(input) {
        return grammar.parse(input);
    }
}