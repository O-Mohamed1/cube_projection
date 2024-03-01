const BODY = document.body;
const WINDOW = document.getElementById("image"); //where cube will be output

let totalDistance = 800; //distance of entire cube
let width = 8; //width of cube in points, lets say 1 square will be 20 pixels, distance should start around 800,
let cube = []; // I remade the functions to combine calculateCube and outputCube so I don't think I need to save the cube's data anymore,
//and in the real world its better to hide variables from global scope for security reasons, it would also make the program a lot faster
//and eat less resources, BUT its not that serious for this little program. If I do want to remove the cube, just remember to delete the 
//lines where I'm saving the cube's data inside of outputCube()

function submitted() {
    let input1 = document.getElementById("width"); //save width input
    let newWidth = Number(input1.value) - 1;
    width = newWidth;
    let input2 = document.getElementById("distance"); //save distance input
    let newDistance = Number(input2.value);
    totalDistance = newDistance;
    cube = [];
    console.log(width)
    console.log(cube)
    WINDOW.innerHTML = "";
    outputCube();
    return;
}

function printSquare(squarePositionX, linePositionY, indices, square) {//prints each square
    const SQUARE = document.createElement("div");
    SQUARE.classList.add("square");

    SQUARE.style.marginLeft = `${squarePositionX}px`;//distance between squares
    SQUARE.style.marginTop = `${linePositionY}px`; //distance between lines
    SQUARE.style.zIndex = `${indices[0] + 2}px`; //move upwards in Z direction to avoid collision, +2 because sliceIndex starts at 0 and background z-index is 1

    //firework code, to make the cube more opaque as it gets closer to the middle
    let opacity = 5; //as this goes up the firework gets brighter
    const halfwayPoint = width / 2; //used to find the middle of the cube
    indices.forEach(index => { //checks Z then Y then X distances
        if (index < halfwayPoint) {
            opacity *= index / halfwayPoint;
        } else if (index > halfwayPoint) {
            opacity *= (width - index) / halfwayPoint;
        } else {
            opacity *= 1;
        }
    });//could make a sphere, if square.opacity is too low just make the opacity 0
    square.opacity = opacity; //set new opacity per square

    let further = indices[0] / width; //use square.position instead of indices[x] to determine stuff
    SQUARE.style.backgroundColor = `rgba(243, 146, 202,${square.opacity})`; //make the squares darker as they get further away
    SQUARE.style.width = `${square.size}px`; //!make the squares smaller as they get further away
    SQUARE.style.height = `${square.size}px`; //!^
    //could make it a firework by making the squares more opaque as they near the center of the slices and lines and squares, so:

    let squareFirstOrLast = (indices[2] == 0 || indices[2] == width);
    let lineFirstOrLast = (indices[1] == 0 || indices[1] == width);
    let sliceFirstOrLast = (indices[0] == 0 || indices[0] == width);

    //make a red outline around the cube:
    if (lineFirstOrLast && squareFirstOrLast) { //make other edges red
        SQUARE.style.backgroundColor = `rgba(255, 0, 0,${1 - ((indices[0] - 3) / width)})`;
    }
    if (sliceFirstOrLast && (lineFirstOrLast || squareFirstOrLast)) { //make first and last face's edges red
        SQUARE.style.backgroundColor = `rgba(255, 0, 0,${1 - ((indices[0] - 3) / width)})`;
    }

    WINDOW.appendChild(SQUARE);

    return
}

//calculate a cube and save each dot in a matrix
function calculateCube(width) {//could just move everything from other loops to here. That way I act on the data as it is produced
    
    return cube;
}

//calculate distance between squares based on how deep in the cube the square is
function calculateSquareDistance(sliceIndex) { // x**0 == 1 so first case still works
    return (totalDistance * ((.5 ** (1 / width)) ** sliceIndex) / width); //shorten distances between squares in subsequent slices
}//cube size will always remain the same by dynamically changing the factor by which squareDistance is shrunken
//personal note: precalc function modelling actually helped me here lol ((zroot(.5))**x)/z would have a limit, and that limit is the end of the cube

