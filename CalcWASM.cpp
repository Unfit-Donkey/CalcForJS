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
        if(ignoreError) return;
        //Print error
        char* dest = (char*)calloc(256, 1);
        va_list argptr;
        va_start(argptr, format);
        vsnprintf(dest, 255, format, argptr);
        va_end(argptr);
        //Set error to true
        globalError = true;
        errorMessage = "Error: " + std::string(dest);
        free(dest);
        emscripten_run_script(("console.log(\"" + errorMessage + "\");").c_str());
    };
}
void error(std::string message) {
    if(ignoreError) return;
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
const char* syntaxNames[] = { "null","number","variable","comment","error","bracket","operator","string","command","space","escape","null","errorop","undefined","builtin","custom","argument","unit","local" };
std::string syntax(std::string in) {
    const char* input = in.c_str();
    char* high = highlightSyntax(input);
    char* adv = advancedHighlight(input, high, false, NULL, NULL);
    free(high);
    char* out = (char*)calloc(100, 1);
    int outSize = 100;
    int outLen = 0;
    int i = 0;
    int prev = -1;
    int len = strlen(input);
    for(i = 0;i < len;i++) {
        if(adv[i] != prev && adv[i] != 9) {
            char toAdd[50];
            int addLen = 0;
            if(prev != -1) {
                memcpy(toAdd + addLen, "</span>", 7);
                addLen += 7;
            }
            memcpy(toAdd + addLen, "<span class='syn-", 17);
            addLen += 17;
            const char* type = syntaxNames[adv[i]];
            int typeLen = strlen(type);
            memcpy(toAdd + addLen, type, typeLen);
            addLen += typeLen;
            memcpy(toAdd + addLen, "'>", 2);
            addLen += 2;
            if(addLen + outLen > outSize - 1) {
                out = (char*)realloc(out, outSize + 100);
                memset(out + outSize, 0, 100);
                outSize += 100;
            }
            memcpy(out + outLen, toAdd, addLen);
            outLen += addLen;
            prev = adv[i];
        }
        char toAdd[10];
        if(input[i] == ' ') strcpy(toAdd, "&nbsp;");
        else if(input[i] == '>') strcpy(toAdd, "&gt;");
        else if(input[i] == '<') strcpy(toAdd, "&lt;");
        else {
            toAdd[0] = input[i];
            toAdd[1] = 0;
        }
        int addLen = strlen(toAdd);
        if(outLen + addLen >= outSize - 1) {
            out = (char*)realloc(out, outSize + 100);
            memset(out + outSize, 0, 100);
            outSize += 100;
        }
        memcpy(out + outLen, toAdd, addLen);
        outLen += addLen;
    }
    free(adv);
    std::string outStr = std::string(out);
    free(out);
    return outStr + "</span>";
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
    char** x = (char**)calloc(2, sizeof(char*));
    x[0] = (char*)calloc(2, 1);
    x[0][0] = 'x';
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
    //Commands
    if(input[0] == '-') {
        if(startsWith(input, (char*)"-quit")) {
            return "Error: Illegal command";
        }
        if(startsWith(input, (char*)"-f ")) {
            return "Error: Web version does not support the file command";
        }
        char* output = runCommand(input);
        if(globalError) return errorMessage;
        if(output != NULL) {
            std::string out = std::string(output);
            free(output);
            return out;
        }
        else if(startsWith(input, (char*)"-g")) {
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
        else if(startsWith(input, (char*)"-ls")) {
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
        else if(startsWith(input, (char*)"-unit")) {
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
        else if(startsWith(input, (char*)"-help")) {
            if(input[5] == ' ') {
                std::string call = ("helpSearch(\"" + std::string(input).substr(6) + "\",null,true)");
                emscripten_run_script(("console.log('" + call + "');").c_str());
                emscripten_run_script(call.c_str());
                return "";
            }
            emscripten_run_script("openPanelPage(0)");
            return "";
        }
        else {
            return "Error: command not recognized.";
        }
        return "Error: internal - control flow error";
    }
    //Comments
    if((input[0] == '/' && input[1] == '/') || input[0] == '#') {
        long outSize = 100;
        char* out = (char*)calloc(100, 1);
        int outLen = 0;
        if(out == nullptr) return "Error: Malloc returned nullptr";
        int i = -1;
        while(input[++i] != '\0') {
            if(input[i] == '$' && input[i + 1] == '(') {
                //Find endBracket
                int j = i, endBracket = 0;
                int brackets = 0;
                while(true) {
                    j++;
                    if(input[j] == '\0') return "Error: no ending bracket";
                    if(input[j] == '(') brackets++;
                    if(input[j] == ')') {
                        brackets--;
                        if(brackets == 0) {
                            endBracket = j;
                            break;
                        }
                    }
                }
                if(endBracket == 0) return "Error: no ending bracket";
                i += 2;
                //i is on the start bracket, endBracket is on the closing bracket
                //Copy expression
                int expLen = endBracket - i;
                char expression[expLen + 1];
                expression[expLen] = '\0';
                memcpy(expression, input + i, expLen);
                //Evaluate expression
                Value var = calculate(expression, 0);
                if(globalError) return errorMessage;
                char* varStr = valueToString(var, 10.0);
                freeValue(var);
                //Copy to out
                int varStrLen = strlen(varStr);
                if(outLen + varStrLen > outSize - 3) {
                    out = (char*)realloc(out, outLen + varStrLen + 50);
                    if(out == nullptr) return "Error: Malloc returned nullptr";
                    memset(out + outSize, 0, outLen + varStrLen + 50 - outSize);
                    outSize = outLen + varStrLen + 50;
                }
                strcpy(out + outLen, varStr);
                free(varStr);
                i = endBracket;
                outLen += varStrLen;
            }
            else {
                //Resize allocated area if necessary
                if(outLen == outSize - 2) {
                    out = (char*)realloc(out, outSize + 50);
                    if(out == nullptr) return "Error: Malloc returne nullptr";
                    memset(out + outSize, 0, 50);
                    outSize += 50;
                }
                //Copy character
                outLen++;
                out[outLen - 1] = input[i];
            }
        }
        std::string ret = std::string(out);
        free(out);
        return ret;
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
    function("syntax", &syntax);
}