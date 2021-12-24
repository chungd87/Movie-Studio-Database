//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340


//STUNTPERSON FUNCTIONS ----------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

//Delete Stuntperson

//Function called from Delete button from view_stuntpersons. 'value' assigned from button based on stuntpersonID.
function deleteStuntperson(value) {
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.id = value;

    //Send request to /delete-stuntperson with 'value' in reqInfo.
    request.open("POST", "/delete-stuntperson", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("succ");
            window.location.reload();
            //Stuntperson deleted based on stuntpersonID.
        }
        else {
            console.log("err");
        }
    })
    request.send(JSON.stringify(reqInfo));
}

//Add stuntperson

//Assign constants to appropriate elements.
const stuntpersonFirstName = document.getElementById("stuntpersonFirstName");
const stuntpersonLastName = document.getElementById("stuntpersonLastName");
const stuntpersonSalary = document.getElementById("stuntpersonSalary");
const stuntpersonAvailableYes = document.getElementById("stuntpersonAvailableYes");
const stuntpersonAvailableNo = document.getElementById("stuntpersonAvailableNo");
const addstuntpersonButton = document.getElementById("addStuntperson");

//Event listener to addstuntpersonButton.
addstuntpersonButton.addEventListener("click", function (event) {
    event.preventDefault();

    //Constraints to fill in all fields.
    if (stuntpersonFirstName.value == "" || stuntpersonLastName.value == "" || stuntpersonSalary.value == "") {
        alert("All fields are required, please fill in all fields.")
        return;
    }

    if (stuntpersonSalary.value < 0) {
        alert("Stuntperson's salary can't be below 0!");
        return;
    }

    if (stuntpersonSalary.value > 200000) {
        alert("Stuntperson's salary can't be above 100,000!");
        return;
    }

    //Set up request with stuntperson's first name, last name, and salary.
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.stuntpersonFirstName = stuntpersonFirstName.value || null;
    reqInfo.stuntpersonLastName = stuntpersonLastName.value || null;
    reqInfo.stuntpersonSalary = stuntpersonSalary.value || null;
    if (stuntpersonAvailableYes.checked == true) {
        reqInfo.stuntpersonAvailable = 1
    }
    if (stuntpersonAvailableNo.checked == true) {
        reqInfo.stuntpersonAvailable = 0
    }

    //Send request to //insert-stuntperson.
    request.open("POST", "/insert-stuntperson", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            alert("Successfully Added!")
            stuntpersonFirstName.value = "";
            stuntpersonLastName.value = "";
            stuntpersonSalary.Value = "";
            window.location.reload();
            //Stuntperson added to database.
        }
        else {
            alert(request.statusText);
        }
    });
    request.send(JSON.stringify(reqInfo));

})

//Update Stuntperson

////Function called from popup after clicking Edit button in view_stuntpersons.
////Removes the added update button which gets added from when function openEditStuntperson was clicked.
////Closes popup div for edit/update.
function closeEditStuntperson() {
    const popupEditStuntperson = document.getElementById("popupEditStuntperson");
    const editFieldStuntperson = document.getElementById("edit_stuntperson_field");
    popupEditStuntperson.style.display = "none";
    editFieldStuntperson.removeChild(editFieldStuntperson.lastChild);
}

////Function called from Edit button from view_stuntpersons. 'value' assigned from button based on stuntpersonID.
function openEditStuntperson(value, fname, lname, salary, avail) {

    document.getElementById("stuntpersonFirstNameEditInput").value = fname;
    document.getElementById("stuntpersonLastNameEditInput").value = lname;
    document.getElementById("stuntpersonSalaryEditInput").value = salary;

    const stuntpersonAvailableEditInputYes = document.getElementById("stuntpersonAvailableEditInputYes");
    const stuntpersonAvailableEditInputNo = document.getElementById("stuntpersonAvailableEditInputNo");

    if (avail == 1) {
        stuntpersonAvailableEditInputYes.checked = true;
    }
    if (avail == 0) {
        stuntpersonAvailableEditInputNo.checked = true;
    }

    //Shows and adds update button to the popup div menu.
    const popupEditStuntperson = document.getElementById("popupEditStuntperson");
    popupEditStuntperson.style.display = "block";
    const editFieldStuntperson = document.getElementById("edit_stuntperson_field");
    var updateButtonstuntperson = document.createElement("button");
    updateButtonstuntperson.value
    updateButtonstuntperson.textContent = "Update Stuntperson " + value;
    editFieldStuntperson.appendChild(updateButtonstuntperson);

    //Add functionality to the update button.
    updateButtonstuntperson.addEventListener("click", function (event) {

        const stuntpersonFirstNameEditInput = document.getElementById("stuntpersonFirstNameEditInput");
        const stuntpersonLastNameEditInput = document.getElementById("stuntpersonLastNameEditInput");
        const stuntpersonSalaryEditInput = document.getElementById("stuntpersonSalaryEditInput");

        event.preventDefault();

        //Constraints to fill in all fields.
        if (stuntpersonFirstNameEditInput.value == "" || stuntpersonLastNameEditInput.value == "" || stuntpersonSalaryEditInput.value == "") {
            alert("All fields are required, please fill in all fields.")
            return;
        }

        if (stuntpersonSalaryEditInput.value < 0) {
            alert("Stuntperson's salary can't be below 0!");
            return;
        }

        if (stuntpersonSalaryEditInput.value > 200000) {
            alert("Stuntperson's salary can't be above 100,000!");
            return;
        }

        var request = new XMLHttpRequest();
        var reqInfo = {};

        //Set up request with stuntperson's new first name, last name, salary, and availability.
        reqInfo.stuntpersonID = value;
        reqInfo.stuntpersonFirstNameEdit = stuntpersonFirstNameEditInput.value || null;
        reqInfo.stuntpersonLastNameEdit = stuntpersonLastNameEditInput.value || null;
        reqInfo.stuntpersonSalaryEdit = stuntpersonSalaryEditInput.value || null;

        if (stuntpersonAvailableEditInputYes.checked == true) {
            reqInfo.stuntpersonAvailableEdit = 1
        }
        if (stuntpersonAvailableEditInputNo.checked == true) {
            reqInfo.stuntpersonAvailableEdit = 0
        }

        //Send request to /update-stuntperson.
        request.open("POST", "/update-stuntperson", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.addEventListener("load", function () {
            if (request.status >= 200 && request.status < 400) {
                alert("Successfully Updated!")
                window.location.reload();
                //Actor updated in database.
            }
            else {
                alert("Error, try again." + request.statusText);
            }
        });
        request.send(JSON.stringify(reqInfo));
    })

}
