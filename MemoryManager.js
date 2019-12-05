//first fit- goes through memory and finds first chunk of memory that is free and large enough to contain it

var table; // stores the main memory table
var totalMemoryInput; // input element for total memory
var totalMemorySize = 4096; // page loads at 4096- this changes on first input
var remainingSpace = 4096; // originally is empty so initializes to totalMemorySize
var memoryImageAsArray = []; // holds memory and blank space [name, size, empty/full]
memoryImageAsArray[0] = ["free", totalMemorySize, 0]; // initializes image as all free space 

// .....................................................UNIVERSAL FUNCTIONS......................................................

function onLoad() {
    table = document.getElementById("memoryTable");
    totalMemoryInput = document.getElementById("totalMemInput");
}

function removeAllRows() { //resets memory image to have nothing inserted
    $("#memoryTable").empty();
}

function findFreeSpaceElement() { // returns int of the element that takes care of free space
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == "free") {
            return i;
        }
    }
}

function processPreviouslyAdded(processName) { //finds if a process is already in the array
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == processName) {
            return true;
        }
    }
}

function combineAdjacentEmpty(index1, index2) {
    console.log(memoryImageAsArray);

    var elem1 = memoryImageAsArray[index1];
    var elem2 = memoryImageAsArray[index2];
    elem1[1] == elem1[1] + elem2[1];
    console.log(memoryImageAsArray);
    memoryImageAsArray.splice(index2, 0);
    console.log(memoryImageAsArray);
}

function getTotalSize() { // gets the total inputted size and sets it at the bottom of the image
    if (totalMemoryInput.value == "") {
        window.alert("Please insert a value greater than 0 for the total memory size. <br> NOTE: Decimals are not accepted. Please input whole integer numbers greater than 0 only.")
    } else {
        totalMemorySize = totalMemoryInput.value;
        totalMemorySizeTag = totalMemoryInput.value + "K"; // the name changes as you type
        document.getElementById("totalSizeTag").innerHTML = totalMemorySizeTag; // sets the text on the page
        var elemToChange = findFreeSpaceElement(); // gets element index
        memoryImageAsArray[elemToChange][1] = Number(totalMemoryInput.value); // changes the size (name and isFull stays the same)
    }
    calculateRemainingSpace();
    recreateImage();
}

function removeExistingProcessByName(processName) { //removes process from array and shifts to cover the empty hole
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == processName) {
            memoryImageAsArray.splice(i, 1);
        }
    }
}

function calculateRemainingSpace() {
    var processSizes = [];
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][2] == 1) { // if the section is full, add it to the process sizes array
            processSizes.push(memoryImageAsArray[i][1]);
        }
    }
    var processSum = processSizes.reduce((a, b) => a + b, 0); //adds all processes in array
    remainingSpace = totalMemorySize - processSum;
    var elementToUpdate = findFreeSpaceElement();
    memoryImageAsArray[elementToUpdate][1] = remainingSpace;
}

function inputNewProcess() {
    var processName = document.getElementById("processesID").options[document.getElementById("processesID").value - 1].text;
    var processSize = document.getElementById("processSizeInput").value;
    if (processSize.includes(" ") || isNaN(parseFloat(processSize))) {
        window.alert("There was an error in the size of your process. Your process size must not contain spaces. Please try again.");
    } else if (processPreviouslyAdded(processName)) { //if a process is already existing, it can't be added again
        window.alert("That process is already in memory. Please try again.");
    } else if (parseFloat(processSize) > totalMemorySize) {
        window.alert("The process size cannot exceed the total memory size. Please try again.");
    } else {
        var selected = document.getElementById("algorithmDropDown");
        var alg = selected.options[selected.selectedIndex].text;
        if (alg == "First Fit") {
            if (addToMemoryArrayFF(processName, Number(processSize)) == true) {
                calculateRemainingSpace();
                addNewRowFF(processSize, processName);
                addRemainingMemoryBlock();
            }
        } else if (alg == "Worst Fit") {
            if (addToMemoryArrayWF(processName, Number(processSize)) == true) {
                calculateRemainingSpace();
                addNewRowWF(processSize, processName);
                addRemainingMemoryBlock();
            }
        } else if (alg == "Best Fit") {

        }
        recreateImage(); //recreates memory image with the correct sizes/colors
    }
}

