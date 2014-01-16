var fs = require("fs");
var path = require("path");
var esprima = require("esprima");
var esmorph = require("esmorph");

/*
AIM: find a way to 
- only consider the parts of the code that have ACTUALLY been changed (ignore comments etc)
- attach "code/script" information to the instances of generated meshes (dual way "data binding ?")

*/

//console.log("this",this,"module",module);
var contextName = module.filename.split("/").pop()//.split(".")[0];
console.log("module", contextName);

function codeToAst( source )
{
    ast = esprima.parse(source, { range: true, loc: true , comment:false})
    return ast
}

var inputModuleName = "inputModule.js";

var code = fs.readFileSync(path.join(__dirname,inputModuleName),'utf8');
console.log("code", code);

var ast = codeToAst(code);
console.log("ast", ast);


/*AST manipulation*/
var range = ast["body"][0].range;
console.log("actualRange", range);
var extracted = code.substr(range[0],range[1])
console.log("extracted:\n", extracted);

//replace code stubb with actual stuff // experimental , we would not do it like this in the end
var pseudoCodeContainer = {
  module:inputModuleName,
  loc: range
};

code = code.replace("this._ownCodeData = null;", "this._ownCodeData = "+JSON.stringify(pseudoCodeContainer) )
//console.log("bla", code.replace("this._ownCodeData = null;", "pouet pouet")); 


//function entry/exit experiments
functionEntrytracer = esmorph.Tracer.FunctionEntrance(function(fn) {
      var signature;

      return "toto";
       /*if (fn.name !== "ctor") {
        return signature = "this.meta = {\n  lineNumber: " + fn.line + ", \n  range: [ " + fn.range[0] + ", " + fn.range[1] + "]\n}";
      } else {
        return "";
      }*/
    });

functionEndtracer = esmorph.Tracer.FunctionExit(function(fn) {
      var signature;

      return "ze end";
    });

code = esmorph.modify(code, [functionEntrytracer, functionEndtracer])
console.log("Raw esmorph code", code);



