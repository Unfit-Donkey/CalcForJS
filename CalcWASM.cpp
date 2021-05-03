#include <emscripten.h>
#include <emscripten/bind.h>
#include <string.h>
#include <stdarg.h>
extern "C" {
#include "CalcCLI/src/general.h"
#include "CalcCLI/src/arb.h"
#include "CalcCLI/src/compute.h"
#include "CalcCLI/src/functions.h"
#include "CalcCLI/src/parser.h"
#include "CalcCLI/src/help.h"
#include "CalcCLI/src/misc.h"
}
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
    char* out = (char*)malloc(in.length() + 1);
    strcpy(out, in.c_str());
    return out;
}
const char* syntaxNames[] = { "null-","num--","var--","comnt","error","brack","op---","string","comnd","space","escp-","delim","errop","undef","built","custm","arg--","unit-","local","ctrl-","hist-" };
std::string syntax(std::string in) {
    const char* inputcstr = in.c_str();
    char input[strlen(inputcstr) + 1];
    strcpy(input, inputcstr);
    char* colors = highlightLine(input);
    char* out = (char*)calloc(100, 1);
    int outSize = 100;
    int outLen = 0;
    int i = 0;
    int prev = -1;
    int len = strlen(input);
    for(i = 0;i < len;i++) {
        if(colors[i] != prev && colors[i] != 9) {
            if(prev != -1) {
                memcpy(out + outLen, "</span>", 7);
                outLen += 7;
            }
            memcpy(out + outLen, "<span class='syn-00000'>", 24);
            memcpy(out + outLen + 17, syntaxNames[colors[i]], 5);
            outLen += 24;
            prev = colors[i];
        }
        if(input[i] == ' ') { memcpy(out + outLen, "&nbsp;", 6);outLen += 6; }
        else if(input[i] == '>') { memcpy(out + outLen, "&gt;", 4);outLen += 4; }
        else if(input[i] == '<') { memcpy(out + outLen, "&lt;", 4);outLen += 4; }
        else {
            out[outLen] = input[i];
            outLen += 1;
        }
        if(outLen > outSize - 40) out = (char*)recalloc(out, &outSize, 100, 1);
    }
    std::string outStr = std::string(out);
    free(out);
    return outStr + "</span>";
}
char stringPrintBuffer[10000];
int stringPrintPos = 0;
EM_JS(void, printStringBuffer, (const char* buffer), {
    let string = UTF8ToString(buffer);
    document.getElementById("currentString").innerText = string;
    });
EM_JS(void, printNewLine, (), {
    printStringNewLine();

    });
void resetStringPrint() {
    stringPrintPos = 0;
}
void printString(Value string) {
    for(int i = 0;string.string[i] != 0;i++) {
        if(string.string[i] == '\n') {
            stringPrintBuffer[stringPrintPos] = 0;
            printStringBuffer(stringPrintBuffer);
            printNewLine();
            stringPrintPos = 0;
        }
        else if(string.string[i] == '\r') {
            stringPrintPos = 0;
        }
        else if(string.string[i] == '\t') {
            memcpy(stringPrintBuffer + stringPrintPos, "&nbsp;&nbsp;&nbsp;&nbsp;", 24);
            stringPrintPos += 24;
        }
        else {
            stringPrintBuffer[stringPrintPos] = string.string[i];
            stringPrintPos++;
        }
    }
    stringPrintBuffer[stringPrintPos] = 0;
    printStringBuffer(stringPrintBuffer);
}
#pragma endregion
#pragma region Preferences
const bool allowedPreferences[preferenceCount] = { 1,1,0,1 };
EM_JS(void, storePref, (const char* name, const char* value), {
    localStorage.setItem(UTF8ToString(name),UTF8ToString(value));
    });
//Freeing the return value will cause a SIGSEGV, don't know if it leaks or not.
EM_JS(const char*, getPref, (const char* name), {
    return localStorage.getItem(UTF8ToString(name));
    });
