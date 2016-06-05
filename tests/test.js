//var assert = require('chai').assert;
'use strict';
var test = require('unit.js')
var sintax = require("../src/sintax.js");

var sin = new sintax.Sintax("js");

var colors = {
    reserved: "#FC29FF",
    strings: "#E4D642",
    numbers: "#fe4e44",
    identifiers: "#4d9cee",
    special: "#ffb225",
    comment: "#777"
};

var css = `span.sin_reserved {color: #FC29FF;}
span.sin_strings {color: #E4D642;}
span.sin_numbers {color: #fe4e44;}
span.sin_identifiers {color: #4d9cee;}
span.sin_special {color: #ffb225;}
span.sin_comment {color: #777;}
`;

//console.log(sintax.js);

describe('sintax.', function() {
  describe('Colors.generate_css()', function () {
    it('should generate valid css', function () {
        var not_mini_without = sintax.Colors.generate_css(colors);
        var not_mini_with = sintax.Colors.generate_css(colors, false);
        var mini = sintax.Colors.generate_css(colors, true);
        // should be able to execute without passing second parameter
        test.assert.equal(not_mini_with, not_mini_without);
        // should generate the right css
        test.assert.equal(not_mini_with, css);
        // should minify properly. No spaces allowed
        test.assert.equal(mini.indexOf(" "), -1);
    });
  });

  // test colorizer:
  describe('highlight()', function() {
     describe('Numbers:', function() {
         it('should understand numbers', function() {
             // should parse number right
             var simple_nums = ["459", "1983.9901", "1.1893124E+45"];
             //console.log(dfa._states);
             for (var i = 0; i < simple_nums.length; i++) {
                 var n = simple_nums[i];
                 var res = sin.highlight(n);
                 var res2 = sin.highlight(n);
                 /*console.log("res: ", res);
                 console.log("res2: ", res2);
                 console.log(sin);*/
                 test.string(res); // should be a string
                 // should be able to colorize multiple strings in a row
                 test.assert.equal(res, "<span class='sin_numbers'>" + n + "</span>");
                 test.assert.equal(res2, "<span class='sin_numbers'>" + n + "</span>");
             }
         });
         it ('should trim the whitespace', function() {
             // should not have any appending whitespace
             var white_nums = ["111   ", "9.1623462363426\t \n","9081.283E-12\n\n\t "];
             for (var i = 0; i < white_nums.length; i++) {
                 var n = white_nums[i];
                 var res = sin.highlight(n);
                 test.string(res); // should be a string
                 //console.log("match: " + res + res.match(/[0-9]+\.[0-9]+(E[\+\-][0-9]+)?(![\n\t ]+)/));
                 test.assert.strictEqual(res.match(/[0-9]+\.[0-9]+(E[\+\-][0-9]+)?(^[\n\t ]+)/), null);
             }
         });
     });

     describe('Strings:', function() {
         it ('should recognize simple strings', function() {
             // should not have any appending whitespace
             var simple_strings = ["'I\\' am a string'", "'Stringify me, baby!'", "'Jelly Beans are really tasty and I mean it! See you in court! :)'"];
             for (var i = 0; i < simple_strings.length; i++) {
                 var n = simple_strings[i];
                 var res = sin.highlight(n);
                 test.string(res); // should be a string
                 //console.log("match: " + res + res.match(/[0-9]+\.[0-9]+(E[\+\-][0-9]+)?(![\n\t ]+)/));
                 test.assert.notEqual(res.match(/\<span class=\'sin_strings\'\>.+\<\/span\>/), null);
             }
         });
     });


     describe('Language syntax:', function() {
         it ('should recognize identifiers', function() {
             // should not have any appending whitespace
             var ids = ["var a = 5;", "function c(a) {\n\treturn a;\n}", "// states should start with 0 and the initial should be 0\nfunction sintax(states) {\n    var saved = states;\n    var dfa = new DFA(states, 0);\n    //var out = \"\";\n\n    function colorize(text) {\n        out = \"\";\n        dfa = new DFA(saved, 0);\n        var iter = byChar(text);\n        while (iter.hasNext())\n            dfa.move(iter.next());\n        if (spanOpen)\n            out += \"</span>\";\n        console.log(out)\n        return out;\n    }\n\n    return {\n        dfa: dfa,\n        //out: out,\n        colorize: colorize\n    };\n}"];
             for (var i = 0; i < ids.length; i++) {
                 var n = ids[i];
                 var res = sin.highlight(n);
                 test.string(res); // should be a string
                // console.log(res);
                 //console.log("match: " + res + res.match(/[0-9]+\.[0-9]+(E[\+\-][0-9]+)?(![\n\t ]+)/));
                 //test.assert.notEqual(res.match(/\<span class=\'sin_strings\'\>.+\<\/span\>/), null);
             }
         });

         it ('should highlight function calls: e.g. "func()" should be highlighted', function() {
             var funcs = [
                 "someFunction();",
                 "module.someFunction();",
                 "module.another.cool.thingHere.someFunction()"
             ];
             funcs.map(function(i) {
                // someFunction should always be wrapped
                var res = sin.highlight(i);
                //console.log(res);
                test.assert.notEqual(res.match(/\<span class=['"`]sin_identifiers['"`]\>someFunction<\/span>/), null);
             });
         });

         // TODO: maybe add symbol table to colorize classes and constructors

         describe('Operators:', function() {
             // let's check slashes in different situations
             it ('should understand division operator', function() {
                 var t = ["5/1", "5/ 1", "5 /1", "5 /      1"];
                 var mid = ["/", "/ ", " /", " /      "];
                 for (var i = 0; i < t.length; i++) {
                     var tres = sin.highlight(t[i]);
                     test.string(tres);
                     test.assert.strictEqual("<span class='sin_numbers'>5</span>" + mid[i] + "<span class='sin_numbers'>1</span>", tres);
                 }

                 // the same, but with identifiers:
                 t = ["a/b", "a/ b", "a /b", "a /      b"];
                 for (var i = 0; i < t.length; i++) {
                     var tres = sin.highlight(t[i]);
                     test.string(tres);
                     test.assert.strictEqual("a" + mid[i] + "b", tres);
                 }
             });

             // let's try out some basic ops
             it ("should colorize basic operators", function() {
                 
             });
         });



         describe('Comments', function() {
             it ('should understand single-line comments', function() {

             });

             it ('should understand escaped (newline) single-line comments', function() {

             });

             it ('should understand multiline comments', function() {

             });
         });

         it ('should understand regexp', function() {
             var t = ["/abc/"]//, "/\//", "/a+([^ub]|[0-9]\*\.)/g", "/[0-9]+(\.[0-9]+(E[\+\-][0-9])?)/gi"];
             for (var i = 0; i < t.length; i++) {
                 var tres = sin.highlight(t[i]);
                 console.log("result: " + tres);
                 test.string(tres);
                 test.assert.strictEqual("<span class='sin_special'>" + t[i] + "</span>", tres);
             }
         });
     });
  });
});
