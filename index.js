const BODY = document.body;
const WINDOW = document.getElementById("image"); //where cube will be output
//could use this to program a 3D game, or any video or graphic, I could change individual dots as if they were pixels
//and I could make them shrink or go invisible as well, which a regular display can't do. Moving the camera will be tough though,
//that involves a lot of math

let totalDistance = 800; //distance of entire cube
let width = 8; //width of cube in points, but the actual width of the cube will be width+1 so if width==9, the cube will be 10^3

function submitted() {
    let input1 = document.getElementById("width"); //save width input
    let newWidth = Number(input1.value) - 1;
    width = newWidth;
    let input2 = document.getElementById("distance"); //save distance input
    let newDistance = Number(input2.value);
    totalDistance = newDistance;
    console.log(width)
    WINDOW.innerHTML = "";
    outputCube();
    return;
}

function printSquare(square) {//prints each square
    //zIndex is a css property, Zindex is a property of custom Square class, defined in outputCube() its confusing but zIndex ends up = to Zindex anyways
    const SQUARE = document.createElement("div");
    SQUARE.classList.add("square");

    SQUARE.style.marginLeft = `${square.marginLeft}px`;//distance between squares
    SQUARE.style.marginTop = `${square.marginTop}px`; //distance between lines
    SQUARE.style.zIndex = `${width-square.Zindex}px`; //move forwards in Z direction to avoid collision of elements
    
    {
        //rendering firework code, to make the cube more opaque and smaller as it gets closer to the middle
        let newSize = square.size;
        let newOpacity = square.opacity; //as this goes up the firework gets brighter
        const halfwayPoint = width / 2; //used to find the middle of the cube
        const middle = [halfwayPoint,halfwayPoint,halfwayPoint];
        square.indices.forEach(index => { //checks Z then Y then X distances
            if (index < halfwayPoint) {
                newOpacity *= index / halfwayPoint;
                newSize = 1/(index / halfwayPoint +newSize);
            } else if (index > halfwayPoint) {
                newOpacity *= (width - index) / halfwayPoint;
                newSize = (width-index) / halfwayPoint +newSize; 
            } else {
                newOpacity *= 1;
                newSize *=1;
            }
        });
        /*
        To-Do:
        The reason why im struggling to find what squares to shrink or make translucent is that I don't know exactly how far the point
        is away from the middle, so I have the idea of using the equation of a sphere to find that distance. r^2=(x-h)^2+(y-k)^2+(z-l)^2
        where (h,k,l) is the middle, and (x,y,z) is the current square's point, and I'm trying to find r, the distance between the two
        once I have r, the closer to width/2 r is, the more translucent and large the squares will be. Not sure how to make it look good if
        half my code relies on index and the other half relies on the actual pixel locations. Pushing this to main just to record my steps

        also: equation for size could be -sqrt(r)+initialPixels, its a radical function but that sucks it's output would eventually
        be negative. I need to find a rational function with a limit of y=0, where the y intercept is the initialPixels. 
        Maybe 1/(r+initialPixels) but idk. Update: took some time to test with a graphing calculator and this function looks good:
        f(r)=1/(.25*sqrt(r)+1/initialPixels) as the coefficient of sqrt(r) goes up, the size changes quicker
        */

        //if(newOpacity<1.1){//this makes a sphere (kinda), if opacity is too low just make the opacity 0, to remove outside points
        //   newOpacity = 0; //problem: the opacity calculation is cubic, not spheric, so when I remove the extra points it looks like 
        //   //a 4D cube? as I change the value in the if statement it changes shapes
        //}else{
        //    newOpacity = 1;
        //}
        square.opacity = newOpacity; //set new opacity per square
        square.size = newSize+2; //set new size per square

        //change opacity and size of the cubes 
        SQUARE.style.backgroundColor = `rgba(243, 146, 202,${square.opacity})`; //make the squares darker as they get further away
        SQUARE.style.width = `${square.size}px`; //!make the squares smaller as they get further away
        SQUARE.style.height = `${square.size}px`; //!^
    }

    //make a red outline around the cube:
    let squareFirstOrLast = (square.Xindex == 0 || square.Xindex == width);
    let lineFirstOrLast = (square.Yindex == 0 || square.Yindex == width);
    let sliceFirstOrLast = (square.Zindex == 0 || square.Zindex == width);
    if (lineFirstOrLast && squareFirstOrLast) { //make other edges red
        SQUARE.style.backgroundColor = `rgba(255, 0, 0,${1 - ((square.Zindex - 3) / width)})`;
    }
    if (sliceFirstOrLast && (lineFirstOrLast || squareFirstOrLast)) { //make first and last face's edges red
        SQUARE.style.backgroundColor = `rgba(255, 0, 0,${1 - ((square.Zindex - 3) / width)})`;
    }

    WINDOW.appendChild(SQUARE);

    return;
}

//calculate distance between squares based on how deep in the cube the square is
function calculateSquareDistance(Zindex) { // x**0 == 1 so first case still works
    return (totalDistance * ((.5 ** (1 / width)) ** Zindex) / width); //shorten distances between squares in subsequent slices
}//cube size will always remain the same by dynamically changing the factor by which squareDistance is shrunken
//personal note: precalc function modelling actually helped me here lol ((xroot(.5))**z)/x would have a limit, and that limit is the end of the cube

function outputCube() {
    let squareDistance = 0; //starting square distance
    let sliceLocation = 0;  //keeps track of where current slice will be printed, first slice/line/square starts at the top left
    let squareYCoord = 0;   //keeps track of where current line will be printed in the slice, first line at the start of the slice
    let squareXCoord = 0;   //keeps track of where current square will be printed in the line, first square at the start of the line
    //let indices = [0, 0, 0]; //keeps track of indices of slices, lines, and squares in that order, changes per square
    //calculateCube(width);
    class Square { //each individual point has its own square object
        constructor(size, color, indices, squareXCoord, squareYCoord) {
            this.opacity = 5; //removed it from parameters because it was constant and cluttered the args in new Square(...)
            this.size = size;
            this.color = color;
            this.indices = indices; //incase I need all indices at once, I won't have to call the other 3 keys
            this.Zindex = indices[0]; //index in Z direction, ie: slices forward
            this.Yindex = indices[1]; //index in Y direction, ie: lines downward
            this.Xindex = indices[2]; //index in X direction, ie: squares to the right
            this.marginLeft = squareXCoord;  //X pixel position of square
            this.marginTop = squareYCoord;     //Y pixel position of square
        }
    }

    function lineDisplacement() { //this is the gap added to each subsequent line
        return ((totalDistance - squareDistance * width) / 2);
    }

    if (width < 2) {
        console.log("use more points to see the center");
    }
    // calculate and print the cube
    for (let i = 0; i < width + 1; i++) { // turn this into recursion or width^3 somehow, current way is just too slow
        squareDistance = calculateSquareDistance(i); //goes at start of each slice, each one has unique distance
        sliceLocation = lineDisplacement(); //this is how much to move each slice, changes per slice
        squareYCoord = sliceLocation; //squareYCoord is the line location, which is also each square's Y coordinate

        for (let j = 0; j < width + 1; j++) {
            squareXCoord = sliceLocation; //position of first square of each line

            for (let k = 0; k < width + 1; k++) {
                const square = new Square(9, "red", [i,j,k], squareXCoord, squareYCoord); //make square object
                printSquare(square); //print square
                squareXCoord += squareDistance; //next square's position relative to the left side of the image, goes after each square is printed
            }
            squareYCoord += squareDistance;
        }
    }

    return;
}

outputCube();