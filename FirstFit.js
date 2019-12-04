//first fit- goes through memory and finds first chunk of memory that is free and large enough to contain it

var table;
var totalMemoryInput; // input element for total memory
var totalMemorySize = 4096; // page loads at 4096- this changes on first input
var remainingSpace = 4096; // originally is empty so initializes to totalMemorySize
var memoryImageAsArray = []; // holds memory and blank space [name,size,empty/full]

memoryImageAsArray[0] = ["free", totalMemorySize, 0]; // initializes image as all free space 

function onLoad() {
    table = document.getElementById("memoryTable"); //gets memory image 
    totalMemoryInput = document.getElementById("totalMemInput");
}

function getTotalSize() { // gets the total inputted size and sets it at the bottom of the image
    totalMemorySize = document.getElementById("totalSizeTag").innerHTML;
    if (totalMemoryInput.value == "") {
        window.alert("Please insert a value greater than 0 for the total memory size. <br> NOTE: Decimals are not accepted. Please input whole integer numbers greater than 0 only.")
    } else {
        totalMemorySizeTag = totalMemoryInput.value + "K"; // the name changes as you type
        document.getElementById("totalSizeTag").innerHTML = totalMemorySizeTag; // sets the text on the page
        var elemToChange = findFreeSpaceElement(); // gets element #
        memoryImageAsArray[elemToChange][1] = Number(totalMemoryInput.value); // changes the size (name and isFull stays the same)
    }
}

function inputOSMemory() {
    var OSMemory = parseInt(document.getElementById("OSMemory").value); //gets the size of the OS memory
    if (parseInt(OSMemory) > parseInt(totalMemorySize)) { // makes sure OS memory is less than Total Memory
        window.alert("The OS Memory cannot be greater than the total memory, please review the inputs and try again.")
    } else if (totalMemoryInput.value == "") { // makes sure that the number typed is an integer
        window.alert("Please insert a value greater than 0 for the total memory size. <br> NOTE: Decimals are not accepted. Please input whole integer numbers greater than 0 only.")
    } else if (isNaN(OSMemory)) { //if there is no input for the OS, remove the OS
        removeBlockByName("OS"); //removes from image
    } else {
        var processName = "OS"
        var processSize = OSMemory;
        removeBlockByName("OS"); //removes from image
        removeExistingProcessByName("OS"); //removes from array 
        calculateRemainingSpace(); //figures out how much room there is now, if the OS is being replaced. 
        addToMemoryArray(processName, Number(processSize)); //adds the OS to the array
        calculateRemainingSpace(); //figures out how much room there is now that the OS WAS replaced
        var row = addNewRow(processSize, processName); // adds it to the image
        addRemainingMemoryBlock(); //adds the blank space to the memory block
        row.style.backgroundColor = "#ffffcc"; // changes the color of the OS process so it is different from other processes
    }
}

function processPreviouslyAdded(processName) { //finds if a process is already in the array
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == processName) {
            return true;
        }
    }
}

function removeProcess() {
    var processName = document.getElementById("processesID").options[document.getElementById("processesID").value - 1].text;
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == processName) {
            memoryImageAsArray[i][0] = "empty"; // removes process name
            memoryImageAsArray[i][2] = 0; // signals as not full
        }
    }
    var row = document.getElementById(processName);
    row.style.backgroundColor = "#003399"; // changes the color of the process
}

function compactMemory() {
    //will remove all empty space from the array and add it all to element[0] (free space), then recreate the image
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
    recreateImage();
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
        removeExistingProcessByName(processName);
        removeBlockByName(processName);
        if (addToMemoryArray(processName, Number(processSize)) == true) {
            calculateRemainingSpace();
            addNewRow(processSize, processName);
            addRemainingMemoryBlock();
        }
    }
    recreateImage(); //recreates memory image with the correct sizes/colors
}

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

function addToMemoryArray(processName, processSize) {
    var hole = findEmptyHoleBigEnough(processSize); // index of where it should be added
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

function recreateImage() { // remakes the entire image
    removeAllRows();
    var indexOfFree = 0;
    for (let i = 1; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] != "free") { // add all except free space, because that should be at bottom
            addNewRow(memoryImageAsArray[i][1], memoryImageAsArray[i][0]);
        } else {
            indexOfFree = i; //remember which index free space is 
        }
    }
    addNewRow(memoryImageAsArray[indexOfFree][1], memoryImageAsArray[indexOfFree][0]); //add free space last
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

function removeExistingProcessByName(processName) { //removes process from array and shifts to cover the empty hole
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == processName) {
            memoryImageAsArray.splice(i, 1);
        }
    }
}

function addNewRow(processSize, name) {
    removeBlockByName("free");
    var sizePercentage = (parseInt(processSize) / parseInt(totalMemorySize)) * 100; //calculates the percent of memory that the OS takes up
    var index = 0;
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == name) {
            index = i;
        }
    }
    console.log(index);
    console.log(table.rows);
    var row = table.insertRow(index - 1); //inserts a new row at the next available location
    var size = sizePercentage.toString() + "%"; //attaches the unit to the measurement
    remainingSpaceSize = 100 - parseFloat(sizePercentage); //finds other percent for the blank space/remaining
    row.id = name;
    row.style.height = size; // sets row height

    if (name == "OS") {
        row.style.backgroundColor = "#ffffcc"; // changes the color of the OS process so it is different from other processes
    } else if (name == "empty" || name == "free") { //makes the color the same as the background if it is not a process 
        row.style.backgroundColor = "#003399";
    } else {
        row.style.backgroundColor = "#ffe6ff"; // changes the color of the process

    }
    insertProcessLabel(row, name, size);
    return row;
}

function insertProcessLabel(row, label, size) {
    var cell = row.insertCell(0);
    cell.innerHTML = label;
    cell.style.height = size;
    if (label = "free") { //makes the label invisible if it is 'free' 
        cell.style.color = "#003399";
    }
}

function addRemainingMemoryBlock() { // adds invisible memory block (for formatting)
    remainingSpaceSize = remainingSpaceSize + "%"; // makes it a percent
    var rowCount = table.rows.length; // gets the number of rows 
    var row2 = table.insertRow(rowCount); // inserts a new row at the next available location
    row2.style.height = remainingSpaceSize;
    insertProcessLabel(row2, "free", remainingSpaceSize);
}

function removeBlockByName(processName) { //removes row from image 
    var stringPass = '#memoryTable td:contains("' + processName + '")';
    $(stringPass).parents("tr").remove();
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