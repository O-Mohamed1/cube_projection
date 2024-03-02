const BODY = document.body;
const WINDOW = document.getElementById("image"); //where cube will be output
//could use this to program a 3D game, or any video or graphic, I could change individual dots as if they were pixels
//and I could make them shrink or go invisible as well, which a regular display can't do. Moving the camera will be tough though,
//that involves a lot of math

let totalDistance = 800; //distance of entire cube
let width = 39; //width of cube in points, but the actual width of the cube will be width+1 so if width==9, the cube will be 10^3

function submitted() {
    let input1 = document.getElementById("width"); //save width input
    let newWidth = Number(input1.value) - 1;
    width = newWidth;
    let input2 = document.getElementById("distance"); //save distance input
    let newDistance = Number(input2.value);
    totalDistance = newDistance;
    WINDOW.innerHTML = "";
    outputCube();
    return;
}

function render3D(square){
    const [x,y,z]=[square.Xindex,square.Yindex,square.Zindex]
    renderPrism = function(){ //prints a green prism at the bottom of the cube. Proof of concept for 3D rendering
        if(!(y==0||y==width)){ 
            if (x>width/5&&x<width*3/5){
                if(y>width*4/5){
                    if(z<width*3/5){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                    }
                }
            }
        }
    }

    //renderPrism()
    function renderHi(){ //prints "HI"
        if(!(y==0||y==width)){//avoid first and last lines, so they dont clash with cube outline
            if(z>width*4/5){ //only render at the back of the cube
                if (x<=width*3/20){ //H beam 1
                    if(y>=0){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.render=1
                    }
                }
                if (x>=width*6/20&&x<=width*9/20){ //H beam 2
                    if(y>=0){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.render=1
                    }
                }
                if (x>width*3/20&&x<width*6/20){ //H bar
                    if(y>=width*8/20&&y<=width*12/20){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.render=1
                    }
                }
                if (x>=width*13/20&&x<=width*16/20){ //I beam
                    if(y>=0){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.render=1
                    }
                }
                if (x>=width*11/20&&x<=width*18/20){ //I bar 1
                    if(y<=width*4/20){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.render=1
                    }
                }
                if (x>=width*11/20&&x<=width*18/20){ //I bar 2
                    if(y>width*16/20){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.render=1
                    }
                }
            }
            
        }
    }
    renderHi()
    function firework(){
        //rendering firework code, to make the cube more opaque and smaller as it gets closer to the middle
        square.render = 1

        let newSize = square.size;
        let newOpacity = square.opacity; //as this goes up the firework gets brighter
        const halfwayPoint = width / 2; //used to find the middle of the cube
        const [h,k,l]=[halfwayPoint,halfwayPoint,halfwayPoint]
        const radius = ((square.Zindex-h)**2+(square.Yindex-k)**2+(square.Xindex-l)**2)**(1/2)
        if(radius<0){
            radius*=-1;
        }

        newOpacity = 1/(radius-1); //make weird blue squares go away
        if (radius<=0){
            newSize = square.size;
            newOpacity=square.opacity
        }
        //actual units of distance is squareDistance | size coefficient makes it look the same as width increases
        newSize = calculateSquareDistance(radius)/((square.size/width*((radius)**(1/2))+ square.size/width)); //taking a value based on index then turning it into pixels
        if (radius <=0){ //need to invert the explosion
            newSize = square.size;
            newOpacity=square.opacity
        }
        if (radius>halfwayPoint){ //this makes a sphere based on radius, which should max out at width/2 at the sides
            newOpacity=0
        }
        
        /*
        To-Do:
        Found r by using equation of a sphere to find the radius, but I'm not sure how to make it look good if half my code
        relies on index and the other half relies on the actual pixel locations. Pushing this to main just to record my steps

        also: equation for size could be -sqrt(r)+initialPixels, its a radical function but that sucks it's output would eventually
        be negative. I need to find a rational function with a limit of y=0, where the y intercept is the initialPixels. 
        Maybe 1/(r+initialPixels) but idk. Update: took some time to test with a graphing calculator and this function looks good:
        f(r)=1/(.25*sqrt(r)+1/initialPixels) as the coefficient of sqrt(r) goes up, the size changes quicker

        Update: I'm still confused, now when theres an odd width, the opacity if statement spawns in a couple blue squares, no idea how,
        and the shrink function also doesn't really make sense, I don't know how to invert it so that the squares shrink only when they
        move away from the center. Do I put 1/radius somewhere in it? Or width/2-radius?
        */
        
        square.opacity = newOpacity; //set new opacity per square
        square.size = newSize; //set new size per square
        square.color=`rgba(243, 146, 202,${square.opacity})` //save color again with new opacity

        //change opacity and size of the squares
        SQUARE.style.backgroundColor = `${square.color}`; //make the squares darker as they get further away
        SQUARE.style.width = `${square.size}px`; 
        SQUARE.style.height = `${square.size}px`; 
    }
    //firework()
    
    return
}

function printSquare(square) {//prints each square
    //zIndex is a css property, Zindex is a property of custom Square class defined in outputCube() its confusing but zIndex ends up = to Zindex anyways
    render3D(square)

    //square.color = `rgba(243, 146, 202, 0)`//make all dots invisible by default
    
    
    if (square.render<1){
        return 
    }
    
    const SQUARE = document.createElement("div");
    SQUARE.classList.add("square");

    SQUARE.style.marginLeft = `${square.marginLeft}px`;//distance between squares
    SQUARE.style.marginTop = `${square.marginTop}px`; //distance between lines
    SQUARE.style.zIndex = `${width-square.Zindex}px`; //move forwards in Z direction to avoid collision of elements

    SQUARE.style.backgroundColor = `${square.color}`;

    //firework()

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

    class Square { //each individual point has its own square object
        constructor(size, color, indices, squareXCoord, squareYCoord) {
            this.render = 0; //if == 0, don't render square element, maybe add render method in square class
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
        
        // render = function(){
        //     const SQUARE = document.createElement("div");
        //     SQUARE.classList.add("square");

        //     SQUARE.style.marginLeft = `${square.marginLeft}px`;//distance between squares
        //     SQUARE.style.marginTop = `${square.marginTop}px`; //distance between lines
        //     SQUARE.style.zIndex = `${width-square.Zindex}px`; //move forwards in Z direction to avoid collision of elements
        // }
    }

    if (width < 2) {
        console.log("use more points to see the center");
    }
    // calculate and print the cube
    for (let i = 0; i < width + 1; i++) { // turn this into recursion or width^3 somehow, current way is just too slow
        squareDistance = calculateSquareDistance(i); //goes at start of each slice, each one has unique distance
        sliceLocation = (totalDistance - squareDistance * width) / 2; //this is how much to move each slice, changes per slice
        squareYCoord = sliceLocation; //squareYCoord is the line location, which is also each square's Y coordinate

        for (let j = 0; j < width + 1; j++) {
            squareXCoord = sliceLocation; //position of first square of each line

            for (let k = 0; k < width + 1; k++) {
                const square = new Square(12, `rgba(243, 146, 202,1)`, [i,j,k], squareXCoord, squareYCoord); //make square object
                printSquare(square); //print square
                squareXCoord += squareDistance; //next square's position relative to the left side of the image, goes after each square is printed
            }
            squareYCoord += squareDistance;
        }
    }

    return;
}

outputCube();