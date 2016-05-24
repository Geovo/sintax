/* Sintax main file
 * Author: Kristian Voshchepynets
 *
 */
'use strict';
// .brgreen { color:#5ED7D2; } .brred { color:#fe4e44; } .bryellow { color:#FFCE6F; } .brviolet { color:#FC29FF; } .brblue { color:#4d9cee; } .brorange { color:#ffb225; } .comment{color:#777} .bryellow{color:#E4D642}
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

// first, create function for every state
var inp;
function sintax(input) {
    inp = input;
    // create loop first
    var out = "",
        i = 0,
        curr = "";


    function string() {
        var quote_type = inp[i];
        curr = inp[i++]; // make sure to clean up curr
        for (; inp[i] != quote_type && inp[i] !== undefined; i++) {
            console.log(inp[i]);
            // TODO: Build in functionality to allow or disallow multiline strings
            // TODO: Find string interpolation if language provides it
            // skip \' -> whatever comes after backslash
            if (inp[i] == "\\") {
                curr += "\\" + inp[++i];
            } else {
                curr += inp[i];
            }
        }
        // add closing quote and make i point to next char
        curr += inp[i++];
        // TODO: create configuration for colors:
        return curr === undefined ? "" : "<span class='sin_strings'>" + curr + "</span>";
    }

    function number() {
        curr = inp[i++];
        //console.log("Number: " + inp[i]);
        for (; inp[i] !== undefined && inp[i].match(/[0-9]/); i++) {
            //  first, get whole number
            curr += inp[i];
        }
        // TODO: enable ranges (like in Ruby or Swift: (3..10)) and methods on nums
        // evaluate floating point
        if (inp[i] === ".") {
            curr += inp[i++];
            for (; inp[i] !== undefined && inp[i].match(/[0-9]/); i++) {
                curr += inp[i];
            }
            // check for scientific notation:
            if (inp[i] === "E" && inp[i+1].match(/[\+\-]/)) {
                curr += inp[i] + inp[i+1];
                for (i += 2; inp[i] != undefined && inp[i].match(/[0-9]/); i++)
                    curr += inp[i];
            }
        }
        //console.log("now chosen char: " + inp[i]);
        // return the colorized string
        return "<span class='sin_numbers'>" + curr + "</span>";
    }

    function identifier() {
        curr = inp[i++];
        // now move through the identifier
        for (;inp[i] !== undefined && inp[i].match(/[a-zA-Z0-9_]/); i++) {
            curr += inp[i];
        }
        // simply return identifier, don't care about type yet
        return "<span class='sin_identifiers'>" + curr + "</span>";
    }

    function start_slash() {
        //curr = inp[i];
        /* start with looking up the next char:
        * 1. If "*" or "/" -> comment
        * 2. If anything else, can be regex or expression */
        console.log("now at: " + inp[i] + " i: " + i + " next: " + inp[i+1]);
        if (inp[i+1] === undefined) {
            return inp[i++];
        } else if (inp[i+1].match(/[\/\*]/)) {
            comment();
        } else if (inp[i+1].match(/[\=]/)) {
            // can also be part of /=
            return inp[i++];
        } else {
            // assume that it's a division sign unless another
            // unescaped slash found
            //var temp = 
        }
    }

    function regexp() {
        curr = inp[i++];
        console.log("now in regex");
        // find the next slash, cannot be multiline
        for (; inp[i] !== "/" && inp[i] !== "\n" && i < inp.length; i++) {
            console.log("searching for terminator!");
            // escape escape sequences:
            if (inp[i] === "\\") {
                curr += inp[i] + inp[i+1];
                i++;
            } else
                curr += inp[i];
        }
        // A regexp may have options in the end: /[0-9]+/gi
        for (; i < inp.length && inp[i].match([gi]); i++)
            curr += inp[i];
        i++;
        console.log("end of regex: i: " + i + " char: " + inp[i]);

        // regex is a special element, because not every language includes them
        return "<span class='sin_special'>" + curr + "</span>";
    }


    /* Here go the states:
    var states  = {
        start: {
            action: start_action,
            // transitions is an array of objects
            transitions: [
                {   // TODO: find a dynamic way to create transitions
                    input: /[a-zA-Z_]/,
                    move: id_parse
                },
                {
                    input: /[\"\'\`]/,
                    move: string
                },
                {
                    input: /[0-9]/,
                    move: number
                },
                {
                    input: /\//,
                    move: slash_find
                }
            ]
        },
        // String state
        string: {
            action: string
        },
        // Number state
        number: {
            action: number
        },
        // id_parse state
        id_parse: {
            action: identifier
        },
        slash: {
            action: start_slash
        }
    };
    */
    /* here goes the initial state. From here we'll move to other states
     * But, every other state has an edge to this state, because it's the only
     * state that halts the automaton. */
    function start_action() {
        for (i = 0; i < input.length;) {
            if (inp[i].match(/[\"\'\`]/)) {
                out += string();
            } else if (inp[i].match(/[0-9]/)) {
                out += number();
            } else if (inp[i].match(/[a-zA-Z_]/)) {
                out += identifier();
            } else if (inp[i] === "/") {
                start_slash();
            } else {
                out += inp[i++]; // simply append to output
            }
        }
        return out;
    }

    return start_action();

    //return out;
}


/*console.log(sintax("145A55"));
console.log(sintax("String = \"String here\""));
console.log(sintax("var x = 5;"));
console.log(sintax("5 / 1"));*/


module.exports = {
    colorize: sintax,
    generate_css: generate_css
};
