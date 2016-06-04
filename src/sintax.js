'use strict';

const Languages = require("./langs.js");
const Logic = require("./logic.js");
//const config = require("./langs.js");

/*
 * @constructor
 * @param {string} language
 *
 */
class Sintax {
    constructor(language) {
        // language Should be a string of the name (e.g. js, ruby etc)
        //var l = language.toLowerCase() + "lang";
        this.shared = {
            out: "",
            cache: "",
            iterator: Iterator(""),
            spanOpen: false,
            quot: ""
        };
        var nulang = this.createLanguage(language.toLowerCase() + "_lang");
//		var st = new State(test);
        this.language = language;
        //console.log("language: ", language());
        this.dfa = new DFA(this.shared, nulang);
    }

    changeLanguage(language) {
        this.language = language;
        this.dfa.states = language.states;
    }

    createLanguage(name) {
        // get the configured language if exists
        var config;
        if ((config = Languages[name]) == null)
            return null;//throw Exception("Shit");
        // get the regexes
        var regexes = config.regex;
        // loop through the states, build array
        var states = [], curr, transitions;
        for (var i = 0; i < config.states.length; i++) {
            // loop through each transition of each state
            curr = config.states[i];
            transitions = [];
            for (var j = 0; j < curr.length; j++) {
                transitions.push(new Transition(curr[j], regexes));
            }
            states.push(new State(i, transitions));
        }
        return states;
    }

    highlight(text) {
        if (text == null) {
            console.log("You think I will colorize the void? Nope :)");
            return;
        }
        // passing input here
        this.shared.iterator = Iterator(text);
        while (this.shared.iterator.hasNext()) {
            this.dfa.move(this.shared.iterator.next());
            // DEBUG:
            //console.log(this.shared);
        }
        // close last span if any
        if (this.shared.spanOpen)
            this.shared.out += "</span>";

        // return the out Object
        return this.shared.out;
    }
}

class State {
    constructor(id, transitions) {
        this.id = id;
        this.transitions = transitions;
    }

    tryMove(shared, input) {
        for (var i = 0; i < this.transitions.length; i++) {
            if (input != null && input.match(this.transitions[i].trigger)) {
                this.transitions[i].func(shared, input, this.transitions[i].params);
                // DEBUG:
                //console.log("moved to other: ", this.transitions[i].moveTo);
                return this.transitions[i].moveTo;
            }
        }
    }
}

class Transition {
    constructor(config, regex) {
        if (config == null)
            return null;
        //console.log(config.trigger, regex[config.trigger]);
        try {
            this.trigger = new RegExp(regex[config.trigger]);
        } catch (m) {
            //console.log("crashing with " + m + " | " + config.trigger);
        }

        this.moveTo = config.moveTo;
        this.func = Logic[config.func];
        this.params = config.params || [];
    }
}

class DFA {
    constructor(shared, states) {
        this.shared = shared;
        this.states = states;
        this.current = 0;
    }

    move(input) {
//		this.shared.out += input;
        this.current = this.states[this.current].tryMove(this.shared, input);
    }
}

// here goes the iterator
// process text
function Iterator(input) {
    var i = 0;

    function hasNext() {
        return input[i] != null ? true : false;
    }

    function next() {
        return input[i++];
    }

    function peek() {
        return input[i];
    }

    // sets the iterator to num || 0 again
    function resetTo(num) {
        if (num && num >= 0)
            i = num;
        else {
            i = 0;
        }
    }

    function swapInput(nu) {
        input = nu;
        i = 0;
    }

    // will probably used only when dealing with slash ambiguity, such as
    // is it a comment, division operator or regular expression (if exists).
    // in this case will need to go backwards and search for some context that
    // will tell us where we are.
    function isRegexp() {
        var curr = i-1,
            id = /[a-zA-Z0-9_]/;

        // skip whitespace
        for (; curr >= 0 && input[curr].match(/[\t \b]/); curr--) ;
        // if =, :, !, or ( -- return true
        if (curr === -1 || input[curr].match(/[\=\:\!\(\+]/))
            return true;
        else if (input[curr].match(id)) {
            // get the identifier itself and check if it === "return"
            var ident = input[curr];
            for (; input[curr] != null && curr > 0 && input[curr].match(id); curr--, ident += input[curr]) ;
            ident = ident.split("").reverse().join("");
            if (ident.match(/^return$/))
                return true;
        }
        return false;
    }

    return {
        next: next,
        hasNext: hasNext,
        peek: peek,
        isRegexp: isRegexp
    };
    //return r;
}

//console.log(config.js_lang.states);
//console.log("match: ", "hello".match(new RegExp(config.js_lang.states[0][0].trigger)));
//console.log(JSON.parse(config));

var s = new Sintax("js");
var out = s.highlight("var abc = 5.1232E-42");
console.log(out);
/*console.log("State 7: ", s.dfa.states[7]);
s.dfa.move("a");
console.log(s.shared);
s.dfa.move("b");
console.log(s.shared);
s.dfa.move(" ");
console.log(s.shared);*/

/*var it = Iterator("a = /bc/;");
function iterate(it) {
    while (it.hasNext()) {
        if (it.peek() === "/") {
            console.log(it.isRegexp());
            it.next();
        } else
            it.next();
    }
}

iterate(it);
it = Iterator("return /bc/;");
iterate(it);*/
// add another string
//s.dfa.move(" another");
//console.log(s.shared);


/*var s1 = new Sintax(JSLang);
s1.dfa.move("new test");
//console.log(s1.shared);
// add another string
s1.dfa.move(" and other stuff");*/
//console.log(s1.shared);