function compactMemory() { //will remove all empty space from the array and add it all to element[0] (free space), then recreate the image
    var extraSpace = 0;
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][2] == 0 && memoryImageAsArray[i][0] != "free") {
            extraSpace += memoryImageAsArray[i][1];
            memoryImageAsArray.splice(i, 1); // removes the free space
        }
    }
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == "free") {
            memoryImageAsArray[i][1] == extraSpace;
        }
    }
    calculateRemainingSpace();
    recreateImage();
}

function removeProcess() {
    var processName = document.getElementById("processesID").options[document.getElementById("processesID").value - 1].text;
    var removed = 0;
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == processName) {
            memoryImageAsArray[i][0] = "empty"; // removes process name
            memoryImageAsArray[i][2] = 0; // signals as not full
            var row = document.getElementById(processName);
            row.style.backgroundColor = "#003399"; // changes the color of the process
            removed = 1;
        }
    }
    if (removed == 0) { //if nothing was removed 
        window.alert("Process " + processName + " is not in memory and therefore cannot be removed.");
    }
}

// .....................................................UNIVERSAL GRAPHIC ALTERING FUNCTIONS......................................................
function recreateImage() { // remakes the entire image
    removeAllRows();
    var indexOfFree = 0;
    for (let i = 1; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] != "free") { // add all except free space, because that should be at bottom
            addNewRowFF(memoryImageAsArray[i][1], memoryImageAsArray[i][0]);
        } else {
            indexOfFree = i; //remember which index free space is 
        }
    }
    addNewRowFF(memoryImageAsArray[indexOfFree][1], memoryImageAsArray[indexOfFree][0]); //add free space last
}

function insertProcessLabel(row, label, size) {

    var cell = row.insertCell(0);
    if (label != "free") {
        cell.class = "boxshadow";
    }
    cell.innerHTML = label;
    cell.style.height = size;
    cell.style.textAlign = "center";
    if (label = "free") { //makes the label invisible if it is 'free' 
        cell.style.color = "#003399";
    }
}

function addRemainingMemoryBlock() { // adds invisible memory block (for formatting)
    if (remainingSpaceSize != 0) { //won't add any block if there is no remaining space
        remainingSpaceSize = remainingSpaceSize + "%"; // makes it a percent
        var rowCount = table.rows.length; // gets the number of rows 
        var row2 = table.insertRow(rowCount); // inserts a new row at the next available location
        row2.style.height = remainingSpaceSize;
        insertProcessLabel(row2, "free", remainingSpaceSize);
    }
}

function calculateRemainingSpace() {
    var processSizes = [];
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][2] == 1) { // if the section is full, add it to the process sizes array
            processSizes.push(memoryImageAsArray[i][1]);
        }
    }
    var processSum = processSizes.reduce((a, b) => a + b, 0); //adds all processes in array
    remainingSpace = totalMemorySize - processSum;
    var elementToUpdate = findFreeSpaceElement();
    memoryImageAsArray[elementToUpdate][1] = remainingSpace;
}

function removeBlockByName(processName) { //removes row from image 
    var stringPass = '#memoryTable td:contains("' + processName + '")';
    $(stringPass).parents("tr").remove();
}

// ......................................................FIRST FIT......................................................
function findEmptyHoleBigEnough(processSize) {
    for (let i = 1; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][2] == 0) { //if the hole is not full
            if (memoryImageAsArray[i][1] >= processSize) { //if the hole is big enough
                return i;
            }
        }
    }
    if (memoryImageAsArray[0][1] >= processSize) { // if there isn't a hole, then check if the bottom free space is available
        return 0;
    }
    window.alert("There is no empty space available for your process. You may try to compact to make more room for your process.")
}

