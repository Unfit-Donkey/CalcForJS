# CalcForJS
**CalcForJS** is a JavaScript port of [CalcCLI](https://github.com/Unfit-Donkey/CalcCLI). CalcForJS was made for accessibility and portability. [Try it here!](https://unfit-donkey.github.io/CalcForJS/)


## Project Information
### Building
Navigate to the root directory and run `./build`. This project's dependency is [`emcc`](https://emscripten.org/). This command will produce CalcWASM.js and CalcWASM.wasm as a result.
### Layout
[Calc.c](https://github.com/Unfit-Donkey/CalcCLI) is the core of the project, this repository is basically an extension of CalcCLI. CalcWASM.cpp interfaces with Calc.c and is able to run JavaScript through directly the Emscripten library. Calc.js functions are called from CalcWASM.cpp. Calc.js' role is to interact with the DOM.

Since the emscripten libraries are mostly C++ based and are only compatible with C++'s std::string, the CalcWASM.cpp was needed. CalcWASM.cpp plays a role similar to CalcCLI.c in the original project: creating the user interface.