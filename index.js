const BODY = document.body
const WINDOW = document.getElementById("image")

//const pixels = 20 //width of each square in pixels
const TOTAL_DISTANCE = 800 //distance of entire cube
const WIDTH = 10 //width of cube in points, lets say 1 square will be 20 pixels, distance should start around 800,
let cube = []

//func1 make a grid to place the cube on, based on pixels i guess?
function makeGrid(){
    //some code that makes grid certain number of pixels to plot squares on
    // body.appendChild(grid)
}

//makeGrid()
function printSquare(squarePosition,lineDisplacement,sliceIndex){
    const SQUARE = document.createElement("div")
    SQUARE.classList.add("square")
    
    //!some way to move element squarePosition units right
    //!move element lineDisplacement units down, maybe based on percentage?
    SQUARE.style.marginLeft = `${squarePosition}px`;
    SQUARE.style.marginTop = `${lineDisplacement}px`;
    SQUARE.style.zIndex = `${sliceIndex+2}px`; //move upwards in Z direction to avoid collision, +2 because sliceIndex starts at 0 and background z-index is 1

    WINDOW.appendChild(SQUARE)
    // const currentPosition = square.getBoundingClientRect();
    // square.style.left = currentPosition.left + x + 'px'
    // square.style.top = currentPosition.top + 'px'
}

//func2 will calculate a cube depending on density of dots, by doing something like 10x10x10, 
//and save the position of the cubes in a matrix. here is where i could possibly add cube rotation
function calculateCube(WIDTH){//could do everything here, just move everything from other loops to where they belong here. That way I act on the data as it is produced
    if(WIDTH<2){
        console.log("wyd")
    }
    for (let i = 0; i<WIDTH; i++){ // turn this into recursion or WIDTH^3 somehow, current way is just too slow
        let slice = []
        for (let j = 0; j<WIDTH; j++){
            let line = []
            for (let k = 0; k<WIDTH; k++){
                line.push(1) // add 1 square to a line, WIDTH number of times
            }
            slice.push(line) // add 1 line of WIDTH squares to a slice, WIDTH number of times
        }
        cube.push(slice) // add 1 slice of WIDTH lines with WIDTH squares to the cube, WIDTH number of times
    }
    return cube
}

//func3 will calculate how much to move the points
function calculateSquareDistance(sliceIndex){//could remove everything except return TOTAL_DISTANCE*(.9375^sliceIndex)/WIDTH since x^0 == 1
    if(sliceIndex==0){//first slice
        return TOTAL_DISTANCE/WIDTH; //starting squareDistance
    }else{
        return TOTAL_DISTANCE*(.9375^sliceIndex)/WIDTH; //exponentially shorten distances between squares in subsequent slices
    }
} //calculate distance between squares, based on the number of squares in the cube.
// density will be hardcoded at first, then made a variable later, by shortening squareDistance


//func4 will forEach the arrays in the matrix and print them as square elements on html
function outputCube(){
    calculateCube()
    let squareDistance = calculateSquareDistance(0) //starting square distance

    let sliceLocation = 0; //keeps track of where current slice will be printed, first slice/line/square starts at the top left
    let lineDisplacement = ()=>{return (TOTAL_DISTANCE-squareDistance*WIDTH)/2}; //this is the gap added to each subsequent line
    let squarePosition = 0 //keeps track of where current square will be printed, first square at the start of the line

    //unique about each slice: they each start at a different position, and have different square distances
    cube.forEach(slice, sliceIndex=>{//go forward slice by slice in the cube, starting with the front face
        squareDistance = calculateSquareDistance(sliceIndex)//goes at start of each slice, each one has unique distance
        sliceLocation = lineDisplacement() //this is how much to move each slice, changes per slice

        //each line is sliceLocation down, and right
        slice.forEach(line=>{//go down line by line in the slice, starting with the top line
            squarePosition = sliceLocation//position of first square of each line

            line.forEach(square=>{//go right square by square in the line, starting with the left
                printSquare(squarePosition, sliceLocation)//print square
                squarePosition += squareDistance //next square's position relative to the left side of the image, goes after each square is printed

            })
            //!move to next line position, sliceLocation units down and right

        })

    })
        
    // BODY.appendChild(WINDOW)
}
printSquare(0,0,0)
printSquare(30,15,1)
printSquare(40,0,2)

//when done, rename squares to dots and rename slices to squares
//and turn it from OOP to regular program, because why am a making a matrix of 1000 dots when i could just do 10^3? all the loops are the same. recurse maybe?
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