function addToMemoryArrayFF(processName, processSize) {
    var hole = findEmptyHoleBigEnough(processSize); // index of where it should be added
    if (hole != undefined) { //prevents a process that is too large from being added (too large = undefined)
        var arr = [processName, processSize, 1];
        if (hole == 0) { // if the hole is at [0], then add the process to the end of the array
            memoryImageAsArray.push(arr);
            calculateRemainingSpace();
        } else { // otherwise, insert at the element chosen and shift the rest down. 
            var arr = [processName, processSize, 1];
            if (processSize != memoryImageAsArray[hole][1]) {
                var oldSize = memoryImageAsArray[hole][1];
                var newSize = processSize;
                var newRemaining = oldSize - newSize;
                memoryImageAsArray.splice(hole, 0, arr);
                arr2 = ["empty", newRemaining, 0];
                memoryImageAsArray.splice(hole + 1, 1, arr2);
            } else {
                memoryImageAsArray.splice(hole, 1, arr);
            }
        }
        return true;
    } else {
        return false;
    }
}

// .....................................................FIRST FIT GRAPHIC ALTERING FUNCTIONS......................................................

function addNewRowFF(processSize, name) {
    removeBlockByName("free");
    var sizePercentage = (parseInt(processSize) / parseInt(totalMemorySize)) * 100; //calculates the percent of memory that the OS takes up
    var index = 0;
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == name) {
            index = i;
        }
    }
    var row = table.insertRow(index - 1); //inserts a new row at the next available location
    var size = sizePercentage.toString() + "%"; //attaches the unit to the measurement
    remainingSpaceSize = 100 - parseFloat(sizePercentage); //finds other percent for the blank space/remaining
    row.id = name;
    row.style.height = size; // sets row height

    if (name == "empty" || name == "free") { //makes the color the same as the background if it is not a process 
        row.style.backgroundColor = "#003399";
    } else {
        row.style.backgroundColor = "#ffe6ff"; // changes the color of the process
    }
    var processName = name + " Size: " + processSize + "K";
    insertProcessLabel(row, processName, size);
    return row;
}

// ......................................................WORST FIT......................................................

function addToMemoryArrayWF(processName, processSize) {
    //add to biggest hole first. 
    var hole = findWorstHole(processSize); // index of where it should be added
    if (hole != undefined) { //prevents a process that is too large from being added (too large = undefined)
        var arr = [processName, processSize, 1];
        if (hole == 0) { // if the hole is at [0], then add the process to the end of the array
            memoryImageAsArray.push(arr);
        } else { // otherwise, insert at the element chosen and shift the rest down. 
            var arr = [processName, processSize, 1];
            if (processSize != memoryImageAsArray[hole][1]) {
                var oldSize = memoryImageAsArray[hole][1];
                var newSize = processSize;
                var newRemaining = oldSize - newSize;
                memoryImageAsArray.splice(hole, 0, arr);
                arr2 = ["empty", newRemaining, 0];
                memoryImageAsArray.splice(hole + 1, 1, arr2);
            } else {
                memoryImageAsArray.splice(hole, 1, arr);
            }
        }
        return true;
    } else {
        return false;
    }
}

function findWorstHole(processSize) {
    var largestHoleSize = 0;
    var largestHoleIndex = 0;
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][2] == 0 && memoryImageAsArray[i][1] >= processSize) { //if the hole is not full
            if (memoryImageAsArray[i][1] > largestHoleSize) {
                largestHoleSize = memoryImageAsArray[i][1];
                largestHoleIndex = i;
            }
        }
    }
    if (largestHoleSize == 0) {
        window.alert("There is no empty space available for your process. You may try to compact to make more room for your process.")
    } else {
        return largestHoleIndex;
    }
}

// .....................................................FIRST FIT GRAPHIC ALTERING FUNCTIONS......................................................

function addNewRowWF(processSize, name) {
    removeBlockByName("free");
    var sizePercentage = (parseInt(processSize) / parseInt(totalMemorySize)) * 100; //calculates the percent of memory that the OS takes up
    var index = 0;
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == name) {
            index = i;
        }
    }
    var row = table.insertRow(index - 1); //inserts a new row at the next available location
    var size = sizePercentage.toString() + "%"; //attaches the unit to the measurement
    remainingSpaceSize = 100 - parseFloat(sizePercentage); //finds other percent for the blank space/remaining
    row.id = name;
    row.style.height = size; // sets row height

    if (name == "empty" || name == "free") { //makes the color the same as the background if it is not a process 
        row.style.backgroundColor = "#003399";
    } else {
        row.style.backgroundColor = "#ffe6ff"; // changes the color of the process

    }
    insertProcessLabel(row, name, size);
    return row;
}