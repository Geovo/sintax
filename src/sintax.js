/* Sintax main file
 * Author: Kristian Voshchepynets
 *
 */

'use strict';
var out = "",
    cache = "",
    spanOpen = false;


function Transition(input, next, exec) {
    this.input = input;
    this.next = next;
    this._exec = exec;
}

Transition.prototype.run = function(c) {
    this._exec(c);
}

function State(id, transitions, halt) {
    this.id = id;
    this.transitions = transitions;
    this.halt = halt;
}


function DFA(states, initial) {
    this._states = states;
    this._initial = initial;
    this.current = initial;
    //this._currstr = "";
    //this.out = "";
}

 DFA.prototype.matcher = function(input, reg) {
    // console.log("matching: " + input + " with " + reg);
     if (input == null)
         return false;
     if (reg == null)
         if (input == null)
             return true;
         else
             return false;
     else
         return input.match(reg);
 }

     // make transition here
DFA.prototype.move = function(inp) {
    //this._currstr += inp;
    //console.log("current: " + this.current + " t: " + this._states[0]);
    var t = this._states[this.current].transitions;
    var noTransition = true;
    for (var i = 0; i < t.length; i++) {
        //console.log(t[i]);
        if (this.matcher(inp, t[i].input)) {
            // call function
            console.log("passing inp: " + inp);
            t[i].run(inp);
            this.current = t[i].next;
            console.log("switched to state: " + this.current);
            noTransition = false;
            break;
        }
    }
    if (noTransition) {
        // then either the dfa doesn't accept or accepts
        //if (this._states[this.current].halt)
            // accept
            console.log("dfa finished");
            if (spanOpen) {
                JS.endSpan("");
                spanOpen = false;
            }
        //else
            // don't accept
        //    console.log("ERROR: dfa doesn't accept");
    }
}

// const skeleton = require("./skeleton.js");
//const lang = require("./languages.js");

// process text
function byChar(input) {
    var i = 0;

    function hasNext() {
        return input[i] != null ? true : false;
    }

    function next() {
        return input[i++];
    }

    return {
        next: next,
        hasNext: hasNext
    };
    //return r;
}


var colors = {
    reserved: "#FC29FF",
    strings: "#E4D642",
    numbers: "#fe4e44",
    identifiers: "#4d9cee",
    special: "#ffb225",
    comment: "#777"
};

const class_prefix = "sin_"; // prefix for CSS-classes

function generate_css(cols, minify) {
    minify = minify | false;
    function structure_css(klass, val) {
        return minify ? `span.${class_prefix}${klass}{color:${val};}` : `span.${class_prefix}${klass} {color: ${val};}\n`;
    }

    var out = "";
    for (var k in cols) {
        out += structure_css(k, cols[k]);
    }
    return out;
}

//console.log(generate_css(colors));

// global out for now
/*var out = "",
    cache = "",
    spanOpen = false;

*/

// states should start with 0 and the initial should be 0
function sintax(states) {
    var saved = states;
    var dfa = new DFA(states, 0);
    //var out = "";

    function colorize(text) {
        out = "";
        dfa = new DFA(saved, 0);
        var iter = byChar(text);
        while (iter.hasNext())
            dfa.move(iter.next());
        if (spanOpen)
            out += "</span>";
        console.log("out: " + out)
        return out;
    }

    return {
        dfa: dfa,
        //out: out,
        colorize: colorize
    };
}


const JS = {
    addChar: function(c) {
        out += c;
        //console.log("fs2_2: " + c);
    },

    endSpan: function(c) {
        out += "</span>" + c;
        spanOpen = false;
        //console.log("fs2_3: " + c + "</span>");
    },

    addSpan: function(c) {
        out += "<span class='sin_numbers'>" + c;
        spanOpen = true;
        //console.log("fs3_4: </span>");
    },

    notSure: function(c) {
        cache += "c";
    },

    clearNotSure: function(c) {
        cache = c;
    },

    uncache: function(c) {
        out += cache + c;
        cache = "";
    },

    endSpan_uncache: function(c) {
        // endSpan("");
        out += "</span>" + c;
        spanOpen = false;
        //uncache(c);
        out += cache + c;
        cache = "";
    },
    /* regexp's
    ** Parsing Numbers: */
    num: /[0-9]/,
    dot: /\./,
    notNum: /[^0-9]/,
    notDot: /[^\.]/,
    id: /[a-zA-Z_]/,
    exp: /E/,
    plusMinus: /[\+\-]/,

    /** Parsing Strings: **/
    singleQuote: /\'/,
    doubleQuote: /\"/,
    backtickQuote: /\`/,

    /**  **/

    reserved: function(word) {
        return word.match(/var|function|const|let|match|map|toString|class/);
    }
    //states: [state1, state2, state3, state4]
}

const JSStates = {
    // create dummy states
    states: [
        /* Getting a number */
        new State(0, [
            new Transition(JS.num, 1, JS.addSpan),
            new Transition(JS.notNum, 0, JS.addChar)
        ]),
        /* Either stop, add further chars or move to parsing float */
        new State(1, [
            new Transition(JS.num, 1, JS.addChar),
            new Transition(JS.dot, 2, JS.addChar),
            new Transition(JS.notNum, 0, JS.endSpan)
        ]),
        /* Add digits after dot or get an E - move to exponent */
        new State(2, [
            new Transition(JS.num, 2, JS.addChar),
            new Transition(JS.exp, 3, JS.addChar),
            new Transition(JS.notNum, 0, JS.endSpan)
        ]),
        new State(3, [
            /* If not plus or minus after E, but a number, then move on */
            new Transition(JS.plusMinus, 4, JS.addChar),
            new Transition(JS.num, 4, JS.addChar),
            new Transition(JS.notNum, 0, JS.endSpan),
        ]),
        new State(4, [
            new Transition(JS.num, 4, JS.addChar),
            new Transition(JS.notNum, 0, JS.endSpan),
        ])
    ]
};

//var s = sintax(lang.JS());
//s.colorize("145.14");
//console.log(s.out);
module.exports = {
    js: JSStates,
    init: sintax,
    generate_css: generate_css,
    iterator: byChar,
    out: out
};

/*var sintax = sintax(JSStates.states);

sintax.colorize("145.14");
console.log(out);*/
//JS.print()

/*var simple_nums = ["459", "1983.9901", "1.1893124E+45"];
var dfa = sintax(JSStates.states);
console.log(dfa);
for (var i = 0; i < simple_nums.length; i++) {
    var n = simple_nums[i];
    //var res = dfa.colorize(n);
    //test.string(res); // should be a string
    //test.assert.equal(dfa.colorize(n), "<span class='sin_numbers'>" + n + "</span>");
}*/
