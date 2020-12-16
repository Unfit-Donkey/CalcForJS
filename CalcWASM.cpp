#include <emscripten.h>
#include <emscripten/bind.h>
#include <string.h>
#include <stdarg.h>
#include "CalcCLI/Calc.h"
using namespace emscripten;
#pragma region Line Printing
std::string errorMessage;
extern "C" {
    extern void error(const char* format, ...) {
        //Print error
        char* dest=(char*)calloc(256,1);
        va_list argptr;
        va_start(argptr, format);
        vsnprintf(dest, 255, format, argptr);
        va_end(argptr);
        //Set error to true
        globalError = true;
        errorMessage = "Error: "+std::string(dest);
        free(dest);
        emscripten_run_script(("console.log(\""+errorMessage+"\");").c_str());
    };
}
void error(std::string message) {
    globalError = true;
    errorMessage = "Error: " + message;
    emscripten_run_script(("console.log(\"Error: " + message + "\");").c_str());
}
void error(char* message) {
    error(std::string(message));
}
void printLine(std::string message) {
    emscripten_run_script(("console.log(\"" + message + "\");").c_str());
}
char* copyString(std::string in) {
    char* out = (char*)calloc(in.length() + 1, 1);
    strcpy(out, in.c_str());
    return out;
}
#pragma endregion
#pragma region Graphing
int aVal = 0;
std::string GLScript;
std::string treeToWebGL(Tree tree) {
    if(tree.op == -1) {
        return "vx";
    }
    if(tree.op == op_val) {
        std::string out = std::to_string(tree.value.r);
        if(out.find(".") == std::string::npos) out += ".0";
        return out;
    }
    if(tree.op == op_i) return "0.0";
    if(tree.op == op_neg) return "-(" + treeToWebGL(tree.branch[0]) + ")";
    if(tree.op < 9 && tree.op != op_pow) {
        std::string opName = "";
        if(tree.op == op_mod) opName = "%";
        if(tree.op == op_mult) opName = "*";
        if(tree.op == op_div) opName = "/";
        if(tree.op == op_add) opName = "+";
        if(tree.op == op_sub) opName = "-";
        return "(" + treeToWebGL(tree.branch[0]) + opName + treeToWebGL(tree.branch[1]) + ")";
    }
    if(tree.op < 28) {
        if(stdfunctions[tree.op].argCount == 2) {
            return std::string(stdfunctions[tree.op].name) + "(" + treeToWebGL(tree.branch[0]) + "," + treeToWebGL(tree.branch[1]) + ")";
        }
        return std::string(stdfunctions[tree.op].name) + "(" + treeToWebGL(tree.branch[0]) + ")";
    }
    return "0.0";
}
std::string eqToWebGL(std::string eq) {
    GLScript = "";
    aVal = 0;
    char* eqChar = copyString(eq);
    char** x = (char**)calloc(2,sizeof(char*));
    x[0]=(char*)calloc(2,1);
    x[0][0]='x';
    Tree tree = generateTree(eqChar, x, 0);
    free(eqChar);
    free(x);
    std::string webGL = treeToWebGL(tree);
    std::string out = "precision highp float;attribute vec4 vert;uniform vec2 scale;uniform vec2 offset;uniform float pointSize;void main() {gl_PointSize=pointSize;float vx=vert.x*scale.x+offset.x;" + GLScript + "gl_Position=vec4(vert.x,((" + webGL + ")-offset.y)/scale.y,0,1);}";
    freeTree(tree);
    return out;
}
#pragma endregion
std::string runLineJS(std::string line) {
    char* input = copyString(line);
    int i;
    globalError = false;
    if(input[0] == '-') {
        if(input[1] == 'd' && input[2] == 'e' && input[3] == 'f' && input[4] == ' ') {
            //Define function
            generateFunction(input + 5);
            if(globalError) return errorMessage;
            return "Function defined";
        }
        else if(input[1] == 'd' && input[2] == 'e' && input[3] == 'l' && input[4] == ' ') {
            int strLen = strlen(input);
            if(input[strLen - 1] == '\n') input[strLen - 1] = 0;
            //Delete function or variable
            for(i = 0; i < numFunctions; i++) if(customfunctions[i].name != NULL)
                if(strcmp(input + 5, customfunctions[i].name) == 0) {
                    std::string out = "Function '" + std::string(customfunctions[i].name) + "' has been deleted.";
                    free(customfunctions[i].name);
                    customfunctions[i].name = NULL;
                    customfunctions[i].nameLen = 0;
                    freeTree(*customfunctions[i].tree);
                    customfunctions[i].tree = NULL;
                    customfunctions[i].argCount = 0;
                    return out;
                }
            error("Function '" + std::string(input + 5) + "' not found\n");
            globalError = false;
        }
        else if(input[1] == 'g' && input[2] == ' ') {
            //Graph
            char* cleanInput = inputClean(input + 3);
            if(globalError) {
                globalError = false;
                return errorMessage;
            }
            emscripten_run_script((std::string("graphs.push(new GLprog(\"") + std::string(cleanInput) + std::string("\"));drawGraph();")).c_str());
            //graphEquation(cleanInput, -10, 10, 10, -10, 20, 50);
            free(cleanInput);
            return "";
        }
        else if(input[1] == 'l' && input[2] == 's') {
            //ls lists all user-defined functions
            int num = 0;
            std::string out = "";
            for(i = 0; i < numFunctions; i++) {
                if(customfunctions[i].nameLen == 0) continue;
                num++;
                char* equation = treeToString(*(customfunctions[i].tree), false, customfunctions[i].argNames);
                //Print name
                out += customfunctions[i].name;
                //Print arguments (if it has them)
                if(customfunctions[i].argNames != NULL) {
                    out += "(";
                    int j;
                    for(j = 0;j < customfunctions[i].argCount;j++) {
                        if(j != 0) out += ',';
                        out += std::string(customfunctions[i].argNames[j]);
                    }
                    out += ")";
                }
                //Print equation
                out += " = " + std::string(equation) + "<br>";
                free(equation);
            }
            out += std::string("There ") + std::string(num == 1 ? "is " : "are ") + std::to_string(num) + std::string(" user-defined function") + std::string(num == 1 ? "" : "s") + std::string(".");
            return out;
        }
        else if(input[1] == 'd' && input[2] == 'x' && input[3] == ' ') {
            char* cleanInput = inputClean(input + 4);
            if(globalError) {
                globalError = false;
                return errorMessage;
            }
            char** x=(char**)calloc(2,sizeof(char**));
            x[0]=(char*)calloc(2,1);
            x[0][0]='x';
            Tree ops = generateTree(cleanInput, x, 0);
            free(cleanInput);
            Tree cleanedOps = treeCopy(ops, NULL, true, false, true);
            Tree dx = derivative(cleanedOps);
            Tree dxClean = treeCopy(dx, NULL, false, false, true);
            char* out = treeToString(dxClean, false, x);
            free(x[0]);
            free(x);
            std::string outString = "= " + std::string(out);
            free(out);
            freeTree(cleanedOps);
            freeTree(ops);
            freeTree(dxClean);
            freeTree(dx);
            return outString;
        }
        else if(input[1] == 'b' && input[2] == 'a' && input[3] == 's' && input[4] == 'e') {
            //format: -base(16) 46 will return 2E
            int i, expStart = 0;
            for(i = 5;i < strlen(input);i++) if(input[i] == ' ') {
                expStart = i + 1;
                input[i] = '\0';
                break;
            }
            Value base = calculate(input + 5, 0);
            if(base.r > 36 || base.r < 1) {
                globalError = false;
                return "Error: base out of bounds";
            }
            Value out = calculate(input + expStart, 0);
            if(globalError) return errorMessage;
            appendToHistory(out, base.r, true);
        }
        else if(input[1] == 'd' && input[2] == 'e' && input[3] == 'g' && input[4] == 's' && input[5] == 'e' && input[6] == 't' && input[7] == ' ') {
            if(input[8] == 'r' && input[9] == 'a' && input[10] == 'd') degrat = 1;
            else if(input[8] == 'd' && input[9] == 'e' && input[10] == 'g') degrat = M_PI / 180;
            else if(input[8] == 'g' && input[9] == 'r' && input[10] == 'a' && input[11] == 'd') degrat = M_PI / 200;
            else degrat = getR(calculate(input + 7, 0));
            printf("Degree ratio set to %g\n", degrat);
        }
        else if(input[1] == 'u' && input[2] == 'n' && input[3] == 'i' && input[4] == 't') {
            int i, unitStart = 0;
            for(i = 5;i < strlen(input);i++) if(input[i] == ' ') {
                unitStart = i + 1;
                input[i] = '\0';
                break;
            }
            Value unit = calculate(input + 5, 10);
            Value value = calculate(input + unitStart, 0);
            if(unit.u != value.u) {
                char* unitOne = toStringUnit(unit.u);
                char* unitTwo = toStringUnit(value.u);
                std::string out = "Error: units " + std::string(unitOne) + " and " + std::string(unitTwo) + " are not compatible";
                free(unitOne);
                free(unitTwo);
                return out;
            }
            Value out = valDivide(value, unit);
            char* numString = valueToString(out, 10);
            std::string outString = "= " + std::string(numString) + " " + std::string(input + 5);
            free(numString);
            freeValue(unit);
            freeValue(value);
            freeValue(out);
            return outString;
        }
        else {
            return "Error: command not recognized.";
        }
        return "Error: internal - control flow error";
    }
    //Else compute it as a value
    else {
        Value out = calculate(input, 0);
        if(!globalError) {
            appendToHistory(out, 10, false);
            char* ansString = valueToString(out, 10);
            freeValue(out);
            std::string out = "$" + std::to_string(historyCount - 1) + " = " + std::string(ansString);
            free(ansString);
            return out;
        }
        return errorMessage;
    }
    return "Error: internal - how did we get here?";
}
void setVerboseJS(int v) {
    verbose = v;
}
int main() {
    startup();
    return 0;
}
EMSCRIPTEN_BINDINGS(Functions) {
    function("runLine", &runLineJS);
    function("setVerbose", &setVerboseJS);
    function("eqToWebGL", &eqToWebGL);
}