//func4 will forEach the arrays in the matrix and print them as square elements on html
function outputCube() {
    let squareDistance = 0;  //starting square distance
    let sliceLocation = 0;   //keeps track of where current slice will be printed, first slice/line/square starts at the top left
    let linePositionY = 0;   //keeps track of where current line will be printed
    let squarePositionX = 0; //keeps track of where current square will be printed, first square at the start of the line
    let indices = [0, 0, 0]; //keeps track of indices of slices, lines, and squares in that order, changes per square
    //calculateCube(width);
    class Square { //each individual point has its own square object
        constructor(opacity, size, color, indices) {
            this.opacity = opacity;
            this.size = size;
            this.color = color;
            this.indices = indices; //incase I need all indices at once, I won't have to call the other 3 keys
            this.squareZindex = indices[0];
            this.squareYindex = indices[1];
            this.squareXindex = indices[2];
        }
    }

    function lineDisplacement() { //this is the gap added to each subsequent line
        return ((totalDistance - squareDistance * width) / 2);
    };

    if (width < 2) {
        console.log("use more points to see the center");
    }
    // calculate and print the cube
    // cube, slice, and line arrays/matrices are deprecated and can be deleted, they are marked in comments with ###
    for (let i = 0; i < width + 1; i++) { // turn this into recursion or width^3 somehow, current way is just too slow
        let slice = []; //holds 1 slice of the cube #####

        indices[0] = i; //save slice index i
        squareDistance = calculateSquareDistance(indices[0]); //goes at start of each slice, each one has unique distance
        sliceLocation = lineDisplacement(); //this is how much to move each slice, changes per slice

        linePositionY = sliceLocation - 0; //each line is sliceLocation down, and right

        for (let j = 0; j < width + 1; j++) {
            let line = []; //holds 1 line of a slice #####

            indices[1] = j; //save line index j
            squarePositionX = sliceLocation - 0; //position of first square of each line

            for (let k = 0; k < width + 1; k++) {
                indices[2] = k; //save square index k
                
                const square = new Square(1, 2.5, "red", indices); //make square object
                printSquare(squarePositionX, linePositionY, indices, square); //print square
                squarePositionX += squareDistance - 0; //next square's position relative to the left side of the image, goes after each square is printed
                
                line.push(square); // add 1 square to a line, width number of times #####
            }
            linePositionY += squareDistance - 0;

            slice.push(line); // add 1 line of width squares to a slice, width number of times #####
        }
        cube.push(slice); // add 1 slice of width lines with width squares to the cube, width number of times #####
    }
    
    // let squareDistance = 0;  //starting square distance
    // let sliceLocation = 0;   //keeps track of where current slice will be printed, first slice/line/square starts at the top left
    // let linePositionY = 0;   //keeps track of where current line will be printed
    // let squarePositionX = 0; //keeps track of where current square will be printed, first square at the start of the line
    // let indices = [0, 0, 0]; //keeps track of indices of slices, lines, and squares in that order, changes per square

    // function lineDisplacement() { //this is the gap added to each subsequent line
    //     return ((totalDistance - 15 - squareDistance * width) / 2);
    // };

    //unique about each slice: they each start at a different position, and have different square distances
    /*
    cube.forEach((slice, sliceIndex) => { //go forward slice by slice in the cube, starting with the front face
        // indices[0] = sliceIndex; //save sliceIndex
        // squareDistance = calculateSquareDistance(indices[0]); //goes at start of each slice, each one has unique distance
        // sliceLocation = lineDisplacement(); //this is how much to move each slice, changes per slice

        // linePositionY = sliceLocation - 0;
        //each line is sliceLocation down, and right
        slice.forEach((line, lineIndex) => { //go down line by line in the slice, starting with the top line
            // indices[1] = lineIndex; //save lineIndex
            // squarePositionX = sliceLocation - 0; //position of first square of each line

            line.forEach((square, squareIndex) => { //go right square by square in the line, starting with the left
                //indices[2] = squareIndex //save squareIndex, do i need this anymore?
                // printSquare(squarePositionX, linePositionY, indices, square); //print square
                // squarePositionX += squareDistance - 0; //next square's position relative to the left side of the image, goes after each square is printed

            })
            linePositionY += squareDistance - 0;
        })
    })
    */

    return
}

outputCube();