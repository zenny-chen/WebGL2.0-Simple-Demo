"use strict";

let gl;
let normalProgram;
let whitePlaneProgram;
let grayPlaneProgram;

let rectVAO;

let whitePlaneVAO;

let grayPlaneVAO;

let texName;
let rotDegree = 0.0;
let doAnimation = false;


function getShaderSource(shaderID) {
    return document.getElementById(shaderID).textContent.replace(/^\s+|\s+$/g, '');
}


function createNormalRectangle() {
    
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, getShaderSource("rect_vs"));
    gl.compileShader(vertShader);
    
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, getShaderSource("rect_fs"));
    gl.compileShader(fragShader);
    
    normalProgram = gl.createProgram();
    gl.attachShader(normalProgram, vertShader);
    gl.attachShader(normalProgram, fragShader);
    gl.linkProgram(normalProgram);
    
    const rectVertices = new Float32Array([
                                           0.0, 0.0,    // dummy vertex
                                           -0.4, 0.4,
                                           -0.4, -0.4,
                                           0.4, 0.4,
                                           0.4, -0.4
                                         ]);
    
    const colors = new Float32Array([
                                     0.0, 0.0, 0.0, 0.0,    // dummy vertex
                                     0.9, 0.1, 0.1, 1.0,
                                     0.1, 0.9, 0.1, 1.0,
                                     0.1, 0.1, 0.9, 1.0,
                                     0.1, 0.1, 0.1, 1.0,
                                   ]);
    
    rectVAO = gl.createVertexArray();
    gl.bindVertexArray(rectVAO);
    
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectVertices, gl.STATIC_DRAW);
    
    const posAttr = gl.getAttribLocation(normalProgram, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    
    const colorAttr = gl.getAttribLocation(normalProgram, "colors");
    gl.enableVertexAttribArray(colorAttr);
    gl.vertexAttribPointer(colorAttr, 4, gl.FLOAT, false, 0, 0);
    
    gl.bindVertexArray(null);
}

function createCommonTexture() {
    texName = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texName);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    const image = document.getElementById("texture");
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}

function createWhitePlane() {
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, getShaderSource("white_plane_vs"));
    gl.compileShader(vertShader);
    
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, getShaderSource("white_plane_fs"));
    gl.compileShader(fragShader);
    
    whitePlaneProgram = gl.createProgram();
    gl.attachShader(whitePlaneProgram, vertShader);
    gl.attachShader(whitePlaneProgram, fragShader);
    gl.linkProgram(whitePlaneProgram);
    
    const rectVertices = new Float32Array([
                                           0.0, 0.0,        // dummy vetex
                                           -0.4, 0.4,
                                           -0.4, -0.4,
                                           0.4, 0.4,
                                           0.4, -0.4
                                         ]);
    
    const texCoords = new Float32Array([
                                        0.0, 0.0,           // dummuy vertex
                                        0.0, 0.0,
                                        0.0, 0.336,
                                        0.382, 0.0,
                                        0.382, 0.336]);
    
    whitePlaneVAO = gl.createVertexArray();
    gl.bindVertexArray(whitePlaneVAO);
    
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectVertices, gl.STATIC_DRAW);
    
    const posAttr = gl.getAttribLocation(whitePlaneProgram, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    
    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    
    const texAttr = gl.getAttribLocation(whitePlaneProgram, "textureCoordsInput");
    gl.enableVertexAttribArray(texAttr);
    gl.vertexAttribPointer(texAttr, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindVertexArray(null);
}

function createGrayPlane() {
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, getShaderSource("gray_plane_vs"));
    gl.compileShader(vertShader);
    
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, getShaderSource("gray_plane_fs"));
    gl.compileShader(fragShader);
    
    grayPlaneProgram = gl.createProgram();
    gl.attachShader(grayPlaneProgram, vertShader);
    gl.attachShader(grayPlaneProgram, fragShader);
    gl.linkProgram(grayPlaneProgram);
    
    const rectVertices = new Float32Array([
                                           0.0, 0.0,        // dummy vertex
                                           -0.4, 0.4,
                                           -0.4, -0.4,
                                           0.4, 0.4,
                                           0.4, -0.4
                                         ]);
    
    const texCoords = new Float32Array([
                                        0.0, 0.0,           // dummy vertex
                                        0.4, 0.0,
                                        0.4, 0.382,
                                        0.837, 0.0,
                                        0.837, 0.382]);
    
    grayPlaneVAO = gl.createVertexArray();
    gl.bindVertexArray(grayPlaneVAO);
    
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectVertices, gl.STATIC_DRAW);
    
    const posAttr = gl.getAttribLocation(grayPlaneProgram, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    
    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    
    const texAttr = gl.getAttribLocation(grayPlaneProgram, "textureCoordsInput");
    gl.enableVertexAttribArray(texAttr);
    gl.vertexAttribPointer(texAttr, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindVertexArray(null);
}

function doGLInit()
{
    let canvas = document.getElementById("canvas", {antialias: true});

    canvas.width = 320 * window.devicePixelRatio;
    canvas.height = 320 * window.devicePixelRatio;
    
    gl = canvas.getContext("webgl2");
    if(gl != null) {
        console.log("WebGL 2 context has been established!");
        console.log(`canvas width: ${canvas.width}, canvas height: ${canvas.height}`);
    }
    
    createNormalRectangle();
    createCommonTexture();
    createWhitePlane();
    createGrayPlane();
    
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    
    console.log(`viewport width = ${gl.drawingBufferWidth}, viewport height = ${gl.drawingBufferHeight}`);
    
    gl.clearColor(0.4, 0.5, 0.4, 1.0);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    
    gl.enable(gl.BLEND);
    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function render() {
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // 绘制普通的梯度渐变正方形
    gl.useProgram(normalProgram);
    
    gl.enable(gl.CULL_FACE);
    
    gl.bindVertexArray(rectVAO);
    
    let rotLocation = gl.getUniformLocation(normalProgram, "rotDegree");
    gl.uniform1f(rotLocation, rotDegree);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 1, 4);
    
    gl.disable(gl.CULL_FACE);
    
    // 绘制白色飞机
    gl.useProgram(whitePlaneProgram);
    
    gl.bindVertexArray(whitePlaneVAO);
    
    rotLocation = gl.getUniformLocation(whitePlaneProgram, "rotDegree");
    gl.uniform1f(rotLocation, rotDegree);
    
    let samplerLocation = gl.getUniformLocation(whitePlaneProgram, "texSampler");
    gl.uniform1i(samplerLocation, 0);   // Use texture unit 0
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 1, 4);
    
    // 绘制灰色飞机
    gl.useProgram(grayPlaneProgram);
    
    gl.bindVertexArray(grayPlaneVAO);
    
    rotLocation = gl.getUniformLocation(grayPlaneProgram, "rotDegree");
    gl.uniform1f(rotLocation, rotDegree);

    samplerLocation = gl.getUniformLocation(grayPlaneProgram, "texSampler");
    gl.uniform1i(samplerLocation, 0);   // Use texture unit 0
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 1, 4);
    
    rotDegree += 1.0;
    if(rotDegree >= 360.0) {
        rotDegree = 0.0;
    }
    
    if(doAnimation) {
        requestAnimationFrame(render);
    }
}

function drawMyGLCanvas() {
    if(!doAnimation) {
        doAnimation = true;
        render();
    }
}

function stopDraw() {
    doAnimation = false;
}

