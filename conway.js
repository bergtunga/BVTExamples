//Grid Functions, data
let gridWidth = 20*3, gridHeight = 15 *3;
//let gridWidth = 10, gridHeight = 10;
function getGridWidth(){
    return gridWidth;
}
function getGridHeight(){
    return gridHeight;
}
document.getElementById("width-form").previousElementSibling.innerHTML=`Width (default ${getGridWidth()})`;
document.getElementById("width-form").placeholder = `${getGridWidth()}`;
document.getElementById("width-form").value = getGridWidth();
document.getElementById("height-form").previousElementSibling.innerHTML=`Height (default ${getGridHeight()})`;
document.getElementById("height-form").placeholder = `${getGridHeight()}`;
document.getElementById("height-form").value = getGridHeight();

//Setup
let golContent = document.getElementById("game-of-life-content");

let button = document.createElement("button");
button.classList.add("btn", "cell", "cell-dead");
button.style.marginTop = "-20px";
//button.style.marginBottom = "-10px";
let br = document.createElement("br");
//br.style.padding = "-10px";
//br.style.width = 0;
//br.style.height = 0;

//Done this way because I skipped the DOM project
let lastAdd;
let cellListener = function(event){
    let classlist = event.target.classList;
    if(classlist.contains("cell-dead")){
        classlist.replace("cell-dead", "cell-alive");
    }else if(classlist.contains("cell-alive")){
        classlist.replace("cell-alive", "cell-dead");
    }else if(classlist.contains("cell-lock-dead")){

    }else if(classlist.contains("cell-lock-alive")){

    }
    event.preventDefault();
}
for(let i = 0; i < getGridHeight(); i++){
    for(let j = 0; j < getGridWidth(); j++){
        golContent.appendChild(lastAdd = button.cloneNode());
        lastAdd.addEventListener("click", cellListener);
    }
    button.style.marginTop = -20 - (i+1)*(20+10) +"px";
    //button.style.marginLeft = j*-1 + "px";
    golContent.appendChild(br.cloneNode());
}


//Start, Stop, Step buttons
document.getElementById("step").addEventListener("click", event =>{
    step();
});
let intervalID = null, intervalAmount = 1000;
document.getElementById("start").addEventListener("click", event =>{
    let source = event.srcElement || event.originalTarget;
    if(source.innerHTML === "Run"){
        intervalID = setInterval(step, intervalAmount);
        source.innerHTML = "Stop";
    }else {
        clearInterval(intervalID);
        intervalID = null;
        source.innerHTML = "Run";
    }
});

//Speed control
document.getElementById("speed-form").addEventListener("change", event =>{
    intervalAmount = parseInt((event.srcElement || event.originalTarget).innerHTML);
    if(intervalID != null){
        clearInterval(intervalID);
        intervalID = setInterval(step, intervalAmount);
    }
});

//Size control
document.getElementById("size-change").addEventListener("click", event => {
    let newHeight = parseInt(document.getElementById("height-form").value);
    let newWidth = parseInt(document.getElementById("width-form").value);
    console.log(newHeight, newWidth);
    if(newWidth != gridWidth){
        //Decrease width
        let brs = Array.from(golContent.childNodes).map((elem, indx) => elem.nodeName == "BR"? elem: '').filter(String);
        if(newWidth < gridWidth){
            let rmvCnt = gridWidth - newWidth;
            console.log("removing w " + rmvCnt);
            for(elem of brs){
                console.log(elem)
                for(let i = 0; i < rmvCnt; i++){
                    golContent.removeChild(elem.previousElementSibling);
                }
            }
        }else{ // Expand Width
            let addCnt = newWidth - gridWidth;
            console.log("adding w " + addCnt);
            for(elem of brs){
                console.log(elem);
                for(let i = 0; i < addCnt; i++){
                    let newElem = elem.previousElementSibling.cloneNode();
                    newElem.classList.replace("cell-alive", "cell-dead");
                    newElem.addEventListener("click", cellListener);
                    golContent.insertBefore(newElem , elem);
                }
            }
        }
        gridWidth = newWidth;
    }
    if(newHeight != gridHeight){
        if(newHeight < gridHeight){
            for(let i = gridHeight-newHeight; i > 0;){
                if(golContent.lastChild.nodeName == "BR") i--;
                golContent.removeChild(golContent.lastChild);
            }
        }else {
            for(let i = 0; i < newHeight-gridHeight; i++){
                for(let j = 0; j < getGridWidth(); j++){
                    golContent.appendChild(lastAdd = button.cloneNode());
                    lastAdd.addEventListener("click", cellListener);
                }
                button.style.marginTop = -20 - (i+gridHeight+1)*(20+10) +"px";
                golContent.appendChild(br.cloneNode());
                //button.style.marginLeft = j*-1 + "px";
            }
        }
        gridHeight = newHeight;
    }
});