void loadPreferences() {
    for(int i = 0;i < preferenceCount;i++) if(allowedPreferences[i]) {
        const char* pref = getPref(preferences[i].name);
        Value val;
        if(pref[0] == 0) val = copyValue(preferences[i].defaultVal);
        else val = calculate(pref, 10);
        if(globalError) {
            error("Error in %s preference", preferences[i].name);
            globalError = false;
        }
        else {
            if(setPreference(preferences[i].name, val, false) == 0) freeValue(val);
        }
    }
}
void savePreferences() {
    for(int i = 0;i < preferenceCount;i++) if(allowedPreferences[i]) {
        char* val = valueToString(preferences[i].current, 10);
        storePref(preferences[i].name, val);
        free(val);
    }
}
void updatePreference(int id) {
    //Use color
    if(id == 0) EM_ASM({ document.getElementById("setting-syntax").checked = $0; }, getR(preferences[id].current) != 0);
    //Dark Mode
    if(id == 1) EM_ASM({ document.getElementById("colorScheme").href = $0 ? "style/dark.css" : "";
    document.getElementById("setting-darkMode").checked = $0; }, getR(preferences[id].current) != 0);
}
void setSetting(std::string name, std::string type) {
    Value val = calculate(type.c_str(), 10);
    if(setPreference(name.c_str(), val, true) == 0) freeValue(val);
}
#pragma endregion
#pragma region Graphing
int aVal = 0;
std::string GLScript;
std::string treeToWebGL(Tree tree) {
    if(tree.optype == optype_localvar) {
        tree.value = globalLocalVariableValues[tree.op];
        tree.op = op_val;
        tree.optype = optype_builtin;
    }
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
        const unsigned char* args = stdfunctions[tree.op].inputs;
        if(args[0] != 0 && args[1] != 0 && args[2] == 0) {
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
    Tree tree = generateTree(eqChar, x, globalLocalVariables, 0);
    free(eqChar);
    free(x);
    std::string webGL = treeToWebGL(tree);
    std::string out = "precision highp float;attribute vec4 vert;uniform vec2 scale;uniform vec2 offset;uniform float pointSize;void main() {gl_PointSize=pointSize;float vx=vert.x*scale.x+offset.x;" + GLScript + "gl_Position=vec4(vert.x,((" + webGL + ")-offset.y)/scale.y,0,1);}";
    freeTree(tree);
    return out;
}
#pragma endregion
#pragma region Help Pages
std::string getHelpContent(int id) {
    std::string content;
    if(pages[id].type == 8) {
        char* generatedContent = getGeneratedPage(pages[id]);
        content = std::string(generatedContent);
        free(generatedContent);
    }
    else content = std::string(pages[id].content);
    std::string header = "<h2>" + std::string(pages[id].name);
    if(pages[id].symbol) header += " - " + std::string(pages[id].symbol);
    header += "</h2>";
    return header + content;
}
std::string pageToSearchEntry(int id) {
    std::string out = "<button class='searchResult' onclick='openHelp(\"" + std::string(pages[id].name) + "\")'>";
    out += std::string(pages[id].name);
    if(pages[id].symbol) out += " - " + std::string(pages[id].symbol);
    out += "<span class='searchResultTags'>";
    if(pages[id].type != 0 && pages[id].type != 8) out += std::string(pageTypes[pages[id].type]) + "<br>";
    return out + "</span></button>";
}
std::string getSearchHTML(std::string query) {
    int* results = searchHelpPages(query.c_str());
    if(results[0] == -1) {
        return "No results";
    }
    int resultCount = 0;
    while(results[resultCount] != -1) resultCount++;
    if(resultCount > 10) resultCount = 10;
    std::string out = "";
    for(int i = 0;i < resultCount;i++) {
        out += pageToSearchEntry(results[i]);
    }
    free(results);
    return out;
}
int bestHelpPageMatch(std::string query) {
    int* results = searchHelpPages(query.c_str());
    int out = results[0];
    free(results);
    return out;
}
#pragma endregion
std::string runLineJS(std::string line) {
    char* input = copyString(line);
    int i;
    globalError = false;
    //Commands
    if(input[0] == '-' && input[1] >= 'a' && input[1] <= 'z') {
        if(startsWith(input, (char*)"-quit")) {
            return "Error: Illegal command";
        }
        if(startsWith(input, (char*)"-f ")) {
            return "Error: Web version does not support the file command";
        }
        char* output = runCommand(input);
        if(globalError) return errorMessage;
        if(output != NULL) {
            std::string out;
            if(output[0] == '$') {
                std::string stdString = std::string(output);
                int eqPos = findNext(output, 0, '=');
                out = stdString.substr(0, eqPos + 1) + syntax(stdString.substr(eqPos + 1, strlen(output) - eqPos - 1));
            }
            else out = std::string(output);
            free(output);
            return out;
        }
        else if(startsWith(input, (char*)"-g")) {
            //Graph
            inputClean(input + 3);
            if(globalError) {
                globalError = false;
                return errorMessage;
            }
            emscripten_run_script((std::string("graphs.push(new GLprog(\"") + std::string(input + 3) + std::string("\"));drawGraph();")).c_str());
            //graphEquation(input+3, -10, 10, 10, -10, 20, 50);
            return "";
        }
        else if(startsWith(input, (char*)"-help")) {
            if(input[5] == ' ') {
                std::string call = ("helpSearch(\"" + std::string(input).substr(6) + "\",null,true)");
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
        int eqPos = isLocalVariableStatement(input);
        if(eqPos != 0) {
            Value out = calculate(input + eqPos + 1, 0);
            if(globalError) return errorMessage;
            char* name = (char*)calloc(eqPos + 1, 1);
            memcpy(name, input, eqPos);
            appendGlobalLocalVariable(name, out);
            char* output = valueToString(out, 10);
            std::string outStr = syntax(output);
            free(output);
            return outStr;
        }
        Value out = calculate(input, 0);
        if(!globalError) {
            appendToHistory(out, 10, false);
            char* ansString = valueToString(out, 10);
            freeValue(out);
            std::string out = "$" + std::to_string(historyCount - 1) + " = " + syntax(std::string(ansString));
            free(ansString);
            return out;
        }
        return errorMessage;
    }
    return "Error: internal - how did we get here?";
}
int main() {
    startup();
    return 0;
}
EMSCRIPTEN_BINDINGS(Functions) {
    function("runLine", &runLineJS);
    function("eqToWebGL", &eqToWebGL);
    function("syntax", &syntax);
    function("bestHelpPageMatch", &bestHelpPageMatch);
    function("getSearchHTML", &getSearchHTML);
    function("getHelpContent", &getHelpContent);
    function("resetStringPrint", &resetStringPrint);
    function("setSetting", &setSetting);
}