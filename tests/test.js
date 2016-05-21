//var assert = require('chai').assert;
var test = require('unit.js')
var sintax = require("../src/sintax.js");

var colors = {
    reserved: "#FC29FF",
    strings: "#E4D642",
    numbers: "#fe4e44",
    identifiers: "#4d9cee",
    special: "#ffb225",
    comment: "#777"
};

var css = `span.reserved {color: #FC29FF;}
span.strings {color: #E4D642;}
span.numbers {color: #fe4e44;}
span.identifiers {color: #4d9cee;}
span.special {color: #ffb225;}
span.comment {color: #777;}
`;

describe('sintax', function() {
  describe('generate_css()', function () {
    it('generate valid css', function () {
        var not_mini_without = sintax.generate_css(colors);
        var not_mini_with = sintax.generate_css(colors, false);
        var mini = sintax.generate_css(colors, true);
        // should be able to execute without passing second parameter
        test.assert.equal(not_mini_with, not_mini_without);
        // should generate the right css
        test.assert.equal(not_mini_with, css);
        // should minify properly. No spaces allowed
        test.assert.equal(mini.indexOf(" "), -1);
    });
  });
});
