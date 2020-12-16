function inputOnEnter() {
    var input = document.getElementById("input");
    appendHistory(input.value, Module.runLine(input.value.toString()));
    input.value = "";
}
function keyUp(event) {
    if (event.keyCode == 13 && document.activeElement.id == "input") {
        inputOnEnter();
    }
}
var output, glContext;
function onload() {
    output = document.getElementById("output");
    graph=document.getElementById("graph");
}
function appendHistory(input, outputText) {
    //Clear previous item if an error
    if (output) if (output.children)
        if (output.children[0]) if (output.children[0].classList.contains("errorItem")) {
            output.removeChild(output.children[0]);
        }
    if(outputText=="") return;
    //Create hist element
    var hist = document.createElement("div");
    hist.classList.add("histItem");
    if (outputText.startsWith("Error: ")) {
        hist.classList.add("errorItem");
        outputText = "<span class='error'>" + outputText + "</span>";
    }
    hist.innerHTML = input + "<br>" + outputText + "<br>";
    //append to document
    document.getElementById("output").prepend(hist);
}
//Graphing
var gl;
var graphs=[];
var fs=`
    precision highp float;
    uniform vec3 color;
    void main(void) {
        gl_FragColor=vec4(color,1.0);
    }
`;
class GLprog {
    constructor(eq) {
        if(!gl) initGraph();
        this.vs=GLprog.loadShader(gl,gl.VERTEX_SHADER,Module.eqToWebGL(eq));
        this.fs=GLprog.loadShader(gl,gl.FRAGMENT_SHADER,fs);
        this.prog=gl.createProgram();
        gl.attachShader(this.prog, this.vs);
        gl.attachShader(this.prog, this.fs);
        gl.linkProgram(this.prog);
        this.color=[Math.random(),Math.random(),Math.random()];
    }
    static loadShader(gl,type,source) {
        const shader=gl.createShader(type);
        gl.shaderSource(shader,source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw "Error in "+type+" "+gl.getShaderInfoLog(shader);
        return shader;
    }

}
var glBuffer;
var graph;
var gl;
var attrib = {};
function initGraph() {
    gl=graph.getContext("webgl");
    if(!gl) {
        alert("Your browser does not support WebGL.");
        throw "WebGL not supported";
    }
    let pointCount=document.getElementById("graph").width;
    let arrayBuffer=[];
    for(let i=0;i<pointCount;i++) {
        arrayBuffer.push((i*2/pointCount)-1);
        arrayBuffer.push(0);
    }
    glBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arrayBuffer).buffer,gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
}
var scaleX=2;
var scaleY=1;
var offsetX=0;
var offsetY=0;
function drawGraph() {
    if(!gl) initGraph();
    if(!graphs) throw "No graphs";
    let pointCount=graph.width;
    gl.viewport(0,0,graph.width,graph.height);
    gl.clearColor(1,1,1,1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.lineWidth(3);
    for(let i=0;i<graphs.length;i++) {
        gl.useProgram(graphs[i].prog);
        gl.bindBuffer(gl.ARRAY_BUFFER,glBuffer);
        let coord=gl.getAttribLocation(graphs[i].prog,"vert");
        gl.vertexAttribPointer(coord,2,gl.FLOAT,false,8,0);
        gl.enableVertexAttribArray(coord);
        //Set visuals
        gl.uniform2f(gl.getUniformLocation(graphs[i].prog,"scale"),scaleX,scaleY);
        gl.uniform2f(gl.getUniformLocation(graphs[i].prog,"offset"),offsetX,offsetY);
        gl.uniform1f(gl.getUniformLocation(graphs[i].prog,"pointSize"),2.5);
        gl.uniform3fv(gl.getUniformLocation(graphs[i].prog,"color"),graphs[i].color);
        //Draw lines
        gl.drawArrays(gl.LINE_STRIP,0,pointCount);
    }
}
onload=function() {
    if(!Module.runLine) {
        console.log("If WASM retrieval failed, it is because you are using a local file. You have to host it.");
    }
}