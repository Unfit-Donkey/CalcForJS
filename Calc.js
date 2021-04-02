/**
 * Opens the help page for name. Ex: openHelp('add')
 */
function openHelp(name) {
    let id = Module.bestHelpPageMatch(name);
    if(id == -1) {
        let message = "couldn't find help page " + name;
        appendHistory("-help " + name, "Error: " + message);
        console.log(message);
        throw message;
    }
    let panel = document.getElementById("helpPageContent");
    panel.innerHTML = Module.getHelpContent(id);
    if(panelPage != 1) openPanelPage(1);
    //Replace syntax tags
    let syn = document.getElementsByTagName("syntax");
    for(let i = 0; i < syn.length; i++) syn[i].innerHTML = getSyntax(syn[i].textContent);
    //Replace help tags
    let help = document.getElementsByTagName("help");
    for(let i = help.length - 1; i > -1; i--) {
        let newEl = document.createElement("a");
        let href = help[i].title;
        if(href == "") href = help[i].textContent;
        newEl.href = "javascript:openHelp('" + href + "');"
        newEl.innerHTML = help[i].innerHTML;
        help[i].parentElement.replaceChild(newEl, help[i]);
    }
}
function helpSearch(query, event) {
    if(event) {
        if(event.key == "Enter") {
            openHelp(query);
            return;
        }
        if(event.key == "Escape") {
            openPanelPage(0);
            return;
        }
    }
    if(panelPage != 2) openPanelPage(2);
    document.getElementById("helpSearchBox").value = query;
    if(query.length < 2 && query != "i") {
        document.getElementById("helpSearchResults").innerHTML = "Query too short";
        return;
    }
    let results = Module.getSearchHTML(query);
    document.getElementById("helpSearchResults").innerHTML = results;
}
function openPanelPage(id) {
    if(panelPage == id) {
        openPanel(false);
        return;
    }
    panelPage = id;
    //Remove Active list
    let activeList = document.getElementsByClassName("activeList")[0];
    if(activeList) activeList.classList.remove("activeList");
    //Hide all pages
    let pages = document.getElementById("panel").children;
    for(let i = 0; i < pages.length; i++) {
        if(i != id) pages[i].style.display = "none";
    }
    //Show new page
    pages[id].style.display = "block";
    //Set new active list
    let newActiveList = pages[id].getElementsByClassName("buttonList")[0]
    if(newActiveList) newActiveList.classList.add("activeList");
    if(!panelIsOpen) openPanel(true);
    //Retrieve settings
    if(id == 3) {
        document.getElementById("setting-darkMode").value = getSetting("useDarkMode");
    }
}
var panelIsOpen = false;
var panelPage = -1;
function openPanel(open = true) {
    panelIsOpen = open;
    if(open) {
        document.getElementById("panel").style.display = "block";
    }
    else {
        document.getElementById("panel").style.display = "none";
        document.getElementById("input").focus();
        panelPage = -1;
    }
    boxResize();
}
function runLine(input) {
    return Module.runLine(input).replace(/(?:\r\n|\r|\n)/g, '<br>');
}
function inputOnEnter() {
    try {
        let out = runLine(getInputText()).replace(/\n/g, "<br>");
        if(out != "") appendHistory(getInputAsHTML(), out);
        input.innerText = "";
    }
    catch(e) {
        appendHistory(input.innerHTML, "Error: A segmentation fault has been reached. Please reload the page. If you would like to, consider reporting it <a href='https://github.com/Unfit-Donkey/CalcForJS/issues'>here</a>.");
    }
    inputSyntax();
}
function keyUp(event) {
    if(event.key == "Enter" && document.activeElement.id == "input") {
        inputOnEnter();
    }
    if(event.key == "Escape") {
        if(panelPage == 0) openPanel(false);
        else if(panelPage == 1) {
            document.getElementById("helpSubPageBack").click();
        }
        else if(panelPage == 2) {
            openPanelPage(0);
        }
    }
}
function keyDown(event) {
    if(event == null) return;
    if(event.key == "ArrowUp" || event.key == "ArrowDown") {
        let list = document.getElementsByClassName("activeList")[0];
        if(list) {
            let index = Array.prototype.indexOf.call(list.children, document.activeElement);
            //If not focused on list
            if(index == -1 && event.key == "ArrowDown") list.children[0].focus();
            //If presses up at list top
            else if(index == 0 && event.key == "ArrowUp") {
                if(list.id == "helpSearchResults") document.getElementById("helpSearchBox").focus();
                return;
            }
            //If presses down at list bottom
            else if(index == list.length - 1 && key == "ArrowDown") {
                return;
            }
            else {
                let newindex = index + (event.key == "ArrowUp" ? -1 : 1);
                list.children[newindex].focus();
            }
        }
        if(document.activeElement.id == "helpSearchBox") {
            document.getElementById("helpSearchResults").children[0].focus();
        }
    }
}
function boxResize() {
    let width = window.innerWidth;
    let box = document.getElementById("box");
    if(panelIsOpen) width -= document.getElementById("panel").clientWidth;
    if(width < 800) {
        if(!box.classList.contains("mobile")) box.classList.add("mobile");
    }
    else {
        if(box.classList.contains("mobile")) box.classList.remove("mobile");
    }
    box.style.width = width + "px";
    box.style.paddingLeft = document.getElementById("panel").clientWidth;
}
var output, input, glContext;
function appendHistory(input, outputText) {
    //Clear previous item if an error
    if(output) if(output.children)
        if(output.children[0]) if(output.children[0].classList.contains("errorItem")) {
            output.removeChild(output.children[0]);
        }
    if(outputText == "") return;
    //Create hist element
    var hist = document.createElement("div");
    hist.classList.add("histItem");
    if(outputText.startsWith("Error: ")) {
        hist.classList.add("errorItem");
        outputText = "<span class='error'>" + outputText + "</span>";
    }
    if(outputText.charAt(0) == '$') {

    }
    if(input.startsWith("//") || input.startsWith("#") || input.startsWith("<span class=\"syn-comment\"")) {
        hist.innerHTML = "<span class='syn-comment'>" + outputText + "</span><br>";
    }
    else hist.innerHTML = input + "<br>" + outputText + "<br>";
    //append to document
    document.getElementById("output").prepend(hist);
}
function settingsLoad() {
    for(let i in settingDefaults) {
        setSetting(i, getSetting(i));
    }
}
function setSetting(name, value) {
    localStorage.setItem(name, value.toString());
    settingCache[name] = value;
    if(name == "useDarkMode") {
        value = eval(value);
        document.getElementById("colorScheme").href = value ? "style/dark.css" : "";
        document.getElementById("setting-darkMode").checked = value;
    }
    if(name == "syntaxHighlight") {
        value = eval(value);
        //inputSyntax();
        document.getElementById("setting-syntax").checked = value;
    }
}
const settingDefaults = {
    "useDarkMode": true,
    "syntaxHighlight": true,
};
var settingCache = {};
function getSetting(name) {
    let out = settingCache[name];
    if(out == undefined) {
        out = localStorage.getItem(name);
        settingCache[name] = out;
    }
    if(typeof out === "undefined" || out == "undefined" || out == null) {
        out = settingDefaults[name];
        settingCache[name] = out;
        return out;
    }
    //Convert booleans from text
    if(typeof settingDefaults != "string") {
        out = eval(out);
    }
    return out;
}
//Graphing
var gl;
var graphs = [];
var fs = `
    precision highp float;
    uniform vec3 color;
    void main(void) {
        gl_FragColor=vec4(color,1.0);
    }
`;
class GLprog {
    constructor(eq) {
        if(!gl) initGraph();
        this.vs = GLprog.loadShader(gl, gl.VERTEX_SHADER, Module.eqToWebGL(eq));
        this.fs = GLprog.loadShader(gl, gl.FRAGMENT_SHADER, fs);
        this.prog = gl.createProgram();
        gl.attachShader(this.prog, this.vs);
        gl.attachShader(this.prog, this.fs);
        gl.linkProgram(this.prog);
        this.color = [Math.random(), Math.random(), Math.random()];
    }
    static loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw "Error in " + type + " " + gl.getShaderInfoLog(shader);
        return shader;
    }

}
var glBuffer;
var graph;
var gl;
var attrib = {};
function initGraph() {
    gl = graph.getContext("webgl");
    if(!gl) {
        alert("Your browser does not support WebGL.");
        throw "WebGL not supported";
    }
    let pointCount = document.getElementById("graph").width;
    let arrayBuffer = [];
    for(let i = 0; i < pointCount; i++) {
        arrayBuffer.push((i * 2 / pointCount) - 1);
        arrayBuffer.push(0);
    }
    glBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayBuffer).buffer, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
