const BODY = document.body;
const WINDOW = document.getElementById("image"); //where cube will be output
//could use this to program a 3D game, or any video or graphic, I could change individual dots as if they were pixels
//and I could make them shrink or go invisible as well, which a regular display can't do. Moving the camera will be tough though,
//that involves a lot of math

//the bad thing about this program is that it doesn't actually take into account the Z coordinate, so I can't move things back and forth
//by an X number of pixels, all it uses is the Z index to calculate the X and Y coordinates. This is because the camera is static

let totalDistance = 800; //distance of entire cube
let width = 79; //width of cube in points, but the actual width of the cube will be width+1 so if width==9, the cube will be 10^3
//I've been doubling the default value as time and space are more efficiently used, started with 10^3 cube, then 20, 40, and now 80

function submitted() { //HTML form submit
    let input1 = document.getElementById("width"); //save width input
    let newWidth = Number(input1.value) - 1;
    width = newWidth;
    let input2 = document.getElementById("distance"); //save distance input
    let newDistance = Number(input2.value);
    totalDistance = newDistance;
    WINDOW.innerHTML = "";
    WINDOW.style.width = `${newDistance}px`;
    WINDOW.style.height = `${newDistance}px`;
    outputCube();
    return;
}

function render3D(square){ //render one of 3 example objects, plus an optional red outline of the cube
    const [x,y,z]=[square.Xindex,square.Yindex,square.Zindex] //to easily find the x,y,z index of each square. Note that the 
    //actual unit of measurement is defined by calculateSquareDistance(square.Zindex), this will return a pixel value for how far apart
    //the squares are depending on the Z level they're in, and the distance across the viewing window
    square.show=0;

    renderOutline = function(){//make a red outline around the cube:
        let squareFirstOrLast = (x == 0 || x == width);
        let lineFirstOrLast = (y == 0 || y == width);
        let sliceFirstOrLast = (z == 0 || z == width);
        if (lineFirstOrLast && squareFirstOrLast) { //make other edges red
            square.color = `rgba(255, 0, 0,${1 - ((square.Zindex - 3) / width)})`;
            square.show = 1
        }
        if (sliceFirstOrLast && (lineFirstOrLast || squareFirstOrLast)) { //make first and last face's edges red
            square.color = `rgba(255, 0, 0,${1 - ((square.Zindex - 3) / width)})`;
            square.show = 1
        }
    }
    //renderOutline()

    renderPrism = function(){ //prints a green prism at the bottom of the cube. Proof of concept for 3D rendering
        if(!(y==0||y==width)){ 
            if (x>width/5&&x<width*3/5){
                if(y>width*4/5){
                    if(z<width*3/5){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.show = 1
                    }
                }
            }
        }
    }
    //renderPrism()

    renderHi = function(){ //prints "HI"
        if(!(y==0||y==width||z==width)){//avoid edges, so they dont clash with cube outline
            if(z>width*4/5){ //only render at the back of the cube
                if (x<=width*3/20){ //H beam 1
                    if(y>=0){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.show=1
                    }
                }
                if (x>=width*6/20&&x<=width*9/20){ //H beam 2
                    if(y>=0){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.show=1
                    }
                }
                if (x>width*3/20&&x<width*6/20){ //H bar
                    if(y>=width*8/20&&y<=width*12/20){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.show=1
                    }
                }
                if (x>=width*13/20&&x<=width*16/20){ //I beam
                    if(y>=0){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.show=1
                    }
                }
                if (x>=width*11/20&&x<=width*18/20){ //I bar 1
                    if(y<=width*4/20){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.show=1
                    }
                }
                if (x>=width*11/20&&x<=width*18/20){ //I bar 2
                    if(y>width*16/20){
                        square.color=`rgba(0, 255, 0,${square.opacity})`
                        square.show=1
                    }
                }
            }
            
        }
    }
    renderHi()

    renderFirework = function(){
        //rendering firework code, to make the cube more opaque and smaller as it gets closer to the middle
        square.show = 1

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
            square.show=0
        }
        
        /*
        To-Do:
        equation for size could be -sqrt(r)+initialPixels, its a radical function but that sucks it's output would eventually
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

        
    }
    //renderFirework()
    renderOutline()
    return
}

function printSquare(square) {//prints each square
    render3D(square) //holds different example objects that can be rendered
    //################
    //####WARNING!#### if render3D(square) is removed, a default cube will appear where every dot is rendered, this eats up resources. 
    //################ please make sure to lower the initial width value beforehand, 20 or less is recommended

    if (square.show<1){ //if it is an unused square, it won't even have an element created. This saved so much time and space
        return 
    }
    
    const SQUARE = document.createElement("div");
    square.render(SQUARE); //change the properties of each square element based on how I want it rendered

    WINDOW.appendChild(SQUARE);

    return;
}

//calculate distance between squares based on how deep in the cube the square is
function calculateSquareDistance(Zindex) { // x**0 == 1 so first case still works
    return (totalDistance * ((.5 ** (1 / width)) ** Zindex) / width); //shorten distances between squares in subsequent slices
}//cube size will always remain the same by dynamically changing the factor by which squareDistance is shrunken
//personal note: precalc function modelling actually helped me here lol ((xroot(.5))**z)/x would have a limit, and that limit is the end of the cube

function outputCube() { //makes the cube's individual square objects, then calls printSquare() to display each one
    let squareDistance = 0; //starting distance between squares, 0 so it lines up with the top left
    let sliceLocation = 0;  //keeps track of where current slice will be printed, first slice/line/square starts at the top left
    let squareYCoord = 0;   //keeps track of where current line will be printed in the slice, first line at the start of the slice
    let squareXCoord = 0;   //keeps track of where current square will be printed in the line, first square at the start of the line

    class Square { //each individual point has its own square object
        constructor(size, color, indices, squareXCoord, squareYCoord) {
            this.show = 1; //if == 0, don't render square element
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
        
        render(element){ //element is the SQUARE element defined in printSquare()
            element.classList.add("square");

            element.style.marginLeft = `${this.marginLeft}px`;//distance between squares
            element.style.marginTop = `${this.marginTop}px`; //distance between lines
            element.style.zIndex = `${width-this.Zindex}px`; //move forwards in Z direction to avoid collision of elements
            //change opacity and size of the squares
            element.style.width = `${this.size}px`; 
            element.style.height = `${this.size}px`; 
            element.style.backgroundColor = `${this.color}`;
        }
    }

    if (width < 2) {
        console.log("use more points to see the center");
    }
    // calculate and print the cube
    for (let z = 0; z < width + 1; z++) { // turn this into recursion or width^3 somehow, current way is just too slow
        squareDistance = calculateSquareDistance(z); //goes at start of each slice, each one has unique distance
        sliceLocation = (totalDistance - squareDistance * width) / 2; //this is how much to move each slice, changes per slice
        squareYCoord = sliceLocation; //squareYCoord is the line location, which is also each square's Y coordinate

        for (let y = 0; y < width + 1; y++) {
            squareXCoord = sliceLocation; //position of first square of each line

            for (let x = 0; x < width + 1; x++) {
                const square = new Square(12, `rgba(243, 146, 202,1)`, [z,y,x], squareXCoord, squareYCoord); //make square object
                printSquare(square); //print square
                squareXCoord += squareDistance; //next square's position relative to the left side of the image, goes after each square is printed
            }
            squareYCoord += squareDistance;
        }
    }

    return;
}

outputCube();