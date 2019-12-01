//first fit- goes through memory and finds first chunk of memory that is free and large enough to contain it

var table;
var totalMemoryInput; // input element for total memory
var totalMemorySize = 4096; // page loads at 4096- this changes on first input
var remainingSpace = 4096;
var memoryImageAsArray = []; // holds memory and blank space [name,size,empty/full]
//element 0 will always be the amount of free space

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
        removeOSMemoryBlock();
    } else {
        removeOSMemoryBlock(); //removes by image
        var processName = "OS";
        removeExistingProcessByName(processName); //removes by name
        removeFreeSpaceBlock(); //removes from image
        addToMemoryArray(processName, OSMemory);
        calculateRemainingSpace();
        var row = addNewRow(OSMemory, processName + " " + OSMemory + "K");
        row.style.backgroundColor = "#ffffcc"; // changes the color of the OS process
        console.log(memoryImageAsArray)
    }
}

function inputNewProcess() {
    var processName = document.getElementById("processesID").options[document.getElementById("processesID").value - 1].text;
    var processSize = document.getElementById("processSizeInput").value;
    if (processSize.includes(" ") || isNaN(parseFloat(processSize))) {
        window.alert("There was an error in the size of your process. Your process size must not contain spaces. Please try again.");
    } else if (parseFloat(processSize) > totalMemorySize) {
        window.alert("The process size cannot exceed the total memory size. Please try again.");
    } else {
        removeExistingProcessByName(processName);
        addToMemoryArray(processName, Number(processSize));
        calculateRemainingSpace();
        addNewRow(processSize, processName);
    }
}

function addToMemoryArray(processName, processSize) {
    var hole = findEmptyHoleBigEnough(processSize);
    var arr = [processName, processSize, 1];
    if (hole == 0) { //if the hole is at [0], then add the process to the end of the array
        memoryImageAsArray.push(arr);
    } else { // otherwise, insert at the element chosen and shift the rest down. 
        var arr = [processName, processSize, 1];
        memoryImageAsArray.splice(hole, 0, arr);
    }
}

function calculateRemainingSpace() {
    var processSizes = [];
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][2] == 1) { // if the section is full, add it to the process sizes array
            processSizes.push(memoryImageAsArray[i][1]);
        }
    }
    var processSum = processSizes.reduce((a, b) => a + b, 0);
    remainingSpace = totalMemorySize - processSum;
    var elementToUpdate = findFreeSpaceElement();
    memoryImageAsArray[elementToUpdate][1] = remainingSpace;
}

function removeExistingProcessByName(processName) {
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][0] == processName) {
            memoryImageAsArray.splice(i, 1);
        }
    }
}

function findEmptyHoleBigEnough(processSize) {
    for (let i = 0; i < memoryImageAsArray.length; i++) {
        if (memoryImageAsArray[i][2] == 0) { //if the hole is not full
            if (memoryImageAsArray[i][1] >= processSize) { //if the hole is big enough
                return i;
            }
        }
    }
    window.alert("There is no empty space available for your process. You may try to compact to make more room for your process.")
}

function addNewRow(processSize, name) {
    var sizePercentage = (parseInt(processSize) / parseInt(remainingSpace)) * 100; //calculates the percent of memory that the OS takes up
    var rowCount = table.rows.length; //gets the number of rows 
    var row = table.insertRow(rowCount); //inserts a new row at the next available location
    var size = sizePercentage.toString() + "%"; //attaches the unit to the measurement
    remainingSpaceSize = 100 - parseFloat(sizePercentage); //finds other percent for the blank space/remaining
    row.style.height = size; // sets row height
    row.style.backgroundColor = "#ffe6ff"; // changes the color of the process
    insertProcessLabel(row, name, size);
    addRemainingMemoryBlock(remainingSpaceSize);
    return row;
}

function insertProcessLabel(row, label, size) {
    var cell = row.insertCell(0);
    cell.innerHTML = label;
    cell.style.height = size;
}

function addRemainingMemoryBlock(remainingPercent) { // adds invisible memory block (for formatting)
    var remainingSpaceSize = remainingPercent + "%"; // makes it a percent
    var rowCount = table.rows.length; // gets the number of rows 
    var row2 = table.insertRow(rowCount); // inserts a new row at the next available location
    row2.style.height = remainingSpaceSize;
}

function removeOSMemoryBlock() { // removes the row if it is the one that contains OS Process
    $('#memoryTable td:contains("OS")').parents("tr").remove();
}

function removeFreeSpaceBlock() {
    $('#memoryTable td:contains("free")').parents("tr").remove();

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