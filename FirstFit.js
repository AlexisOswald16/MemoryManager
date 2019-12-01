var table;
var totalMemoryInput; // input element for total memory
var totalMemorySize = 4096; // page loads at 4096- this changes on first input
var remainingMemorySize = 4096; // the amount of space remaining in the OS 

function onLoad() {
    table = document.getElementById("memoryTable"); //gets memory image 
    totalMemoryInput = document.getElementById("totalMemInput");
}

function getTotalSize() { // gets the total inputted size and sets it at the bottom of the image
    totalMemorySize = document.getElementById("totalSizeTag").innerHTML;
    if (totalMemoryInput.value == "") {
        window.alert("Please insert a value greater than 0 for the total memory size. <br> NOTE: Decimals are not accepted. Please input whole integer numbers greater than 0 only.")
    } else {
        totalMemorySize = totalMemoryInput.value + "K"; // the name changes as you type
        document.getElementById("totalSizeTag").innerHTML = totalMemorySize;
        remainingMemorySize = totalMemorySize;
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
        removeAllRows();
        var row = addNewRow(OSMemory, "OS");
        row.style.backgroundColor = "#ffffcc"; // changes the color of the OS process
    }
}

function addNewRow(processSize, name) {
    var sizePercentage = (parseInt(processSize) / parseInt(remainingMemorySize)) * 100; //calculates the percent of memory that the OS takes up
    var rowCount = table.rows.length; //gets the number of rows 
    var row = table.insertRow(rowCount); //inserts a new row at the next available location
    var size = sizePercentage.toString() + "%"; //attaches the unit to the measurement
    var remainingSpace = 100 - parseFloat(sizePercentage); //finds other percent for the blank space/remaining
    row.style.height = size; // sets row height
    row.style.backgroundColor = "#ffe6ff"; // changes the color of the process
    insertProcessLabel(row, name, size);
    addRemainingMemoryBlock(remainingSpace);
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

function removeAllRows() { //resets memory image to have nothing inserted
    $("#memoryTable").empty();
}