console.log("finished Preloading");

function toGrid(){
    let grid = [];
    let gridMember = [];
    Array.from(golContent.children).forEach(member =>{
        if(member.nodeName =="BR"){
            grid.push(gridMember);
            gridMember = [];
        }else{ // is cell
            if(member.classList.contains("cell-dead") ||
                member.classList.contains("cell-lock-dead")){
                    gridMember.push(false);
            }else{
                gridMember.push(true);
            }
        }
    });
    //console.log(grid);
    return grid;
}
function step(){
    let grid = toGrid();
    //Make new Grid
    let newGrid = new Array(grid.length);
    for(let i = 0; i < grid.length; i++){
        newGrid[i] = new Array(grid[i].length);
    }
    //Populate new Grid
    for(let i = 0; i < newGrid.length; i++){
        for(let j = 0; j< newGrid[i].length; j++){
            let y = i, x = j;
            let neighbors;
            try{
                neighbors = countNeighbors(grid, x, y);
            }catch(Error){
                console.log(`error at ${x}, ${y}`);
                continue;
            }
            if(grid[y][x]){
                if(neighbors < 2 || neighbors > 3)
                    newGrid[y][x] = false;
                else newGrid[y][x] = true;
            }else if(neighbors == 3){
                newGrid[y][x] = true;
            }else
                newGrid[y][x] = false;
        }
    }
    //Display
    let x = 0; y = 0;
    Array.from(golContent.children).forEach(member =>{
        let cl = member.classList;
        if(member.nodeName =="BR"){
            y++;
            x=0;
        }else{ // is cell
            if((cl.contains("cell-dead") || cl.contains("cell-lock-dead")) && //Cell dead
                newGrid[y][x]){ //Should be alive
                    cl.replace("cell-dead", "cell-alive");
                    cl.replace("cell-lock-dead", "cell-alive");
                    //Swap dead to live
            }else if((cl.contains("cell-alive") || cl.contains("cell-lock-alive")) &&
                !newGrid[y][x]){
                    cl.replace("cell-alive", "cell-dead");
                    cl.replace("cell-lock-alive", "cell-dead");
                    //Swap live to dead

            }//else do Nothing
            x++;
        }
    });
}
function countNeighbors(grid, x, y){
    let count = 0;
    let rowAbove = y-1 >= 0;
    let rowBelow = y+1 < grid.length;
    let columnLeft = x-1 >= 0;
    let columnRight = x+1 < grid[0].length;
    if(columnLeft){ // 3 left
        if(rowAbove && grid[y-1][x-1])   count++; //Top left
        if(            grid[y][x-1])     count++; //Direct left
        if(rowBelow && grid[y+1][x-1])   count++; // bottom left
    }
    if(rowAbove     && grid[y-1][x])   count++; //Top center
    if(rowBelow     && grid[y+1][x])   count++; // bottom center
    if(columnRight){ // 3 right
        if(rowAbove && grid[y-1][x+1])   count++; //Top right
        if(            grid[y][x+1])     count++; //Direct right
        if(rowBelow && grid[y+1][x+1])   count++; // bottom right
    }
    return count;
}