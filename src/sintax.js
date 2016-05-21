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


    function single_quote() {
        curr = inp[i++]; // make sure to clean up curr
        for (; inp[i] !== "'"; i++) {
            // TODO: Build in functionality to allow or disallow multiline strings
            // TODO: Find string interpolation if language provides it
            // skip \' -> whatever comes after backslash
            if (inp[i] === "\\") {
                curr += "\\" + inp[++i];
            } else {
                curr += inp[i];
            }
        }
        // TODO: create configuration for colors:
        return "<span class='sin_strings'>" + curr + "</span>";
    }

    function double_quote() {
        // TODO: Find a way to combine single and double quotes
        curr = inp[i++]; // make sure to clean up curr
        for (; inp[i] !== "\""; i++) {
            // TODO: Build in functionality to allow or disallow multiline strings
            // TODO: Find string interpolation if language provides it
            // skip \' -> whatever comes after backslash
            if (inp[i] === "\\") {
                curr += "\\" + inp[++i];
            } else {
                curr += inp[i];
            }
        }
        // TODO: create configuration for colors:
        return "<span class='sin_strings'>" + curr + "</span>";
    }

    function number() {
        curr = inp[i++];
        //console.log("Number: " + inp[i]);
        for (; inp[i] !== undefined && inp[i].match(/[0-9]/); i++) {
            //  first, get whole number
            curr += inp[i];
        }
        // TODO: enable ranges (like in Ruby or Swift: (3..10))
        // evaluate floating point
        if (inp[i] == ".") {
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
        // return the colorized string
        return "<span class='sin_numbers'>" + curr + "</span>";
    }

    function identifier() {
        curr = inp[i++];
        // now move through the identifier
        for (; inp[i].match(/[a-zA-Z0-9_]/); i++) {
            curr += inp[i];
        }
        // simply return identifier, don't care about type yet
        return "<span class='sin_identifiers'>" + curr + "</span>";
    }

    /* here goes the initial state. From here we'll move to other states
     * But, every other state has an edge to this state, because it's the only
     * state that halts the automaton. */
    for (i = 0; i < input.length; i++) {
        //console.log(inp[i]);
        if (inp[i] === "'") {
            out += single_quote();
        } else if (inp[i] === '"') {
            out += double_quote();
        } else if (inp[i].match(/[0-9]/)) {
            out += number();
        } else if (inp[i].match(/[a-zA-Z_]/)) {
            out += identifier();
        } else {
            //if (inp[i].match(/[ \+\=\-\*\(\{\)\}\[\]\;\,\.\!\$\±\§\~\|]/)) {
            out += inp[i]; // simply append to output
        }
    }
    return out;
}


//console.log(sintax("145\n\t"));


module.exports = {
    colorize: sintax,
    generate_css: generate_css
};
