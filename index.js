const body = document.body
const grid = document.createElement("div")

//func1 make a grid to place the cube on, based on pixels i guess?
function makeGrid(){
    //some code that makes grid certain number of pixels to plot squares on
    body.appendChild(grid)
}
//makeGrid()

//func2 will calculate a cube depending on density of dots, by doing something like 10x10x10, 
//and save the position of the cubes in a matrix. here is where i could possibly add cube rotation

//func3 will calculate how much to move the points, 
//depending on how far away they are from the middle of the cube.
//it will need to find the middle, then move it away or closer depending on if it is passed the 
//position of the middle in the matrix.

//func4 will forEach the arrays in the matrix and print them as square elements on html
function outputCube(){
    /*
    need code1 to calculate distance between squares, based on the number of squares in the cube.
    density will be hardcoded at first, then made variable later

    code2 will make cube array, which holds slices array, which holds lines array, which holds
    objects square{data;distance;} where data is the actual square that gets printed and distance
    is the distance between the dots.
    */

    //forEach instead of for, on the matrix
    /*
    let currentSpot = 0; //first slice/line/square starts at the top left
    currentSpot+= (line[square].distance/certainAmount) //this is how much to move each slice, changes per slice
    //currentSpot to the right, and currentSpot downwards 

    cube.forEach(slice=>{//go slice by slice in the cube, starting with the front face
        slice.forEach(line=>{//go line by line in the slice, starting with the top line
            line.forEach(square=>{//go square by square in the line, starting with the top left
                print square.data
                move square.distance units to the right
            })
            move to next line position, square.distance units down
        })
    })
        
    */
    for(let i=0; i<50; i++){
        const square = document.createElement("div")
        square.classList.add("square")
        grid.appendChild(square)
    }
    body.appendChild(grid)
}
outputCube()

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
position of the middle in the matrix.

-func4 will forEach the arrays in the matrix and print them as square elements on html
*/