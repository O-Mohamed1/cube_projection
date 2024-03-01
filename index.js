const BODY = document.body;
const WINDOW = document.getElementById("image");

//const pixels = 20 //width of each square in pixels
let totalDistance = 800; //distance of entire cube
let width = 8; //width of cube in points, lets say 1 square will be 20 pixels, distance should start around 800,
let cube = [];

function submitted(){
    let input1 = document.getElementById("width"); //save width input
    let newWidth = Number(input1.value)-1;
    width = newWidth;
    let input2 = document.getElementById("distance"); //save distance input
    let newDistance = Number(input2.value);
    totalDistance = newDistance;
    cube = [];
    console.log(width)
    console.log(cube)
    WINDOW.innerHTML="";
    outputCube();
    return;
}



function printSquare(squarePositionX, linePositionY, indices) {//prints each square
    const SQUARE = document.createElement("div");
    SQUARE.classList.add("square");

    SQUARE.style.marginLeft = `${squarePositionX}px`;//distance between squares
    SQUARE.style.marginTop = `${linePositionY}px`; //distance between lines
    SQUARE.style.zIndex = `${indices[0] + 2}px`; //move upwards in Z direction to avoid collision, +2 because sliceIndex starts at 0 and background z-index is 1
    
    let further = indices[0]/width;
    SQUARE.style.backgroundColor = `rgba(243, 146, 202,${1-further})`; //make the squares darker as they get further away
    SQUARE.style.width = `${8}px`; //!make the squares smaller as they get further away
    SQUARE.style.height = `${8}px`; //!^
    //could make it a firework by making the squares more opaque as they near the center of the slices and lines and squares, so:
    /*
    
    let opacity=1
    const halfwayPoint=width/2
    let solved = 0
    function firework(indices){
        solved++
        if (solved>3){
            return opacity
        }
        for(let i = 0; i<indices.length; i++){
            if(indices[0]<halfwayPoint){
                opacity*=indices[i]/halfwayPoint
            }else if(indices[0]>halfwayPoint){
                opacity*=(width-indices[i])/halfwayPoint
            }else {
                opacity*=1
            }
        }
        firework(indices[i])
        return opacity 
    }
    
    

    */

    let squareFirstOrLast = (indices[2]==0 || indices[2]==width)
    let lineFirstOrLast = (indices[1] == 0 || indices[1] == width)
    let sliceFirstOrLast = (indices[0]==0 || indices[0]==width)
    
    if(lineFirstOrLast && squareFirstOrLast){ //make other edges red
        SQUARE.style.backgroundColor = `rgba(255, 0, 0,${1-((indices[0]-3)/width)})`;
    }
    if(sliceFirstOrLast && (lineFirstOrLast || squareFirstOrLast)){ //make first and last face's edges red
        SQUARE.style.backgroundColor = `rgba(255, 0, 0,${1-((indices[0]-3)/width)})`;
    }

    WINDOW.appendChild(SQUARE);
    
    return
}

//calculate a cube and save each dot in a matrix
function calculateCube(width) {//could just move everything from other loops to here. That way I act on the data as it is produced
    class Square{
        constructor(opacity, size, color){
            this.opacity = opacity;
            this.size = size;
            this.color = color;
        }
    }
    if (width < 2) {
        console.log("wyd");
    }
    for (let i = 0; i < width+1; i++) { // turn this into recursion or width^3 somehow, current way is just too slow
        let slice = [];
        for (let j = 0; j < width+1; j++) {
            let line = [];
            for (let k = 0; k < width+1; k++) {
                line.push(new Square(1,8,"red")); // add 1 square to a line, width number of times
            }
            slice.push(line); // add 1 line of width squares to a slice, width number of times
        }
        cube.push(slice); // add 1 slice of width lines with width squares to the cube, width number of times
    }
    return cube;
}
//endpoint = last slice should start at (totalDistance/4) then the square distance changes based on endpoint
//(totalDistance * (.9325 ** sliceIndex) / width)
//endpoint should change this^ part of the equation

//calculate distance between squares based on how deep in the cube the square is
function calculateSquareDistance(sliceIndex) { // x**0 == 1 so first case still works
    return (totalDistance * (.9325 ** sliceIndex) / width); //exponentially shorten distances between squares in subsequent slices
}

//func4 will forEach the arrays in the matrix and print them as square elements on html
function outputCube() {
    
    calculateCube(width);
    let squareDistance = calculateSquareDistance(0); //starting square distance

    let sliceLocation = 0;   //keeps track of where current slice will be printed, first slice/line/square starts at the top left
    let linePositionY = 0;   //keeps track of where current line will be printed
    let squarePositionX = 0; //keeps track of where current square will be printed, first square at the start of the line
    let indices = [0,0,0];   //keeps track of indices of slices, lines, and squares in that order
    
    function lineDisplacement() { //this is the gap added to each subsequent line
        return ((totalDistance - 15 - squareDistance * width) / 2);
    };

    //unique about each slice: they each start at a different position, and have different square distances
    cube.forEach((slice, sliceIndex) => { //go forward slice by slice in the cube, starting with the front face
        indices[0]=sliceIndex; //save sliceIndex
        squareDistance = calculateSquareDistance(indices[0]); //goes at start of each slice, each one has unique distance
        sliceLocation = lineDisplacement(); //this is how much to move each slice, changes per slice
        
        linePositionY = sliceLocation - 0;
        //each line is sliceLocation down, and right
        slice.forEach((line, lineIndex)=> { //go down line by line in the slice, starting with the top line
            indices[1]=lineIndex; //save lineIndex
            squarePositionX = sliceLocation - 0; //position of first square of each line
            
            line.forEach((square, squareIndex) => { //go right square by square in the line, starting with the left
                indices[2]=squareIndex //save squareIndex
                printSquare(squarePositionX, linePositionY, indices); //print square
                squarePositionX += squareDistance -0; //next square's position relative to the left side of the image, goes after each square is printed

            })
            linePositionY += squareDistance -0;
        })
    })
    return
}

outputCube();