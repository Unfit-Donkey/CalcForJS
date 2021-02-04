const helpPageTypes = ["Basic", "Command", "Function", "Unit", "Error", "Guide", "Internals"];
const helpPanel = [
    {name: "info", type: 0, content: "This is a personal project of <a href='https://github.com/Unfit-Donkey'>Benjamin Cates</a>. <a href='https://github.com/Unfit-Donkey/CalcForJS'>CalcForJS</a> is a web port of <a href='https://github.com/Unfit-Donkey/CalcCLI'>CalcCLI</a>. The webport is compiled using the <a href='https://emscripten.org/'>emscripten</a> libraries. CalcCLI is a command line calculator written in C."},
    {name: "number", type: 0, content: "Numbers are mathematical objects used to represent quantities. Numbers are written with arabic numerals in base-10 (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10). For non-integer quantities, use the period (.), for example, five and a half is written as \"5.5\". In some places, commas are used to separate groups of digits, for example, one thousand can be written as 1,000. This type of writting numbers is not supported, as commas are used to separate items in a list. If you prefer to separate digits for readability, use spaces instead because they are ignored.<br> <h4>Bases</h4> See <a href='javascript:openHelp(\"base conversion\")'>base conversion</a> for more info.<br> <h4>Imaginary numbers and units</h4>In this calculator, numbers are internally stored in three components: real, <a href='javascript:openHelp(\"i\")'>imaginary</a>, and <help>units</help>."},
    {name: "operator", type: 0, content: "Operators separate expressions with a function; it is a shorthand notation for the actual function notation. For example, <syntax>a+b</syntax> is shorthand for <syntax>add(a,b)</syntax><table class='tableborder'><thead><tr><td>Name</td><td>Func</td><td>Op</td><td>Order</td></tr></thead><tbody><tr><td>Add</td><td>add</td><td>+</td><td>3rd</td></tr><tr><td>Subtract</td><td>sub</td><td>-</td><td>3rd</td></tr><tr><td>Multiply</td><td>mult</td><td>*</td><td>2nd</td></tr><tr><td>Divide</td><td>div</td><td>/</td><td>2nd</td></tr><tr><td>Modulo</td><td>mod</td><td>%</td><td>2nd</td></tr><tr><td>Exponentiate</td><td>pow</td><td>^ or **</td><td>1st</td></tr></tbody></table>All operators support the negative sign after it, <syntax>4*-3</syntax>, for example."},
    {name: "units", type: 0, content: "This is an automatically generated list of units. Some units support <help>metric prefixes</help>. All units are case-sensitive and are only recognized between the unit brackets, \"[\" and \"]\". This is to avoid potential name overlap between units and custom variables. All units interact via multiplication and division, but adding numbers with different units is not allowed. Internally, units are stored as an array of 8 <help>base units</help>.<br>Examples:<ul><li><syntax>400[W]*10[s]</syntax> = <syntax>4000[J]</syntax></li><li>", },
    {name: "unit list", type: 0, content: "", generationID: 1},
    {name: "base units", tags: ["metric"], type: 0, content: "Each unit in this calculator is stored as an array of base units. In the SI system, there are seven base units, but in this program, the canela is ommitted and replaced with the <help title='b'>bit</help>. Additionally, the unit of <help title='$'>currency</help> is also added in. The exponent of each base unit is represented as an integer from -128 to 127. This allows 8 base units to be fit into a 64-bit integer. If a calculation goes past these ranges, it will overflow (wrap around). Here is a list of base units:<table class='tableborder'><thead><tr><td>Name</td><td>Symbol</td><td>Type</td></tr></thead><tbody><tr><td>Meter</td><td><help>m</help></td><td>Length</td></tr><tr><td>Kilogram</td><td><help>kg</help></td><td>Mass</td></tr><tr><td>Second</td><td><help>s</help></td><td>Time</td></tr><tr><td>Ampere</td><td><help>A</help></td><td>Electric Current</td></tr><tr><td>Kelvin</td><td><help>K</help></td><td>Temperature</td></tr><tr><td>Mole</td><td><help>mol</help></td><td>Substance</td></tr><tr><td>Dollar</td><td><help>$</help></td><td>Currency</td></tr><tr><td>Bit</td><td><help>b</help></td><td>Information</td></tr>"},
    {name: "metric prefixes", type: 0, content: "Units that are equal to their metric base units support metric prefixes. To do this, the unit brackets (\"[\" and \"]\") are case-sensitive. Here is a list of prefixes:<table class='tableborder'><thead><tr><td>Prefix</td><td>Name</td><td>Value</td></tr></thead><tbody><tr><td>Y</td><td>Yotta</td><td>10<sup>24</sup></td></tr><tr><td>Z</td><td>Zeta</td><td>10<sup>21</sup></td></tr><tr><td>E</td><td>Exa</td><td>10<sup>18</sup></td></tr><tr><td>P</td><td>Peta</td><td>10<sup>15</sup></td></tr><tr><td>T</td><td>Tera</td><td>10<sup>12</sup></td></tr><tr><td>G</td><td>Giga</td><td>10<sup>9</sup></td></tr><tr><td>M</td><td>Mega</td><td>1 000 000</td></tr><tr><td>k</td><td>Kilo</td><td>1 000</td></tr><tr><td>Z</td><td>Hecto</td><td>100</td></tr><tr><td>c</td><td>Centi</td><td>0.01</td></tr><tr><td>m</td><td>Milli</td><td>0.001</td></tr><tr><td>u</td><td>Micro</td><td>0.000 001</td></tr><tr><td>n</td><td>Nano</td><td>10<sup>-9</sup></td></tr><tr><td>p</td><td>Pico</td><td>10<sup>-12</sup></td></tr><tr><td>f</td><td>Fempto</td><td>10<sup>-15</sup></td></tr><tr><td>a</td><td>Atto</td><td>10<sup>-18</sup></td></tr><tr><td>z</td><td>Zepto</td><td>10<sup>-21</sup></td></tr><tr><td>y</td><td>Yocto</td><td>10<sup>-24</sup></td></tr>"},
    {name: "base conversion", type: 0, content: "This calculator supports 5 base prefixes, they are listed here: <table class='tableborder'><thead><tr><td>Prefix</td><td>Base</td><td>Name</td></tr></thead><tbody><tr><td>0x</td><td>16</td><td>Hexadecimal</td></tr><tr><td>0d</td><td>10 (default)</td><td>Decimal</td></tr><tr><td>0o</td><td>8</td><td>Octal</td></tr><tr><td>0t</td><td>3</td><td>Ternary</td></tr><tr><td>0b</td><td>2</td><td>Binary</td></tr></tbody></table> Output base with the <help><syntax>-base</syntax></help> command.<h3>Arbitrary Base</h3>The syntax for parsing a number in an arbitrary base is: <em>[{exp}]_{base}</em>. The base can be any positive, real number. Inside the bracket, the digits go 0-9, A-Z (capitalized), this means there is a maximum useful base of 36. If a number starts with a character, it is parsed as a variable or unit, so precede them with a zero. Example: <syntax>[0A1]_16</syntax> = <syntax>161</syntax>. The base can also be an expression inside parenthesis, but it must be a constant, so <syntax>-def a(x)=[10]_x</syntax> will not work.<br>Examples:<br><ul><li><syntax>[10.1]_2.5</syntax> = <syntax>2.9</syntax></li><li><syntax>[1000]_8</syntax> = <syntax>512</syntax></li><li><syntax>[10]_ans</syntx></li><li><syntax>[1011]_(-1)</syntax> = <syntax>3</syntax></li><li><syntax>[0J]_36</syntax> = <syntax>19</syntax></li><li>Note: <syntax>[J]_36</syntax> will be parsed as 1 joule.</ul>"},
    {name: "command", type: 0, content: "All commands start with \"-\". To start an expression with a negative number, precede it with a space.", generationID: 2},
    {name: "comments", type: 0, content: "Comments are notes that you can place in the history. All comments either start with '//' or '#'. Expressions can also be evaluated within comments using the '$()' synatx. Example: \"<syntax>// Energy required: $(500[kW]*3[hr])</syntax>\" will put \"<syntax>// Energy required: 5400000000[J]</syntax>\" into the history."},
    {name: "syntax highlighting", type: 0, content: "Calculator automatically highlights the input syntax. This can be disabled in the settings. When a character or variable is highlighted red, it is invalid; this also applies to unmatched brackets or parenthesis. There are a few edge cases, for example: <syntax>[0A1]_16</syntax> does not account for the base."},
    {name: "functions", tags: ["list"], type: 0, content: "", generationID: 3},
    {name: "custom functions", tags: ["variables"], type: 0, content: "Define with <help><syntax>-def</syntax></help>, Delete with <help><syntax>-del</syntax></help>, List with <help><syntax>-ls</syntax></help>"},
    {name: "anonymous functions", tags: ["lambda", "arrow notation"], type: 0, content: "<strong>Anonymous functions</strong>, also known as lambda funcitons, are created with arrow notation ('=>'). Anonymous functions are written as <em>n=>exp</em>. <em>n</em> can be any valid variable name. For multiple inputs, wrap them in parenthesis and separate by commas, ex: <syntax>(x,y)=>x+y</syntax>. Anonymous functions are only accepted in the <syntax>run</syntax>, <syntax>sum</syntax>, <syntax>product</syntax>, <syntax>fill</syntax>, and <syntax>map</syntax>; passing them to any other builtin-function will return an error. Examples:<br><ul><li><syntax>run((x,y)=>x+y,10,2)</syntax> = <syntax>12</syntax></li><li><syntax>fill(n=>2n,5,1)</syntax> = <syntax>&lt;0,2,4,6,8&gt;</syntax></li><li><syntax>map(<1,2;4,3>,n=>n+1)</syntax> = <syntax>&lt;2,3;5,4&gt;</syntax></li></ul>"},
    {name: "vectors", tags: ["matrix", "matrices"], type: 0, content: "A vector is a list of numbers start with < and end with >, , separate elements, ; separate rows"},
    {name: "-def", tags: ["define", "custom function"], type: 1, content: "The <syntax>-def</syntax> command is used to define custom functions.<br>Syntax:<br><syntax>-def</syntax> {name}{argList}={expression}<br><br>If no argument list is provided, the function will still remain dynamic. Warning: <syntax>-def a=ans-1</syntax> will not behave as you expect. To delete a function, use the <help><syntax>-del</syntax></help> command.<br><br>Examples:<ul><li><syntax>-def m=45</syntax></li><li><syntax>-def npr(n,r)=fact(n)/fact(n-r)</syntax></li><li><syntax>-def getrow(vec,row)=fill(x=>ge(vec,x,row),width(vec),1)</syntax></li></ul>"},
    {name: "-del", tags: ["delete", "undefine", "custom function"], type: 1, content: "Delete custom functions with <syntax>-del</syntax>.<br>Syntax:<br>-del {name}<br><br>To redefine a function, you have to delete it first."},
    {name: "-ls", tags: ["list", "custom function"], type: 1, content: "The <syntax>-ls</syntax> command lists all currently defined custom functions. Custom functions are defined with <a href='javascript:openHelp(\"-def\")'>-def</a> and deleted with <a href='javascript:openHelp(\"-del\")'>-del</a>.", generationID: 4},
    {name: "-degset", tags: ["degree ratio", "degrees", "radians", "gradians"], type: 1, content: "You can convert degrees using the degset command. <syntax>-degset</syntax> accepts four possible inputs:<ul><li>deg (= pi/180)</li><li>rad (= 1)</li><li>grad (= pi/200)</li><li>Custom value (evaluates an expression)</li></ul>The degree ratio changes the outputs of all <a href='javascript:helpSearch(\"trigonometry\")'>trigonometric functions</a>. Examples: <br><syntax>-degset pi/100</syntax> will set it to 200 degrees per circle. <syntax>sin(100)</syntax> will return 0."},
    {name: "-dx", tags: ["derivative", "slope"], type: 1, content: "<sytnax>-dx</syntax> returns the derivative of the input regarding x"},
    {name: "-base", type: 1, content: "<syntax>-base</syntax> returns a number converte to a different base.<br>Syntax:<br>-base{ret} {exp}<br><br>Examples:<br><ul><li><syntax>-base2 100</syntax> = <syntax>1100100</syntax></li><li><syntax>-base3 10</syntax> = <syntax>101</syntax></li></ul>The return type can be any integer from 2 to 36."},
    {name: "-unit", type: 1, content: "Return the second argument converted to the first input.<br>Syntax:<br>-unit{dest} {exp}.<br><br>Examples:<br><ul><li><syntax>-unit[psi] [atm]</syntax> = <syntax>14.69... [psi]</syntax></li><li><syntax>-unit[mi/s] [c]</syntax> = <syntax>186282.397... [mi/s]</syntax></li></ul>For the first argument, the square brackets are not required, but it looks messy."},
    {name: "-g", type: 1, tags: ["graph"], content: "<syntax>-g</syntax> is in experimental mode, do not use it"},
    {name: "-parse", type: 1, content: "The <syntax>-parse</syntax> command returns how the calculator parses an expression. While the majority of the time, -parse returns the same as the input, there are some key differences: \"<syntax>-parse add(1,2)</syntax>\" returns \"<syntax>1+2</syntax>\", \"<syntax>-parse 1*2*3</syntax>\" returns \"<syntax>(1*2)*3)</syntax>\". These minor differences may show how a statement is understood when it can otherwise be ambiguous."},
    {name: "-ratio", tags: ["fraction"], type: 1, content: "The <syntax>-ratio</syntax> command appends a number or vector to history and prints it as a ratio. It uses continued fractions to estimate a ratio. If the contnued fraction does not terminate before 20 digits, it will print the number as a decimal. If the numerator is greated than the denominator, it will print it as a mixed number."},
    {name: "-factors", tags: ["-factor", "prime"], type: 1, content: "The <syntax>-factors</syntax> command (also known as <syntax>-factor</syntax>) reports the prime factors of a number. The command will only run for 32-bit integers, meaning numbers greater than 2 000 000 000 are not supported. The command will either report that the number is prime, or the list of factors that make it. <br>Examples:<ul><li><syntax>-factors 1504</syntax> = <syntax>2^5 * 47</syntax></li></ul>"},
    {name: "-help", type: 1, content: "<strong>-help {name}</strong> opens the help page that most closely resembles name. If no name is provided, the main help menu is opened."},
    {name: "i", type: 2, tags: ["imaginary number"], content: "<syntax>i</syntax> is the imaginary number, equal to the square root of <syntax>-1</syntax>."},
    {name: "neg", type: 2, tags: ["negate", "negative"], content: "<syntax>neg</syntax>(a) returns the negative of a. It is identical to -a.", arguments: ["a"]},
    {name: "pow", type: 2, tags: ["exponent", "power"], content: "<syntax>pow</syntax>(a,b) returns a to the power of b. <em>pow(a,b)</em> is equivalent to a^b.", arguments: ["a", "b"]},
    {name: "mod", type: 2, tags: ["modulo", "modulus"], content: "<strong>mod(a,b)</strong> returns the remainder of a/b. It is equivalent to a%b.", arguments: ["a", "b"]},
    {name: "mult", type: 2, tags: ["multiply", "product"], content: "<strong>mult(a,b)</strong> returns a multiplied by b, equivalent to a*b.", arguments: ["a", "b"]},
    {name: "div", type: 2, tags: ["divide", "quotient"], content: "<strong>div(a,b)</strong> returns a divided by b. Can also be written as a/b.", arguments: ["a", "b"]},
    {name: "add", type: 2, tags: ["addition", "plus", "sum"], content: "<strong>add(a,b)</strong> returns the sum of <em>a</em> and <em>b</em>. <strong>add</strong> is identical to the <em>+</em> operator", arguments: ["a", "b"]},
    {name: "sub", type: 2, tags: ["subtraction", "minus", "difference"], content: "<strong>sub(a,b)</strong> returns the difference of a and b. It can also be written as a-b.", arguments: ["a", "b"]},

    {name: "sin", type: 2, tags: ["sine", "trigonometry"], content: "<strong>sin(x)</strong> returns the sine of <em>x</em>. Note: The output of <em>sin</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "cos", type: 2, tags: ["cosine", "trigonometry"], content: "<strong>cos(x)</strong> returns the cosine of <em>x</em>. <em>cos(x)</em> is equivalent to <em><help>sin</help>(<help>pi</help>-x)</em>. Note: The output of <em>cos</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "tan", type: 2, tags: ["tangent", "trigonometry"], content: "<strong>tan(x)</strong> returns the tangent of <em>x</em>. <em>tan(x)</em> is equivalent to <em><help>sin</help>(x)/<help>cos</help>(x)</em>. Note: The output of <em>tan</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},

    {name: "sec", type: 2, tags: ["secant", "trigonometry"], content: "<strong>sec(x)</strong> returns the secant of <em>x</em>. This is equivalent to <em>1/<help>cos</help>(x)</em>. Note: The output of <em>sec</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "csc", type: 2, tags: ["cosecant", "trigonometry"], content: "<strong>csc(x)</strong> returns the cosecant of <em>x</em>. <em>csc(x)</em> is equivalent to <em>1/<help>sin</help>(x)</em>. Note: The output of <em>csc</em> is affected by the <help>degree ratio</help>.", arguments: ["x"]},
    {name: "cot", type: 2, tags: ["cotangent", "trigonometry"], content: "<strong>cot(x)</strong> returns the cotangent of <em>x</em>. <em>cot(x)</em> is equivalent to <em><help>cos</help>(x)/<help>sin</help>(x)</em>. Note: The output of <em>cot</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},

    {name: "sinh", type: 2, tags: ["hyperbolic sine", "trigonometry"], content: "<strong>sinh(x)</strong> returns the hyperbolic sine of <em>x</em>. <em>sinh(x)</em> is equivalent to <em>-i * <help>sin</help>(i*x)</em>, and <em>(<help>exp</help>(x)-exp(-x))/2</em>. Note: The output of <em>sinh</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "cosh", type: 2, tags: ["hyperbolic cosine", "trigonometry"], content: "<strong>cosh(x)</strong> returns the hyperbolic cosine of <em>x</em>. <em>cosh(x)</em> is equivalent to <em><help>cos</help>(i*x)</em>, and <em>(<help>exp</help>(x)+exp(-x))/2</em>. Note: The output of <em>cosh</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "tanh", type: 2, tags: ["hyperbolic tangent", "trigonometry"], content: "<strong>tanh(x)</strong> returns the hyperbolic tangent of <em>x</em>. <em>tanh(x)</em> is equivalent to <em><help>sinh</help>(x)/<help>cosh</help>(x)</em>. Note: The output of <em>tanh</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},

    {name: "asin", type: 2, tags: ["arcsine", "inverse sine", "trigonometry"], content: "<strong>asin(x)</strong> returns the inverse sine of <em>x</em>. Note: The output of <em>asin</em> is affected by the <help tile='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "acos", type: 2, tags: ["arccosine", "inverse cosine", "trigonometry"], content: "<strong>acos(x)</strong> returns the inverse cosine of <em>x</em>. Note: The output of <em>acos</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "atan", type: 2, tags: ["arctangent", "inverse tangent", "trigonometry"], content: "<strong>atan(x)</strong> returns the inverse tangent of <em>x</em>. Note: The output of <em>atan</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},

    {name: "asec", type: 2, tags: ["arcsecant", "inverse secant", "trigonometry"], content: "<strong>asec(x)</strong> returns the inverse secant of <em>x</em>. Note: The output of <em>sec</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "acsc", type: 2, tags: ["arccosecant", "inverse cosecant", "trigonometry"], content: "<strong>acsc(x)</strong> returns the inverse cosecant of <em>x</em>. Note: The output of <em>acsc</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "acot", type: 2, tags: ["arccotangent", "inverse cotangent", "trigonometry"], content: "<strong>acot(x)</strong> returns the inverse cotangent of <em>x</em>. Note: The output of <em>cot</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},

    {name: "asinh", type: 2, tags: ["hyperbolic arcsine", "inverse hyperbolic sine", "trigonometry"], content: "<strong>asinh(x)</strong> returns the inverse hyperbolic sine of <em>x</em>. Note: The output of <em>sinh</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "acosh", type: 2, tags: ["hyperbolic arccosine", "inverse hyperbolic cosine", "trigonometry"], content: "<strong>acosh(x)</strong> returns the inverse hyperbolic cosine of <em>x</em>. Note: The output of <em>cosh</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},
    {name: "atanh", type: 2, tags: ["hyperbolic arctangent", "inverse hyperbolic tangent", "trigonometry"], content: "<strong>atanh(x)</strong> returns the inverse hyperbolic tangent of <em>x</em>. Note: The output of <em>tanh</em> is affected by the <help title='degset'>degree ratio</help>.", arguments: ["x"]},

    {name: "sqrt", type: 2, tags: ["square root"], content: "<strong>sqrt(x)</strong> returns the square root of <em>x</em>. It is equivalent to <em>x^0.5</em>.", arguments: ["x"]},
    {name: "cbrt", type: 2, tags: ["cube root"], content: "<strong>cbrt(x)</strong> returns the cube root of <em>x</em>. It is equivalent to <em>x^(1/3)</em>.", arguments: ["x"]},
    {name: "exp", type: 2, tags: ["exponent"], content: "<strong>exp(x)</strong> returns <em>e^x</em>. It is the inverse of <help>ln</help>", arguments: ["x"]},
    {name: "ln", type: 2, tags: ["natural logarithm"], content: "<strong>ln(x)</strong> returns the natural logarithm of <em>x</em>. It is equivalent to <em>log(x,e)</em>. <strong>ln</strong> is the inverse function of <help>exp</help>", arguments: ["x"]},
    {name: "logten", type: 2, tags: ["logarithm"], content: "<strong>logten(x)</strong> returns the log—base 10 of x, It is equivalent to <em>log(x,10)</em>", arguments: ["x"]},
    {name: "log", type: 2, tags: ["logarithm"], content: "<strong>log(x,b)</strong> returns the log of <em>x</em>, base b. It is equivalent to <em>ln(x)/ln(b)</em>.", arguments: ["x", "b"]},
    {name: "fact", type: 2, tags: ["factorial"], content: "<strong>fact(x)</strong> returns the factorial of <em>x</em>. The notation <em>x!</em> is not supported. The factorial of negative integers is not defined.", arguments: ["x"]},
    {name: "sgn", type: 2, tags: ["sign", "step"], content: "<strong>sgn(x)</strong> returns the sign of <em>x</em>. More specifically, <em>sgn(x)</em> is equivalent to <em>x/abs(x)</em>.", arguments: ["x"]},
    {name: "abs", type: 2, tags: ["absolute value"], content: "<strong>abs(x)</strong> returns the absolute value of <em>x</em>. This is defined as the distance of the value from zero. Vectors and complex numbers are accepted.", arguments: ["x"]},
    {name: "arg", type: 2, tags: ["argument"], content: "<strong>arg(x)</strong> returns the argument of <em>x</em>. The argument of a complex number is the angle from the positive real axis.<br><h3>Examples:</h3><br><syntax>arg(1)</syntax> = <syntax>0</syntax><br><syntax>arg(i)</syntax> = <syntax>pi/2</syntax><br><syntax>arg(-2)</syntax> = <syntax>pi</syntax></em>", arguments: ["x"]},
    {name: "round", type: 2, tags: [], content: "<strong>round(x)</strong> returns x rounded to the nearest integer. If x is an integer plus .5, x is rounded up, in that case with a negative number, it is rounded down. For imaginary numbers and vectors, each component is treated separately.", arguments: ["x"]},
    {name: "floor", type: 2, tags: ["round down"], content: "<strong>floor(x)</strong> returns <em>x</em> rounded down to the nearest integer. <em>floor</em> rounds towards negative infinity, so negative numbers are different. For imaginary numbers and vectors, each component is treated separately.", arguments: ["x"]},
    {name: "ceil", type: 2, tags: ["ceiling", "round up"], content: "<strong>ceil(x)</strong> returns <em>x</em> rounded up to the nearest integer. <em>ceil</em> rounds towards positive infinity, so negative numbers are treated differently. For imaginary numbers and vectors, each component is treated separately.", arguments: ["x"]},
    {name: "getr", type: 2, tags: ["get real", "real component"], content: "<strong>getr(x)</strong> returns <em>x</em> stripped of the imaginary and unit components. For vectors, a vector is returned with <em>getr</em> called on each element.", arguments: ["x"]},
    {name: "geti", type: 2, tags: ["get imaginary", "imaginary component"], content: "<strong>geti(x)</strong> returns <em>x</em> stripped of the real and unit components. For vectors, a vector is returned with <em>geti</em> called on each element.", arguments: ["x"]},
    {name: "getu", type: 2, tags: ["get unit", "unit component"], content: "<strong>getu(x)</strong> returns <em>x</em> stripped of the numeric components. That means it returns <em>1</em> multiplied by <em>x</em>'s <help>unit</help>. For vectors, a vector is returned with <em>getu</em> called on each element.", arguments: ["x"]},
    {name: "grthan", type: 2, tags: ["greater than", "comparison"], content: "<strong>grthan(a,b)</strong> returns <em>1</em> if the real component of <em>a</em> is greater than the real component of <em>b</em>. For vectors, a vector is returned with the result of each comparison.<br>Example:<br><syntax>grthan(&lt;5,10&gt;,&lt;10,5&gt;)</syntax> = <syntax>&lt;0,1&gt;</syntax>", arguments: ["a", "b"]},
    {name: "equal", type: 2, tags: ["comparison"], content: "<strong>equal(a,b)</strong> returns <em>1</em> only if both are exactly equal. Otherwise <em>equal</em> returns 0.", arguments: ["a", "b"]},
    {name: "min", type: 2, tags: ["minimum", "comparison"], content: "<strong>min(a,b)</strong> returns the smaller of the two inputs. For vectors, a new vector is returned with <em>min</em> called on each element.", arguments: ["a", "b"]},
    {name: "max", type: 2, tags: ["maximum", "comparison"], content: "<strong>max(a,b)</strong> returns the larger of the two inputs. For vectors, a new vector is returned with <em>max</em> called on each element.", arguments: ["a", "b"]},
    {name: "lerp", type: 2, tags: ["interpolation"], content: "<strong>lerp(a,b,d)</strong> returns <em>a</em> if <em>d</em> equals 0 and <em>b</em> if <em>d</em> equals 1. The rest of the values of <em>d</em> are <em>interpolated</em>.<br>Examples:<br><syntax>lerp(0,1,0.5)</syntax> = <syntax>0.5</syntax><br><syntax>lerp(&lt;10,5&gt;,&lt;1,2&gt;,1/3)</syntax> = <syntax>&lt;7,4&gt;</syntax>", arguments: ["a", "b", "d"]},
    {name: "dist", type: 2, tags: ["distance"], content: "<strong>dist(a,b)</strong> returns the distance between <em>a</em> and <em>b</em>. Complex numbers are treated as an extra dimension.", arguments: ["a", "b"]},
    {name: "not", type: 2, tags: ["binary operation"], content: "<strong>not(a)</strong> returns the binary not of <em>a</em>. First, <em>a</em> is rounded down towards zero, then the binary not operation is applied. This operation is equivalent to <em>-a-1</em> for integer <em>a</em>. The complex component is ignored.", arguments: ["a"]},
    {name: "and", type: 2, tags: ["binary and"], content: "<strong>and(a,b)</strong> returns the binary and of <em>a</em> and <em>b</em>. The integers are in two's complement, so <em>and(-1,x)</em> returns <em>x</em>. The complex component is calculated separately, and vectors are not supported.", arguments: ["a", "b"]},
    {name: "and", type: 2, tags: ["binary or"], content: "<strong>or(a,b)</strong> returns the binary or of <em>a</em> and <em>b</em>. The integers are in two's complement, so <em>or(-1,x)</em> returns <em>-1</em>. The complex component is calculated separately, and vectors are not supported.", arguments: ["a", "b"]},
    {name: "and", type: 2, tags: ["binary xor"], content: "<strong>xor(a,b)</strong> returns the binary <strong>exclusive or</strong> of <em>a</em> and <em>b</em>. The integers are in two's complement, so <em>xor(-1,x)</em> returns <em>not(x)</em>. <br>Examples:<br><em>xor(0,0) = 0<br>xor(1,0) = 1<br>xor(0,1) = 1<br>xor(1,1) = 0<br></em>The complex component is calculated separately, and vectors are not supported.", arguments: ["a", "b"]},
    {name: "ls", type: 2, tags: ["binary left shift"], content: "<strong>ls(x,n)</strong> returns <em>x</em> left-shifted <em>n</em> times. It is equivalent to <syntax>floor(x)*2^floor(n)</syntax>. For negative numbers, the sign is retained.", arguments: ["x", "n"]},
    {name: "rs", type: 2, tags: ["binary right shift"], content: "<strong>rs(x,n)</strong> returns <em>x</em> right-shifted <em>n</em> times. It is equivalent to <syntax>floor(floor(x)/2^floor(n))</syntax>. For negative numbers, the sign is retained.", arguments: ["x", "n"]},
    {name: "pi", type: 2, content: "<strong>Pi</strong> is the ratio between the circumference of a circle and its diameter. It is equal to approximately 3.141592653589."},
    {name: "phi", type: 2, tags: ["golden ratio", "ϕ", "φ"], content: "<strong>Phi</strong> (has the symbol φ or ϕ) is the golden ratio. It is equal to <syntax>(1+sqrt(5))/2</syntax>. Phi is the only constant where (a+b)/a = a/b. More aptly: <syntax>phi</syntax> = <syntax>1+1/phi</syntax>. The value of phi is approximately 1.618033988749."},
    {name: "e", type: 2, tags: ["euler's number"], content: "<strong>e</strong> is Euler's number. It is the base in <help>exp</help>, and the base in <help>ln</help>. <em>e</em> has many applications in the real world, and its value is approximately 2.718281828459."},
    {name: "ans", type: 2, tags: ["previous answer"], content: "<strong>ans</strong> returns the previous value that was calculated. it is equivalent to <syntax><help>hist</help>(-1)</syntax>."},
    {name: "hist", type: 2, tags: ["history", "previous answer"], content: "<strong>hist(n)</strong> returns the <em>n</em>th value in the history. For negative <em>n</em>, <em>hist</em> returns <syntax>hist(<help>histnum</help>+n)</syntax>. For example, <syntax>hist(-1)</syntax> returns the previous value. Anything outside of the range of the calculation history will give an error.", arguments: ["n"]},
    {name: "histnum", type: 2, tags: ["history count"], content: "<strong>histnum</strong> returns the number of items in the history. <em>histnum</em> is also equal to the history index of the current calculation, so calling <em>histnum</em> as the first calculation will return zero."},
    {name: "rand", type: 2, tags: ["random"], content: "<strong>rand</strong> returns a random number between <em>0</em> and <em>1</em>"},
    {name: "run", type: 2, tags: ["anonymous function"], content: "<strong>run(func,...)</strong> returns the result of func run with the next inputs. For example <syntax>run(n=>(n+1),3)</syntax> returns 4. The first input of run must be an anonymous function.", args: ["func", "..."]},
    {name: "sum", type: 2, tags: ["summation", "add"], content: "<strong>sum(func,start,end,step)</strong> returns the summation of a series. It is exactly identical to this script:<br><strong> out = 0<br>for(i=start;i&lt;end;i+=step) out+=run(func,i);<br>return out;<br></strong>This function supports vectors as outputs.", arguments: ["func", "start", "end", "step"]},
    {name: "product", type: 2, tags: ["multiply"], content: "<strong>product(func,start,end,step)</strong> returns the product of a series. It is exactly identical to this script:<br><strong> out = 1<br>for(i=start;i&lt;end;i+=step) out*=run(func,i);<br>return out;<br></strong>This function supports vectors as outputs.", arguments: ["func", "start", "end", "step"]},
    {name: "width", type: 2, tags: ["vector width"], content: "<strong>width(vec)</strong> returns the width of the vector <em>vec</em>. <em>width</em> returns 1 if <em>vec</em> is not a vector.", arguments: ["vec"]},
    {name: "height", type: 2, tags: ["vector height"], content: "<strong>height(vec)</strong> returns the height of the vector <em>vec</em>. <em>height</em> returns 1 if <em>vec</em> is not a vector.", arguments: ["vec"]},
    {name: "length", type: 2, tags: ["element count", "vector length"], content: "<strong>length(vec)</strong> returns the total number of elements in <em>vec</em>. It is equivalent to <em><help>height</help>(vec)*<help>length</help>(vec)</em>. For non-vector values, <em>length</em> returns 1.", arguments: ["vec"]},
    {name: "ge", type: 2, tags: ["get element"], content: "<strong>ge(vec,x,<em>y</em>)</strong> returns the element in vec at position <em>x,y</em>. If no <em>y</em> is supplied, it compresses <em>vec</em> into a one-dimensional list. The arguments <em>x</em> and <em>y</em> start at zero, so <syntax>ge(vec,0,0)</syntax> will return the top left corner of <em>vec</em>.", arguments: ["vec", "x", "<em>y</em>"]},
    {name: "fill", type: 2, tags: ["fill vector"], content: "<strong>fill(func,width,<em>height</em>)</strong> returns a vector filled with the expression or constant <em>func</em>. <em>func</em> can be either a constant, or an <help>anonymous function</help> with two inputs. <em>height</em> is optional and will default to 1.<br>Examples:<br><syntax>fill(1,2,3)<syntax> = <syntax>&lt;1,1;1,1;1,1&gt;</syntax><br><syntax>fill((x,y)=>(x*y),3,3)</syntax> = <syntax>&lt;0,0,0;0,1,2;0,2,4&gt;</syntax></em>", arguments: ["func", "width", "<em>height</em>"]},
    {name: "map", type: 2, tags: ["map vector"], content: "<strong>map(vec,func)</strong> will return a new vector where each element of <em>vec</em> has passed through the <help>anonymous function</help> <em>func</em>. <em>func</em> can have up to five inputs, but only one is required.<br>Func inputs:<br><ol><li>v - the value of the cell</li><li>x - the x coordinate of the cell</li><li>y - the y coordinate</li><li>i - the index (v=ge(vec,i))</li><li>vec - the entire vector</li></ol><br>Examples:<br><syntax>map(&lt;1,4,2&gt;,n=>(n+1))</syntax> = <syntax>&lt;2,5,3&gt;</syntax>."},
    {name: "det", type: 2, tags: ["determinant"], content: "<strong>det(mat)</strong> returns the determinant of <em>mat</em> as if it was a <help>matrix</help>. Only square matrices (where width and height are equal) are accepted.", arguments: ["mat"]},
    {name: "transpose", type: 2, content: "<strong>transpose(vec)</strong> will return <em>vec</em> with the cells transposed across the x=y axis. More aptly, this returns a <help>vector</help> with the x and y axis swaped.<br>Examples:<br><syntax>transpose(&lt;1,2&gt;)</syntax> = <syntax>&lt;1;2&gt;</syntax><br><syntax>transpose(&lt;1,2;3,4&gt;)</syntax> = <syntax>&lt;1,3;2,4&gt;</syntax></em><br>Notice how any values on the diagonal axis do not move.", arguments: ["vec"]},
    {name: "mat_mult", type: 2, tags: ["matrix multiply"], content: "<strong>mat_mult(a,b)</strong> returns the <help>matrix</help> multiplication of <em>a</em> and <em>b</em>. The width of <em>a</em> must equal the height of <em>b</em>. The result with have the height of <em>a</em> and the width of <em>b</em>. Matrix multiplication is not commutative.", arguments: ["a", "b"]},
    {name: "mat_inv", type: 2, tags: ["matrix inverse"], content: "<strong>mat_inv(mat)</strong> returns the inverse of <em>mat</em> as a matrix.", arguments: ["mat"]},
    {name: "m", type: 3, tags: ["meter", "metre", "length", "distance"], content: "<syntax>[m]</syntax> is the metric unit of length known as the meter, or metre. The meter supports metric prefixes for things like <em>km</em> or <em>cm</em>."},
    {name: "kg", type: 3, tags: ["kilogram", "mass", "weight"], content: "<syntax>[kg]</syntax>, or kilogram, is the metric unit of mass. Despite having the kilo prefix, the kilogram is the <help>base unit</help>. The gram, or <syntax>[g]</syntax> is translated to <syntax>0.001[kg]</syntax>. The gram supports all <help>metric prefixes</help>."},
    {name: "s", type: 3, tags: ["second", "time", "duration"], content: "<syntax>[s]</syntax>, or second, is the metric unit of time. Originally, the second was defined as a fraction of a day. Now, it is defined based on atomic clocks. The second supports all <help>metric prefixes</help>."},
    {name: "A", type: 3, tags: ["amp", "ampere", "electrical flow"], content: "<syntax>[A]</syntax>, or Amp, is the metric unit of electrical flow. It is one of the seven <help>base units</help>. The amp is defined as approximately 6.24 quintillion elementary charges per second. The Ampere supports all <help>metric prefixes</help>."},
    {name: "K", type: 3, tags: ["kelvin", "temperature"], content: "<syntax>[K]</syntax>, or Kelvin, is the metric unit of temperature. The Kelvin scale is equal in spacing to the Celsius scale, except 0° K is equal to absolute zero. The Kelvin unit supports all <help>metric prefixes</help>."},
    {name: "mol", type: 3, tags: ["mole", "substance"], content: "<syntax>[mol]</syntax>, or mole, is the metric unit of substance. It is defined as 6.02214076×10<sup>23</sup> particles. The mole supports all <help>metric prefixes</help>."},
    {name: "$", type: 3, tags: ["dollar", "currency"], content: "<syntax>[$]</syntax>, or dollar, is the non-standard <help>base unit</help> unit of currency. The dollar unit is not a specific type of currency, so it does not specify an exact quantity."},
    {name: "b", type: 3, tags: ["bit", "information"], content: "<syntax>[b]</syntax>, or bit, is an extended <help>base unit</help>. It is defined as the information required to describe a situation with 2 possiblities. The bit supports all <help>metric prefixes</help>."},
    {name: "B", type: 3, tags: ["byte", "information"], content: "<syntax>[B]</syntax>, or byte, is equal to 8 <a href='javascript:openHelp(\"b\")'>bits</a>. It supports all metric prefixes."},
    {name: "bps", type: 3, tags: ["bits per second", "information flow"], content: "<syntax>[bps]</syntax>, or <help title='b'>bits</help> per <help title='s'>second</help>, is a unit of information flow. <syntax>[bps]</syntax> supports all <help>metric prefixes</help>, allowing for: kbps (kilobits per second), mbps (megabits per second), and others."},
    {name: "Bps", type: 3, tags: ["bytes per second", "information flow"], content: "<syntax>[Bps]</syntax>, or <help title='B'>bytes</help> per <help title='s'>second</help> (not to be confused with <help title='bps'>bits per second</help>, is a unit of information flow equal to 8 bits per second. Bytes per second supports all <help>metric prefixes</help>."},
    {name: "J", type: 3, tags: ["joule", "energy"], content: "<syntax>[J]</syntax>, or joule, is the metric unit of energy. It is equal to the force of one <help title='N'>Newton</help> applied over one <help title='m'>meter</help>. Its base units are m<sup>2</sup>*kg*s<sup>-2</sup>. Joule supports all <help>metric prefixes</help>."},
    {name: "W", type: 3, tags: ["watt", "power"], content: "<syntax>[W]</syntax>, or watt, is the metric unit of power. It is equal to one <help title='J'>joule</help> per <help title='s'>second</help>. The base units of the watt are: m<sup>2</sup>*kg*s<sup>-3</sup>. The watt supports all <help>metric prefixes</help>."},
    {name: "V", type: 3, tags: ["volt", "electric potential"], content: "<syntax>[V]</syntax>, or volt, is the metric unit of electric potential. It is equal to both a <help title='J'>joule</help> per <help title='C'>coloumb</help>, and a <help title='W'>watt</help> per <help title='A'>amp</help>. The base units of the volt are: m<sup>2</sup>*kg*s<sup>-3</sup>*A<sup>-1</sup>. The volt supports all <help>metric prefixes</help>."},
    {name: "ohm", type: 3, tags: ["ohm", "electric resistance"], content: "<syntax>[ohm]</syntax> is the unit of electric resistance. The symbol for the ohm is Ω, but it is impractical to type. The ohm is equal to one <help title='V'>volt</help> per <help title='A'>amp</help>. The base units of the ohm are: m<sup>2</sup>*kg*s<sup>-3</sup>*A<sup>-2</sup>. The ohm supports all <help>metric prefixes</help>."},
    {name: "H", type: 3, tags: ["henry", "electric inductance"], content: "<syntax>[H]</syntax>, or henry, is the metric unit of inductance. It is equal to one <help title='Wb'>Weber</help> per <help title='A'>Amp</help>, and an Ohm-second. The base units of the henry are: m<sup>2</sup>*kg*s<sup>-2</sup>*A<sup>-2</sup>. The henry supports all <help>metric prefixes</help>."},
    {name: "Wb", type: 3, tags: ["weber", "magnetic flux"], content: "<syntax>[Wb]</syntax>, or weber, is the metric unit of magnetic flux. The weber is equal to one <help title='J'>joule</help> per <help title='A'>Amp</help>, or <help title='V'>Volt</help>-<help title='s'>second</help>. The base units of the weber are: m<sup>2</sup>*kg*s<sup>-2</sup>*A<sup>-1</sup>. Weber supports all <help>metric prefixes</help>."},
    {name: "Hz", type: 3, tags: ["hertz", "frequency"], content: "<syntax>[Hz]</syntax>, or hertz, is the metric unit of frequency equal to one per <help title='s'>second</help>. Its base units are: s<sup>-1</sup>. Hertz supports all <help>metric prefixes</help>."},
    {name: "S", type: 3, tags: ["siemens", "electric conductance"], content: "<syntax>[S]</syntax>, or siemens, is the metric unit of electric conductance. It is equal to the inverse of the <help>ohm</help>, or one <help title='A'>Amp</help> per <help title='V'>volt</help>. Another name for siemens is the mho, which is ohm spelled backwards. The base unit of siemens are: m<sup>-2</sup>*kg<sup>-1</sup>*s<sup>3</sup>*A<sup>2</sup>."},
    {name: "F", type: 3, tags: ["farad", "electrical capacitance"], content: "<syntax>[F]</syntax>, or farad, is the metric unit of electric capacitance. It is equal to one <help title='C'>coulomb</help> per <help title='V'>volt</help>. Its base units are: m<sup>-2</sup>*kg<sup>-1</sup>*s<sup>4</sup>*A<sup>2</sup>. Farad supports all <help>metric prefixes</help>."},
    {name: "T", type: 3, tags: ["tesla", "magnetic induction"], content: "<syntax>[T]</syntax>, or Tesla, is the metric unit of magnetic induction. It is equal to one <help title='Wb'>weber</help> per square <help title='m'>meter</help>. Its base units are: kg*s<sup>-2</sup>*A<sup>-1</sup>. Tesla supports all <help>metric prefixes</help>."},
    {name: "Pa", type: 3, tags: ["pascal", "pressure"], content: "<syntax>[Pa]</syntax>, or pascal, is the metric unit of pressure. It is equal to one <help title='N'>newton</help> per square <help title='m'>meter</help>. Its base units are: m<sup>-1</sup>*kg*s<sup>-2</sup>. Pascal supports all <help>metric prefixes</help>."},
    {name: "N", type: 3, tags: ["newton", "force"], content: "<syntax>[N]</syntax>, or Newton, is the metric unit of force. It is the force required to accelerate one <help title='kg'>kilogram</help> at one <help title='m'>meter</help> per <help title='s'>second</help> squared. A newton applied over one meter takes a <help title='J'>joule</help> of energy. The base units for the newton are: m*kg*s<sup>-2</sup>. It supports all <help>metric prefixes</help>."},
    {name: "Sv", type: 3, tags: ["sievert", "radiation", "gray"], content: "<syntax>[Sv]</syntax>, or sievert, is metric unit of ionizing radiation. The sievert has identacal base units as the gray (Gy), so the gray is not supported. It is equal to one <help title='J'>joule</help> per <help title='kg'>kilogram</help>. Its base units are: m<sup>2</sup>*s<sup>-2</sup>. The sievert supports all <help>metric prefixes</help>."},
    {name: "kat", type: 3, tags: ["katal", "catalytic activity"], content: "<syntax>[kat]</syntax>, or katal, is the metric unit of catalytic activity. It is equal to one <help title='mol'>mole</help> per <help title='s'>second</help>. Its base units are: mol*s<sup>-1</sup>."},
    {name: "min", type: 3, tags: ["minute", "time"], content: "<syntax>[min]</syntax> is a unit of time equal to 60 <help title='s'>seconds</help>."},
    {name: "hr", type: 3, tags: ["hour", "time"], content: "<syntax>[hr]</syntax> is a unit of time equal to 60 <help title='min'>minutes</help>, or 3600 <help title='s'>seconds</help>."},
    {name: "day", type: 3, tags: ["day", "time"], content: "<syntax>[day]</syntax> is a unit of time equal to 24 <help title='hr'>hours</help>, or 86400 <help title='s'>seconds</help>."},
    {name: "kph", type: 3, tags: ["kilometers per hour", "speed"], content: "<syntax>[kph]</syntax>, or <help title='m'>kilometers</help> per <help title='hr'>hour</help>, is a unit of speed equal to 5/18 meters per second."},
    {name: "mph", type: 3, tags: ["miles per hour", "speed"], content: "<syntax>[mph]</syntax>, or <help title='mi'>miles</help> per <help title='hr'>hour</help>, is a unit of speed equal to 0.447038888... <help title='m'>meters</help> per <help title='s'>second</help>."},
    {name: "mach", type: 3, tags: ["speed of sound", "speed"], content: "<syntax>[mach]</syntax> is the unit of speed equal to 343 <help title='m'>meters</help> per <help title='s'>second</help>. This is approximately the speed of sound in 20° C air."},
    {name: "c", type: 3, tags: ["speed of light", "speed"], content: "<syntax>[c]</syntax> is the unit of speed equal to the speed of light in a vacuum. It is equal to 299,492,458 <help title='m'>meters</help> per <help title='s'>second</help> exactly because the meter is defined by it. The official symbol is capital C, but that was already taken by the <help title='C'>coulomb</help>."},
    {name: "ft", type: 3, tags: ["foot", "length"], content: "<syntax>[ft]</syntax>, or foot (plural feet), is the imperial unit of length. In 1959, it was defined as exactly equal to 0.3048 <help title='m'>meters</help>. It is equal to a third of a <help title='yd'>yard</help>, or twelve <help title='in'>inches</help>."},
    {name: "mi", type: 3, tags: ["mile", "length"], content: "<syntax>[mi]</syntax>, or mile, is the imperial unit of a long distance. In 1959, it was agreed to be defined as exactly 1609.344 <help title='m'>meters</help>. It is also equal to 5280 <help title='ft'>feet</help>, or 1760 <help title='yd'>yards</help>."},
    {name: "yd", type: 3, tags: ["yard", "length"], content: "<syntax>[yd]</syntax>, or yard, is an imperial unit of length. In 1959, it was agreed to be defined as exactly 0.9144 <help title='m'>meters</help>. The yard is also equal to 3 <help title='ft'>feet</help>."},
    {name: "in", type: 3, tags: ["inch", "length"], content: "<syntax>[in]</syntax>, or inch, is an imperial unit of length originally defined as 1/12 <help title='ft'>feet</help>. In 1959, it was agreed to be defined as 0.0254 <help title='m'>meters</help>."},
    {name: "nmi", type: 3, tags: ["nautical mile", "length"], content: "<syntax>[nmi]</syntax>, or nautical mile is defined as exactly 1852 <help title='m'>meters</help>."},
    {name: "pc", type: 3, tags: ["parsec", "length"], content: "<strong>[pc]</strong>, or parsec, is defined as exactly 3.0857 * 10<sup>16</sup> <help title='m'>meters</help>. It was originally defined as the distance between the sun and a star if that star had a parallax of one arc second. Therefore, it is derived from the arc second and the astronomical unit. The parsec is equal to about 3.3 light years. The parsec supports all metric prefixes."},
    {name: "acre", type: 3, tags: ["acre", "area"], content: "<syntax>[acre]</syntax> is an imperial unit of area. It was originally defined as 66 by 660 <help title='ft'>feet</help> (43560 square feet), now it is defined as exactly 4046.8564224 square meters."},
    {name: "are", type: 3, tags: ["are", "area", "hectare"], content: "<syntax>[are]</syntax> is a metric unit of area equal to 100 square meters. A more common unit is the hectare ([hare]), which is equal to 10000 m<sup>2</sup> <syntax>(100 [m] * 100 [m])</syntax>. The are supports all <help>metric prefixes</help>."},
    {name: "ct", type: 3, tags: ["carat", "mass", "weight"], content: "<syntax>[ct]</syntax>, or carat, is a metric unit of mass used for measuring precious metals. It is equal to exactly 0.2 <help title='kg'>gram</help>."},
    {name: "st", type: 3, tags: ["stone", "mass"], content: "<syntax>[st]</syntax>, or stone, is an imperial unit of mass equal to 6.35029318 <help title='kg'>kilograms</help>. The exact meaning of 'one stone' varies wildly across culture, so it is not a recommended unit."},
    {name: "lb", type: 3, tags: ["pound", "mass", "libra"], content: "<syntax>[lb]</syntax>, or pound, is an imperial unit of mass. It is defined as 0.45359237 <help title='kg'>kilogram</help>."},
    {name: "oz", type: 3, tags: ["ounce", "mass"], content: "<syntax>[oz]</syntax>, or ounce, is an imperial unit of mass. Historically, the definition of ounce was varied, but today it is commonly accepted to be 28.3 <help title='kg'>grams</help>, or 1/16 <help title='lb'>pounds</help>."},
    {name: "tn", type: 3, tags: ["tonne", "mass"], content: "<syntax>[tn]</syntax>, or tonne, is a metric unit used for large masses. It is exactly equal to 1000 <help title='kg'>kilograms</help>, this makes it equal to the Mg (megagram)."},
    {name: "gallon", type: 3, tags: ["gallon", "volume"], content: "<syntax>[gallon]</syntax> is an imperial unit of volume. It is equal to 0.00454609 cubic meters, or 128 <help title='floz'>fluid ounces</help>."},
    {name: "cup", type: 3, tags: ["cup", "volume"], content: "<syntax>[cup]</syntax> is an imperial unit of volume. It is equal to 0.0002365882365 cubic meters, or 8 <help title='floz'>fluid ounces</help>."},
    {name: "floz", type: 3, tags: ["fluid ounce", "volume"], content: "<syntax>[floz]</syntax>, or fluid ounce is an imperial unit of volume. It is equal to 0.0000295735295625 cubic meters, or 29.5 mL."},
    {name: "tbsp", type: 3, tags: ["tablespoon", "volume"], content: "<syntax>[tbsp]</syntax>, or tablespoon is an imperial unit of volume. It is equal to 0.00001478676478125 cubic meters, 14.7 mL, 0.5 <help title='floz'>fluid ounces</help>, or 3 <help title='tsp'>teaspoons</help>."},
    {name: "tsp", type: 3, tags: ["teaspoon", "volume"], content: "<syntax>[tsp]</syntax> is an imperial unit of volume. It is equal to 0.000000492892159375 cubic meters,  0.492 mL, 1/6 <help title='floz'>fluid ounces</help>, or 1/3 <help title='tbsp'>tablespoon</help>."},
    {name: "Ah", type: 3, tags: ["amp hour", "electric charge"], content: "<syntax>[Ah]</syntax>, or Amp hour, is a metric unit of electric charge equal to 3600 <help title='C'>Coulombs</help>. A coulomb is equal to an Amp second. Amp hour supports all <help>metric prefixes</help>."},
    {name: "Wh", type: 3, tags: ["watt hour", "energy"], content: "<syntax>[Wh]</syntax>, or watt hour, is a metric unit of energy equal to 3600 <help title='J'>joules</help>. A joule is a watt second. Watt hour supports all <help>metric prefixes</help>."},
    {name: "eV", type: 3, tags: ["electron volt", "electric charge"], content: "<syntax>[eV]</syntax>, or electronvolt, is the unit of charge in an electron. It is equal to 1.602 176 634 * 10<sup>-19</sup> <help title='C'>Coulombs</help>. Electronvolt supports all <help>metric prefixes</help>."},
    {name: "atm", type: 3, tags: ["atmosphere", "pressure"], content: "<syntax>[atm]</syntax>, or atmosphere, is the approximate pressure of the Earth's atmosphere at sea level. It is equal to 101352 <help title='Pa'>Pascal</help>."},
    {name: "bar", type: 3, tags: ["bar", "pressure"], content: "<syntax>[bar]</syntax> is a metric unit of pressure equal to 100000 <help title='pa'>Pascal</help>. Bar supports all metric prefixes."},
    {name: "psi", type: 3, tags: ["pounds per square inch", "pressure"], content: "<syntax>[psi]</syntax>, or pounds per square inch, is an imperial unit of pressure equal to 6894.75729316836133 <help title='Pa'>Pascal</help>."},
    {name: "btu", type: 3, tags: ["british thermal unit", "energy"], content: "<syntax>[btu]</syntax>, or British thermal unit, is an imperial unit of energy equal to 1054.3503 <help title='J'>joules</help>. The original meaning was the energy required to heat a pound of maximum density water by one degree Fahrenheit."},
];
/**
 * Opens the help page for name. Ex: openHelp('add')
 */
function openHelp(name) {
    let id = -1;
    for(let i = 0; i < helpPanel.length; i++) {
        if(typeof helpPanel[i].name == "string") {
            if(name == helpPanel[i].name) {
                id = i;
                break;
            }
        }
        else {
            if(name == helpPanel[i].name[0]) {
                id = i;
                break;
            }
        }
    }
    if(id == -1) {
        let message = "couldn't find help page " + name;
        appendHistory("-help " + name, "Error: " + message);
        console.log(message);
        throw message;
    }
    let content = document.getElementById("helpPageContent");
    content.innerHTML = generateHelpPageContent(id);
    if(panelPage != 1) openPanelPage(1);
    //Replace syntax tags
    let syn = content.getElementsByTagName("syntax");
    for(let i = 0; i < syn.length; i++) syn[i].innerHTML = getSyntax(syn[i].textContent);
    //Replace help tags
    let help = content.getElementsByTagName("help");
    for(let i = 0; i < help.length; i++) {
        let newEl = document.createElement("a");
        let href = help[i].title;
        if(href == "") href = help[i].textContent;
        newEl.href = "javascript:openHelp('" + href + "');"
        newEl.innerHTML = help[i].innerHTML;
        help[i].parentElement.replaceChild(newEl, help[i]);
    }
}
class helpSearchResult {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
    toHTML() {
        let out = "<button class='searchResult' onclick='openHelp(\"" + helpPanel[this.id].name + "\")'>" + generateHelpPageHeader(this.id);
        out += "<span class='searchResultTags'>";
        if(helpPanel[this.id].type != 0) out += helpPageTypes[helpPanel[this.id].type] + "<br>";
        if(helpPanel[this.id].tags) {
            let tags = helpPanel[this.id].tags;
            out += tags[0];
        }
        return out + "</span></button>";
    }
}
/**
 * Commits a search and changes the HTML of the search results to the list, if gotoAuto is true, automatically go to the best result.
*/
function helpSearch(input, event = null, gotoAuto = false) {
    input = input.toLowerCase();
    //Check for escape key or enter key
    if(event != null) {
        if(event.key == "Escape") {
            return;
        }
        if(event.key == "Enter") {
            let list = document.getElementsByClassName("searchResult");
            if(list.length == 0) return;
            list[0].click();
            return;
        }
    }
    //Show search page if not shown
    let search = document.getElementById("helpSearch");
    if(search.style.display != "block") openPanelPage(2);
    if(search.children[1]) search.children[1].focus();
    search = search.children[3];
    //Show mesage if no input
    if(input.length == 0) {
        search.innerHTML = "Type an expression to search.";
        return;
    }
    //Get results
    let results = [];
    for(let i = 0; i < helpPanel.length; i++) {
        let page = helpPanel[i];
        let tags = page.tags;
        let pageName = page.name.toLowerCase();
        if(input == pageName) results.push(new helpSearchResult(i, 0));
        else if(pageName.startsWith(input)) results.push(new helpSearchResult(i, 1));
        else if(pageName.includes(input)) results.push(new helpSearchResult(i, 2));
        else if(tags != null) for(let j = 0; j < tags.length; j++) {
            if(tags[j] == input) results.push(new helpSearchResult(i, 3));
            else if(tags[j].includes(input)) results.push(new helpSearchResult(i, 4));
            else continue;
            break;
        }
    }
    //Sort Results
    results.sort((a, b) => (a.type - b.type));
    //Remove duplicates
    let itemSet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let outList = [];
    for(let i = 0; i < results.length; i++) {
        //Fit 32 boolean values into an integer to store a true false for whether each help page has already been stored
        if((itemSet[Math.floor(results[i].id / 32)] & (1 >> (results[i].id % 32))) == 0) {
            //Push to list and set flag to one
            outList.push(results[i]);
            itemSet[Math.floor(results[i].id / 32)] |= 1 >> (results[i].id % 32);
        }
    }
    if(gotoAuto) {
        if(outList.length == 0) {
            appendHistory("-help " + input, "Error: no help page found for '" + input + "'");
        }
        else {
            openHelp(helpPanel[outList[0].id].name);
        }
    }
    //Compile HTML
    let out = "";
    for(let i = 0; i < outList.length; i++) {
        out += outList[i].toHTML();
    }
    search.innerHTML = out;
}
/**
 * Generate the title page for help page id. Ex: add(a,b), [m], -base
 */
function generateHelpPageHeader(id) {
    let out = helpPanel[id].name;
    if(helpPanel[id].type == 0) {
        return out.substring(0, 1).toUpperCase() + out.substring(1);
    }
    if(helpPanel[id].type == 2) {
        let args = helpPanel[id].arguments;
        if(args != null) {
            out += "(";
            for(let i = 0; i < args.length; i++) {
                out += args[i];
                if(i + 1 != args.length) out += ",";
            }
            out += ")";
        }
        return out;
    }
    if(helpPanel[id].type == 3) return "[" + out + "]";
    return out;
}
/**
 * Generates help page content from an id
 */
function generateHelpPageContent(id) {
    //Generate name/header
    let name = generateHelpPageHeader(id);
    let out = "<h2><strong>" + name + "</strong></h2>";
    //Generate aliases
    if(helpPanel[id].tags != null) {
        let tagStr = "<small>Aliases: ";
        let tags = helpPanel[id].tags;
        for(let i = 0; i < tags.length; i++) {
            tagStr += tags[i];
            if(i != tags.length - 1) tagStr += ", ";
        }
        tagStr += "</small><br>";
        out += tagStr;
    }
    //Add Content
    out += helpPanel[id].content;
    //Generate dynamic content
    let genID = helpPanel[id].generationID;
    if(genID == null) return out;
    //List of units
    if(genID == 1) {
        out += "<div class='buttonList'>";
        for(let i = 0; i < helpPanel.length; i++) {
            if(helpPanel[i].type == 3) {
                out += "<button onclick='openHelp(\"" + helpPanel[i].name + "\")'>[<span class='syn-unit'>" + helpPanel[i].name + "</span>] (" + helpPanel[i].tags[0] + ")</button>";
            }
        }
        out += "</div>";
    }
    //List of commands
    if(genID == 2) {
        out += "<div class='buttonList'>";
        for(let i = 0; i < helpPanel.length; i++) {
            if(helpPanel[i].type == 1) {
                out += "<button onclick='openHelp(\"" + helpPanel[i].name + "\")'><span class='syn-command'>" + helpPanel[i].name + "</span></button>";
            }
        }
        out += "</div>";
    }
    //List of functions
    if(genID == 3) {
        out += "<div class='buttonList'>";
        for(let i = 0; i < helpPanel.length; i++) {
            if(helpPanel[i].type == 2) {
                out += "<button onclick='openHelp(\"" + helpPanel[i].name + "\")'><span class='syn-builtin'>" + helpPanel[i].name + "</span></button>";
            }
        }
        out += "</div>";
    }
    //List of custom functions
    if(genID == 4) {

    }
    return out;
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
        if(out != "") appendHistory(input.innerHTML, out);
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
    if(input.startsWith("//") || input.startsWith("#")) {
        hist.innerHTML = outputText + "<br>";
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
    if(typeof out === "undefined" || out == "undefined") {
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