var scaleX = 2;
var scaleY = 1;
var offsetX = 0;
var offsetY = 0;
function drawGraph() {
    if(!gl) initGraph();
    if(!graphs) throw "No graphs";
    let pointCount = graph.width;
    gl.viewport(0, 0, graph.width, graph.height);
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.lineWidth(3);
    for(let i = 0; i < graphs.length; i++) {
        gl.useProgram(graphs[i].prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
        let coord = gl.getAttribLocation(graphs[i].prog, "vert");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 8, 0);
        gl.enableVertexAttribArray(coord);
        //Set visuals
        gl.uniform2f(gl.getUniformLocation(graphs[i].prog, "scale"), scaleX, scaleY);
        gl.uniform2f(gl.getUniformLocation(graphs[i].prog, "offset"), offsetX, offsetY);
        gl.uniform1f(gl.getUniformLocation(graphs[i].prog, "pointSize"), 2.5);
        gl.uniform3fv(gl.getUniformLocation(graphs[i].prog, "color"), graphs[i].color);
        //Draw lines
        gl.drawArrays(gl.LINE_STRIP, 0, pointCount);
    }
}
function getSyntax(input) {
    return Module.syntax(input);
}
function inputKeyDown(e) {
    if(e.key == "Backspace" || e.key == "Delete") {
        const sel = window.getSelection().getRangeAt(0);
        let range = getAbsoluteSelection();
        let pos = Math.min(range[0], range[1]);
        if(sel.collapsed) {
            let text = getInputText();
            if(e.key == "Backspace") {
                if(pos == 0) {e.preventDefault(); return;}
                input.innerText = text.slice(0, pos - 1) + text.slice(pos);
                pos -= 1;
            }
            else {
                if(pos == text.length) {e.preventDefault(); return;}
                input.innerText = text.slice(0, pos) + text.slice(pos + 1);
            }
        }
        else sel.deleteContents();
        setAbsoluteSelection(pos);
        inputSyntax();
        e.preventDefault();
    }
}
function getTextSegments(input) {
    if(!input) input = document.getElementById("input");
    const textSegments = [];
    Array.from(input.childNodes).forEach((node) => {
        if(node.nodeType == Node.TEXT_NODE) {
            textSegments.push({text: node.nodeValue, node});
        }
        else if(node.childNodes.length == 1 && node.childNodes[0].nodeType == Node.TEXT_NODE) {
            textSegments.push({text: node.childNodes[0].nodeValue, node: node.childNodes[0]});
        }
        else {
            textSegments.push.apply(textSegments, getTextSegments(node));
        }
    });
    return textSegments;
}
function getInputText() {
    const replaceNBSP = new RegExp(String.fromCharCode(160), "g");
    return input.textContent.replace(replaceNBSP, " ");
}
function getInputAsHTML() {
    if(getSetting("syntaxHighlight")) return input.innerHTML;
    else return input.innerText.replace(/\n/g, "<br>").replace(/(<br>)+/g, "<br>").replace(/<br>$/, "");
}
async function inputSyntax() {
    if(getSetting("syntaxHighlight") == false) return;
    let syntax;
    syntax = getSyntax(getInputText());
    let range = getAbsoluteSelection();
    input.innerHTML = syntax;
    restoreSelection(range[0], range[1]);
}
function getAbsoluteSelection() {
    let sel = window.getSelection();
    const textSegments = getTextSegments(input);
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        if(node === sel.anchorNode) {
            anchorIndex = currentIndex + sel.anchorOffset;
        }
        if(node === sel.focusNode) {
            focusIndex = currentIndex + sel.focusOffset;
        }
        currentIndex += text.length;
    });
    return [anchorIndex, focusIndex];
}
function setAbsoluteSelection(pos, parent = input) {
    for(const node of parent.childNodes) {
        if(node.nodeType == Node.TEXT_NODE) {
            if(node.length >= pos) {
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1;
            } else {
                pos = pos - node.length;
            }
        } else {
            pos = setAbsoluteSelection(pos, node);
            if(pos < 0) {
                return pos;
            }
        }
    }
    return pos;
}
function restoreSelection(absoluteAnchorIndex, absoluteFocusIndex) {
    const textSegments = getTextSegments();
    const sel = window.getSelection();
    let anchorNode = input;
    let anchorIndex = 0;
    let focusNode = input;
    let focusIndex = 0;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        const startIndexOfNode = currentIndex;
        const endIndexOfNode = startIndexOfNode + text.length;
        if(startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
            anchorNode = node;
            anchorIndex = absoluteAnchorIndex - startIndexOfNode;
        }
        if(startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
            focusNode = node;
            focusIndex = absoluteFocusIndex - startIndexOfNode;
        }
        currentIndex += text.length;
    });
    sel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
}
onload = function () {
    if(!Module.runLine) {
        console.log("If WASM retrieval failed, it is because you are using a local file. You have to host it.");
    }
    output = document.getElementById("output");
    graph = document.getElementById("graph");
    input = document.getElementById("input");
    boxResize();
    settingsLoad();
}