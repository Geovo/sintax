/* Sintax main file
 * Author: Kristian Voshchepynets
 *
 */
'use strict';

// process text
function byChar(input) {
    var i = 0;

    function hasNext() {
        return input[i+1] != null ? true : false;
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
var out = "",
    cache = "",
    spanOpen = false;

class Transition {
    constructor(input, next, exec) {
        this.input = input;
        this.next = next;
        this._exec = exec;
    }

    run(c) {
        this._exec(c);
    }
}

class State {
    constructor(id, transitions, halt) {
        this.id = id;
        this.transitions = transitions;
        this.halt = halt;
    }
}


class DFA {
    constructor(states, initial) {
        this._states = states;
        this._initial = initial;
        this.current = initial;
        this._currstr = "";
        this.out = "";
    }

    matcher(input, reg) {
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
    move(inp) {
        //this._currstr += inp;
        var t = this._states[this.current].transitions;
        //console.log(t);
        var noTransition = true;
        for (var i = 0; i < t.length; i++) {
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
                    endSpan("");
                    spanOpen = false;
                }
            //else
                // don't accept
            //    console.log("ERROR: dfa doesn't accept");
        }
    }
}

// states should start with 0 and the initial should be 0
function sintax(states) {
    var dfa = new DFA(states, 0);
    var out = "";

    function colorize(text) {
        out = "";
        var iter = byChar(text);
        while (iter.hasNext())
            dfa.move(iter.next());
    }

    return {
        dfa: dfa,
        out: out,
        colorize: colorize
    };
}


module.exports = {
    colorize: sintax,
    generate_css: generate_css,
    iterator: byChar
};
