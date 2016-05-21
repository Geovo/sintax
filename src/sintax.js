/* Sintax main file
 * Author: Kristian Voshchepynets
 *
 */

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
        return minify ? `span.${klass}{color:${val};}` : `span.${klass} {color: ${val};}\n`;
    }

    var out = "";
    for (var k in cols) {
        out += structure_css(k, cols[k]);
    }
    return out;
}

console.log(generate_css(colors));

module.exports.generate_css = generate_css;
