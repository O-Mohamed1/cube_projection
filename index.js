const BODY = document.body;
const WINDOW = document.getElementById("image");

//const pixels = 20 //width of each square in pixels
const TOTAL_DISTANCE = 400; //distance of entire cube
const WIDTH = 8; //width of cube in points, lets say 1 square will be 20 pixels, distance should start around 800,
let cube = [];

function printSquare(squarePositionX, linePositionY, sliceIndex) {//prints each square
    const SQUARE = document.createElement("div");
    SQUARE.classList.add("square");

    SQUARE.style.marginLeft = `${squarePositionX}px`;//distance between squares
    SQUARE.style.marginTop = `${linePositionY}px`; //distance between lines
    SQUARE.style.zIndex = `${sliceIndex + 2}px`; //move upwards in Z direction to avoid collision, +2 because sliceIndex starts at 0 and background z-index is 1

    WINDOW.appendChild(SQUARE);
}

//calculate a cube and save each dot in a matrix
function calculateCube(WIDTH) {//could just move everything from other loops to here. That way I act on the data as it is produced
    if (WIDTH < 2) {
        console.log("wyd");
    }
    for (let i = 0; i < WIDTH+1; i++) { // turn this into recursion or WIDTH^3 somehow, current way is just too slow
        let slice = [];
        for (let j = 0; j < WIDTH+1; j++) {
            let line = [];
            for (let k = 0; k < WIDTH+1; k++) {
                line.push(1); // add 1 square to a line, WIDTH number of times
            }
            slice.push(line); // add 1 line of WIDTH squares to a slice, WIDTH number of times
        }
        cube.push(slice); // add 1 slice of WIDTH lines with WIDTH squares to the cube, WIDTH number of times
    }
    return cube;
}

//calculate distance between squares based on how deep in the cube the square is
function calculateSquareDistance(sliceIndex) { // x**0 == 1 so first case still works
    return (TOTAL_DISTANCE * (.9375 ** sliceIndex) / WIDTH); //exponentially shorten distances between squares in subsequent slices
}
//sliceDisplacement should be based on previous slice, and not the whole map

//func4 will forEach the arrays in the matrix and print them as square elements on html
function outputCube() {
    calculateCube(WIDTH);
    let squareDistance = calculateSquareDistance(0); //starting square distance

    let sliceLocation = 0;   //keeps track of where current slice will be printed, first slice/line/square starts at the top left
    let linePositionY = 0;   //keeps track of where current line will be printed
    let squarePositionX = 0; //keeps track of where current square will be printed, first square at the start of the line

    function lineDisplacement(sliceIndex = -1) { //this is the gap added to each subsequent line
        return ((TOTAL_DISTANCE - 15 - squareDistance * WIDTH) / 2);
    };

    //unique about each slice: they each start at a different position, and have different square distances
    cube.forEach((slice, sliceIndex) => { //go forward slice by slice in the cube, starting with the front face
        squareDistance = calculateSquareDistance(sliceIndex); //goes at start of each slice, each one has unique distance
        sliceLocation = lineDisplacement(); //this is how much to move each slice, changes per slice

        linePositionY = sliceLocation - 0;
        //each line is sliceLocation down, and right
        slice.forEach(line => { //go down line by line in the slice, starting with the top line
            squarePositionX = sliceLocation - 0; //position of first square of each line

            line.forEach(square => { //go right square by square in the line, starting with the left
                printSquare(squarePositionX, linePositionY, sliceIndex); //print square
                squarePositionX += squareDistance -0; //next square's position relative to the left side of the image, goes after each square is printed

            })
            linePositionY += squareDistance -0;
        })
    })
}

outputCube();

//when done, rename squares to dots and rename slices to squares
//and turn it from OOP to regular program, because why am I making a matrix of 1000 dots when i could just do 10^3? all the loops are the same. recurse maybe?
//prints 1 slice, changes variables, recurses and prints second slice, etc. until it runs out of slices. thats how you make this all 1 recursive function

//this is an easy way, no possibility to rotate the cube though:
//it will start with first face, then go in 1 unit at a time printing squares. maybe add intervals
//to watch it print

/*
but i want to make the version that plots points certain distance away from the center point,
this version could be changed to rotate the cube
-func1 makes grid to plot on. though maybe this is irrelevant 

-func2 will calculate a cube depending on density of dots, by doing something like 10x10x10, 
and save the position of the cubes in a matrix. here is where i could possibly add cube rotation

-func3 will calculate how much to move the points, 
depending on how far away they are from the middle of the cube.
it will need to find the middle, then move it away or closer depending on if it is passed the 
position of the middle in the matrix. this involves some real 3D calculations, how would I know exactly where a point is otherwise?

-func4 will forEach the arrays in the matrix and print them as square elements on html
*/